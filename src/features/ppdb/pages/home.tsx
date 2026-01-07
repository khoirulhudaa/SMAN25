// import { SMAN25_CONFIG } from "@/core/theme";
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import axios from "axios";
// import { useMemo, useState } from "react";

// // === THEME ===
// const THEME = {
//   primary: "#1F3B76",
//   primaryText: "#ffffff",
//   accent: "#F2C94C",
//   bg: "#0B1733",
//   surface: "#102347",
//   surfaceText: "#ffffff",
//   subtle: "#2C3F6B",
//   muted: "#7B8AB3",
// };

// const cx = (...cls) => cls.filter(Boolean).join(" ");

// // === SHARED UI ===
// const Chip = ({ children }) => (
//   <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs border border-gray-600 bg-white/10 backdrop-blur">
//     {children}
//   </span>
// );

// const Badge = ({ children }) => (
//   <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border border-gray-600 bg-white/5">
//     {children}
//   </span>
// );

// const Card = ({ className = "", children }) => (
//   <div className={cx("rounded-2xl border border-white/10 bg-white/5 p-5", className)}>
//     {children}
//   </div>
// );

// const Section = ({ id, title, subtitle, children }) => (
//   <section id={id} className="relative py-10 md:py-14">
//     <div className="max-w-7xl mx-auto px-4">
//       <div className="mb-6 md:mb-8">
//         <h2 className="text-2xl md:text-3xl font-semibold text-black">{title}</h2>
//         {subtitle && <p className="text-sm md:text-base text-gray-500 mt-1">{subtitle}</p>}
//       </div>
//       {children}
//     </div>
//   </section>
// );

// const Timeline = ({ items = [] }) => (
//   <ol className="relative border-s border-gray-600 pl-4 space-y-6">
//     {items.map((it, i) => (
//       <li key={i} className="ms-4">
//         <div className="absolute w-2 h-2 rounded-full border-2 border-white/70 bg-[#0B1733] -left-[5px] mt-2" />
//         <Card className="bg-white/5">
//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="text-black font-medium">{it.title}</h4>
//               <p className="text-gray-500 text-sm">{it.desc}</p>
//             </div>
//             <Badge>{it.date}</Badge>
//           </div>
//         </Card>
//       </li>
//     ))}
//   </ol>
// );

// const Step = ({ idx, title, desc }) => (
//   <div className="relative bg-white/10 border border-white/10 rounded-lg p-4">
//     <div className="flex items-start gap-3">
//       <div className="h-7 w-7 rounded-full grid place-items-center border border-white/20 bg-white/10 text-sm font-semibold">{idx}</div>
//       <div>
//         <div className="text-black font-medium">{title}</div>
//         <div className="text-gray-500 text-sm">{desc}</div>
//       </div>
//     </div>
//   </div>
// );

// const KuotaTable = ({ data }) => (
//   <div className="overflow-x-auto">
//     <table className="min-w-full text-sm">
//       <thead>
//         <tr className="text-left text-black border-b border-white/10">
//           <th className="py-2">Jalur pendaftaran</th>
//           <th className="py-2">Kuota</th>
//           <th className="py-2">Peminat</th>
//           <th className="py-2">Sisa</th>
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-white/5">
//         {data.map((r, i) => (
//           <tr key={i} className="hover:bg-white/5">
//             <td className="py-2 text-black">{r.nama}</td>
//             <td className="py-2">{r.kuota}</td>
//             <td className="py-2">{r.peminat}</td>
//             <td className="py-2">{Math.max(0, r.kuota - r.peminat)}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// const StatPanel = ({ title, total, items = [], tone = "blue" }) => (
//   <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
//     <div className={cx("px-4 py-2 text-black font-semibold text-center", tone === "green" ? "bg-emerald-600" : "bg-blue-600")}>
//       {title}
//     </div>
//     <div className="p-5 text-center">
//       <div className="text-3xl font-semibold">{total.toLocaleString()}</div>
//       <ul className="mt-2 space-y-1 text-sm text-black">
//         {items.map((it, i) => (
//           <li key={i}>{it.label} : <span className="text-black font-medium">{it.value.toLocaleString()}</span></li>
//         ))}
//       </ul>
//     </div>
//   </div>
// );

// // === API CONFIG ===
// const API_BASE = "https://dev.kiraproject.id/ppdb";
// const API_V2 = "https://dev.kiraproject.id/v2/ppdb";
// const xHost = getXHostHeader();
// const headers = { "X-Host": xHost, "Cache-Control": "no-store" };

// // === FETCHERS ===
// const fetchConfig = async () => {
//   const res = await fetch(`${API_BASE}/config`, { headers, cache: "no-store" });
//   if (!res.ok) throw new Error("Gagal memuat config");
//   const json = await res.json();
//   return json.data[0];
// };

// const fetchStats = async () => {
//   const res = await fetch(`${API_BASE}/pendaftar/stats`, { headers, cache: "no-store" });
//   if (!res.ok) throw new Error("Gagal memuat stats");
//   return await res.json();
// };

