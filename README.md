# Buku Kas Kelas B2 – Cerdas dan Mandiri

Aplikasi mobile-first untuk mengelola kas bulanan siswa, pemasukan lain, pengeluaran, dan rekap kelas. Frontend menggunakan HTML, CSS, dan JavaScript murni. Backend menggunakan Google Apps Script dan Google Sheets.

## Menyiapkan Google Sheets

1. Buat satu Google Sheets baru.
2. Buka **Extensions → Apps Script**.
3. Salin seluruh isi `Code.gs` ke editor Apps Script.
4. Salin ID spreadsheet dari URL Google Sheets:
   `https://docs.google.com/spreadsheets/d/ID_SPREADSHEET/edit`
5. Isi konstanta `SPREADSHEET_ID` di `Code.gs`.
6. Jalankan fungsi `setupSpreadsheet()` satu kali dan berikan izin yang diminta.

Fungsi tersebut membuat empat sheet berikut tanpa menghapus data yang sudah ada:

- `SISWA`
- `PEMBAYARAN`
- `PEMASUKAN`
- `PENGELUARAN`

Tambahkan daftar siswa pada sheet `SISWA`. Isi `ID` dengan nilai unik, `NAMA_SISWA` dengan nama siswa, dan `STATUS` dengan `AKTIF`.

## Deploy Google Apps Script

1. Klik **Deploy → New deployment**.
2. Pilih jenis **Web app**.
3. Atur **Execute as** menjadi akun Anda.
4. Atur akses menjadi **Anyone**.
5. Deploy dan salin URL Web App.
6. Isi konstanta `API_URL` pada `app.js` dengan URL tersebut.

Selama URL belum diisi, aplikasi berjalan dalam mode demo dan menyimpan data uji pada penyimpanan lokal browser.

## Deploy ke GitHub Pages

1. Buat repository GitHub dan unggah seluruh file proyek.
2. Buka **Settings → Pages**.
3. Pada **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih branch `main` dan folder `/ (root)`, lalu simpan.
5. Buka alamat GitHub Pages yang diberikan.

Karena service worker memerlukan HTTPS, fitur pemasangan PWA akan aktif pada GitHub Pages dan tidak selalu aktif jika file dibuka langsung dari penyimpanan HP.

## Memasang di HP

### Android / Chrome

Buka aplikasi dari Chrome, pilih menu tiga titik, lalu pilih **Tambahkan ke layar utama** atau **Instal aplikasi**.

### iPhone / Safari

Buka aplikasi dari Safari, tekan tombol **Bagikan**, lalu pilih **Tambahkan ke Layar Utama**.

## Memperbarui cache PWA

Jika file frontend diubah, naikkan versi `CACHE_NAME` pada `service-worker.js`, misalnya dari `buku-kas-b2-v1` menjadi `buku-kas-b2-v2`. Ini memastikan perangkat mengambil versi aplikasi terbaru.
