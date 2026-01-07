// import { SMAN25_CONFIG } from "@/core/theme";
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { animate, motion, useMotionValue, useScroll, useSpring } from "framer-motion";
// import { useEffect, useRef, useState } from "react";

// /****************
//  * SECTION WRAPPER
//  ****************/
// const Section = ({ children }: { children: React.ReactNode }) => (
//   <section className="py-12 md:py-16">
//     <div className="max-w-7xl mx-auto px-4">{children}</div>
//   </section>
// );

// /****************
//  * SCROLL PROGRESS
//  ****************/
// const ScrollProgress = ({ theme }: { theme: any }) => {
//   const { scrollYProgress } = useScroll();
//   const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
//   return (
//     <motion.div
//       style={{ scaleX, transformOrigin: "0% 50%", background: theme.accent }}
//       className="fixed left-0 right-0 top-0 h-1 z-[60]"
//       aria-hidden
//     />
//   );
// };

// /****************
//  * COUNTER
//  ****************/
// const Counter: React.FC<{ to: number }> = ({ to }) => {
//   const [count, setCount] = useState(0);
//   useEffect(() => {
//     const duration = 2000;
//     const steps = 60;
//     const stepValue = to / steps;
//     let current = 0;
//     const interval = setInterval(() => {
//       current += stepValue;
//       if (current >= to) {
//         setCount(to);
//         clearInterval(interval);
//       } else {
//         setCount(Math.round(current));
//       }
//     }, duration / steps);
//     return () => clearInterval(interval);
//   }, [to]);
//   return <span>{count}</span>;
// };

// /****************
//  * HERO SEJARAH
//  ****************/
// const HeroSejarah: React.FC<{ theme: any; data: any; schoolName: string }> = ({ theme, data, schoolName }) => {
//   const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//   const letters = Array.from(`Sejarah ${schoolName}`);
//   const easing = [0.33, 1, 0.68, 1];

//   return (
//     <section className="relative overflow-hidden">
//       <div
//         className="absolute inset-0 -z-10"
//         style={{
//           background: `radial-gradient(1200px 600px at 10% -20%, ${theme.accent}33 0%, transparent 60%), linear-gradient(180deg, ${theme.bg} 0%, ${theme.primary} 100%)`,
//         }}
//       />
//       {!prefersReducedMotion && (
//         <>
//           <motion.div
//             className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl"
//             style={{ background: theme.accent }}
//             initial={{ opacity: 0.2, y: -20 }}
//             animate={{ y: 10 }}
//             transition={{ repeat: Infinity, repeatType: "reverse", duration: 6 }}
//           />
//           <motion.div
//             className="absolute -bottom-24 right-10 w-72 h-72 rounded-full blur-3xl"
//             style={{ background: theme.subtle }}
//             initial={{ opacity: 0.25, y: 20 }}
//             animate={{ y: -10 }}
//             transition={{ repeat: Infinity, repeatType: "reverse", duration: 7.5 }}
//           />
//         </>
//       )}
//       <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
//         <motion.h1
//           className="text-3xl md:text-5xl font-bold leading-tight flex flex-wrap gap-1"
//           aria-label={`Sejarah ${schoolName}`}
//           style={{ color: theme.primaryText }}
//         >
//           {letters.map((ch, i) => (
//             <motion.span
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: prefersReducedMotion ? 0 : i * 0.03, duration: prefersReducedMotion ? 0 : 0.4, ease: easing }}
//             >
//               {ch === " " ? "\u00A0" : ch}
//             </motion.span>
//           ))}
//         </motion.h1>
//         <motion.p
//           className="mt-3 text-base md:text-lg opacity-90 max-w-3xl"
//           style={{ color: theme.primaryText }}
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: easing }}
//         >
//           Jejak perjalanan, tonggak penting, dan warisan budaya kerja yang membentuk karakter sekolah hingga hari ini.
//         </motion.p>
//         <div className="mt-6 grid grid-cols-3 gap-3 md:gap-4">
//           <div className="rounded-2xl p-4 border" style={{ background: theme.surface, borderColor: theme.subtle }}>
//             <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>Tahun Berdiri</div>
//             <div className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>
//               <Counter to={data.tahunBerdiri} />
//             </div>
//           </div>
//           <div className="rounded-2xl p-4 border" style={{ background: theme.surface, borderColor: theme.subtle }}>
//             <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>Jumlah Kepala Sekolah</div>
//             <div className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>
//               <Counter to={data.jumlahKepsek} />
//             </div>
//           </div>
//           <div className="rounded-2xl p-4 border" style={{ background: theme.surface, borderColor: theme.subtle }}>
//             <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>Kompetensi Keahlian</div>
//             <div className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>
//               <Counter to={data.kompetensiKeahlian} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// /****************
//  * TIMELINE
//  ****************/
// const Timeline: React.FC<{ theme: any; data: any[] }> = ({ theme, data }) => {
//   const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//   const lineRef = useRef<HTMLDivElement>(null);
//   const [lineHeight, setLineHeight] = useState(0);