// const fetchPendaftar = async (jenjang) => {
//   const res = await fetch(`${API_V2}/pendaftar?jenjang=${jenjang}`, { headers, cache: "no-store" });
//   if (!res.ok) throw new Error("Gagal memuat data pendaftar");
//   const json = await res.json();
//   return json.data || [];
// };

// const submitPendaftaran = async (formData) => {
//   const res = await axios.post(`${API_V2}/pendaftar`, formData, {
//     headers: { ...headers, "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };

// const checkHasil = async (noPendaftaran) => {
//   const url = new URL(`${API_BASE}/pendaftar/check`);
//   url.searchParams.set("noPendaftaran", noPendaftaran);
//   const res = await fetch(url, { headers, cache: "no-store" });
//   if (!res.ok) throw new Error("Tidak ditemukan");
//   return (await res.json()).data;
// };

// // === MAIN COMPONENT ===
// export default function PPDBPage() {
//   const queryClient = useQueryClient();

//   // === Queries ===
//   const { data: config, isPending: configLoading, error: configError } = useQuery({
//     queryKey: ['ppdb-config'],
//     queryFn: fetchConfig,
//   });

//   const { data: stats, isPending: statsLoading } = useQuery({
//     queryKey: ['ppdb-stats'],
//     queryFn: fetchStats,
//   });

//   const [jenjang, setJenjang] = useState("SMP");
//   const { data: pendaftar = [], isPending: pendaftarLoading, error: pendaftarError } = useQuery({
//     queryKey: ['ppdb-pendaftar', jenjang],
//     queryFn: () => fetchPendaftar(jenjang),
//   });

//   // === Form States ===
//   const [jalur, setJalur] = useState("Zonasi");
//   const [berkas, setBerkas] = useState(null);
//   const [nisn, setNisn] = useState("");
//   const [namaLengkap, setNamaLengkap] = useState("");
//   const [email, setEmail] = useState("");
//   const [noHp, setNoHp] = useState("");
//   const [jenisKelamin, setJenisKelamin] = useState("Laki-laki");
//   const [tempatLahir, setTempatLahir] = useState("");
//   const [tanggalLahir, setTanggalLahir] = useState("");
//   const [alamat, setAlamat] = useState("");
//   const [namaSekolahAsal, setNamaSekolahAsal] = useState("");
//   const [namaOrangTua, setNamaOrangTua] = useState("");
//   const [nohpOrtu, setNohpOrtu] = useState("");
//   const [jurusan, setJurusan] = useState("");
//   const [password, setPassword] = useState("");

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalMessage, setModalMessage] = useState("");
//   const [modalIsSuccess, setModalIsSuccess] = useState(true);

//   const onlyDigits = (s) => s.replace(/\D+/g, "");

//   // === Mutations ===
//   const submitMutation = useMutation({
//     mutationFn: submitPendaftaran,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['ppdb-stats']);
//       queryClient.invalidateQueries(['ppdb-pendaftar', jenjang]);
//       setModalTitle("Sukses"); setModalMessage("Pendaftaran berhasil!"); setModalIsSuccess(true); setModalOpen(true);
//       resetForm();
//     },
//     onError: (err) => {
//       setModalTitle("Gagal"); setModalMessage(err.response?.data?.message || "Gagal mengirim"); setModalIsSuccess(false); setModalOpen(true);
//     },
//   });

//   // === Cek Hasil ===
//   const [noPendaftaran, setNoPendaftaran] = useState("");
//   const [hasil, setHasil] = useState(null);

//   const cekMutation = useMutation({
//     mutationFn: checkHasil,
//     onSuccess: (data) => {
//       setHasil({
//         nama: data.nama,
//         nisn: data.nisn,
//         status: data.status.toUpperCase(),
//         jurusan: data.jurusan,
//         keterangan: data.status === "diterima"
//           ? `Silakan daftar ulang pada ${new Date(config?.timeline.daftar_ulang).toLocaleDateString("id-ID")}.`
//           : "Verifikasi sedang diproses.",
//       });
//     },
//     onError: () => {
//       setHasil({ status: "TIDAK DITEMUKAN", jurusan: "-", keterangan: "Nomor pendaftaran tidak valid." });
//     },
//   });

//   // === Computed ===
//   const isRegActive = config?.isRegistrationOpen || false;
//   const regStart = config ? new Date(config.timeline.open).toLocaleDateString("id-ID") : null;

//   const jadwal = useMemo(() => {
//     if (!config?.timeline) return [];
//     const t = config.timeline;
//     return [
//       { title: "Pendaftaran Dibuka", desc: "Form online aktif 24 jam", date: new Date(t.open).toLocaleDateString("id-ID") },
//       { title: "Verifikasi Berkas", desc: "Oleh panitia", date: new Date(t.verify).toLocaleDateString("id-ID") },
//       { title: "Pengumuman Hasil", desc: "Cek di menu", date: new Date(t.announce).toLocaleDateString("id-ID") },
//       { title: "Daftar Ulang", desc: "Konfirmasi berkas", date: new Date(t.daftar_ulang).toLocaleDateString("id-ID") },
//     ];
//   }, [config]);

