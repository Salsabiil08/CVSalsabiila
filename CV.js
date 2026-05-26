// Struktur Event Listener utama
window.addEventListener('DOMContentLoaded', () => {

    // ANIMASI 1: TYPING EFFECT
    const targetTeks = document.getElementById('animasiKetik');
    const arrayKata = ["Data Analyst", "Tech-Entrepreneurship", "Information Systems Student"];
    let urutanKata = 0;
    let urutanHuruf = 0;
    let statusHapus = false;

    function jalankanEfekKetik() {
        const kalimatAktif = arrayKata[urutanKata];
        
        if (statusHapus) {
            targetTeks.textContent = kalimatAktif.substring(0, urutanHuruf - 1);
            urutanHuruf--;
        } else {
            targetTeks.textContent = kalimatAktif.substring(0, urutanHuruf + 1);
            urutanHuruf++;
        }

        let speed = statusHapus ? 30 : 60;

        if (!statusHapus && urutanHuruf === kalimatAktif.length) {
            speed = 1800; // Diam sebentar agar terbaca jelas oleh dosen/HRD
            statusHapus = true;
        } else if (statusHapus && urutanHuruf === 0) {
            statusHapus = false;
            urutanKata = (urutanKata + 1) % arrayKata.length;
            speed = 300;
        }

        setTimeout(jalankanEfekKetik, speed);
    }
    
    if (targetTeks) jalankanEfekKetik();

    // ==========================================================================
    // INTEGRASI INDUK KENDALI SCROLL (Reveal, Counter, Progress, & Back To Top)
    // ==========================================================================
    const sections = document.querySelectorAll('.section-reveal');
    const navbar = document.getElementById('mainNavbar');
    const navLinks = document.querySelectorAll('.menu-nav a');
    const semuaIsiBar = document.querySelectorAll('.bar-isi');
    const semuaAngkaStat = document.querySelectorAll('.stat-number');
    const kembaliKeAtasBtn = document.getElementById('btnBackToTop');
    
    let statsSudahJalan = false;

    window.addEventListener('scroll', () => {
        // A. Perubahan Ukuran Navbar (Shrink)
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.add('navbar-shrink-aktif');
            } else {
                navbar.classList.remove('navbar-shrink-aktif');
            }
        }

        // B. Munculkan/Sembunyikan Tombol Back To Top
        if (kembaliKeAtasBtn) {
            if (window.scrollY > 400) {
                kembaliKeAtasBtn.classList.add('show-btn');
            } else {
                kembaliKeAtasBtn.classList.remove('show-btn');
            }
        }

        // C. Deteksi Area Pandang Komponen (Scroll Reveal & Nav Highlighting)
        const triggerLine = window.innerHeight * 0.85;
        
        sections.forEach(sec => {
            const topElement = sec.getBoundingClientRect().top;
            if (topElement < triggerLine) {
                sec.classList.add('visible-reveal');
            }

            const topScroll = window.scrollY;
            const offset = sec.offsetTop - 110;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (topScroll >= offset && topScroll < offset + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // D. Trigger Pengisian Animasi Progress Bar Keahlian
        const sectionSkill = document.getElementById('keahlian');
        if (sectionSkill && sectionSkill.classList.contains('visible-reveal')) {
            semuaIsiBar.forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }

        // E. Trigger Animasi Statistik Angka Naik
        const sectionAbout = document.getElementById('about');
        if (sectionAbout && sectionAbout.classList.contains('visible-reveal') && !statsSudahJalan) {
            semuaAngkaStat.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                let hitung = 0;
                const interval = setInterval(() => {
                    if (hitung < target) {
                        hitung++;
                        stat.textContent = hitung + "+";
                    } else {
                        clearInterval(interval);
                    }
                }, 150);
            });
            statsSudahJalan = true;
        }
    });

    // Jalankan satu kali di awal pemuatan halaman
    window.dispatchEvent(new Event('scroll'));

    // Eksekusi klik kelancaran Smooth Scroll Tombol Back to Top
    if (kembaliKeAtasBtn) {
        kembaliKeAtasBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ANIMASI 5: DARK / LIGHT MODE DENGAN LOCAL STORAGE PREFERENCE
    const toggleTema = document.getElementById('toggleTema');
    const ikonTema = document.getElementById('ikonTema');
    
    const temaAktifMemori = localStorage.getItem('mode-tema');
    if (temaAktifMemori === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (ikonTema) ikonTema.className = 'fa-solid fa-sun';
    }

    if (toggleTema && ikonTema) {
        toggleTema.addEventListener('click', () => {
            const cekTema = document.body.getAttribute('data-theme');
            if (cekTema === 'dark') {
                document.body.removeAttribute('data-theme');
                ikonTema.className = 'fa-solid fa-moon';
                localStorage.setItem('mode-tema', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                ikonTema.className = 'fa-solid fa-sun';
                localStorage.setItem('mode-tema', 'dark');
            }
        });
    }

    // MENU NAVIGATION HAMBURGER MOBILE
    const tombolMenu = document.getElementById('tombolMenuHP');
    const menuNav = document.getElementById('menuNav');

    if (tombolMenu && menuNav) {
        tombolMenu.addEventListener('click', () => {
            menuNav.classList.toggle('active-menu');
            tombolMenu.innerHTML = menuNav.classList.contains('active-menu') ? 
                '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });

        menuNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuNav.classList.remove('active-menu');
                tombolMenu.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    // FORM VALIDASI MANUAL DENGAN LAYANAN ASINKRONUS AJAX (ANTI-REDIRECT)
    const form = document.getElementById('formKirimPesan');
    const suksesBox = document.getElementById('suksesKirim');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Menahan form agar tidak berpindah halaman secara default

            const nama = document.getElementById('namaUser');
            const email = document.getElementById('emailUser');
            const pesan = document.getElementById('isiPesan');

            const salahNama = document.getElementById('salahNama');
            const salahEmail = document.getElementById('salahEmail');
            const salahPesan = document.getElementById('salahPesan');

            let isFormValid = true;

            if (nama && nama.value.trim() === "") {
                nama.classList.add('input-salah');
                if (salahNama) salahNama.style.display = 'block';
                isFormValid = false;
            } else if (nama) {
                nama.classList.remove('input-salah');
                if (salahNama) salahNama.style.display = 'none';
            }

            if (email && (email.value.trim() === "" || !email.value.includes('@'))) {
                email.classList.add('input-salah');
                if (salahEmail) salahEmail.style.display = 'block';
                isFormValid = false;
            } else if (email) {
                email.classList.remove('input-salah');
                if (salahEmail) salahEmail.style.display = 'none';
            }

            if (pesan && pesan.value.trim() === "") {
                pesan.classList.add('input-salah');
                if (salahPesan) salahPesan.style.display = 'block';
                isFormValid = false;
            } else if (pesan) {
                pesan.classList.remove('input-salah');
                if (salahPesan) salahPesan.style.display = 'none';
            }

            // Eksekusi Pengiriman Jalur AJAX (Background Process)
            if (isFormValid && suksesBox) {
                const dataForm = new FormData(form);
                
                // Menampilkan status loading awal pada kotak sukses
                suksesBox.style.display = 'block';
                suksesBox.textContent = "Sedang memproses pesan Anda...";
                suksesBox.style.backgroundColor = "#D4AF37"; // Warna emas penanda proses

                fetch(form.action, {
                    method: form.method,
                    body: dataForm,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Respons sukses dari Formspree
                        suksesBox.textContent = "Pesan berhasil terkirim langsung ke email Salsa! ✨";
                        suksesBox.style.backgroundColor = "#4BB543"; // Warna hijau sukses
                        
                        form.reset(); // Mengosongkan form hanya KETIKA data sudah sukses terkirim
                        
                        // Hilangkan kotak hijau secara otomatis setelah 4.5 detik
                        setTimeout(() => {
                            suksesBox.style.display = 'none';
                        }, 4500);
                    } else {
                        suksesBox.textContent = "Waduh, server sedang sibuk. Silakan coba kembali.";
                        suksesBox.style.backgroundColor = "#D9534F";
                    }
                })
                .catch(error => {
                    suksesBox.textContent = "Gagal terhubung. Pastikan koneksi internet Anda aktif.";
                    suksesBox.style.backgroundColor = "#D9534F";
                });
            }
        });
    }
});