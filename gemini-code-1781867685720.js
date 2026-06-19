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
    // 2. USER SIDE: DRAG & DROP UPLOAD REQUEST GAMBAR
    // ==========================================================================
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const submitUploadBox = document.getElementById('submitUploadBox');
    const btnKirimFoto = document.getElementById('btnKirimFoto');

    let selectedFiles = [];

    if (uploadArea && fileInput) {
        // Trigger klik pada area drag & drop
        uploadArea.addEventListener('click', (e) => {
            if (e.target !== fileInput && !e.target.closest('.btn-secondary-sm')) {
                fileInput.click();
            }
        });

        fileInput.addEventListener('change', (e) => {
            handleUserFiles(e.target.files);
        });

        // Efek Drag over
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-color)';
            uploadArea.style.background = '#f0fdf4';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#cbd5e1';
            uploadArea.style.background = 'var(--bg-light)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#cbd5e1';
            uploadArea.style.background = 'var(--bg-light)';
            handleUserFiles(e.dataTransfer.files);
        });
    }

    function handleUserFiles(files) {
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (selectedFiles.length + validFiles.length > 10) {
            alert('Maksimal pengunggahan adalah 10 gambar.');
            return;
        }

        validFiles.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} terlalu besar. Maksimal ukuran file adalah 5MB.`);
                return;
            }
            selectedFiles.push(file);
            displayUserPreviews();
        });
    }

    function displayUserPreviews() {
        if (!imagePreviewContainer) return;
        imagePreviewContainer.innerHTML = '';

        if (selectedFiles.length > 0) {
            submitUploadBox.style.display = 'block';
        } else {
            submitUploadBox.style.display = 'none';
        }

        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const previewItem = document.createElement('div');
                previewItem.style.position = 'relative';
                previewItem.className = 'preview-image-item';
                previewItem.innerHTML = `
                    <img src="${reader.result}" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:8px; border:1px solid var(--border-color);" />
                    <button class="delete-user-img" data-index="${index}" style="position:absolute; top:4px; right:4px; background:rgba(0,0,0,0.6); color:white; border:none; border-radius:50%; width:22px; height:22px; cursor:pointer; font-size:11px;">&times;</button>
                `;
                imagePreviewContainer.appendChild(previewItem);
            };
        });
    }

    // Hapus foto request pilihan user sebelum dikirim
    if (imagePreviewContainer) {
        imagePreviewContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-user-img')) {
                const idx = parseInt(e.target.getAttribute('data-index'));
                selectedFiles.splice(idx, 1);
                displayUserPreviews();
            }
        });
    }

    // Kirim Request Jastip Gambar via WhatsApp
    if (btnKirimFoto) {
        btnKirimFoto.addEventListener('click', () => {
            const waMessage = encodeURIComponent("Halo MaunyaJastip, saya ingin melakukan Custom Request Jastip barang berdasarkan foto yang saya lampirkan ini.");
            const waLink = `https://wa.me/6285176712394?text=${waMessage}`;
            window.open(waLink, '_blank');
        });
    }


    // ==========================================================================
    // 3. OWNER SIDE: LOGIKA UPLOAD & KATALOG PRODUK DINAMIS
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