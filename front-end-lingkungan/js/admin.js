// File: js/admin.js (VERSI FINAL + FITUR DELETE)

document.addEventListener("DOMContentLoaded", () => {
    loadStats();
});

// --- LOAD STATS ---
async function loadStats() {
    try {
        const resDonasi = await fetch('php/api_donasi.php?action=read');
        const dataDonasi = await resDonasi.json();
        
        const resRelawan = await fetch('php/api_relawan.php?action=read');
        const dataRelawan = await resRelawan.json();

        const pendingCount = dataDonasi.data.filter(d => d.status === 'pending').length;
        
        document.getElementById('stat-uang').textContent = "Rp " + parseInt(dataDonasi.total_verified).toLocaleString('id-ID');
        document.getElementById('stat-pending').textContent = pendingCount;
        document.getElementById('stat-relawan').textContent = dataRelawan.total;

    } catch (error) { console.error(error); }
}

// --- LOAD RELAWAN (ADA TOMBOL HAPUS) ---
async function loadRelawan() {
    const tbody = document.getElementById('table-relawan-body');
    tbody.innerHTML = '<tr><td colspan="6">Sedang memuat...</td></tr>';

    try {
        const res = await fetch('php/api_relawan.php?action=read');
        const result = await res.json();
        
        tbody.innerHTML = '';
        if(result.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Belum ada relawan.</td></tr>'; return;
        }

        result.data.forEach(r => {
            const row = `
                <tr>
                    <td>${r.nama_lengkap}</td>
                    <td>${r.email}</td>
                    <td>${r.no_hp}</td>
                    <td>${r.pekerjaan || '-'}</td>
                    <td>${r.domisili}</td>
                    <td>
                        <button onclick="hapusRelawan(${r.id}, '${r.nama_lengkap}')" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Hapus</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (e) { console.error(e); }
}

// --- FUNGSI HAPUS RELAWAN ---
async function hapusRelawan(id, nama) {
    if(!confirm(`Yakin ingin menghapus relawan: ${nama}? Data akan hilang permanen.`)) return;

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id);

    try {
        const res = await fetch('php/api_relawan.php', { method: 'POST', body: formData });
        const result = await res.json();
        if(result.status === 'success') {
            alert(result.message);
            loadRelawan(); // Refresh tabel
            loadStats();   // Refresh angka total
        } else {
            alert(result.message);
        }
    } catch(e) { alert("Error koneksi"); }
}

// --- LOAD DONASI (ADA TOMBOL HAPUS) ---
async function loadDonasi() {
    const tbody = document.getElementById('table-donasi-body');
    tbody.innerHTML = '<tr><td colspan="7">Sedang memuat...</td></tr>';

    try {
        const res = await fetch('php/api_donasi.php?action=read');
        const result = await res.json();
        
        tbody.innerHTML = '';
        if(result.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Belum ada data donasi.</td></tr>'; return;
        }

        result.data.forEach(d => {
            let badgeClass = d.status; // pending, verified, rejected
            
            // Tombol Verifikasi
            let aksiButton = '';
            if(d.status === 'pending') {
                aksiButton = `
                    <button onclick="updateStatus(${d.id}, 'verified')" style="background:green; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer; margin-right:5px;">✓</button>
                    <button onclick="updateStatus(${d.id}, 'rejected')" style="background:orange; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer;">X</button>
                `;
            } else {
                aksiButton = `<span class="muted" style="font-size:0.8rem;">${d.status}</span>`;
            }

            // Tombol Hapus (Tong Sampah) selalu ada
            const deleteBtn = `
                <button onclick="hapusDonasi(${d.id})" style="background:#c0392b; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-left:5px;" title="Hapus Permanen">🗑</button>
            `;

            const row = `
                <tr>
                    <td>${d.tanggal_donasi}</td>
                    <td><strong>${d.nama_donatur}</strong><br><small>${d.email}</small></td>
                    <td>Rp ${parseInt(d.jumlah).toLocaleString('id-ID')}</td>
                    <td><button onclick="lihatBukti('${d.bukti_transfer}')">Lihat</button></td>
                    <td><span class="badge ${badgeClass}">${d.status.toUpperCase()}</span></td>
                    <td>${aksiButton} ${deleteBtn}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (e) { console.error(e); }
}

// --- FUNGSI HAPUS DONASI ---
async function hapusDonasi(id) {
    if(!confirm("Yakin hapus data donasi ini? (Tidak bisa dikembalikan)")) return;

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id);

    try {
        const res = await fetch('php/api_donasi.php', { method: 'POST', body: formData });
        const result = await res.json();
        if(result.status === 'success') {
            alert(result.message);
            loadDonasi(); // Refresh tabel
            loadStats();  // Refresh uang
        } else {
            alert(result.message);
        }
    } catch(e) { alert("Error koneksi"); }
}

// --- FUNGSI UPDATE STATUS ---
async function updateStatus(id, newStatus) {
    const formData = new FormData();
    formData.append('action', 'update_status');
    formData.append('id', id);
    formData.append('status', newStatus);

    try {
        await fetch('php/api_donasi.php', { method:'POST', body:formData });
        loadDonasi();
        loadStats();
    } catch(e) { alert("Koneksi error"); }
}

function lihatBukti(filename) {
    const modal = document.getElementById('modal-bukti');
    document.getElementById('img-bukti-preview').src = 'img/uploads/' + filename;
    modal.style.display = 'flex';
}

// ... (Kode Donasi dan Relawan Biarkan di Atas) ...

// --- 5. LOGIC PETISI (ADMIN) ---

async function loadPetisiAdmin() {
    const tbody = document.getElementById('table-petisi-body');
    tbody.innerHTML = '<tr><td colspan="4">Sedang memuat...</td></tr>';

    try {
        const res = await fetch('php/api_petisi.php?action=read');
        const data = await res.json();
        
        tbody.innerHTML = '';
        if(data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Belum ada kampanye. Silakan tambah baru.</td></tr>'; return;
        }

        data.forEach(p => {
            const row = `
                <tr>
                    <td><img src="img/${p.gambar}" style="width:60px; height:40px; object-fit:cover; border-radius:4px;"></td>
                    <td><strong>${p.judul}</strong><br><small>${p.deskripsi.substring(0, 50)}...</small></td>
                    <td>${p.jumlah_ttd} / ${p.target_ttd}</td>
                    <td>
                        <button onclick="hapusPetisi(${p.id}, '${p.judul}')" style="background:#c0392b; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Hapus</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (e) { console.error(e); }
}

async function simpanPetisi(e) {
    e.preventDefault();
    if(!confirm("Buat kampanye ini?")) return;

    const formData = new FormData();
    formData.append('action', 'create');
    formData.append('judul', document.getElementById('judul-petisi').value);
    formData.append('deskripsi', document.getElementById('desc-petisi').value);
    formData.append('target', document.getElementById('target-petisi').value);
    formData.append('gambar', document.getElementById('gambar-petisi').files[0]);

    try {
        const res = await fetch('php/api_petisi.php', { method:'POST', body:formData });
        const result = await res.json();
        
        if(result.status === 'success') {
            alert(result.message);
            toggleFormPetisi(); // Tutup form
            e.target.reset();   // Kosongkan input
            loadPetisiAdmin();  // Refresh tabel
        } else {
            alert(result.message);
        }
    } catch(err) { alert("Gagal koneksi server"); }
}

async function hapusPetisi(id, judul) {
    if(!confirm(`Hapus kampanye "${judul}"?`)) return;

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id);

    try {
        const res = await fetch('php/api_petisi.php', { method:'POST', body:formData });
        const result = await res.json();
        
        if(result.status === 'success') {
            alert("Kampanye dihapus.");
            loadPetisiAdmin();
        } else {
            alert(result.message);
        }
    } catch(err) { alert("Error"); }
}