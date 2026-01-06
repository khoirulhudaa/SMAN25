// import { SMAN25_CONFIG } from "@/core/theme";
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { useQuery } from "@tanstack/react-query";
// import { motion, useReducedMotion } from "framer-motion";
// import React from "react";

// /*********
//  * BADGE
//  *********/
// const Badge = ({ children, theme }: { children: React.ReactNode; theme: any }) => (
//   <span
//     className="flex items-center px-2 py-2 h-max text-xs rounded-md border font-medium"
//     style={{ background: theme.accent, color: "#1b1b1b", borderColor: theme.accent }}
//   >
//     {children}
//   </span>
// );

// const PengurusSection = ({ theme }: any) => {
//   // Data dummy lengkap berdasarkan gambar website SMAN 55 Jakarta
//   const guruDanStaf = [
//     { nama: "Triyem, S.Pd., M.Si", jabatan: "Kepala Sekolah", img: "/tp1.jpeg" },
//     { nama: "Dra. Nur Asniar, M.Pd", jabatan: "Guru Fisika", img: "/tp2.png" },
//     { nama: "Dra. Kristiana", jabatan: "Guru Geografi", img: "/tp3.png" },
//     { nama: "Jusron S., M.Pd.K", jabatan: "Guru PAI", img: "/tp4.png" },
//     { nama: "Ettyk Sunaryati, M.Pd", jabatan: "Guru PPKn", img: "/tp5.png" },
//     { nama: "Etik Turkayati, S.Pd", jabatan: "Guru Sejarah", img: "/tp6.jpeg" },
//     { nama: "Wiwik E.M., SPd", jabatan: "Guru Biologi", img: "/tp7.png" },
//     { nama: "Indar Cahyanto, M.Pd", jabatan: "Guru Sejarah", img: "/tp8.png" },
//     { nama: "Sunaji, S.Pd", jabatan: "Guru Ekonomi", img: "/tp9.png" },
//     { nama: "Jelita F.S., S.Pd", jabatan: "Guru Matematika", img: "/tp10.png" },
//     { nama: "Piter S., SE., M.M.", jabatan: "Guru Ekonomi", img: "/tp11.jpeg" },
//     { nama: "Dea Siti S., S.Pd", jabatan: "Guru BK", img: "/tp12.png" },
//     { nama: "Widiasih, S.Pd", jabatan: "Guru BK", img: "/tp13.png" },
//     { nama: "Sarjono, S.Pd", jabatan: "Guru Fisika", img: "/tp14.jpeg" },
//     { nama: "Jamilah, S.Pd", jabatan: "Guru Bhs. Indonesia", img: "/tp15.png" },
//     { nama: "Drs. Achmad Zaini", jabatan: "Guru BK", img: "/tp16.png" },
//     { nama: "Reni Marlina, S.Pd", jabatan: "Guru Bhs. Inggris", img: "/tp17.png" },
//     { nama: "Arnita L.M.S., S.Pd", jabatan: "Guru Matematika", img: "/tp18.png" },
//     { nama: "Septi W., S.Pd", jabatan: "Guru Ekonomi", img: "/tp19.png" },
//     { nama: "Astri Asih K., S.Pd", jabatan: "Guru Ekonomi", img: "/tp20.jpeg" },
//     { nama: "Rizki Ardilah S., M.Pd", jabatan: "Guru PJOK", img: "/tp21.jpeg" },
//     { nama: "Siti M., S.PdI", jabatan: "Guru PKWU", img: "/tp22.jpeg" },
//     { nama: "Anisa W., M.Pd", jabatan: "Guru Sosiologi", img: "/tp23.jpeg" },
//     { nama: "Didi S., M.Pd", jabatan: "Guru Matematika", img: "/tp24.jpeg" },
//     { nama: "Pancari C., S.Pd", jabatan: "Guru Geografi", img: "/tp25.jpeg" },
//     { nama: "Ramadhan F., S.Pd", jabatan: "Guru PJOK", img: "/tp26.jpeg" },
//     { nama: "Sri Famili, S.Pd", jabatan: "Guru Bhs. Inggris", img: "/tp27.png" },
//     { nama: "Kori M.R., M.Pd", jabatan: "Guru PAI", img: "/tp28.png" },
//     { nama: "Achmad H.B., S.Pd.I", jabatan: "Guru PAI", img: "/tp29.jpeg" },
//     { nama: "Chintya D.E.H., S.Pd", jabatan: "Guru Kimia", img: "/tp30.png" },
//     { nama: "Teuku Vary S., M.Pd", jabatan: "Guru Sosiologi", img: "/tp31.jpeg" },
//     { nama: "Toto Prastio, S.Pd", jabatan: "Guru Bhs. Indonesia", img: "/tp32.png" },
//     { nama: "Khomsatun, S.Pd", jabatan: "Kasubag Tata Usaha", img: "/tp33.jpeg" },
//     { nama: "Evy Yuni Astuti", jabatan: "Staf Kepegawaian", img: "/tp34.png" },
//     { nama: "Sarjono, S.Pd", jabatan: "Staf Inventaris", img: "/tp35.jpeg" },
//     { nama: "Akhmad Rosali, SE.", jabatan: "Bendahara Sekolah", img: "/tp36.png" },
//     { nama: "Muhammad Nawir", jabatan: "Staf Kebersihan", img: "/tp37.jpeg" },
//     { nama: "Komarudin", jabatan: "Tenaga Perpustakaan", img: "/tp38.png" },
//     { nama: "Erni Sulistiowati, SE.", jabatan: "Tenaga Laboran", img: "/tp39.png" },
//     { nama: "Sari Ayulia M., S.Psi", jabatan: "Tenaga Administrasi", img: "/tp40.png" },
//     { nama: "Subandriyo", jabatan: "Caraka", img: "/tp41.png" },
//     { nama: "Nurman Kurniawan", jabatan: "Caraka", img: "/tp42.png" },
//     { nama: "M. Ramdan D.", jabatan: "Satpam", img: "/tp43.png" },
//     { nama: "Hendra", jabatan: "Caraka", img: "/tp44.png" },
//   ];

