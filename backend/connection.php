<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
// Assuming Task.php contains your database connection code

// Establish database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "my_database";

$conn = new mysqli($servername, $username, $password, $dbname);


// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch items from database
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // echo"112"; exit;
    $sql = "SELECT id, name, email FROM items";
    $result = $conn->query($sql);
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    // echo"<pre>"; print_r($items); exit;
    echo json_encode($items);
}
// echo"hello"; exit;
// Add new item to database
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // echo"hello"; exit;
    $name = $_POST['name'];
    $email = $_POST['email'];
    // echo"<pre>"; print_r($name); 
    // echo"<pre>"; print_r($email); 
    // exit;
    
    $sql = "INSERT INTO items (name, email) VALUES ('$name', '$email')";
    if ($conn->query($sql) === TRUE) {
        echo "New item added successfully";
    } else {
        echo "Error adding item: " . $conn->error;
    }
}

// Delete item from database
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'];
    
    $sql = "DELETE FROM items WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo "Item deleted successfully";
    } else {
        echo "Error deleting item: " . $conn->error;
    }
}


?>
