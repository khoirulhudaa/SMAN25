// import { SMAN25_CONFIG } from "@/core/theme";
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { motion, useReducedMotion } from "framer-motion";
// import { useEffect, useRef, useState } from "react";

// /****************************
//  * HELPERS (validation)
//  ****************************/
// function validateForm(f: { nama: string; kelas: string; kontak: string; alasan: string }) {
//   if (!f.nama.trim()) return "Nama wajib diisi";
//   if (!f.kelas.trim()) return "Kelas wajib diisi";
//   if (!f.kontak.trim()) return "Kontak wajib diisi";
//   return null;
// }

// /****************************
//  * OSIS PAGE
//  ****************************/
// const OsisPage = () => {
//   const schoolInfo = SMAN25_CONFIG;
//   const theme = schoolInfo.theme;
//   const schoolName = schoolInfo.fullName;
//   const prefersReducedMotion = useReducedMotion();

//   // Focus refs
//   const closeBtnRef = useRef<HTMLButtonElement>(null);
//   const formCloseBtnRef = useRef<HTMLButtonElement>(null);

//   // === FORM MINAT ===
//   const [formOpen, setFormOpen] = useState(false);
//   const [form, setForm] = useState({ nama: "", kelas: "", kontak: "", alasan: "" });
//   const [formMsg, setFormMsg] = useState("");
//   const openForm = () => {
//     setFormOpen(true);
//     setTimeout(() => formCloseBtnRef.current?.focus(), 0);
//   };
//   const closeForm = () => {
//     setFormOpen(false);
//     setFormMsg("");
//   };
//   const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
//     setForm({ ...form, [e.target.name]: e.target.value });
//   const onSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const err = validateForm(form);
//     if (err) {
//       setFormMsg(err);
//       return;
//     }
//     try {
//       const existing = JSON.parse(localStorage.getItem("osis_minat") || "[]");
//       existing.push({ ...form, ts: new Date().toISOString() });
//       localStorage.setItem("osis_minat", JSON.stringify(existing));
//       setFormMsg("Terima kasih! Form terkirim. Kami akan menghubungi kamu.");
//       setForm({ nama: "", kelas: "", kontak: "", alasan: "" });
//     } catch {
//       setFormMsg("Maaf, terjadi masalah saat menyimpan. Coba lagi.");
//     }
//   };

//   // === API Integration ===
//   const [apiData, setApiData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = async () => {
//     try {
//       const response = await fetch('https://dev.kiraproject.id/osis/organization/current', {
//         cache: 'no-store',
//         headers: {
//           'X-Host': getXHostHeader(),
//           'Cache-Control': 'no-store',
//         }
//       });
//       const result = await response.json();
//       if (result.success) {
//         setApiData(result.data);
//       } else {
//         throw new Error('API request failed');
//       }
//     } catch (err) {
//       console.warn('err', err);
//       setError('Gagal memuat data OSIS. Silakan coba lagi nanti.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Transform API data
//   const struktur = apiData?.members?.map((member: any) => ({
//     jabatan: member.position.replace('_', ' '),
//     nama: member.name,
//     kelas: member.kelasText,
//     motto: member.quote || 'Belum ada motto',
//     foto: member.photoUrl || '/defaultProfile.png'
//   })) || [];

//   // === TENURES & HISTORY ===
//   const [tenures, setTenures] = useState<any[]>([]);
//   const [membersByTenure, setMembersByTenure] = useState<Record<string, any[]>>({});

//   useEffect(() => {
//     const fetchTenuresAndMembers = async () => {
//       try {
//         const tenureResponse = await fetch('https://dev.kiraproject.id/osis/tenures', {
//           cache: 'no-store',
//           headers: { 'X-Host': getXHostHeader(), 'Cache-Control': 'no-store' }
//         });
//         const tenureResult = await tenureResponse.json();
//         if (!tenureResult.success) throw new Error('Failed to fetch tenures');

//         const fetchedTenures = tenureResult.data;
//         setTenures(fetchedTenures);

