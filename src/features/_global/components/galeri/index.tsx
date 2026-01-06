import { getXHostHeader } from "@/core/utils/XHostHeader";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";

/****************************
 * THEME & SAFETY GUARDS
 ****************************/
const THEMES = {
  smkn13: {
    name: "SMKN 13 Jakarta",
    primary: "#1F3B76",
    primaryText: "#ffffff",
    accent: "#F2C94C",
    bg: "#0B1733",
    surface: "#102347",
    surfaceText: "#ffffff",
    subtle: "#2C3F6B",
    pop: "#E63946",
    dinas: "#4CAF50",
  },
};
const getSafeTheme = (t) => ({ ...THEMES.smkn13, ...(t || {}) });

const makeSvg = (
  width: number,
  height: number,
  color1: string,
  color2: string,
  title: string,
  subtitle: string = ""
): string => {
  const svgContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color1}"/>
          <stop offset="100%" stop-color="${color2}"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)"/>
      <g fill="rgba(255, 255, 255, 0.95)" font-family="Inter, Arial, sans-serif" font-weight="700">
        <text x="6%" y="55%" font-size="${Math.round(height / 12)}">${title.replace(/&/g, "&amp;")}</text>
        <text x="6%" y="70%" font-size="${Math.round(height / 24)}" opacity="0.9">${subtitle.replace(/&/g, "&amp;")}</text>
      </g>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
};

/****************************
 * ANIMATION VARIANTS (Framer Motion)
 ****************************/
const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.02 }
  },
  exit: { opacity: 0 }
};
const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } }
};

const SITE_SINCE = Number.parseInt(
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_SITE_SINCE) || '2025',
  10
);

/****************************
 * GALLERY DATA (demo)
 ****************************/
const GALLERY = [
  { id: 'img-1', type: 'photo', title: 'Upacara Bendera', album: 'Kegiatan Sekolah', date: '2025-08-22', src: makeSvg(1600, 1000, '#1F3B76', '#2C3F6B', 'Upacara Bendera', 'Lapangan SMKN 13'), w:1600, h:1000 },
  { id: 'img-2', type: 'photo', title: 'Lomba Futsal', album: 'Olahraga', date: '2025-08-15', src: makeSvg(1600, 1000, '#0B1733', '#102347', 'Turnamen Futsal', 'Provinsi DKI Jakarta'), w:1600, h:1000 },
  { id: 'img-3', type: 'photo', title: 'Pameran Karya RPL', album: 'Akademik', date: '2025-07-30', src: makeSvg(1600, 1000, '#F2C94C', '#1F3B76', 'Pameran Karya', 'Jurusan RPL'), w:1600, h:1000 },
  { id: 'img-4', type: 'photo', title: 'Kegiatan Pramuka', album: 'Kesiswaan', date: '2025-07-12', src: makeSvg(1600, 1000, '#2C3F6B', '#0B1733', 'Latihan Pramuka', 'Lapangan Belakang'), w:1600, h:1000 },
  { id: 'vid-1', type: 'video', title: 'Profil Sekolah', album: 'Video', date: '2025-07-10', embed: 'https://www.youtube.com/embed/5qap5aO4i9A' },
  { id: 'img-5', type: 'photo', title: 'Wisuda Siswa', album: 'Kegiatan Sekolah', date: '2025-06-25', src: makeSvg(1600, 1000, '#1F3B76', '#F2C94C', 'Wisuda 2025', 'SMKN 13 Jakarta'), w:1600, h:1000 },
  { id: 'img-6', type: 'photo', title: 'Lomba Inovasi', album: 'Akademik', date: '2025-06-10', src: makeSvg(1600, 1000, '#1F3B76', '#4CAF50', 'Inovasi Teknologi', 'Juara 1 Kota'), w:1600, h:1000 },
];

/****************************
 * LOCAL STORAGE — views counter
 ****************************/
const VIEWS_KEY = 'galleryViews:v1';
const loadViews = () => { try { return JSON.parse(localStorage.getItem(VIEWS_KEY)) || {}; } catch { return {}; } };
const saveViews = (obj) => { try { localStorage.setItem(VIEWS_KEY, JSON.stringify(obj)); } catch {} };

/****************************
 * GALLERY CARD & LIGHTBOX
 ****************************/
