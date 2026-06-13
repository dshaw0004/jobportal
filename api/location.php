<?php
header('Content-Type: application/json');
include_once('../config.php');

$type = isset($_GET['type']) ? $_GET['type'] : '';

try {
    mysqli_select_db($db2, "location");

    if ($type === 'getCountries') {
        $query = "SELECT id, name FROM countries ORDER BY name ASC";
        $result = mysqli_query($db2, $query);
        $countries = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $countries[] = [
                "id" => $row['id'],
                "name" => $row['name']
            ];
        }
        echo json_encode(["success" => true, "countries" => $countries]);
        exit;
    }

    if ($type === 'getStates') {
        $countryId = isset($_GET['countryId']) ? intval($_GET['countryId']) : 0;
        if ($countryId === 0) {
            throw new Exception("Country ID is required");
        }
        $query = "SELECT id, name FROM states WHERE country_id = $countryId ORDER BY name ASC";
        $result = mysqli_query($db2, $query);
        $states = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $states[] = [
                "id" => $row['id'],
                "name" => $row['name']
            ];
        }
        echo json_encode(["success" => true, "states" => $states]);
        exit;
    }

    if ($type === 'getCities') {
        $stateId = isset($_GET['stateId']) ? intval($_GET['stateId']) : 0;
        if ($stateId === 0) {
            throw new Exception("State ID is required");
        }
        $query = "SELECT id, name FROM cities WHERE state_id = $stateId ORDER BY name ASC";
        $result = mysqli_query($db2, $query);
        $cities = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $cities[] = [
                "id" => $row['id'],
                "name" => $row['name']
            ];
        }
        echo json_encode(["success" => true, "cities" => $cities]);
        exit;
    }

    echo json_encode(["success" => false, "message" => "Invalid action type"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
