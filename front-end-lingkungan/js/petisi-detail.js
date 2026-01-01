document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil ID Petisi dari URL
    const params = new URLSearchParams(window.location.search);
    const petisiId = params.get('id');

    if (!petisiId) {
        document.getElementById('detail-judul').textContent = "ID Petisi Tidak Ditemukan.";
        return;
    }

    // 2. Fungsi untuk memuat data petisi saat halaman dibuka
    async function loadPetisiDetail() {
        try {
            // Memanggil API dengan action read_single
            const response = await fetch(`php/api_petisi.php?action=read_single&id=${petisiId}`);
            const item = await response.json();
            
            if (!item || item.error) {
                document.getElementById('detail-judul').textContent = "Data Petisi Tidak Ditemukan.";
                return;
            }

            // 3. Isi Konten HTML (Sinkron dengan ID di HTML lo)
            document.getElementById('page-title').textContent = item.judul;
            document.getElementById('detail-judul').textContent = item.judul;
            document.getElementById('detail-deskripsi').textContent = item.deskripsi;
            document.getElementById('detail-gambar').src = `img/${item.gambar}`;
            
            // 4. Isi Statistik & Progress Bar
            const ttd = parseInt(item.jumlah_ttd);
            const target = parseInt(item.target_ttd);
            const percent = Math.min((ttd / target) * 100, 100);

            document.getElementById('detail-ttd').textContent = ttd.toLocaleString('id-ID');
            document.getElementById('detail-target').textContent = target.toLocaleString('id-ID');
            document.getElementById('detail-progress-fill').style.width = `${percent}%`;

            // 5. Pasang Event Listener ke Tombol Dukung
            const finalBtn = document.getElementById('btn-dukung-final');
            if (finalBtn) {
                finalBtn.onclick = () => window.finalDukungPetisi(petisiId);
            }

        } catch (error) {
            console.error('Gagal memuat detail petisi:', error);
            document.getElementById('detail-judul').textContent = "Gagal koneksi server.";
        }
    }

    // Jalankan fungsi load saat halaman siap
    loadPetisiDetail();
});

// 6. Logika Dukung (Global Function)
window.finalDukungPetisi = async (id) => {
    const sessionName = localStorage.getItem("userName"); // Ambil identitas user dari Login
    
    if (!sessionName) {
        alert("🔒 Silakan LOGIN dulu untuk menandatangani petisi.");
        window.location.href = "login.html";
        return;
    }
    
    const btn = document.getElementById('btn-dukung-final');
    if(!confirm(`Yakin mendukung petisi ini?`)) return;

    btn.textContent = "Memproses...";
    btn.disabled = true;

    const formData = new FormData();
    formData.append('action', 'sign');
    formData.append('id', id);
    formData.append('user_name', sessionName); // Kirim nama buat dicek duplikat di PHP

    try {
        const res = await fetch('php/api_petisi.php', { method: 'POST', body: formData });
        
        if (!res.ok) throw new Error("Server bermasalah");

        const result = await res.json();
        
        if(result.status === 'success') {
            alert(result.message);
            window.location.reload(); // Refresh halaman agar angka terbaru muncul
        } else {
            alert(result.message); // Pesan "Anda sudah pernah dukung" dari PHP
        }
    } catch (e) { 
        console.error(e);
        alert("Terjadi kesalahan. Pastikan database dan server siap.");
    } finally {
        btn.textContent = "Tandatangani Petisi Ini";
        btn.disabled = false;
    }
};