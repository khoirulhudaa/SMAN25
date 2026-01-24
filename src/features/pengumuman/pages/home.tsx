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
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/kgp4.jpeg')`,
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 -mt-6 md:text-center text-left text-white px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Pengumuman
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

function buildJSONFeed(items: any[], schoolName: string) {
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
      tags: [d.category || "Umum"],
      authors: [{ name: schoolName }],
      _meta: { source: d.source, pinned: !!d.pinned },
      url: `#pengumuman-${d.id}`,
    })),
  };
  return JSON.stringify(feed, null, 2);
}

function buildRSS(items: any[], schoolName: string) {
  const now = new Date().toUTCString();
  const header = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>Pengumuman ${schoolName}</title>\n<link>#pengumuman</link>\n<description>Feed pengumuman terbaru</description>\n<language>id-ID</language>\n<lastBuildDate>${now}</lastBuildDate>`;
  const body = items
    .map(
      (d) => `\n  <item>\n    <title>${xmlEsc(d.title)}</title>\n    <link>#pengumuman-${xmlEsc(d.id)}</link>\n    <guid isPermaLink="false">${xmlEsc(d.id)}</guid>\n    <pubDate>${new Date(d.date).toUTCString()}</pubDate>\n    <category>${xmlEsc(d.category || "Umum")}</category>\n    <description>${xmlEsc(d.body)}</description>\n  </item>`
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
  date: string;
  pinned: boolean;
  source?: string;
  category?: string;
  imageUrl?: string;
}

interface AnnouncementApiResponse {
  success: boolean;
  data: {
    id: number;
    title: string;
    content: string;
    imageUrl?: string | null;
    publishDate: string;
    schoolId: number;
    isActive: boolean;
    category?: string;
    source?: string;
  }[];
}

/****************************
 * COMPONENTS
 ****************************/
const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="px-3 py-1 text-[11px] rounded-full bg-black/10 text-black border border-black/20 font-medium">
    {children}
  </span>
);

