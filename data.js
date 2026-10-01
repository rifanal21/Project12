/* ============================================================
   Semua isi portofolio ada di file ini.
   Untuk memperbarui: ubah teks di bawah, simpan, lalu upload ulang.
   Tambah proyek baru = salin satu blok { ... } di "projects".
   Ingat: setiap blok dalam daftar dipisah koma, kecuali yang terakhir.
   ============================================================ */
const DATA = {
  name: "Muhammad Rifan Al Azis",
  role: "Mahasiswa Manajemen Informatika",
  tagline: "Web Portofolio saya",
  photo: "foto.jpg", // taruh foto di folder yang sama dengan index.html
  updated: "Oktober 2026",

  about: [
    "Saya mahasiswa DIII Manajemen Informatika yang tertarik pada pengembangan web, pembuatan konten, dan desain visual. Saya suka mengubah ide dan data menjadi tampilan yang bisa dipahami orang dalam sekali lihat.",
    "Saat ini saya juga terlibat di Grias Property, perusahaan properti dan arsitektur yang berfokus pada hunian tropis modern, tempat saya mengerjakan kebutuhan digitalnya."
  ],

  projects: [
    {
      title: "Website Grias Property",
      year: "2026",
      desc: "Situs satu halaman untuk memperkenalkan karya arsitektur hunian tropis modern.",
      tags: ["HTML", "CSS", "JavaScript"],
      link: "" // isi alamat web jika sudah online
    },
    {
      title: "Konten Kreator Kafe",
      year: "2026",
      desc: "Membuat konten visual, foto produk, dan materi promosi untuk media sosial sebuah kafe.",
      tags: ["Media Sosial", "Konten Kreator"],
      link: ""
    },
    {
      title: "Latihan Struktur Data dengan Bahasa C",
      year: "2026",
      desc: "Implementasi linked list dan operasinya dalam bahasa C, dikerjakan bersama tim.",
      tags: ["C", "Struktur Data"],
      link: ""
    }
  ],

  skills: [
    { group: "Web", items: ["HTML", "CSS", "JavaScript"] },
    { group: "Konten Kreator", items: ["Media sosial", "Pembuatan konten"] },
    { group: "Editing Video", items: ["CapCut", "Premiere Pro"] },
    { group: "Desain Grafis", items: ["Canva", "Adobe Illustrator"] }
  ],

  experience: [
    {
      period: "2026 – sekarang",
      title: "Grias Property",
      sub: "Website dan konten digital", // ganti dengan jabatan Anda
      desc: "Mendukung kebutuhan digital perusahaan properti dan arsitektur."
    },
    {
      period: "2025 – sekarang",
      title: "DIII Manajemen Informatika",
      sub: "Pendidikan",
      desc: "Mempelajari pengembangan web, pemrograman, dan desain grafis."
    }
  ],

  contact: {
    intro: "Terbuka untuk magang, kolaborasi proyek, dan pekerjaan seputar web, konten, dan desain.",
    email: "rifanalaziz24@gmail.com",
    links: [
      { label: "GitHub", url: "https://github.com/" },       // ganti dengan akun Anda
      { label: "LinkedIn", url: "https://linkedin.com/" },
      { label: "Instagram", url: "https://instagram.com/" }
    ]
  }
};