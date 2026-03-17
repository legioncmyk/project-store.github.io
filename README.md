# ZALLSTORE REAL

Website marketplace modern dengan tema dark premium (hitam + merah), mobile-first, dan UX ala aplikasi.

## Fitur versi HTML/CSS/JS
- Marketplace akun game (FF, ML, PUBG, dll) dengan status: tersedia / pending / terjual.
- Filter akun berdasarkan game, rank, dan harga maksimum.
- Detail akun lengkap: level, rank, skin, bind.
- Simulasi transaksi aman + notifikasi toast.
- Login sederhana berbasis `localStorage` dengan validasi input.
- Dashboard user (profil masked, transaksi, akun terkait).
- Slider iklan, section testimoni, footer profesional.
- Bottom navbar khusus mobile (Home, Marketplace, Jasa, Akun).

## Tambahan versi React
Tersedia implementasi React terpisah di folder `react-app/`.

### Menjalankan React app
```bash
cd react-app
npm install
npm run dev
```

### Build production React
```bash
cd react-app
npm run build
```

## Catatan pengembangan
- Struktur dipisah per file agar mudah maintenance.
- Siap dikembangkan ke backend/Firebase di fase berikutnya.
