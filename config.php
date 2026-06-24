<?php
$host     = "127.0.0.1";
$user     = "root";
$password = "";
$database1 = "jobportal";
$database2 = "location";
$socket = null; //"/opt/lampp/var/mysql/mysql.sock";
$db1 = new mysqli($host, $user, $password, $database1, 3306, $socket);
if ($db1->connect_errno > 0) {
    die('Cannot connect to jobportal DB: ' . $db1->connect_error);
}
$db2 = new mysqli($host, $user, $password, $database2, 3306, $socket);
?>
