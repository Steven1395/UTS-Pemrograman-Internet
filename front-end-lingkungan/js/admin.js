// ============================================================
// JS ADMIN DASHBOARD - POHON HUB
// FITUR: LOAD DATA, STATISTIK, DELETE, & UPDATE (CRUD FULL)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    loadStats();      // Update angka di dashboard
    loadDonasi();     // Tabel Donasi
    loadRelawan();    // Tabel Relawan
    loadPetisiAdmin();// Tabel Petisi
});

// ------------------------------------------------------------
// 1. STATISTIK DASHBOARD
// ------------------------------------------------------------
async function loadStats() {
    try {
        const resDonasi = await fetch('php/api_donasi.php?action=read');
        const dataDonasi = await resDonasi.json();
        
        const resRelawan = await fetch('php/api_relawan.php?action=read');
        const dataRelawan = await resRelawan.json();

        const pendingCount = dataDonasi.data.filter(d => {
            const s = d.STATUS || d.status || "";
            return s.toLowerCase() === 'pending';
        }).length;      

        document.getElementById('stat-uang').textContent = "Rp " + parseInt(dataDonasi.total_verified).toLocaleString('id-ID');
        document.getElementById('stat-pending').textContent = pendingCount;
        document.getElementById('stat-relawan').textContent = dataRelawan.total;
    } catch (error) { console.error("Error Stats:", error); }
}

