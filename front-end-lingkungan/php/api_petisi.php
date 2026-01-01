<?php
error_reporting(0); // Matikan warning agar tidak merusak JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost'; $user = 'root'; $pass = ''; $db = 'pohonhub_db';
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB Error"]);
    exit;
}

$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';

// 1. READ SINGLE
if ($action == 'read_single' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $result = $conn->query("SELECT * FROM petisi WHERE id = $id");
    ob_clean(); // Bersihkan buffer
    echo json_encode($result->fetch_assoc() ?: ["error" => "Not found"]);
    exit;
}

// 2. READ ALL
if ($action == 'read') {
    $result = $conn->query("SELECT * FROM petisi ORDER BY id DESC");
    $data = [];
    while ($row = $result->fetch_assoc()) $data[] = $row;
    ob_clean();
    echo json_encode($data);
    exit;
}

// 3. SIGN (Dukung Petisi dengan Cek Duplikat)
elseif ($action == 'sign') {
    $id = intval($_POST['id']);
    $user_name = $conn->real_escape_string($_POST['user_name']);

    if (empty($user_name)) {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "User tidak valid."]);
        exit;
    }

    // Cek apakah sudah pernah dukung
    $cek = $conn->query("SELECT id FROM dukungan_petisi WHERE petisi_id = $id AND user_name = '$user_name'");
    
    if ($cek->num_rows > 0) {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Anda sudah menandatangani petisi ini!"]);
    } else {
        // Gunakan Transaction agar data konsisten
        $conn->begin_transaction();
        try {
            $conn->query("INSERT INTO dukungan_petisi (petisi_id, user_name) VALUES ($id, '$user_name')");
            $conn->query("UPDATE petisi SET jumlah_ttd = jumlah_ttd + 1 WHERE id = $id");
            $conn->commit();
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Dukungan berhasil dicatat!"]);
        } catch (Exception $e) {
            $conn->rollback();
            ob_clean();
            echo json_encode(["status" => "error", "message" => "Gagal memproses dukungan."]);
        }
    }
    exit;
}

// 4. CREATE (Admin)
elseif ($action == 'create') {
    $judul = $conn->real_escape_string($_POST['judul']);
    $desc = $conn->real_escape_string($_POST['deskripsi']);
    $target = intval($_POST['target']);

    if (!isset($_FILES['gambar'])) {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Gambar wajib ada."]);
        exit;
    }

    $newFileName = 'petisi_' . time() . '.jpg';
    if (move_uploaded_file($_FILES['gambar']['tmp_name'], "../img/" . $newFileName)) {
        $sql = "INSERT INTO petisi (judul, deskripsi, gambar, target_ttd, jumlah_ttd) VALUES ('$judul', '$desc', '$newFileName', $target, 0)";
        if ($conn->query($sql)) {
            ob_clean();
            echo json_encode(["status" => "success", "message" => "Kampanye berhasil dibuat!"]);
        } else {
            ob_clean();
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
    }
    exit;
}

// 5. DELETE (Admin)
elseif ($action == 'delete') {
    $id = intval($_POST['id']);
    $row = $conn->query("SELECT gambar FROM petisi WHERE id=$id")->fetch_assoc();
    if ($row && file_exists("../img/" . $row['gambar'])) unlink("../img/" . $row['gambar']);
    
    if ($conn->query("DELETE FROM petisi WHERE id = $id")) {
        ob_clean();
        echo json_encode(["status" => "success", "message" => "Kampanye dihapus."]);
    } else {
        ob_clean();
        echo json_encode(["status" => "error", "message" => "Gagal hapus."]);
    }
    exit;
}

$conn->close();
?>