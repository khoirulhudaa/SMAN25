// import { SMAN25_CONFIG } from "@/core/theme";
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
// import { useEffect, useMemo, useRef, useState } from "react";

// /****************************
//  * UTILS
//  ****************************/
// const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
// const fmtDate = (iso) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

// const VIEWS_KEY = "newsViews:v2";
// const SEEN_KEY = "newsSeen:v2";

// const loadViews = () => {
//   try {
//     const raw = localStorage.getItem(VIEWS_KEY);
//     return raw ? JSON.parse(raw) : {};
//   } catch {
//     return {};
//   }
// };
// const saveViews = (obj) => {
//   try {
//     localStorage.setItem(VIEWS_KEY, JSON.stringify(obj));
//   } catch {}
// };

// const loadSeen = () => {
//   try {
//     const raw = sessionStorage.getItem(SEEN_KEY);
//     return raw ? JSON.parse(raw) : {};
//   } catch {
//     return {};
//   }
// };
// const saveSeen = (obj) => {
//   try {
//     sessionStorage.setItem(SEEN_KEY, JSON.stringify(obj));
//   } catch {}
// };

// /****************************
//  * COMPONENTS
//  ****************************/
// const CardBadge = ({ children, theme, variant = "default" }) => {
//   const style =
//     variant === "dinas"
//       ? { borderColor: theme.dinas, color: "white", background: theme.dinas + "22" }
//       : { borderColor: theme.subtle, color: theme.primaryText };
//   return (
//     <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] border" style={style}>
//       {children}
//     </span>
//   );
// };

// const Eye = ({ className, style }) => <span className={className} style={style}>View</span>;

// const CardFrame = ({ theme, children, accentColor }) => (
//   <motion.div
//     layout
//     initial={{ opacity: 0, y: 12 }}
//     animate={{ opacity: 1, y: 0 }}
//     exit={{ opacity: 0, y: -8 }}
//     className="rounded-2xl border p-4 flex gap-3 hover:shadow-md transition"
//     style={{ borderColor: theme.subtle, background: theme.surface }}
//   >
//     <div className="w-1 rounded-full" style={{ background: accentColor || theme.accent }} />
//     <div className="flex-1 min-w-0">{children}</div>
//   </motion.div>
// );

// /****************************
//  * SECTION: Berita
//  ****************************/
// function BeritaSection({ theme, schoolName }) {
//   const [q, setQ] = useState("");
//   const [cat, setCat] = useState("Semua");
//   const [src, setSrc] = useState("Semua");
//   const [selected, setSelected] = useState(null);
//   const [newsData, setNewsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [views, setViews] = useState({});
//   const cardRefs = useRef({});

//   const xHost = getXHostHeader();

//   // Fetch news
//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch("https://dev.kiraproject.id/public/berita?page=1&limit=50", {
//           method: "GET",
//           headers: {
//             "X-Host": xHost,
//             "Cache-Control": "no-store",
//           },
//           cache: "no-store",
//         });

//         if (!response.ok) throw new Error(`HTTP ${response.status}`);
//         const result = await response.json();

//         if (!result.success) throw new Error("API response not success");

//         const mapped = result.data.map((item) => ({
//           id: item.id,
//           title: item.title,
//           slug: item.slug,
//           desc: item.excerpt || "Tidak ada deskripsi.",
//           img: item.featuredImage || "/default-berita.png",
//           category: item.kategori || "Umum",
//           source: item.source?.type || "Sekolah",
//           author: item.author?.name || "Humas",
//           date: fmtDate(item.publishedAt),
//           views: item.viewCount || 0,
//         }));

//         setNewsData(mapped);
//       } catch (err) {
//         console.warn("Fetch Error:", err);
//         setError("Gagal memuat berita");
//         setNewsData([]); // Tidak ada data demo
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNews();
//   }, [xHost]);

//   // Load views
//   useEffect(() => {
//     setViews(loadViews());
//   }, []);

