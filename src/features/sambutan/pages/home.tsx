// import { SMAN25_CONFIG } from "@/core/theme";
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { useQueries } from "@tanstack/react-query";
// import React from "react";
// let useSwipeable;
// try { useSwipeable = require("react-swipeable").useSwipeable; } catch { useSwipeable = () => ({}) }

// const useSambutanAndHeadmasters = () => {
//   const xHost = getXHostHeader();
//   return useQueries({
//     queries: [
//       {
//         queryKey: ['sambutan', xHost],
//         queryFn: async () => {
//           const res = await fetch("https://dev.kiraproject.id/beranda", {
//             cache: 'no-store',
//             headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
//           });
//           if (!res.ok) throw new Error("Failed to fetch sambutan");
//           const data = await res.json();
//           return data.sambutan;
//         },
//       },
//       {
//         queryKey: ['headmasters', xHost],
//         queryFn: async () => {
//           const res = await fetch("https://dev.kiraproject.id/sejarah/kepsek", {
//             cache: 'no-store',
//             headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
//           });
//           if (!res.ok) throw new Error("Failed to fetch headmasters");
//           const data = await res.json();
//           return data.items;
//         },
//       },
//     ],
//   });
// };

// const SambutanSection = ({ theme }: any) => {
//   const [sambutanQuery] = useSambutanAndHeadmasters();
//   const sambutan = sambutanQuery.data;

//   if (sambutanQuery.isPending) return <div className="py-24 text-left md:text-center">Loading sambutan...</div>;

//   // Stats hardcoded sesuai screenshot (ganti dengan data API jika ada)
//   const stats = [
//     { value: "540 +", label: "Peserta Didik" },
//     { value: "45 +", label: "Guru Tendik" },
//     { value: "30 +", label: "Ruangan" },
//     { value: "100", label: "Penghargaan" },
//   ];

//   return (
//     <section className="py-16 md:py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="grid md:grid-cols-1 gap-12 items-center justify-center text-left md:text-center">
//           {/* Bagian Kiri: Foto + Logo Sekolah */}
//           <div className="relative">
//             {/* Papan nama kecil di pojok kiri atas */}
//             <div className="absolute top-0 left-0 z-10 w-48 md:w-64 -translate-y-8 md:-translate-y-12 -translate-x-4 md:-translate-x-8">
//               <SafeImage 
//                 src="/sman25-sign.jpg" // ganti dengan foto papan nama asli jika ada
//                 alt="SMAN 25 JAKARTA" 
//                 className="w-full" 
//               />
//             </div>

//             {/* Foto Kepala Sekolah */}
//             <div className="relative rounded-2xl overflow-hidden">
//               <SafeImage 
//                 // src={sambutan?.photo ? `https://dev.kiraproject.id${sambutan.photo}` : "/defaultKepsek.jpg"}
//                 src={"/kapalaSekolah.png"}
//                 alt="Kepala Sekolah" 
//                 className="w-full h-[400px] md:h-[300px] object-contain" 
//               />
//             </div>
//           </div>

//           {/* Bagian Kanan: Teks + Stats */}
//           <div className="flex flex-col justify-center space-y-8">
//             {/* Teks Sambutan */}
//             {/* <div className="text-lg text-gray-700 leading-relaxed space-y-4">
//               {sambutan?.text.split("\n").map((p: string, i: number) => (
//                 <p key={i}>{p}</p>
//               ))}
//             </div> */}
//             <p className="text-lg text-gray-700 leading-relaxed space-y-4 w-[80%] mx-auto text-left md:text-center">
//               Alhamdulillah, segala puji hanya milik Allah SWT, atas kehendak-Nya kami bisa hadir ditengah derasnya perkembangan teknologi informasi. Website sman25-jkt.sch.id kali ini merupakan update, baik dari sisi pengelolaan maupun isinya, dengan harapan dapat lebih memberikan layanan pendidikan yang prima terutama terkait informasi pendidikan.
//             </p>

//             {/* Signature */}
//             <div className="mt-8">
//               <p className="text-2xl font-bold" style={{ color: 'black' }}>{sambutan?.name}</p>
//               <p className="text-gray-600 text-lg">Kepala Sekolah SMAN 25 Jakarta</p>
//             </div>

//             {/* Stats Box */}
//             <div className="grid grid-cols-1 md:grid-cols-4 border-t border-gray-300 justify-center items-center gap-8 mt-14 pt-14">
//               {stats.map((stat, i) => (
//                 <div key={i} className= text-left"md:text-center gap-3 w-full flex items-center justify-center">
//                   <p className="text-4xl md:text-5xl font-bold" style={{ color: 'black' }}>
//                     {stat.value}
//                   </p>
//                   <p className="text-gray-600">{stat.label}</p>
//                   {i < stats.length - 1 && (
//                     <div className="hidden md:block absolute w-px bg-gray-300 top-0 bottom-0 right-0 translate-x-1/2" />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// /****************
//  * SAFE IMAGE (fallback gradient when blocked)
//  ****************/
// const SafeImage = ({ src, alt, className, style, fallback }) => {
//   const [failed, setFailed] = React.useState(false);
//   if (!src || failed) {
//     return fallback || <div className={className} style={{ ...style, background: "repeating-linear-gradient(45deg,#1f2937 0 10px,#111827 10px 20px)" }} aria-label={alt} />;
//   }
//   return <img src={src} alt={alt} className={className} style={style} onError={() => setFailed(true)} loading="lazy" />;
// };