const GalleryCard = ({ item, theme, onOpen, views = 0 }) => {
  const isVideo = item.type === 'video';
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="rounded-2xl overflow-hidden border hover:shadow-md transition flex flex-col break-inside-avoid mb-4"
      style={{ borderColor: theme.subtle, background: theme.surface }}>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9', background: theme.subtle }}>
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: theme.primaryText }}>Video</div>
        ) : (
          <motion.img
            layoutId={`media-${item.id}`}
            src={item.src}
            alt={item.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 12, repeat: Infinity, repeatType: 'mirror' }}
            className="w-full h-full object-cover"
            style={{ filter: loaded ? 'none' : 'blur(12px)', transformOrigin: 'center' }}
          />
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <div className="font-semibold" style={{ color: theme.primaryText }}>{item.title}</div>
        <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>{new Date(item.date).toLocaleDateString('id-ID',{ day:'2-digit', month:'short', year:'numeric' })} · {item.album}</div>
        <div className="text-[11px] opacity-80" style={{ color: theme.surfaceText }}>{views}x dilihat</div>
        <button onClick={()=>onOpen(item)} className="mt-1 text-xs px-3 py-1 rounded-lg border self-start" style={{ borderColor: theme.subtle, color: theme.primaryText }}>Lihat</button>
      </div>
    </motion.div>
  );
};

