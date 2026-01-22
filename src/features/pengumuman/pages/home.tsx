// import { SMAN25_CONFIG } from "@/core/theme";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
// import React, { useEffect, useState } from "react";

// /****************************
//  * UTILS
//  ****************************/
// const cx = (...cls: (string | boolean | undefined)[]) => cls.filter(Boolean).join(" ");
// const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
// const isNewWithin = (iso: string, days = 7) => {
//   const d = new Date(iso).getTime();
//   return Date.now() - d <= days * 24 * 60 * 60 * 1000;
// };

// /****************************
//  * FEED BUILDERS (JSON Feed & RSS 2.0)
//  ****************************/
// const xmlEsc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));

// function buildJSONFeed(items: Announcement[], schoolName: string) {
//   const feed = {
//     version: "https://jsonfeed.org/version/1.1",
//     title: `Pengumuman ${schoolName}`,
//     home_page_url: "#pengumuman",
//     feed_url: "#pengumuman?format=json",
//     items: items.map((d) => ({
//       id: d.id,
//       title: d.title,
//       content_text: d.body,
//       date_published: new Date(d.date).toISOString(),
//       tags: [d.tag],
//       authors: [{ name: schoolName }],
//       _meta: { source: d.source, pinned: !!d.pinned },
//       url: `#pengumuman-${d.id}`,
//     })),
//   };
//   return JSON.stringify(feed, null, 2);
// }

// function buildRSS(items: Announcement[], schoolName: string) {
//   const now = new Date().toUTCString();
//   const header = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>Pengumuman ${schoolName}</title>\n<link>#pengumuman</link>\n<description>Feed pengumuman terbaru</description>\n<language>id-ID</language>\n<lastBuildDate>${now}</lastBuildDate>`;
//   const body = items
//     .map(
//       (d) => `\n  <item>\n    <title>${xmlEsc(d.title)}</title>\n    <link>#pengumuman-${xmlEsc(d.id)}</link>\n    <guid isPermaLink="false">${xmlEsc(d.id)}</guid>\n    <pubDate>${new Date(d.date).toUTCString()}</pubDate>\n    <category>${xmlEsc(d.tag)}</category>\n    <description>${xmlEsc(d.body)}</description>\n  </item>`
//     )
//     .join("");
//   const footer = `\n</channel>\n</rss>`;
//   return header + body + footer;
// }

// /****************************
//  * INTERFACES
//  ****************************/
// interface Announcement {
//   id: string;
//   title: string;
//   body: string;
//   tag: string;
//   date: string;
//   pinned: boolean;
//   source?: string;
// }

// interface AnnouncementResponse {
//   success: boolean;
//   data: {
//     id: number;
//     title: string;
//     slug: string;
//     excerpt: string | null;
//     kategori: string;
//     tags: string[] | null;
//     isPinned: boolean;
//     publishedAt: string;
//     viewCount: number;
//   }[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// /****************************
//  * COMPONENTS
//  ****************************/
// const Tag = ({ children, theme }: { children: React.ReactNode; theme: any }) => (
//   <span
//     className="px-2 py-1 text-[10px] rounded-full"
//     style={{ background: "rgba(255,255,255,0.10)", color: theme.primaryText }}
//   >
//     {children}
//   </span>
// );

// function AnnouncementCard({ item, theme }: { item: Announcement; theme: any }) {
//   const baru = isNewWithin(item.date, 7);
//   const prefersReducedMotion = useReducedMotion();