//   const kuotaData = useMemo(() => {
//     if (!config?.kuota || !stats?.byJurusan) return [];
//     return Object.keys(config.kuota).map(j => ({
//       nama: j,
//       kuota: config.kuota[j] || 0,
//       peminat: stats.byJurusan[j] || 0,
//     }));
//   }, [config, stats]);

//   const resetForm = () => {
//     setNisn(""); setNamaLengkap(""); setEmail(""); setNoHp(""); setJenisKelamin("Laki-laki");
//     setTempatLahir(""); setTanggalLahir(""); setAlamat(""); setNamaSekolahAsal("");
//     setNamaOrangTua(""); setNohpOrtu(""); setJurusan(""); setPassword(""); setBerkas(null);
//   };

//   const handleKirim = (e) => {
//     e.preventDefault();

//     // Validasi
//     if (nisn.length !== 10) return openModal("Gagal", "NISN harus 10 digit");
//     if (!email.includes("@")) return openModal("Gagal", "Email tidak valid");
//     if (onlyDigits(noHp).length < 10) return openModal("Gagal", "No HP minimal 10 digit");
//     if (!namaLengkap || !tempatLahir || !tanggalLahir || !alamat || !namaSekolahAsal || !namaOrangTua || !nohpOrtu || !jurusan || !password)
//       return openModal("Gagal", "Semua kolom wajib diisi");
//     if (password.length < 6) return openModal("Gagal", "Password minimal 6 karakter");
//     if (berkas && !berkas.type.includes("pdf")) return openModal("Gagal", "Berkas harus PDF");
//     if (berkas && berkas.size > 10 * 1024 * 1024) return openModal("Gagal", "Berkas maks 10MB");

//     const formData = new FormData();
//     formData.append("sekolahId", "55");
//     formData.append("nama", namaLengkap);
//     formData.append("nisn", nisn);
//     formData.append("email", email);
//     formData.append("noHp", onlyDigits(noHp));
//     formData.append("jenisKelamin", jenisKelamin === "Laki-laki" ? "L" : "P");
//     formData.append("tempatLahir", tempatLahir);
//     formData.append("tanggalLahir", new Date(tanggalLahir).toISOString());
//     formData.append("alamat", alamat);
//     formData.append("asalSekolah", namaSekolahAsal);
//     formData.append("namaOrangTua", namaOrangTua);
//     formData.append("nohpOrtu", onlyDigits(nohpOrtu));
//     formData.append("jenjang", jenjang);
//     formData.append("jurusan", jurusan);
//     formData.append("password", password);
//     if (berkas) formData.append("berkas", berkas);

//     submitMutation.mutate(formData);
//   };

//   const openModal = (title, msg, success = false) => {
//     setModalTitle(title); setModalMessage(msg); setModalIsSuccess(success); setModalOpen(true);
//   };

//   // === DataTable ===
//   const DataTable = () => {
//     const [q, setQ] = useState('');
//     const [page, setPage] = useState(1);
//     const [perPage, setPerPage] = useState(20);
//     const [sortKey, setSortKey] = useState('noUrut');
//     const [sortDir, setSortDir] = useState('asc');

//     const filtered = useMemo(() => {
//       const s = q.toLowerCase();
//       const list = s ? pendaftar.filter(r => `${r.noPendaftaran} ${r.nama} ${r.asalSekolah}`.toLowerCase().includes(s)) : pendaftar;
//       return [...list].sort((a, b) => {
//         const va = a[sortKey] ?? ''; const vb = b[sortKey] ?? '';
//         return sortDir === 'asc' ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1);
//       });
//     }, [pendaftar, q, sortKey, sortDir]);

//     const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
//     const paged = filtered.slice((page - 1) * perPage, page * perPage);

//     const changeSort = (key) => {
//       if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
//       else { setSortKey(key); setSortDir('asc'); }
//     };

//     if (pendaftarLoading) return <div className="text-gray-500">Memuat data...</div>;
//     // if (pendaftarError) return <div className="text-red-400">Gagal memuat data pendaftar</div>;

