document.addEventListener("DOMContentLoaded", () => {
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");

    // 1. PINDAH TAB
    if (tabLogin && tabRegister) {
        tabLogin.addEventListener("click", () => {
            tabLogin.classList.add("active"); tabRegister.classList.remove("active");
            formLogin.style.display = "block"; formRegister.style.display = "none";
        });
        tabRegister.addEventListener("click", () => {
            tabRegister.classList.add("active"); tabLogin.classList.remove("active");
            formRegister.style.display = "block"; formLogin.style.display = "none";
        });
    }

    // 2. FUNGSI KIRIM DATA (FETCH JSON)
    async function postData(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const text = await response.text(); 
            try {
                return JSON.parse(text); 
            } catch (e) {
                console.error("Format Response Bukan JSON:", text);
                return { status: 'error', message: 'Format response server rusak.' };
            }
        } catch (error) {
            return { status: 'error', message: 'Gagal terhubung ke database. Cek XAMPP!' };
        }
    }

    // 3. LOGIN
    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = formLogin.querySelector("button");
            btn.textContent = "Memproses..."; btn.disabled = true;

            const result = await postData('php/auth.php', {
                action: 'login',
                email: document.getElementById("login-email").value,
                password: document.getElementById("login-password").value,
                role: 'user'
            });

            btn.textContent = "Masuk Sekarang"; btn.disabled = false;

            if (result.status === 'success') {
                // --- BAGIAN YANG DIPERBAIKI ---
                localStorage.setItem("userId", result.data.id);   // <--- SIMPAN ID USER (WAJIB!)
                localStorage.setItem("userRole", result.data.role);
                localStorage.setItem("userName", result.data.nama);
                // ------------------------------

                alert(`Login Berhasil! Halo, ${result.data.nama}`);
                window.location.href = result.data.role === 'admin' ? "admin-panel.html" : "index.html";
            } else {
                alert(result.message);
            }
        });
    }

    // 4. REGISTER
    if (formRegister) {
        formRegister.addEventListener("submit", async (e) => {
            e.preventDefault();
            const result = await postData('php/auth.php', {
                action: 'register',
                nama: document.getElementById("reg-name").value,
                email: document.getElementById("reg-email").value,
                password: document.getElementById("reg-password").value
            });

            if (result.status === 'success') {
                alert(result.message);
                tabLogin.click();
            } else {
                alert(result.message);
            }
        });
    }
});