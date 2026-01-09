// import { SMAN25_CONFIG } from "@/core/theme";
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { useQueries } from "@tanstack/react-query";
// import { motion, useReducedMotion } from "framer-motion";
// import { useEffect, useMemo, useState } from "react";

// /****************************
//  * GENERIC MODAL
//  ****************************/
// const Modal = ({ open, onClose, theme, title, children }) => {
//   if (!open) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[60] flex items-center justify-center p-4"
//     >
//       <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose} />
//       <motion.div
//         initial={{ scale: 0.95, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.95, y: 20 }}
//         className="relative max-w-2xl w-full rounded-2xl border p-4"
//         style={{ background: theme.surface, borderColor: theme.subtle }}
//       >
//         <div className="flex items-center justify-between mb-2">
//           <div className="font-semibold" style={{ color: theme.primaryText }}>{title}</div>
//           <button
//             onClick={onClose}
//             className="px-2 py-1 rounded-lg border text-xs focus:ring-2 focus:ring-yellow-300"
//             style={{ borderColor: theme.subtle, color: theme.primaryText }}
//           >
//             Tutup
//           </button>
//         </div>
//         {children}
//       </motion.div>
//     </motion.div>
//   );
// };

// /****************************
//  * DATA DEMO — PRESTASI
//  ****************************/
// const ACHIEVEMENTS = [
//   { title: "Juara 1 Lomba Inovasi Teknologi Kota", date: "02 Sep 2025", category: "Akademik", level: "Kota", desc: "Tim RPL berhasil meraih juara dalam lomba inovasi teknologi tingkat kota.", img: '/trophy.jpg' },
//   { title: "Juara 2 Turnamen Futsal Antar-Sekolah", date: "15 Agu 2025", category: "Olahraga", level: "Provinsi", desc: "Tim futsal sekolah meraih juara 2 turnamen provinsi.", img: '/trophy.jpg' },
//   { title: "Juara Harapan Paduan Suara Nasional", date: "22 Jul 2025", category: "Seni", level: "Nasional", desc: "Paduan suara tampil memukau di ajang nasional dan raih penghargaan harapan.", img: '/trophy.jpg' },
//   { title: "Finalis Lomba Karya Tulis Ilmiah", date: "10 Jun 2025", category: "Sains", level: "Nasional", desc: "Kelompok KIR menjadi finalis lomba karya tulis ilmiah nasional.", img: '/trophy.jpg' },
// ];

// /****************************
//  * CARD PRESTASI
//  ****************************/
// const PrestasiCard = ({ item, theme, onOpen }) => {
//   const prefersReducedMotion = useReducedMotion();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
//       className="rounded-2xl overflow-hidden border hover:shadow-md transition flex flex-col cursor-pointer"
//       style={{ borderColor: theme.subtle, background: theme.surface }}
//       onClick={() => onOpen(item)}
//     >
//       <div className="aspect-[16/9] h-[200px] w-full bg-gray-200 flex items-center justify-center">
//         <img
//           src={item.img || '/trophy.jpg'}
//           alt={item.title}
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="p-4 flex flex-col flex-1">
//         <div className="font-semibold mb-1 line-clamp-2" style={{ color: theme.primaryText }}>
//           {item.title}
//         </div>
//         <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>
//           {item.date} · {item.category} · {item.level}
//         </div>
//         <div className="text-sm mt-2 opacity-90 flex-1 line-clamp-3" style={{ color: theme.surfaceText }}>
//           {item.desc}
//         </div>
//         <span
//           className="mt-3 text-xs px-3 py-1 rounded-lg border self-start"
//           style={{ borderColor: theme.subtle, color: theme.primaryText }}
//         >
//           Detail
//         </span>
//       </div>
//     </motion.div>
//   );
// };

// /****************************
//  * PRESTASI SECTION
//  ****************************/
// const PrestasiSection = ({ theme, schoolName }) => {
//   const [selected, setSelected] = useState(null);
//   const [q, setQ] = useState('');
//   const [cat, setCat] = useState('Semua');
//   const [lvl, setLvl] = useState('Semua');
//   const xHost = getXHostHeader();

