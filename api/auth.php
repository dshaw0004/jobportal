<?php
header('Content-Type: application/json');
include_once('../config.php');
session_start();

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
    // Check current session
    if (isset($_SESSION['id']) && $_SESSION['type'] === 'jobseeker') {
        $id = $_SESSION['id'];
        $q = "SELECT login.log_id, login.email, login.usertype, jobseeker.* 
              FROM login 
              JOIN jobseeker ON login.log_id = jobseeker.log_id 
              WHERE login.log_id = $id";
        $result = mysqli_query($db1, $q);
        if ($row = mysqli_fetch_assoc($result)) {
            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $row['log_id'],
                    "email" => $row['email'],
                    "usertype" => $row['usertype'],
                    "name" => $row['name'],
                    "phone" => $row['phone'],
                    "location" => $row['location'],
                    "experience" => $row['experience'],
                    "skills" => $row['skills'],
                    "basic_edu" => $row['basic_edu'],
                    "master_edu" => $row['master_edu'],
                    "other_qual" => $row['other_qual'],
                    "photo" => $row['photo'],
                    "resume" => $row['Resume']
                ]
            ]);
            exit;
        }
    } elseif (isset($_SESSION['elogid']) && $_SESSION['type'] === 'employer') {
        $id = $_SESSION['elogid'];
        $q = "SELECT login.log_id, login.email, login.usertype, login.status, employer.* 
              FROM login 
              JOIN employer ON login.log_id = employer.log_id 
              WHERE login.log_id = $id";
        $result = mysqli_query($db1, $q);
        if ($row = mysqli_fetch_assoc($result)) {
            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $row['log_id'],
                    "email" => $row['email'],
                    "usertype" => $row['usertype'],
                    "status" => $row['status'],
                    "eid" => $row['eid'],
                    "ename" => $row['ename'],
                    "phone" => $row['phone'],
                    "location" => $row['location'],
                    "etype" => $row['etype'],
                    "address" => $row['address'],
                    "pincode" => $row['pincode'],
                    "executive" => $row['executive'],
                    "industry" => $row['industry'],
                    "profile" => $row['profile'],
                    "logo" => $row['logo']
                ]
            ]);
            exit;
        }
    }
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = isset($input['action']) ? $input['action'] : '';

    if ($action === 'login') {
        $email = mysqli_real_escape_string($db1, $input['email']);
        $password = $input['password'];
        
        $query = mysqli_query($db1, "SELECT * FROM login WHERE email = '$email'");
        $result = mysqli_fetch_array($query, MYSQLI_ASSOC);
        
        if ($result && password_verify($password, $result['password'])) {
            if ($result['usertype'] === 'jobseeker') {
                $_SESSION["id"] = $result['log_id'];
                $_SESSION["type"] = $result['usertype'];
                
                // Fetch jobseeker details
                $q_js = mysqli_query($db1, "SELECT user_id, name FROM jobseeker WHERE log_id = " . $result['log_id']);
                $js_row = mysqli_fetch_assoc($q_js);
                $_SESSION['jsname'] = $js_row['name'];
                $_SESSION['jsid'] = $js_row['user_id'];
                
                echo json_encode([
                    "success" => true,
                    "message" => "Logged in successfully",
                    "user" => [
                        "id" => $result['log_id'],
                        "email" => $result['email'],
                        "usertype" => $result['usertype'],
                        "name" => $js_row['name']
                    ]
                ]);
            } elseif ($result['usertype'] === 'employer') {
                $_SESSION["elogid"] = $result['log_id'];
                $_SESSION["type"] = $result['usertype'];
                $_SESSION["status"] = $result['status'];
                
                // Fetch employer details
                $q_emp = mysqli_query($db1, "SELECT eid, ename FROM employer WHERE log_id = " . $result['log_id']);
                $emp_row = mysqli_fetch_assoc($q_emp);
                $_SESSION['name'] = $emp_row['ename'];
                $_SESSION['eid'] = $emp_row['eid'];
                
                echo json_encode([
                    "success" => true,
                    "message" => "Logged in successfully",
                    "user" => [
                        "id" => $result['log_id'],
                        "email" => $result['email'],
                        "usertype" => $result['usertype'],
                        "status" => $result['status'],
                        "ename" => $emp_row['ename'],
                        "eid" => $emp_row['eid']
                    ]
                ]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid email or password"]);
        }
        exit;
    }

    if ($action === 'logout') {
        session_unset();
        session_destroy();
        echo json_encode(["success" => true, "message" => "Logged out successfully"]);
        exit;
    }

    if ($action === 'register_seeker') {
        $email = mysqli_real_escape_string($db1, $input['email']);
        $password = $input['password'];
        $hash = password_hash($password, PASSWORD_DEFAULT);
        
        mysqli_select_db($db1, "jobportal");

        // Check if email already exists
        $check = mysqli_query($db1, "SELECT log_id FROM login WHERE email = '$email'");
        if (mysqli_num_rows($check) > 0) {
            echo json_encode(["success" => false, "message" => "Email already exists"]);
            exit;
        }

        $query_login = "INSERT INTO login (email, password, usertype, status) VALUES ('$email', '$hash', 'jobseeker', 1)";
        if (mysqli_query($db1, $query_login)) {
            $log_id = mysqli_insert_id($db1);
            $query_seeker = "INSERT INTO jobseeker (log_id, name, onboarding_step) VALUES ($log_id, '', 0)";
            if (mysqli_query($db1, $query_seeker)) {
                echo json_encode(["success" => true, "message" => "Registered successfully. You can now login."]);
            } else {
                mysqli_query($db1, "DELETE FROM login WHERE log_id = $log_id");
                echo json_encode(["success" => false, "message" => "Failed to create profile: " . mysqli_error($db1)]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Failed to create login credentials"]);
        }
        exit;
    }

    if ($action === 'update_password') {
        $log_id = isset($_SESSION['id']) ? $_SESSION['id'] : (isset($_SESSION['elogid']) ? $_SESSION['elogid'] : null);
        if (!$log_id) {
            echo json_encode(["success" => false, "message" => "Not authenticated"]);
            exit;
        }

        $old_password = $input['old_password'];
        $new_password = $input['new_password'];

        $query = mysqli_query($db1, "SELECT * FROM login WHERE log_id = $log_id");
        $result = mysqli_fetch_array($query, MYSQLI_ASSOC);

        if ($result && password_verify($old_password, $result['password'])) {
            $new_hash = password_hash($new_password, PASSWORD_DEFAULT);
            $update_query = "UPDATE login SET password = '$new_hash' WHERE log_id = $log_id";
            if (mysqli_query($db1, $update_query)) {
                echo json_encode(["success" => true, "message" => "Password updated successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to update password"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid old password"]);
        }
        exit;
    }

    if ($action === 'delete_account') {
        $log_id = isset($_SESSION['id']) ? $_SESSION['id'] : (isset($_SESSION['elogid']) ? $_SESSION['elogid'] : null);
        if (!$log_id) {
            echo json_encode(["success" => false, "message" => "Not authenticated"]);
            exit;
        }

        $password = $input['password'];
        $query = mysqli_query($db1, "SELECT * FROM login WHERE log_id = $log_id");
        $result = mysqli_fetch_array($query, MYSQLI_ASSOC);

        if ($result && password_verify($password, $result['password'])) {
            $delete_query = "DELETE FROM login WHERE log_id = $log_id";
            if (mysqli_query($db1, $delete_query)) {
                session_unset();
                session_destroy();
                echo json_encode(["success" => true, "message" => "Account deleted successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to delete account"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Invalid password"]);
        }
        exit;
    }

    if ($action === 'register_employer') {
        $email = mysqli_real_escape_string($db1, $input['email']);
        $password = $input['password'];
        $hash = password_hash($password, PASSWORD_DEFAULT);
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
        
        $location = resolveLocation($db2, $countryId, $stateId, $cityId);
        mysqli_select_db($db1, "jobportal");

        // Check if email already exists
        $check = mysqli_query($db1, "SELECT log_id FROM login WHERE email = '$email'");
        if (mysqli_num_rows($check) > 0) {
            echo json_encode(["success" => false, "message" => "Email already exists"]);
            exit;
        }

        $query_login = "INSERT INTO login (email, password, usertype, status) VALUES ('$email', '$hash', 'employer', 0)";
        if (mysqli_query($db1, $query_login)) {
            $log_id = mysqli_insert_id($db1);
            $query_emp = "INSERT INTO employer (log_id, ename, phone, location, etype, address, pincode, executive, industry, profile) 
                          VALUES ($log_id, '$name', '$phone', '$location', '$type', '$address', '$pincode', '$executive', '$industry', '$profile')";
            if (mysqli_query($db1, $query_emp)) {
                echo json_encode(["success" => true, "message" => "Registered successfully. Pending admin activation."]);
            } else {
                mysqli_query($db1, "DELETE FROM login WHERE log_id = $log_id");
                echo json_encode(["success" => false, "message" => "Failed to create employer profile: " . mysqli_error($db1)]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Failed to create login credentials"]);
        }
        exit;
    }
}
?>
