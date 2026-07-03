// script.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Log Berhasil
    console.log("MaunyaJastip script loaded successfully.");

    // 2. Fitur Smooth Scroll untuk Navigasi Menu
    const navLinks = document.querySelectorAll('.nav-links a, .hero-content .btn');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Memastikan link adalah anchor internal (diawali dengan #)
            if (targetId.startsWith('#')) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
