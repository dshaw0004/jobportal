<?php
header('Content-Type: application/json');
include_once('../config.php');
session_start();

if (!isset($_SESSION['eid'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$eid = $_SESSION['eid'];
$log_id = $_SESSION['elogid'];
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
        $q = "SELECT login.email, login.status as login_status, employer.* 
              FROM login 
              JOIN employer ON login.log_id = employer.log_id 
              WHERE employer.eid = $eid";
        $result = mysqli_query($db1, $q);
        if ($row = mysqli_fetch_assoc($result)) {
            echo json_encode(["success" => true, "profile" => $row]);
        } else {
            echo json_encode(["success" => false, "message" => "Profile not found"]);
        }
        exit;
    }

    if ($action === 'applicants') {
        $jid = isset($_GET['jid']) ? intval($_GET['jid']) : 0;
        
        $job_filter = "";
        if ($jid > 0) {
            $job_filter = "AND application.job_id = $jid";
        }

        // Fetch applications for this employer's jobs
        $query = "SELECT application.apply_id, application.status as app_status, application.date_applied, 
                         jobs.jobid, jobs.title as job_title, 
                         jobseeker.user_id, jobseeker.name as js_name, jobseeker.phone as js_phone, 
                         jobseeker.location as js_location, jobseeker.experience as js_experience, 
                         jobseeker.skills as js_skills, jobseeker.basic_edu, jobseeker.master_edu, 
                         jobseeker.other_qual, jobseeker.Resume as js_resume, jobseeker.photo as js_photo
                  FROM application 
                  JOIN jobs ON application.job_id = jobs.jobid 
                  JOIN jobseeker ON application.user_id = jobseeker.user_id 
                  WHERE application.emp_id = $eid $job_filter 
                  ORDER BY application.apply_id DESC";
                  
        $result = mysqli_query($db1, $query);
        $applicants = [];
        while ($row = mysqli_fetch_assoc($result)) {
            // Check selection status
            $js_id = $row['user_id'];
            $job_id = $row['jobid'];
            $qsel = mysqli_query($db1, "SELECT sel_id, status FROM selection WHERE job_id = $job_id AND user_id = $js_id");
            if (mysqli_num_rows($qsel) > 0) {
                $row['selection_status'] = "Selected";
            } elseif ($row['app_status'] == 2) {
                $row['selection_status'] = "Rejected";
            } else {
                $row['selection_status'] = "Pending";
            }
            $applicants[] = $row;
        }
        echo json_encode(["success" => true, "applicants" => $applicants]);
        exit;
    }
    
    if ($action === 'candidate_detail') {
        $jsid = isset($_GET['jsid']) ? intval($_GET['jsid']) : 0;
        if ($jsid === 0) {
            echo json_encode(["success" => false, "message" => "Candidate ID required"]);
            exit;
        }
        
        // Fetch public details of a candidate
        $q = mysqli_query($db1, "SELECT user_id, name, phone, location, experience, skills, basic_edu, master_edu, other_qual, Resume, photo FROM jobseeker WHERE user_id = $jsid");
        if ($row = mysqli_fetch_assoc($q)) {
            echo json_encode(["success" => true, "candidate" => $row]);
        } else {
            echo json_encode(["success" => false, "message" => "Candidate not found"]);
        }
        exit;
    }
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = isset($input['action']) ? $input['action'] : '';

    if ($action === 'update') {
        $name = mysqli_real_escape_string($db1, $input['ename']);
        $type = mysqli_real_escape_string($db1, $input['comtype']);
        $industry = mysqli_real_escape_string($db1, $input['indtype']);
        $address = mysqli_real_escape_string($db1, $input['address']);
        $pincode = mysqli_real_escape_string($db1, $input['pincode']);
        $executive = mysqli_real_escape_string($db1, $input['executive']);
        $phone = mysqli_real_escape_string($db1, $input['phone']);
        $profile = mysqli_real_escape_string($db1, $input['profile']);
        
        $countryId = isset($input['country']) ? $input['country'] : '';
        $stateId = isset($input['state']) ? $input['state'] : '';
        $cityId = isset($input['city']) ? $input['city'] : '';

        if ($countryId && $stateId && $cityId) {
            $location = resolveLocation($db2, $countryId, $stateId, $cityId);
            mysqli_select_db($db1, "jobportal");
            $loc_clause = ", location = '$location'";
        } else {
            $loc_clause = "";
        }

        $query = "UPDATE employer SET 
                    ename = '$name', 
                    etype = '$type', 
                    industry = '$industry', 
                    address = '$address', 
                    pincode = '$pincode', 
                    executive = '$executive', 
                    phone = '$phone', 
                    profile = '$profile'
                    $loc_clause
                  WHERE eid = $eid";
                  
        if (mysqli_query($db1, $query)) {
            $_SESSION['name'] = $name; // Sync session variable
            echo json_encode(["success" => true, "message" => "Company profile updated successfully!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update profile: " . mysqli_error($db1)]);
        }
        exit;
    }

    if ($action === 'select') {
        $user_id = intval($input['user_id']);
        $job_id = intval($input['job_id']);
        $date = date('d-m-y');

        // Check if already selected
        $q = mysqli_query($db1, "SELECT sel_id FROM selection WHERE job_id = $job_id AND user_id = $user_id");
        if (mysqli_num_rows($q) > 0) {
            echo json_encode(["success" => false, "message" => "This candidate is already selected for the job"]);
            exit;
        }

        // Insert into selection and make sure application status is cleared/reset from rejection if any
        $q2 = mysqli_query($db1, "INSERT INTO selection (user_id, emp_id, job_id, date, status) VALUES ($user_id, $eid, $job_id, '$date', 1)");
        if ($q2) {
            // Re-update application status to NULL (not rejected) or 1 (approved/selected)
            mysqli_query($db1, "UPDATE application SET status = 1 WHERE job_id = $job_id AND user_id = $user_id");
            echo json_encode(["success" => true, "message" => "Candidate successfully selected for the job"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to select candidate: " . mysqli_error($db1)]);
        }
        exit;
    }

    if ($action === 'reject') {
        $user_id = intval($input['user_id']);
        $job_id = intval($input['job_id']);

        $q = mysqli_query($db1, "SELECT apply_id, status FROM application WHERE job_id = $job_id AND user_id = $user_id");
        if (mysqli_num_rows($q) > 0) {
            $row = mysqli_fetch_assoc($q);
            if ($row['status'] == 2) {
                echo json_encode(["success" => false, "message" => "This candidate is already rejected"]);
                exit;
            }

            // Update application status to 2 (rejected)
            $q2 = mysqli_query($db1, "UPDATE application SET status = 2 WHERE job_id = $job_id AND user_id = $user_id");
            // Delete from selection if they were previously selected
            mysqli_query($db1, "DELETE FROM selection WHERE job_id = $job_id AND user_id = $user_id");
            
            if ($q2) {
                echo json_encode(["success" => true, "message" => "Candidate application rejected successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to reject candidate: " . mysqli_error($db1)]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Application not found"]);
        }
        exit;
    }
}
?>
