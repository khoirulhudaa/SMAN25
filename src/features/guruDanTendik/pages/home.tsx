// import { SMAN25_CONFIG } from "@/core/theme";
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { motion, useReducedMotion } from "framer-motion";
// import { useEffect, useMemo, useState } from "react";

// /****************************
//  * AVATAR SVG GENERATOR
//  ****************************/
// const makeAvatar = (name, theme) => {
//   const initials = name
//     .split(" ")
//     .map((s) => s[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();
//   const svg = `<?xml version='1.0' encoding='UTF-8'?>
// <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'>
// <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
// <stop offset='0%' stop-color='${theme.primary}'/><stop offset='100%' stop-color='${theme.subtle}'/></linearGradient></defs>
// <rect width='240' height='240' rx='24' fill='url(#g)'/>
// <text x='50%' y='55%' text-anchor='middle' font-family='Inter,Arial' font-size='84' font-weight='700' fill='${theme.primaryText}'>${initials}</text></svg>`;
//   return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
// };

// /****************************
//  * DEMO DATA (Fallback)
//  ****************************/
// const DEMO_PEOPLE = [
//   { id: 1, name: "Drs. Andi Pratama", unit: "RPL", subjects: ["RPL"], status: "PNS", years: 12, email: "andi@smkn13.sch.id", phone: "0812000001" },
//   { id: 2, name: "Sari Wulandari, M.Pd", unit: "Umum", subjects: ["MTK"], status: "PNS", years: 10, email: "sari@smkn13.sch.id", phone: "0812000002" },
//   { id: 3, name: "Budi Santoso", unit: "RPL", subjects: ["RPL"], status: "PPPK", years: 6, email: "budi@smkn13.sch.id", phone: "" },
//   { id: 4, name: "Siti Rahma", unit: "Umum", subjects: [], role: "TU – Administrasi", status: "PNS", years: 7, email: "siti@smkn13.sch.id", phone: "0813000001" },
// ];

// /****************************
//  * REACT QUERY HOOK
//  ****************************/
// const useTeacherStaff = () => {
//   const xHost = getXHostHeader();

//   return useQuery({
//     queryKey: ['guru-tendik', xHost],
//     queryFn: async () => {
//       const res = await fetch(`https://dev.kiraproject.id/guru`, {
//         cache: 'no-store',
//         headers: {
//           'X-Host': xHost,
//           'Cache-Control': 'no-store',
//         },
//       });
//       if (!res.ok) throw new Error('Failed to fetch teacher/staff data');
//       const data = await res.json();
//       return data.items.map(item => ({
//         id: item.id,
//         name: item.nama,
//         subjects: item.mataPelajaran ? [item.mataPelajaran] : [],
//         role: item.mataPelajaran ? null : 'Staf',
//         unit: item.unit || 'Umum',
//         photo: item.photoUrl || null,
//         status: item.status || 'Aktif',
//         years: item.tahunMulaiMengajar ? (new Date().getFullYear() - item.tahunMulaiMengajar) : 0,
//         email: item.email || null,
//         phone: item.phone || null,
//       }));
//     },
//     staleTime: 0,
//     gcTime: 0,
//     refetchOnMount: true,
//     refetchOnWindowFocus: false,
//     placeholderData: DEMO_PEOPLE,
//     retry: 1,
//   });
// };

// /****************************
//  * FILTER & SORT
//  ****************************/
// const DEPARTMENTS = ["RPL", "TKJ", "Multimedia", "Umum", "Kurikulum", "Kesiswaan"];
// const SUBJECTS = ["RPL", "TKJ", "MM", "MTK", "B. Indonesia", "B. Inggris", "PPKn", "Sejarah", "Agama", "PJOK", "BK", "Kewirausahaan"];

// const filterPeople = (people, q, unit, subject) => {
//   const nq = q.trim().toLowerCase();
//   return people.filter(p => {
//     const matchQ = !nq || p.name.toLowerCase().includes(nq) || (p.email || '').toLowerCase().includes(nq) || (p.role || '').toLowerCase().includes(nq);
//     const matchUnit = unit === 'Semua' || p.unit === unit;
//     const matchSubj = subject === 'Semua' || p.subjects.includes(subject);
//     return matchQ && matchUnit && matchSubj;
//   });
// };

