<?php
// 1. TAMBAHKAN INI DI PALING ATAS
error_reporting(0);
ob_start(); 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost'; $user = 'root'; $pass = ''; $db = 'pohonhub_db';
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) die(json_encode(["status" => "error", "message" => "DB Error"]));

// --- 2. BARIS INI YANG HILANG DI KODE LO (BIANG KEROK KONEKSI ERROR) ---
$method = $_SERVER['REQUEST_METHOD']; 
$action = $_REQUEST['action'] ?? '';

// 1. CREATE (Donatur kirim bukti)
if ($action == 'create') {
    $user_id = intval($_POST['user_id']); 
    $nama    = $conn->real_escape_string($_POST['nama']);
    $email   = $conn->real_escape_string($_POST['email']);
    $jumlah  = floatval($_POST['jumlah']);

    if ($user_id <= 0) {
        echo json_encode(["status" => "error", "message" => "Sesi login tidak valid!"]); exit;
    }

    if (!isset($_FILES['bukti'])) {
        echo json_encode(["status" => "error", "message" => "Bukti transfer wajib diunggah!"]); exit;
    }

    $file = $_FILES['bukti'];
    $ext  = pathinfo($file['name'], PATHINFO_EXTENSION);
    $newFileName = time() . '_' . rand(100,999) . '.' . $ext;

    if (move_uploaded_file($file['tmp_name'], "../img/uploads/" . $newFileName)) {
        // Gunakan nama kolom STATUS (huruf besar) agar sinkron dengan database lo
        $sql = "INSERT INTO donasi (user_id, nama_donatur, email, jumlah, bukti_transfer, STATUS) 
                VALUES ($user_id, '$nama', '$email', $jumlah, '$newFileName', 'pending')";
        
        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Konfirmasi donasi berhasil dikirim!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal simpan: " . $conn->error]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal upload gambar ke server."]);
    }
}

// 2. READ (Untuk Admin)
// FIX: Sekarang variabel $method sudah ada, jadi kondisi ini akan tembus
elseif ($method == 'GET' || $action == 'read') {
    $result = $conn->query("SELECT * FROM donasi ORDER BY id DESC");
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    
    // Perhatikan STATUS (Huruf Besar)
    $rowSum = $conn->query("SELECT SUM(jumlah) as total FROM donasi WHERE STATUS = 'verified'")->fetch_assoc();
    
    ob_clean(); 
    echo json_encode([
        "status" => "success", 
        "data" => $data, 
        "total_verified" => ($rowSum['total'] ? $rowSum['total'] : 0)
    ]);
    exit;
}

// 3. UPDATE STATUS
elseif ($method == 'POST' && $action == 'update_status') {
    $id = intval($_POST['id']);
    $status = $conn->real_escape_string($_POST['status']); 
    
    // Gunakan STATUS (Huruf Besar)
    $sql = "UPDATE donasi SET STATUS = '$status' WHERE id = $id";
    
    if ($conn->query($sql)) {
        ob_clean();
        echo json_encode(["status" => "success", "message" => "Berhasil"]);
    } else {
        ob_clean();
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
    exit;
}

// 4. DELETE
elseif ($method == 'POST' && $action == 'delete') {
    $id = intval($_POST['id']);
    if ($conn->query("DELETE FROM donasi WHERE id = $id")) {
        echo json_encode(["status" => "success", "message" => "Data donasi dihapus."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal hapus."]);
    }
}

$conn->close();
?>