//   return (
//     <motion.article
//       layout
//       initial={{ opacity: 0, y: 12 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -8 }}
//       transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
//       className="rounded-2xl p-4 border"
//       style={{ background: theme.surface, borderColor: theme.subtle }}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Tag theme={theme}>{item.tag}</Tag>
//           {baru && (
//             <span
//               className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
//               style={{ background: "rgba(255,255,255,0.15)", color: theme.primaryText }}
//             >
//               BARU
//             </span>
//           )}
//           {item.source === "dinas" && (
//             <span
//               className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
//               style={{ background: theme.accent, color: "#1b1b1b" }}
//             >
//               DINAS
//             </span>
//           )}
//         </div>
//         <span className="text-xs opacity-75" style={{ color: theme.primaryText }}>
//           {fmtDate(item.date)}
//         </span>
//       </div>
//       <h3 className="mt-3 font-semibold line-clamp-2" style={{ color: theme.primaryText }}>
//         {item.title}
//       </h3>
//       <p className="mt-2 text-sm opacity-90 line-clamp-3" style={{ color: theme.primaryText }}>
//         {item.body}
//       </p>
//       <div className="mt-3 flex items-center gap-3">
//         <a
//           href={`/announcement/${item.id}`}
//           className="text-sm underline focus:ring-2 focus:ring-yellow-300"
//           style={{ color: theme.accent }}
//         >
//           Baca selengkapnya
//         </a>
//         {item.pinned && (
//           <span className="text-[10px] opacity-80" style={{ color: theme.primaryText }}>
//             Dipin
//           </span>
//         )}
//       </div>
//     </motion.article>
//   );
// }