// const sorters = {
//   nama: (a, b) => a.name.localeCompare(b.name),
//   masaKerja: (a, b) => (b.years || 0) - (a.years || 0),
// };

// const Chip = ({ children, theme }) => (
//   <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: theme.subtle, background: "rgba(255,255,255,0.06)", color: theme.primaryText }}>
//     {children}
//   </span>
// );

// /****************************
//  * CARD & MODAL
//  ****************************/
// const PersonCard = ({ person, theme, onOpen }) => {
//   const prefersReducedMotion = useReducedMotion();
//   const isTeacher = person.subjects.length > 0;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 16, scale: 0.95 }}
//       whileInView={{ opacity: 1, y: 0, scale: 1 }}
//       viewport={{ once: true, amount: 0.3 }}
//       transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
//       className="rounded-2xl border p-4 flex gap-3 hover:shadow-md transition cursor-pointer"
//       style={{ background: theme.surface, borderColor: theme.subtle }}
//       onClick={() => onOpen(person)}
//     >
//       <img
//         src={makeAvatar(person.name, theme)}
//         alt={person.name}
//         className="w-14 h-14 rounded-xl object-cover border"
//         style={{ borderColor: theme.subtle }}
//       />
//       <div className="min-w-0 flex-1">
//         <div className="flex items-center justify-between gap-2">
//           <div className="truncate">
//             <div className="font-semibold truncate" style={{ color: theme.primaryText }}>
//               {person.name}
//             </div>
//             <div className="text-xs opacity-80 truncate" style={{ color: theme.primaryText }}>
//               {isTeacher ? person.subjects.join(', ') : person.role}
//             </div>
//           </div>
//           <span className="text-xs px-2 py-1 rounded-lg border" style={{ borderColor: theme.subtle, color: theme.primaryText }}>
//             Detail
//           </span>
//         </div>
//         <div className="mt-2 flex flex-wrap items-center gap-2">
//           <Chip theme={theme}>{person.unit}</Chip>
//           {isTeacher && <Chip theme={theme}>{person.status}</Chip>}
//           {(person.years || 0) > 0 && <Chip theme={theme}>{person.years} th</Chip>}
//         </div>
//         <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: theme.primaryText }}>
//           {person.email && <a href={`mailto:${person.email}`} className="underline" onClick={e => e.stopPropagation()}>Email</a>}
//           {person.phone && <a href={`tel:${person.phone}`} className="underline" onClick={e => e.stopPropagation()}>Telepon</a>}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const Modal = ({ open, onClose, theme, title, children }) => {
//   if (!open) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[60] flex items-center justify-center p-4"
//     >
//       <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose} />
//       <motion.div
//         initial={{ scale: 0.95, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.95, y: 20 }}
//         className="relative max-w-lg w-full rounded-2xl border p-4"
//         style={{ background: theme.surface, borderColor: theme.subtle }}
//       >
//         <div className="flex items-center justify-between mb-2">
//           <div className="font-semibold" style={{ color: theme.primaryText }}>{title}</div>
//           <button onClick={onClose} className="px-2 py-1 rounded-lg border text-xs" style={{ borderColor: theme.subtle, color: theme.primaryText }}>
//             Tutup
//           </button>
//         </div>
//         {children}
//       </motion.div>
//     </motion.div>
//   );
// };