//   useEffect(() => {
//     const el = lineRef.current;
//     if (!el) return;
//     const ro = new ResizeObserver(() => setLineHeight(el.clientHeight));
//     ro.observe(el);
//     setLineHeight(el.clientHeight);
//     return () => ro.disconnect();
//   }, []);

//   const pathLength = useMotionValue(0);
//   useEffect(() => {
//     if (prefersReducedMotion) {
//       pathLength.set(1);
//       return;
//     }
//     const controls = animate(pathLength, 1, { duration: 1.2, ease: [0.33, 1, 0.68, 1] });
//     return () => controls.stop();
//   }, [prefersReducedMotion, pathLength]);

//   return (
//     <Section>
//       <div className="grid md:grid-cols-[240px,1fr] gap-6 items-start">
//         <div>
//           <div className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>Timeline</div>
//           <p className="text-sm opacity-80 mt-1" style={{ color: theme.surfaceText }}>Tonggak sejarah yang menandai perkembangan sekolah.</p>
//         </div>
//         <div className="relative" ref={lineRef}>
//           <svg className="absolute left-4 top-0 h-full" width="12" height={lineHeight} aria-hidden>
//             <motion.line
//               x1="6"
//               x2="6"
//               y1="0"
//               y2={lineHeight}
//               stroke={theme.accent}
//               strokeWidth="4"
//               strokeLinecap="round"
//               style={{ pathLength }}
//             />
//           </svg>
//           <ul className="space-y-5">
//             {data.map((it, i) => (
//               <motion.li
//                 key={i}
//                 initial={{ opacity: 0, x: 20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true, amount: 0.4 }}
//                 transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : i * 0.05 }}
//                 className="relative pl-12 rounded-2xl p-4 border group hover:shadow-md"
//                 style={{ background: theme.surface, borderColor: theme.subtle }}
//               >
//                 <motion.div
//                   className="absolute left-1.5 top-5 w-6 h-6 rounded-full grid place-items-center border"
//                   style={{ background: theme.surface, borderColor: theme.accent }}
//                   whileHover={{ scale: prefersReducedMotion ? 1 : 1.06 }}
//                 >
//                   <span className="text-[10px] font-bold" style={{ color: "#1b1b1b", background: theme.accent, borderRadius: 9999, padding: "2px 6px" }}>
//                     {it.year}
//                   </span>
//                 </motion.div>
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <div className="text-base font-semibold" style={{ color: theme.surfaceText }}>{it.title}</div>
//                     <p className="text-sm mt-1 opacity-90" style={{ color: theme.surfaceText }}>{it.text}</p>
//                   </div>
//                 </div>
//               </motion.li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </Section>
//   );
// };

