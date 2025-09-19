/*
 * File: js/components.js
 * Deskripsi: Skrip ini memuat komponen HTML (seperti header dan footer)
 * secara dinamis ke dalam halaman dan menangani logika interaktif
 * untuk komponen tersebut, seperti menu hamburger.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Fungsi untuk memuat konten HTML dari file ke dalam elemen target
    const loadComponent = (url, targetId) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Gagal memuat ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.innerHTML = html;
                }
                // Setelah header dimuat, jalankan setup untuk menu hamburger
                if (targetId === 'navbar-container') {
                    setupHamburgerMenu();
                }
            })
            .catch(error => console.error(error));
    };

    // Memuat komponen-komponen utama ke dalam div yang sesuai
    loadComponent('components/navbar.html', 'navbar-container');
    loadComponent('components/footer.html', 'footer-container');
    loadComponent('components/chatbot.html', 'chatbot-container');


    // Fungsi untuk mengatur semua logika menu hamburger
    const setupHamburgerMenu = () => {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');

        if (!hamburgerBtn || !mobileMenu || !overlay) {
            console.error('Elemen hamburger, menu, atau overlay tidak ditemukan.');
            return;
        }

        // Fungsi untuk membuka atau menutup menu
        const toggleMenu = () => {
            const isMenuOpen = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            
            hamburgerBtn.setAttribute('aria-expanded', !isMenuOpen);
            
            // Tambah/hapus kelas untuk animasi tombol dan menu
            hamburgerBtn.classList.toggle('is-active');
            mobileMenu.classList.toggle('-translate-x-full');
            
            // Tampilkan atau sembunyikan overlay
            if (!isMenuOpen) {
                overlay.classList.remove('hidden');
            } else {
                overlay.classList.add('hidden');
            }
        };

        // Event listener untuk tombol hamburger
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Mencegah event lain terpanggil
            toggleMenu();
        });

        // Event listener untuk overlay (menutup menu saat diklik)
        overlay.addEventListener('click', toggleMenu);

        // Event listener untuk menutup menu saat tombol 'Escape' ditekan
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && hamburgerBtn.getAttribute('aria-expanded') === 'true') {
                toggleMenu();
            }
        });
    };
});
