SISTEM CARIAN SLIP PAJSK - GITHUB PAGES + GOOGLE DRIVE + APPS SCRIPT
==================================================================

KANDUNGAN:
- index.html: halaman carian ibu bapa untuk GitHub Pages
- Code.gs: backend carian PDF daripada folder Google Drive persendirian
- pisahkan_pdf.py: alat guru memisahkan PDF pukal menjadi PDF setiap MyKad

1) ASINGKAN PDF PUKAL (komputer guru)
   Pasang Python dan jalankan:
      pip install pymupdf
      python pisahkan_pdf.py PAJSK_PUKAL.pdf --output slip_individu
   Hasilnya fail 12digitIC.pdf dan semakan_slip.csv. Semak beberapa fail secara manual.
   PDF dimuat naik ke Google Drive, BUKAN ke GitHub.

2) GOOGLE DRIVE
   - Cipta folder baharu, contoh 'Slip PAJSK Individu'.
   - Kekalkan akses folder sebagai Restricted, bukan Anyone with the link.
   - Muat naik SEMUA fail .pdf dari folder slip_individu.
   - Salin ID folder daripada URL https://drive.google.com/drive/folders/ID_FOLDER
   - Untuk penambahan pada masa depan: jalankan alat pemisah pada fail pukal baharu,
     kemudian muat naik PDF individu ke folder sama. Jika ID bertindih, gantikan
     atau gunakan nama IC_TAHUN.pdf untuk menyimpan sesi berlainan.
   - Sistem memilih fail yang paling baharu diubah suai sekiranya ada lebih satu.

3) GOOGLE APPS SCRIPT
   - Buka https://script.google.com > New project.
   - Paste keseluruhan kandungan Code.gs dalam fail Code.gs.
   - Project Settings > Script properties > Add script property:
         Property: PAJSK_FOLDER_ID
         Value: ID_FOLDER_DRIVE_ANDA
   - Deploy > New deployment > Web app.
   - Execute as: Me. Who has access: Anyone (untuk carian awam).
   - Authorize. Copy Web App URL berakhir /exec.
   - PERHATIAN: akses berdasarkan MyKad sahaja adalah tahap pengesahan rendah.
     Untuk rekod murid yang sensitif, pertimbangkan PIN kedua atau pengesahan penjaga.

4) GITHUB
   - Buka index.html, ubah CONFIG.APPS_SCRIPT_URL kepada URL /exec tadi.
   - Ubah CONFIG.SCHOOL_NAME kepada nama sekolah.
   - Cipta repositori GitHub. Muat naik index.html SAHAJA (atau README yang tidak
     mengandungi maklumat murid). Tidak perlu upload Code.gs atau Python ke GitHub.
   - Settings > Pages > Deploy from a branch > main / (root) > Save.
   - Buka pautan GitHub Pages, masukkan IC murid ujian.

5) CETAK
   - Klik Cetak / Simpan PDF. Slip dibuka dalam tab baharu.
   - Gunakan ikon Print pelayar / Ctrl+P (Cmd+P pada Mac).
   - Pilih pencetak fizikal ATAU Save as PDF / Simpan sebagai PDF.
   - Dialog memilih pencetak dikawal oleh pelayar/OS, bukan kod laman web.

PERLINDUNGAN DATA
   - Jangan jadikan folder Drive publik; jangan letak PDF, MyKad, atau CSV pada GitHub.
   - Carian hanya melalui Apps Script yang berjalan menggunakan akaun pemilik.
   - Pengguna yang tahu nombor IC 12 digit masih boleh mendapatkan slip.
   - Had kadar per IC membantu secara terhad tetapi bukan pertahanan menyeluruh.
   - Untuk pengeluaran sebenar, sekolah perlu semak dan luluskan kaedah kawalan akses
     serta kepatuhan terhadap dasar perlindungan data murid.
   - Apps Script diakses menggunakan JSONP untuk keserasian GitHub Pages. JSONP tidak
     setanding API tersahih dan perlu dinilai sebelum penggunaan sebenar.

NOTA: Sistem ini bukan pemproses PDF pukal automatik di Drive; pemisahan dibuat
menggunakan skrip Python pada komputer guru. Sambungan Drive tidak disediakan
sehingga ID folder dan URL Apps Script anda diisi.