//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-6">
//         <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: 'black' }}>
//           Guru dan Staf Sekolah
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//           {guruDanStaf.map((item, i) => (
//             <div
//               key={i}
//               className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md p-6 text-center border border-blue-100 hover:shadow-xl transition-shadow"
//             >
//               <div className="w-32 h-40 mx-auto mb-4 overflow-hidden rounded-lg">
//                 <img
//                   src={item.img}
//                   alt={item.nama}
//                   className="w-full h-full object-cover"
//                   // onError={(e) => (e.currentTarget.src = "/fallback-guru.jpeg")} // optional fallback
//                 />
//               </div>
//               <h3 className="font-semibold text-lg mt-4" style={{ color: 'black' }}>
//                 {item.nama}
//               </h3>
//               <p className="text-gray-600 text-sm mt-1">{item.jabatan}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// /****************
//  * SECTION WRAPPER
//  ****************/
// const Section = ({ title, subtitle, theme, children }: { title: string; subtitle?: string; theme: any; children: React.ReactNode }) => (
//   <section className="py-10 md:py-14">
//     <div className="max-w-6xl mx-auto px-4">
//       <div className="flex items-end justify-between mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>{title}</h1>
//           {subtitle && <p className="text-sm opacity-70" style={{ color: theme.surfaceText }}>{subtitle}</p>}
//         </div>
//       </div>
//       {children}
//     </div>
//   </section>
// );

// /****************
//  * REACT-QUERY HOOK
//  ****************/
// type VisiMisiData = {
//   visi: string;
//   misi: string[];
//   pillars: { name: string; v: string }[];
//   kpi: { k: string; v: string }[];
// };

// const DEMO_DATA: VisiMisiData = {
//   visi: "Mewujudkan lulusan yang berkarakter profil pelajar pancasila, berbudaya dan berdaya saing global yang inklusif",
//   misi: [
//     "Melaksanakan pembelajaran berbasis digital yang kreatif ivonatif",
//     "Mengembangkan potensi, kreatifitas menyongsong jakarta kota global",
//     "Meningkatkan budaya literasi dan numerasi di setiap kegiatan",
//     "Melaksanakan pembiasaan ibadah sesuai agama kepercayaan masing-masing",
//     "Meningkatkan prestasi akademik dan non akademik secara jujur dan berdaya juang tinggi",
//     "Menerapkan nilai pancasila dalam kegiatan pembelajaran",
//     "Menanamkan karakter profil pelajar pancasila yang beriman bertaqwa kepada tuhan yang maha esa",
//     "Menjalin kerja sama dengan stakeholder sekolah",
//   ],
//   pillars: [],
//   kpi: [],
// };

