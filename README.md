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

## Perubahan struktur sheet PEMBAYARAN

Versi pembayaran multi-bulan memakai urutan kolom:

`ID | ID_GRUP | TANGGAL | BULAN | TAHUN | ID_SISWA | NAMA_SISWA | NOMINAL | STATUS | KETERANGAN | CREATED_AT`

- `ID` tetap unik untuk setiap baris pembayaran bulanan.
- `ID_GRUP` sama untuk semua bulan yang dibayar dalam satu transaksi.
- `KETERANGAN` menyimpan catatan opsional.
- `CREATED_AT` menyimpan waktu pencatatan.

Untuk sheet lama, jangan hanya menyisipkan kolom secara manual. Setelah mengganti `Code.gs`, jalankan `setupSpreadsheet()` atau `migratePembayaranSheet()` satu kali. Fungsi migrasi mempertahankan semua pembayaran lama, menambahkan `ID_GRUP` unik pada tiap baris lama, dan menyusun ulang kolom secara otomatis. Sebaiknya buat salinan Google Sheets sebelum migrasi.

## Deploy Google Apps Script

1. Klik **Deploy → New deployment**.
2. Pilih jenis **Web app**.
3. Atur **Execute as** menjadi akun Anda.
4. Atur akses menjadi **Anyone**.
5. Deploy dan salin URL Web App.
6. Isi konstanta `API_URL` pada `app.js` dengan URL tersebut.

Jika Apps Script pernah di-deploy sebelumnya:

1. Simpan `Code.gs` terbaru.
2. Jalankan `setupSpreadsheet()` satu kali untuk migrasi.
3. Buka **Deploy → Manage deployments**.
4. Edit deployment Web App yang aktif.
5. Pilih **New version**, lalu klik **Deploy**.
6. URL Web App tetap dapat digunakan jika deployment yang sama diperbarui.

Selama URL belum diisi, aplikasi berjalan dalam mode demo dan menyimpan data uji pada penyimpanan lokal browser.

## Deploy ke GitHub Pages

1. Buat repository GitHub dan unggah seluruh file proyek.
2. Buka **Settings → Pages**.
3. Pada **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih branch `main` dan folder `/ (root)`, lalu simpan.
5. Buka alamat GitHub Pages yang diberikan.

Karena service worker memerlukan HTTPS, fitur pemasangan PWA akan aktif pada GitHub Pages dan tidak selalu aktif jika file dibuka langsung dari penyimpanan HP.

Untuk memperbarui GitHub Pages, unggah atau push semua file yang berubah ke branch yang dipakai Pages. Tunggu proses Pages selesai, lalu tutup dan buka kembali aplikasi. Cache PWA sudah dinaikkan ke versi `v3`.

## Menguji pembayaran multi-bulan

1. Buka **Pembayaran → Input Pembayaran**.
2. Cari dan pilih siswa yang belum membayar.
3. Pilih tanggal serta bulan mulai.
4. Uji pilihan **3 Bulan**, **6 Bulan**, dan **12 Bulan** secara bergantian.
5. Pastikan daftar bulan, jumlah bulan, dan total berubah otomatis.
6. Simpan lalu periksa sheet `PEMBAYARAN`: setiap bulan harus menjadi satu baris dan semua baris transaksi yang sama harus memiliki `ID_GRUP` yang sama.
7. Uji ulang periode yang sebagian sudah lunas. Aplikasi harus menampilkan bulan duplikat dan hanya menyimpan bulan yang belum lunas setelah konfirmasi.

Pilihan **Pilih Manual** memungkinkan beberapa checkbox bulan dipilih secara bebas.

## Menguji preview dan PDF laporan

1. Buka menu **Laporan**.
2. Pilih bulan dan tahun, lalu isi nama kelas dan bendahara.
3. Tekan **Preview Laporan**.
4. Pastikan saldo awal, ringkasan, siswa sudah/belum bayar, pemasukan, pengeluaran, dan tanda tangan berada dalam satu preview.
5. Tekan **Buat PDF** atau **Unduh PDF**, lalu pilih **Save as PDF** pada dialog cetak browser.
6. Periksa ukuran A4 portrait, perpindahan halaman, header tabel, dan tidak adanya navigasi aplikasi pada hasil PDF.
7. Tekan **Bagikan** pada browser yang mendukung Web Share API. Jika tidak didukung, aplikasi menampilkan petunjuk menggunakan Unduh PDF.

## Laporan tahun ajaran

Menu **Laporan** sekarang memiliki dua pilihan:

- **Tahun Ajaran** sebagai pilihan utama, mencakup Juli sampai Juni.
- **Bulanan** untuk mempertahankan laporan satu bulan yang sudah tersedia.

Tahun ajaran dibuat dinamis dari data pembayaran, pemasukan, dan pengeluaran, dengan tahun sebelum, saat ini, dan sesudahnya tetap tersedia.

Laporan tahunan membedakan dua angka berikut:

- **Penerimaan Kas Aktual**: pembayaran siswa dikelompokkan berdasarkan `ID_GRUP` dan dihitung satu kali pada tanggal uang diterima. Nilai ini dipakai untuk arus kas dan saldo nyata.
- **Alokasi Pembayaran Bulanan**: setiap baris pembayaran dihitung pada `BULAN` dan `TAHUN` peruntukannya. Nilai ini dipakai untuk status lunas dan alokasi kas setiap bulan.

Contoh pembayaran 12 bulan sebesar Rp120.000 pada Juli:

- Penerimaan aktual Juli adalah Rp120.000.
- Alokasi pembayaran Juli sampai Juni masing-masing Rp10.000.
- Saldo akhir hanya menambahkan Rp120.000 satu kali, bukan menambahkan Rp120.000 aktual dan Rp120.000 alokasi.

PDF tahun ajaran memuat ringkasan arus kas aktual, pembayaran diterima di muka, rekap 12 bulan, tabel penerimaan aktual, status pembayaran per bulan, seluruh pemasukan lain, dan seluruh pengeluaran dalam satu dokumen.

Setelah memperbarui `Code.gs`, deploy ulang sebagai versi baru melalui **Deploy → Manage deployments → Edit → New version → Deploy**. Action tahunan yang tersedia:

- `getLaporanTahunAjaran`
- `getRekapBulananTahunAjaran`
- `getPenerimaanKasAktual`
- `getAlokasiPembayaranBulanan`
- `getPemasukanTahunAjaran`
- `getPengeluaranTahunAjaran`
- `getSaldoAwalTahunAjaran`

Untuk mengirim revisi frontend ke GitHub:

```bash
git add index.html style.css app.js Code.gs README.md
git commit -m "Add annual school-year reports"
git push origin main
```

## Memasang di HP

### Android / Chrome

Buka aplikasi dari Chrome, pilih menu tiga titik, lalu pilih **Tambahkan ke layar utama** atau **Instal aplikasi**.

### iPhone / Safari

Buka aplikasi dari Safari, tekan tombol **Bagikan**, lalu pilih **Tambahkan ke Layar Utama**.

## Memperbarui cache PWA

Jika file frontend diubah, naikkan versi `CACHE_NAME` pada `service-worker.js`, misalnya dari `buku-kas-b2-v1` menjadi `buku-kas-b2-v2`. Ini memastikan perangkat mengambil versi aplikasi terbaru.