//   // Intersection Observer untuk hit view
//   useEffect(() => {
//     const seen = loadSeen();
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const slug = entry.target.getAttribute("data-slug");
//             if (slug && !seen[slug]) {
//               seen[slug] = true;
//               saveSeen(seen);
//               setViews((prev) => {
//                 const next = { ...prev, [slug]: (prev[slug] || 0) + 1 };
//                 saveViews(next);
//                 return next;
//               });
//               observer.unobserve(entry.target);
//             }
//           }
//         });
//       },
//       { threshold: 0.5 }
//     );

//     Object.values(cardRefs.current).forEach((el) => el && observer.observe(el));
//     return () => observer.disconnect();
//   }, [newsData]);

//   const categories = useMemo(() => ["Semua", ...Array.from(new Set(newsData.map((n) => n.category)))], [newsData]);
//   const sources = useMemo(() => ["Semua", ...Array.from(new Set(newsData.map((n) => n.source)))], [newsData]);

//   const filtered = useMemo(() => {
//     const nq = q.trim().toLowerCase();
//     return newsData.filter((n) => {
//       const okQ = !nq || n.title.toLowerCase().includes(nq) || n.desc.toLowerCase().includes(nq) || n.author.toLowerCase().includes(nq);
//       const okC = cat === "Semua" || n.category === cat;
//       const okS = src === "Semua" || n.source === src;
//       return okQ && okC && okS;
//     });
//   }, [q, cat, src, newsData]);

//   const openDetail = (item) => setSelected(item);

//   return (
//     <section id="berita" className="py-12 md:py-16">
//       <div className="max-w-6xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="lg:flex items-start justify-between gap-4 mb-4"
//         >
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.accent }}>
//               Berita {schoolName}
//             </h2>
//             <p className="text-sm opacity-80" style={{ color: theme.primaryText }}>
//               Informasi terbaru kegiatan sekolah dan berita resmi dari Dinas.
//             </p>
//           </div>
//           <div className="text-xs text-right lg:mt-0 mt-3" style={{ color: theme.primaryText }}>
//             <div>Total: <strong>{newsData.length}</strong></div>
//             <div>Tersaring: <strong>{filtered.length}</strong></div>
//           </div>
//         </motion.div>

//         {error && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="rounded-xl border p-4 mb-4 text-center"
//             style={{ borderColor: theme.subtle, background: theme.surface, color: theme.pop }}
//           >
//             {error}
//           </motion.div>
//         )}

//         <motion.div
//           initial={{ opacity: 0, y: 8 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6 flex flex-col md:flex-row gap-3"
//         >
//           <input
//             type="text"
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Cari berita…"
//             className="flex-1 px-3 py-2 rounded-xl text-sm border bg-transparent"
//             style={{ borderColor: theme.subtle, color: theme.primaryText }}
//           />
//           <div className="flex gap-2">
//             <select
//               value={cat}
//               onChange={(e) => setCat(e.target.value)}
//               className="px-3 py-2 rounded-xl text-sm border bg-transparent"
//               style={{ borderColor: theme.subtle, color: theme.primaryText }}
//             >
//               {categories.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//             <select
//               value={src}
//               onChange={(e) => setSrc(e.target.value)}
//               className="px-3 py-2 rounded-xl text-sm border bg-transparent"
//               style={{ borderColor: theme.subtle, color: theme.primaryText }}
//             >
//               {sources.map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </motion.div>

