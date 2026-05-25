<?php
    require 'Config.php';
    $config= Config::singleton();
    
    $config->set('dbhost', 'localhost'); // ip
    $config->set('dbname', 'lab05pokemon');
    $config->set('dbuser', 'root');
    $config->set('dbpass', '');
    
?>

