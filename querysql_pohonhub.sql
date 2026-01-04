-- 1. RESET DATABASE (Hapus yang lama biar bersih)
DROP DATABASE IF EXISTS pohonhub_db;
CREATE DATABASE pohonhub_db;
USE pohonhub_db;

-- ==========================================
-- 2. TABEL USERS (Untuk Login)
-- ==========================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    PASSWORD VARCHAR(255) NOT NULL, -- Sesuai dengan auth.php kamu
    ROLE ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Akun Admin (Password: admin123)
INSERT INTO users (nama, email, PASSWORD, ROLE) 
VALUES ('Super Admin', 'admin@pohonhub.org', 'admin123', 'admin');

-- Insert Akun User Biasa (Password: user123) untuk testing
INSERT INTO users (nama, email, PASSWORD, ROLE) 
VALUES ('Steven User', 'steven@gmail.com', 'user123', 'user');


-- ==========================================
-- 3. TABEL PETISI (Untuk Kampanye Dinamis)
-- ==========================================
CREATE TABLE petisi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    gambar VARCHAR(255) NOT NULL, -- Nama file gambar (misal: amazon.jpg)
    target_ttd INT NOT NULL DEFAULT 1000, -- Target tanda tangan
    jumlah_ttd INT NOT NULL DEFAULT 0,    -- Jumlah saat ini (realtime)
    STATUS ENUM('aktif', 'selesai') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Data Contoh (Supaya web tidak kosong pas dites)
INSERT INTO petisi (judul, deskripsi, gambar, target_ttd, jumlah_ttd) VALUES 
('Lindungi Hutan Amazon', 'Hutan hujan Amazon menopang kehidupan jutaan spesies. Hentikan deforestasi ilegal sekarang!', 'campaign-amazon.jpg', 50000, 12500),
('Stop Plastik di Laut', 'Laut kita penuh sampah. Dukung regulasi pelarangan plastik sekali pakai.', 'campaign-mangrove.jpg', 10000, 8400),
('Selamatkan Harimau Sumatera', 'Habitat harimau semakin sempit. Kita butuh tindakan tegas.', 'campaign-resist.jpg', 20000, 19000);


-- ==========================================
-- 4. TABEL DONASI (Untuk CRUD Keuangan)
-- ==========================================
CREATE TABLE donasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- Bisa NULL kalau user tamu, tapi disarankan login
    nama_donatur VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    jumlah DECIMAL(15, 2) NOT NULL,
    bukti_transfer VARCHAR(255) NOT NULL, -- Nama file gambar bukti
    STATUS ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    tanggal_donasi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- 5. TABEL RELAWAN (Untuk Data Pendaftar)
-- ==========================================
CREATE TABLE relawan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- Relasi ke users
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    domisili VARCHAR(100) NOT NULL,
    alasan TEXT NOT NULL,
    tanggal_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



ALTER TABLE relawan ADD COLUMN pekerjaan VARCHAR(100) AFTER no_hp;



-- Tabel untuk mencatat siapa mendukung petisi apa
CREATE TABLE dukungan_petisi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    petisi_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL, -- Kita pakai userName dari localStorage
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_dukungan (petisi_id, user_name) -- Kunci agar tidak bisa duplikat
);



-- 2. Sekarang ubah kolomnya jadi NOT NULL (Pasti berhasil karena tabel kosong)
ALTER TABLE relawan MODIFY COLUMN user_id INT NOT NULL;

-- 3. Sekarang pasang Foreign Key-nya
ALTER TABLE relawan 
ADD CONSTRAINT fk_relawan_users 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


TRUNCATE TABLE relawan;


-- 1. Bersihkan data donasi lama (biar gak error foreign key)
TRUNCATE TABLE donasi;

-- 2. Ubah user_id jadi NOT NULL dan hubungkan ke tabel users
ALTER TABLE donasi MODIFY COLUMN user_id INT NOT NULL;
ALTER TABLE donasi ADD CONSTRAINT fk_donasi_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;




-- 1. Hapus dulu data relawan yang duplikat biar gak error pas pasang kunci
TRUNCATE TABLE relawan;

-- 2. Tambahkan UNIQUE CONSTRAINT pada user_id
ALTER TABLE relawan ADD UNIQUE (user_id);