//         {loading ? (
//           <div className="grid md:grid-cols-2 gap-4">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="rounded-2xl p-4 border animate-pulse" style={{ borderColor: theme.subtle, background: theme.surface }}>
//                 <div className="h-4 bg-white/20 rounded w-1/3 mb-2" />
//                 <div className="h-6 bg-white/20 rounded w-3/4 mb-3" />
//                 <div className="h-4 bg-white/20 rounded w-full" />
//                 <div className="h-4 bg-white/20 rounded w-2/3 mt-2" />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 gap-4">
//             <AnimatePresence mode="popLayout">
//               {filtered.length > 0 ? (
//                 filtered.map((n) => {
//                   const slug = slugify(n.title);
//                   return (
//                     <div
//                       key={n.id}
//                       data-slug={slug}
//                       ref={(el) => (cardRefs.current[slug] = el)}
//                     >
//                       <CardFrame theme={theme} accentColor={n.source.includes("DINAS") ? theme.dinas : theme.accent}>
//                         <div className="flex flex-col gap-1">
//                           <div className="text-xs opacity-75 flex items-center gap-2" style={{ color: theme.surfaceText }}>
//                             <span>{n.date} · {n.author}</span>
//                             <span className="inline-flex items-center gap-1 opacity-90">
//                               <Eye />
//                               {(views[slug] || 0) + (n.views || 0)}
//                             </span>
//                           </div>
//                           <h3 className="font-semibold leading-snug line-clamp-2" style={{ color: theme.primaryText }}>
//                             {n.title}
//                           </h3>
//                           <p className="mt-1 text-sm line-clamp-2" style={{ color: theme.surfaceText }}>
//                             {n.desc}
//                           </p>
//                           <div className="mt-2 flex items-center gap-2">
//                             <CardBadge theme={theme}>{n.category}</CardBadge>
//                             {n.source.includes("DINAS") && <CardBadge theme={theme} variant="dinas">Dinas</CardBadge>}
//                             <button
//                               className="text-xs px-3 py-1 rounded-lg border"
//                               style={{ borderColor: theme.subtle, color: theme.primaryText }}
//                               onClick={() => openDetail(n)}
//                             >
//                               Baca
//                             </button>
//                           </div>
//                         </div>
//                       </CardFrame>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <motion.div
//                   layout
//                   className="col-span-full text-center text-sm opacity-80 py-8"
//                   style={{ color: theme.primaryText }}
//                 >
//                   Tidak ada berita yang cocok.
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         )}

//         {/* Modal Detail */}
//         <AnimatePresence>
//           {selected && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-50 flex items-center justify-center p-4"
//               onClick={() => setSelected(null)}
//             >
//               <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} />
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="relative max-w-2xl w-full rounded-2xl border p-6 max-h-[90vh] overflow-y-auto"
//                 style={{ background: theme.surface, borderColor: theme.subtle }}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-xl font-bold" style={{ color: theme.primaryText }}>
//                     {selected.title}
//                   </h3>
//                   <button
//                     onClick={() => setSelected(null)}
//                     className="px-3 py-1 rounded-lg border text-xs"
//                     style={{ borderColor: theme.subtle, color: theme.primaryText }}
//                   >
//                     Tutup
//                   </button>
//                 </div>
//                 <img
//                   src={selected.img}
//                   alt={selected.title}
//                   className="w-full rounded-xl border mb-3"
//                   style={{ borderColor: theme.subtle }}
//                 />
//                 <div className="text-xs opacity-80 mb-2" style={{ color: theme.primaryText }}>
//                   {selected.date} · {selected.author} · {selected.category}
//                   {selected.source.includes("DINAS") && " · Dinas"}
//                 </div>
//                 <p className="text-sm leading-relaxed" style={{ color: theme.primaryText }}>
//                   {selected.desc}
//                 </p>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </section>
//   );
// }

// /****************************
//  * PAGE
//  ****************************/
// const BeritaPage = () => {
//   const schoolInfo = SMAN25_CONFIG;
//   const theme = schoolInfo.theme;
//   const schoolName = schoolInfo.fullName;

//   return (
//     <div className="min-h-screen" style={{ background: theme.bg }}>
//       <NavbarComp theme={theme} />
//       <main>
//         <BeritaSection theme={theme} schoolName={schoolName} />
//       </main>
//       <FooterComp theme={theme} />
//     </div>
//   );
// };

// export default BeritaPage;


import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/****************************
 * HERO SECTION (Tinggi 86vh)
 ****************************/