//     return (
//       <div className="space-y-3">
//         <div className="flex flex-col sm:flex-row justify-between gap-3 text-sm">
//           <div className="flex items-center gap-2">
//             <span className="text-black">Show</span>
//             <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }} className="rounded-md bg-white/10 border border-gray-600 px-2 py-1 text-black">
//               {[10, 20, 30, 50, 100].map(n => <option key={n} value={n} className="text-black">{n}</option>)}
//             </select>
//             <span className="text-black">entries</span>
//           </div>
//           <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="cari..." className="rounded-md bg-white/10 border border-gray-600 px-2 py-1 text-black" />
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="text-left text-black border-b border-white/10">
//                 {[
//                   { key: 'noUrut', label: 'NO' },
//                   { key: 'noPendaftaran', label: 'NO PENDAFTARAN' },
//                   { key: 'nama', label: 'NAMA' },
//                   { key: 'asalSekolah', label: 'ASAL SEKOLAH' },
//                   { key: 'status', label: 'STATUS' },
//                 ].map(c => (
//                   <th key={c.key} className="py-2 cursor-pointer" onClick={() => changeSort(c.key)}>
//                     <div className="inline-flex items-center gap-1">
//                       {c.label}
//                       {sortKey === c.key && <span className="text-xs">{sortDir === 'asc' ? 'Up' : 'Down'}</span>}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {paged.map((r, i) => (
//                 <tr key={r.noPendaftaran} className="hover:bg-white/5">
//                   <td className="py-2">{(page - 1) * perPage + i + 1}</td>
//                   <td className="py-2">{r.noPendaftaran}</td>
//                   <td className="py-2 text-black">{r.nama}</td>
//                   <td className="py-2">{r.asalSekolah}</td>
//                   <td className="py-2">
//                     <span className={cx(
//                       "px-2 py-0.5 rounded text-xs font-medium",
//                       r.status === 'diterima' ? "bg-emerald-500/20 text-emerald-200" :
//                       r.status === 'pending' ? "bg-yellow-500/20 text-yellow-200" :
//                       "bg-red-500/20 text-red-200"
//                     )}>
//                       {r.status?.toUpperCase() || '-'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex justify-between text-sm text-black">
//           <div>Showing {paged.length} of {filtered.length}</div>
//           <div className="flex gap-1">
//             <button disabled={page === 1} onClick={() => setPage(1)} className="px-2 py-1 rounded border border-gray-600 disabled:opacity-40">First</button>
//             <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-2 py-1 rounded border border-gray-600 disabled:opacity-40">Prev</button>
//             <span className="px-2 py-1">Page {page} / {totalPages}</span>
//             <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-2 py-1 rounded border border-gray-600 disabled:opacity-40">Next</button>
//             <button disabled={page === totalPages} onClick={() => setPage(totalPages)} className="px-2 py-1 rounded border border-gray-600 disabled:opacity-40">Last</button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // === Modal ===
//   const Modal = () => modalOpen && (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalOpen(false)}>
//       <div className="rounded-2xl border border-white/10 p-6 max-w-md w-full" style={{ background: SMAN25_CONFIG.theme.surface }} onClick={e => e.stopPropagation()}>
//         <h3 className="text-lg font-semibold mb-2">{modalTitle}</h3>
//         <p className="text-sm mb-4">{modalMessage}</p>
//         <button onClick={() => setModalOpen(false)} className="w-full px-4 py-2 rounded-xl border border-gray-600 bg-white/10 hover:bg-white/15 font-medium">
//           Tutup
//         </button>
//       </div>
//     </div>
//   );

//   if (configLoading || statsLoading) return <div className="text-black text-center py-10">Memuat...</div>;

//   return (
//     <div style={{ background: SMAN25_CONFIG.theme.bg, color: SMAN25_CONFIG.theme.primaryText }} className="min-h-screen">
//       <NavbarComp />

//       <div className="text-center flex items-center gap-3 justify-center">
//         {
//           pendaftarError && (
//             <div className="text-red-400 text-center py-10">Gagal memuat data pendaftaran</div>
//           )
//         }

//         <div className="mx-3">|</div>

//         {
//           pendaftarError && (
//             <div className="text-red-400 text-center py-10">Gagal memuat konfigurasi</div>
//           )
//         }
//       </div>

//       {/* HERO */}
//       <section id="ppdb" className="relative overflow-hidden py-12 md:py-16">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid md:grid-cols-2 gap-8 items-center">
//             <div>
//               <h1 className="text-3xl md:text-5xl font-bold">PPDB {stats?.tahun || new Date().getFullYear()}<br /> SMAN 78 Jakarta</h1>
//               <p className="text-black mt-3">Transparan. Real-time. 24/7.</p>
//               <div className="flex flex-wrap gap-2 mt-4">
//                 <Chip>Pendaftar: <b>{stats?.total || 0}</b></Chip>
//                 <Chip>Kuota: {config?.kuota ? Object.values(config.kuota).reduce((a,b)=>a+b,0) : 0}</Chip>
//               </div>
//               <div className="flex gap-3 mt-6">
//                 {isRegActive ? <a href="#pendaftaran" className="px-4 py-2 rounded-xl bg-white/10 border border-gray-600 hover:bg-white/15">Daftar</a> : <span className="px-4 py-2 rounded-xl bg-white/5 text-black/60">Belum Dibuka</span>}
//                 <a href="#alur" className="px-4 py-2 rounded-xl border border-gray-600 hover:bg-white/10">Alur</a>
//               </div>
//             </div>
//             <Card><Timeline items={jadwal} /></Card>
//           </div>
//         </div>
//       </section>

