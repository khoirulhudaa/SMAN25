import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Images,
  MapPin,
  Users,
  X
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// === HERO SECTION (tetap sama) ===
const HeroSection = () => {
  const scrollToContent = () => {
    document.querySelector("main")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/pramuka.jpg')`,
          backgroundPosition: "center 35%",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      <div className="relative z-10 md:text-center text-left text-white px-6 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Pramuka
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Galeri kegiatan, latihan, perkemahan, dan dokumentasi Pramuka SMAN 25 Jakarta
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
          Lihat Kegiatan
        </motion.button>
      </div>
    </section>
  );
};

// === TYPES (disesuaikan dengan backend) ===
export type Jenis = "Latihan" | "Perkemahan" | "Lomba" | "Bakti" | "Rapat" | "Kursus" | "Lainnya";
export type DocItem = {
  name: string;
  url: string;
  type?: 'image/png' | 'image/jpeg' | 'video/mp4';
};
export type Kegiatan = {
  id: string;
  judul: string;
  jenis: Jenis;
  tanggal: string;
  lokasi: string;
  penanggungJawab: string;
  peserta: number;
  deskripsi?: string;
  dokumentasi: DocItem[];
};

// === DEMO DATA (tetap untuk fallback) ===
function todayPlus(d: number) {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toISOString().slice(0, 10);
}
const DEMO: Kegiatan[] = [
  {
    id: "k1",
    judul: "Latihan Rutin Mingguan",
    jenis: "Latihan",
    tanggal: todayPlus(-5),
    lokasi: "Lapangan Sekolah",
    penanggungJawab: "Pembina A",
    peserta: 45,
    deskripsi: "Latihan baris-berbaris dan yel-yel",
    dokumentasi: [
      { name: "pembukaan.jpg", url: "https://placehold.co/1280x720/png?text=Pembukaan+Pramuka", type: "image/png" },
      { name: "senam.jpg", url: "https://placehold.co/1280x720/png?text=Senam+Pagi", type: "image/png" },
    ]
  }
];

// === UTILS (tetap) ===
function isImage(t?: string) { return !!t && t.startsWith('image/'); }

function svgFallback(label: string = 'Gambar', w = 800, h = 450, theme: any) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
<rect width="100%" height="100%" fill="${theme.surface}"/>
<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffffb3" font-family="Inter,Arial,sans-serif" font-size="22">${label}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function SafeImg({
  src,
  alt,
  className,
  style,
  fallbackLabel,
  theme
}: {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackLabel?: string;
  theme: any;
}) {
  const [url, setUrl] = React.useState<string>(src || '');
  const [triedFallback, setTriedFallback] = React.useState(false);

  React.useEffect(() => {
    setUrl(src || '');
    setTriedFallback(false);
  }, [src]);

  const ph = `https://placehold.co/1280x720/png?text=${encodeURIComponent(fallbackLabel || alt || 'Gambar')}`;
  const finalUrl = url || ph;

  return (
    <img
      src={finalUrl}
      alt={alt || ''}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!triedFallback) {
          setUrl(ph);
          setTriedFallback(true);
        } else {
          setUrl(svgFallback(fallbackLabel || alt || 'Gambar', 800, 450, theme));
        }
      }}
    />
  );
}