const HeroSection = () => {
  const scrollToBerita = () => {
    document.getElementById("berita")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[91vh] flex items-center justify-center overflow-hidden">
      {/* Background Image - Gedung SMAN 25 Jakarta (foto resmi dari sumber terpercaya) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')`,        }}
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 -mt-6 text-center text-white px-6 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Berita Terbaru SMAN 25 Jakarta
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed"
        >
          Informasi terbaru kegiatan sekolah, prestasi siswa, dan pengumuman resmi dari Dinas Pendidikan.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={scrollToBerita}
          className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition shadow-lg"
        >
          Lihat Berita Terbaru
        </motion.button>
      </div>
    </section>
  );
};

/****************************
 * UTILS
 ****************************/
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const fmtDate = (iso) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const VIEWS_KEY = "newsViews:v2";
const SEEN_KEY = "newsSeen:v2";

const loadViews = () => {
  try {
    const raw = localStorage.getItem(VIEWS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};
const saveViews = (obj) => {
  try {
    localStorage.setItem(VIEWS_KEY, JSON.stringify(obj));
  } catch {}
};

const loadSeen = () => {
  try {
    const raw = sessionStorage.getItem(SEEN_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};
const saveSeen = (obj) => {
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(obj));
  } catch {}
};

/****************************
 * COMPONENTS
 ****************************/
const CardBadge = ({ children, theme, variant = "default" }) => {
  const style =
    variant === "dinas"
      ? { borderColor: theme.dinas || "#dc2626", color: "white", background: (theme.dinas || "#dc2626") + "33" }
      : { borderColor: theme.subtle, color: theme.primaryText };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] border font-medium" style={style}>
      {children}
    </span>
  );
};

const Eye = ({ className }) => <span className={className}>👁️</span>;

const CardFrame = ({ theme, children, accentColor }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    className="rounded-2xl border p-4 flex gap-3 hover:shadow-md transition cursor-pointer"
    style={{ borderColor: theme.subtle, background: theme.surface }}
  >
    <div className="w-1 rounded-full" style={{ background: accentColor || theme.accent }} />
    <div className="flex-1 min-w-0">{children}</div>
  </motion.div>
);

/****************************
 * SECTION: Berita (layout tetap persis seperti kode asli)
 ****************************/
function BeritaSection({ theme, schoolName }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");
  const [src, setSrc] = useState("Semua");
  const [selected, setSelected] = useState<any>(null);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [views, setViews] = useState({});
  const cardRefs = useRef({});

  const xHost = getXHostHeader();

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("https://dev.kiraproject.id/public/berita?page=1&limit=50", {
          method: "GET",
          headers: {
            "X-Host": xHost,
            "Cache-Control": "no-store",
          },
          cache: "no-store",
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();

        if (!result.success) throw new Error("API response not success");

        const mapped = result.data.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          desc: item.excerpt || "Tidak ada deskripsi.",
          img: item.featuredImage || "/default-berita.png",
          category: item.kategori || "Umum",
          source: item.source?.type || "Sekolah",
          author: item.author?.name || "Humas",
          date: fmtDate(item.publishedAt),
          views: item.viewCount || 0,
        }));

        setNewsData(mapped);
      } catch (err) {
        console.warn("Fetch Error:", err);
        setError("Gagal memuat berita");
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [xHost]);

  // Load views
  useEffect(() => {
    setViews(loadViews());
  }, []);

  // Intersection Observer untuk hit view
  useEffect(() => {
    const seen = loadSeen();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute("data-slug");
            if (slug && !seen[slug]) {
              seen[slug] = true;
              saveSeen(seen);
              setViews((prev) => {
                const next = { ...prev, [slug]: (prev[slug] || 0) + 1 };
                saveViews(next);
                return next;
              });
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(cardRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [newsData]);

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(newsData.map((n) => n.category)))], [newsData]);
  const sources = useMemo(() => ["Semua", ...Array.from(new Set(newsData.map((n) => n.source)))], [newsData]);

  const filtered = useMemo(() => {
    const nq = q.trim().toLowerCase();
    return newsData.filter((n) => {
      const okQ = !nq || n.title.toLowerCase().includes(nq) || n.desc.toLowerCase().includes(nq) || n.author.toLowerCase().includes(nq);
      const okC = cat === "Semua" || n.category === cat;
      const okS = src === "Semua" || n.source === src;
      return okQ && okC && okS;
    });
  }, [q, cat, src, newsData]);

  const openDetail = (item) => setSelected(item);

  return (
    <section id="berita" className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:flex items-start justify-between gap-4 mb-4"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Berita {schoolName}
            </h2>
            <p className="text-sm text-black/70">
              Informasi terbaru kegiatan sekolah dan berita resmi dari Dinas.
            </p>
          </div>
          <div className="text-xs text-right lg:mt-0 mt-3 text-black/70">
            <div>Total: <strong>{newsData.length}</strong></div>
            <div>Tersaring: <strong>{filtered.length}</strong></div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border p-4 mb-4 text-center bg-white"
          >
            <p className="text-red-600">{error}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col md:flex-row gap-3"
        >
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari berita…"
            className="flex-1 px-4 py-3 rounded-xl text-sm border border-black/20 bg-white focus:border-black transition"
          />
          <div className="flex gap-3">
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="px-4 py-3 rounded-xl text-sm border border-black/20 bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              className="px-4 py-3 rounded-xl text-sm border border-black/20 bg-white"
            >
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl p-6 bg-white border border-black/10 animate-pulse">
                <div className="h-4 bg-black/10 rounded w-1/3 mb-3" />
                <div className="h-7 bg-black/20 rounded w-full mb-4" />
                <div className="h-4 bg-black/10 rounded w-full" />
                <div className="h-4 bg-black/10 rounded w-4/5 mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                filtered.map((n) => {
                  const slug = slugify(n.title);
                  return (
                    <div
                      key={n.id}
                      data-slug={slug}
                      ref={(el) => (cardRefs.current[slug] = el)}
                    >
                      <CardFrame theme={theme} accentColor={n.source === "Dinas" ? "#dc2626" : theme.accent}>
                        <div className="flex flex-col gap-2">
                          <div className="text-xs text-black/60 flex items-center gap-3">
                            <span>{n.date} · {n.author}</span>
                            <span className="flex items-center gap-1">
                              <Eye className="text-sm" />
                              {(views[slug] || 0) + (n.views || 0)}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-black leading-snug line-clamp-2">
                            {n.title}
                          </h3>
                          <p className="text-sm text-black/70 line-clamp-3">
                            {n.desc}
                          </p>
                          <div className="mt-3 flex items-center gap-3 flex-wrap">
                            <CardBadge theme={theme}>{n.category}</CardBadge>
                            {n.source === "Dinas" && <CardBadge theme={theme} variant="dinas">Dinas</CardBadge>}
                            <button
                              className="ml-auto px-4 py-2 rounded-lg border border-black/20 text-sm font-medium hover:bg-black hover:text-white transition"
                              onClick={() => openDetail(n)}
                            >
                              Baca Selengkapnya
                            </button>
                          </div>
                        </div>
                      </CardFrame>
                    </div>
                  );
                })
              ) : (
                <motion.div
                  layout
                  className="col-span-full text-center py-16 text-black/50 text-lg"
                >
                  Tidak ada berita yang cocok dengan filter saat ini.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Modal Detail */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelected(null)}
            >
              <div className="absolute inset-0 bg-black/70" />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative max-w-3xl w-full rounded-3xl bg-white p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-black">
                    {selected.title}
                  </h3>
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 rounded-lg border border-black/20 hover:bg-black hover:text-white transition"
                  >
                    Tutup
                  </button>
                </div>

                {selected.img && (
                  <img
                    src={selected.img}
                    alt={selected.title}
                    className="w-full rounded-2xl mb-6 object-cover shadow-md"
                  />
                )}

                <div className="text-sm text-black/60 mb-6">
                  {selected.date} · {selected.author} · {selected.category}
                  {selected.source === "Dinas" && " · Dinas"}
                </div>

                <p className="text-base leading-relaxed text-black/80 whitespace-pre-wrap">
                  {selected.desc}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/****************************
 * PAGE UTAMA
 ****************************/
const BeritaPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp theme={theme} />
      
      {/* Hero 86vh */}
      <HeroSection />

      {/* Main content dengan sedikit overlap ke hero */}
      <main className="flex-1 -mt-20 relative z-10">
        <BeritaSection theme={theme} schoolName={schoolName} />
      </main>
      
      <FooterComp theme={theme} />
    </div>
  );
};

export default BeritaPage;