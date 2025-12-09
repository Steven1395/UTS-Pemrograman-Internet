document.addEventListener("DOMContentLoaded", () => {
    
    /* 1. TAB SWITCHER (Login <-> Register) */
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLoginUser = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener("click", () => {
            tabLogin.classList.add("active");
            tabRegister.classList.remove("active");
            formLoginUser.classList.add("active");
            formRegister.classList.remove("active");
        });
        tabRegister.addEventListener("click", () => {
            tabRegister.classList.add("active");
            tabLogin.classList.remove("active");
            formRegister.classList.add("active");
            formLoginUser.classList.remove("active");
        });
    }

    /* 2. FUNGSI FETCH KE PHP */
    async function authRequest(dataPayload) {
        try {
            const response = await fetch('php/auth.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataPayload)
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            alert("Gagal terhubung ke server database.");
            return { status: 'error' };
        }
    }

    /* 3. HANDLE REGISTER USER */
    if (formRegister) {
        formRegister.addEventListener("submit", async (e) => {
            e.preventDefault();
            const result = await authRequest({
                action: 'register',
                nama: document.getElementById("reg-name").value,
                email: document.getElementById("reg-email").value,
                password: document.getElementById("reg-password").value
            });

            if (result.status === 'success') {
                alert(result.message);
                window.location.reload(); // Refresh agar bisa login
            } else {
                alert(result.message);
            }
        });
    }

    /* 4. HANDLE LOGIN USER BIASA */
    if (formLoginUser) {
        formLoginUser.addEventListener("submit", async (e) => {
            e.preventDefault();
            const result = await authRequest({
                action: 'login',
                role: 'user', // Identitas User
                email: document.getElementById("login-email").value,
                password: document.getElementById("login-password").value
            });
            handleLoginResult(result);
        });
    }

    /* 5. HANDLE LOGIN ADMIN */
    const formAdmin = document.getElementById("form-admin-login");
    if (formAdmin) {
        formAdmin.addEventListener("submit", async (e) => {
            e.preventDefault();
            const result = await authRequest({
                action: 'login',
                role: 'admin', // Identitas Admin
                email: document.getElementById("admin-email").value,
                password: document.getElementById("admin-password").value
            });
            handleLoginResult(result);
        });
    }

    /* FUNGSI SUKSES LOGIN */
    function handleLoginResult(result) {
        if (result.status === 'success') {
            // Simpan data sesi ke browser
            localStorage.setItem("userRole", result.data.role);
            localStorage.setItem("userName", result.data.nama);
            alert(`Login Berhasil! Halo, ${result.data.nama}`);
            window.location.href = "index.html"; // Redirect ke home
        } else {
            alert(result.message); // Tampilkan error dari PHP
        }
    }
});