//       {/* ALUR, PERSYARATAN, KUOTA, REKAP, DATA, FORM, CEK HASIL */}
//       {/* ... (sama seperti sebelumnya, gunakan DataTable(), kuotaData, dll) */}

//       <Section id="data-pendaftar" title="Data Pendaftar">
//         <Card><DataTable /></Card>
//       </Section>

//       {isRegActive && (
//         <Section id="pendaftaran" title="Formulir Pendaftaran">
//           <Card>
//             <form onSubmit={handleKirim} className="grid md:grid-cols-2 gap-4">
//               {/* SEMUA FIELD FORM SAMA SEPERTI SEBELUMNYA */}
//             </form>
//           </Card>
//         </Section>
//       )}

//       <Section id="hasil" title="Cek Hasil">
//         <Card>
//           <form onSubmit={(e) => { e.preventDefault(); cekMutation.mutate(noPendaftaran); }} className="flex gap-3">
//             <input value={noPendaftaran} onChange={e => setNoPendaftaran(e.target.value)} placeholder="No Pendaftaran" className="flex-1 rounded-lg bg-white/10 border border-gray-600 px-3 py-2" />
//             <button type="submit" className="px-4 py-2 rounded-xl bg-white/10 border border-gray-600 hover:bg-white/15">Cek</button>
//           </form>
//           {hasil && <Card className="mt-4"><div className="text-sm">{hasil.nama} - {hasil.status}</div></Card>}
//         </Card>
//       </Section>

//       <FooterComp theme={{ smkn13: THEME }} />
//       <Modal />
//     </div>
//   );
// }



import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from "axios";
import {motion} from "framer-motion";
import { useMemo, useState } from "react";

/****************************
 * HERO SECTION UNTUK PPDB
 ****************************/
