<?php
// File: php/api_relawan.php (VERSI FINAL + DELETE)
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
    $nama      = $conn->real_escape_string($_POST['nama_lengkap']);
    $email     = $conn->real_escape_string($_POST['email']);
    $hp        = $conn->real_escape_string($_POST['no_hp']);
    $pekerjaan = $conn->real_escape_string($_POST['pekerjaan']);
    $domisili  = $conn->real_escape_string($_POST['domisili']);
    $alasan    = $conn->real_escape_string($_POST['alasan']);

    if (empty($nama) || empty($email)) {
        echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]); exit;
    }

    $sql = "INSERT INTO relawan (nama_lengkap, email, no_hp, pekerjaan, domisili, alasan) 
            VALUES ('$nama', '$email', '$hp', '$pekerjaan', '$domisili', '$alasan')";

    if ($conn->query($sql)) echo json_encode(["status" => "success", "message" => "Berhasil daftar."]);
    else echo json_encode(["status" => "error", "message" => $conn->error]);
}

// 2. READ
elseif ($method == 'GET' || $action == 'read') {
    $result = $conn->query("SELECT * FROM relawan ORDER BY id DESC");
    $data = [];
    while ($row = $result->fetch_assoc()) $data[] = $row;
    echo json_encode(["status" => "success", "data" => $data, "total" => count($data)]);
}

// 3. DELETE (INI YANG BARU)
elseif ($method == 'POST' && $action == 'delete') {
    $id = intval($_POST['id']);
    if($id > 0) {
        if ($conn->query("DELETE FROM relawan WHERE id = $id")) {
            echo json_encode(["status" => "success", "message" => "Data relawan dihapus."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal hapus."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "ID tidak valid."]);
    }
}

$conn->close();
?>