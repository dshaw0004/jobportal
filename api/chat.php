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
    'master_edu' => $seeker['master_edu'],
    'skills' => $seeker['skills'],
    'experience' => $seeker['experience'],
    'sector_reason' => $seeker['sector_reason'],
    'scenario_evaluation' => $seeker['scenario_evaluation']
];

$OLLAMA_URL = 'http://localhost:11434/api/chat';

function call_ollama($messages, $jsonMode = false) {
    global $OLLAMA_URL;
    $data = [
        "model" => "llama3.2:1b",
        "messages" => $messages,
        "stream" => false
    ];
    if ($jsonMode) {
        $data["format"] = "json";
    }
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
    $system_prompt = "You are a data extraction bot. Your job is to extract candidate details from the conversation.
Analyze the conversation history. Based ONLY on what the user has said, extract information for the following fields:
- 'name': Candidate's full name.
- 'basic_edu': Candidate's university degree or academic qualification. Must be exactly one of: \"B.Tech/B.E.\", \"B.C.A.\", \"B.Sc.\", \"B.A.\", \"B.Com.\", \"Not Pursuing Graduation\". Map their education level to the best fit.
- 'master_edu': Candidate's postgraduate degree. Must be exactly one of: \"M.Tech\", \"M.C.A.\", \"MBA/PGDM\", \"M.Sc.\", \"CA\", \"Not Pursuing Post Graduation\". Map their postgraduate level to the best fit.
- 'skills': Candidate's technical or professional skills. E.g., \"React, Node.js, PHP\".
- 'experience': Candidate's years of experience or work history.
- 'sector_reason': Why the candidate chose this industry/sector.
- 'scenario_evaluation': Candidate's answer to the teamwork/behavioral question.

Rules:
1. Only extract a field if the candidate explicitly provided it in their messages.
2. The value MUST be a clean string. Do NOT use arrays, lists, or objects.
3. If a field was not mentioned or is not in the conversation, omit it from the JSON.
4. Do NOT output any description, preamble, or markdown. Output ONLY a valid JSON object.";

    $extract_messages = $chat_history;
    array_unshift($extract_messages, ["role" => "system", "content" => $system_prompt]);

    $extract_response = call_ollama($extract_messages, true);
    $new_data_str = $extract_response['message']['content'] ?? "{}";

    // Clean up response: locate the first '{' and the last '}' to extract raw JSON
    $start_pos = strpos($new_data_str, '{');
    $end_pos = strrpos($new_data_str, '}');
    if ($start_pos !== false && $end_pos !== false && $end_pos >= $start_pos) {
        $json_part = substr($new_data_str, $start_pos, $end_pos - $start_pos + 1);
        $new_data = json_decode(trim($json_part), true);
    } else {
        $new_data_str_cleaned = str_replace(['```json', '```'], '', $new_data_str);
        $new_data = json_decode(trim($new_data_str_cleaned), true);
    }

    if (is_array($new_data)) {
        foreach ($new_data as $key => $val) {
            if (array_key_exists($key, $extracted_data) && !empty($val)) {
                if (is_array($val)) {
                    // If it is a sequential array, implode it. Otherwise, JSON encode it.
                    if (array_keys($val) === range(0, count($val) - 1)) {
                        $val = implode(', ', $val);
                    } else {
                        $val = json_encode($val, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
                    }
                }
                $val_str = (string)$val;
                $extracted_data[$key] = $val_str;
                $val_escaped = mysqli_real_escape_string($db1, $val_str);
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