// ------------------------------------------------------------
// 2. KELOLA RELAWAN
// ------------------------------------------------------------
async function loadRelawan() {
    const tbody = document.getElementById('table-relawan-body');
    tbody.innerHTML = '<tr><td colspan="6">Memuat data...</td></tr>';
    try {
        const res = await fetch('php/api_relawan.php?action=read');
        const result = await res.json();
        tbody.innerHTML = '';
        if(result.data.length === 0) { tbody.innerHTML = '<tr><td colspan="6">Kosong.</td></tr>'; return; }

        result.data.forEach(r => {
            const row = `
                <tr>
                    <td>${r.nama_lengkap}</td>
                    <td>${r.email}</td>
                    <td>${r.no_hp}</td>
                    <td>${r.pekerjaan || '-'}</td>
                    <td>${r.domisili}</td>
                    <td>
                        <button onclick='openEditRelawan(${JSON.stringify(r)})' style="background:#3498db; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Edit</button>
                        <button onclick="hapusRelawan(${r.id}, '${r.nama_lengkap}')" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Hapus</button>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (e) { console.error(e); }
}

async function hapusRelawan(id, nama) {
    if(!confirm(`Hapus relawan ${nama}?`)) return;
    const f = new FormData(); f.append('action', 'delete'); f.append('id', id);
    const res = await fetch('php/api_relawan.php', { method: 'POST', body: f });
    const resJson = await res.json();
    alert(resJson.message); loadRelawan(); loadStats();
}

// ------------------------------------------------------------
// 3. KELOLA DONASI
// ------------------------------------------------------------
async function loadDonasi() {
    const tbody = document.getElementById('table-donasi-body');
    tbody.innerHTML = '<tr><td colspan="6">Memuat data...</td></tr>';
    try {
        const res = await fetch('php/api_donasi.php?action=read');
        const result = await res.json();
        tbody.innerHTML = '';
        result.data.forEach(d => {
            let s = (d.STATUS || d.status || 'pending').toLowerCase();
            const row = `
                <tr>
                    <td>${d.tanggal_donasi}</td>
                    <td><strong>${d.nama_donatur}</strong></td>
                    <td>Rp ${parseInt(d.jumlah).toLocaleString('id-ID')}</td>
                    <td><button onclick="lihatBukti('${d.bukti_transfer}')">Lihat</button></td>
                    <td><span class="badge ${s}">${s.toUpperCase()}</span></td>
                    <td>
                        <button onclick='openEditDonasi(${JSON.stringify(d)})' style="background:#3498db; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Edit</button>
                        <button onclick="hapusDonasi(${d.id})" style="background:#c0392b; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">🗑</button>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (e) { console.error(e); }
}

async function hapusDonasi(id) {
    if(!confirm("Hapus data donasi ini?")) return;
    const f = new FormData(); f.append('action', 'delete'); f.append('id', id);
    const res = await fetch('php/api_donasi.php', { method: 'POST', body: f });
    const resJson = await res.json();
    alert(resJson.message); loadDonasi(); loadStats();
}

// ------------------------------------------------------------
// 4. KELOLA PETISI
// ------------------------------------------------------------
async function loadPetisiAdmin() {
    const tbody = document.getElementById('table-petisi-body');
    tbody.innerHTML = '<tr><td colspan="4">Memuat data...</td></tr>';
    try {
        const res = await fetch('php/api_petisi.php?action=read');
        const data = await res.json();
        tbody.innerHTML = '';
        data.forEach(p => {
            const row = `
                <tr>
                    <td><img src="img/${p.gambar}" style="width:60px; height:40px; object-fit:cover; border-radius:4px;"></td>
                    <td><strong>${p.judul}</strong></td>
                    <td>${p.jumlah_ttd} / ${p.target_ttd}</td>
                    <td>
                        <button onclick='openEditPetisi(${JSON.stringify(p)})' style="background:#3498db; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Edit</button>
                        <button onclick="hapusPetisi(${p.id}, '${p.judul}')" style="background:#c0392b; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Hapus</button>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        });
    } catch (e) { console.error(e); }
}

async function hapusPetisi(id, judul) {
    if(!confirm(`Hapus kampanye "${judul}"?`)) return;
    const f = new FormData(); f.append('action', 'delete'); f.append('id', id);
    const res = await fetch('php/api_petisi.php', { method:'POST', body:f });
    alert("Berhasil dihapus"); loadPetisiAdmin();
}

// ------------------------------------------------------------
// 5. LOGIKA MODAL EDIT (BUKA & ISI DATA)
// ------------------------------------------------------------
function openEditRelawan(r) {
    document.getElementById('edit-rel-id').value = r.id;
    document.getElementById('edit-rel-nama').value = r.nama_lengkap;
    document.getElementById('edit-rel-email').value = r.email;
    document.getElementById('edit-rel-hp').value = r.no_hp;
    document.getElementById('edit-rel-pekerjaan').value = r.pekerjaan || '';
    document.getElementById('edit-rel-domisili').value = r.domisili;
    document.getElementById('edit-rel-alasan').value = r.alasan || '';
    document.getElementById('modal-edit-relawan').style.display = 'flex';
}

function openEditDonasi(d) {
    document.getElementById('edit-don-id').value = d.id;
    document.getElementById('edit-don-nama').value = d.nama_donatur;
    document.getElementById('edit-don-email').value = d.email;
    document.getElementById('edit-don-jumlah').value = d.jumlah;
    document.getElementById('edit-don-status').value = (d.STATUS || d.status).toLowerCase();
    document.getElementById('modal-edit-donasi').style.display = 'flex';
}

function openEditPetisi(p) {
    document.getElementById('edit-pet-id').value = p.id;
    document.getElementById('edit-pet-judul').value = p.judul;
    document.getElementById('edit-pet-desc').value = p.deskripsi;
    document.getElementById('edit-pet-target').value = p.target_ttd;
    document.getElementById('modal-edit-petisi').style.display = 'flex';
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// ------------------------------------------------------------
// 6. PROSES UPDATE (KIRIM KE PHP)
// ------------------------------------------------------------
async function prosesUpdateRelawan(e) {
    e.preventDefault();
    const f = new FormData();
    f.append('action', 'update');
    f.append('id', document.getElementById('edit-rel-id').value);
    f.append('nama_lengkap', document.getElementById('edit-rel-nama').value);
    f.append('email', document.getElementById('edit-rel-email').value);
    f.append('no_hp', document.getElementById('edit-rel-hp').value);
    f.append('pekerjaan', document.getElementById('edit-rel-pekerjaan').value);
    f.append('domisili', document.getElementById('edit-rel-domisili').value);
    f.append('alasan', document.getElementById('edit-rel-alasan').value);

    const res = await fetch('php/api_relawan.php', { method: 'POST', body: f });
    const result = await res.json();
    alert(result.message); if(result.status === 'success') { closeModal('modal-edit-relawan'); loadRelawan(); }
}

async function prosesUpdateDonasi(e) {
    e.preventDefault();
    const f = new FormData();
    f.append('action', 'update');
    f.append('id', document.getElementById('edit-don-id').value);
    f.append('nama_donatur', document.getElementById('edit-don-nama').value);
    f.append('email', document.getElementById('edit-don-email').value);
    f.append('jumlah', document.getElementById('edit-don-jumlah').value);
    f.append('status', document.getElementById('edit-don-status').value);

    const res = await fetch('php/api_donasi.php', { method: 'POST', body: f });
    const result = await res.json();
    alert(result.message); if(result.status === 'success') { closeModal('modal-edit-donasi'); loadDonasi(); loadStats(); }
}

async function prosesUpdatePetisi(e) {
    e.preventDefault();
    const f = new FormData();
    f.append('action', 'update');
    f.append('id', document.getElementById('edit-pet-id').value);
    f.append('judul', document.getElementById('edit-pet-judul').value);
    f.append('deskripsi', document.getElementById('edit-pet-desc').value);
    f.append('target', document.getElementById('edit-pet-target').value);
    
    const file = document.getElementById('edit-pet-gambar').files[0];
    if(file) f.append('gambar', file);

    const res = await fetch('php/api_petisi.php', { method: 'POST', body: f });
    const result = await res.json();
    alert(result.message); if(result.status === 'success') { closeModal('modal-edit-petisi'); loadPetisiAdmin(); }
}

// Bukti Donasi & Tambah Petisi Baru
function lihatBukti(f) {
    document.getElementById('img-bukti-preview').src = 'img/uploads/' + f;
    document.getElementById('modal-bukti').style.display = 'flex';
}

async function simpanPetisi(e) {
    e.preventDefault();
    const f = new FormData();
    f.append('action', 'create');
    f.append('judul', document.getElementById('judul-petisi').value);
    f.append('deskripsi', document.getElementById('desc-petisi').value);
    f.append('target', document.getElementById('target-petisi').value);
    f.append('gambar', document.getElementById('gambar-petisi').files[0]);

    const res = await fetch('php/api_petisi.php', { method:'POST', body:f });
    const resJson = await res.json();
    if(resJson.status === 'success') { alert("Berhasil!"); toggleFormPetisi(); loadPetisiAdmin(); e.target.reset(); }
}