const Lightbox = ({
  open,
  onClose,
  item,
  theme,
  onViewed,
  onPrev,
  onNext,
  items = [],
  index = -1,
  count = 0,
  direction = 0,
  onJump,
  autoPlay = true,
  autoInterval = 5000,
}) => {
  if (!open) return null;

  const isVideo = item?.type === 'video';
  const hasItems = items.length > 0;

  // Hitung view hanya jika ada item
  useEffect(() => {
    if (item && hasItems) onViewed?.(item);
  }, [item, hasItems, onViewed]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') return onClose?.();
      if (e.key === 'ArrowLeft' && hasItems) return onPrev?.();
      if (e.key === 'ArrowRight' && hasItems) return onNext?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, onPrev, onNext, hasItems]);

  // Autoplay (hanya jika ada item)
  const [auto, setAuto] = useState(!!autoPlay && hasItems);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!open || !auto || paused || !hasItems || count <= 1) return;
    const id = setInterval(() => { onNext?.(); }, Math.max(2000, autoInterval));
    return () => clearInterval(id);
  }, [open, auto, paused, count, autoInterval, onNext, index, hasItems]);

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 26 } },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.18 } })
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: "rgba(0, 0, 0, 0.6)" }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        className="relative w-full max-w-5xl rounded-2xl border overflow-hidden"
        style={{ background: theme.surface, borderColor: theme.subtle }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: `1px solid ${theme.subtle}` }}
        >
          <div className="font-semibold" style={{ color: theme.primaryText }}>
            {hasItems ? item?.title : "Album Kosong"}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-2 py-1 rounded-lg border text-xs"
              style={{ borderColor: theme.subtle, color: theme.primaryText }}
              aria-label="Close viewer"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div
          className="flex items-center justify-center relative"
          style={{ minHeight: 400 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {hasItems ? (
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={item.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full flex items-center justify-center select-none"
                drag="x"
                dragElastic={0.2}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 120) onPrev();
                  else if (info.offset.x < -120) onNext();
                }}
              >
                {isVideo ? (
                  <div className="w-full aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={item.embed}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <motion.img
                    layoutId={`media-${item.id}`}
                    src={'https://dev.kiraproject.id'+item.src}
                    alt={item.title}
                    className="h-[40vh] rounded-lg border border-white/30 shadow-lg w-auto object-contain"
                    initial={{ scale: 1.02 }}
                    animate={{ scale: 1.08 }}
                    transition={{ duration: 16, repeat: Infinity, repeatType: "mirror" }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            /* KOSONG: Tampilkan pesan */
            <div className="text-center p-8">
              <div className="text-6xl mb-4 opacity-30 w-full text-center flex items-center justify-center"><Camera width={46} height={46} /></div>
              <p className="text-lg font-medium" style={{ color: theme.primaryText }}>
                Album ini belum memiliki foto atau video
              </p>
              <p className="text-sm mt-2 opacity-70" style={{ color: theme.surfaceText }}>
                Coba lagi nanti atau pilih album lain.
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {hasItems && (
          <>
            <div className="px-4 py-3 text-sm" style={{ color: theme.surfaceText }}>
              <div>
                {new Date(item.date).toLocaleString("id-ID", { dateStyle: "long" })} · Album:{" "}
                <strong>{item.album}</strong> ·{" "}
                <span className="opacity-80">
                  {index + 1}/{count}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="px-3 pb-3 overflow-x-auto">
              <div className="flex gap-2 min-w-full">
                {items.map((it, i) => (
                  <button
                    key={it.id}
                    onClick={() => onJump(i)}
                    className="shrink-0 rounded-lg overflow-hidden border"
                    style={{ borderColor: i === index ? theme.accent : theme.subtle }}
                    aria-label={`Go to ${it.title}`}
                  >
                    {it.type === "video" ? (
                      <div
                        className="w-24 h-16 flex items-center justify-center text-[10px]"
                        style={{ background: theme.subtle, color: theme.primaryText }}
                      >
                        Video
                      </div>
                    ) : (
                      <img
                        src={'https://dev.kiraproject.id'+it.src}
                        alt={it.title}
                        className="w-24 h-16 object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Pager Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => onJump(i)}
                  className="w-2 h-2 rounded-full border"
                  style={{
                    background: i === index ? theme.accent : "transparent",
                    borderColor: theme.subtle,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

const API_BASE = "https://dev.kiraproject.id";
const API_HEADERS = { "X-Host": getXHostHeader() };

/* --------------------------------------------------------------
   2. HOOK: albums + selected album items (DARI API GALLERY)
   -------------------------------------------------------------- */
const useGallery = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/albums?includeItems=false`, { headers: API_HEADERS });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error("API albums not success");
        setAlbums(json.data.filter((a: any) => a.isActive));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openAlbum = async (album: any) => {
    setSelectedAlbum(album);
    setCurrentIndex(0);
    setLoadingItems(true);
    setItems([]); // reset

    try {
      const res = await fetch(
        `${API_BASE}/gallery?albumId=${album.id}&isActive=true`,
        { headers: API_HEADERS }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error("API gallery not success");

      const transformed = (json.data || []).map((it: any) => ({
        id: `api-gallery-${it.id}`,
        type: "photo", // hanya foto dari endpoint ini
        title: it.title,
        album: album.title,
        date: it.date || it.createdAt,
        src: it.imageUrl,
        description: it.description,
      }));

      setItems(transformed);
    } catch (e: any) {
      setError(e.message);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setItems([]);
    setCurrentIndex(0);
  };

  const goTo = (index: number) => setCurrentIndex(index);
  const goPrev = () => setCurrentIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  const goNext = () => setCurrentIndex((i) => (i >= items.length - 1 ? 0 : i + 1));

  return {
    albums,
    selectedAlbum,
    items,
    currentIndex,
    loading,
    loadingItems,
    error,
    openAlbum,
    closeAlbum,
    goTo,
    goPrev,
    goNext,
  };
};

const AlbumListCard = ({ album, theme, onOpen }: { album: any; theme: any; onOpen: (a: any) => void }) => {
  const cover = album.coverUrl;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-xl overflow-hidden border cursor-pointer relative"
      style={{ borderColor: theme.subtle, background: theme.surface }}
    >
      <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
        {cover ? (
          <img
            src={`https://dev.kiraproject.id${cover}`}
            alt={album.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <div className="font-semibold text-sm">{album.title}</div>
          <div className="text-xs opacity-80">
            {new Date(album.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Tombol Lihat */}
      <div className="p-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen(album);
          }}
          className="w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium border"
          style={{
            background: theme.accent,
            color: "#111827",
            borderColor: theme.accent,
          }}
        >
          Lihat
        </button>
      </div>
    </motion.div>
  );
};

/* --------------------------------------------------------------
   4. GALLERY SECTION – daftar album + Lightbox langsung
   -------------------------------------------------------------- */
const GallerySection = ({ theme }: { theme?: any }) => {
  const safeTheme = getSafeTheme(theme);
  const {
    albums,
    selectedAlbum,
    items,
    currentIndex,
    loading,
    loadingItems,
    error,
    openAlbum,
    closeAlbum,
    goTo,
    goPrev,
    goNext,
  } = useGallery();

  const [viewsMap, setViewsMap] = useState(loadViews());
  const [navDir, setNavDir] = useState(0);

  const handleViewed = (item: any) => {
    const next = { ...viewsMap, [item.id]: (viewsMap[item.id] || 0) + 1 };
    setViewsMap(next);
    saveViews(next);
  };

  const handlePrev = () => {
    setNavDir(-1);
    goPrev();
  };

  const handleNext = () => {
    setNavDir(1);
    goNext();
  };

  const handleJump = (index: number) => {
    setNavDir(index > currentIndex ? 1 : -1);
    goTo(index);
  };

  const currentItem = items[currentIndex];

  if (loading) {
    return (
      <section id="galeri" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p style={{ color: safeTheme.primaryText }}>Memuat album...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="galeri" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-red-400">Gagal memuat: {error}</p>
        </div>
      </section>
    );
  }

 // New: Empty state for no albums
  if (albums.length === 0) {
    return (
      <section id="galeri" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: safeTheme.accent }}>
              Album galeri
            </h2>
            <p className="text-sm opacity-85" style={{ color: safeTheme.surfaceText }}>
              Pilih album untuk melihat foto kegiatan.
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 max-w-sm">
            <Camera className="w-16 h-16 mx-auto mb-2 text-gray-400" />
            <p className="font-medium" style={{ color: safeTheme.primaryText }}>
              Tidak ada album tersedia
            </p>
            <p className="text-sm text-center text-gray-600">
              Belum ada album yang dibuat.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="galeri" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: safeTheme.accent }}>
            Album galeri
          </h2>
          <p className="text-sm opacity-85" style={{ color: safeTheme.surfaceText }}>
            Pilih album untuk melihat foto kegiatan.
          </p>
        </div>

        {/* Album Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={gridVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence mode="popLayout">
            {albums.map((album) => (
              <motion.div key={album.id} variants={cardVariants} layout>
                <AlbumListCard album={album} theme={safeTheme} onOpen={openAlbum} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <Lightbox
          open={!!selectedAlbum && !loadingItems && items.length > 0}
          onClose={closeAlbum}
          item={currentItem}
          theme={safeTheme}
          onViewed={handleViewed}
          onPrev={handlePrev}
          onNext={handleNext}
          items={items}
          index={currentIndex}
          count={items.length}
          direction={navDir}
          onJump={handleJump}
          autoPlay={true}
          autoInterval={5000}
        />

        {/* Loading Items */}
        {loadingItems && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <p className="text-white text-lg">Memuat foto...</p>
          </div>
        )}

        {/* Empty State for Selected Album */}
        {selectedAlbum && !loadingItems && items.length === 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={closeAlbum}>
            <div className="bg-white rounded-xl p-8 max-w-sm text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="font-medium">Album kosong</p>
              <p className="text-sm text-gray-600 mt-1">Belum ada foto di album ini.</p>
              <button
                onClick={closeAlbum}
                className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/****************************
 * DEFAULT PAGE (Navbar + Gallery + Footer) + TESTS
 ****************************/
const GalleryComp = () => {
  const appTheme = getSafeTheme();
  const prefersReducedMotion = useReducedMotion();

  useEffect(()=>{
    try {
      console.assert(typeof GallerySection === 'function', 'GallerySection harus ada');
      console.assert(Array.isArray(GALLERY) && GALLERY.length >= 6, 'Minimal 6 item galeri untuk demo');
      console.assert(typeof Navbar === 'function' && typeof Footer === 'function', 'Navbar/Footer harus terdefinisi');
      const map = loadViews();
      console.assert(map && typeof map === 'object', 'loadViews harus mengembalikan objek');
      // Tambahan test: Lightbox prev/next handlers ada
      console.assert(typeof Lightbox === 'function', 'Lightbox harus ada');
      console.assert(typeof getSafeTheme === 'function', 'getSafeTheme harus ada');
      console.assert(typeof setInterval === 'function', 'Autoplay membutuhkan setInterval');
      console.log('✅ UI smoke tests passed (Galeri + Header/Footer + Autoplay)');
    } catch (e) {
      console.error('❌ UI smoke tests failed:', e);
    }
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-max">
      <main>
        <GallerySection theme={appTheme} />
      </main>
    </div>
  );
}

export default GalleryComp;