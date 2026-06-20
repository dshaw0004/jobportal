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
    $action = isset($_GET['action']) ? $_GET['action'] : '';

    if ($action === 'recent') {
        $query = "SELECT jobs.*, employer.ename, employer.logo 
                  FROM jobs 
                  JOIN employer ON jobs.eid = employer.eid 
                  ORDER BY jobs.jobid DESC LIMIT 20";
        $result = mysqli_query($db1, $query);
        $jobs = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $jobs[] = $row;
        }
        echo json_encode(["success" => true, "jobs" => $jobs]);
        exit;
    }

    if ($action === 'list') {
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
        $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

        $keyword = isset($_GET['keyword']) ? mysqli_real_escape_string($db1, $_GET['keyword']) : '';
        $company = isset($_GET['com']) ? mysqli_real_escape_string($db1, $_GET['com']) : '';
        $location = isset($_GET['loc']) ? mysqli_real_escape_string($db1, $_GET['loc']) : '';
        $desig = isset($_GET['desig']) ? mysqli_real_escape_string($db1, $_GET['desig']) : '';
        $skills = isset($_GET['skills']) ? mysqli_real_escape_string($db1, $_GET['skills']) : '';
        $industry = isset($_GET['industry']) ? mysqli_real_escape_string($db1, $_GET['industry']) : '';

        $whereClauses = [];

        if ($keyword !== '') {
            $whereClauses[] = "(jobs.title LIKE '%$keyword%' OR employer.ename LIKE '%$keyword%' OR jobs.profile LIKE '%$keyword%')";
        }
        if ($company !== '') {
            $whereClauses[] = "employer.ename LIKE '%$company%'";
        }
        if ($location !== '') {
            $whereClauses[] = "jobs.location LIKE '%$location%'";
        }
        if ($desig !== '') {
            $whereClauses[] = "jobs.title LIKE '%$desig%'";
        }
        if ($skills !== '') {
            $whereClauses[] = "jobs.profile LIKE '%$skills%'";
        }
        if ($industry !== '') {
            $whereClauses[] = "jobs.industry LIKE '%$industry%'";
        }

        $whereSQL = "";
        if (count($whereClauses) > 0) {
            $whereSQL = " WHERE " . implode(" AND ", $whereClauses);
        }

        $countQuery = "SELECT COUNT(*) as total_count FROM jobs JOIN employer ON jobs.eid = employer.eid" . $whereSQL;
        $countResult = mysqli_query($db1, $countQuery);
        $totalCount = 0;
        if ($countRow = mysqli_fetch_assoc($countResult)) {
            $totalCount = intval($countRow['total_count']);
        }

        $query = "SELECT jobs.*, employer.ename, employer.logo
                  FROM jobs
                  JOIN employer ON jobs.eid = employer.eid"
                  . $whereSQL
                  . " ORDER BY jobs.jobid DESC LIMIT $offset, $limit";

        $result = mysqli_query($db1, $query);
        $jobs = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $jobs[] = $row;
        }

        echo json_encode(["success" => true, "jobs" => $jobs, "total_count" => $totalCount]);
        exit;
    }

    if ($action === 'search') {
        $keyword = isset($_GET['keyword']) ? mysqli_real_escape_string($db1, $_GET['keyword']) : '';
        
        // Advanced search parameters
        $company = isset($_GET['com']) ? mysqli_real_escape_string($db1, $_GET['com']) : '';
        $location = isset($_GET['loc']) ? mysqli_real_escape_string($db1, $_GET['loc']) : '';
        $desig = isset($_GET['desig']) ? mysqli_real_escape_string($db1, $_GET['desig']) : '';
        $skills = isset($_GET['skills']) ? mysqli_real_escape_string($db1, $_GET['skills']) : '';
        $industry = isset($_GET['industry']) ? mysqli_real_escape_string($db1, $_GET['industry']) : '';

        if ($keyword !== '') {
            $query = "SELECT jobs.*, employer.ename, employer.logo 
                      FROM jobs 
                      JOIN employer ON jobs.eid = employer.eid 
                      WHERE jobs.title LIKE '%$keyword%' 
                         OR employer.ename LIKE '%$keyword%' 
                         OR jobs.profile LIKE '%$keyword%'";
        } else {
            // Advanced Search
            $clauses = [];
            if ($company !== '') {
                $clauses[] = "employer.ename LIKE '%$company%'";
            }
            if ($location !== '') {
                $clauses[] = "jobs.location LIKE '%$location%'";
            }
            if ($desig !== '') {
                $clauses[] = "jobs.title LIKE '%$desig%'";
            }
            if ($skills !== '') {
                $clauses[] = "jobs.profile LIKE '%$skills%'";
            }
            if ($industry !== '') {
                $clauses[] = "jobs.industry LIKE '%$industry%'";
            }

            if (count($clauses) > 0) {
                $query = "SELECT jobs.*, employer.ename, employer.logo 
                          FROM jobs 
                          JOIN employer ON jobs.eid = employer.eid 
                          WHERE " . implode(" OR ", $clauses);
            } else {
                $query = "SELECT jobs.*, employer.ename, employer.logo 
                          FROM jobs 
                          JOIN employer ON jobs.eid = employer.eid";
            }
        }

        $result = mysqli_query($db1, $query);
        $jobs = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $jobs[] = $row;
        }
        echo json_encode(["success" => true, "jobs" => $jobs]);
        exit;
    }

    if ($action === 'detail') {
        $jid = isset($_GET['jid']) ? intval($_GET['jid']) : 0;
        if ($jid === 0) {
            echo json_encode(["success" => false, "message" => "Job ID is required"]);
            exit;
        }

        $query = "SELECT jobs.*, employer.ename, employer.logo, employer.profile as employer_profile, employer.address as employer_address, employer.location as employer_location, employer.industry as employer_industry, employer.etype as employer_type
                  FROM jobs 
                  JOIN employer ON jobs.eid = employer.eid 
                  WHERE jobs.jobid = $jid";
        $result = mysqli_query($db1, $query);
        if ($row = mysqli_fetch_assoc($result)) {
            // Also check if the current user has already applied for this job
            $applied = false;
            if (isset($_SESSION['jsid'])) {
                $jsid = $_SESSION['jsid'];
                $check = mysqli_query($db1, "SELECT apply_id FROM application WHERE job_id = $jid AND user_id = $jsid");
                if (mysqli_num_rows($check) > 0) {
                    $applied = true;
                }
            }
            $row['has_applied'] = $applied;
            echo json_encode(["success" => true, "job" => $row]);
        } else {
            echo json_encode(["success" => false, "message" => "Job not found"]);
        }
        exit;
    }

    if ($action === 'manage') {
        // Employer view of their own jobs
        if (!isset($_SESSION['eid'])) {
            echo json_encode(["success" => false, "message" => "Unauthorized"]);
            exit;
        }
        $eid = $_SESSION['eid'];
        $query = "SELECT * FROM jobs WHERE eid = $eid ORDER BY jobid DESC";
        $result = mysqli_query($db1, $query);
        $jobs = [];
        while ($row = mysqli_fetch_assoc($result)) {
            // Count applicants for each job
            $jid = $row['jobid'];
            $count_q = mysqli_query($db1, "SELECT COUNT(*) as count FROM application WHERE job_id = $jid");
            $count_row = mysqli_fetch_assoc($count_q);
            $row['applicant_count'] = $count_row['count'];
            $jobs[] = $row;
        }
        echo json_encode(["success" => true, "jobs" => $jobs]);
        exit;
    }
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = isset($input['action']) ? $input['action'] : '';

    if ($action === 'post') {
        if (!isset($_SESSION['eid'])) {
            echo json_encode(["success" => false, "message" => "Unauthorized"]);
            exit;
        }
        $eid = $_SESSION['eid'];
        $title = mysqli_real_escape_string($db1, $input['title']);
        $vacno = intval($input['vacno']);
        $desc = mysqli_real_escape_string($db1, $input['jobdesc']);
        $exp = mysqli_real_escape_string($db1, $input['experience']);
        $pay = mysqli_real_escape_string($db1, $input['basicpay']);
        $fnarea = mysqli_real_escape_string($db1, $input['fnarea']);
        $indtype = mysqli_real_escape_string($db1, $input['industry']);
        $ug = mysqli_real_escape_string($db1, $input['ugqual']);
        $pg = mysqli_real_escape_string($db1, $input['pgqual']);
        $profile = mysqli_real_escape_string($db1, $input['jprofile']);
        $date = date('d-m-y');
        
        $countryId = isset($input['country']) ? $input['country'] : '';
        $stateId = isset($input['state']) ? $input['state'] : '';
        $cityId = isset($input['city']) ? $input['city'] : '';
        
        $location = resolveLocation($db2, $countryId, $stateId, $cityId);
        mysqli_select_db($db1, "jobportal");

        $query = "INSERT INTO jobs (eid, title, jobdesc, vacno, experience, basicpay, fnarea, location, industry, ugqual, pgqual, jprofile, postdate) 
                  VALUES ($eid, '$title', '$desc', $vacno, '$exp', '$pay', '$fnarea', '$location', '$indtype', '$ug', '$pg', '$profile', '$date')";
        
        if (mysqli_query($db1, $query)) {
            echo json_encode(["success" => true, "message" => "Job posted successfully!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to post job: " . mysqli_error($db1)]);
        }
        exit;
    }

    if ($action === 'delete') {
        if (!isset($_SESSION['eid'])) {
            echo json_encode(["success" => false, "message" => "Unauthorized"]);
            exit;
        }
        $jid = intval($input['jid']);
        $eid = $_SESSION['eid'];

        // Verify the job belongs to this employer
        $verify = mysqli_query($db1, "SELECT jobid FROM jobs WHERE jobid = $jid AND eid = $eid");
        if (mysqli_num_rows($verify) === 0) {
            echo json_encode(["success" => false, "message" => "You are not authorized to delete this job"]);
            exit;
        }

        $query = "DELETE FROM jobs WHERE jobid = $jid";
        if (mysqli_query($db1, $query)) {
            echo json_encode(["success" => true, "message" => "Job deleted successfully!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to delete job: " . mysqli_error($db1)]);
        }
        exit;
    }
}
?>