//   // 1. Fetch dengan useQueries
//   const [achievementsQuery] = useQueries({
//     queries: [
//       {
//         queryKey: ['prestasi', xHost],
//         queryFn: async () => {
//           const res = await fetch('https://dev.kiraproject.id/prestasi', {
//             cache: 'no-store',
//             headers: {
//               'X-Host': xHost,
//               'Cache-Control': 'no-store',
//             },
//           });
//           if (!res.ok) throw new Error('Failed');
//           const json = await res.json();
//           if (!json.data || !Array.isArray(json.data)) return [];
//           return json.data.map(item => ({
//             title: item.namaPrestasi || 'Tidak diketahui',
//             date: new Date(item.tanggal).toLocaleDateString('id-ID', {
//               year: 'numeric',
//               month: 'long',
//               day: 'numeric',
//             }),
//             category: item.jenis || 'Lainnya',
//             level: item.tingkat || 'Sekolah',
//             desc: item.deskripsi || 'Tidak ada deskripsi.',
//             img: item.foto || '/trophy.jpg',
//           }));
//         },
//         placeholderData: [],
//         staleTime: 0,
//         gcTime: 0,
//         refetchOnMount: true,
//         retry: 1,
//       },
//     ],
//   });

//   const achievements = achievementsQuery.data || [];
//   const loading = achievementsQuery.isPending;
//   const error = achievementsQuery.error;

//   // Gunakan DEMO jika API gagal & kosong
//   const displayAchievements = achievements.length > 0 ? achievements : ACHIEVEMENTS;

//   // Kategori & Level dari data
//   const categories = useMemo(() => ['Semua', ...Array.from(new Set(displayAchievements.map(a => a.category)))], [displayAchievements]);
//   const levels = useMemo(() => ['Semua', ...Array.from(new Set(displayAchievements.map(a => a.level)))], [displayAchievements]);

//   // Filter
//   const filtered = useMemo(() => {
//     const nq = q.trim().toLowerCase();
//     return displayAchievements.filter(a => {
//       const okQ = !nq || a.title.toLowerCase().includes(nq) || a.desc.toLowerCase().includes(nq);
//       const okC = cat === 'Semua' || a.category === cat;
//       const okL = lvl === 'Semua' || a.level === lvl;
//       return okQ && okC && okL;
//     });
//   }, [q, cat, lvl, displayAchievements]);

//   return (
//     <section id="prestasi" className="py-12 md:py-16">
//       <div className="max-w-6xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="lg:flex items-start justify-between gap-4 mb-4"
//         >
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.accent }}>
//               Prestasi {schoolName}
//             </h2>
//             <p className="text-xs lg:text-sm opacity-85" style={{ color: theme.surfaceText }}>
//               Capaian siswa dan guru di berbagai bidang akademik, seni, olahraga, dan sains.
//             </p>
//           </div>
//           <div className="text-right text-xs lg:mt-0 mt-3" style={{ color: theme.primaryText }}>
//             Total: <strong>{displayAchievements.length}</strong>
//             <br />
//             Tersaring: <strong>{filtered.length}</strong>
//           </div>
//         </motion.div>

//         {/* Error Message */}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="rounded-xl border p-4 mb-4 md:text-center text-left"
//             style={{ borderColor: theme.subtle, background: theme.surface, color: theme.pop }}
//           >
//             Gagal memuat data. Menggunakan data demo.
//           </motion.div>
//         )}

//         {/* Controls */}
//         <motion.div
//           initial={{ opacity: 0, y: 8 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="mb-4 flex flex-wrap items-center gap-3"
//         >
//           <input
//             value={q}
//             onChange={e => setQ(e.target.value)}
//             placeholder="Cari prestasi…"
//             className="px-3 py-2 rounded-xl text-sm border bg-transparent"
//             style={{ borderColor: theme.subtle, color: theme.primaryText }}
//             disabled={loading}
//           />
//           <label className="text-xs flex items-center gap-2">
//             <span style={{ color: theme.primaryText }}>Kategori</span>
//             <select
//               value={cat}
//               onChange={e => setCat(e.target.value)}
//               className="px-2 py-1 rounded-lg text-sm border bg-transparent"
//               style={{ borderColor: theme.subtle, color: theme.primaryText }}
//               disabled={loading}
//             >
//               {categories.map(c => (
//                 <option key={c} value={c} style={{ color: '#111827' }}>{c}</option>
//               ))}
//             </select>
//           </label>
//           <label className="text-xs flex items-center gap-2">
//             <span style={{ color: theme.primaryText }}>Tingkat</span>
//             <select
//               value={lvl}
//               onChange={e => setLvl(e.target.value)}
//               className="px-2 py-1 rounded-lg text-sm border bg-transparent"
//               style={{ borderColor: theme.subtle, color: theme.primaryText }}
//               disabled={loading}
//             >
//               {levels.map(l => (
//                 <option key={l} value={l} style={{ color: '#111827' }}>{l}</option>
//               ))}
//             </select>
//           </label>
//         </motion.div>

