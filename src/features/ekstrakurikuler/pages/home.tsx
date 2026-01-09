import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQueries } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

/****************************
 * DATA DEMO — EKSTRAKURIKULER (UPDATED THUMBNAILS)
 ****************************/
const CATEGORIES = ["Sains & Riset", "Pramuka", "Jurnalistik", "Keagamaan", "Bahasa", "Multimedia"];
const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const CLUBS = [
  { name: "Futsal", category: "Olahraga", day: "Rabu", time: "15:30–17:30", room: "Lapangan", coach: "Pak Dedi", quota: 40, members: 32, img: '/ekstra.jpg', desc: "Pembinaan teknik dasar, taktik, dan sportivitas.", achievements: ["Juara 2 Kota 2024"] },
  { name: "Basket", category: "Olahraga", day: "Jumat", time: "15:30–17:30", room: "Gor Mini", coach: "Bu Rina", quota: 30, members: 28, img: '/ekstra.jpg', desc: "Fundamental, defense, dan teamplay.", achievements: [] },
  { name: "Paskibra", category: "Leadership", day: "Selasa", time: "15:30–17:30", room: "Lapangan Upacara", coach: "Pak Arman", quota: 50, members: 45, img: '/ekstra.jpg', desc: "Latihan baris-berbaris dan kedisiplinan.", achievements: ["Tugas HUT RI 2025 Kecamatan"] },
  { name: "Pramuka", category: "Pramuka", day: "Jumat", time: "14:00–16:00", room: "Aula", coach: "Kak Sinta", quota: 60, members: 54, img: '/ekstra.jpg', desc: "Kepramukaan, kemandirian, dan kepemimpinan.", achievements: ["Jambore 2024"] },
  { name: "Rohis", category: "Keagamaan", day: "Kamis", time: "15:00–16:30", room: "Masjid", coach: "Ust. Fajar", quota: 40, members: 35, img: '/ekstra.jpg', desc: "Kajian, tahsin, dan kegiatan sosial.", achievements: [] },
  { name: "Paduan Suara", category: "Seni", day: "Rabu", time: "15:30–17:00", room: "Ruang Musik", coach: "Bu Maya", quota: 35, members: 20, img: '/ekstra.jpg', desc: "Teknik vokal dan harmoni.", achievements: ["Penampil Tamu Festival 2025"] },
  { name: "Teater", category: "Seni", day: "Selasa", time: "15:30–17:30", room: "Aula", coach: "Pak Yoga", quota: 25, members: 18, img: '/ekstra.jpg', desc: "Aktor, naskah, dan panggung.", achievements: [] },
  { name: "KIR (Kelompok Ilmiah Remaja)", category: "Sains & Riset", day: "Kamis", time: "15:30–17:00", room: "Lab IPA", coach: "Bu Nisa", quota: 30, members: 22, img: '/ekstra.jpg', desc: "Riset sains dan lomba karya tulis.", achievements: ["Finalis LIPI 2024"] },
  { name: "Robotik", category: "Sains & Riset", day: "Sabtu", time: "08:00–11:00", room: "Lab RPL", coach: "Pak Doni", quota: 24, members: 21, img: '/ekstra.jpg', desc: "Arduino, IoT, dan kompetisi robot.", achievements: ["Juara 3 Provinsi 2025"] },
];

/****************************
 * HERO SECTION
 ****************************/
