import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import GalleryComp from "@/features/_global/components/galeri";
import NavbarComp from "@/features/_global/components/navbar";
import { queryClient } from "@/features/_root/queryClient";
import { useQueries, useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, FileCheck, Thermometer, TrendingUp, UserCheck, UserX } from "lucide-react";
import { useEffect, useState } from "react";

let useSwipeable;
try { useSwipeable = require("react-swipeable").useSwipeable; } catch { useSwipeable = () => ({}) }

const GLOBAL_DATA: any = {
  announcements: [
    { title: "Edaran Dinas: Libur Nasional & Cuti Bersama", date: "05 Sep 2025", tag: "Dinas", source: "dinas" },
  ],
  news: [
    { title: "Program Magang Terpadu DKI", date: "18 Agu 2025", tag: "Dinas", source: "dinas", img: '/slide1.jpg', excerpt: "Dinas Pendidikan meluncurkan skema magang terpadu lintas industri untuk SMK di DKI Jakarta." },
  ],
};

const ANNOUNCEMENTS_TENANT: any = [
  { title: "PPDB 2025 Tahap 1 Dibuka", date: "06 Sep 2025", tag: "Akademik", source: "local" },
  { title: "Pengambilan Rapor Semester Ganjil", date: "31 Okt 2025", tag: "Kesiswaan", source: "local" },
];

const MERGED_ANNOUNCEMENTS: any = [
  ...GLOBAL_DATA.announcements.map((a: any) => ({ title: a.title, desc: `${a.tag}: ${a.title} — ${a.date}`, _meta: a })),
  ...ANNOUNCEMENTS_TENANT.map((a: any) => ({ title: a.title, desc: `${a.tag}: ${a.title} — ${a.date}`, _meta: a })),
];

const SafeImage = ({ src, alt, className, style }: any) => {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={className} aria-label={alt || 'image'}
           style={{ ...style, background: "repeating-linear-gradient(45deg, #e2e8f0 0 10px, #cbd5e1 10px 20px)" }} />
    );
  }
  return <img src={src} alt={alt || ''} className={className} style={style} loading="lazy" decoding="async"
              referrerPolicy="no-referrer" crossOrigin="anonymous" onError={() => setFailed(true)} />;
};

const Badge = ({ children, theme }: any) => (
  <span className="px-3 py-1 text-xs font-medium rounded-full border"
        style={{ background: theme.accent + "30", color: theme.accentText, borderColor: theme.accent }}>
    {children}
  </span>
);

// Hooks tetap sama (tidak berubah)
const useHeroSlides = () => {
  const xHost = getXHostHeader();
  return useQuery({
    queryKey: ['heroSlides', xHost],
    queryFn: async () => {
      const res = await fetch("https://dev.kiraproject.id/beranda", {
        cache: 'no-store',
        headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
      });
      if (!res.ok) throw new Error("Failed to fetch hero slides");
      const data = await res.json();
      return data.heroSlides.map((s: any) => ({
        title: s.title,
        desc: s.desc,
        img: s.img,
        cta1: { href: s.cta1Href || "#", label: s.cta1Label || "Lihat Detail" },
        cta2: { href: s.cta2Href || "#", label: s.cta2Label || "Pelajari Lebih" },
      }));
    },
  });
};

const useStats = () => {
  const xHost = getXHostHeader();
  return useQuery({
    queryKey: ['stats', xHost],
    queryFn: async () => {
      const res = await fetch("https://dev.kiraproject.id/public/statistics/daily", {
        cache: 'no-store',
        headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
      });
      if (!res.ok) throw new Error("Failed to fetch statistics");
      const data = await res.json();
      if (!data.success) throw new Error("Invalid response");
      return [
        { k: "HADIR", v: data.data.hadirHariIni },
        { k: "IZIN", v: data.data.izinSakit },
        { k: "TERLAMBAT", v: data.data.terlambat },
        { k: "GURU HADIR", v: data.data.guruHadir },
      ];
    },
  });
};