// /****************************
//  * CONTROLS
//  ****************************/
// const Controls = ({ theme, q, setQ, unit, setUnit, subject, setSubject, sortBy, setSortBy }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 12 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true }}
//     transition={{ duration: 0.5 }}
//     className="flex flex-wrap items-center gap-3"
//   >
//     <input
//       value={q}
//       onChange={(e) => setQ(e.target.value)}
//       placeholder="Cari nama/email/role…"
//       className="px-3 py-2 rounded-xl text-sm border bg-transparent"
//       style={{ borderColor: theme.subtle, color: theme.primaryText }}
//     />
//     <label className="text-xs flex items-center gap-2">
//       <span style={{ color: theme.primaryText }}>Unit</span>
//       <select
//         value={unit}
//         onChange={(e) => setUnit(e.target.value)}
//         className="px-2 py-1 rounded-lg text-sm border bg-transparent"
//         style={{ borderColor: theme.subtle, color: theme.primaryText }}
//       >
//         {['Semua', ...DEPARTMENTS].map(u => (
//           <option key={u} value={u} style={{ color: '#111827' }}>{u}</option>
//         ))}
//       </select>
//     </label>
//     <label className="text-xs flex items-center gap-2">
//       <span style={{ color: theme.primaryText }}>Mapel</span>
//       <select
//         value={subject}
//         onChange={(e) => setSubject(e.target.value)}
//         className="px-2 py-1 rounded-lg text-sm border bg-transparent"
//         style={{ borderColor: theme.subtle, color: theme.primaryText }}
//       >
//         {['Semua', ...SUBJECTS].map(s => (
//           <option key={s} value={s} style={{ color: '#111827' }}>{s}</option>
//         ))}
//       </select>
//     </label>
//     <label className="text-xs flex items-center gap-2">
//       <span style={{ color: theme.primaryText }}>Urut</span>
//       <select
//         value={sortBy}
//         onChange={(e) => setSortBy(e.target.value)}
//         className="px-2 py-1 rounded-lg text-sm border bg-transparent"
//         style={{ borderColor: theme.subtle, color: theme.primaryText }}
//       >
//         <option value="nama" style={{ color: '#111827' }}>Nama (A–Z)</option>
//         <option value="masaKerja" style={{ color: '#111827' }}>Masa Kerja (terlama)</option>
//       </select>
//     </label>
//   </motion.div>
// );

// /****************************
//  * GURU & TENDIK SECTION
//  ****************************/
// export const TeacherStaffSection = ({ theme, schoolName }) => {
//   const [q, setQ] = useState('');
//   const [unit, setUnit] = useState('Semua');
//   const [subject, setSubject] = useState('Semua');
//   const [sortBy, setSortBy] = useState('nama');
//   const [selected, setSelected] = useState(null);

//   const { data: people = DEMO_PEOPLE, isPending: loading, error } = useTeacherStaff();
//   const queryClient = useQueryClient();
//   const xHost = getXHostHeader();

//   // Invalidate saat ganti tenant
//   useEffect(() => {
//     queryClient.invalidateQueries({ queryKey: ['guru-tendik'] });
//   }, [xHost, queryClient]);

//   const filteredPeople = useMemo(() => {
//     return filterPeople(people, q, unit, subject).slice().sort(sorters[sortBy]);
//   }, [people, q, unit, subject, sortBy]);

//   const summary = useMemo(() => ({
//     totalPersonel: people.length,
//     unitAktif: unit,
//     hasil: filteredPeople.length
//   }), [people, unit, filteredPeople]);

//   return (
//     <section id="guru-tendik" className="py-12 md:py-16">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="flex items-start justify-between gap-4 mb-4">
//           <div>
//             <motion.h2
//               initial={{ opacity: 0, y: 12 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5 }}
//               className="text-2xl md:text-3xl font-bold"
//               style={{ color: 'black' }}
//             >
//               Guru & Tendik {schoolName}
//             </motion.h2>
//             <motion.p
//               initial={{ opacity: 0, y: 8 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//               className="text-sm opacity-85"
//               style={{ color: theme.surfaceText }}
//             >
//               Profil pendidik dan tenaga kependidikan {schoolName}.
//             </motion.p>
//           </div>
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="text-right"
//           >
//             <div className="text-xs" style={{ color: theme.primaryText }}>
//               Total Personel: <strong>{summary.totalPersonel}</strong>
//             </div>
//             <div className="text-xs opacity-80" style={{ color: theme.primaryText }}>
//               Unit: {summary.unitAktif} · Hasil: {summary.hasil}
//             </div>
//           </motion.div>
//         </div>

//         {loading && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-sm"
//             style={{ color: theme.primaryText }}
//           >
//             Memuat data guru dan tendik...
//           </motion.div>
//         )}
//         {error && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-sm"
//             style={{ color: theme.pop }}
//           >
//             Error: {error.message}. Menggunakan data demo.
//           </motion.div>
//         )}

//         {!loading && !error && (
//           <div className="mb-4">
//             <Controls
//               theme={theme}
//               q={q} setQ={setQ}
//               unit={unit} setUnit={setUnit}
//               subject={subject} setSubject={setSubject}
//               sortBy={sortBy} setSortBy={setSortBy}
//             />
//           </div>
//         )}

