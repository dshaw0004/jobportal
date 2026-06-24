<?php
require 'config.php';
$res = $db1->query("SHOW TABLES");
while ($row = $res->fetch_row()) {
    echo $row[0] . "\n";
}