// /****************
//  * KEPALA SEKOLAH GRID
//  ****************/
// const KepalaSekolahGrid: React.FC<{ theme: any; data: any[] }> = ({ theme, data }) => {
//   const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//   return (
//     <Section>
//       <div className="flex items-end justify-between mb-4">
//         <div>
//           <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>Daftar Kepala Sekolah</h2>
//           <p className="text-sm opacity-70" style={{ color: theme.surfaceText }}>Estafet kepemimpinan dari masa ke masa.</p>
//         </div>
//       </div>
//       <div className="grid md:grid-cols-3 gap-4">
//         {data.map((p, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 16, rotateX: 10 }}
//             whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : i * 0.05, ease: [0.33, 1, 0.68, 1] }}
//             className="rounded-2xl p-4 border shadow-sm hover:shadow-md"
//             style={{ background: theme.surface, borderColor: theme.subtle }}
//           >
//             <img
//               src={`https://dev.kiraproject.id${p.foto}`}
//               alt={p.name}
//               className="w-24 h-24 object-cover rounded-full mb-2"
//               onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
//               loading="lazy"
//             />
//             <div className="text-sm font-semibold" style={{ color: theme.surfaceText }}>{p.name}</div>
//             <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>{p.period}</div>
//           </motion.div>
//         ))}
//       </div>
//     </Section>
//   );
// };

// /****************
//  * CATATAN KS
//  ****************/
// const CatatanKS: React.FC<{ theme: any; data: any }> = ({ theme, data }) => {
//   const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//   if (!data) return null;

//   return (
//     <Section>
//       <motion.div
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true, amount: 0.3 }}
//         transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
//         className="rounded-2xl p-5 border"
//         style={{ background: theme.surface, borderColor: theme.subtle }}
//       >
//         <div className="text-base font-semibold" style={{ color: theme.surfaceText }}>{data.title}</div>
//         <p className="text-sm md:text-base mt-2 opacity-90" style={{ color: theme.surfaceText }}>{data.text}</p>
//         <div className="mt-3 text-xs opacity-75" style={{ color: theme.surfaceText }}>
//           Diperbarui: {new Date(data.updated).toLocaleDateString("id-ID")}
//         </div>
//       </motion.div>
//     </Section>
//   );
// };

// /****************
//  * TO TOP
//  ****************/
// const ToTop = ({ theme }: { theme: any }) => {
//   const [show, setShow] = useState(false);
//   useEffect(() => {
//     const onScroll = () => setShow(window.scrollY > 400);
//     onScroll();
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);
//   return (
//     <motion.button
//       aria-label="Kembali ke atas"
//       onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//       initial={false}
//       animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12, pointerEvents: show ? 'auto' : 'none' }}
//       transition={{ duration: 0.2 }}
//       className="fixed right-4 bottom-4 rounded-xl px-3 py-2 border shadow-md z-50 flex items-center gap-1"
//       style={{ background: theme.accent, color: "#111827", borderColor: theme.subtle }}
//     >
//       <span>Up Arrow</span>
//     </motion.button>
//   );
// };

// /****************
//  * REACT-QUERY HOOKS
//  ****************/
// type SejarahData = {
//   stats: { tahunBerdiri: number; jumlahKepsek: number; kompetensiKeahlian: number };
//   timeline: { year: string; title: string; text: string }[];
//   kepsek: { name: string; period: string; foto: string }[];
//   catatanKS: { title: string; text: string; updated: string } | null;
// };

// const DEMO_DATA: SejarahData = {
//   stats: { tahunBerdiri: 1970, jumlahKepsek: 2, kompetensiKeahlian: 10 },
//   timeline: [],
//   kepsek: [],
//   catatanKS: null,
// };

// const useSejarahData = () => {
//   const xHost = getXHostHeader();

//   return useQuery<SejarahData, Error>({
//     queryKey: ['sejarah', xHost],
//     queryFn: async () => {
//       const endpoints = ['stats', 'timeline', 'kepsek', 'catatanKS'];
//       const base = `https://dev.kiraproject.id/sejarah`;

//       const results = await Promise.all(
//         endpoints.map(async (ep) => {
//           const res = await fetch(`${base}/${ep}`, {
//             cache: 'no-store',
//             headers: {
//               'X-Host': xHost,
//               'Cache-Control': 'no-store',
//             },
//           });
//           if (!res.ok) throw new Error(`Failed to load ${ep}`);
//           const data = await res.json();
//           return { ep, data };
//         })
//       );