// function FilterBar({
//   theme,
//   query,
//   setQuery,
//   activeTags,
//   setActiveTags,
//   availableTags,
// }: {
//   theme: any;
//   query: string;
//   setQuery: (value: string) => void;
//   activeTags: string[];
//   setActiveTags: (value: string[]) => void;
//   availableTags: string[];
// }) {
//   const toggle = (t: string) =>
//     setActiveTags((prev) =>
//       prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
//     );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="flex flex-col md:flex-row md:items-end gap-3"
//     >
//       <div className="flex-1">
//         <label className="text-xs block mb-1" style={{ color: theme.primaryText }}>
//           Cari
//         </label>
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Ketik judul atau isi…"
//           className="w-full px-3 py-2 rounded-xl text-sm border bg-transparent"
//           style={{ borderColor: theme.subtle, color: theme.primaryText }}
//         />
//       </div>
//       <div>
//         <div className="text-xs mb-1" style={{ color: theme.primaryText }}>
//           Kategori
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {availableTags.map((t) => (
//             <button
//               key={t}
//               onClick={() => toggle(t)}
//               className={cx(
//                 "px-3 py-1 rounded-full text-xs border",
//                 activeTags.includes(t) && "outline outline-2"
//               )}
//               style={{
//                 color: theme.primaryText,
//                 background: activeTags.includes(t) ? theme.accent : "transparent",
//                 borderColor: theme.subtle,
//                 outlineColor: theme.accent,
//               }}
//             >
//               {t}
//             </button>
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// /****************************
//  * SECTION: Announcements
//  ****************************/
// function AnnouncementsSection({ theme, schoolName }: { theme: any; schoolName: string }) {
//   const [query, setQuery] = useState("");
//   const [activeTags, setActiveTags] = useState<string[]>([]);
//   const [page, setPage] = useState(1);
//   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [availableTags, setAvailableTags] = useState<string[]>([]);
//   const PER_PAGE = 10;

//   // Fetch announcements
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const params = new URLSearchParams({
//           page: page.toString(),
//           limit: PER_PAGE.toString(),
//         });
//         if (query.trim()) params.append("q", query);
//         if (activeTags.length) params.append("kategori", activeTags.join(","));

//         const response = await fetch(
//           `https://dev.kiraproject.id/public/announcements?${params.toString()}`,
//           {
//             method: "GET",
//             headers: {
//               "X-Host": "sudindikjb2.id",
//               "Cache-Control": "no-store",
//             },
//             cache: "no-store",
//           }
//         );

//         if (!response.ok) throw new Error(`HTTP ${response.status}`);
//         const result: AnnouncementResponse = await response.json();
//         if (!result.success) throw new Error("API response not success");

//         const mapped: Announcement[] = result.data.map((item) => ({
//           id: item.id.toString(),
//           title: item.title,
//           body: item.excerpt || "Tidak ada deskripsi.",
//           tag: item.kategori || "Umum",
//           date: item.publishedAt,
//           pinned: item.isPinned,
//           source: item.tags?.includes("dinas") ? "dinas" : undefined,
//         }));

//         const tags = Array.from(new Set(result.data.map((i) => i.kategori).filter(Boolean)));
//         setAvailableTags(tags.length > 0 ? tags : ["Umum"]);

//         setAnnouncements(mapped);
//         setTotalPages(result.pagination.totalPages || 1);
//       } catch (e: any) {
//         console.warn("Fetch Error:", e);
//         setError("Gagal memuat pengumuman");
//         setAnnouncements([]);
//         setAvailableTags(["Umum"]);
//         setTotalPages(1);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [page, query, activeTags]);

//   // Build feeds
//   const [jsonUrl, setJsonUrl] = useState<string | null>(null);
//   const [rssUrl, setRssUrl] = useState<string | null>(null);
//   useEffect(() => {
//     try {
//       const json = buildJSONFeed(announcements, schoolName);
//       const rss = buildRSS(announcements, schoolName);
//       const jb = new Blob([json], { type: "application/json" });
//       const rb = new Blob([rss], { type: "application/rss+xml" });
//       const ju = URL.createObjectURL(jb);
//       const ru = URL.createObjectURL(rb);
//       setJsonUrl(ju);
//       setRssUrl(ru);
//       return () => {
//         URL.revokeObjectURL(ju);
//         URL.revokeObjectURL(ru);
//       };
//     } catch {}
//   }, [announcements, schoolName]);

//   // Copy to clipboard
//   const [copied, setCopied] = useState({ json: false, rss: false });
//   const handleCopy = async (url: string | null, kind: "json" | "rss") => {
//     if (!url) return;
//     try {
//       await navigator.clipboard.writeText(url);
//       setCopied((prev) => ({ ...prev, [kind]: true }));
//       setTimeout(() => setCopied((prev) => ({ ...prev, [kind]: false })), 1500);
//     } catch {
//       const ta = document.createElement("textarea");
//       ta.value = url;
//       document.body.appendChild(ta);
//       ta.select();
//       document.execCommand("copy");
//       document.body.removeChild(ta);
//     }
//   };

//   return (
//     <section id="pengumuman" className="py-12 md:py-16">
//       <div className="max-w-6xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="lg:flex items-start justify-between gap-4 mb-4"
//         >
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.accent }}>
//               Pengumuman {schoolName}
//             </h2>
//             <p className="text-sm opacity-80" style={{ color: theme.primaryText }}>
//               Informasi terbaru untuk warga sekolah
//             </p>
//           </div>
//           <div className="text-xs text-right lg:mt-0 mt-3" style={{ color: theme.primaryText }}>
//             <div>Total: <strong>{announcements.length}</strong></div>
//             <div className="mt-2 flex items-center gap-2 justify-end flex-wrap">
//               <a
//                 href={jsonUrl || "#"}
//                 download={`pengumuman-${new Date().toISOString().slice(0, 10)}.json`}
//                 className="px-3 py-1 rounded-lg text-xs border"
//                 style={{ background: "rgba(255,255,255,0.10)", color: theme.primaryText, borderColor: theme.subtle }}
//               >
//                 JSON
//               </a>
//               <button
//                 onClick={() => handleCopy(jsonUrl, "json")}
//                 className="px-2 py-1 rounded-lg text-[11px] border"
//                 style={{ background: "rgba(255,255,255,0.06)", color: theme.primaryText, borderColor: theme.subtle }}
//               >
//                 {copied.json ? "Tersalin" : "Salin"}
//               </button>
//               <a
//                 href={rssUrl || "#"}
//                 download={`pengumuman-${new Date().toISOString().slice(0, 10)}.xml`}
//                 className="px-3 py-1 rounded-lg text-xs border"
//                 style={{ background: "rgba(255,255,255,0.10)", color: theme.primaryText, borderColor: theme.subtle }}
//               >
//                 RSS
//               </a>
//               <button
//                 onClick={() => handleCopy(rssUrl, "rss")}
//                 className="px-2 py-1 rounded-lg text-[11px] border"
//                 style={{ background: "rgba(255,255,255,0.06)", color: theme.primaryText, borderColor: theme.subtle }}
//               >
//                 {copied.rss ? "Tersalin" : "Salin"}
//               </button>
//             </div>
//           </div>
//         </motion.div>

//         {error && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="rounded-xl border p-4 mb-4 md:text-center text-left"
//             style={{ borderColor: theme.subtle, background: theme.surface, color: theme.pop }}
//           >
//             {error}
//           </motion.div>
//         )}

//         <FilterBar
//           theme={theme}
//           query={query}
//           setQuery={setQuery}
//           activeTags={activeTags}
//           setActiveTags={setActiveTags}
//           availableTags={availableTags}
//         />

//         {loading ? (
//           <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
//           <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <AnimatePresence mode="popLayout">
//               {announcements.length > 0 ? (
//                 announcements.map((item) => (
//                   <AnnouncementCard key={item.id} item={item} theme={theme} />
//                 ))
//               ) : (
//                 <motion.div
//                   layout
//                   className="col-span-full md:text-center text-left text-sm opacity-80"
//                   style={{ color: theme.primaryText }}
//                 >
//                   Tidak ada pengumuman yang tersedia
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         )}

//         {totalPages > 1 && (
//           <div className="mt-6 flex items-center justify-center gap-2">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
//               <button
//                 key={n}
//                 onClick={() => setPage(n)}
//                 className="h-8 w-8 rounded-full text-sm font-medium"
//                 style={{
//                   background: n === page ? theme.accent : "transparent",
//                   color: n === page ? "#1b1b1b" : theme.primaryText,
//                   border: `1px solid ${theme.subtle}`,
//                 }}
//                 disabled={loading}
//               >
//                 {n}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// /****************************
//  * PAGE
//  ****************************/
// const PengumumanPage = () => {
//   const schoolInfo = SMAN25_CONFIG;
//   const theme = schoolInfo.theme;
//   const schoolName = schoolInfo.fullName;

//   return (
//     <div className="min-h-screen" style={{ background: theme.bg }}>
//       <NavbarComp theme={theme} />
//       <main>
//         <AnnouncementsSection theme={theme} schoolName={schoolName} />
//       </main>
//       <FooterComp theme={theme} />
//     </div>
//   );
// };

// export default PengumumanPage;



import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React, { useEffect, useState } from "react";

/****************************
 * HERO SECTION
 ****************************/
const HeroSection = () => {
  const scrollToPengumuman = () => {
    document.getElementById("pengumuman")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[85vh] flex items-center justify-center z-[1] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/kgp4.jpeg')`,
        }}
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 -mt-6 md:text-center text-left text-white px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Pengumuman SMAN 25 Jakarta
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 text-white/90"
        >
          Informasi terbaru, penting, dan resmi untuk seluruh warga sekolah: siswa, guru, dan orang tua.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={scrollToPengumuman}
          className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition shadow-lg"
        >
          Lihat Pengumuman
        </motion.button>
      </div>
    </section>
  );
};