const HeroSection = () => {
  const scrollToEkskul = () => {
    document.getElementById("ekskul")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden z-[1]">
      {/* Background Image - Gedung SMA di Jakarta (mirip SMAN 25) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://www.shutterstock.com/image-photo/jakarta-indonesia-on-6-july-260nw-2663425873.jpg')`,
        }}
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 -mt-6 md:text-center text-left text-white px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Ekstrakurikuler SMAN 25 Jakarta
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 text-white/90"
        >
          Temukan bakatmu, kembangkan minat, dan raih prestasi bersama berbagai kegiatan ekstrakurikuler kami.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={scrollToEkskul}
          className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition shadow-lg"
        >
          Jelajahi Ekskul
        </motion.button>
      </div>
    </section>
  );
};

/****************************
 * HELPERS & COMPONENTS
 ****************************/
const normalize = (s: string) => (s || "").toLowerCase();

function filterClubs(list: any[], q: string, category: string, day: string) {
  return list.filter(c => {
    const matchQ = !q || normalize(c.name).includes(normalize(q)) || normalize(c.desc).includes(normalize(q));
    const matchCat = !category || category === 'Semua' || c.category === category;
    const matchDay = !day || day === 'Semua' || c.day === day;
    return matchQ && matchCat && matchDay;
  });
}

const Chip = ({ children, theme }: any) => (
  <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: theme.subtle, background: "rgba(255,255,255,0.06)", color: theme.primaryText }}>
    {children}
  </span>
);

const ClubCard = ({ club, theme, onOpen }: any) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
      className="rounded-2xl overflow-hidden border hover:shadow-md transition cursor-pointer"
      style={{ borderColor: theme.subtle, background: theme.surface }}
      onClick={() => onOpen(club)}
    >
      <div className="aspect-[4/3] w-full bg-gray-200">
        <img src={club.img} alt={club.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="font-semibold truncate" style={{ color: theme.primaryText }}>{club.name}</div>
          <Chip theme={theme}>{club.category}</Chip>
        </div>
        <div className="mt-1 text-xs opacity-85 line-clamp-2" style={{ color: theme.surfaceText }}>{club.desc}</div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs" style={{ color: theme.primaryText }}>
          <Chip theme={theme}>{club.day}</Chip>
          <Chip theme={theme}>{club.room}</Chip>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs px-3 py-1 rounded-lg border" style={{ borderColor: theme.subtle, color: theme.primaryText }}>
            Detail
          </span>
          {club.achievements?.length > 0 && (
            <span className="text-[11px] font-medium" style={{ color: theme.accent }}>
              {club.achievements[0]}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Modal = ({ open, onClose, theme, title, children }: any) => {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] mt-14 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative max-w-2xl w-full rounded-2xl border p-6 overflow-y-auto max-h-[90vh]"
        style={{ background: theme.surface, borderColor: theme.subtle }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ color: theme.primaryText }}>{title}</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-lg border text-sm" style={{ borderColor: theme.subtle, color: theme.primaryText }}>
            Tutup
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

/****************************
 * EKSKUL SECTION
 **************************/
const EkskulSection = ({ theme, schoolName }: any) => {
  const xHost = getXHostHeader();

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("Semua");
  const [day, setDay] = useState("Semua");
  const [sortBy, setSortBy] = useState("nama");
  const [selected, setSelected] = useState<any>(null);

  const [clubsQuery] = useQueries({
    queries: [
      {
        queryKey: ['ekstrakurikuler', xHost],
        queryFn: async () => {
          const res = await fetch('https://dev.kiraproject.id/ekstrakurikuler', {
            cache: 'no-store',
            headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
          });
          if (!res.ok) throw new Error('Failed');
          const json = await res.json();
          if (!json.data || !Array.isArray(json.data)) return [];
          return json.data.map((item: any) => {
            const [dayPart = '', timePart = ''] = (item.jadwal || '').split(', ');
            const day = dayPart.split(' & ')[0] || 'Rabu';
            return {
              name: item.nama || 'Tidak diketahui',
              category: item.jenis || 'Lainnya',
              day: DAYS.includes(day) ? day : 'Rabu',
              time: timePart || 'Tidak diketahui',
              room: item.lokasi || 'Tidak diketahui',
              desc: item.deskripsi || 'Tidak ada deskripsi.',
              coach: item.pembina || 'Tidak diketahui',
              quota: item.kuota || 30,
              achievements: item.prestasi || [],
              img: item.thumbnail || CLUBS[0].img,
            };
          });
        },
        placeholderData: [],
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: true,
        retry: 1,
      },
    ],
  });

  const clubs = clubsQuery.data || [];
  const loading = clubsQuery.isPending;
  const error = clubsQuery.error;

  const displayClubs = clubs.length > 0 ? clubs : CLUBS;

  const categories = useMemo(() => {
    const cats = [...new Set(displayClubs.map((c: any) => c.category))];
    return cats.length > 0 ? cats : CATEGORIES;
  }, [displayClubs]);

  const sorters = {
    nama: (a,b) => a.name.localeCompare(b.name),
    populer: (a,b) => (b.members||0) - (a.members||0),
  };

  const filtered = useMemo(() => {
    return filterClubs(displayClubs, q, category, day)
      .slice()
      .sort(sorters[sortBy as keyof typeof sorters]);
  }, [q, category, day, sortBy, displayClubs]);

  return (
    <section id="ekskul" className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:text-center text-left mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Ekstrakurikuler 
          </h2>
          <p className="mt-3 text-lg text-black/80">
            Kegiatan pengembangan minat dan bakat siswa
          </p>
        </motion.div>

        {error && (
          <div className="md:text-center text-left py-4 text-red-600">
            Gagal memuat data dari server. Menggunakan data demo.
          </div>
        )}

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap justify-center gap-4"
        >
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Cari ekskul..."
            className="px-4 py-2 rounded-xl border text-black border-black/10 focus:outline-none focus:border-black/30"
          />
          <select value={category} onChange={e => setCategory(e.target.value)} className="text-black px-4 py-2 rounded-xl border border-black/10">
            <option>Semua Kategori</option>
            {categories.map((c: any) => <option key={c}>{c}</option>)}
          </select>
          <select value={day} onChange={e => setDay(e.target.value)} className="text-black px-4 py-2 rounded-xl border border-black/10">
            <option>Semua Hari</option>
            {DAYS.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-black px-4 py-2 rounded-xl border border-black/10">
            <option value="nama">Nama (A-Z)</option>
            <option value="populer">Populer</option>
          </select>
        </motion.div>

        {/* Grid atau Loading */}
        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-black/5 bg-white p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((club: any) => (
              <ClubCard key={club.name} club={club} theme={theme} onOpen={setSelected} />
            ))}
          </motion.div>
        ) : (
          <div className="md:text-center text-left py-20 text-black/60">
            Tidak ada ekstrakurikuler yang sesuai dengan filter.
          </div>
        )}

        {/* Modal Detail */}
        <Modal open={!!selected} onClose={() => setSelected(null)} theme={theme} title={selected?.name}>
          {selected && (
            <div>
              {/* <img src={selected.img} alt={selected.name} className="w-full h-40 object-cover rounded-xl mb-6" /> */}
              <div className="flex flex-wrap gap-2 mb-4  text-black">
                <Chip theme={theme}>{selected.category}</Chip>
                <Chip theme={theme}>{selected.day}</Chip>
                <Chip theme={theme}>{selected.time}</Chip>
                <Chip theme={theme}>{selected.room}</Chip>
                <Chip theme={theme}>{selected.members}/{selected.quota} anggota</Chip>
              </div>
              <p className="text-base mb-6 leading-relaxed text-black">{selected.desc}</p>
              {selected.achievements?.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Prestasi</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    {selected.achievements.map((a: string, i: number) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              )}
              <p className="text-sm mb-6  text-black">Pembina: <strong>{selected.coach}</strong></p>
              <div className="text-sm  text-black md:flex items-center gap-4 block">
                <p>📞 Telepon: <a href="tel:(021)6331921" className="underline">(021) 6331921</a></p>
                <p>✉️ Email: <a href="mailto:info@sman25-jkt.sch.id" className="underline">info@sman25-jkt.sch.id</a></p>
              </div>
              <div className="flex gap-4 mt-8">
                {/* <button
                  onClick={() => alert("Pendaftaran akan segera dibuka. Hubungi pembina untuk info lebih lanjut.")}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-semibold"
                >
                  Daftar Sekarang
                </button> */}
                {/* <button onClick={() => setSelected(null)} className="px-6  text-black py-3 border border-black/20 rounded-xl">
                  Tutup
                </button> */}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};

/****************************
 * PAGE UTAMA
 **************************/
const EkskulPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp theme={theme} />
      <HeroSection />
      <main className="flex-1 -mt-12 relative z-[1]">
        <EkskulSection theme={theme} schoolName={schoolName} />
      </main>
      <FooterComp theme={theme} />
    </div>
  );
};

export default EkskulPage;