//       const obj: any = {};
//       results.forEach(({ ep, data }) => {
//         if (ep === 'timeline' || ep === 'kepsek') {
//           obj[ep] = data.items || [];
//         } else {
//           obj[ep] = data;
//         }
//       });

//       return obj as SejarahData;
//     },
//     staleTime: 0,
//     gcTime: 0,
//     refetchOnMount: true,
//     refetchOnWindowFocus: false,
//     placeholderData: DEMO_DATA,
//     retry: 1,
//   });
// };

// /****************
//  * PAGE
//  ****************/
// const Page = ({ theme, schoolName }: { theme: any; schoolName: string }) => {
//   const { data = DEMO_DATA, isPending: loading, error } = useSejarahData();
//   const queryClient = useQueryClient();
//   const xHost = getXHostHeader();

//   useEffect(() => {
//     queryClient.invalidateQueries({ queryKey: ['sejarah'] });
//   }, [xHost, queryClient]);

//   if (loading) {
//     return (
//       <div className="min-h-screen" style={{ background: theme.bg }}>
//         <ScrollProgress theme={theme} />
//         <NavbarComp theme={theme} />
//         <div className="py-20 text-center" style={{ color: theme.surfaceText }}>
//           <p className="text-lg">Memuat data sejarah...</p>
//         </div>
//         <FooterComp theme={theme} />
//         <ToTop theme={theme} />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen" style={{ background: theme.bg }}>
//         <ScrollProgress theme={theme} />
//         <NavbarComp theme={theme} />
//         <div className="py-12 text-center" style={{ color: theme.surfaceText }}>
//           <p className="text-sm opacity-70">Error: {error.message}. Menggunakan data demo.</p>
//         </div>
//         <FooterComp theme={theme} />
//         <ToTop theme={theme} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen" style={{ background: theme.bg }}>
//       <ScrollProgress theme={theme} />
//       <NavbarComp theme={theme} />

//       {data.stats && <HeroSejarah theme={theme} data={data.stats} schoolName={schoolName} />}
//       {data.timeline?.length > 0 && <Timeline theme={theme} data={data.timeline} />}
//       {data.kepsek?.length > 0 && <KepalaSekolahGrid theme={theme} data={data.kepsek} />}
//       {data.catatanKS && <CatatanKS theme={theme} data={data.catatanKS} />}

//       <FooterComp theme={theme} />
//       <ToTop theme={theme} />
//     </div>
//   );
// };

// /****************
//  * EXPORT
//  ****************/
// const SejarahPage = () => {
//   const schoolInfo = SMAN25_CONFIG;
//   const theme = schoolInfo.theme;
//   const schoolName = schoolInfo.fullName;

//   return <Page theme={theme} schoolName={schoolName} />;
// };

// export default SejarahPage;


