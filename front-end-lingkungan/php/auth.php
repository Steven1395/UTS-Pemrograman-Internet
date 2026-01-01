<?php
// 1. Matikan semua warning agar tidak merusak format JSON
error_reporting(0);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// 2. Gunakan Output Buffering untuk menangkap "sampah" teks yang tidak sengaja keluar
ob_start();

$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'pohonhub_db';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    ob_clean();
    echo json_encode(["status" => "error", "message" => "Koneksi Database Gagal"]);
    exit;
}

// 3. Ambil data JSON dari JavaScript
$input = file_get_contents("php://input");
$data = json_decode($input, true);
$action = isset($data['action']) ? $data['action'] : '';

// --- LOGIC REGISTER ---
if ($action == 'register') {
    $nama = $conn->real_escape_string($data['nama']);
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);

    $check = $conn->query("SELECT id FROM users WHERE email = '$email'");
    if ($check->num_rows > 0) {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Email ini sudah terdaftar!"]);
    } else {
        $sql = "INSERT INTO users (nama, email, password, ROLE) VALUES ('$nama', '$email', '$password', 'user')";
        if ($conn->query($sql)) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Pendaftaran berhasil!"]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "Gagal mendaftar: " . $conn->error]);
        }
    }
}

// --- LOGIC LOGIN ---
elseif ($action == 'login') {
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);
    $requestRole = isset($data['role']) ? $conn->real_escape_string($data['role']) : 'user';

    // Ambil semua kolom agar tidak ada yang terlewat
    $sql = "SELECT * FROM users WHERE email = '$email' AND password = '$password' LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        // FIX: Cek apakah kolomnya 'ROLE' (Caps) atau 'role' (Kecil)
        $dbRole = isset($row['ROLE']) ? $row['ROLE'] : (isset($row['role']) ? $row['role'] : 'user');

        // Proteksi Admin Gate
        if ($requestRole == 'admin' && $dbRole != 'admin') {
            ob_clean();
            echo json_encode(["status" => "error", "message" => "Akses Ditolak! Anda bukan Admin."]);
        } else {
            ob_clean();
            echo json_encode([
                "status" => "success",
                "data" => [
                    "id" => $row['id'],
                    "nama" => $row['nama'],
                    "role" => $dbRole
                ]
            ]);
        }
    } else {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Email atau Password salah!"]);
    }
}

$conn->close();
// Buang semua teks sampah dan kirim JSON bersih
ob_end_flush();
?>