Buatlah sebuah aplikasi yang digunakan untuk melakukan pengelolaan perjalanan dinas (perdin) pegawai dalam sebuah perusahaan. Aplikasi ini ditujukan untuk mencatat perjalanan dinas dan besaran nominal uang saku yang diberikan kepada pegawai selama tugas untuk dinasnya.

Spesifikasi aplikasi tersebut adalah :
1. Setiap user harus memiliki akses dalam bentuk username / password. Admin aplikasi dapat mengatur role untuk masing-masing user ke role seperti PEGAWAI atau DIVISI-SDM.

2. User pegawai dapat mengajukan perdin, dengan data berupa :
    a. Maksud tujuan perdin dalam bentuk teks
    b. Tanggal berangkat
    c. Tanggal pulang
    d. Kota asal
    e. Kota tujuan
    f. Durasi perdin, dikalkulasi otomatis berdasarkan tanggal berangkat dan pulang
Data kota asal dan tujuan dikelola dalam bentuk master data kota yang memuat data nama kota, koordinat latitude dan longitude, nama provinsi dari kota tersebut, dan nama pulau dari kota tersebut.
Sebagai contoh, untuk data Kota Bandung akan berupa :
    - nama : Kota Bandung
    -Latitude : -6.917500
    -Longitude : 107.619100 
    -Provinsi : Jawa Barat
    -Pulau : Jawa
    -Luar negeri : Tidak

3. Pegawai akan mendapatkan uang saku perdin per-harinya sesuai dengan klasifikasi jaraknya, dimana :
    a. Jarak 0 – 60km : tidak mendapat uang saku
    b. Diatas 60km tetapi dalam satu provinsi mendapatkan Rp 200.000 per-hari
    c. Diatas 60km ke luar provinsi tapi masih dalam satu pulau mendapatkan Rp 250.000,-
    d. Diatas 60km ke luar provinsi dan luar pulau mendapatkan Rp 300.000,-
    e. Khusus perdin ke Luar Negeri mendapatkan USD 50 per-hari
4. Kilometer jarak dihitung dari lat-lon kota asal dan tujuan. Silakan googling untuk function hitung jaraknya berdasarkan lat-lon.

5. Setiap pengajuan perdin oleh pegawai harus diproses dan disetujui oleh bagian SDM via user dengan role SDM.

6. Pada saat approval perjalanan dinas oleh SDM ditampilkan juga total uang yang harus dibayarkan sebagai uang perdin.