// /****************
//  * PAGE
//  ****************/
// const Sambutan = () => {
//   const schoolInfo = SMAN25_CONFIG;
//   const theme = schoolInfo.theme;

//   return (
//     <div className="min-h-screen" style={{ background: theme.bg }}>
//       <NavbarComp theme={theme} />
//       <main>
//         <SambutanSection theme={theme} />
//       </main>
//       <FooterComp theme={theme} />
//     </div>
//   );
// };

// export default Sambutan;



import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQueries } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";

/****************************
 * HERO SECTION (Gambar hero diganti dengan foto gedung SMAN 25 Jakarta asli)
 ****************************/
const HeroSection = () => {
  const scrollToSambutan = () => {
    document.getElementById("sambutan")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden z-[1]">
      {/* Background Image - Foto Gedung SMAN 25 Jakarta (asli dari Facebook Alumni) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/sambutan.webp')`,
        }}
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-left md:text-center text-white px-6 mt-[-60px] max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Sambutan Kepala Sekolah
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed"
        >
          Selamat datang di website resmi SMAN 25 Jakarta. 
          Kami berkomitmen memberikan pendidikan berkualitas, 
          membentuk karakter unggul, dan menyiapkan generasi masa depan yang berprestasi.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          onClick={scrollToSambutan}
          className="px-6 py-3 rounded-xl bg-white text-black font-medium text-lg hover:bg-gray-100 transition shadow-xl"
        >
          Baca Sambutan Lengkap
        </motion.button>
      </div>
    </section>
  );
};

/****************************
 * DATA FETCHING
 ****************************/
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
          return data.sambutan || { name: "Kepala Sekolah", text: "" };
        },
        placeholderData: { name: "Kepala Sekolah SMAN 25 Jakarta", text: "" },
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
          return data.items || [];
        },
        placeholderData: [],
      },
    ],
  });
};

/****************************
 * SAFE IMAGE COMPONENT
 ****************************/
const SafeImage = ({ src, alt, className = "", fallback }: any) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return fallback || (
      <div
        className={`${className} bg-gradient-to-br from-gray-800 to-black flex items-center justify-center`}
        aria-label={alt}
      >
        <span className="text-white/50 text-sm">Gambar tidak tersedia</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
};

const SambutanSection = ({ theme }: any) => {
  const [sambutanQuery] = useSambutanAndHeadmasters();
  const sambutan = sambutanQuery.data;

  if (sambutanQuery.isPending) return <div className="py-24 text-left md:text-center">Loading sambutan...</div>;

  // Stats hardcoded sesuai screenshot (ganti dengan data API jika ada)
  const stats = [
    { value: "540 +", label: "Peserta Didik" },
    { value: "45 +", label: "Guru Tendik" },
    { value: "30 +", label: "Ruangan" },
    { value: "100", label: "Penghargaan" },
  ];

  return (
    <section id="sambutan" className="py-16 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-1 gap-12 items-center justify-center text-left md:text-center">
          {/* Bagian Kiri: Foto + Logo Sekolah */}
          <div className="relative">
            {/* Papan nama kecil di pojok kiri atas */}
            <div className="absolute top-0 left-0 z-10 w-48 md:w-64 -translate-y-8 md:-translate-y-12 -translate-x-4 md:-translate-x-8">
              {/* <SafeImage 
                src="/sman25-sign.jpg" // ganti dengan foto papan nama asli jika ada
                alt="SMAN 25 JAKARTA" 
                className="w-full" 
              /> */}
            </div>

            {/* Foto Kepala Sekolah */}
            <div className="relative rounded-2xl overflow-hidden">
              {/* <h1>{sambutan.photo}</h1> */}
              <SafeImage 
                // src={sambutan?.photo ? `https://dev.kiraproject.id${sambutan.photo}` : "/kapalaSekolah.png"}
                src={"/kapalaSekolah.png"}
                alt="Kepala Sekolah" 
                className="w-full h-[400px] md:h-[300px] object-contain" 
              />
            </div>
          </div>

          {/* Bagian Kanan: Teks + Stats */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Teks Sambutan */}
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
                <div key={i} className="text-left md:text-center gap-3 w-full flex items-center justify-center">
                  <p className="text-4xl md:text-5xl font-bold" style={{ color: 'black' }}>
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

/****************************
 * PAGE UTAMA
 ****************************/
const SambutanPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp theme={theme} />
      
      {/* Hero Section dengan gambar baru */}
      <HeroSection />

      {/* Main Content dengan overlap sedikit ke hero */}
      <main className="flex-1 -mt-20 relative z-[1]">
        <SambutanSection />
      </main>

      <FooterComp theme={theme} />
    </div>
  );
};

export default SambutanPage;