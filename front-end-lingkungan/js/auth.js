// File: js/auth.js (VERSI FINAL - FIX TOMBOL & SINKRON KEY)

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. DEFINISI ELEMEN ---
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");

    // --- 2. LOGIKA PINDAH TAB (MASUK <-> DAFTAR) ---
    if (tabLogin && tabRegister && formLogin && formRegister) {
        
        tabLogin.addEventListener("click", () => {
            tabLogin.classList.add("active");
            tabRegister.classList.remove("active");
            formLogin.classList.add("active");  // Tampilkan form login
            formRegister.classList.remove("active"); // Sembunyikan form register
            formLogin.style.display = "block";    // Pastikan display block
            formRegister.style.display = "none";
        });

        tabRegister.addEventListener("click", () => {
            tabRegister.classList.add("active");
            tabLogin.classList.remove("active");
            formRegister.classList.add("active"); // Tampilkan form register
            formLogin.classList.remove("active"); // Sembunyikan form login
            formRegister.style.display = "block"; 
            formLogin.style.display = "none";
        });
    }

    // --- 3. FUNGSI KIRIM DATA KE PHP (FETCH) ---
    async function postData(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await response.json(); 
        } catch (error) {
            console.error('Fetch Error:', error);
            alert("⚠️ Gagal terhubung ke server database. Cek XAMPP!");
            return { status: 'error', message: 'Koneksi gagal.' };
        }
    }

    // --- 4. HANDLE LOGIN (SAAT TOMBOL DITEKAN) ---
    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault(); // Mencegah reload halaman
            
            const emailVal = document.getElementById("login-email").value;
            const passVal = document.getElementById("login-password").value;
            const btn = formLogin.querySelector("button");
            
            // Efek Loading
            const originalText = btn.textContent;
            btn.textContent = "Memproses...";
            btn.disabled = true;

            const result = await postData('php/auth.php', {
                action: 'login',
                role: 'user', // Default login sebagai user
                email: emailVal,
                password: passVal
            });
            
            btn.textContent = originalText;
            btn.disabled = false;

            if (result.status === 'success') {
                // [PENTING] SIMPAN SESI DENGAN KUNCI YANG BENAR (userName)
                localStorage.setItem("userRole", result.data.role);
                localStorage.setItem("userName", result.data.nama);

                alert(`Login Berhasil! Halo, ${result.data.nama}`);
                
                // Cek Role untuk Redirect
                if (result.data.role === 'admin') {
                    // Admin harus login lewat admin-gate.html sebenarnya, 
                    // tapi kalau login lewat sini tetap kita arahkan ke dashboard
                    window.location.href = "admin-panel.html"; 
                } else {
                    window.location.href = "index.html"; 
                }
            } else {
                alert(result.message);
            }
        });
    }

    // --- 5. HANDLE REGISTER ---
    if (formRegister) {
        formRegister.addEventListener("submit", async (e) => {
            e.preventDefault();

            const namaVal = document.getElementById("reg-name").value;
            const emailVal = document.getElementById("reg-email").value;
            const passVal = document.getElementById("reg-password").value;
            
            const result = await postData('php/auth.php', {
                action: 'register',
                nama: namaVal,
                email: emailVal,
                password: passVal
            });

            if (result.status === 'success') {
                alert(result.message);
                // Pindah otomatis ke tab login
                tabLogin.click(); 
            } else {
                alert(result.message);
            }
        });
    }
    
    // --- 6. HANDLE LOGIN ADMIN (KHUSUS HALAMAN ADMIN-GATE.HTML) ---
    const formAdmin = document.getElementById("form-admin-login");
    if (formAdmin) {
        formAdmin.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const result = await postData('php/auth.php', {
                action: 'login',
                role: 'admin',
                email: document.getElementById("admin-email").value,
                password: document.getElementById("admin-password").value
            });

            if (result.status === 'success') {
                localStorage.setItem("userRole", result.data.role);
                localStorage.setItem("userName", result.data.nama);
                window.location.href = "admin-panel.html";
            } else {
                alert(result.message);
            }
        });
    }
});