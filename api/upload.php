<?php
header('Content-Type: application/json');
include_once('../config.php');
session_start();

$type = isset($_GET['type']) ? $_GET['type'] : '';

if (!isset($_FILES['file'])) {
    echo json_encode(["success" => false, "message" => "No file was uploaded"]);
    exit;
}

if ($type === 'image') {
    if (!isset($_SESSION['jsid'])) {
        echo json_encode(["success" => false, "message" => "Unauthorized"]);
        exit;
    }
    
    $jsid = $_SESSION['jsid'];
    $jsname = $_SESSION['jsname'];
    
    $filename = $_FILES["file"]["name"];
    $file_ext = strtolower(substr($filename, strripos($filename, '.')));
    $filesize = $_FILES["file"]["size"];
    $allowed_file_types = array('.jpeg', '.png', '.jpg');
    
    if (!in_array($file_ext, $allowed_file_types)) {
        echo json_encode(["success" => false, "message" => "Only JPEG and PNG images are allowed."]);
        exit;
    }
    
    if ($filesize > 500000) { // Increased limit slightly for convenience
        echo json_encode(["success" => false, "message" => "The image file size is too large (max 500KB)."]);
        exit;
    }
    
    $imageInformation = getimagesize($_FILES['file']['tmp_name']);
    if (!$imageInformation) {
        echo json_encode(["success" => false, "message" => "Invalid image file."]);
        exit;
    }
    
    $imageWidth = $imageInformation[0];
    $imageHeight = $imageInformation[1];
    
    if ($imageWidth > 1200 || $imageHeight > 1200) { // Adjusted constraint for modern images
        echo json_encode(["success" => false, "message" => "Image dimensions are too large (max 1200x1200px)."]);
        exit;
    }
    
    // Create destination folder if not exists
    if (!file_exists("../uploads/images")) {
        mkdir("../uploads/images", 0777, true);
    }
    
    $newfilename = preg_replace('/[^A-Za-z0-9]/', '', $jsname) . $jsid . $file_ext;
    $target_path = "../uploads/images/" . $newfilename;
    
    if (file_exists($target_path)) {
        unlink($target_path);
    }
    
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path)) {
        mysqli_select_db($db1, "jobportal");
        $cmd = mysqli_query($db1, "UPDATE jobseeker SET photo = '$newfilename' WHERE user_id = $jsid");
        if ($cmd) {
            echo json_encode(["success" => true, "message" => "Photo uploaded successfully", "filename" => $newfilename]);
        } else {
            echo json_encode(["success" => false, "message" => "Database update failed: " . mysqli_error($db1)]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Failed to save uploaded file."]);
    }
    exit;
}

if ($type === 'logo') {
    if (!isset($_SESSION['eid'])) {
        echo json_encode(["success" => false, "message" => "Unauthorized"]);
        exit;
    }
    
    $eid = $_SESSION['eid'];
    $ename = $_SESSION['name'];
    
    $filename = $_FILES["file"]["name"];
    $file_ext = strtolower(substr($filename, strripos($filename, '.')));
    $filesize = $_FILES["file"]["size"];
    $allowed_file_types = array('.jpeg', '.png', '.jpg');
    
    if (!in_array($file_ext, $allowed_file_types)) {
        echo json_encode(["success" => false, "message" => "Only JPEG and PNG images are allowed."]);
        exit;
    }
    
    if ($filesize > 500000) {
        echo json_encode(["success" => false, "message" => "The logo file size is too large (max 500KB)."]);
        exit;
    }
    
    $imageInformation = getimagesize($_FILES['file']['tmp_name']);
    if (!$imageInformation) {
        echo json_encode(["success" => false, "message" => "Invalid image file."]);
        exit;
    }
    
    $imageWidth = $imageInformation[0];
    $imageHeight = $imageInformation[1];
    
    if ($imageWidth > 800 || $imageHeight > 800) {
        echo json_encode(["success" => false, "message" => "Logo dimensions are too large (max 800x800px)."]);
        exit;
    }
    
    if (!file_exists("../uploads/logo")) {
        mkdir("../uploads/logo", 0777, true);
    }
    
    $newfilename = preg_replace('/[^A-Za-z0-9]/', '', $ename) . $eid . $file_ext;
    $target_path = "../uploads/logo/" . $newfilename;
    
    if (file_exists($target_path)) {
        unlink($target_path);
    }
    
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path)) {
        mysqli_select_db($db1, "jobportal");
        $cmd = mysqli_query($db1, "UPDATE employer SET logo = '$newfilename' WHERE eid = $eid");
        if ($cmd) {
            echo json_encode(["success" => true, "message" => "Logo uploaded successfully", "filename" => $newfilename]);
        } else {
            echo json_encode(["success" => false, "message" => "Database update failed: " . mysqli_error($db1)]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Failed to save uploaded file."]);
    }
    exit;
}

if ($type === 'file') {
    if (!isset($_SESSION['jsid'])) {
        echo json_encode(["success" => false, "message" => "Unauthorized"]);
        exit;
    }
    
    $jsid = $_SESSION['jsid'];
    $jsname = $_SESSION['jsname'];
    
    $filename = $_FILES["file"]["name"];
    $file_ext = strtolower(substr($filename, strripos($filename, '.')));
    $filesize = $_FILES["file"]["size"];
    $allowed_file_types = array('.doc', '.docx', '.pdf');
    
    if (!in_array($file_ext, $allowed_file_types)) {
        echo json_encode(["success" => false, "message" => "Only .doc, .docx, and .pdf files are allowed."]);
        exit;
    }
    
    if ($filesize > 2000000) { // 2MB limit for resume
        echo json_encode(["success" => false, "message" => "The resume file size is too large (max 2MB)."]);
        exit;
    }
    
    if (!file_exists("../uploads/resume")) {
        mkdir("../uploads/resume", 0777, true);
    }
    
    $newfilename = preg_replace('/[^A-Za-z0-9]/', '', $jsname) . $jsid . $file_ext;
    $target_path = "../uploads/resume/" . $newfilename;
    
    if (file_exists($target_path)) {
        unlink($target_path);
    }
    
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path)) {
        mysqli_select_db($db1, "jobportal");
        $cmd = mysqli_query($db1, "UPDATE jobseeker SET Resume = '$newfilename' WHERE user_id = $jsid");
        if ($cmd) {
            echo json_encode(["success" => true, "message" => "Resume uploaded successfully", "filename" => $newfilename]);
        } else {
            echo json_encode(["success" => false, "message" => "Database update failed: " . mysqli_error($db1)]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Failed to save uploaded file."]);
    }
    exit;
}

echo json_encode(["success" => false, "message" => "Invalid upload type."]);
?>
