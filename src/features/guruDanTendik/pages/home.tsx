import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/****************************
 * HERO SECTION UNTUK GURU & TENDIK
 ****************************/
const HeroSection = () => {
  const scrollToGuruTendik = () => {
    document.getElementById("guru-tendik")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/teacher.jpg')`,
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
          Guru & Tenaga Pendidik
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Profil lengkap pendidik dan tenaga kependidikan SMAN 25 Jakarta
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          onClick={scrollToGuruTendik}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          Lihat Profil
        </motion.button>
      </div>
    </section>
  );
};

/****************************
 * AVATAR SVG GENERATOR
 ****************************/
const makeAvatar = (name: string, theme: any) => {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const svg = `<?xml version='1.0' encoding='UTF-8'?>
<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
<stop offset='0%' stop-color='${theme.primary}'/><stop offset='100%' stop-color='${theme.subtle}'/></linearGradient></defs>
<rect width='240' height='240' rx='24' fill='url(#g)'/>
<text x='50%' y='55%' text-anchor='middle' font-family='Inter,Arial' font-size='84' font-weight='700' fill='${theme.primaryText}'>${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/****************************
 * DEMO DATA (Fallback)
 ****************************/
const DEMO_PEOPLE = [
  { id: 1, name: "Drs. Andi Pratama", unit: "RPL", subjects: ["RPL"], status: "PNS", years: 12, email: "andi@smkn13.sch.id" },
  { id: 2, name: "Sari Wulandari, M.Pd", unit: "Umum", subjects: ["MTK"], status: "PNS", years: 10, email: "sari@smkn13.sch.id" },
  { id: 3, name: "Budi Santoso", unit: "RPL", subjects: ["RPL"], status: "PPPK", years: 6, email: "budi@smkn13.sch.id" },
  { id: 4, name: "Siti Rahma", unit: "Umum", subjects: [], role: "TU – Administrasi", status: "PNS", years: 7, email: "siti@smkn13.sch.id" },
];

/****************************
 * REACT QUERY HOOK - Terintegrasi dengan API guruTendik
 ****************************/
const useTeacherStaff = () => {
  return useQuery({
    queryKey: ['guru-tendik'],
    queryFn: async () => {
      const schoolId = 88; // <-- GANTI sesuai kebutuhan (bisa dari context, env, atau props)
      const url = `https://be-school.kiraproject.id/guruTendik?schoolId=${schoolId}`;

      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal memuat data guru/tendik: ${res.status}`);
      }

      const json = await res.json();

      if (!json.success || !Array.isArray(json.data)) {
        throw new Error('Format response API tidak sesuai');
      }

      return json.data.map((item: any) => ({
        id: item.id,
        name: item.nama || 'Nama tidak tersedia',
        subjects: item.mapel ? [item.mapel.trim()] : [],
        role: item.role || (item.mapel ? null : 'Tendik / Staf'),
        unit: item.jurusan || 'Umum',
        photo: item.photoUrl || null,
        status: item.isActive ? 'Aktif' : 'Nonaktif',
        years: 0, // Belum ada field tahun mulai → bisa ditambah di backend nanti
        email: item.email || null,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 menit
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: DEMO_PEOPLE,
    retry: 1,
  });
};

/****************************
 * FILTER & SORT
 ****************************/
const DEPARTMENTS = ["Guru", "Wali Kelas", "Kepala Sekolah", "Kepala Tata Usaha", "Administrasi"];
const SUBJECTS = ["RPL", "TKJ", "MM", "MTK", "B. Indonesia", "B. Inggris", "PPKn", "Sejarah", "Agama", "PJOK", "BK", "Kewirausahaan"];

const filterPeople = (people: any[], q: string, unit: string, subject: string) => {
  const nq = q.trim().toLowerCase();
  return people.filter((p) => {
    const matchQ =
      !nq ||
      p.name.toLowerCase().includes(nq) ||
      (p.email || '').toLowerCase().includes(nq) ||
      (p.role || '').toLowerCase().includes(nq);
    const matchUnit = unit === 'Semua' || p.unit === unit;
    const matchSubj = subject === 'Semua' || p.subjects.includes(subject);
    return matchQ && matchUnit && matchSubj;
  });
};

const sorters: Record<string, (a: any, b: any) => number> = {
  nama: (a, b) => a.name.localeCompare(b.name),
  masaKerja: (a, b) => (b.years || 0) - (a.years || 0),
};

const Chip = ({ children, theme }: { children: React.ReactNode; theme: any }) => (
  <span
    className="text-[11px] px-2 py-0.5 rounded-full border"
    style={{ borderColor: theme.subtle, background: "rgba(255,255,255,0.06)", color: theme.primaryText }}
  >
    {children}
  </span>
);

/****************************
 * CARD & MODAL
 ****************************/
const PersonCard = ({ person, theme, onOpen }: { person: any; theme: any; onOpen: (p: any) => void }) => {
  const prefersReducedMotion = useReducedMotion();
  const isTeacher = person.subjects.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
      className="rounded-2xl p-4 border border-gray-300 flex gap-3 hover:shadow-md transition cursor-pointer"
      style={{ background: theme.surface }}
      onClick={() => onOpen(person)}
    >
      <img
        src={person.photo || makeAvatar(person.name, theme)}
        alt={person.name}
        className="w-14 h-14 rounded-xl object-cover border"
        style={{ borderColor: theme.subtle }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate">
            <div className="font-semibold truncate" style={{ color: theme.primaryText }}>
              {person.name}
            </div>
            <div className="text-xs opacity-80 truncate" style={{ color: theme.primaryText }}>
              {isTeacher ? person.subjects.join(', ') : person.role}
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-lg border" style={{ borderColor: theme.subtle, color: theme.primaryText }}>
            Detail
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Chip theme={theme}>{person.unit}</Chip>
          {isTeacher && <Chip theme={theme}>{person.status}</Chip>}
          {(person.years || 0) > 0 && <Chip theme={theme}>{person.years} th</Chip>}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: theme.primaryText }}>
          {person.email && (
            <a href={`mailto:${person.email}`} className="underline" onClick={(e) => e.stopPropagation()}>
              Email
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Modal = ({ open, onClose, theme, title, children }: { open: boolean; onClose: () => void; theme: any; title: string; children: React.ReactNode }) => {
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
        className="relative max-w-lg w-full rounded-2xl border p-4"
        style={{ background: theme.surface, borderColor: theme.subtle }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold" style={{ color: theme.primaryText }}>
            {title}
          </div>
          <button onClick={onClose} className="px-2 py-1 rounded-lg border text-xs" style={{ borderColor: theme.subtle, color: theme.primaryText }}>
            Tutup
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

/****************************
 * CONTROLS
 ****************************/
const Controls = ({
  theme,
  q,
  setQ,
  unit,
  setUnit,
  subject,
  setSubject,
  sortBy,
  setSortBy,
}: {
  theme: any;
  q: string;
  setQ: (v: string) => void;
  unit: string;
  setUnit: (v: string) => void;
  subject: string;
  setSubject: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="flex flex-wrap items-center gap-3"
  >
    <input
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder="Cari nama/email/role…"
      className="px-3 py-2 rounded-xl text-sm border bg-transparent"
      style={{ borderColor: theme.subtle, color: theme.primaryText }}
    />
    {/* <label className="text-xs flex items-center gap-2">
      <span style={{ color: theme.primaryText }}>Unit</span>
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="px-2 py-1 rounded-lg text-sm border bg-transparent"
        style={{ borderColor: theme.subtle, color: theme.primaryText }}
      >
        {['Semua', ...DEPARTMENTS].map((u) => (
          <option key={u} value={u} style={{ color: '#111827' }}>
            {u}
          </option>
        ))}
      </select>
    </label> */}
    <label className="text-xs flex items-center gap-2">
      <span style={{ color: theme.primaryText }}>Mapel</span>
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="px-2 py-1 rounded-lg text-sm border bg-transparent"
        style={{ borderColor: theme.subtle, color: theme.primaryText }}
      >
        {['Semua', ...SUBJECTS].map((s) => (
          <option key={s} value={s} style={{ color: '#111827' }}>
            {s}
          </option>
        ))}
      </select>
    </label>
  </motion.div>
);

/****************************
 * GURU & TENDIK SECTION
 ****************************/
export const TeacherStaffSection = ({ theme, schoolName }: { theme: any; schoolName: string }) => {
  const [q, setQ] = useState('');
  const [unit, setUnit] = useState('Semua');
  const [subject, setSubject] = useState('Semua');
  const [sortBy, setSortBy] = useState('nama');
  const [selected, setSelected] = useState<any>(null);

  const { data: people = DEMO_PEOPLE, isPending: loading, error } = useTeacherStaff();

  const filteredPeople = useMemo(() => {
    return filterPeople(people, q, unit, subject).slice().sort(sorters[sortBy]);
  }, [people, q, unit, subject, sortBy]);

  const summary = useMemo(
    () => ({
      totalPersonel: people.length,
      unitAktif: unit,
      hasil: filteredPeople.length,
    }),
    [people, unit, filteredPeople]
  );

  return (
    <section id="guru-tendik" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto md:px-0 px-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold"
              style={{ color: 'black' }}
            >
              Guru & Tendik {schoolName}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm opacity-85"
              style={{ color: theme.surfaceText || '#666' }}
            >
              Profil pendidik dan tenaga kependidikan {schoolName}.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-right md:inline-block hidden"
          >
            <div className="text-xs" style={{ color: theme.primaryText }}>
              Total Personel: <strong>{summary.totalPersonel}</strong>
            </div>
            <div className="text-xs opacity-80" style={{ color: theme.primaryText }}>
              Unit: {summary.unitAktif} · Hasil: {summary.hasil}
            </div>
          </motion.div>
        </div>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-center py-8">
            Memuat data guru dan tendik...
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 text-center py-4">
            {error.message}. Menampilkan data contoh (demo).
          </motion.div>
        )}

        {!loading && !error && (
          <div className="mb-4">
            <Controls
              theme={theme}
              q={q}
              setQ={setQ}
              unit={unit}
              setUnit={setUnit}
              subject={subject}
              setSubject={setSubject}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filteredPeople.map((p) => (
              <PersonCard key={p.id} person={p} theme={theme} onOpen={setSelected} />
            ))}
          </motion.div>
        )}

        <Modal open={!!selected} onClose={() => setSelected(null)} theme={theme} title={selected?.name || ''}>
          {selected && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 text-sm" style={{ color: theme.primaryText }}>
              <div className="flex items-center gap-4">
                <img
                  src={selected.photo || makeAvatar(selected.name, theme)}
                  alt={selected.name}
                  className="w-20 h-20 rounded-xl object-cover border shadow-sm"
                  style={{ borderColor: theme.subtle }}
                />
                <div>
                  <div className="font-bold text-lg">{selected.name}</div>
                  {selected.subjects.length > 0 && (
                    <div className="text-sm opacity-90">Mata Pelajaran: {selected.subjects.join(', ')}</div>
                  )}
                  {selected.role && <div className="text-sm opacity-90">Peran: {selected.role}</div>}
                  <div className="text-sm opacity-90">Unit/Jurusan: {selected.unit}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selected.status && <Chip theme={theme}>{selected.status}</Chip>}
                {(selected.years || 0) > 0 && <Chip theme={theme}>{selected.years} tahun masa kerja</Chip>}
              </div>

              {selected.email && (
                <div>
                  <a href={`mailto:${selected.email}`} className="underline hover:text-blue-400">
                    {selected.email}
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </Modal>
      </div>
    </section>
  );
};

/****************************
 * MAIN PAGE
 ****************************/
const TeacherStaffPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  useEffect(() => {
    // Optional: smoke test / debug
    console.log("Theme loaded:", theme);
  }, [theme]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      <HeroSection />

      <main>
        <TeacherStaffSection theme={theme} schoolName={schoolName} />
      </main>

      <FooterComp theme={theme} />
    </div>
  );
};

export default TeacherStaffPage;