//         {/* Loading */}
//         {loading ? (
//           <div className="grid md:grid-cols-3 gap-4">
//             {[...Array(6)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: i * 0.05 }}
//                 className="rounded-2xl border p-4 animate-pulse"
//                 style={{ borderColor: theme.subtle, background: theme.surface }}
//               >
//                 <div className="h-48 bg-white/20 rounded mb-3" />
//                 <div className="h-6 bg-white/20 rounded w-3/4 mb-2" />
//                 <div className="h-4 bg-white/20 rounded w-1/2" />
//               </motion.div>
//             ))}
//           </div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="grid md:grid-cols-3 gap-4"
//           >
//             {filtered.length > 0 ? (
//               filtered.map((a, i) => (
//                 <PrestasiCard key={a.title + i} item={a} theme={theme} onOpen={setSelected} />
//               ))
//             ) : (
//               <div className="col-span-full md:text-center text-left text-sm opacity-80" style={{ color: theme.surfaceText }}>
//                 Tidak ada data yang cocok dengan filter.
//               </div>
//             )}
//           </motion.div>
//         )}

//         {/* Modal */}
//         <Modal open={!!selected} onClose={() => setSelected(null)} theme={theme} title={selected?.title || ''}>
//           {selected && (
//             <motion.div
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="space-y-2 text-sm"
//               style={{ color: theme.primaryText }}
//             >
//               <div className="text-xs opacity-80">
//                 {selected.date} · {selected.category} · {selected.level}
//               </div>
//               <div>{selected.desc}</div>
//               {selected.img && (
//                 <img
//                   src={selected.img}
//                   alt={selected.title}
//                   className="mt-3 w-full h-48 object-cover rounded-lg border"
//                   style={{ borderColor: theme.subtle }}
//                 />
//               )}
//             </motion.div>
//           )}
//         </Modal>
//       </div>
//     </section>
//   );
// };

// /****************************
//  * DEFAULT PAGE + TESTS
//  ****************************/
// const PrestasiPage = () => {
//   const schoolInfo = SMAN25_CONFIG;
//   const theme = schoolInfo.theme;
//   const schoolName = schoolInfo.fullName;
//   const prefersReducedMotion = useReducedMotion();

//   useEffect(() => {
//     try {
//       console.assert(typeof PrestasiSection === 'function', 'PrestasiSection harus ada');
//       console.assert(Array.isArray(ACHIEVEMENTS) && ACHIEVEMENTS.length >= 3, 'Minimal 3 prestasi untuk demo');
//       console.assert(typeof Modal === 'function', 'Modal harus terdefinisi');

//       const hasCatLvl = ACHIEVEMENTS.every(a => a.category && a.level);
//       console.assert(hasCatLvl, 'Setiap prestasi wajib punya category & level');

//       console.log('UI smoke tests passed (Prestasi + Header/Footer/Modal)');
//     } catch (e) {
//       console.error('UI smoke tests failed:', e);
//     }
//   }, [prefersReducedMotion]);

//   return (
//     <div className="min-h-screen" style={{ background: theme.bg }}>
//       <NavbarComp theme={theme} />
//       <main>
//         <PrestasiSection theme={theme} schoolName={schoolName} />
//       </main>
//       <FooterComp theme={theme} />
//     </div>
//   );
// };

// export default PrestasiPage;



import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQueries } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { useMemo, useState } from "react";

const HeroSection = () => {
  const scrollToPrestasi = () => {
    document.getElementById("prestasi-content")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      {/* Background Image - Kegiatan Sekolah Representatif */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/pres1.webp')`, // Ganti jika ada foto resmi
          backgroundPosition: "center 35%",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Content */}
      <div className="relative z-10 md:text-center text-left text-white px-6 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
           className="text-4xl md:text-6xl font-bold mb-4"
        >
          Prestasi
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-md md:text-xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Capaian gemilang siswa dan guru SMAN 25 Jakarta di berbagai bidang akademik, olahraga, seni, dan sains.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          onClick={scrollToPrestasi}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-2xl bg-white text-black font-medium text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          Lihat prestasi
        </motion.button>
      </div>
    </section>
  );
};