//         const membersData: Record<string, any[]> = {};
//         for (const tenure of fetchedTenures) {
//           const membersResponse = await fetch(`https://dev.kiraproject.id/osis/tenures/${tenure.id}/members`, {
//             cache: 'no-store',
//             headers: { 'X-Host': getXHostHeader(), 'Cache-Control': 'no-store' }
//           });
//           const membersResult = await membersResponse.json();
//           membersData[tenure.id] = membersResult.success
//             ? membersResult.data.map((member: any) => ({
//                 jabatan: member.position.replace('_', ' '),
//                 nama: member.name,
//                 kelas: member.kelasText,
//                 motto: member.quote || 'Belum ada motto',
//                 foto: member.photoUrl || '/defaultProfile.png'
//               }))
//             : [];
//         }
//         setMembersByTenure(membersData);
//       } catch (err) {
//         setError('Gagal memuat data kepengurusan OSIS.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTenuresAndMembers();
//   }, []);

//   const HISTORY = tenures.map(tenure => ({
//     tahun: new Date(tenure.startDate).getFullYear(),
//     status: tenure.isActive ? 'Berjalan' : 'Selesai',
//     periode: tenure.periodLabel,
//     pengurus: membersByTenure[tenure.id] || []
//   }));

//   const [selectedYear, setSelectedYear] = useState(HISTORY[0]?.tahun || new Date().getFullYear());
//   const years = HISTORY.map(h => h.tahun);
//   const current = HISTORY.find(h => h.tahun === selectedYear) || HISTORY[0];

//   // === LIGHTBOX ===
//   const galeri = [
//     { src: "/defaultProfile.png", thumb: "/example.jpg", alt: "Kegiatan LDKS" },
//     { src: "/defaultProfile.png", thumb: "/example.jpg", alt: "Pentas Seni" },
//     { src: "/defaultProfile.png", thumb: "/example.jpg", alt: "Lomba Olahraga" },
//   ];
//   const [lbOpen, setLbOpen] = useState(false);
//   const [idx, setIdx] = useState(0);
//   const startX = useRef(0);
//   const onOpen = (i: number) => { setIdx(i); setLbOpen(true); };
//   const onClose = () => setLbOpen(false);
//   const prev = () => setIdx((i) => (i - 1 + galeri.length) % galeri.length);
//   const next = () => setIdx((i) => (i + 1) % galeri.length);

