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
      title: "Konten Kreator Cafe",
      year: "2026",
      desc: "Membuat konten visual, foto produk, dan materi promosi untuk media sosial sebuah kafe.",
      tags: ["Media Sosial", "Konten Kreator"],
      link: "#konten" // mengarah ke bagian Konten Video di bawah
    },
    {
      title: "Latihan Struktur Data dengan Bahasa C",
      year: "2026",
      desc: "Implementasi linked list dan operasinya dalam bahasa C, dikerjakan bersama tim.",
      tags: ["C", "Struktur Data"],
      link: ""
    }
  ],

  /* Video karya Anda. Salin satu blok { ... } untuk tiap video.
     url bisa berupa: link YouTube (termasuk Shorts), link Google Drive,
     file video di folder yang sama (mis. "video/promo.mp4"),
     atau link TikTok/Instagram (tampil sebagai tombol "Tonton di ...").
     vertical: true  -> untuk video tegak (Reels, TikTok, Shorts).
     Selama daftar ini kosong, bagian Konten Video otomatis disembunyikan. */
  videos: [
    // {
    //   title: "Promo menu baru",
    //   desc: "Video promosi untuk Instagram kafe.",
    //   url: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
    //   vertical: false
    // },
    // {
    //   title: "Reels suasana kafe",
    //   desc: "Konten harian untuk akun kafe.",
    //   url: "https://www.instagram.com/reel/XXXXXXXXXXX/",
    //   vertical: true
    // }
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
      title: "Teman Circle",
      sub: "Konten Kreator",
      desc: "Membuat konten visual, foto produk, dan materi promosi untuk media sosial."
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
      { label: "LinkedIn", url: "https://linkedin.com/" },   // ganti dengan akun Anda
      { label: "Instagram", url: "https://www.instagram.com/rifanalazis__/" }
    ]
  }
};