/****************************
 * UTILS
 ****************************/
const cx = (...cls: (string | boolean | undefined)[]) => cls.filter(Boolean).join(" ");
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
const isNewWithin = (iso: string, days = 7) => {
  const d = new Date(iso).getTime();
  return Date.now() - d <= days * 24 * 60 * 60 * 1000;
};

/****************************
 * FEED BUILDERS (JSON Feed & RSS 2.0)
 ****************************/
const xmlEsc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));

function buildJSONFeed(items: Announcement[], schoolName: string) {
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: `Pengumuman ${schoolName}`,
    home_page_url: "#pengumuman",
    feed_url: "#pengumuman?format=json",
    items: items.map((d) => ({
      id: d.id,
      title: d.title,
      content_text: d.body,
      date_published: new Date(d.date).toISOString(),
      tags: [d.tag],
      authors: [{ name: schoolName }],
      _meta: { source: d.source, pinned: !!d.pinned },
      url: `#pengumuman-${d.id}`,
    })),
  };
  return JSON.stringify(feed, null, 2);
}

function buildRSS(items: Announcement[], schoolName: string) {
  const now = new Date().toUTCString();
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>Pengumuman ${schoolName}</title>\n<link>#pengumuman</link>\n<description>Feed pengumuman terbaru</description>\n<language>id-ID</language>\n<lastBuildDate>${now}</lastBuildDate>`;
  const body = items
    .map(
      (d) => `\n  <item>\n    <title>${xmlEsc(d.title)}</title>\n    <link>#pengumuman-${xmlEsc(d.id)}</link>\n    <guid isPermaLink="false">${xmlEsc(d.id)}</guid>\n    <pubDate>${new Date(d.date).toUTCString()}</pubDate>\n    <category>${xmlEsc(d.tag)}</category>\n    <description>${xmlEsc(d.body)}</description>\n  </item>`
    )
    .join("");
  const footer = `\n</channel>\n</rss>`;
  return header + body + footer;
}