const HeroSection = () => {
  const scrollToPPDB = () => {
    document.getElementById("ppdb")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      {/* Background Image - Representatif PPDB / pendaftaran sekolah */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero2.png')`, // Ganti dengan foto siswa baru / pendaftaran jika ada
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
          PPDB SMAN 25 Jakarta
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Penerimaan Peserta Didik Baru tahun ajaran baru – transparan, real-time, dan mudah
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          onClick={scrollToPPDB}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          Lihat Informasi PPDB
        </motion.button>
      </div>
    </section>
  );
};

// === THEME ===
const THEME = {
  primary: "#1F3B76",
  primaryText: "#ffffff",
  accent: "#F2C94C",
  bg: "#0B1733",
  surface: "#102347",
  surfaceText: "#ffffff",
  subtle: "#2C3F6B",
  muted: "#7B8AB3",
};

const cx = (...cls) => cls.filter(Boolean).join(" ");

// === SHARED UI ===
const Chip = ({ children }) => (
  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs border border-gray-600 bg-white/10 backdrop-blur">
    {children}
  </span>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border border-gray-600 bg-white/5">
    {children}
  </span>
);

const Card = ({ className = "", children }) => (
  <div className={cx("rounded-2xl border border-white/10 bg-white/5 py-5", className)}>
    {children}
  </div>
);

const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="relative py-10 md:py-14">
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-black">{title}</h2>
        {subtitle && <p className="text-sm md:text-base text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  </section>
);

const Timeline = ({ items = [] }) => (
  <ol className="relative border-s border-gray-600 pl-4 space-y-6">
    {items.map((it, i) => (
      <li key={i} className="ms-4">
        <div className="absolute w-2 h-2 rounded-full border-2 border-white/70 bg-[#0B1733] -left-[5px] mt-2" />
        <Card className="bg-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-black font-medium">{it.title}</h4>
              <p className="text-gray-500 text-sm">{it.desc}</p>
            </div>
            <Badge>{it.date}</Badge>
          </div>
        </Card>
      </li>
    ))}
  </ol>
);

const Step = ({ idx, title, desc }) => (
  <div className="relative bg-white/10 border border-white/10 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <div className="h-7 w-7 rounded-full grid place-items-center border border-white/20 bg-white/10 text-sm font-semibold">{idx}</div>
      <div>
        <div className="text-black font-medium">{title}</div>
        <div className="text-gray-500 text-sm">{desc}</div>
      </div>
    </div>
  </div>
);

const KuotaTable = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left text-black border-b border-white/10">
          <th className="py-2">Jalur pendaftaran</th>
          <th className="py-2">Kuota</th>
          <th className="py-2">Peminat</th>
          <th className="py-2">Sisa</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {data.map((r, i) => (
          <tr key={i} className="hover:bg-white/5">
            <td className="py-2 text-black">{r.nama}</td>
            <td className="py-2">{r.kuota}</td>
            <td className="py-2">{r.peminat}</td>
            <td className="py-2">{Math.max(0, r.kuota - r.peminat)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StatPanel = ({ title, total, items = [], tone = "blue" }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
    <div className={cx("px-4 py-2 text-black font-semibold text-center", tone === "green" ? "bg-emerald-600" : "bg-blue-600")}>
      {title}
    </div>
    <div className="p-5 text-center">
      <div className="text-3xl font-semibold">{total.toLocaleString()}</div>
      <ul className="mt-2 space-y-1 text-sm text-black">
        {items.map((it, i) => (
          <li key={i}>{it.label} : <span className="text-black font-medium">{it.value.toLocaleString()}</span></li>
        ))}
      </ul>
    </div>
  </div>
);

// === API CONFIG ===
const API_BASE = "https://dev.kiraproject.id/ppdb";
const API_V2 = "https://dev.kiraproject.id/v2/ppdb";
const xHost = getXHostHeader();
const headers = { "X-Host": xHost, "Cache-Control": "no-store" };

// === FETCHERS ===
const fetchConfig = async () => {
  const res = await fetch(`${API_BASE}/config`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error("Gagal memuat config");
  const json = await res.json();
  return json.data[0];
};

const fetchStats = async () => {
  const res = await fetch(`${API_BASE}/pendaftar/stats`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error("Gagal memuat stats");
  return await res.json();
};

const fetchPendaftar = async (jenjang) => {
  const res = await fetch(`${API_V2}/pendaftar?jenjang=${jenjang}`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error("Gagal memuat data pendaftar");
  const json = await res.json();
  return json.data || [];
};

const submitPendaftaran = async (formData) => {
  const res = await axios.post(`${API_V2}/pendaftar`, formData, {
    headers: { ...headers, "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

const checkHasil = async (noPendaftaran) => {
  const url = new URL(`${API_BASE}/pendaftar/check`);
  url.searchParams.set("noPendaftaran", noPendaftaran);
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) throw new Error("Tidak ditemukan");
  return (await res.json()).data;
};

// === MAIN COMPONENT DENGAN HERO ===
export default function PPDBPage() {
  const queryClient = useQueryClient();

  // === Queries ===
  const { data: config, isPending: configLoading, error: configError } = useQuery({
    queryKey: ['ppdb-config'],
    queryFn: fetchConfig,
  });

  const { data: stats, isPending: statsLoading } = useQuery({
    queryKey: ['ppdb-stats'],
    queryFn: fetchStats,
  });

  const [jenjang, setJenjang] = useState("SMP");
  const { data: pendaftar = [], isPending: pendaftarLoading, error: pendaftarError } = useQuery({
    queryKey: ['ppdb-pendaftar', jenjang],
    queryFn: () => fetchPendaftar(jenjang),
  });

  // === Form States ===
  const [jalur, setJalur] = useState("Zonasi");
  const [berkas, setBerkas] = useState(null);
  const [nisn, setNisn] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("Laki-laki");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [alamat, setAlamat] = useState("");
  const [namaSekolahAsal, setNamaSekolahAsal] = useState("");
  const [namaOrangTua, setNamaOrangTua] = useState("");
  const [nohpOrtu, setNohpOrtu] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [password, setPassword] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalIsSuccess, setModalIsSuccess] = useState(true);

  const onlyDigits = (s) => s.replace(/\D+/g, "");

  // === Mutations ===
  const submitMutation = useMutation({
    mutationFn: submitPendaftaran,
    onSuccess: () => {
      queryClient.invalidateQueries(['ppdb-stats']);
      queryClient.invalidateQueries(['ppdb-pendaftar', jenjang]);
      setModalTitle("Sukses"); setModalMessage("Pendaftaran berhasil!"); setModalIsSuccess(true); setModalOpen(true);
      resetForm();
    },
    onError: (err) => {
      setModalTitle("Gagal"); setModalMessage(err.response?.data?.message || "Gagal mengirim"); setModalIsSuccess(false); setModalOpen(true);
    },
  });

  // === Cek Hasil ===
  const [noPendaftaran, setNoPendaftaran] = useState("");
  const [hasil, setHasil] = useState(null);

  const cekMutation = useMutation({
    mutationFn: checkHasil,
    onSuccess: (data) => {
      setHasil({
        nama: data.nama,
        nisn: data.nisn,
        status: data.status.toUpperCase(),
        jurusan: data.jurusan,
        keterangan: data.status === "diterima"
          ? `Silakan daftar ulang pada ${new Date(config?.timeline.daftar_ulang).toLocaleDateString("id-ID")}.`
          : "Verifikasi sedang diproses.",
      });
    },
    onError: () => {
      setHasil({ status: "TIDAK DITEMUKAN", jurusan: "-", keterangan: "Nomor pendaftaran tidak valid." });
    },
  });

  // === Computed ===
  const isRegActive = config?.isRegistrationOpen || false;
  const regStart = config ? new Date(config.timeline.open).toLocaleDateString("id-ID") : null;

  const jadwal = useMemo(() => {
    if (!config?.timeline) return [];
    const t = config.timeline;
    return [
      { title: "Pendaftaran Dibuka", desc: "Form online aktif 24 jam", date: new Date(t.open).toLocaleDateString("id-ID") },
      { title: "Verifikasi Berkas", desc: "Oleh panitia", date: new Date(t.verify).toLocaleDateString("id-ID") },
      { title: "Pengumuman Hasil", desc: "Cek di menu", date: new Date(t.announce).toLocaleDateString("id-ID") },
      { title: "Daftar Ulang", desc: "Konfirmasi berkas", date: new Date(t.daftar_ulang).toLocaleDateString("id-ID") },
    ];
  }, [config]);

  const kuotaData = useMemo(() => {
    if (!config?.kuota || !stats?.byJurusan) return [];
    return Object.keys(config.kuota).map(j => ({
      nama: j,
      kuota: config.kuota[j] || 0,
      peminat: stats.byJurusan[j] || 0,
    }));
  }, [config, stats]);

  const resetForm = () => {
    setNisn(""); setNamaLengkap(""); setEmail(""); setNoHp(""); setJenisKelamin("Laki-laki");
    setTempatLahir(""); setTanggalLahir(""); setAlamat(""); setNamaSekolahAsal("");
    setNamaOrangTua(""); setNohpOrtu(""); setJurusan(""); setPassword(""); setBerkas(null);
  };

  const handleKirim = (e) => {
    e.preventDefault();

    // Validasi
    if (nisn.length !== 10) return openModal("Gagal", "NISN harus 10 digit");
    if (!email.includes("@")) return openModal("Gagal", "Email tidak valid");
    if (onlyDigits(noHp).length < 10) return openModal("Gagal", "No HP minimal 10 digit");
    if (!namaLengkap || !tempatLahir || !tanggalLahir || !alamat || !namaSekolahAsal || !namaOrangTua || !nohpOrtu || !jurusan || !password)
      return openModal("Gagal", "Semua kolom wajib diisi");
    if (password.length < 6) return openModal("Gagal", "Password minimal 6 karakter");
    if (berkas && !berkas.type.includes("pdf")) return openModal("Gagal", "Berkas harus PDF");
    if (berkas && berkas.size > 10 * 1024 * 1024) return openModal("Gagal", "Berkas maks 10MB");

    const formData = new FormData();
    formData.append("sekolahId", "55");
    formData.append("nama", namaLengkap);
    formData.append("nisn", nisn);
    formData.append("email", email);
    formData.append("noHp", onlyDigits(noHp));
    formData.append("jenisKelamin", jenisKelamin === "Laki-laki" ? "L" : "P");
    formData.append("tempatLahir", tempatLahir);
    formData.append("tanggalLahir", new Date(tanggalLahir).toISOString());
    formData.append("alamat", alamat);
    formData.append("asalSekolah", namaSekolahAsal);
    formData.append("namaOrangTua", namaOrangTua);
    formData.append("nohpOrtu", onlyDigits(nohpOrtu));
    formData.append("jenjang", jenjang);
    formData.append("jurusan", jurusan);
    formData.append("password", password);
    if (berkas) formData.append("berkas", berkas);

    submitMutation.mutate(formData);
  };

  const openModal = (title, msg, success = false) => {
    setModalTitle(title); setModalMessage(msg); setModalIsSuccess(success); setModalOpen(true);
  };

  // === DataTable ===
  const DataTable = () => {
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [sortKey, setSortKey] = useState('noUrut');
    const [sortDir, setSortDir] = useState('asc');

    const filtered = useMemo(() => {
      const s = q.toLowerCase();
      const list = s ? pendaftar.filter(r => `${r.noPendaftaran} ${r.nama} ${r.asalSekolah}`.toLowerCase().includes(s)) : pendaftar;
      return [...list].sort((a, b) => {
        const va = a[sortKey] ?? ''; const vb = b[sortKey] ?? '';
        return sortDir === 'asc' ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1);
      });
    }, [pendaftar, q, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const paged = filtered.slice((page - 1) * perPage, page * perPage);

    const changeSort = (key) => {
      if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
      else { setSortKey(key); setSortDir('asc'); }
    };

    if (pendaftarLoading) return <div className="text-gray-500">Memuat data...</div>;

    return (
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-black">Show</span>
            <select value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }} className="rounded-md bg-white/10 border border-gray-600 px-2 py-1 text-black">
              {[10, 20, 30, 50, 100].map(n => <option key={n} value={n} className="text-black">{n}</option>)}
            </select>
            <span className="text-black">entries</span>
          </div>
          <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="cari..." className="rounded-md bg-white/10 border border-gray-600 px-2 py-1 text-black" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-black border-b border-black/60">
                {[
                  { key: 'noUrut', label: 'NO' },
                  { key: 'noPendaftaran', label: 'NO PENDAFTARAN' },
                  { key: 'nama', label: 'NAMA' },
                  { key: 'asalSekolah', label: 'ASAL SEKOLAH' },
                  { key: 'status', label: 'STATUS' },
                ].map(c => (
                  <th key={c.key} className="py-2 border border-black/60 cursor-pointer" onClick={() => changeSort(c.key)}>
                    <div className="inline-flex items-center gap-1">
                      {c.label}
                      {sortKey === c.key && <span className="text-xs">{sortDir === 'asc' ? 'Up' : 'Down'}</span>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paged.map((r, i) => (
                <tr key={r.noPendaftaran} className="hover:bg-white/5 border border-black/60">
                  <td className="py-2">{(page - 1) * perPage + i + 1}</td>
                  <td className="py-2">{r.noPendaftaran}</td>
                  <td className="py-2 text-black">{r.nama}</td>
                  <td className="py-2">{r.asalSekolah}</td>
                  <td className="py-2">
                    <span className={cx(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      r.status === 'diterima' ? "bg-emerald-500/20 text-emerald-200" :
                      r.status === 'pending' ? "bg-yellow-500/20 text-yellow-200" :
                      "bg-red-500/20 text-red-200"
                    )}>
                      {r.status?.toUpperCase() || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between text-sm text-black">
          <div>Showing {paged.length} of {filtered.length}</div>
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(1)} className="px-2 py-1 rounded border border-gray-600 disabled:opacity-40">First</button>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-2 py-1 rounded border border-gray-600 disabled:opacity-40">Prev</button>
            <span className="px-2 py-1">Page {page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-2 py-1 rounded border border-gray-600 disabled:opacity-40">Next</button>
            <button disabled={page === totalPages} onClick={() => setPage(totalPages)} className="px-2 py-1 rounded border border-gray-600 disabled:opacity-40">Last</button>
          </div>
        </div>
      </div>
    );
  };

  // === Modal ===
  const Modal = () => modalOpen && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalOpen(false)}>
      <div className="rounded-2xl border border-white/10 p-6 max-w-md w-full" style={{ background: SMAN25_CONFIG.theme.surface }} onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-2">{modalTitle}</h3>
        <p className="text-sm mb-4">{modalMessage}</p>
        <button onClick={() => setModalOpen(false)} className="w-full px-4 py-2 rounded-xl border border-gray-600 bg-white/10 hover:bg-white/15 font-medium">
          Tutup
        </button>
      </div>
    </div>
  );

  if (configLoading || statsLoading) return <div className="text-black text-center py-10">Memuat...</div>;

  return (
    <div style={{ background: SMAN25_CONFIG.theme.bg, color: SMAN25_CONFIG.theme.primaryText }} className="min-h-screen">
      <NavbarComp theme={SMAN25_CONFIG.theme} />

      {/* HERO SECTION BARU */}
      <HeroSection />

      {/* HERO LAMA DIPINDAHKAN KE BAWAH */}
      <section id="ppdb" className="relative overflow-hidden py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">PPDB {stats?.tahun || new Date().getFullYear()}<br /> SMAN 25 Jakarta</h1>
              <p className="text-black mt-3">Transparan. Real-time. 24/7.</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Chip>Pendaftar: <b>{stats?.total || 0}</b></Chip>
                <Chip>Kuota: {config?.kuota ? Object.values(config.kuota).reduce((a,b)=>a+b,0) : 0}</Chip>
              </div>
              <div className="flex gap-3 mt-6">
                {isRegActive ? <a href="#pendaftaran" className="px-4 py-2 rounded-xl bg-white/10 border border-gray-600 hover:bg-white/15">Daftar</a> : <span className="px-4 py-2 rounded-xl bg-white/5 text-black/60">Belum Dibuka</span>}
                <a href="#alur" className="px-4 py-2 rounded-xl border border-gray-600 hover:bg-white/10">Alur</a>
              </div>
            </div>
            <Card><Timeline items={jadwal} /></Card>
          </div>
        </div>
      </section>

      {/* SEMUA SECTION LAIN TETAP SAMA */}
      <Section id="data-pendaftar" title="Data Pendaftar">
        <Card><DataTable /></Card>
      </Section>

      {isRegActive && (
        <Section id="pendaftaran" title="Formulir Pendaftaran">
          <Card>
            <form onSubmit={handleKirim} className="grid md:grid-cols-2 gap-4">
              {/* SEMUA FIELD FORM TETAP SAMA */}
            </form>
          </Card>
        </Section>
      )}

      <Section id="hasil" title="Cek Hasil">
        <Card>
          <form onSubmit={(e) => { e.preventDefault(); cekMutation.mutate(noPendaftaran); }} className="flex gap-3">
            <input value={noPendaftaran} onChange={e => setNoPendaftaran(e.target.value)} placeholder="No Pendaftaran" className="flex-1 rounded-lg bg-white/10 border border-gray-600 px-3 py-2" />
            <button type="submit" className="px-4 py-2 rounded-xl bg-white/10 border border-gray-600 hover:bg-white/15">Cek</button>
          </form>
          {hasil && <Card className="mt-4"><div className="text-sm">{hasil.nama} - {hasil.status}</div></Card>}
        </Card>
      </Section>

      <FooterComp theme={SMAN25_CONFIG.theme} />
      <Modal />
    </div>
  );
}