// === REACT-QUERY HOOK — PAKAI API BARU ===
const usePramukaData = () => {
  return useQuery({
    queryKey: ['pramuka', 'schoolId-88'],
    queryFn: async () => {
      const res = await fetch("https://be-school.kiraproject.id/pramuka?schoolId=88", {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();

      if (!json.success || !Array.isArray(json.data)) return DEMO;

      return json.data.map((item: any): Kegiatan => ({
        id: item.id.toString(),
        judul: item.title || "Kegiatan Pramuka",
        jenis: (item.category as Jenis) || "Latihan",
        tanggal: item.date || todayPlus(0),
        lokasi: item.location || "Lapangan Sekolah",
        penanggungJawab: item.mentor || "Pembina Pramuka",
        peserta: 0, // backend tidak punya field ini → dummy
        deskripsi: item.description || "Tidak ada deskripsi",
        dokumentasi: item.imageUrl
          ? [{ name: item.title, url: item.imageUrl, type: 'image/jpeg' }]
          : [],
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 menit
    gcTime: 10 * 60 * 1000,
    placeholderData: DEMO,
    retry: 1,
  });
};

// === ACTIVITY CARD (disesuaikan sedikit) ===
function ActivityCard({
  kegiatan,
  onOpenDetail,
  theme,
}: {
  kegiatan: Kegiatan;
  onOpenDetail: (k: Kegiatan) => void;
  onOpenViewer: (items: DocItem[], idx: number) => void;
  theme: any;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="rounded-xl overflow-hidden shadow-2xl group"
      style={{ background: `${theme.surface}cc` }}
    >
      <div className="relative">
        {kegiatan.dokumentasi[0]?.url ? (
          <SafeImg
            src={kegiatan.dokumentasi[0].url}
            alt={kegiatan.judul}
            className="w-full h-48 object-cover"
            fallbackLabel={kegiatan.judul}
            theme={theme}
          />
        ) : (
          <img src="/pramuka.jpg" alt="fallback" className="w-full h-48 object-cover" />
        )}
        <div className="absolute top-2 left-2 bg-black/60 text-xs px-2 py-1 rounded">
          {kegiatan.jenis}
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 text-xs px-2 py-1 rounded inline-flex items-center gap-1">
          <Calendar size={14} />
          {new Date(kegiatan.tanggal).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold line-clamp-2 mb-1" style={{ color: theme.surfaceText }}>
          {kegiatan.judul}
        </h3>
        <div className="text-xs opacity-80 flex items-center gap-2 mb-2" style={{ color: theme.surfaceText }}>
          <MapPin size={14} />
          <span className="line-clamp-1">{kegiatan.lokasi}</span>
        </div>
        <div className="flex items-center text-xs opacity-80 mb-3" style={{ color: theme.surfaceText }}>
          <span className="inline-flex items-center gap-1">
            <Users size={14} /> {kegiatan.peserta} Peserta
          </span>
        </div>
        <div
          onClick={() => onOpenDetail(kegiatan)}
          className="inline-block mt-4 px-4 py-2 mb-2 cursor-pointer active:scale-[0.97] hover:brightness-95 rounded-full text-sm font-medium transition-all"
          style={{ background: theme.accent, color: "#111827" }}
        >
          Lihat Detail →
        </div>
      </div>
    </motion.div>
  );
}

// === DETAIL MODAL (disederhanakan karena tidak ada sub-kegiatan) ===
function DetailModal({
  detail,
  onClose,
  onOpenViewer,
  theme,
}: {
  detail: Kegiatan;
  onClose: () => void;
  onOpenViewer: (items: DocItem[], idx: number) => void;
  theme: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="rounded-2xl p-6 max-w-2xl w-full mx-4 text-white border"
        style={{
          background: theme.surface + "ee",
          borderColor: theme.border,
          color: theme.surfaceText
        }}
      >
        <h2 className="text-xl font-bold mb-4">{detail.judul}</h2>
        <p className="text-sm opacity-80 mb-4">{detail.deskripsi || "Tidak ada deskripsi"}</p>
        <div className="text-sm mb-4 space-y-1">
          <p><strong>Jenis:</strong> {detail.jenis}</p>
          <p><strong>Tanggal:</strong> {new Date(detail.tanggal).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          <p><strong>Lokasi:</strong> {detail.lokasi}</p>
          <p><strong>Pembina:</strong> {detail.penanggungJawab}</p>
          <p><strong>Peserta:</strong> {detail.peserta} orang</p>
        </div>

        {detail.dokumentasi.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-2">Dokumentasi</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {detail.dokumentasi.map((doc, idx) => (
                <div
                  key={idx}
                  className="cursor-pointer rounded overflow-hidden border border-white/20"
                  onClick={() => onOpenViewer(detail.dokumentasi, idx)}
                >
                  <SafeImg
                    src={doc.url}
                    alt={doc.name}
                    className="w-full h-32 object-cover"
                    fallbackLabel={doc.name}
                    theme={theme}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button className="btn-ghost border border-black/30 rounded-md px-4 py-2" onClick={onClose} style={{ color: theme.surfaceText }}>
            Tutup
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// === LIGHTBOX (tetap sama) ===
function Lightbox({
  viewer,
  onClose,
  onNext,
  onPrev,
  theme,
}: {
  viewer: { open: boolean; items: DocItem[]; idx: number };
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  theme: any;
}) {
  if (!viewer.open) return null;
  const item = viewer.items[viewer.idx];

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div className="mb-3 text-sm opacity-80 line-clamp-1 max-w-[90vw]" style={{ color: theme.surfaceText }}>
          {item?.name}
        </div>
        <div className="relative max-w-[90vw] max-h-[80vh] bg-black/40 rounded-xl overflow-hidden border" style={{ borderColor: theme.border }}>
          {isImage(item?.type) ? (
            <SafeImg src={item?.url} alt="dok" className="object-contain max-h-[80vh] max-w-[90vw]" fallbackLabel={item?.name || 'Gambar'} theme={theme} />
          ) : (
            <div className="p-6 text-center text-white/70">
              Tidak dapat menampilkan pratinjau. <a className="underline" href={item?.url} target="_blank" rel="noreferrer">Buka</a>
            </div>
          )}
          <button onClick={onClose} className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 rounded-full p-2" aria-label="Tutup">
            <X />
          </button>
          {viewer.items.length > 1 && (
            <>
              <button onClick={onPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2" aria-label="Sebelumnya">
                <ChevronLeft />
              </button>
              <button onClick={onNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2" aria-label="Berikutnya">
                <ChevronRight />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// === MAIN COMPONENT ===
export function PramukaMain() {
  const queryClient = useQueryClient();
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;

  const { data: rows = DEMO, isPending: busy, error } = usePramukaData();

  const [detail, setDetail] = useState<Kegiatan | null>(null);
  const [viewer, setViewer] = useState<{ open: boolean; items: DocItem[]; idx: number }>({ open: false, items: [], idx: 0 });

  const sortedRows = useMemo(
    () => rows.slice().sort((a, b) => (new Date(a.tanggal) > new Date(b.tanggal) ? -1 : 1)),
    [rows]
  );

  const [show, setShow] = useState(9);
  const page = useMemo(() => sortedRows.slice(0, show), [sortedRows, show]);

  const openDetail = useCallback((k: Kegiatan) => {
    setDetail(k);
    try { history.replaceState(null, "", `#k=${k.id}`); } catch {}
  }, []);

  const closeDetail = useCallback(() => {
    setDetail(null);
    try { if (location.hash.startsWith("#k=")) history.replaceState(null, "", location.pathname + location.search); } catch {}
  }, []);

  const openViewer = useCallback((items: DocItem[], idx: number = 0) => {
    setViewer({ open: true, items, idx });
  }, []);

  const closeViewer = useCallback(() => {
    setViewer((v) => ({ ...v, open: false }));
  }, []);

  const nextViewer = useCallback(() => {
    setViewer((v) => ({ ...v, idx: (v.idx + 1) % (v.items.length || 1) }));
  }, []);

  const prevViewer = useCallback(() => {
    setViewer((v) => ({
      ...v,
      idx: (v.idx - 1 + (v.items.length || 1)) % (v.items.length || 1),
    }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (detail) closeDetail();
        if (viewer.open) closeViewer();
      }
      if (e.key === "ArrowRight" && viewer.open) nextViewer();
      if (e.key === "ArrowLeft" && viewer.open) prevViewer();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [detail, viewer.open, closeDetail, closeViewer, nextViewer, prevViewer]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      <HeroSection />

      <main
        className="text-white"
        style={{
          background: `radial-gradient(1000px 600px at 10% -10%, ${'black'}22, transparent)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header Section */}
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div
              className="rounded-3xl p-5 border overflow-hidden"
              style={{
                borderColor: theme.border,
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.bg})`,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full overflow-hidden bg-cover border grid place-items-center text-xs font-semibold"
                  style={{
                    background: theme.surface + "20",
                    borderColor: theme.border,
                    color: theme.primaryText
                  }}
                >
                  <img src="/pramuka.jpg" alt="Pramuka" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm opacity-80" style={{ color: theme.primaryText }}>
                    Beranda / Pramuka
                  </div>
                  <h1 className="text-2xl font-bold" style={{ color: theme.primaryText }}>
                    Pramuka SMAN 25
                  </h1>
                  <p className="text-sm opacity-80" style={{ color: theme.primaryText }}>
                    Galeri Kegiatan & Dokumentasi
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Error Message */}
          {error && (
            <div
              className="rounded-xl border p-4 mb-6 text-center"
              style={{
                borderColor: theme.border,
                background: theme.surface,
                color: theme.surfaceText
              }}
            >
              {error.message || "Gagal memuat data kegiatan Pramuka. Menampilkan contoh."}
            </div>
          )}

          {/* Cards */}
          <AnimatePresence mode="popLayout">
            {busy ? (
              <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="rounded-xl border p-4 animate-pulse"
                    style={{ borderColor: theme.border, background: `${theme.surface}cc` }}
                  >
                    <div className="h-48 bg-white/20 rounded mb-3" />
                    <div className="h-6 bg-white/20 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-white/20 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-white/20 rounded w-1/3" />
                  </motion.div>
                ))}
              </motion.div>
            ) : page.length ? (
              <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {page.map((k) => (
                  <ActivityCard
                    key={k.id}
                    kegiatan={k}
                    onOpenDetail={openDetail}
                    onOpenViewer={openViewer}
                    theme={theme}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="rounded-xl border p-6 text-center"
                style={{
                  borderColor: theme.border,
                  background: theme.surface,
                  color: theme.surfaceText
                }}
              >
                Belum ada kegiatan Pramuka yang tersedia.
              </motion.div>
            )}
          </AnimatePresence>

          {show < sortedRows.length && (
            <div className="flex justify-center mt-8">
              <button
                className="btn-ghost px-6 py-3"
                onClick={() => setShow((s) => s + 9)}
                disabled={busy}
                style={{ color: theme.surfaceText }}
              >
                Muat Lebih Banyak
              </button>
            </div>
          )}
        </div>
      </main>

      <FooterComp theme={theme} />

      {detail && (
        <DetailModal
          detail={detail}
          onClose={closeDetail}
          onOpenViewer={openViewer}
          theme={theme}
        />
      )}
      <Lightbox
        viewer={viewer}
        onClose={closeViewer}
        onNext={nextViewer}
        onPrev={prevViewer}
        theme={theme}
      />
    </div>
  );
}