/****************************
 * INTERFACES
 ****************************/
interface Announcement {
  id: string;
  title: string;
  body: string;
  tag: string;
  date: string;
  pinned: boolean;
  source?: string;
}

interface AnnouncementResponse {
  success: boolean;
  data: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    kategori: string;
    tags: string[] | null;
    isPinned: boolean;
    publishedAt: string;
    viewCount: number;
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/****************************
 * COMPONENTS (Dengan tema hitam dominan)
 ****************************/
const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="px-3 py-1 text-[11px] rounded-full bg-black/10 text-black border border-black/20 font-medium">
    {children}
  </span>
);

function AnnouncementCard({ item }: { item: Announcement }) {
  const baru = isNewWithin(item.date, 7);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      className="rounded-2xl p-6 bg-white border border-black/10 shadow-sm hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Tag>{item.tag}</Tag>
          {baru && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black text-white">
              BARU
            </span>
          )}
          {item.source === "dinas" && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-600 text-white">
              DINAS
            </span>
          )}
        </div>
        <span className="text-xs text-black/60">
          {fmtDate(item.date)}
        </span>
      </div>

      <h3 className="text-xl font-bold text-black line-clamp-2 mb-3">
        {item.title}
      </h3>

      <p className="text-sm text-black/80 line-clamp-3 mb-4">
        {item.body}
      </p>

      <div className="flex items-center justify-between">
        <a
          href={`/announcement/${item.id}`}
          className="text-sm font-semibold text-black underline hover:no-underline"
        >
          Baca selengkapnya →
        </a>
        {item.pinned && (
          <span className="text-xs text-black/50">Dipin</span>
        )}
      </div>
    </motion.article>
  );
}

