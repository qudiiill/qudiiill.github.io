# MaunyaJastip - Website Layanan Jastip

Website statis untuk layanan jastip (jasa titip) belanja internasional.

## Fitur

- ✨ Design modern dan responsive
- 🎨 Animasi halus dan interaktif
- 📱 Mobile-friendly
- 🚀 Performa cepat (static site)
- 💼 Profesional dan user-friendly

## Cara Deploy ke GitHub Pages

1. **Buat Repository Baru di GitHub**
   - Buka GitHub.com dan login
   - Klik tombol "New" untuk membuat repository baru
   - Beri nama repository (misalnya: `maunyajastip`)
   - Centang "Public"
   - Klik "Create repository"

2. **Upload File ke Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO-NAME.git
   git push -u origin main
   ```

3. **Aktifkan GitHub Pages**
   - Buka repository di GitHub
   - Klik tab "Settings"
   - Scroll ke bagian "Pages"
   - Di "Source", pilih branch "main" dan folder "/ (root)"
   - Klik "Save"
   - Website akan tersedia di `https://USERNAME.github.io/REPO-NAME/`

## Kustomisasi

### Mengganti Informasi Kontak

Edit file `index.html` pada bagian kontak:
- Nomor WhatsApp: Ganti `6281234567890` dengan nomor Anda
- Username Instagram: Ganti `@maunyajastip` dengan username Anda
- Email: Ganti `info@maunyajastip.com` dengan email Anda

### Mengganti Warna

Edit file `style.css` pada bagian `:root`:
```css
:root {
    --primary-color: #ff6b6b;     /* Warna utama */
    --secondary-color: #4ecdc4;   /* Warna sekunder */
    --dark-color: #2c3e50;        /* Warna gelap */
}
```

### Menambah/Mengurangi Layanan

Edit bagian `<section id="layanan">` di `index.html`

## Struktur File

```
maunyajastip/
├── index.html      # Halaman utama
├── style.css       # Stylesheet
├── script.js       # JavaScript untuk interaktivitas
└── README.md       # Dokumentasi
```

## Browser Support

- Chrome (terbaru)
- Firefox (terbaru)
- Safari (terbaru)
- Edge (terbaru)
- Mobile browsers

## Lisensi

Bebas digunakan untuk keperluan pribadi atau komersial.

---

Dibuat dengan ❤️ untuk kemudahan layanan jastip Anda
