<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;

// Dummy validation
if ($email === 'user@example.com' && $password === 'password123') {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