function FilterBar({
  query,
  setQuery,
  activeTags,
  setActiveTags,
  availableTags,
}: {
  query: string;
  setQuery: (value: string) => void;
  activeTags: string[];
  setActiveTags: (value: string[]) => void;
  availableTags: string[];
}) {
  const toggle = (t: string) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-end gap-6 mt-8"
    >
      <div className="flex-1">
        <label className="block text-sm font-medium text-black/80 mb-2">
          Cari Pengumuman
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ketik judul atau isi pengumuman..."
          className="w-full px-5 py-3 rounded-xl border border-black/20 bg-white text-black placeholder-black/40 focus:outline-none focus:border-black transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black/80 mb-2">
          Filter Kategori
        </label>
        <div className="flex flex-wrap gap-3">
          {availableTags.map((t) => (
            <button
              key={t}
              onClick={() => toggle(t)}
              className={cx(
                "px-5 py-2 rounded-full text-sm font-medium border transition",
                activeTags.includes(t)
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black/20 hover:border-black"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/****************************
 * SECTION: Announcements
 ****************************/
function AnnouncementsSection({ schoolName }: { schoolName: string }) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const PER_PAGE = 10;

  // Fetch announcements
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: PER_PAGE.toString(),
        });
        if (query.trim()) params.append("q", query);
        if (activeTags.length) params.append("kategori", activeTags.join(","));

        const response = await fetch(
          `https://dev.kiraproject.id/public/announcements?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "X-Host": "sudindikjb2.id",
              "Cache-Control": "no-store",
            },
            cache: "no-store",
          }
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result: AnnouncementResponse = await response.json();
        if (!result.success) throw new Error("API response not success");

        const mapped: Announcement[] = result.data.map((item) => ({
          id: item.id.toString(),
          title: item.title,
          body: item.excerpt || "Tidak ada deskripsi.",
          tag: item.kategori || "Umum",
          date: item.publishedAt,
          pinned: item.isPinned,
          source: item.tags?.includes("dinas") ? "dinas" : undefined,
        }));

        const tags = Array.from(new Set(result.data.map((i) => i.kategori).filter(Boolean)));
        setAvailableTags(tags.length > 0 ? tags : ["Umum"]);

        setAnnouncements(mapped);
        setTotalPages(result.pagination.totalPages || 1);
      } catch (e: any) {
        console.warn("Fetch Error:", e);
        setError("Gagal memuat pengumuman dari server.");
        setAnnouncements([]);
        setAvailableTags(["Umum"]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, query, activeTags]);

  // Build feeds (JSON & RSS)
  const [jsonUrl, setJsonUrl] = useState<string | null>(null);
  const [rssUrl, setRssUrl] = useState<string | null>(null);
  useEffect(() => {
    try {
      const json = buildJSONFeed(announcements, schoolName);
      const rss = buildRSS(announcements, schoolName);
      const jb = new Blob([json], { type: "application/json" });
      const rb = new Blob([rss], { type: "application/rss+xml" });
      const ju = URL.createObjectURL(jb);
      const ru = URL.createObjectURL(rb);
      setJsonUrl(ju);
      setRssUrl(ru);
      return () => {
        URL.revokeObjectURL(ju);
        URL.revokeObjectURL(ru);
      };
    } catch {}
  }, [announcements, schoolName]);

  const [copied, setCopied] = useState({ json: false, rss: false });
  const handleCopy = async (url: string | null, kind: "json" | "rss") => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied((prev) => ({ ...prev, [kind]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [kind]: false })), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section id="pengumuman" className="py-16 md:py-24 bg-gray-50 relative z-[1]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:text-center text-left mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
            Pengumuman Terbaru
          </h2>
          <p className="text-lg text-black/70 max-w-2xl mx-auto">
            Tetap update dengan informasi resmi dari {schoolName}
          </p>
        </motion.div>

        {/* Feed Download Links */}
        <div className="md:text-center text-left mb-8">
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur rounded-xl px-6 py-3 border border-black/10">
            <a
              href={jsonUrl || "#"}
              download={`pengumuman-${new Date().toISOString().slice(0, 10)}.json`}
              className="text-sm font-medium text-black hover:underline"
            >
              Download JSON
            </a>
            <button onClick={() => handleCopy(jsonUrl, "json")} className="text-xs text-black/60">
              {copied.json ? "Tersalin!" : "Salin Link"}
            </button>
            <span className="text-black/30">|</span>
            <a
              href={rssUrl || "#"}
              download={`pengumuman-${new Date().toISOString().slice(0, 10)}.xml`}
              className="md:flex hidden text-sm font-medium text-black hover:underline"
            >
              Download RSS
            </a>
            <button onClick={() => handleCopy(rssUrl, "rss")} className="text-xs text-black/60">
              {copied.rss ? "Tersalin!" : "Salin Link"}
            </button>
          </div>
        </div>

        {error && (
          <div className="md:text-center text-left py-6 text-red-600 font-medium">
            {error}
          </div>
        )}

        <FilterBar
          query={query}
          setQuery={setQuery}
          activeTags={activeTags}
          setActiveTags={setActiveTags}
          availableTags={availableTags}
        />

        {loading ? (
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl p-6 bg-white border border-black/10 animate-pulse">
                <div className="h-5 bg-black/10 rounded w-32 mb-4" />
                <div className="h-8 bg-black/20 rounded w-full mb-3" />
                <div className="h-4 bg-black/10 rounded w-full" />
                <div className="h-4 bg-black/10 rounded w-4/5 mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {announcements.length > 0 ? (
                announcements.map((item) => (
                  <AnnouncementCard key={item.id} item={item} />
                ))
              ) : (
                <div className="col-span-full md:text-center text-left py-16 text-black/50 text-lg">
                  Tidak ada pengumuman yang sesuai dengan pencarian atau filter saat ini.
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                disabled={loading}
                className={cx(
                  "w-12 h-12 rounded-full font-semibold text-sm transition",
                  n === page
                    ? "bg-black text-white"
                    : "bg-white text-black border border-black/20 hover:border-black"
                )}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/****************************
 * PAGE UTAMA
 ****************************/
const PengumumanPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const schoolName = schoolInfo.fullName;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp />
      <HeroSection />
      <main className="flex-1 -mt-12 relative z-[1]">
        <AnnouncementsSection schoolName={schoolName} />
      </main>
      <FooterComp theme={schoolInfo.theme} />
    </div>
  );
};

export default PengumumanPage;