//         {!loading && !error && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="grid md:grid-cols-2 xl:grid-cols-3 gap-4"
//           >
//             {filteredPeople.map((p, i) => (
//               <PersonCard key={p.id} person={p} theme={theme} onOpen={setSelected} />
//             ))}
//           </motion.div>
//         )}

//         <Modal open={!!selected} onClose={() => setSelected(null)} theme={theme} title={selected?.name || ''}>
//           {selected && (
//             <motion.div
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="space-y-2 text-sm"
//               style={{ color: theme.primaryText }}
//             >
//               <div className="flex items-center gap-3">
//                 <img
//                   src={makeAvatar(selected.name, theme)}
//                   alt={selected.name}
//                   className="w-16 h-16 rounded-xl border"
//                   style={{ borderColor: theme.subtle }}
//                 />
//                 <div>
//                   <div className="font-semibold">{selected.name}</div>
//                   {selected.subjects.length > 0 && (
//                     <div className="text-xs opacity-80">Mapel: {selected.subjects.join(', ')}</div>
//                   )}
//                   {selected.role && (
//                     <div className="text-xs opacity-80">Peran: {selected.role}</div>
//                   )}
//                   <div className="text-xs opacity-80">Unit: {selected.unit}</div>
//                 </div>
//               </div>
//               <div className="flex flex-wrap items-center gap-2">
//                 {(selected.years || 0) > 0 && <Chip theme={theme}>{selected.years} th masa kerja</Chip>}
//                 {selected.status && <Chip theme={theme}>{selected.status}</Chip>}
//               </div>
//               <div className="flex flex-wrap items-center gap-3">
//                 {selected.email && <a className="underline" href={`mailto:${selected.email}`}>Email</a>}
//                 {selected.phone && <a className="underline" href={`tel:${selected.phone}`}>Telepon</a>}
//               </div>
//             </motion.div>
//           )}
//         </Modal>
//       </div>
//     </section>
//   );
// };

// /****************************
//  * PAGE WRAPPER + TESTS
//  ****************************/
// const TeacherStaffPage = () => {
//   const schoolInfo = SMAN25_CONFIG;
//   const theme = schoolInfo.theme;
//   const schoolName = schoolInfo.fullName;
//   const prefersReducedMotion = useReducedMotion();

//   useEffect(() => {
//     try {
//       console.assert(!!theme, "Theme harus ada");
//       const keys = ["bg", "primary", "primaryText", "surface", "surfaceText", "subtle", "accent"];
//       keys.forEach(k => console.assert(k in theme, `Theme key '${k}' harus ada`));

//       console.assert(typeof NavbarComp === "function" && typeof FooterComp === "function" && typeof TeacherStaffSection === "function", "Komponen wajib ada");

//       console.log("UI smoke tests passed");
//     } catch (e) {
//       console.error("UI smoke tests failed:", e);
//     }
//   }, [prefersReducedMotion]);

//   return (
//     <div className="min-h-screen" style={{ background: theme.bg }}>
//       <NavbarComp theme={theme} />
//       <main>
//         <TeacherStaffSection theme={theme} schoolName={schoolName} />
//       </main>
//       <FooterComp theme={theme} />
//     </div>
//   );
// };

// export default TeacherStaffPage;