function AnnouncementCard({ item, onDetail }: { item: Announcement; onDetail: (item: Announcement) => void }) {
  const baru = isNewWithin(item.date, 7);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
      className="rounded-2xl p-6 bg-white border border-black/10 shadow-sm hover:shadow-lg transition cursor-pointer min-h-[360px] flex flex-col"
    >
      {/* Gambar fixed height */}
      <div className="w-full h-[150px] overflow-hidden rounded-lg mb-4 flex-shrink-0">
        <img
          src={item.imageUrl || "/default-pengumuman.png"}
          alt={item.title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Info tanggal */}
      <div className="text-xs text-black/60 mb-2">
        {fmtDate(item.date)}
      </div>

      {/* Judul */}
      <h3 className="text-xl font-bold text-black leading-snug line-clamp-2 mb-2">
        {item.title}
      </h3>

      {/* Badge category & source */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Tag>{item.category || "Umum"}</Tag>
        {item.source && (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-600 text-white">
            {item.source}
          </span>
        )}
        {baru && (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black text-white">
            BARU
          </span>
        )}
      </div>

      {/* Deskripsi */}
      <p className="text-sm text-black/80 line-clamp-3 flex-1 mb-4">
        {item.body}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <button
          onClick={() => onDetail(item)}
          className="text-sm font-semibold text-black underline hover:no-underline"
        >
          Baca selengkapnya →
        </button>
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
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  selectedSource,
  setSelectedSource,
  availableSources,
}: {
  query: string;
  setQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  availableCategories: string[];
  selectedSource: string;
  setSelectedSource: (value: string) => void;
  availableSources: string[];
}) {
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

      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-black/80 mb-2">
            Kategori
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm border text-black border-black/20 bg-white w-40"
          >
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black/80 mb-2">
            Sumber
          </label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm border text-black border-black/20 bg-white w-40"
          >
            {availableSources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
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
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedSource, setSelectedSource] = useState("Semua");
  const [page, setPage] = useState(1);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null);
  const PER_PAGE = 10;

  // Fetch dari API backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const schoolId = SMAN25_CONFIG.schoolId || 88;

        const response = await fetch(
          `https://be-school.kiraproject.id/pengumuman?schoolId=${schoolId}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Gagal memuat data (HTTP ${response.status})`);
        }

        const result: AnnouncementApiResponse = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Format response dari server tidak sesuai");
        }

        const mapped: Announcement[] = result.data.map((item) => ({
          id: item.id.toString(),
          title: item.title,
          body: item.content || "Tidak ada isi pengumuman.",
          date: item.publishDate,
          pinned: false,
          source: item.source || "Sekolah",
          category: item.category || "Umum",
          imageUrl: item.imageUrl || undefined,
        }));

        let filtered = mapped;

        if (query.trim()) {
          const q = query.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.title.toLowerCase().includes(q) ||
              item.body.toLowerCase().includes(q)
          );
        }

        if (selectedCategory !== "Semua") {
          filtered = filtered.filter((item) => item.category === selectedCategory);
        }

        if (selectedSource !== "Semua") {
          filtered = filtered.filter((item) => item.source === selectedSource);
        }

        const total = filtered.length;
        const start = (page - 1) * PER_PAGE;
        const paginated = filtered.slice(start, start + PER_PAGE);

        setAnnouncements(paginated);
        setTotalPages(Math.ceil(total / PER_PAGE) || 1);

        const cats = Array.from(new Set(mapped.map((i) => i.category || "Umum")));
        const srcs = Array.from(new Set(mapped.map((i) => i.source || "Sekolah")));
        setAvailableCategories(["Semua", ...cats]);
        setAvailableSources(["Semua", ...srcs]);
      } catch (e: any) {
        console.error("Fetch pengumuman error:", e);
        setError("Gagal memuat pengumuman. Silakan coba lagi nanti.");
        setAnnouncements([]);
        setTotalPages(1);
        setAvailableCategories(["Semua"]);
        setAvailableSources(["Semua"]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, query, selectedCategory, selectedSource]);

  // Build feeds
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
    } catch {}
  };

  return (
    <section id="pengumuman" className="py-16 md:py-16 md:px-0 px-4 bg-gray-50 relative z-[1]">
      <div className="max-w-7xl mx-auto">
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
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCategories={availableCategories}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          availableSources={availableSources}
        />

        {loading ? (
          <div className="mt-10 grid md:grid-cols-3 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl p-6 bg-white border border-black/10 animate-pulse min-h-[360px]">
                <div className="h-5 bg-black/10 rounded w-32 mb-4" />
                <div className="h-8 bg-black/20 rounded w-full mb-3" />
                <div className="h-4 bg-black/10 rounded w-full" />
                <div className="h-4 bg-black/10 rounded w-4/5 mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid md:grid-cols-3 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {announcements.length > 0 ? (
                announcements.map((item) => (
                  <AnnouncementCard key={item.id} item={item} onDetail={setSelectedItem} />
                ))
              ) : (
                <div className="col-span-full md:text-center text-left py-16 text-black/50 text-lg">
                  Tidak ada pengumuman yang sesuai dengan pencarian atau filter saat ini.
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

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

      {/* Modal Detail */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
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
                <h3 className="text-lg md:text-xl font-bold text-black">
                  {selectedItem.title}
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-lg border border-black/50 hover:bg-black/90 text-black hover:text-white transition"
                >
                  Tutup
                </button>
              </div>

              {selectedItem.imageUrl && (
                <div className="w-full h-[240px] mb-6 overflow-hidden rounded-xl">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover shadow-md"
                  />
                </div>
              )}

              <div className="text-sm text-black/60 mb-6">
                {fmtDate(selectedItem.date)} · {selectedItem.category || "Umum"}
                {selectedItem.source && ` · ${selectedItem.source}`}
              </div>

              <p className="text-base leading-relaxed text-black/80 whitespace-pre-wrap">
                {selectedItem.body}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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