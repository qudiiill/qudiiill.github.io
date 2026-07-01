document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. NAVIGATION & RESPONSIVE MENU
    // ==========================================================================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Ubah ikon menu bar menjadi "X" saat aktif
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Tutup menu navigasi otomatis setelah link diklik (khusus mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }

    // ==========================================================================
    // 2. OWNER SIDE: LOGIKA UPLOAD & KATALOG PRODUK DINAMIS (ADMIN PANEL)
    // ==========================================================================
    const adminDragArea = document.getElementById('adminDragArea');
    const adminFileInput = document.getElementById('adminFileInput');
    const adminImagePreview = document.getElementById('adminImagePreview');
    const adminUploadForm = document.getElementById('adminUploadForm');
    const catalogGrid = document.getElementById('catalogGrid');

    let base64ImageString = ""; // Menyimpan data string gambar produk admin

    if (adminDragArea && adminFileInput) {
        // Trigger Klik Upload Admin
        adminDragArea.addEventListener('click', () => adminFileInput.click());

        adminFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                processAdminImage(file);
            }
        });

        // Drag & Drop File Foto untuk Admin
        adminDragArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            adminDragArea.style.borderColor = 'var(--primary-color)';
            adminDragArea.style.background = '#eef2ff';
        });

        adminDragArea.addEventListener('dragleave', () => {
            adminDragArea.style.borderColor = '#94a3b8';
            adminDragArea.style.background = '#f8fafc';
        });

        adminDragArea.addEventListener('drop', (e) => {
            e.preventDefault();
            adminDragArea.style.borderColor = '#94a3b8';
            adminDragArea.style.background = '#f8fafc';
            const file = e.dataTransfer.files[0];
            if (file) {
                processAdminImage(file);
            }
        });
    }

    // Konversi file foto menjadi Base64 agar dapat diolah localstorage
    function processAdminImage(file) {
        if (!file.type.startsWith('image/')) {
            alert('File harus format gambar!');
            return;
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            base64ImageString = reader.result;
            adminImagePreview.innerHTML = `<img src="${base64ImageString}" alt="Preview Toko">`;
        };
    }

    // Handle Submit Tambah Produk Baru oleh Pemilik Toko
    if (adminUploadForm) {
        adminUploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('prodName').value;
            const price = document.getElementById('prodPrice').value;
            const category = document.getElementById('prodCategory').value;

            if (!base64ImageString) {
                alert("Silakan pilih atau seret foto produk terlebih dahulu!");
                return;
            }

            const newProduct = {
                id: Date.now(), // Unique ID penanda item
                name: name,
                price: parseInt(price).toLocaleString('id-ID'),
                category: category,
                image: base64ImageString
            };

            let currentProducts = JSON.parse(localStorage.getItem('jastip_products')) || [];
            currentProducts.unshift(newProduct); // Simpan di urutan teratas katalog
            localStorage.setItem('jastip_products', JSON.stringify(currentProducts));

            // Reset Form Admin kembali kosong
            adminUploadForm.reset();
            adminImagePreview.innerHTML = "";
            base64ImageString = "";

            renderCatalog();
            alert("Produk baru berhasil diunggah dan terbit di Katalog!");
        });
    }

    // Fungsi Render Menggambar Katalog ke Sisi Pengunjung/User
    function renderCatalog() {
        if (!catalogGrid) return;
        const products = JSON.parse(localStorage.getItem('jastip_products')) || [];
        
        if (products.length === 0) {
            catalogGrid.innerHTML = `<div class="catalog-empty">Belum ada produk yang diunggah oleh pemilik toko.</div>`;
            return;
        }

        catalogGrid.innerHTML = ""; // Reset struktur katalog lama

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            
            // Format Pesan Pembelian Otomatis ke WhatsApp Admin Jastip
            const waMessage = encodeURIComponent(`Halo MaunyaJastip, saya tertarik dan ingin memesan produk katalog ini:\n\n*Nama Barang:* ${product.name}\n*Harga:* Rp ${product.price}\n*Kategori:* ${product.category}`);
            const waLink = `https://wa.me/6285176712394?text=${waMessage}`;

            card.innerHTML = `
                <div class="product-img-box">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <button class="admin-delete-btn" onclick="deleteProduct(${product.id})" title="Hapus Produk dari Toko">
                    <i class="fas fa-trash-can"></i>
                </button>
                <div class="product-info">
                    <span class="product-cat">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">Rp ${product.price}</div>
                    <a href="${waLink}" target="_blank" class="btn btn-order-wa">
                        <i class="fab fa-whatsapp"></i> Titip Barang Ini
                    </a>
                </div>
            `;
            catalogGrid.appendChild(card);
        });
    }

    // Global Function Akses Penghapusan Item Jastip (Bisa dipanggil dari Atribut HTML inline)
    window.deleteProduct = function(id) {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini dari katalog jastip?")) {
            let products = JSON.parse(localStorage.getItem('jastip_products')) || [];
            products = products.filter(p => p.id !== id);
            localStorage.setItem('jastip_products', JSON.stringify(products));
            renderCatalog();
        }
    };

    // Muat Katalog Produk pertama kali saat seluruh halaman selesai dibuka
    renderCatalog();
});