/****************************
 * GENERIC MODAL
 ****************************/
const Modal = ({ open, onClose, theme, title, children }) => {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative max-w-2xl w-full rounded-3xl border overflow-hidden shadow-2xl"
        style={{ background: theme.surface, borderColor: theme.subtle }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.subtle }}>
          <h3 className="text-xl font-bold" style={{ color: theme.primaryText }}>{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

/****************************
 * DATA DEMO — PRESTASI
 ****************************/
/****************************
 * DATA DEMO — PRESTASI (UPDATED DENGAN DATA NYATA)
 ****************************/
const ACHIEVEMENTS = [
  {
    title: "Finalis Cabang Karate Putra Nasional",
    date: "2021",
    category: "Olahraga",
    level: "Nasional",
    desc: "MARKO ADIPUTRA WULUR menjadi finalis pada Kompetisi Olahraga Siswa Nasional (O2SN) cabang karate putra tingkat nasional tahun 2021.",
    img: '/trophy.jpg'
  },
  {
    title: "Peraih Medali Perak Cabang Karate Putra Nasional",
    date: "2021",
    category: "Olahraga",
    level: "Nasional",
    desc: "MARKO ADIPUTRA WULUR meraih medali perak pada Kompetisi Olahraga Siswa Nasional (O2SN) cabang karate putra tingkat nasional tahun 2021.",
    img: '/trophy.jpg'
  },
  {
    title: "Medali Emas Olimpiade Bahasa Inggris Nasional",
    date: "2024",
    category: "Akademik",
    level: "Nasional",
    desc: "JASMINE KIRANA HENRI meraih medali emas pada Olimpiade Siswa Prestasi Akademik Nasional (OSPAN) cabang Bahasa Inggris tingkat nasional tahun 2024.",
    img: '/trophy.jpg'
  },
  {
    title: "Medali Emas Olimpiade Bahasa Indonesia Nasional",
    date: "2024",
    category: "Akademik",
    level: "Nasional",
    desc: "JASMINE KIRANA HENRI meraih medali emas pada Olimpiade Siswa Prestasi Akademik Nasional (OSPAN) cabang Bahasa Indonesia tahun 2024 (dari seleksi tahun 2023).",
    img: '/trophy.jpg'
  },
  {
    title: "Peserta Olimpiade Penelitian Siswa Indonesia",
    date: "2024",
    category: "Sains",
    level: "Nasional",
    desc: "RYAN ACHMAD FACHRI menjadi peserta pada Olimpiade Penelitian Siswa Indonesia (OPSI) cabang Ilmu Sosial dan Humaniora tingkat nasional tahun 2024.",
    img: '/trophy.jpg'
  },
];

/****************************
 * CARD PRESTASI
 ****************************/
const PrestasiCard = ({ item, theme, onOpen }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      whileHover={{ y: prefersReducedMotion ? 0 : -8, scale: 1.03 }}
      className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer border"
      style={{ borderColor: theme.subtle, background: theme.surface }}
      onClick={() => onOpen(item)}
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <img
          src={item.img || '/trophy.jpg'}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-4 right-4">
          <Star className="w-10 h-10 text-yellow-400 drop-shadow-lg" fill="currentColor" />
        </div>
      </div>
      <div className="p-4 md:p-6">
        <h3 className="text-md font-bold mb-2 line-clamp-2" style={{ color: theme.primaryText }}>
          {item.title}
        </h3>
        <div className="text-sm opacity-80 mb-3" style={{ color: theme.surfaceText }}>
          {item.date} · {item.category} · {item.level}
        </div>
        <p className="text-xs opacity-90 line-clamp-3" style={{ color: theme.surfaceText }}>
          {item.desc}
        </p>
        <span className="inline-block mt-4 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{ background: theme.accent, color: "#111827" }}
        >
          Lihat Detail →
        </span>
      </div>
    </motion.div>
  );
};

/****************************
 * PRESTASI SECTION
 ****************************/