// const useVisiMisiData = () => {
//   const xHost = getXHostHeader();
//   return useQuery<VisiMisiData, Error>({
//     queryKey: ['visimisi', xHost],
//     queryFn: async () => {
//       const res = await fetch("https://dev.kiraproject.id/visimisi", {
//         cache: 'no-store',
//         headers: {
//           'X-Host': xHost,
//           'Cache-Control': 'no-store',
//         },
//       });
//       if (!res.ok) throw new Error('Failed to fetch visi misi data');
//       const result = await res.json();

//       return {
//         visi: result.visi || '',
//         misi: Array.isArray(result.misi) ? result.misi : [],
//         pillars: Array.isArray(result.pillars)
//           ? result.pillars.map((p: any) => ({ name: p.name || '', v: p.v || '' }))
//           : [],
//         kpi: Array.isArray(result.kpi)
//           ? result.kpi.map((item: any) => ({ k: item.name || '', v: String(item.target || '') }))
//           : [],
//       };
//     },
//     placeholderData: DEMO_DATA,
//     staleTime: 0,
//     gcTime: 0,
//     retry: 1,
//   });
// };

// /****************
//  * VisiMisi COMPONENT
//  ****************/
// const VisiMisi = ({ theme, schoolName }: { theme: any; schoolName: string }) => {
//   const prefersReducedMotion = useReducedMotion();
//   const { data = DEMO_DATA, isPending: loading, error } = useVisiMisiData();

//   return (
//     <div className="relative">
//       {/* Accent blob */}
//       <motion.div
//         aria-hidden
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.15 }}
//         transition={{ duration: prefersReducedMotion ? 0 : 1.2 }}
//         className="pointer-events-none absolute -top-24 -right-24 w-[360px] h-[360px] rounded-full blur-3xl"
//         style={{ background: theme.accent }}
//       />

//       {/* Loading */}
//       {loading && (
//         <div className="text-sm py-8 text-center" style={{ color: theme.surfaceText }}>
//           Memuat data visi misi...
//         </div>
//       )}

//       {/* Error */}
//       {error && (
//         <div className="text-sm py-8 text-center" style={{ color: theme.pop }}>
//           Error: {error.message}. Menggunakan data demo.
//         </div>
//       )}

//       {/* Visi */}
//       {!loading && !error && (
//         <Section title="Visi" subtitle={`Arah besar pengembangan ${schoolName}`} theme={theme}>
//           <motion.blockquote
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.4 }}
//             transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
//             className="text-xl md:text-2xl font-semibold rounded-2xl p-6 border"
//             style={{ background: theme.surface, borderColor: theme.subtle, color: theme.surfaceText }}
//           >
//             {DEMO_DATA.visi}
//           </motion.blockquote>
//         </Section>
//       )}

//       {/* Misi */}
//       {!loading && !error && (
//         <Section title="Misi" subtitle="Langkah strategis untuk mewujudkan visi" theme={theme}>
//           <div className="grid md:grid-cols-2 gap-4">
//             {DEMO_DATA.misi.map((item, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 12 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, amount: 0.3 }}
//                 transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: prefersReducedMotion ? 0 : i * 0.03 }}
//                 className="rounded-2xl p-4 border flex items-center gap-3"
//                 style={{ background: theme.surface, borderColor: theme.subtle, color: theme.surfaceText }}
//               >
//                 <Badge theme={theme}>M{i + 1}</Badge>
//                 <p className="text-sm md:text-base leading-relaxed">{item}</p>
//               </motion.div>
//             ))}
//           </div>
//         </Section>
//       )}

//       <PengurusSection />

//       {/* Pilar & Nilai */}
//       {/* {!loading && !error && (
//         <Section title="Pilar & Nilai Utama" subtitle="Budaya kerja dan fokus program" theme={theme}>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {data.pillars.map((c, i) => (
//               <motion.div
//                 key={c.name}
//                 initial={{ opacity: 0, y: 12 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, amount: 0.3 }}
//                 transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: prefersReducedMotion ? 0 : i * 0.04 }}
//                 className="rounded-2xl p-4 border"
//                 style={{ background: theme.surface, borderColor: theme.subtle }}
//               >
//                 <div className="text-sm font-semibold mb-1" style={{ color: theme.surfaceText }}>{c.name}</div>
//                 <div className="text-xs opacity-90" style={{ color: theme.surfaceText }}>
//                   {c.v}
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </Section>
//       )} */}