import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { animate, motion, useMotionValue, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/****************************
 * HERO SECTION UNTUK SEJARAH SEKOLAH
 ****************************/
const HeroSection = ({ schoolName }: { schoolName: string }) => {
  const scrollToContent = () => {
    document.getElementById("sejarah")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      {/* Background Image - Representatif sejarah sekolah */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero2.png')`, // Ganti dengan foto gedung sekolah lama atau arsip jika ada
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
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Sejarah {schoolName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Jejak perjalanan, tonggak penting, dan warisan yang membentuk karakter sekolah hingga hari ini.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          onClick={scrollToContent}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          Jelajahi Sejarah
        </motion.button>
      </div>
    </section>
  );
};

/****************
 * SECTION WRAPPER
 ****************/
const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="py-12 md:py-16">
    <div className="max-w-7xl mx-auto px-4">{children}</div>
  </section>
);

/****************
 * SCROLL PROGRESS
 ****************/
const ScrollProgress = ({ theme }: { theme: any }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%", background: theme.accent }}
      className="fixed left-0 right-0 top-0 h-1 z-[60]"
      aria-hidden
    />
  );
};

/****************
 * COUNTER
 ****************/
const Counter: React.FC<{ to: number }> = ({ to }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepValue = to / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += stepValue;
      if (current >= to) {
        setCount(to);
        clearInterval(interval);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [to]);
  return <span>{count}</span>;
};

/****************
 * HERO SEJARAH
 ****************/
const HeroSejarah: React.FC<{ theme: any; data: any; schoolName: string }> = ({ theme, data, schoolName }) => {
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // const letters = Array.from(`Sejarah ${schoolName}`);
  const easing = [0.33, 1, 0.68, 1];

  return (
    <Section>
      <div id="sejarah" className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(1200px 600px at 10% -20%, ${theme.accent}33 0%, transparent 60%), linear-gradient(180deg, ${theme.bg} 0%, ${theme.primary} 100%)`,
          }}
        />
        {!prefersReducedMotion && (
          <>
            <motion.div
              className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl"
              style={{ background: theme.accent }}
              initial={{ opacity: 0.2, y: -20 }}
              animate={{ y: 10 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 6 }}
            />
            <motion.div
              className="absolute -bottom-24 right-10 w-72 h-72 rounded-full blur-3xl"
              style={{ background: theme.subtle }}
              initial={{ opacity: 0.25, y: 20 }}
              animate={{ y: -10 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 7.5 }}
            />
          </>
        )}
        <div className="max-w-7xl mx-auto px-0 py-4 md:py-0">
          {/* <motion.h1
            className="text-3xl md:text-5xl font-bold leading-tight flex flex-wrap gap-1"
            aria-label={`Sejarah ${schoolName}`}
            style={{ color: theme.primaryText }}
          >
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : i * 0.03, duration: prefersReducedMotion ? 0 : 0.4, ease: easing }}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </motion.h1> */}
          <motion.p
            className="mt-3 text-base md:text-lg opacity-90 max-w-3xl"
            style={{ color: theme.primaryText }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: easing }}
          >
            Jejak perjalanan, tonggak penting, dan warisan budaya kerja yang membentuk karakter sekolah hingga hari ini.
          </motion.p>
          <div className="mt-6 grid grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-2xl p-4 border" style={{ background: theme.surface, borderColor: theme.subtle }}>
              <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>Tahun Berdiri</div>
              <div className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>
                <Counter to={data.tahunBerdiri} />
              </div>
            </div>
            <div className="rounded-2xl p-4 border" style={{ background: theme.surface, borderColor: theme.subtle }}>
              <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>Jumlah Kepala Sekolah</div>
              <div className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>
                <Counter to={data.jumlahKepsek} />
              </div>
            </div>
            <div className="rounded-2xl p-4 border" style={{ background: theme.surface, borderColor: theme.subtle }}>
              <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>Kompetensi Keahlian</div>
              <div className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>
                <Counter to={data.kompetensiKeahlian} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

/****************
 * TIMELINE
 ****************/
const Timeline: React.FC<{ theme: any; data: any[] }> = ({ theme, data }) => {
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lineRef = useRef<HTMLDivElement>(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setLineHeight(el.clientHeight));
    ro.observe(el);
    setLineHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  const pathLength = useMotionValue(0);
  useEffect(() => {
    if (prefersReducedMotion) {
      pathLength.set(1);
      return;
    }
    const controls = animate(pathLength, 1, { duration: 1.2, ease: [0.33, 1, 0.68, 1] });
    return () => controls.stop();
  }, [prefersReducedMotion, pathLength]);

  return (
    <Section>
      <div className="grid md:grid-cols-[240px,1fr] gap-6 items-start">
        <div>
          <div className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>Timeline</div>
          <p className="text-sm opacity-80 mt-1" style={{ color: theme.surfaceText }}>Tonggak sejarah yang menandai perkembangan sekolah.</p>
        </div>
        <div className="relative" ref={lineRef}>
          <svg className="absolute left-4 top-0 h-full" width="12" height={lineHeight} aria-hidden>
            <motion.line
              x1="6"
              x2="6"
              y1="0"
              y2={lineHeight}
              stroke={theme.accent}
              strokeWidth="4"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>
          <ul className="space-y-5">
            {data.map((it, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : i * 0.05 }}
                className="relative pl-12 rounded-2xl p-4 border group hover:shadow-md"
                style={{ background: theme.surface, borderColor: theme.subtle }}
              >
                <motion.div
                  className="absolute left-1.5 top-5 w-6 h-6 rounded-full grid place-items-center border"
                  style={{ background: theme.surface, borderColor: theme.accent }}
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.06 }}
                >
                  <span className="text-[10px] font-bold" style={{ color: "#1b1b1b", background: theme.accent, borderRadius: 9999, padding: "2px 6px" }}>
                    {it.year}
                  </span>
                </motion.div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold" style={{ color: theme.surfaceText }}>{it.title}</div>
                    <p className="text-sm mt-1 opacity-90" style={{ color: theme.surfaceText }}>{it.text}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

/****************
 * KEPALA SEKOLAH GRID
 ****************/
const KepalaSekolahGrid: React.FC<{ theme: any; data: any[] }> = ({ theme, data }) => {
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>Daftar Kepala Sekolah</h2>
          <p className="text-sm opacity-70" style={{ color: theme.surfaceText }}>Estafet kepemimpinan dari masa ke masa.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : i * 0.05, ease: [0.33, 1, 0.68, 1] }}
            className="rounded-2xl p-4 border shadow-sm hover:shadow-md"
            style={{ background: theme.surface, borderColor: theme.subtle }}
          >
            <div className="w-24 h-24 bg-gray-200 border-2 border-dashed rounded-full mb-2" /> {/* Placeholder foto */}
            <div className="text-sm font-semibold" style={{ color: theme.surfaceText }}>{p.name}</div>
            <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>{p.period}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

/****************
 * CATATAN KS
 ****************/
const CatatanKS: React.FC<{ theme: any; data: any }> = ({ theme, data }) => {
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!data) return null;

  return (
    <Section>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        className="rounded-2xl p-5 border"
        style={{ background: theme.surface, borderColor: theme.subtle }}
      >
        <div className="text-base font-semibold" style={{ color: theme.surfaceText }}>{data.title}</div>
        <p className="text-sm md:text-base mt-2 opacity-90" style={{ color: theme.surfaceText }}>{data.text}</p>
        <div className="mt-3 text-xs opacity-75" style={{ color: theme.surfaceText }}>
          Diperbarui: {new Date(data.updated).toLocaleDateString("id-ID")}
        </div>
      </motion.div>
    </Section>
  );
};

/****************
 * TO TOP
 ****************/
const ToTop = ({ theme }: { theme: any }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.button
      aria-label="Kembali ke atas"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12, pointerEvents: show ? 'auto' : 'none' }}
      transition={{ duration: 0.2 }}
      className="fixed right-4 bottom-4 rounded-xl px-3 py-2 border shadow-md z-50 flex items-center gap-1"
      style={{ background: theme.accent, color: "#111827", borderColor: theme.subtle }}
    >
      <span>Up Arrow</span>
    </motion.button>
  );
};

/****************
 * DUMMY DATA (BERDASARKAN INFORMASI RIIL)
 ****************/
const DUMMY_DATA = {
  stats: { 
    tahunBerdiri: 1964, 
    jumlahKepsek: 19, 
    kompetensiKeahlian: 2 // MIPA dan IPS sebagai contoh umum untuk SMA
  },
  timeline: [
    { year: "1964", title: "Pembukaan sebagai Filial SMA Negeri 1", text: "Dibuka pada 18 September 1964 di Kampung Duri, menempati gedung SD swasta." },
    { year: "1966", title: "Pindah Lokasi", text: "Pindah ke SD Jelambar Grogol hingga 1966." },
    { year: "1966", title: "Menempati Gedung di Petojo", text: "Menempati gedung eks sekolah BAPERKI di Jl. Petojo Selatan (sekarang A.M. Sangaji)." },
    { year: "1967", title: "Resmi Menjadi SMAN 25 Jakarta", text: "Terhitung 1 Juli 1967 resmi menjadi SMA Negeri 25 Jakarta." },
    { year: "1987", title: "Hak Pakai Penuh Gedung", text: "Mendapat hak pakai seluruh gedung." },
    { year: "1989", title: "Rehabilitasi Gedung", text: "Rehab total, sementara menumpang di SD Duta Merlin." },
    { year: "1992", title: "Kembali ke Gedung Baru", text: "1 Februari 1992 kembali ke gedung baru berlantai 3." },
    { year: "2006", title: "Menjadi SMA Plus", text: "Memenuhi kriteria SMA Plus Standar Kotamadya." },
  ],
  kepsek: [
    { name: "Zuber Djamaludin", period: "1964 - 1975", foto: "/placeholder-kepsek1.jpg" },
    { name: "Drs. M. Hasibuan", period: "1975 - 1980", foto: "/placeholder-kepsek2.jpg" },
    { name: "Drs. Haryono", period: "1980 - 1983", foto: "/placeholder-kepsek3.jpg" },
    { name: "Subonowo", period: "1983 - 1988", foto: "/placeholder-kepsek4.jpg" },
    { name: "Siti Anipah", period: "1988 - 1989", foto: "/placeholder-kepsek5.jpg" },
    { name: "Drs. Sri Kuntjara, HS.", period: "1989 - 1993", foto: "/placeholder-kepsek6.jpg" },
    { name: "Drs. H. Indrata Kusuma", period: "1993 - 1995", foto: "/placeholder-kepsek7.jpg" },
    { name: "Ign. Hadi Prasodjo", period: "1995 - 1999", foto: "/placeholder-kepsek8.jpg" },
    { name: "Drs. Suhaman", period: "1999 - 2002", foto: "/placeholder-kepsek9.jpg" },
    { name: "Drs. H. Suyitno", period: "2002 - 2004", foto: "/placeholder-kepsek10.jpg" },
    { name: "Dra. Hj. Radhiyati Soehaili, M.Pd", period: "2004 - 2007", foto: "/placeholder-kepsek11.jpg" },
    { name: "Dra. Hj. Hastuti Rostyaningsih, MM", period: "2007 - 2009", foto: "/placeholder-kepsek12.jpg" },
    { name: "Drs. Suradi", period: "2009 - 2012", foto: "/placeholder-kepsek13.jpg" },
    { name: "Dra. Jati Muljati", period: "2012 - 2014", foto: "/placeholder-kepsek14.jpg" },
    { name: "Rachmat A. Syukur, S.Pd", period: "2014 - 2016", foto: "/placeholder-kepsek15.jpg" },
    { name: "Achmad Faisal, S.Pd", period: "2016 - 2018", foto: "/placeholder-kepsek16.jpg" },
    { name: "Dra. Fauro", period: "2018 - 2019", foto: "/placeholder-kepsek17.jpg" },
    { name: "Saryanti, S.Pd, M.Si", period: "2019 - 2022", foto: "/placeholder-kepsek18.jpg" },
    { name: "Triyem, S.Pd, M.Si", period: "2022 - sekarang", foto: "/placeholder-kepsek19.jpg" },
  ],
  catatanKS: {
    title: "Catatan dari Kepala Sekolah Saat Ini",
    text: "SMAN 25 Jakarta terus berkomitmen meningkatkan kualitas pendidikan dan membentuk generasi berprestasi dengan karakter kuat.",
    updated: "2026-01-01"
  },
};

/****************
 * PAGE DENGAN HERO BARU DAN DUMMY DATA
 ****************/
const Page = ({ theme, schoolName }: { theme: any; schoolName: string }) => {
  const data = DUMMY_DATA;

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <ScrollProgress theme={theme} />
      <NavbarComp theme={theme} />

      {/* HERO SECTION BARU */}
      <HeroSection schoolName={schoolName} />

      {data.stats && <HeroSejarah theme={theme} data={data.stats} schoolName={schoolName} />}
      {data.timeline?.length > 0 && <Timeline theme={theme} data={data.timeline} />}
      {data.kepsek?.length > 0 && <KepalaSekolahGrid theme={theme} data={data.kepsek} />}
      {data.catatanKS && <CatatanKS theme={theme} data={data.catatanKS} />}

      <FooterComp theme={theme} />
      <ToTop theme={theme} />
    </div>
  );
};

/****************
 * EXPORT
 ****************/
const SejarahPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  return <Page theme={theme} schoolName={schoolName} />;
};

export default SejarahPage;