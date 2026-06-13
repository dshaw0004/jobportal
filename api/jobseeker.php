<?php
header('Content-Type: application/json');
include_once('../config.php');
session_start();

if (!isset($_SESSION['jsid'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$jsid = $_SESSION['jsid'];
$log_id = $_SESSION['id'];
$method = $_SERVER['REQUEST_METHOD'];

// Helper to resolve location IDs to country,state,city names
function resolveLocation($db2, $countryId, $stateId, $cityId) {
    if (!$countryId || !$stateId || !$cityId) return "";
    
    // Connect to location db
    mysqli_select_db($db2, "location");
    
    $country = "";
    $state = "";
    $city = "";
    
    $q1 = mysqli_query($db2, "SELECT name FROM countries WHERE id = " . intval($countryId));
    if ($q1 && $row = mysqli_fetch_assoc($q1)) {
        $country = $row['name'];
    }
    
    $q2 = mysqli_query($db2, "SELECT name FROM states WHERE id = " . intval($stateId));
    if ($q2 && $row = mysqli_fetch_assoc($q2)) {
        $state = $row['name'];
    }
    
    $q3 = mysqli_query($db2, "SELECT name FROM cities WHERE id = " . intval($cityId));
    if ($q3 && $row = mysqli_fetch_assoc($q3)) {
        $city = $row['name'];
    }
    
    return $country . "," . $state . "," . $city;
}

if ($method === 'GET') {
    $action = isset($_GET['action']) ? $_GET['action'] : '';

    if ($action === 'profile') {
        $q = "SELECT login.email, jobseeker.* 
              FROM login 
              JOIN jobseeker ON login.log_id = jobseeker.log_id 
              WHERE jobseeker.user_id = $jsid";
        $result = mysqli_query($db1, $q);
        if ($row = mysqli_fetch_assoc($result)) {
            echo json_encode(["success" => true, "profile" => $row]);
        } else {
            echo json_encode(["success" => false, "message" => "Profile not found"]);
        }
        exit;
    }

    if ($action === 'recommended') {
        $q_profile = mysqli_query($db1, "SELECT basic_edu, master_edu FROM jobseeker WHERE user_id = $jsid");
        $profile = mysqli_fetch_assoc($q_profile);
        $ug = mysqli_real_escape_string($db1, $profile['basic_edu']);
        $pg = mysqli_real_escape_string($db1, $profile['master_edu']);

        $q_jobs = "SELECT jobs.*, employer.ename, employer.logo 
                   FROM jobs 
                   JOIN employer ON jobs.eid = employer.eid 
                   WHERE jobs.ugqual = '$ug' OR jobs.pgqual = '$pg'
                   ORDER BY jobs.jobid DESC";
        $result = mysqli_query($db1, $q_jobs);
        $jobs = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $jobs[] = $row;
        }
        echo json_encode(["success" => true, "jobs" => $jobs]);
        exit;
    }

    if ($action === 'applied') {
        $query = "SELECT application.apply_id, application.status, application.date_applied, jobs.jobid, jobs.title, jobs.experience, jobs.basicpay, employer.ename, employer.logo 
                  FROM application 
                  JOIN jobs ON application.job_id = jobs.jobid 
                  JOIN employer ON jobs.eid = employer.eid 
                  WHERE application.user_id = $jsid 
                  ORDER BY application.apply_id DESC";
        $result = mysqli_query($db1, $query);
        $applied = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $applied[] = $row;
        }
        echo json_encode(["success" => true, "jobs" => $applied]);
        exit;
    }

    if ($action === 'selected') {
        $query = "SELECT selection.sel_id, selection.status, selection.date as date_selected, jobs.jobid, jobs.title, employer.ename, employer.logo 
                  FROM selection 
                  JOIN jobs ON selection.job_id = jobs.jobid 
                  JOIN employer ON jobs.eid = employer.eid 
                  WHERE selection.user_id = $jsid 
                  ORDER BY selection.sel_id DESC";
        $result = mysqli_query($db1, $query);
        $selected = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $selected[] = $row;
        }
        echo json_encode(["success" => true, "jobs" => $selected]);
        exit;
    }
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = isset($input['action']) ? $input['action'] : '';

    if ($action === 'update') {
        $name = mysqli_real_escape_string($db1, $input['name']);
        $phone = mysqli_real_escape_string($db1, $input['phone']);
        $experience = mysqli_real_escape_string($db1, $input['experience']);
        $skills = mysqli_real_escape_string($db1, $input['skills']);
        $ug = mysqli_real_escape_string($db1, $input['ugcourse']);
        $pg = mysqli_real_escape_string($db1, $input['pgcourse']);
        $other_qual = mysqli_real_escape_string($db1, $input['other_qual']);
        
        $countryId = isset($input['country']) ? $input['country'] : '';
        $stateId = isset($input['state']) ? $input['state'] : '';
        $cityId = isset($input['city']) ? $input['city'] : '';

        // If location dropdowns are selected, resolve names. Otherwise keep existing location
        if ($countryId && $stateId && $cityId) {
            $location = resolveLocation($db2, $countryId, $stateId, $cityId);
            mysqli_select_db($db1, "jobportal");
            $loc_clause = ", location = '$location'";
        } else {
            $loc_clause = "";
        }

        $query = "UPDATE jobseeker SET 
                    name = '$name', 
                    phone = '$phone', 
                    experience = '$experience', 
                    skills = '$skills', 
                    basic_edu = '$ug', 
                    master_edu = '$pg',
                    other_qual = '$other_qual'
                    $loc_clause
                  WHERE user_id = $jsid";
        
        if (mysqli_query($db1, $query)) {
            $_SESSION['jsname'] = $name; // Sync name in session
            echo json_encode(["success" => true, "message" => "Profile updated successfully!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update profile: " . mysqli_error($db1)]);
        }
        exit;
    }

    if ($action === 'apply') {
        $jid = intval($input['jid']);
        $date = date("d-m-y");

        // Check if already applied
        $check = mysqli_query($db1, "SELECT apply_id FROM application WHERE job_id = $jid AND user_id = $jsid");
        if (mysqli_num_rows($check) > 0) {
            echo json_encode(["success" => false, "message" => "You have already applied for this job!"]);
            exit;
        }

        // Get employer ID
        $get_emp = mysqli_query($db1, "SELECT eid FROM jobs WHERE jobid = $jid");
        if ($row = mysqli_fetch_assoc($get_emp)) {
            $eid = $row['eid'];
            $query = "INSERT INTO application (user_id, emp_id, job_id, date_applied) VALUES ($jsid, $eid, $jid, '$date')";
            if (mysqli_query($db1, $query)) {
                echo json_encode(["success" => true, "message" => "You have successfully applied for this job!"]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to apply for job: " . mysqli_error($db1)]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Job posting not found"]);
        }
        exit;
    }
}
?>