//   // Keyboard navigation
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (lbOpen) {
//         if (e.key === "Escape") onClose();
//         if (e.key === "ArrowLeft") prev();
//         if (e.key === "ArrowRight") next();
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     if (lbOpen && closeBtnRef.current) closeBtnRef.current.focus();
//     return () => window.removeEventListener("keydown", onKey);
//   }, [lbOpen]);

//   /****************************
//    * SMOKE TESTS
//    ****************************/
//   useEffect(() => {
//     try {
//       const keys = ["bg", "primary", "primaryText", "surface", "surfaceText", "subtle", "accent"];
//       keys.forEach(k => console.assert(theme[k], `Theme key '${k}' missing`));
//       console.log("UI smoke tests passed (OSIS)");
//     } catch (e) {
//       console.error("UI smoke tests failed:", e);
//     }
//   }, [theme, HISTORY]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
//         <p style={{ color: theme.primaryText }}>Memuat data OSIS...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen" style={{ background: theme.bg }}>
//       <NavbarComp theme={theme} />
//       <a
//         href="#osis"
//         className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:px-3 focus:py-1 focus:rounded"
//       >
//         Lompat ke konten OSIS
//       </a>

//       <section id="osis" className="py-16 text-[15px] md:text-[17px] leading-relaxed">
//         <div className="max-w-5xl mx-auto px-4 text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: 12 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4"
//             style={{ color: 'black' }}
//           >
//             OSIS {schoolName}
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: 8 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="text-sm md:text-base mb-10 opacity-90"
//             style={{ color: theme.surfaceText }}
//           >
//             Organisasi Siswa Intra Sekolah (OSIS) sebagai wadah pengembangan diri, kepemimpinan, dan kreativitas siswa.
//           </motion.p>

//           {/* Struktur Aktif */}
//           <motion.h3
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="text-2xl md:text-[26px] font-bold mb-2"
//             style={{ color: theme.primaryText }}
//           >
//             Struktur Organisasi — {HISTORY.find(h => h.status === 'Berjalan')?.periode || "Tahun Berjalan"}
//           </motion.h3>
//           <p className="text-xs md:text-[13px] mb-6 opacity-85" style={{ color: theme.surfaceText }}>
//             Periode aktif saat ini.
//           </p>
//           <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-12">
//             {HISTORY.find(h => h.status === 'Berjalan')?.pengurus.map((s, i) => (
//               <motion.div
//                 key={s.jabatan}
//                 initial={{ opacity: 0, y: 16 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4, delay: i * 0.05 }}
//                 whileHover={{ scale: prefersReducedMotion ? 1 : 1.03 }}
//                 className="relative rounded-2xl border p-5 shadow-md flex flex-col items-center group focus-within:ring-2 focus-within:ring-yellow-300"
//                 style={{ background: theme.surface, borderColor: theme.subtle }}
//                 tabIndex={0}
//                 aria-label={`${s.jabatan} ${s.nama}`}
//               >
//                 <img
//                   src={s.foto}
//                   alt={`Foto ${s.nama}`}
//                   className="w-20 h-20 rounded-full object-cover border mb-3"
//                   style={{ borderColor: theme.subtle }}
//                 />
//                 <h4 className="text-sm font-semibold" style={{ color: 'black' }}>
//                   {s.jabatan}
//                 </h4>
//                 <p className="text-base" style={{ color: theme.primaryText }}>
//                   {s.nama}
//                 </p>
//                 <div className="text-xs opacity-85 mt-1" style={{ color: theme.surfaceText }}>
//                   Kelas: {s.kelas}
//                 </div>
//                 <div className="text-xs italic opacity-75" style={{ color: theme.surfaceText }}>
//                   "{s.motto}"
//                 </div>
//                 <div className="absolute bottom-full mb-2 hidden group-hover:block group-focus:block bg-black/90 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
//                   {s.kelas} · "{s.motto}"
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Riwayat */}
//           <motion.h3
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="text-2xl md:text-[26px] font-bold mb-3"
//             style={{ color: theme.primaryText }}
//           >
//             Riwayat Kepengurusan OSIS
//           </motion.h3>
//           <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
//             {years.map((y, i) => (
//               <motion.button
//                 key={y}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.3, delay: i * 0.05 }}
//                 onClick={() => setSelectedYear(y)}
//                 className="px-3 py-1.5 rounded-full border text-sm focus:ring-2 focus:ring-yellow-300"
//                 aria-pressed={selectedYear === y}
//                 style={{
//                   borderColor: theme.subtle,
//                   background: selectedYear === y ? 'black' : "transparent",
//                   color: selectedYear === y ? "#111827" : theme.primaryText,
//                 }}
//               >
//                 {y}
//               </motion.button>
//             ))}
//           </div>
//           <motion.div
//             key={selectedYear}
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-10"
//           >
//             <div className="text-sm mb-4 opacity-85" style={{ color: theme.surfaceText }}>
//               Periode {current?.periode} — <span className="italic">{current?.status}</span>
//             </div>
//             <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
//               {current?.pengurus.map((p, i) => (
//                 <motion.div
//                   key={`${current.tahun}-${p.jabatan}`}
//                   initial={{ opacity: 0, y: 8 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: i * 0.03 }}
//                   className="relative rounded-2xl border p-5 flex flex-col items-center group focus-within:ring-2 focus-within:ring-yellow-300"
//                   style={{ background: theme.surface, borderColor: theme.subtle }}
//                   tabIndex={0}
//                 >
//                   <img
//                     src={p.foto}
//                     alt={`Foto ${p.nama}`}
//                     className="w-16 h-16 rounded-full object-cover border mb-2"
//                     style={{ borderColor: theme.subtle }}
//                   />
//                   <div className="text-xs font-semibold" style={{ color: 'black' }}>
//                     {p.jabatan}
//                   </div>
//                   <div className="text-sm" style={{ color: theme.primaryText }}>
//                     {p.nama}
//                   </div>
//                   {p.kelas && (
//                     <div className="text-[11px] opacity-85" style={{ color: theme.surfaceText }}>
//                       Kelas: {p.kelas}
//                     </div>
//                   )}
//                   {p.motto && (
//                     <div className="text-[11px] italic opacity-75" style={{ color: theme.surfaceText }}>
//                       "{p.motto}"
//                     </div>
//                   )}
//                   {p.kelas && (
//                     <div className="absolute bottom-full mb-2 hidden group-hover:block group-focus:block bg-black/90 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
//                       {p.kelas} · "{p.motto}"
//                     </div>
//                   )}
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Visi & Misi */}
//           <motion.h3
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="text-2xl md:text-[26px] font-bold mb-3"
//             style={{ color: theme.primaryText }}
//           >
//             Visi & Misi OSIS
//           </motion.h3>
//           <div className="grid gap-4 md:grid-cols-2 text-left mb-12">
//             <motion.div
//               initial={{ opacity: 0, x: -16 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className="rounded-2xl border p-5"
//               style={{ background: theme.surface, borderColor: theme.subtle }}
//             >
//               <h4 className="font-semibold mb-2" style={{ color: 'black' }}>Visi</h4>
//               <p className="opacity-90" style={{ color: theme.primaryText }}>
//                 {apiData?.visionMissions?.[0]?.visi || '-'}
//               </p>
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0, x: 16 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className="rounded-2xl border p-5"
//               style={{ background: theme.surface, borderColor: theme.subtle }}
//             >
//               <h4 className="font-semibold mb-2" style={{ color: 'black' }}>Misi</h4>
//               <ul className="list-disc list-inside space-y-1" style={{ color: theme.primaryText }}>
//                 {apiData?.visionMissions?.[0]?.misi?.map((m: string, i: number) => (
//                   <li key={i}>{m}</li>
//                 )) || <li>-</li>}
//               </ul>
//             </motion.div>
//           </div>

