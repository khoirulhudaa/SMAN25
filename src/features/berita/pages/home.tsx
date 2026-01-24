import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/****************************
 * HERO SECTION
 ****************************/
const HeroSection = () => {
  const scrollToBerita = () => {
    document.getElementById("berita")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[91vh] flex items-center justify-center overflow-hidden z-[1]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 -mt-6 md:text-center text-left text-white px-6 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Berita
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
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

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
const saveViews = (obj: any) => {
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
const saveSeen = (obj: any) => {
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(obj));
  } catch {}
};

/****************************
 * COMPONENTS
 ****************************/
const CardBadge = ({ children, theme, variant = "default" }: { children: React.ReactNode; theme: any; variant?: string }) => {
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

const Eye = ({ className }: { className?: string }) => <span className={className}>👁️</span>;

const CardFrame = ({ theme, children, accentColor }: { theme: any; children: React.ReactNode; accentColor?: string }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    className="rounded-2xl h-full border p-4 flex gap-3 hover:shadow-md transition cursor-pointer"
    style={{ borderColor: theme.subtle, background: theme.surface }}
  >
    <div className="w-1 rounded-full" style={{ background: accentColor || theme.accent }} />
    <div className="flex-1 min-w-0">{children}</div>
  </motion.div>
);

/****************************
 * SECTION: Berita
 ****************************/
function BeritaSection({ theme, schoolName }: { theme: any; schoolName: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Semua");
  const [src, setSrc] = useState("Semua");
  const [selected, setSelected] = useState<any>(null);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Fetch dari API backend terbaru
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const schoolId = SMAN25_CONFIG.schoolId || 88; // sesuaikan dengan config kamu

        const response = await fetch(
          `https://be-school.kiraproject.id/berita?schoolId=${schoolId}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(`Gagal memuat berita (HTTP ${response.status})`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Format response dari server tidak sesuai");
        }

        // Mapping ke format client
        const mapped = result.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: slugify(item.title),
          desc: item.content || "Tidak ada deskripsi.",
          img: item.imageUrl || "/default-berita.png",
          imageUrl: item.imageUrl,
          category: item.category || "Umum",
          source: item.source || "Sekolah",
          author: "Humas",
          date: fmtDate(item.publishDate),
          views: 0,
        }));

        setNewsData(mapped);
      } catch (err: any) {
        console.error("Fetch berita error:", err);
        setError("Gagal memuat berita. Silakan coba lagi nanti.");
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
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

  const categories = useMemo(() => ["Semua", ...Array.from(new Set(newsData.map((n: any) => n.category)))], [newsData]);
  const sources = useMemo(() => ["Semua", ...Array.from(new Set(newsData.map((n: any) => n.source)))], [newsData]);

  const filtered = useMemo(() => {
    const nq = q.trim().toLowerCase();
    return newsData.filter((n: any) => {
      const okQ = !nq || n.title.toLowerCase().includes(nq) || n.desc.toLowerCase().includes(nq) || n.author.toLowerCase().includes(nq);
      const okC = cat === "Semua" || n.category === cat;
      const okS = src === "Semua" || n.source === src;
      return okQ && okC && okS;
    });
  }, [q, cat, src, newsData]);

  const openDetail = (item: any) => setSelected(item);

  return (
    <section id="berita" className="py-12 md:py-16 md:px-0 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
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
          <div className="text-xs text-right flex gap-4 lg:mt-0 mt-3 text-black/70">
            <div>Total: <strong>{newsData.length}</strong></div>
            <div>Tersaring: <strong>{filtered.length}</strong></div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border p-4 mb-4 md:text-center text-left bg-white"
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
            className="flex-1 px-4 py-3 rounded-xl text-sm border border-black/20 bg-white text-black focus:border-black transition"
          />
          <div className="flex gap-3">
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="px-4 py-3 rounded-xl text-sm border text-black border-black/20 bg-white"
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
              className="px-4 py-3 rounded-xl text-sm border text-black border-black/20 bg-white"
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
          <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl p-6 bg-white border border-black/10 animate-pulse min-h-[360px]">
                <div className="h-4 bg-black/10 rounded w-1/3 mb-3" />
                <div className="h-7 bg-black/20 rounded w-full mb-4" />
                <div className="h-4 bg-black/10 rounded w-full" />
                <div className="h-4 bg-black/10 rounded w-4/5 mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                filtered.map((n: any) => {
                  const slug = slugify(n.title);
                  return (
                    <div
                      key={n.id}
                      data-slug={slug}
                      className="min-h-[360px] overflow-hidden"
                      ref={(el) => (cardRefs.current[slug] = el)}
                    >
                      <CardFrame theme={theme} accentColor={n.source === "Dinas" ? "#dc2626" : theme.accent}>
                        <div className="flex flex-col h-full">
                          {/* Gambar fixed height */}
                          <div className="w-full h-[150px] overflow-hidden flex-shrink-0 rounded-lg">
                            <img
                              src={n.imageUrl || "/default-berita.png"}
                              alt={n.title}
                              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                              loading="lazy"
                            />
                          </div>

                          {/* Info tanggal & views */}
                          <div className="text-xs text-black/60 flex items-center justify-between gap-3 mt-3 mb-2">
                            <span>{n.date} · {n.author}</span>
                          </div>

                          {/* Judul */}
                          <h3 className="font-bold text-lg text-black leading-snug line-clamp-2 mb-2">
                            {n.title}
                          </h3>

                          {/* Deskripsi */}
                          <p className="text-sm text-black/70 line-clamp-3 overflow-hidden flex-1 mb-3">
                            {n.desc}
                          </p>

                          {/* Badge & tombol */}
                          <div className="flex items-center gap-3 flex-wrap mt-auto">
                            <CardBadge theme={theme}>{n.category}</CardBadge>
                            {n.source === "Dinas" && <CardBadge theme={theme} variant="dinas">Dinas</CardBadge>}
                            <button
                              className="ml-auto px-4 py-2 rounded-lg border border-black/50 text-black text-sm font-medium hover:bg-black/90 hover:text-white transition"
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
                  className="col-span-full md:text-center text-left py-16 text-black/50 text-lg"
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
              className="fixed inset-0 z-[999999999999999999999999999] flex items-center justify-center p-4"
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
                  <h3 className="text-lg md:text-xl font-bold text-black">
                    {selected.title}
                  </h3>
                  <button
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 rounded-lg border border-black/50 hover:bg-black/90 text-black hover:text-white transition"
                  >
                    Tutup
                  </button>
                </div>

                {selected.imageUrl && (
                  <div className="w-full h-[240px] mb-6 overflow-hidden rounded-xl">
                    <img
                      src={selected.imageUrl}
                      alt={selected.title}
                      className="w-full h-full object-cover shadow-md"
                    />
                  </div>
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
      <HeroSection />
      <main className="flex-1 -mt-20 relative z-[1]">
        <BeritaSection theme={theme} schoolName={schoolName} />
      </main>
      <FooterComp theme={theme} />
    </div>
  );
};

export default BeritaPage;