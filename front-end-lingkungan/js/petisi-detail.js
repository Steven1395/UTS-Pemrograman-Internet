document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil ID Petisi dari URL
    const params = new URLSearchParams(window.location.search);
    const petisiId = params.get('id');

    if (!petisiId) {
        document.getElementById('detail-judul').textContent = "Petisi Tidak Ditemukan.";
        return;
    }

    // 2. Fungsi untuk memuat data petisi
    async function loadPetisiDetail() {
        try {
            // Kita gunakan API yang sama, tapi kirim ID
            const response = await fetch(`php/api_petisi.php?action=read_single&id=${petisiId}`);
            const item = await response.json();
            
            if (!item || item.error) {
                document.getElementById('detail-judul').textContent = "Data Petisi Tidak Ditemukan.";
                return;
            }

            // 3. Isi Konten HTML
            document.getElementById('page-title').textContent = item.judul;
            document.getElementById('detail-judul').textContent = item.judul;
            document.getElementById('detail-deskripsi').textContent = item.deskripsi;
            document.getElementById('detail-gambar').src = `img/${item.gambar}`;
            
            // 4. Isi Statistik
            const ttd = parseInt(item.jumlah_ttd);
            const target = parseInt(item.target_ttd);
            const percent = Math.min((ttd / target) * 100, 100);

            document.getElementById('detail-ttd').textContent = ttd.toLocaleString('id-ID');
            document.getElementById('detail-target').textContent = target.toLocaleString('id-ID');
            document.getElementById('detail-progress-fill').style.width = `${percent}%`;


            // 5. Pasang Event Listener ke Tombol Dukung Final
            const finalBtn = document.getElementById('btn-dukung-final');
            finalBtn.onclick = () => finalDukungPetisi(petisiId);

        } catch (error) {
            console.error('Gagal memuat detail petisi:', error);
            document.getElementById('detail-judul').textContent = "Gagal koneksi server.";
        }
    }

    // Logika Dukung (Harus didefinisikan di sini atau di script.js)
    window.finalDukungPetisi = async (id) => {
        const sessionName = localStorage.getItem("userName");
        if (!sessionName) {
            alert("🔒 Silakan LOGIN dulu untuk menandatangani petisi.");
            window.location.href = "login.html";
            return;
        }
        
        const btn = document.getElementById('btn-dukung-final');
        if(!confirm(`Yakin menandatangani petisi ${document.getElementById('detail-judul').textContent}?`)) return;

        btn.textContent = "Memproses...";
        btn.disabled = true;

        // Panggil API Petisi SIGN
        const formData = new FormData();
        formData.append('action', 'sign');
        formData.append('id', id);

        try {
            const res = await fetch('php/api_petisi.php', { method: 'POST', body: formData });
            const result = await res.json();
            
            if(result.status === 'success') {
                alert(result.message);
                window.location.replace(window.location.href);
            } else {
                alert(result.message);
            }
        } catch (e) { 
            alert("Error koneksi API Petisi.");
        } finally {
            btn.textContent = "Tandatangani Petisi Ini";
            btn.disabled = false;
        }
    }

    loadPetisiDetail();
});