//       {/* KPI */}
//       {/* {!loading && !error && (
//         <Section title="Indikator Kinerja (KPI)" subtitle="Ukuran keberhasilan tahunan" theme={theme}>
//           <div className="grid md:grid-cols-2 gap-3 md:gap-4">
//             {data.kpi.map((s, i) => (
//               <motion.div
//                 key={s.k}
//                 initial={{ opacity: 0, y: 12 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, amount: 0.4 }}
//                 transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: prefersReducedMotion ? 0 : i * 0.05 }}
//                 className="rounded-2xl p-4 border shadow-sm"
//                 style={{ background: theme.surface, borderColor: theme.subtle }}
//               >
//                 <div className="text-base font-medium mb-1 opacity-80" style={{ color: theme.surfaceText }}>
//                   {s.k}
//                 </div>
//                 <div className="text-lg font-semibold" style={{ color: theme.accent }}>
//                   {s.v}
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </Section>
//       )} */}
//     </div>
//   );
// };

// /********
//  * PAGE
//  ********/
// const Page = ({ theme, schoolName }: { theme: any; schoolName: string }) => (
//   <div className="min-h-screen" style={{ background: theme.bg }}>
//     <NavbarComp theme={theme} />

//     <section className="relative">
//       <div className="relative w-full">
//         <div className="relative z-[33] max-w-6xl mx-auto px-4 pt-12 md:pt-16">
//           <h1 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: theme.surfaceText }}>Visi & Misi</h1>
//           <p className="mt-2 text-base md:text-lg opacity-90" style={{ color: theme.surfaceText }}>
//             Arah, strategi, dan budaya kerja {schoolName}
//           </p>
//         </div>
//       </div>
//     </section>

//     <VisiMisi theme={theme} schoolName={schoolName} />

//     <FooterComp theme={theme} />
//   </div>
// );

// /*************************
//  * EXPORT
//  *************************/
// const VisiMisiPage = () => {
//   const schoolInfo = SMAN25_CONFIG;
//   const theme = schoolInfo.theme;
//   const schoolName = schoolInfo.fullName;

//   return <Page theme={theme} schoolName={schoolName} />;
// };

// export default VisiMisiPage;


import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import React from "react";

const HeroSection = () => {
  const scrollToBerita = () => {
    document.getElementById("berita")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image - Gedung SMAN 25 Jakarta (foto resmi dari sumber terpercaya) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
        backgroundImage: `url('VM.jpg')`,        }}
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="absolute -mt-16 z-10 text-center text-white px-6 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Visi dan Misi SMAN 25 <br /> Jakarta
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed"
        >
          Arah strategis dan komitmen kami dalam membentuk generasi unggul, berkarakter Pancasila, dan berdaya saing global.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={scrollToBerita}
          className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition shadow-lg"
        >
          Lihat Visi Misi
        </motion.button>
      </div>
    </section>
  );
};

/*********
 * BADGE
 *********/
const Badge = ({ children, theme }: { children: React.ReactNode; theme: any }) => (
  <span
    className="flex items-center px-2 py-2 h-max text-xs rounded-md border font-medium"
    style={{ background: theme.accent, color: "#1b1b1b", borderColor: theme.accent }}
  >
    {children}
  </span>
);