//           {/* Prestasi */}
//           <motion.h3
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="text-2xl md:text-[26px] font-bold mb-4"
//             style={{ color: theme.primaryText }}
//           >
//             Prestasi
//           </motion.h3>
//           <div className={`w-full grid ${apiData?.achievements ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4 mb-12 text-left`}>
//             {apiData?.achievements?.map((p: any, i: number) => (
//               <motion.div
//                 key={p.id}
//                 initial={{ opacity: 0, y: 8 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.3, delay: i * 0.05 }}
//                 whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
//                 className="rounded-2xl border p-5"
//                 style={{ background: theme.surface, borderColor: theme.subtle }}
//               >
//                 <p className="text-sm md:text-[15px] font-semibold" style={{ color: theme.primaryText }}>
//                   {p.judulPrestasi}
//                 </p>
//                 <p className="text-xs opacity-85" style={{ color: theme.surfaceText }}>
//                   {p.tahun} - {p.deskripsi}
//                 </p>
//               </motion.div>
//             )) || (
//               <p className="text-sm opacity-90 mt-4 text-center w-full" style={{ color: theme.surfaceText }}>
//                 Belum ada prestasi yang tercatat.
//               </p>
//             )}
//           </div>

//           {/* Tombol Form Minat */}
//           <motion.button
//             initial={{ opacity: 0, y: 12 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             onClick={openForm}
//             className="px-6 py-3 rounded-xl font-medium text-sm"
//             style={{ background: 'black', color: "#111827" }}
//           >
//             Bergabung dengan OSIS
//           </motion.button>
//         </div>
//       </section>

//       {/* FORM MINAT */}
//       {formOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 z-[70] flex items-center justify-center p-4"
//           style={{ background: "rgba(0,0,0,0.65)" }}
//           role="dialog"
//           aria-modal="true"
//           aria-label="Form Minat Bergabung OSIS"
//         >
//           <div className="absolute inset-0" onClick={closeForm} />
//           <motion.div
//             initial={{ scale: 0.9, y: 20 }}
//             animate={{ scale: 1, y: 0 }}
//             className="relative max-w-lg w-full bg-white text-black rounded-2xl shadow-2xl border p-5"
//           >
//             <div className="flex items-center justify-between mb-2">
//               <h4 className="text-lg font-semibold">Form Minat Bergabung OSIS</h4>
//               <button
//                 ref={formCloseBtnRef}
//                 onClick={closeForm}
//                 aria-label="Tutup formulir"
//                 className="px-2 py-1 rounded-lg border text-xs"
//               >
//                 Tutup [x]
//               </button>
//             </div>
//             <p className="text-xs text-gray-600 mb-3">
//               Data ini hanya untuk keperluan rekrutmen OSIS. Wajib isi kolom bertanda *.
//             </p>
//             <form onSubmit={onSubmit} className="space-y-3">
//               <label className="block">
//                 <span className="text-sm font-medium">Nama Lengkap *</span>
//                 <input name="nama" value={form.nama} onChange={onChange} required className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Nama kamu" />
//               </label>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 <label className="block">
//                   <span className="text-sm font-medium">Kelas *</span>
//                   <input name="kelas" value={form.kelas} onChange={onChange} required className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Contoh: XI RPL" />
//                 </label>
//                 <label className="block">
//                   <span className="text-sm font-medium">Kontak (WA/Email) *</span>
//                   <input name="kontak" value={form.kontak} onChange={onChange} required className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="08xxx atau email" />
//                 </label>
//               </div>
//               <label className="block">
//                 <span className="text-sm font-medium">Alasan Bergabung</span>
//                 <textarea name="alasan" value={form.alasan} onChange={onChange} rows={3} className="mt-1 w-full border rounded-lg px-3 py-2" placeholder="Ceritakan singkat motivasimu" />
//               </label>
//               {formMsg && (
//                 <div className="text-sm p-2 rounded bg-green-50 border border-green-200 text-green-700">{formMsg}</div>
//               )}
//               <div className="flex items-center justify-end gap-2 pt-1">
//                 <button type="button" onClick={closeForm} className="px-4 py-2 rounded-xl border text-sm">Batal</button>
//                 <button type="submit" className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'black', color: "#111827" }}>
//                   Kirim
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* LIGHTBOX */}
//       {lbOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 z-[60] flex items-center justify-center"
//           style={{ background: "rgba(0,0,0,0.85)" }}
//           role="dialog"
//           aria-modal="true"
//           aria-label="Galeri OSIS"
//         >
//           <button
//             ref={closeBtnRef}
//             aria-label="Tutup galeri"
//             onClick={onClose}
//             className="absolute top-4 right-4 px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-yellow-300"
//             style={{ borderColor: theme.subtle, color: "#fff", background: "rgba(0,0,0,0.2)" }}
//           >
//             Tutup [x]
//           </button>

