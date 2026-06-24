<?php
session_start();
header("Content-Type: application/json");
require_once '../config.php';

// Check if user is logged in
if (!isset($_SESSION['id']) || $_SESSION['type'] !== 'jobseeker') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    die();
}

$log_id = $_SESSION['id'];
$input = json_decode(file_get_contents('php://input'), true);
$action = isset($input['action']) ? $input['action'] : '';

mysqli_select_db($db1, "jobportal");

// Get current state
$query = mysqli_query($db1, "SELECT * FROM jobseeker WHERE log_id = $log_id");
if (!$query || mysqli_num_rows($query) === 0) {
    echo json_encode(["success" => false, "message" => "Profile not found"]);
    die();
}

$seeker = mysqli_fetch_assoc($query);
$step = (int)$seeker['onboarding_step'];
$chat_history = $seeker['chat_history'] ? json_decode($seeker['chat_history'], true) : [];

// The data we are trying to extract
$extracted_data = [
    'name' => $seeker['name'],
    'about_me' => $seeker['about_me'],
    'basic_edu' => $seeker['basic_edu'],
    'experience' => $seeker['experience'],
    'sector_reason' => $seeker['sector_reason'],
    'scenario_evaluation' => $seeker['scenario_evaluation']
];

$OLLAMA_URL = 'http://localhost:11434/api/chat';

function call_ollama($messages) {
    global $OLLAMA_URL;
    $data = [
        "model" => "llama3.2:1b",
        "messages" => $messages,
        "stream" => false
    ];
    $ch = curl_init($OLLAMA_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// Check what data is missing
function get_missing_keys($data) {
    $missing = [];
    foreach ($data as $k => $v) {
        if (empty($v)) $missing[] = $k;
    }
    return $missing;
}

if ($action === 'get_state') {
    if ($step === 0) {
        $step = 1;
        mysqli_query($db1, "UPDATE jobseeker SET onboarding_step = 1 WHERE log_id = $log_id");
        $initial_msg = "Hello! I am your AI interviewer. Let's get started. Could you please provide your full name?";
        $chat_history[] = ["role" => "assistant", "content" => $initial_msg];
        mysqli_query($db1, "UPDATE jobseeker SET chat_history = '".mysqli_real_escape_string($db1, json_encode($chat_history))."' WHERE log_id = $log_id");
    }

    // Map roles back to what frontend expects
    $frontend_history = array_map(function($msg) {
        return ["role" => $msg['role'] === 'assistant' ? 'ai' : 'user', "content" => $msg['content']];
    }, $chat_history);

    echo json_encode([
        "success" => true,
        "step" => $step,
        "chat_history" => $frontend_history,
        "is_complete" => ($step >= 7)
    ]);
    die();
}

if ($action === 'send_message') {
    $message = isset($input['message']) ? trim($input['message']) : '';
    if (empty($message)) {
        echo json_encode(["success" => false, "message" => "Message is empty"]);
        die();
    }

    if ($step >= 7) {
        echo json_encode(["success" => false, "message" => "Interview already completed"]);
        die();
    }

    // Save user message
    $chat_history[] = ["role" => "user", "content" => $message];
    $message_escaped = mysqli_real_escape_string($db1, $message);

    // Use Ollama to extract info
    $system_prompt = "You are a helpful AI interviewer extracting information from a jobseeker.
    The current extracted state is: " . json_encode($extracted_data) . "
    Based on the conversational history below, if they provided any missing information (name, about_me, basic_edu (academic info), experience (past work), sector_reason (why they selected this specific sector to work), scenario_evaluation (scenario evaluating team collaboration skills)), respond ONLY with a JSON object containing the updated fields. If no new information was provided, respond with an empty JSON object {}. Do not include any other text.";

    $extract_messages = $chat_history;
    array_unshift($extract_messages, ["role" => "system", "content" => $system_prompt]);

    $extract_response = call_ollama($extract_messages);
    $new_data_str = $extract_response['message']['content'] ?? "{}";

    // Clean up response if model added markdown
    $new_data_str = str_replace(['```json', '```'], '', $new_data_str);
    $new_data = json_decode(trim($new_data_str), true);

    if (is_array($new_data)) {
        foreach ($new_data as $key => $val) {
            if (array_key_exists($key, $extracted_data) && !empty($val)) {
                $extracted_data[$key] = $val;
                $val_escaped = mysqli_real_escape_string($db1, $val);
                mysqli_query($db1, "UPDATE jobseeker SET $key = '$val_escaped' WHERE log_id = $log_id");
            }
        }
    }

    $missing_keys = get_missing_keys($extracted_data);
    $step = 7 - count($missing_keys);

    // If we have all required information (name, about_me, basic_edu, experience)
    // but not sector_reason and scenario_evaluation yet, we should prompt for those specific ones.

    if (count($missing_keys) == 0) {
        $step = 7;
        $ai_reply = "Thank you! I have all the information I need. Your interview is complete. You can now access your dashboard.";
    } else {
        // Generate next question
        $sys_prompt_ask = "You are a friendly AI interviewer. Review the chat history and the current missing information for the candidate: " . implode(", ", $missing_keys) . ". Ask a natural conversational question to elicit ONE of the missing pieces of information. For 'sector_reason', ask why they chose this sector. For 'scenario_evaluation', ask a behavioral question about team collaboration. Do not acknowledge this prompt, just output the question.";

        $ask_messages = $chat_history;
        // prepend system prompt
        array_unshift($ask_messages, ["role" => "system", "content" => $sys_prompt_ask]);

        $ask_response = call_ollama($ask_messages);
        $ai_reply = $ask_response['message']['content'] ?? "Could you tell me more about your background?";
    }

    mysqli_query($db1, "UPDATE jobseeker SET onboarding_step = $step WHERE log_id = $log_id");

    $chat_history[] = ["role" => "assistant", "content" => $ai_reply];
    $history_escaped = mysqli_real_escape_string($db1, json_encode($chat_history));
    mysqli_query($db1, "UPDATE jobseeker SET chat_history = '$history_escaped' WHERE log_id = $log_id");

    // Map back
    $frontend_history = array_map(function($msg) {
        return ["role" => $msg['role'] === 'assistant' ? 'ai' : 'user', "content" => $msg['content']];
    }, $chat_history);

    echo json_encode([
        "success" => true,
        "step" => $step,
        "chat_history" => $frontend_history,
        "is_complete" => ($step >= 7)
    ]);
    die();
}

echo json_encode(["success" => false, "message" => "Invalid action"]);