const useSambutanAndHeadmasters = () => {
  const xHost = getXHostHeader();
  return useQueries({
    queries: [
      {
        queryKey: ['sambutan', xHost],
        queryFn: async () => {
          const res = await fetch("https://dev.kiraproject.id/beranda", {
            cache: 'no-store',
            headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
          });
          if (!res.ok) throw new Error("Failed to fetch sambutan");
          const data = await res.json();
          return data.sambutan;
        },
      },
      {
        queryKey: ['headmasters', xHost],
        queryFn: async () => {
          const res = await fetch("https://dev.kiraproject.id/sejarah/kepsek", {
            cache: 'no-store',
            headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
          });
          if (!res.ok) throw new Error("Failed to fetch headmasters");
          const data = await res.json();
          return data.items;
        },
      },
    ],
  });
};

const useAnnouncements = () => {
  const xHost = getXHostHeader();
  return useQuery({
    queryKey: ['announcements', xHost],
    queryFn: async () => {
      const res = await fetch(`https://dev.kiraproject.id/public/announcements?page=1&limit=10`, {
        cache: 'no-store',
        headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
      });
      const data = await res.json();
      if (!data.success) throw new Error("Failed to fetch announcements");
      return data.data;
    },
  });
};

const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const res = await fetch('https://dev.kiraproject.id/public/berita?page=1&limit=20', {
        cache: 'no-store',
        headers: { 'X-Host': "sudindikjb2.id", 'Cache-Control': 'no-store' },
      });
      const data = await res.json();
      if (!data.success) throw new Error("Failed to fetch news");
      return data.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        date: new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        tag: item.kategori,
        img: item.featuredImage || '/defaultImage.png',
        excerpt: item.excerpt,
        source: item.sumber.toLowerCase() === 'dinas' ? 'dinas' : 'api',
      }));
    },
  });
};

const Hero = ({ theme }: any) => {

  const dataHero = [
     { title: "SEKOLAH BERPRESTASI DAN BERKARAKTER", subTitle: "Jadilah bagian dari generasi berprestasi dengan fasilitas modern, pembelajaran inovatif, dan kegiatan ekstrakurikuler yang mendukung potensi terbaik Anda.", img: "/hero2.png" },
  ]
  // HeroSlider sederhana mirip referensi, menggunakan data API
  const { data: heroSlides = [], isPending } = useHeroSlides();
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const handlers = useSwipeable({ onSwipedLeft: () => setIndex((i) => (i + 1) % heroSlides.length), onSwipedRight: () => setIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length) });

  useEffect(() => {
    if (prefersReducedMotion || heroSlides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, [prefersReducedMotion, heroSlides.length]);

  if (isPending || heroSlides.length === 0) return <div className="h-[80vh] bg-gray-200 flex items-center justify-center">Loading Hero...</div>;

  // const slide = dataHero[index];

  return (
    <div className="relative h-[80vh] md:h-[85vh] overflow-hidden" {...handlers}>
      {
        dataHero.map((d: any, i: number) => (
          <div key={i}>
            <SafeImage src={`${d.img}`} alt={d.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/60" />
            <div className="absolute md:px-0 px-5 mt-[-20px] w-full mx-auto h-full flex flex-col text-left md:text-center md:items-center md:justify-center text-white">
              <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: 0 }} className="text-left md:text-center w-full h-full flex flex-col justify-center items-center leading-loose">
                <h1 className="text-3xl md:text-6xl md:w-[80%] leading-[30px] h-max font-bold relative">{d.title}</h1>
                <p className="mt-6 text-md md:text-lg md:max-w-3xl text-gray-300">{d.subTitle}</p>
                <div className="mt-8 flex gap-4 w-full items-center justify-center">
                  <a href={"#keunggulan"} className="md:w-max w-full px-8 py-4 rounded-md md:rounded-md font-semibold text-white bg-blue-500 shadow-lg">{"Telusuri Sekarang"}</a>
                  {/* <a href={d.cta2.href} className="px-8 py-4 rounded-full font-semibold border-2 border-white">{d.cta2.label}</a> */}
                </div>
              </motion.div>
            </div>
          </div>
        ))
      }
    </div>
  );
};

