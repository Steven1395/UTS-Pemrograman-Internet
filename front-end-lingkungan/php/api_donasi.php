<?php
// File: php/api_donasi.php (VERSI FINAL + DELETE)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');

$host = 'localhost'; $user = 'root'; $pass = ''; $db = 'pohonhub_db';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die(json_encode(["status" => "error", "message" => "DB Error"]));

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';

// 1. CREATE
if ($method == 'POST' && $action == 'create') {
    // ... (Logika upload file sama seperti sebelumnya, dipersingkat di sini biar hemat space chat)
    // ... Pastikan logika upload kamu yang tadi tetap ada di sini atau copy dari file lama bagian create-nya ...
    // BIAR AMAN: Pake logika create yang lama, cuma tambah bagian DELETE di bawah.
    
    // -- SAYA TULIS ULANG LOGIKA CREATE BIAR LO GAMPANG COPY-PASTE --
    $nama = $conn->real_escape_string($_POST['nama']);
    $email = $conn->real_escape_string($_POST['email']);
    $jumlah = floatval($_POST['jumlah']);
    
    if (!isset($_FILES['bukti'])) { echo json_encode(["status" => "error", "message" => "Butuh bukti tf"]); exit; }
    
    $file = $_FILES['bukti'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $newFileName = time() . '_' . rand(100,999) . '.' . $ext;
    move_uploaded_file($file['tmp_name'], "../img/uploads/" . $newFileName);

    $sql = "INSERT INTO donasi (nama_donatur, email, jumlah, bukti_transfer, status) VALUES ('$nama', '$email', $jumlah, '$newFileName', 'pending')";
    if($conn->query($sql)) echo json_encode(["status" => "success", "message" => "Donasi diterima."]);
    else echo json_encode(["status" => "error", "message" => $conn->error]);
}

// 2. READ
elseif ($method == 'GET' || $action == 'read') {
    $result = $conn->query("SELECT * FROM donasi ORDER BY id DESC");
    $data = [];
    while ($row = $result->fetch_assoc()) $data[] = $row;
    
    $rowSum = $conn->query("SELECT SUM(jumlah) as total FROM donasi WHERE status = 'verified'")->fetch_assoc();
    echo json_encode(["status" => "success", "data" => $data, "total_verified" => ($rowSum['total'] ? $rowSum['total'] : 0)]);
}

// 3. UPDATE STATUS
elseif ($method == 'POST' && $action == 'update_status') {
    $id = intval($_POST['id']);
    $status = $conn->real_escape_string($_POST['status']);
    $conn->query("UPDATE donasi SET status = '$status' WHERE id = $id");
    echo json_encode(["status" => "success", "message" => "Status diubah jadi $status"]);
}

// 4. DELETE (INI YANG BARU)
elseif ($method == 'POST' && $action == 'delete') {
    $id = intval($_POST['id']);
    // Opsi Tambahan: Hapus juga file gambarnya dari folder uploads biar hemat storage
    // $row = $conn->query("SELECT bukti_transfer FROM donasi WHERE id=$id")->fetch_assoc();
    // if($row) unlink("../img/uploads/" . $row['bukti_transfer']);

    if ($conn->query("DELETE FROM donasi WHERE id = $id")) {
        echo json_encode(["status" => "success", "message" => "Data donasi dihapus."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal hapus."]);
    }
}

$conn->close();
?>