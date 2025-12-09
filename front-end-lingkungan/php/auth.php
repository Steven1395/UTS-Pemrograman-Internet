    <?php
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');

    // KONFIGURASI DATABASE
    $host = 'localhost';
    $user = 'root';      // User default XAMPP
    $pass = '';          // Password default XAMPP (biasanya kosong)
    $db   = 'pohonhub_db';

    $conn = new mysqli($host, $user, $pass, $db); ;;;

    if ($conn->connect_error) {
        die(json_encode(["status" => "error", "message" => "Koneksi Database Gagal: " . $conn->connect_error]));
    }

    // AMBIL DATA DARI JAVASCRIPT
    $data = json_decode(file_get_contents("php://input"), true);
    $action = isset($data['action']) ? $data['action'] : '';

    // --- LOGIC REGISTER ---
    if ($action == 'register') {
        $nama = $conn->real_escape_string($data['nama']);
        $email = $conn->real_escape_string($data['email']);
        $password = $conn->real_escape_string($data['password']); // Idealnya di-hash, tapi kita plain dulu utk belajar

        // Cek apakah email sudah ada
        $check = $conn->query("SELECT id FROM users WHERE email = '$email'");
        if ($check->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Email ini sudah terdaftar!"]);
        } else {
            // Masukkan data baru sebagai 'user'
            $sql = "INSERT INTO users (nama, email, password, role) VALUES ('$nama', '$email', '$password', 'user')";
            if ($conn->query($sql)) {
                echo json_encode(["status" => "success", "message" => "Pendaftaran berhasil! Silakan login."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Gagal mendaftar: " . $conn->error]);
            }
        }
    }

    // --- LOGIC LOGIN ---
    elseif ($action == 'login') {
        $email = $conn->real_escape_string($data['email']);
        $password = $conn->real_escape_string($data['password']);
        $requestRole = $conn->real_escape_string($data['role']); // 'user' atau 'admin'

        $sql = "SELECT * FROM users WHERE email = '$email' AND password = '$password'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            
            // Cek Hak Akses (User tidak boleh login di Admin Panel)
            if ($requestRole == 'admin' && $row['role'] != 'admin') {
                echo json_encode(["status" => "error", "message" => "Akses Ditolak! Anda bukan Admin."]);
            } else {
                // Login Berhasil
                echo json_encode([
                    "status" => "success",
                    "data" => [
                        "id" => $row['id'],
                        "nama" => $row['nama'],
                        "email" => $row['email'],
                        "role" => $row['role']
                    ]
                ]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Email atau Password salah!"]);
        }
    } 
    else {
        echo json_encode(["status" => "error", "message" => "Aksi tidak valid"]);
    }

    $conn->close();
    ?>