const PengurusSection = ({ theme }: any) => {
  // Data dummy lengkap berdasarkan gambar website SMAN 55 Jakarta
  const guruDanStaf = [
    { nama: "Triyem, S.Pd., M.Si", jabatan: "Kepala Sekolah", img: "/tp1.jpeg" },
    { nama: "Dra. Nur Asniar, M.Pd", jabatan: "Guru Fisika", img: "/tp2.png" },
    { nama: "Dra. Kristiana", jabatan: "Guru Geografi", img: "/tp3.png" },
    { nama: "Jusron S., M.Pd.K", jabatan: "Guru PAI", img: "/tp4.png" },
    { nama: "Ettyk Sunaryati, M.Pd", jabatan: "Guru PPKn", img: "/tp5.png" },
    { nama: "Etik Turkayati, S.Pd", jabatan: "Guru Sejarah", img: "/tp6.jpeg" },
    { nama: "Wiwik E.M., SPd", jabatan: "Guru Biologi", img: "/tp7.png" },
    { nama: "Indar Cahyanto, M.Pd", jabatan: "Guru Sejarah", img: "/tp8.png" },
    { nama: "Sunaji, S.Pd", jabatan: "Guru Ekonomi", img: "/tp9.png" },
    { nama: "Jelita F.S., S.Pd", jabatan: "Guru Matematika", img: "/tp10.png" },
    { nama: "Piter S., SE., M.M.", jabatan: "Guru Ekonomi", img: "/tp11.jpeg" },
    { nama: "Dea Siti S., S.Pd", jabatan: "Guru BK", img: "/tp12.png" },
    { nama: "Widiasih, S.Pd", jabatan: "Guru BK", img: "/tp13.png" },
    { nama: "Sarjono, S.Pd", jabatan: "Guru Fisika", img: "/tp14.jpeg" },
    { nama: "Jamilah, S.Pd", jabatan: "Guru Bhs. Indonesia", img: "/tp15.png" },
    { nama: "Drs. Achmad Zaini", jabatan: "Guru BK", img: "/tp16.png" },
    { nama: "Reni Marlina, S.Pd", jabatan: "Guru Bhs. Inggris", img: "/tp17.png" },
    { nama: "Arnita L.M.S., S.Pd", jabatan: "Guru Matematika", img: "/tp18.png" },
    { nama: "Septi W., S.Pd", jabatan: "Guru Ekonomi", img: "/tp19.png" },
    { nama: "Astri Asih K., S.Pd", jabatan: "Guru Ekonomi", img: "/tp20.jpeg" },
    { nama: "Rizki Ardilah S., M.Pd", jabatan: "Guru PJOK", img: "/tp21.jpeg" },
    { nama: "Siti M., S.PdI", jabatan: "Guru PKWU", img: "/tp22.jpeg" },
    { nama: "Anisa W., M.Pd", jabatan: "Guru Sosiologi", img: "/tp23.jpeg" },
    { nama: "Didi S., M.Pd", jabatan: "Guru Matematika", img: "/tp24.jpeg" },
    { nama: "Pancari C., S.Pd", jabatan: "Guru Geografi", img: "/tp25.jpeg" },
    { nama: "Ramadhan F., S.Pd", jabatan: "Guru PJOK", img: "/tp26.jpeg" },
    { nama: "Sri Famili, S.Pd", jabatan: "Guru Bhs. Inggris", img: "/tp27.png" },
    { nama: "Kori M.R., M.Pd", jabatan: "Guru PAI", img: "/tp28.png" },
    { nama: "Achmad H.B., S.Pd.I", jabatan: "Guru PAI", img: "/tp29.jpeg" },
    { nama: "Chintya D.E.H., S.Pd", jabatan: "Guru Kimia", img: "/tp30.png" },
    { nama: "Teuku Vary S., M.Pd", jabatan: "Guru Sosiologi", img: "/tp31.jpeg" },
    { nama: "Toto Prastio, S.Pd", jabatan: "Guru Bhs. Indonesia", img: "/tp32.png" },
    { nama: "Khomsatun, S.Pd", jabatan: "Kasubag Tata Usaha", img: "/tp33.jpeg" },
    { nama: "Evy Yuni Astuti", jabatan: "Staf Kepegawaian", img: "/tp34.png" },
    { nama: "Sarjono, S.Pd", jabatan: "Staf Inventaris", img: "/tp35.jpeg" },
    { nama: "Akhmad Rosali, SE.", jabatan: "Bendahara Sekolah", img: "/tp36.png" },
    { nama: "Muhammad Nawir", jabatan: "Staf Kebersihan", img: "/tp37.jpeg" },
    { nama: "Komarudin", jabatan: "Tenaga Perpustakaan", img: "/tp38.png" },
    { nama: "Erni Sulistiowati, SE.", jabatan: "Tenaga Laboran", img: "/tp39.png" },
    { nama: "Sari Ayulia M., S.Psi", jabatan: "Tenaga Administrasi", img: "/tp40.png" },
    { nama: "Subandriyo", jabatan: "Caraka", img: "/tp41.png" },
    { nama: "Nurman Kurniawan", jabatan: "Caraka", img: "/tp42.png" },
    { nama: "M. Ramdan D.", jabatan: "Satpam", img: "/tp43.png" },
    { nama: "Hendra", jabatan: "Caraka", img: "/tp44.png" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
          Guru dan Staf Sekolah
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {guruDanStaf.map((item, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md p-6 text-center border border-blue-100 hover:shadow-xl transition-shadow"
            >
              <div className="w-32 h-40 mx-auto mb-4 overflow-hidden rounded-lg">
                <img
                  src={item.img}
                  alt={item.nama}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mt-4 text-black">
                {item.nama}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{item.jabatan}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/****************
 * SECTION WRAPPER
 ****************/
const Section = ({ title, subtitle, theme, children }: { title: string; subtitle?: string; theme: any; children: React.ReactNode }) => (
  <section className="py-10 md:py-14">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black">{title}</h1>
          {subtitle && <p className="text-sm opacity-70 text-black/70">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  </section>
);

/****************
 * REACT-QUERY HOOK & DEMO DATA
 ****************/
type VisiMisiData = {
  visi: string;
  misi: string[];
  pillars: { name: string; v: string }[];
  kpi: { k: string; v: string }[];
};

const DEMO_DATA: VisiMisiData = {
  visi: "Mewujudkan lulusan yang berkarakter profil pelajar pancasila, berbudaya dan berdaya saing global yang inklusif",
  misi: [
    "Melaksanakan pembelajaran berbasis digital yang kreatif ivonatif",
    "Mengembangkan potensi, kreatifitas menyongsong jakarta kota global",
    "Meningkatkan budaya literasi dan numerasi di setiap kegiatan",
    "Melaksanakan pembiasaan ibadah sesuai agama kepercayaan masing-masing",
    "Meningkatkan prestasi akademik dan non akademik secara jujur dan berdaya juang tinggi",
    "Menerapkan nilai pancasila dalam kegiatan pembelajaran",
    "Menanamkan karakter profil pelajar pancasila yang beriman bertaqwa kepada tuhan yang maha esa",
    "Menjalin kerja sama dengan stakeholder sekolah",
  ],
  pillars: [],
  kpi: [],
};

const useVisiMisiData = () => {
  const xHost = getXHostHeader();
  return useQuery<VisiMisiData, Error>({
    queryKey: ['visimisi', xHost],
    queryFn: async () => {
      const res = await fetch("https://dev.kiraproject.id/visimisi", {
        cache: 'no-store',
        headers: {
          'X-Host': xHost,
          'Cache-Control': 'no-store',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch visi misi data');
      const result = await res.json();

      return {
        visi: result.visi || '',
        misi: Array.isArray(result.misi) ? result.misi : [],
        pillars: Array.isArray(result.pillars)
          ? result.pillars.map((p: any) => ({ name: p.name || '', v: p.v || '' }))
          : [],
        kpi: Array.isArray(result.kpi)
          ? result.kpi.map((item: any) => ({ k: item.name || '', v: String(item.target || '') }))
          : [],
      };
    },
    placeholderData: DEMO_DATA,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });
};

/****************
 * VisiMisi COMPONENT
 ****************/
const VisiMisi = ({ theme, schoolName }: { theme: any; schoolName: string }) => {
  const prefersReducedMotion = useReducedMotion();
  const { data = DEMO_DATA, isPending: loading, error } = useVisiMisiData();

  return (
    <div id="visi-misi" className="relative bg-gray-50 pt-8">
      {/* Loading & Error */}
      {loading && (
        <div className="text-center py-12 text-black/60">Memuat data visi misi...</div>
      )}
      {error && (
        <div className="text-center py-12 text-red-600">Error memuat data. Menggunakan data demo.</div>
      )}

      {/* Visi */}
      <Section title="Visi" subtitle={`Arah besar pengembangan ${schoolName}`} theme={theme}>
        <motion.blockquote
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl font-semibold rounded-2xl p-8 bg-white border border-black/10 shadow-lg text-black"
        >
          {DEMO_DATA.visi}
        </motion.blockquote>
      </Section>

      {/* Misi */}
      <Section title="Misi" subtitle="Langkah strategis untuk mewujudkan visi" theme={theme}>
        <div className="grid md:grid-cols-2 gap-6">
          {DEMO_DATA.misi.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-6 bg-white border border-black/10 shadow-md flex items-start gap-4"
            >
              <Badge theme={theme}>M{i + 1}</Badge>
              <p className="text-base leading-relaxed text-black/80">{item}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Guru & Staf */}
      <PengurusSection theme={theme} />
    </div>
  );
};

/********
 * PAGE UTAMA
 ********/
const VisiMisiPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp theme={theme} />

      {/* Hero Section */}
      <HeroSection />

      {/* Content dengan overlap ke hero */}
      <main className="flex-1 -mt-20 relative z-10">
        <VisiMisi theme={theme} schoolName={schoolName} />
      </main>

      <FooterComp theme={theme} />
    </div>
  );
};

export default VisiMisiPage;