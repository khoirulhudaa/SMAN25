import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Hook untuk ambil school info (termasuk id)

const HeroSection = () => {
  const scrollToPrestasi = () => {
    document.getElementById("prestasi-content")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/pres1.webp')`,
          backgroundPosition: "center 35%",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

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
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition">
            ✕
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
};

/* Data dummy sekarang kosong sesuai permintaan */
const ACHIEVEMENTS: any[] = [];

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
        <span
          className="inline-block mt-7 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{ background: theme.accent, color: "#111827" }}
        >
          Lihat Detail →
        </span>
      </div>
    </motion.div>
  );
};

const PrestasiSection = ({ theme }) => {
  const schoolId = 88

  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Semua');
  const [lvl, setLvl] = useState('Semua');

  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrestasi = async () => {
      if (!schoolId) {
        setError("School ID tidak tersedia");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const url = `https://be-school.kiraproject.id/prestasi?schoolId=${schoolId}`;

        const res = await fetch(url, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Gagal memuat: ${res.status}`);
        }

        const json = await res.json();

        if (!json.success || !Array.isArray(json.data)) {
          setAchievements([]);
          return;
        }

        const mapped = json.data.map((item: any) => ({
          title: item.name || 'Prestasi tanpa judul',
          date: item.year
            ? String(item.year)
            : (item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('id-ID', { year: 'numeric' })
                : '—'),
          category: item.organizer || 'Lainnya',
          level: item.level || 'Sekolah',
          desc: item.description || 'Tidak ada deskripsi.',
          img: item.imageUrl || '/trophy.jpg',
        }));

        setAchievements(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Terjadi kesalahan saat memuat data");
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestasi();
  }, [schoolId]);

  const displayAchievements = achievements.length > 0 ? achievements : ACHIEVEMENTS;

  const categories = useMemo(() => ['Semua', ...new Set(displayAchievements.map(a => a.category))], [displayAchievements]);
  const levels = useMemo(() => ['Semua', ...new Set(displayAchievements.map(a => a.level))], [displayAchievements]);

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
      <div className="max-w-7xl mx-auto md:px-0 px-4">
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

        <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-4 mb-12">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari prestasi..."
            className="px-6 py-3 border border-gray-400 rounded-2xl text-base shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-300/50 transition"
            style={{ background: "rgba(255,255,255,0.95)", color: "#111827", minWidth: "300px" }}
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="px-6 py-3 border border-gray-400 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
            style={{ background: "rgba(255,255,255,0.95)", color: "#111827" }}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={lvl}
            onChange={(e) => setLvl(e.target.value)}
            className="px-6 py-3 border border-gray-400 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
            style={{ background: "rgba(255,255,255,0.95)", color: "#111827" }}
          >
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {error ? (
          <div className="text-center py-12 text-red-600">
            {error}. Data tidak dapat dimuat.
          </div>
        ) : loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-white/50 backdrop-blur animate-pulse h-96" />
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
                Belum ada prestasi yang tersedia saat ini.
              </p>
            )}
          </div>
        )}

        <Modal open={!!selected} onClose={() => setSelected(null)} theme={theme} title={selected?.title || ''}>
          {selected && (
            <div className="space-y-6">
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

const PrestasiPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />
      <HeroSection />
      <PrestasiSection theme={theme} schoolName={schoolName} />
      <FooterComp theme={theme} />
    </div>
  );
};

export default PrestasiPage;