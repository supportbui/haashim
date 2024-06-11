<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mobipoint";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


// Fetch all customers
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM customer";
    $result = $conn->query($sql);
    $customers = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $customers[] = $row;
        }
    }
    echo json_encode($customers);
    exit;
}

// Add a new customer
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $phone = $conn->real_escape_string($data['phone']);
    $address = $conn->real_escape_string($data['address']);

    $sql = "INSERT INTO customer (name, email, phone, address) VALUES ('$name', '$email', '$phone', '$address')";
    if ($conn->query($sql) === TRUE) {
        $data['id'] = $conn->insert_id; // get the last inserted id
        echo json_encode($data);
    } else {
        if ($conn->errno === 1062) { // Error code for duplicate entry
            echo json_encode(["error" => "Email address already exists"]);
        } else {
            echo json_encode(["error" => "Error adding customer: " . $conn->error]);
        }
    }
    exit;
}

// Update an existing customer
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['id'])) {
        $id = $conn->real_escape_string($data['id']);
        $name = $conn->real_escape_string($data['name']);
        $email = $conn->real_escape_string($data['email']);
        $phone = $conn->real_escape_string($data['phone']);
        $address = $conn->real_escape_string($data['address']);

        $sql = "UPDATE customer SET name='$name', email='$email', phone='$phone', address='$address' WHERE id='$id'";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Customer updated successfully"]);
        } else {
            if ($conn->errno === 1062) { // Error code for duplicate entry
                echo json_encode(["error" => "Email address already exists"]);
            } else {
                echo json_encode(["error" => "Error updating customer: " . $conn->error]);
            }
        }
    } else {
        echo json_encode(["error" => "Missing id parameter"]);
    }
    exit;
}

// Delete a customer
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['id'])) {
        $id = $conn->real_escape_string($data['id']);
        $sql = "DELETE FROM customer WHERE id='$id'";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Customer deleted successfully"]);
        } else {
            echo json_encode(["error" => "Error deleting customer: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Missing id parameter"]);
    }

    $email = $data->email;
    $password = $data->password;
    
    // Dummy validation
    if ($email === 'user@example.com' && $password === 'password123') {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }


    exit;
}
?>