//           <div
//             className="h-full flex items-center justify-center select-none"
//             onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
//             onTouchEnd={(e) => {
//               const dx = e.changedTouches[0].clientX - startX.current;
//               if (dx > 40) prev();
//               if (dx < -40) next();
//             }}
//           >
//             <button onClick={prev} aria-label="Foto sebelumnya" className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-yellow-300" style={{ borderColor: theme.subtle, color: "#fff" }}>‹</button>
//             <img src={galeri[idx].src} alt={galeri[idx].alt} className="max-h-[80vh] max-w-[92vw] object-contain rounded-xl border" style={{ borderColor: theme.subtle }} />
//             <button onClick={next} aria-label="Foto berikutnya" className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-yellow-300" style={{ borderColor: theme.subtle, color: "#fff" }}>›</button>
//             <div className="absolute bottom-6 left-0 right-0 text-center text-xs" aria-live="polite">
//               <span style={{ color: "#fff" }}>{idx + 1} / {galeri.length} — {galeri[idx].alt}</span>
//             </div>
//           </div>
//         </motion.div>
//       )}

//       <FooterComp theme={theme} />
//     </div>
//   );
// };

// export default OsisPage;




import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/****************************
 * HERO SECTION (Modern & Soft dengan Foto Gedung Sekolah)
 ****************************/
