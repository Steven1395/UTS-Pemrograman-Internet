<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dukung Kampanye Kami — Pohon Hub</title>
    <link rel="stylesheet" href="css/style.css" />
    <link rel="icon" href="img/favicon.png" type="image/png">
</head>
<body>
    <header class="site-header">
        <div class="container header-inner">
            <div class="brand">
                <a href="index.html"><img src="img/logo.png" alt="Pohon Hub Logo"></a>
            </div>
            <nav class="main-nav" id="main-nav">
                <ul>
                    <li><a href="index.html#home">Home</a></li>
                    <li><a href="index.html#about">Tentang Kami</a></li>
                    <li><a href="petisi.html">Petisi</a></li>
                    <li><a href="relawan.html">Relawan</a></li>
                    <li><a href="donasi.html" class="btn primary nav-btn">Donasi</a></li>
                </ul>
            </nav>
            <button class="nav-toggle" id="nav-toggle" aria-label="Buka menu">
                <span class="bar"></span><span class="bar"></span><span class="bar"></span>
            </button>
        </div>
    </header>

    <section class="page-hero" style="background-image: url('img/petisi-hero.jpg');">
        <div class="overlay"></div>
        <div class="hero-content container">
            <h1>Dukung Kampanye Kami</h1>
            <p>Berikan suaramu dan mari berpartisipasi aktif menyelamatkan lingkungan kita.</p>
        </div>
    </section>

    <section id="petisi" class="petisi container">
        <div class="petisi-stats grid">
            <div class="stat-item">
                <h3 class="stat-number">60.000+</h3>
                <p class="muted">orang telah mendukung kampanye kami</p>
            </div>
            <div class="stat-item">
                <h3 class="stat-number">55.000+</h3>
                <p class="muted">bibit pohon tertanam dari donasi</p>
            </div>
            <div class="stat-item">
                <h3 class="stat-number">12</h3>
                <p class="muted">kampanye aktif bisa kamu dukung</p>
            </div>
        </div>

        <div class="grid campaign-grid">
            <article class="campaign-card pill">
                <img src="img/campaign-amazon.jpg" alt="Kebakaran hutan Amazon" class="campaign-img">
                <div class="card-body">
                    <p class="muted">Hutan</p>
                    <h4>Lindungi Hutan Amazon</h4>
                    <p class="card-desc">Hutan hujan Amazon menopang kehidupan jutaan spesies dan merupakan paru-paru dunia. Lindungi Amazon...</p>
                    <a href="#" class="btn secondary">Dukung Sekarang</a>
                </div>
            </article>
            <article class="campaign-card pill">
                <img src="img/campaign-mangrove.jpg" alt="Hutan mangrove di pinggir pantai" class="campaign-img">
                <div class="card-body">
                    <p class="muted">Pesisir & Bakau</p>
                    <h4>Selamatkan Mangrove Pesisir</h4>
                    <p class="card-desc">Hutan bakau adalah benteng alami kita melawan abrasi. Proyek reklamasi di pesisir mengancam habitat penting ini...</p>
                    <a href="#" class="btn secondary">Dukung Sekarang</a>
                </div>
            </article>
            <article class="campaign-card pill">
                <img src="img/campaign-resist.jpg" alt="Aksi protes jalanan" class="campaign-img">
                <div class="card-body">
                    <p class="muted">Aksi</p>
                    <h4>Time to Resist</h4>
                    <p class="card-desc">#TimeToResist. Korporasi mencoba melonggarkan peraturan perlindungan laut dan kehutanan kita. Berikan suaramu...</p>
                    <a href="#" class="btn secondary">Dukung Sekarang</a>
                </div>
            </article>
            <article class="campaign-card pill">
                <img src="img/campaign-hutan.jpg" alt="Peta lahan dan kebakaran" class="campaign-img">
                <div class="card-body">
                    <p class="muted">Kebijakan Publik</p>
                    <h4>Keterbukaan Hutan dan Lahan</h4>
                    <p class="card-desc">Keterbukaan data dan transparansi kebijakan publik internasional kawasan terlarang perlu perhatian serius kita semua...</p>
                    <a href="#" class="btn secondary">Dukung Sekarang</a>
                </div>
            </article>
            <article class="campaign-card pill">
                <img src="img/campaign-earth.jpg" alt="Relawan membersihkan sampah" class="campaign-img">
                <div class="card-body">
                    <p class="muted">Komunitas</p>
                    <h4>Rumah untuk Earth</h4>
                    <p class="card-desc">Ajak seluruh kerabat dan rekan lingkungan. Apakah kamu mau menjadi bagian dari lingkungan hidup yang ingin melindungi tanah air kita?</p>
                    <a href="#" class="btn secondary">Bergabung</a>
                </div>
            </article>
            <article class="campaign-card pill">
                <img src="img/campaign-kuliner.jpg" alt="Anak-anak mengumpulkan sampah plastik" class="campaign-img">
                <div class="card-body">
                    <p class="muted">Plastik</p>
                    <h4>Pesta Kuliner #JanganBawaPlastik</h4>
                    <p class="card-desc">Sebanyak 20 orang mencoba membuat program ini sukses di 5 kota besar di Indonesia, dan didukung untuk Rejanglebong...</p>
                    <a href="#" class="btn secondary">Dukung Sekarang</a>
                </div>
            </article>
        </div>
    </section>

    <footer class="site-footer">
        <div class="container footer-inner">
            <div class="footer-left">
                <p><strong>Pohon Hub</strong></p>
                <p class="muted">© <span id="year"></span> Pohon Hub. Semua hak dilindungi.</p>
            </div>
            <div class="footer-right">
                <div class="socials">
                    <a href="#" aria-label="Instagram"><i data-feather="instagram"></i></a>
                    <a href="#" aria-label="Twitter"><i data-feather="twitter"></i></a>
                    <a href="#" aria-label="YouTube"><i data-feather="youtube"></i></a>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://unpkg.com/feather-icons"></script> 
    <script src="js/page-script.js"></script>
    <script>
        feather.replace();
    </script>
</body>
</html>