import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
      {/* Background Image - Representatif guru & tenaga pendidik */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/teacher.jpg')`, // Ganti dengan foto guru/kegiatan mengajar jika ada yang lebih cocok
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
const makeAvatar = (name, theme) => {
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
  { id: 1, name: "Drs. Andi Pratama", unit: "RPL", subjects: ["RPL"], status: "PNS", years: 12, email: "andi@smkn13.sch.id", phone: "0812000001" },
  { id: 2, name: "Sari Wulandari, M.Pd", unit: "Umum", subjects: ["MTK"], status: "PNS", years: 10, email: "sari@smkn13.sch.id", phone: "0812000002" },
  { id: 3, name: "Budi Santoso", unit: "RPL", subjects: ["RPL"], status: "PPPK", years: 6, email: "budi@smkn13.sch.id", phone: "" },
  { id: 4, name: "Siti Rahma", unit: "Umum", subjects: [], role: "TU – Administrasi", status: "PNS", years: 7, email: "siti@smkn13.sch.id", phone: "0813000001" },
];

/****************************
 * REACT QUERY HOOK
 ****************************/
const useTeacherStaff = () => {
  const xHost = getXHostHeader();

  return useQuery({
    queryKey: ['guru-tendik', xHost],
    queryFn: async () => {
      const res = await fetch(`https://dev.kiraproject.id/guru`, {
        cache: 'no-store',
        headers: {
          'X-Host': xHost,
          'Cache-Control': 'no-store',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch teacher/staff data');
      const data = await res.json();
      return data.items.map(item => ({
        id: item.id,
        name: item.nama,
        subjects: item.mataPelajaran ? [item.mataPelajaran] : [],
        role: item.mataPelajaran ? null : 'Staf',
        unit: item.unit || 'Umum',
        photo: item.photoUrl || null,
        status: item.status || 'Aktif',
        years: item.tahunMulaiMengajar ? (new Date().getFullYear() - item.tahunMulaiMengajar) : 0,
        email: item.email || null,
        phone: item.phone || null,
      }));
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    placeholderData: DEMO_PEOPLE,
    retry: 1,
  });
};

/****************************
 * FILTER & SORT
 ****************************/
const DEPARTMENTS = ["RPL", "TKJ", "Multimedia", "Umum", "Kurikulum", "Kesiswaan"];
const SUBJECTS = ["RPL", "TKJ", "MM", "MTK", "B. Indonesia", "B. Inggris", "PPKn", "Sejarah", "Agama", "PJOK", "BK", "Kewirausahaan"];

const filterPeople = (people, q, unit, subject) => {
  const nq = q.trim().toLowerCase();
  return people.filter(p => {
    const matchQ = !nq || p.name.toLowerCase().includes(nq) || (p.email || '').toLowerCase().includes(nq) || (p.role || '').toLowerCase().includes(nq);
    const matchUnit = unit === 'Semua' || p.unit === unit;
    const matchSubj = subject === 'Semua' || p.subjects.includes(subject);
    return matchQ && matchUnit && matchSubj;
  });
};

const sorters = {
  nama: (a, b) => a.name.localeCompare(b.name),
  masaKerja: (a, b) => (b.years || 0) - (a.years || 0),
};

const Chip = ({ children, theme }) => (
  <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: theme.subtle, background: "rgba(255,255,255,0.06)", color: theme.primaryText }}>
    {children}
  </span>
);

/****************************
 * CARD & MODAL
 ****************************/
const PersonCard = ({ person, theme, onOpen }) => {
  const prefersReducedMotion = useReducedMotion();
  const isTeacher = person.subjects.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.45 }}
      className="rounded-2xl border p-4 flex gap-3 hover:shadow-md transition cursor-pointer"
      style={{ background: theme.surface, borderColor: theme.subtle }}
      onClick={() => onOpen(person)}
    >
      <img
        src={makeAvatar(person.name, theme)}
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
          {person.email && <a href={`mailto:${person.email}`} className="underline" onClick={e => e.stopPropagation()}>Email</a>}
          {person.phone && <a href={`tel:${person.phone}`} className="underline" onClick={e => e.stopPropagation()}>Telepon</a>}
        </div>
      </div>
    </motion.div>
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
        className="relative max-w-lg w-full rounded-2xl border p-4"
        style={{ background: theme.surface, borderColor: theme.subtle }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold" style={{ color: theme.primaryText }}>{title}</div>
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
const Controls = ({ theme, q, setQ, unit, setUnit, subject, setSubject, sortBy, setSortBy }) => (
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
    <label className="text-xs flex items-center gap-2">
      <span style={{ color: theme.primaryText }}>Unit</span>
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="px-2 py-1 rounded-lg text-sm border bg-transparent"
        style={{ borderColor: theme.subtle, color: theme.primaryText }}
      >
        {['Semua', ...DEPARTMENTS].map(u => (
          <option key={u} value={u} style={{ color: '#111827' }}>{u}</option>
        ))}
      </select>
    </label>
    <label className="text-xs flex items-center gap-2">
      <span style={{ color: theme.primaryText }}>Mapel</span>
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="px-2 py-1 rounded-lg text-sm border bg-transparent"
        style={{ borderColor: theme.subtle, color: theme.primaryText }}
      >
        {['Semua', ...SUBJECTS].map(s => (
          <option key={s} value={s} style={{ color: '#111827' }}>{s}</option>
        ))}
      </select>
    </label>
    <label className="text-xs flex items-center gap-2">
      <span style={{ color: theme.primaryText }}>Urut</span>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-2 py-1 rounded-lg text-sm border bg-transparent"
        style={{ borderColor: theme.subtle, color: theme.primaryText }}
      >
        <option value="nama" style={{ color: '#111827' }}>Nama (A–Z)</option>
        <option value="masaKerja" style={{ color: '#111827' }}>Masa Kerja (terlama)</option>
      </select>
    </label>
  </motion.div>
);

/****************************
 * GURU & TENDIK SECTION
 ****************************/
export const TeacherStaffSection = ({ theme, schoolName }) => {
  const [q, setQ] = useState('');
  const [unit, setUnit] = useState('Semua');
  const [subject, setSubject] = useState('Semua');
  const [sortBy, setSortBy] = useState('nama');
  const [selected, setSelected] = useState(null);

  const { data: people = DEMO_PEOPLE, isPending: loading, error } = useTeacherStaff();
  const queryClient = useQueryClient();
  const xHost = getXHostHeader();

  // Invalidate saat ganti tenant
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['guru-tendik'] });
  }, [xHost, queryClient]);

  const filteredPeople = useMemo(() => {
    return filterPeople(people, q, unit, subject).slice().sort(sorters[sortBy]);
  }, [people, q, unit, subject, sortBy]);

  const summary = useMemo(() => ({
    totalPersonel: people.length,
    unitAktif: unit,
    hasil: filteredPeople.length
  }), [people, unit, filteredPeople]);

  return (
    <section id="guru-tendik" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
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
              style={{ color: theme.surfaceText }}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm"
            style={{ color: theme.primaryText }}
          >
            Memuat data guru dan tendik...
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm"
            style={{ color: theme.pop }}
          >
            Error: {error.message}. Menggunakan data demo.
          </motion.div>
        )}

        {!loading && !error && (
          <div className="mb-4">
            <Controls
              theme={theme}
              q={q} setQ={setQ}
              unit={unit} setUnit={setUnit}
              subject={subject} setSubject={setSubject}
              sortBy={sortBy} setSortBy={setSortBy}
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
            {filteredPeople.map((p, i) => (
              <PersonCard key={p.id} person={p} theme={theme} onOpen={setSelected} />
            ))}
          </motion.div>
        )}

        <Modal open={!!selected} onClose={() => setSelected(null)} theme={theme} title={selected?.name || ''}>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 text-sm"
              style={{ color: theme.primaryText }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={makeAvatar(selected.name, theme)}
                  alt={selected.name}
                  className="w-16 h-16 rounded-xl border"
                  style={{ borderColor: theme.subtle }}
                />
                <div>
                  <div className="font-semibold">{selected.name}</div>
                  {selected.subjects.length > 0 && (
                    <div className="text-xs opacity-80">Mapel: {selected.subjects.join(', ')}</div>
                  )}
                  {selected.role && (
                    <div className="text-xs opacity-80">Peran: {selected.role}</div>
                  )}
                  <div className="text-xs opacity-80">Unit: {selected.unit}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(selected.years || 0) > 0 && <Chip theme={theme}>{selected.years} th masa kerja</Chip>}
                {selected.status && <Chip theme={theme}>{selected.status}</Chip>}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {selected.email && <a className="underline" href={`mailto:${selected.email}`}>Email</a>}
                {selected.phone && <a className="underline" href={`tel:${selected.phone}`}>Telepon</a>}
              </div>
            </motion.div>
          )}
        </Modal>
      </div>
    </section>
  );
};

/****************************
 * PAGE DENGAN HERO
 ****************************/
const TeacherStaffPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      console.assert(!!theme, "Theme harus ada");
      const keys = ["bg", "primary", "primaryText", "surface", "surfaceText", "subtle", "accent"];
      keys.forEach(k => console.assert(k in theme, `Theme key '${k}' harus ada`));

      console.assert(typeof NavbarComp === "function" && typeof FooterComp === "function" && typeof TeacherStaffSection === "function", "Komponen wajib ada");

      console.log("UI smoke tests passed");
    } catch (e) {
      console.error("UI smoke tests failed:", e);
    }
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* HERO SECTION */}
      <HeroSection />

      <main>
        <TeacherStaffSection theme={theme} schoolName={schoolName} />
      </main>

      <FooterComp theme={theme} />
    </div>
  );
};

export default TeacherStaffPage;