const HeroSection = () => {
  const scrollToBerita = () => {
    document.getElementById("berita")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center overflow-hidden">
      {/* Background Image - Gedung SMAN 25 Jakarta (foto resmi dari sumber terpercaya) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')`,        }}
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Organisasi OSIS SMAN 25 Jakarta
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed"
        >
          Wadah kepemimpinan, kreativitas, dan pengabdian siswa untuk membangun sekolah yang lebih baik.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={scrollToBerita}
          className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition shadow-lg"
        >
          Lihat OSIS
        </motion.button>
      </div>
    </section>
  );
};

/****************************
 * HELPERS (validation)
 ****************************/
function validateForm(f: { nama: string; kelas: string; kontak: string; alasan: string }) {
  if (!f.nama.trim()) return "Nama wajib diisi";
  if (!f.kelas.trim()) return "Kelas wajib diisi";
  if (!f.kontak.trim()) return "Kontak wajib diisi";
  return null;
}

/****************************
 * OSIS PAGE (Full Code dengan Hero Modern)
 ****************************/
const OsisPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;
  const prefersReducedMotion = useReducedMotion();

  // Focus refs
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const formCloseBtnRef = useRef<HTMLButtonElement>(null);

  // === FORM MINAT ===
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ nama: "", kelas: "", kontak: "", alasan: "" });
  const [formMsg, setFormMsg] = useState("");
  const openForm = () => {
    setFormOpen(true);
    setTimeout(() => formCloseBtnRef.current?.focus(), 0);
  };
  const closeForm = () => {
    setFormOpen(false);
    setFormMsg("");
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm(form);
    if (err) {
      setFormMsg(err);
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem("osis_minat") || "[]");
      existing.push({ ...form, ts: new Date().toISOString() });
      localStorage.setItem("osis_minat", JSON.stringify(existing));
      setFormMsg("Terima kasih! Form terkirim. Kami akan menghubungi kamu.");
      setForm({ nama: "", kelas: "", kontak: "", alasan: "" });
    } catch {
      setFormMsg("Maaf, terjadi masalah saat menyimpan. Coba lagi.");
    }
  };

  // === API Integration ===
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://dev.kiraproject.id/osis/organization/current', {
        cache: 'no-store',
        headers: {
          'X-Host': getXHostHeader(),
          'Cache-Control': 'no-store',
        }
      });
      const result = await response.json();
      if (result.success) {
        setApiData(result.data);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.warn('err', err);
      setError('Gagal memuat data OSIS. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Transform API data
  const struktur = apiData?.members?.map((member: any) => ({
    jabatan: member.position.replace('_', ' '),
    nama: member.name,
    kelas: member.kelasText,
    motto: member.quote || 'Belum ada motto',
    foto: member.photoUrl || '/defaultProfile.png'
  })) || [];

  // === TENURES & HISTORY ===
  const [tenures, setTenures] = useState<any[]>([]);
  const [membersByTenure, setMembersByTenure] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchTenuresAndMembers = async () => {
      try {
        const tenureResponse = await fetch('https://dev.kiraproject.id/osis/tenures', {
          cache: 'no-store',
          headers: { 'X-Host': getXHostHeader(), 'Cache-Control': 'no-store' }
        });
        const tenureResult = await tenureResponse.json();
        if (!tenureResult.success) throw new Error('Failed to fetch tenures');

        const fetchedTenures = tenureResult.data;
        setTenures(fetchedTenures);

        const membersData: Record<string, any[]> = {};
        for (const tenure of fetchedTenures) {
          const membersResponse = await fetch(`https://dev.kiraproject.id/osis/tenures/${tenure.id}/members`, {
            cache: 'no-store',
            headers: { 'X-Host': getXHostHeader(), 'Cache-Control': 'no-store' }
          });
          const membersResult = await membersResponse.json();
          membersData[tenure.id] = membersResult.success
            ? membersResult.data.map((member: any) => ({
                jabatan: member.position.replace('_', ' '),
                nama: member.name,
                kelas: member.kelasText,
                motto: member.quote || 'Belum ada motto',
                foto: member.photoUrl || '/defaultProfile.png'
              }))
            : [];
        }
        setMembersByTenure(membersData);
      } catch (err) {
        setError('Gagal memuat data kepengurusan OSIS.');
      } finally {
        setLoading(false);
      }
    };
    fetchTenuresAndMembers();
  }, []);

  const HISTORY = tenures.map(tenure => ({
    tahun: new Date(tenure.startDate).getFullYear(),
    status: tenure.isActive ? 'Berjalan' : 'Selesai',
    periode: tenure.periodLabel,
    pengurus: membersByTenure[tenure.id] || []
  }));

  const [selectedYear, setSelectedYear] = useState(HISTORY[0]?.tahun || new Date().getFullYear());
  const years = HISTORY.map(h => h.tahun);
  const current = HISTORY.find(h => h.tahun === selectedYear) || HISTORY[0];

  // === LIGHTBOX (Galeri placeholder) ===
  const galeri = [
    { src: "/defaultProfile.png", thumb: "/example.jpg", alt: "Kegiatan LDKS" },
    { src: "/defaultProfile.png", thumb: "/example.jpg", alt: "Pentas Seni" },
    { src: "/defaultProfile.png", thumb: "/example.jpg", alt: "Lomba Olahraga" },
  ];
  const [lbOpen, setLbOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const startX = useRef(0);
  const onClose = () => setLbOpen(false);
  const prev = () => setIdx((i) => (i - 1 + galeri.length) % galeri.length);
  const next = () => setIdx((i) => (i + 1) % galeri.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lbOpen) {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }
    };
    window.addEventListener("keydown", onKey);
    if (lbOpen && closeBtnRef.current) closeBtnRef.current.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [lbOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>
        <p style={{ color: theme.primaryText }}>Memuat data OSIS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* HERO SECTION */}
      <HeroSection />

      {/* KONTEN UTAMA */}
      <section id="osis-content" className="py-20 md:py-32 -mt-20 relative z-10 bg-gradient-to-b from-transparent to-theme-bg/50">
        <div className="max-w-6xl mx-auto px-6">

          {/* Struktur Organisasi Aktif */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: theme.primaryText }}>
              Struktur Organisasi — {HISTORY.find(h => h.status === 'Berjalan')?.periode || "Tahun Berjalan"}
            </h3>
            <p className="text-base opacity-70" style={{ color: theme.surfaceText }}>
              Periode aktif saat ini
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-24">
            {HISTORY.find(h => h.status === 'Berjalan')?.pengurus.map((s, i) => (
              <motion.div
                key={s.jabatan}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: prefersReducedMotion ? 0 : -8, scale: 1.03 }}
                className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20"
                tabIndex={0}
              >
                <div className="p-8 flex flex-col items-center text-center">
                  <div className="w-36 h-36 mb-6 rounded-full overflow-hidden ring-4 ring-theme-accent/30">
                    <img
                      src={s.foto}
                      alt={`Foto ${s.nama}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="text-lg font-semibold" style={{ color: 'black' }}>
                    {s.jabatan}
                  </h4>
                  <p className="text-xl font-medium mt-2" style={{ color: theme.primaryText }}>
                    {s.nama}
                  </p>
                  <p className="text-sm mt-2 opacity-80" style={{ color: theme.surfaceText }}>
                    {s.kelas}
                  </p>
                  <p className="text-sm italic mt-4 opacity-70" style={{ color: theme.surfaceText }}>
                    "{s.motto}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Riwayat Kepengurusan */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: theme.primaryText }}>
              Riwayat Kepengurusan OSIS
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {years.map((y, i) => (
                <motion.button
                  key={y}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedYear(y)}
                  className="px-6 py-3 rounded-full font-medium transition-all hover:scale-105"
                  style={{
                    background: selectedYear === y ? 'black' : theme.surface,
                    color: selectedYear === y ? "#111827" : theme.primaryText,
                    boxShadow: selectedYear === y ? "0 6px 20px rgba(0,0,0,0.15)" : "none",
                  }}
                >
                  {y}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            key={selectedYear}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-24"
          >
            <p className="text-center text-lg mb-10 opacity-80" style={{ color: theme.surfaceText }}>
              Periode {current?.periode} — <span className="font-medium italic">{current?.status}</span>
            </p>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {current?.pengurus.map((p, i) => (
                <motion.div
                  key={`${current.tahun}-${p.jabatan}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: prefersReducedMotion ? 0 : -6 }}
                  className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-white/10 text-center"
                >
                  <img
                    src={p.foto}
                    alt={`Foto ${p.nama}`}
                    className="w-24 h-24 mx-auto rounded-full object-cover mb-4 ring-4 ring-theme-accent/20"
                  />
                  <div className="text-sm font-semibold" style={{ color: 'black' }}>{p.jabatan}</div>
                  <div className="text-lg font-medium mt-1" style={{ color: theme.primaryText }}>{p.nama}</div>
                  {p.kelas && <div className="text-sm mt-2 opacity-70" style={{ color: theme.surfaceText }}>{p.kelas}</div>}
                  {p.motto && <div className="text-sm italic mt-3 opacity-60" style={{ color: theme.surfaceText }}>"{p.motto}"</div>}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visi & Misi */}
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: theme.primaryText }}
          >
            Visi & Misi OSIS
          </motion.h3>
          <div className="grid gap-10 md:grid-cols-2 mb-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white backdrop-blur-md rounded-3xl p-10 shadow-xl border border-white/20"
            >
              <h4 className="text-2xl font-bold mb-6" style={{ color: 'black' }}>Visi</h4>
              <p className="text-lg leading-relaxed opacity-90" style={{ color: theme.primaryText }}>
                {apiData?.visionMissions?.[0]?.visi || '-'}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white backdrop-blur-md rounded-3xl p-10 shadow-xl border border-white/20"
            >
              <h4 className="text-2xl font-bold mb-6" style={{ color: 'black' }}>Misi</h4>
              <ul className="space-y-4 text-lg opacity-90 list-disc list-inside" style={{ color: theme.primaryText }}>
                {apiData?.visionMissions?.[0]?.misi?.map((m: string, i: number) => (
                  <li key={i}>{m}</li>
                )) || <li>-</li>}
              </ul>
            </motion.div>
          </div>

          {/* Prestasi */}
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ color: theme.primaryText }}
          >
            Prestasi OSIS
          </motion.h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-24">
            {apiData?.achievements?.length > 0 ? apiData.achievements.map((p: any, i: number) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: prefersReducedMotion ? 0 : -6 }}
                className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-white/10"
              >
                <h4 className="text-xl font-semibold" style={{ color: theme.primaryText }}>
                  {p.judulPrestasi}
                </h4>
                <p className="text-base mt-4 opacity-80" style={{ color: theme.surfaceText }}>
                  {p.tahun} — {p.deskripsi}
                </p>
              </motion.div>
            )) : (
              <p className="col-span-full text-center text-lg opacity-70 py-12" style={{ color: theme.surfaceText }}>
                Belum ada prestasi yang tercatat.
              </p>
            )}
          </div>

          {/* Tombol Bergabung */}
          {/* <div className="text-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={openForm}
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
              className="px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
              style={{ background: 'black', color: "#111827" }}
            >
              Bergabung dengan OSIS
            </motion.button>
          </div> */}
        </div>
      </section>

      {/* FORM MINAT BERGABUNG */}
      {formOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-md"
          style={{ background: "rgba(0,0,0,0.7)" }}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" onClick={closeForm} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-md w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-3xl border border-white/30 p-10"
          >
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-2xl font-bold">Form Minat Bergabung OSIS</h4>
              <button
                ref={formCloseBtnRef}
                onClick={closeForm}
                className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                ✕
              </button>
            </div>
            <p className="text-sm opacity-70 mb-8">
              Data ini hanya untuk keperluan rekrutmen OSIS. Wajib isi kolom bertanda *.
            </p>
            <form onSubmit={onSubmit} className="space-y-6">
              <label className="block">
                <span className="text-base font-medium">Nama Lengkap *</span>
                <input name="nama" value={form.nama} onChange={onChange} required className="mt-2 w-full border border-gray-300 rounded-xl px-5 py-4 focus:ring-4 focus:ring-theme-accent/30 transition" placeholder="Nama kamu" />
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-base font-medium">Kelas *</span>
                  <input name="kelas" value={form.kelas} onChange={onChange} required className="mt-2 w-full border border-gray-300 rounded-xl px-5 py-4 focus:ring-4 focus:ring-theme-accent/30 transition" placeholder="XI RPL" />
                </label>
                <label className="block">
                  <span className="text-base font-medium">Kontak *</span>
                  <input name="kontak" value={form.kontak} onChange={onChange} required className="mt-2 w-full border border-gray-300 rounded-xl px-5 py-4 focus:ring-4 focus:ring-theme-accent/30 transition" placeholder="WA / Email" />
                </label>
              </div>
              <label className="block">
                <span className="text-base font-medium">Alasan Bergabung</span>
                <textarea name="alasan" value={form.alasan} onChange={onChange} rows={4} className="mt-2 w-full border border-gray-300 rounded-xl px-5 py-4 focus:ring-4 focus:ring-theme-accent/30 transition" placeholder="Motivasimu..." />
              </label>
              {formMsg && (
                <div className="p-4 rounded-xl bg-green-100/90 border border-green-300 text-green-800">
                  {formMsg}
                </div>
              )}
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={closeForm} className="px-6 py-3 rounded-xl border border-gray-300 font-medium hover:bg-gray-100 transition">
                  Batal
                </button>
                <button type="submit" className="px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition" style={{ background: 'black', color: "#111827" }}>
                  Kirim
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* LIGHTBOX GALERI (jika ingin ditambahkan nanti) */}
      {lbOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-md"
          style={{ background: "rgba(0,0,0,0.95)" }}
        >
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="absolute top-6 right-6 p-4 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white text-3xl transition"
          >
            ✕
          </button>
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            <button onClick={prev} className="absolute left-6 p-4 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white text-4xl transition">‹</button>
            <img src={galeri[idx].src} alt={galeri[idx].alt} className="max-h-[85vh] max-w-full object-contain rounded-2xl shadow-3xl" />
            <button onClick={next} className="absolute right-6 p-4 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 text-white text-4xl transition">›</button>
            <div className="absolute bottom-8 text-white text-sm opacity-80">
              {idx + 1} / {galeri.length} — {galeri[idx].alt}
            </div>
          </div>
        </motion.div>
      )}

      <FooterComp theme={theme} />
    </div>
  );
};

export default OsisPage;