const PrestasiSection = ({ theme, schoolName }) => {
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Semua');
  const [lvl, setLvl] = useState('Semua');
  const xHost = getXHostHeader();

  const [achievementsQuery] = useQueries({
    queries: [
      {
        queryKey: ['prestasi', xHost],
        queryFn: async () => {
          const res = await fetch('https://dev.kiraproject.id/prestasi', {
            cache: 'no-store',
            headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
          });
          if (!res.ok) throw new Error('Failed');
          const json = await res.json();
          if (!json.data || !Array.isArray(json.data)) return [];
          return json.data.map((item: any) => ({
            title: item.namaPrestasi || 'Tidak diketahui',
            date: new Date(item.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
            category: item.jenis || 'Lainnya',
            level: item.tingkat || 'Sekolah',
            desc: item.deskripsi || 'Tidak ada deskripsi.',
            img: item.foto || '/trophy.jpg',
          }));
        },
        placeholderData: [],
        staleTime: 0,
        refetchOnMount: true,
        retry: 1,
      },
    ],
  });

  const achievements = achievementsQuery.data || [];
  const loading = achievementsQuery.isPending;
  const error = achievementsQuery.error;

  const displayAchievements = achievements.length > 0 ? achievements : ACHIEVEMENTS;

  const categories = useMemo(() => ['Semua', ...Array.from(new Set(displayAchievements.map(a => a.category)))], [displayAchievements]);
  const levels = useMemo(() => ['Semua', ...Array.from(new Set(displayAchievements.map(a => a.level)))], [displayAchievements]);

  const filtered = useMemo(() => {
    const nq = q.trim().toLowerCase();
    return displayAchievements.filter(a => {
      const okQ = !nq || a.title.toLowerCase().includes(nq) || a.desc.toLowerCase().includes(nq);
      const okC = cat === 'Semua' || a.category === cat;
      const okL = lvl === 'Semua' || a.level === lvl;
      return okQ && okC && okL;
    });
  }, [q, cat, lvl, displayAchievements]);

  return (
    <section id="prestasi-content" className="py-20 md:py-28 -mt-12 relative z-[1]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:text-center text-left mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'black' }}>
            Prestasi 
          </h2>
          <p className="text-lg opacity-80 max-w-3xl mx-auto" style={{ color: theme.surfaceText }}>
            Koleksi capaian siswa dan sekolah di berbagai kompetisi tingkat kota, provinsi, hingga nasional.
          </p>
        </motion.div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari prestasi..."
            className="px-6 py-3 rounded-2xl text-base shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-300/50 transition"
            style={{ background: "rgba(255,255,255,0.95)", color: "#111827", minWidth: "300px" }}
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="px-6 py-3 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
            style={{ background: "rgba(255,255,255,0.95)", color: "#111827" }}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={lvl}
            onChange={(e) => setLvl(e.target.value)}
            className="px-6 py-3 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
            style={{ background: "rgba(255,255,255,0.95)", color: "#111827" }}
          >
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur animate-pulse h-96" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filtered.length > 0 ? (
              filtered.map((item, i) => (
                <PrestasiCard key={i} item={item} theme={theme} onOpen={setSelected} />
              ))
            ) : (
              <p className="col-span-full md:text-center text-left text-xl opacity-70 py-20" style={{ color: theme.surfaceText }}>
                Tidak ada prestasi yang sesuai dengan filter.
              </p>
            )}
          </div>
        )}

        {/* Modal Detail */}
        <Modal open={!!selected} onClose={() => setSelected(null)} theme={theme} title={selected?.title}>
          {selected && (
            <div className="space-y-6">
              {/* <img
                src={selected.img}
                alt={selected.title}
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              /> */}
              <div>
                <p className="text-sm opacity-80 mb-2" style={{ color: theme.surfaceText }}>
                  {selected.date} · {selected.category} · {selected.level}
                </p>
                <p className="text-base leading-relaxed" style={{ color: theme.primaryText }}>
                  {selected.desc}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};

/****************************
 * PAGE UTAMA DENGAN HERO
 ****************************/
const PrestasiPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* HERO SECTION */}
      <HeroSection />

      {/* PRESTASI CONTENT */}
      <PrestasiSection theme={theme} schoolName={schoolName} />

      <FooterComp theme={theme} />
    </div>
  );
};

export default PrestasiPage;