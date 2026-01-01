<?php
// File: php/api_relawan.php (VERSI FIX - ANTI ERROR 1452)
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
    // Tangkap user_id dari JavaScript
    $user_id   = isset($_POST['user_id']) ? intval($_POST['user_id']) : 0;
    
    // --- 1. CEK APAKAH USER SUDAH DAFTAR? (ANTI DUPLIKAT) ---
    // Jika data ada di tabel, berarti user sudah jadi relawan
    $cek_duplikat = $conn->query("SELECT id FROM relawan WHERE user_id = $user_id");
    
    if ($cek_duplikat->num_rows > 0) {
        ob_clean(); // Bersihkan output sampah agar JSON valid
        echo json_encode([
            "status" => "error", 
            "message" => "Opps! Anda sudah terdaftar sebagai relawan. Admin harus menghapus data lama jika ingin daftar ulang."
        ]);
        exit;
    }
    // -------------------------------------------------------

    $nama      = $conn->real_escape_string($_POST['nama_lengkap']);
    $email     = $conn->real_escape_string($_POST['email']);
    $hp        = $conn->real_escape_string($_POST['no_hp']);
    $pekerjaan = $conn->real_escape_string($_POST['pekerjaan']);
    $domisili  = $conn->real_escape_string($_POST['domisili']);
    $alasan    = $conn->real_escape_string($_POST['alasan']);

    // Validasi Dasar
    if ($user_id <= 0) {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Sesi login tidak valid. Silakan login ulang!"]);
        exit;
    }

    if (empty($nama) || empty($email)) {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Nama dan Email wajib diisi."]);
        exit;
    }

    // --- 2. JIKA LOLOS CEK, BARU INSERT DATA BARU ---
    $sql = "INSERT INTO relawan (user_id, nama_lengkap, email, no_hp, pekerjaan, domisili, alasan) 
            VALUES ($user_id, '$nama', '$email', '$hp', '$pekerjaan', '$domisili', '$alasan')";

    if ($conn->query($sql)) {
        ob_clean();
        echo json_encode(["status" => "success", "message" => "Pendaftaran relawan berhasil!"]);
    } else {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Database Error: " . $conn->error]);
    }
    exit;
}

// 2. READ
elseif ($method == 'GET' || $action == 'read') {
    $result = $conn->query("SELECT * FROM relawan ORDER BY id DESC");
    $data = [];
    while ($row = $result->fetch_assoc()) $data[] = $row;
    echo json_encode(["status" => "success", "data" => $data, "total" => count($data)]);
}

// 3. DELETE
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