const KeunggulanSection = ({ theme }: any) => {
  const keunggulan = [
    { icon: '/i3.png', title: 'Fasilitas Modern', description: 'Kami menyediakan fasilitas lengkap seperti perpustakaan, laboratorium, dan ruang olahraga untuk mendukung kegiatan pembelajaran.' },
    { icon: '/i2.png', title: 'Guru Berpengalaman', description: 'Tenaga pendidik kami memiliki pengalaman dan dedikasi tinggi untuk memberikan pendidikan terbaik kepada siswa.' },
    { icon: '/i1.png', title: 'Prestasi Siswa', description: 'Raih prestasi di tingkat lokal, nasional, hingga internasional, dengan bimbingan dari tenaga pendidik profesional.' },
  ];

  return (
    <section className="relative" id="keunggulan">
      <div className="max-w-7xl mx-auto px-6">
        {/* <h2 className="text-3xl md:text-4xl font-bold text-left md:text-center mb-12" style={{ color: 'black' }}>Keunggulan Kami</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {keunggulan.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-white flex md:items-center justify-start flex-col rounded-xl shadow-lg p-5 md:p-8 hover:shadow-2xl transition-shadow text-left md:text-center">
              <img src={item.icon} alt="icon" className="w-10 md:w-16 h-10 md:h-16 mb-4" />
              <h3 className="text-2xl font-semibold mb-4" style={{ color: 'black' }}>{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


const SambutanSection = ({ theme }: any) => {
  const [sambutanQuery] = useSambutanAndHeadmasters();
  const sambutan = sambutanQuery.data;

  if (sambutanQuery.isPending) return <div className="py-24 text-left md:text-center">Loading sambutan...</div>;

  const stats = [
    { value: "540 +", label: "Peserta Didik" },
    { value: "45 +", label: "Guru Tendik" },
    { value: "30 +", label: "Ruangan" },
    { value: "100", label: "Penghargaan" },
  ];

  return (
    <section 
      className="pt-10 md:pt-16 pb-16 md:pb-24 z-[1] bg-white relative overflow-hidden"
      // Background dots yang lebih terlihat dan elegan
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: `
          radial-gradient(#d1d5db 1.5px, transparent 1.5px),
          radial-gradient(#e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: '44px 44px, 76px 76px',
        backgroundPosition: '0 0, 22px 22px',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-left md:text-center mb-12" style={{ color: 'black' }}>
          SAMBUTAN KEPALA SEKOLAH
        </h2>

        <div className="grid md:grid-cols-1 gap-12 items-center justify-center text-left md:text-center">
          <div className="relative">
            <div className="absolute top-0 left-0 z-10 w-48 md:w-64 -translate-y-8 md:-translate-y-12 -translate-x-4 md:-translate-x-8">
              <SafeImage 
                src="/sman25-sign.jpg"
                alt="SMAN 25 JAKARTA" 
                className="w-full" 
              />
            </div>

            {/* Foto Kepala Sekolah */}
            <div className="relative rounded-2xl overflow-hidden">
              <SafeImage 
                src={sambutan?.photo ? `https://dev.kiraproject.id${sambutan.photo}` : "/kapalaSekolah.png"}
                alt="Kepala Sekolah" 
                className="w-full h-[400px] md:h-[300px] object-contain" 
              />
            </div>
          </div>

          {/* Bagian Kanan: Teks + Stats */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="text-lg text-gray-700 leading-relaxed space-y-4">
              {sambutan?.text.split("\n").map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {/* <p className="text-lg text-gray-700 leading-relaxed space-y-4 md:w-[80%] mx-auto text-left md:text-center">
              Alhamdulillah, segala puji hanya milik Allah SWT, atas kehendak-Nya kami bisa hadir ditengah derasnya perkembangan teknologi informasi. Website sman25-jkt.sch.id kali ini merupakan update, baik dari sisi pengelolaan maupun isinya, dengan harapan dapat lebih memberikan layanan pendidikan yang prima terutama terkait informasi pendidikan.
            </p> */}

            {/* Signature */}
            <div className="mt-8">
              <p className="text-2xl font-bold" style={{ color: 'black' }}>{sambutan?.name}</p>
              <p className="text-gray-600 text-lg">Kepala Sekolah SMAN 25 Jakarta</p>
            </div>

            {/* Stats Box */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-4 border-t border-gray-300 justify-center items-center gap-8 mt-14 pt-14">
              {stats.map((stat, i) => (
                <div key={i} className="text-left md:text-center gap-3 w-full flex items-center justify-center relative">
                  <p className="text-3xl md:text-5xl font-bold" style={{ color: 'black' }}>
                    {stat.value}
                  </p>
                  <p className="text-gray-600">{stat.label}</p>
                  {i < stats.length - 1 && (
                    <div className="hidden md:block absolute w-px bg-gray-300 top-0 bottom-0 right-0 translate-x-1/2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FasilitasSection = ({ theme }: any) => {
  // Hardcoded contoh fasilitas dengan foto nyata/placeholder (ganti dengan data API/gallery jika ada)
  const fasilitas = [
    { name: 'Mushola', img: '/f1.jpg' },
    { name: 'UKS', img: '/f2.jpg' },
    { name: 'Kantin', img: '/f3.jpg' },
    { name: 'Lapangan Olahraga', img: '/f4.jpg' },
    { name: 'Laboratorium Sains', img: '/f5.jpg' },
    { name: 'Perpustakaan', img: '/f6.jpgg' },
  ];

  return (
    <section className="py-8 md:py-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: -30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          className="text-3xl md:text-5xl font-bold text-left md:text-center" 
          style={{ color: 'black' }}>
          Fasilitas Sekolah Kami
        </motion.h2>
        <p className="text-xs mb-16 text-left md:text-center mx-auto mt-3 text-gray-500">(Gambar hanyalah ilustrasi)</p>

        {/* Masonry grid responsif (2-4 kolom) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
          {fasilitas.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
              <img 
                src={item.img} 
                alt={item.name} 
                className="w-full h-full object-cover scale-110 transition-transform duration-700" 
                style={{ minHeight: '300px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity duration-500 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold">{item.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PengurusSection = ({ theme }: any) => {
  const [, headmastersQuery] = useSambutanAndHeadmasters();
  const headmasters = headmastersQuery.data || [];

  // Tambah wakil hardcoded sementara (bisa diganti API nanti)
  const pengurus = [
    ...headmasters.slice(0, 1).map((h: any) => ({ jabatan: 'Kepala Sekolah', nama: h.name })),
    { jabatan: 'Wakil Kepala Kurikulum', nama: 'Dr. Siti Nurhaliza, M.Pd', img: '/p1.png' },
    { jabatan: 'Wakil Kepala Kesiswaan', nama: 'Budi Santoso, S.Pd', img: '/p2.png' },
    { jabatan: 'Wakil Kepala Sarpras', nama: 'Ir. Rina Wati', img: '/p3.png' },
    { jabatan: 'Wakil Kepala Sarpras', nama: 'Ir. Rina Wati', img: '/p4.png' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-left md:text-center mb-12" style={{ color: 'black' }}>Pengurus Sekolah</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {pengurus.map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-blue-50 w-full to-white rounded-xl shadow-md p-4 md:p-6 text-left md:text-center border border-gray-500 md:border-blue-100 hover:shadow-xl transition-shadow">
              <img src={item.img} alt="photo" className="w-full bg-cover" />
              <h3 className="font-semibold text-lg mt-6 mb-2" style={{ color: 'black' }}>{'Pengajar'}</h3>
              <p className="text-gray-700">{'SMAN 25 Jakarta'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BeritaSection = ({ theme }: any) => {
  const { data: items = [], isPending } = useNews();
  if (isPending) return <div className="py-16 text-left md:text-center">Loading berita...</div>;

  return (
    <section className="py-0 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: 'black' }}>Berita & Pengumuman</h2>
          <TrendingUp size={40} style={{ color: 'black' }} />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((n: any, i: number) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Calendar className="text-white" size={64} />
              </div>
              <div className="p-6">
                <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: theme.accent + '40', color: 'black' }}>
                  {n.tag}
                </span>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{n.title}</h3>
                <p className="text-sm text-gray-500">{n.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VideoSection = ({ theme }: any) => {
  return (
    <section className="md:py-6">
      <div className="max-w-7xl py-6 rounded-lg mx-auto px-6">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} 
          className="text-2xl md:text-5xl text-black font-bold text-left md:text-center">
          Kegiatan Sekolah dalam Video
        </motion.h2>
        <p className="text-left md:text-center w-full mb-12 text-gray-500 mt-5">Kegiatan Senam Pagi SMAN 25 Jakarta – Jumat, 7 Juni 2024</p>

        <div className="max-w-7xl mx-auto">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/xALb_5ANJ1w" 
              title="Kegiatan Senam Pagi SMAN 25 Jakarta, Jumat 7 Juni 2024" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};
const InstagramFeedSection = ({ theme }: any) => {
  // Data post sesuai konten yang diberikan (statis, karena tidak ada akun IG resmi)
  const posts = [
   {
      username: "sman25jkt_official",
      profilePic: "/logo.jpg", // Ganti dengan foto profil sekolah jika ada
      media: "/feed2.jpg", // Foto Hari Guru
      type: "image",
      likes: 48,
      date: "25 November 2025",
      caption: "Peringatan Hari Guru Nasional, Setelah upacara hari Guru, pemberian ucapan Selamat hari Guru oleh komite SMAN 25. Pemotongan kue dan tumpeng, dilanjutkan lomba tumpeng diikuti seluruh kelas X,XI dan XII #Bangsa yang besar adalah bangsa yang menghargai jasa para Pahlawan, Guru adalah pahlawan tanpa tanda Jasa , Guru Hebat Indonesia Kuat#Selamat Hari Guru Nasional 25 November 2025 untuk semua Guru dimanapun berada#Tetaplah berkarya untuk menghasilkan Generasi Emas Indonesia",
      // comments: 5, // Estimasi
      link: "https://www.instagram.com/p/DReriL1kjS_/",
    },
    {
      username: "sman25jkt_official",
      profilePic: "/logo.jpg",
      media: "/feed1.png", // Foto pengambilan raport
      type: "image",
      likes: 36,
      date: "19 Desember 2025",
      caption: "Gerakan ayah mengambil raport kelas X,,XI dan XII #wujudkan tanggungjawab orangtua terhadap anak#Selesai sudah pengambilan raport semester Gasal 2025/2026, terimakasih Anak2, Bapak/Ibu guru yang telah bekerja sama sehingga KBM berjalan lancar semester ini, semoga prestasi Siswa/i SMAN 25 Jakarta semakin baik semester berikutnya, aamiin..#Selamat Libur Semester Ganjil 22 Desember 2025 - 4 Januari 2026#Sampai jumpa semester depan dengan Prestasi yang lebih baik lagi..",
      // comments: 8,
      link: "https://www.instagram.com/p/DSb6tUsEjzt/",
    },
    {
      username: "sman25jkt_official",
      profilePic: "/logo.jpg",
      media: "/feed.mp4", // Reel video
      type: "video",
      likes: 12,
      date: "05 Januari 2026",
      caption: "Besok kembali ke sekolah..semangat anak2",
      // comments: 3,
      link: "https://www.instagram.com/reel/DTF2DgfEqXi/",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-left md:text-center mb-12"
          style={{ color: theme.primaryText }}
        >
          Kegiatan Terbaru di Media Sosial
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.a
              key={i}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-white p-0.5">
                      <img src={post.profilePic} alt={post.username} className="w-full h-full rounded-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-black">{post.username}</p>
                    <p className="text-xs text-gray-500">{post.date}</p>
                  </div>
                </div>
                <button className="text-2xl">⋯</button>
              </div>

              {/* Media (Image or Video) */}
              <div className="aspect-square overflow-hidden relative">
                {post.type === "video" ? (
                  <video controls className="w-full h-full object-cover">
                    <source src={post.media} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={post.media} alt="Post" className="w-full h-full object-cover" />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-4xl">{post.type === "video" ? "▶️" : "📸"}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-5 text-2xl">
                  <span>❤️</span>
                  <span>💬</span>
                  <span>📤</span>
                </div>
                <span>🔖</span>
              </div>

              {/* Likes & Caption */}
              <div className="px-4 pb-4 text-black">
                <p className="font-bold text-sm">{post.likes} suka</p>
                <p className="text-sm leading-normal text-left mt-4 mb-4 line-clamp-4 text-gray-600">
                  <span className="font-bold">{post.username}</span> {post.caption}
                </p>
                {/* <p className="text-sm text-gray-500 mt-2">Lihat semua {post.comments} komentar</p> */}
                <p className="text-xs text-gray-400 mt-3">Lihat di Instagram →</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

// === STATS BAR ===
const StatsBar = ({ theme }: any) => {
  const { data: stats = [], isPending, error } = useStats();

  // Daftar icon sesuai urutan stats (sesuaikan dengan data stats kamu)
  const icons = [
      <UserCheck className="w-12 h-12 md:w-12 md:h-12 p-3 rounded-md bg-green-600 text-white" />,     // Kehadiran
      <UserX className="w-12 h-12 md:w-12 md:h-12 p-3 rounded-md bg-red-600 text-white" />,           // Alpha
      <Thermometer className="w-12 h-12 md:w-12 md:h-12 p-3 rounded-md bg-orange-600 text-white" />,  // Sakit
      <FileCheck className="w-12 h-12 md:w-12 md:h-12 p-3 rounded-md bg-blue-600 text-white" />,      // Izin
  ];

  if (isPending) return <div className="py-6 text-center">Loading stats...</div>;
  if (error) return <div className="py-6 text-red-400 text-center">Error: {error.message}</div>;

  return (
    <section id="stats" className="w-full md:w-7xl px-2 md:px-16 rounded-2xl mx-auto relative py-6 mt-[-60px] h-max">
      <div className="w-full mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6">
          {stats.map((s: any, i: number) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl px-6 border shadow-lg h-[110px] bg-white pb-0 border-gray-300 flex flex-col items-start justify-center"
            >
              <div className="flex items-center gap-6 relative mt-1">
                {/* Icon */}
                <div className="text-black h-full w-[30%] opacity-80">
                  {icons[i] || null} {/* fallback null jika urutan tidak cocok */}
                </div>
                <div className="flex flex-col h-max items-start gap-2 text-xl md:text-2xl font-bold" style={{ color: 'black' }}>
                  {/* Label */}
                  <div className="text-xs md:text-[16px] w-max opacity-80" style={{ color: 'black' }}>
                    {s.k}
                  </div>
                  <div className="w-max flex items-center gap-2">
                    {s.v} 
                    <p className="text-sm font-normal text-gray-500">
                      Orang
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Page utama
const Page = ({ theme, schoolName, onTenantChange, currentKey }: any) => (
  <div className="min-h-screen bg-white">
    <NavbarComp theme={theme} onTenantChange={onTenantChange} currentKey={currentKey} />
    {/* GlobalInfoBar & StatsBar bisa ditambahkan di sini jika ingin */}
    <Hero theme={theme} />
    <StatsBar theme={theme} />
    {/* <KeunggulanSection theme={theme} /> */}
    <SambutanSection theme={theme} />
    <FasilitasSection theme={theme} />
    <VideoSection theme={theme} />
    <PengurusSection theme={theme} />
    <BeritaSection theme={theme} />
    <GalleryComp />
    <InstagramFeedSection theme={theme} />
    <FooterComp theme={theme} />
  </div>
);

const Homepage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const [key, setKey] = useState(schoolInfo.fullName);
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [key]);

  return <Page theme={theme} schoolName={schoolName} onTenantChange={setKey} currentKey={key} />;
};

export default Homepage;

// Tema dominan biru tua
export const SMAN25_THEME = {
  primary: "#1e3a8a",
  accent: "#fcd34d",
} as const;