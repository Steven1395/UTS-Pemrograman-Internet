<?php
// File: php/api_petisi.php (VERSI FINAL + CRUD ADMIN)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

$host = 'localhost'; $user = 'root'; $pass = ''; $db = 'pohonhub_db';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die(json_encode(["status" => "error", "message" => "DB Error"]));

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';


// ... (Kode koneksi database dan header PHP lainnya)

if ($_GET['action'] == 'read_single' && isset($_GET['id'])) {
    $id = $conn->real_escape_string($_GET['id']);
    
    // Ambil data satu petisi berdasarkan ID
    $sql = "SELECT * FROM petisi WHERE id = '$id' LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Data ditemukan
        $petisi_data = $result->fetch_assoc();
        echo json_encode($petisi_data);
    } else {
        // Data tidak ditemukan
        echo json_encode(["error" => "Petisi tidak ditemukan"]);
    }
    exit;
}

// 1. READ (Ambil Data)
if ($method == 'GET' || $action == 'read') {
    $result = $conn->query("SELECT * FROM petisi ORDER BY id DESC");
    $data = [];
    while ($row = $result->fetch_assoc()) $data[] = $row;
    echo json_encode($data);
}

// 2. SIGN (Dukung Petisi - Untuk User)
elseif ($method == 'POST' && $action == 'sign') {
    $id = intval($_POST['id']);
    if ($conn->query("UPDATE petisi SET jumlah_ttd = jumlah_ttd + 1 WHERE id = $id")) {
        $newCount = $conn->query("SELECT jumlah_ttd FROM petisi WHERE id = $id")->fetch_assoc()['jumlah_ttd'];
        echo json_encode(["status" => "success", "message" => "Dukungan tercatat!", "new_count" => $newCount]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal update."]);
    }
}

// 3. CREATE (Tambah Petisi Baru - Untuk Admin)
elseif ($method == 'POST' && $action == 'create') {
    $judul  = $conn->real_escape_string($_POST['judul']);
    $desc   = $conn->real_escape_string($_POST['deskripsi']);
    $target = intval($_POST['target']);

    // Cek File Gambar
    if (!isset($_FILES['gambar'])) {
        echo json_encode(["status" => "error", "message" => "Wajib upload gambar kampanye!"]); exit;
    }

    $file = $_FILES['gambar'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    // Rename biar aman: petisi_waktu.jpg
    $newFileName = 'petisi_' . time() . '.' . $ext; 
    
    // Upload ke folder img/
    if(move_uploaded_file($file['tmp_name'], "../img/" . $newFileName)) {
        $sql = "INSERT INTO petisi (judul, deskripsi, gambar, target_ttd, jumlah_ttd) 
                VALUES ('$judul', '$desc', '$newFileName', $target, 0)";
        
        if ($conn->query($sql)) echo json_encode(["status" => "success", "message" => "Kampanye berhasil dibuat!"]);
        else echo json_encode(["status" => "error", "message" => $conn->error]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal upload gambar."]);
    }
}

// 4. DELETE (Hapus Petisi - Untuk Admin)
elseif ($method == 'POST' && $action == 'delete') {
    $id = intval($_POST['id']);
    // (Opsional) Hapus file gambarnya juga
    $row = $conn->query("SELECT gambar FROM petisi WHERE id=$id")->fetch_assoc();
    if($row && file_exists("../img/" . $row['gambar'])) unlink("../img/" . $row['gambar']);

    if ($conn->query("DELETE FROM petisi WHERE id = $id")) {
        echo json_encode(["status" => "success", "message" => "Kampanye dihapus."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal hapus."]);
    }
}

$conn->close();
?>