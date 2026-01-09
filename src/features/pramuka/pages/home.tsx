// import { SMAN25_CONFIG } from "@/core/theme";
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   Images,
//   MapPin,
//   Users,
//   X
// } from "lucide-react";
// import React, { useCallback, useEffect, useMemo, useState } from "react";

// // === NAVIGATION ===
// type NavItem = {
//   label: string;
//   href?: string;
//   children?: { label: string; href: string }[];
// };
// const NAV: NavItem[] = [
//   { label: "Beranda", href: "/dashboard" },
//   { label: "Pramuka", href: "/pramuka" },
//   { label: "Profil", children: [
//       { label: "Sambutan", href: "/sambutan" },
//       { label: "Visi & Misi", href: "/visiMisi" },
//       { label: "Sejarah", href: "/sejarah" },
//       { label: "Struktur", href: "/struktur" },
//       { label: "Galeri", href: "/galeri" },
//     ]},
//   { label: "Akademik", children: [
//       { label: "Kurikulum", href: "/kurikulum" },
//       { label: "Kalender", href: "/kalender" },
//       { label: "Jadwal", href: "/jadwal" },
//       { label: "Guru & Tendik", href: "/guru-tendik" },
//     ]},
//   { label: "Kesiswaan", children: [
//       { label: "OSIS", href: "/osis" },
//       { label: "Pemilihan OSIS", href: "/kandidatosis" },
//       { label: "Ekstrakurikuler", href: "/ekstrakulikuler" },
//       { label: "Prestasi", href: "/prestasi" },
//     ]},
//   { label: "Perpustakaan", href: "/perpustakaan" },
//   { label: "Informasi", children: [
//       { label: "Pengumuman", href: "/pengumuman" },
//       { label: "Berita", href: "/berita" },
//       { label: "Agenda", href: "/agenda" },
//       { label: "Buku alumni", href: "/buku-alumni" },
//       { label: "PPDB", href: "/ppdb" },
//       { label: "PPID", href: "/ppid" },
//       { label: "Layanan", href: "/layanan" },
//       { label: "Kelulusan", href: "/kelulusan" },
//     ]},
//   { label: "Galeri", href: "/dashboard#galeri" },
// ];

// const PPDB_PERIOD = {
//   start: new Date("2025-05-01T00:00:00+07:00"),
//   end: new Date("2025-07-31T23:59:59+07:00"),
// };
// const isWithinPeriod = (now: Date, { start, end }: { start: Date; end: Date }) => now >= start && now <= end;

// // === UTILITIES ===
// const useOnClickOutside = (ref: React.RefObject<HTMLElement>, handler: (e: MouseEvent | TouchEvent) => void) => {
//   useEffect(() => {
//     const listener = (e: any) => {
//       if (!ref.current || (e.target instanceof Node && ref.current.contains(e.target))) return;
//       handler(e);
//     };
//     document.addEventListener("mousedown", listener);
//     document.addEventListener("touchstart", listener);
//     return () => {
//       document.removeEventListener("mousedown", listener);
//       document.removeEventListener("touchstart", listener);
//     };
//   }, [ref, handler]);
// };

// // === TYPES ===
// export type Jenis = "Latihan" | "Perkemahan" | "Lomba" | "Bakti" | "Rapat" | "Kursus";
// export type Status = "Draft" | "Ajukan" | "Disetujui" | "Selesai";
// export type DocItem = {
//   name: string;
//   url: string;
//   type?: 'image/png' | 'image/jpeg' | 'video/mp4' | 'application/pdf';
//   size?: number;
// };
// export type Kegiatan = {
//   id: string;
//   tenant?: string;
//   judul: string;
//   jenis: Jenis;
//   tanggal: string;
//   lokasi: string;
//   penanggungJawab: string;
//   peserta: number;
//   status?: Status;
//   webSekolah?: string;
//   dokumentasi?: DocItem[];
//   deskripsi?: string;
//   kegiatan?: Array<{
//     id: string;
//     namaKegiatan: string;
//     deskripsi: string;
//     tanggal: string;
//     lokasi: string;
//     foto?: string;
//   }>;
// };

// // === DEMO DATA ===
// function todayPlus(d: number) {
//   const t = new Date();
//   t.setDate(t.getDate() + d);
//   return t.toISOString().slice(0, 10);
// }
// const DEMO: Kegiatan[] = [
//   {
//     id: "k1",
//     judul: "Latihan Rutin Mingguan",
//     jenis: "Latihan",
//     tanggal: todayPlus(-5),
//     lokasi: "Lapangan Sekolah",
//     penanggungJawab: "Pembina A",
//     peserta: 45,
//     status: "Disetujui",
//     webSekolah: "https://sdn05.example.sch.id/berita/latihan",
//     dokumentasi: [
//       { name: "pembukaan.jpg", url: "https://placehold.co/1280x720/png?text=Pembukaan%20Pramuka", type: "image/png" },
//       { name: "senam.jpg", url: "https://placehold.co/1280x720/png?text=Senam%20Pagi", type: "image/png" },
//       { name: "yell.mp4", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", type: "video/mp4" }
//     ]
//   }
// ];

// // === UTILS ===
// function isImage(t?: string) { return !!t && t.startsWith('image/'); }
// function isVideo(t?: string) { return !!t && t.startsWith('video/'); }

// function svgFallback(label: string = 'Gambar', w = 800, h = 450, theme: any) {
//   const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
// <rect width="100%" height="100%" fill="${theme.surface}"/>
// <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffffb3" font-family="Inter,Arial,sans-serif" font-size="22">${label}</text>
// </svg>`;
//   return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
// }

// function SafeImg({
//   src,
//   alt,
//   className,
//   style,
//   fallbackLabel,
//   theme
// }: {
//   src?: string;
//   alt?: string;
//   className?: string;
//   style?: React.CSSProperties;
//   fallbackLabel?: string;
//   theme: any;
// }) {
//   const [url, setUrl] = React.useState<string>(src || '');
//   const [triedFallback, setTriedFallback] = React.useState(false);
//   React.useEffect(() => {
//     setUrl(src || '');
//     setTriedFallback(false);
//   }, [src]);
//   const ph = `https://placehold.co/1280x720/png?text=${encodeURIComponent(fallbackLabel || alt || 'Gambar')}`;
//   const finalUrl = url || ph;
//   return (
//     <img
//       src={finalUrl}
//       alt={alt || ''}
//       className={className}
//       style={style}
//       loading="lazy"
//       decoding="async"
//       onError={() => {
//         if (!triedFallback) {
//           setUrl(ph);
//           setTriedFallback(true);
//         } else {
//           setUrl(svgFallback(fallbackLabel || alt || 'Gambar', 800, 450, theme));
//         }
//       }}
//     />
//   );
// }

// // === REACT-QUERY HOOK ===
// const usePramukaData = () => {
//   const xHost = getXHostHeader();
//   return useQuery({
//     queryKey: ['pramuka', xHost],
//     queryFn: async () => {
//       const res = await fetch("https://dev.kiraproject.id/pramuka", {
//         cache: 'no-store',
//         headers: {
//           'X-Host': xHost,
//           'Cache-Control': 'no-store',
//         },
//       });
//       if (!res.ok) throw new Error("Failed to fetch pramuka data");
//       const result: any = await res.json();

//       return result.data.map((pramuka: any): Kegiatan => ({
//         id: pramuka.id.toString(),
//         judul: pramuka.nama,
//         jenis: pramuka.tingkat,
//         tanggal: pramuka.jadwalKegiatan,
//         lokasi: pramuka.lokasi,
//         penanggungJawab: pramuka.penanggungJawab || "Pembina",
//         peserta: pramuka.peserta || 0,
//         deskripsi: pramuka.deskripsi,
//         dokumentasi: pramuka.thumbnail
//           ? [{ name: pramuka.nama, url: pramuka.thumbnail, type: 'image/jpeg' as const }]
//           : [],
//         kegiatan: (pramuka.kegiatan || []).map((k: any) => ({
//           id: k.id.toString(),
//           namaKegiatan: k.namaKegiatan,
//           deskripsi: k.deskripsi,
//           tanggal: k.tanggal,
//           lokasi: k.lokasi,
//           foto: k.foto,
//         })),
//       }));
//     },
//     staleTime: 0,
//     gcTime: 0,
//     placeholderData: DEMO,
//     retry: 1,
//   });
// };

// // === ACTIVITY CARD ===
// function ActivityCard({
//   kegiatan,
//   onOpenDetail,
//   onOpenViewer,
//   theme,
// }: {
//   kegiatan: Kegiatan;
//   onOpenDetail: (k: Kegiatan) => void;
//   onOpenViewer: (items: DocItem[], idx: number) => void;
//   theme: any;
// }) {
//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0 }}
//       className="rounded-xl overflow-hidden border group"
//       style={{ borderColor: theme.border, background: `${theme.surface}cc` }}
//     >
//       <div className="relative">
//         <img src="/pramuka.jpg" alt="image-card" className="w-full h-48 object-cover" />
//         <div className="absolute top-2 left-2 bg-black/60 text-xs px-2 py-1 rounded">
//           {kegiatan.jenis}
//         </div>
//         <div className="absolute bottom-2 left-2 bg-black/60 text-xs px-2 py-1 rounded inline-flex items-center gap-1">
//           <Calendar size={14} />
//           {kegiatan.tanggal}
//         </div>
//       </div>
//       <div className="p-3">
//         <h3 className="font-semibold line-clamp-2 mb-1" style={{ color: theme.surfaceText }}>{kegiatan.judul}</h3>
//         <div className="text-xs opacity-80 flex items-center gap-2 mb-2" style={{ color: theme.surfaceText }}>
//           <MapPin size={14} />
//           <span className="line-clamp-1">{kegiatan.lokasi}</span>
//         </div>
//         <div className="flex items-center text-xs opacity-80 mb-3" style={{ color: theme.surfaceText }}>
//           <span className="inline-flex items-center gap-1">
//             <Users size={14} /> {kegiatan.peserta} Peserta
//           </span>
//         </div>
//         <div className="flex items-center gap-2">
//           <button 
//             className="btn-yellow" 
//             onClick={() => onOpenDetail(kegiatan)}
//             style={{ background: 'black', color: "#000" }}
//           >
//             <Images size={16} /> Lihat Detail
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// // === DETAIL MODAL ===
// function DetailModal({
//   detail,
//   onClose,
//   onOpenViewer,
//   theme,
// }: {
//   detail: Kegiatan;
//   onClose: () => void;
//   onOpenViewer: (items: DocItem[], idx: number) => void;
//   theme: any;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//     >
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.95, opacity: 0 }}
//         className="rounded-2xl p-6 max-w-2xl w-full mx-4 text-white border"
//         style={{ 
//           background: theme.surface + "ee", 
//           borderColor: theme.border,
//           color: theme.surfaceText
//         }}
//       >
//         <h2 className="text-xl font-bold mb-4">{detail.judul}</h2>
//         <p className="text-sm opacity-80 mb-4">{detail.deskripsi}</p>
//         <div className="text-sm mb-4 space-y-1">
//           <p><strong>Tingkat:</strong> {detail.jenis}</p>
//           <p><strong>Jadwal:</strong> {detail.tanggal}</p>
//           <p><strong>Lokasi:</strong> {detail.lokasi}</p>
//           <p><strong>Peserta:</strong> {detail.peserta} Peserta</p>
//         </div>
//         <h3 className="text-lg font-semibold mb-2">Daftar Kegiatan</h3>
//         {detail.kegiatan && detail.kegiatan.length > 0 ? (
//           <div className="space-y-3">
//             {detail.kegiatan.map((k) => (
//               <div
//                 key={k.id}
//                 className="rounded-lg border p-3"
//                 style={{ borderColor: theme.border, background: theme.surface }}
//               >
//                 <h4 className="font-semibold" style={{ color: theme.surfaceText }}>{k.namaKegiatan}</h4>
//                 <p className="text-xs opacity-80" style={{ color: theme.surfaceText }}>{k.deskripsi}</p>
//                 <p className="text-xs opacity-80" style={{ color: theme.surfaceText }}>
//                   <strong>Tanggal:</strong>{" "}
//                   {new Date(k.tanggal).toLocaleDateString("id-ID", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })}
//                 </p>
//                 <p className="text-xs opacity-80" style={{ color: theme.surfaceText }}>
//                   <strong>Lokasi:</strong> {k.lokasi}
//                 </p>
//                 {k.foto && (
//                   <button
//                     className="btn-yellow text-xs mt-2"
//                     onClick={() => onOpenViewer([{ name: k.namaKegiatan, url: k.foto, type: 'image/jpeg' }], 0)}
//                     style={{ background: 'black', color: "#000" }}
//                   >
//                     Lihat Foto
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-sm opacity-80" style={{ color: theme.surfaceText }}>Tidak ada kegiatan terkait.</p>
//         )}
//         <div className="flex justify-end gap-2 mt-4">
//           <button className="btn-ghost" onClick={onClose} style={{ color: theme.surfaceText }}>
//             Tutup
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// // === LIGHTBOX ===
// function Lightbox({
//   viewer,
//   onClose,
//   onNext,
//   onPrev,
//   theme,
// }: {
//   viewer: { open: boolean; items: DocItem[]; idx: number };
//   onClose: () => void;
//   onNext: () => void;
//   onPrev: () => void;
//   theme: any;
// }) {
//   if (!viewer.open) return null;
//   const item = viewer.items[viewer.idx];
//   return (
//     <div className="fixed inset-0 z-[60]">
//       <div className="absolute inset-0 bg-black/80" onClick={onClose} />
//       <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
//         <div className="mb-3 text-sm opacity-80 line-clamp-1 max-w-[90vw]" style={{ color: theme.surfaceText }}>
//           {item?.name}
//         </div>
//         <div className="relative max-w-[90vw] max-h-[80vh] bg-black/40 rounded-xl overflow-hidden border" style={{ borderColor: theme.border }}>
//           {isImage(item?.type) ? (
//             <SafeImg src={item?.url} alt="dok" className="object-contain max-h-[80vh] max-w-[90vw]" fallbackLabel={item?.name || 'Gambar'} theme={theme} />
//           ) : isVideo(item?.type) ? (
//             <video src={item?.url} controls className="object-contain max-h-[80vh] max-w-[90vw]" />
//           ) : (
//             <div className="p-6 text-center text-white/70">
//               Tidak dapat menampilkan pratinjau. <a className="underline" href={item?.url} target="_blank" rel="noreferrer">Buka</a>
//             </div>
//           )}
//           <button onClick={onClose} className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 rounded-full p-2" aria-label="Tutup">
//             <X />
//           </button>
//           {viewer.items.length > 1 && (
//             <>
//               <button onClick={onPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2" aria-label="Sebelumnya">
//                 <ChevronLeft />
//               </button>
//               <button onClick={onNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2" aria-label="Berikutnya">
//                 <ChevronRight />
//               </button>
//             </>
//           )}
//         </div>
//         {viewer.items.length > 1 && (
//           <div className="mt-3 flex gap-2 flex-wrap justify-center max-w-[90vw]">
//             {viewer.items.map((it, i) => (
//               <button
//                 key={i}
//                 onClick={() => setViewer(v => ({ ...v, idx: i }))}
//                 className={`w-14 h-14 rounded overflow-hidden border ${i === viewer.idx ? 'border-white' : 'border-white/20'}`}
//               >
//                 {isImage(it.type) ? (
//                   <SafeImg src={it.url} alt={it.name || 'thumb'} className="w-full h-full object-cover" theme={theme} />
//                 ) : isVideo(it.type) ? (
//                   <div className="w-full h-full grid place-items-center text-xs">Play Video</div>
//                 ) : (
//                   <div className="w-full h-full grid place-items-center text-xs">Document</div>
//                 )}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // === STYLE INJECTOR ===
// function StyleInjector({ theme }: { theme: any }) {
//   useEffect(() => {
//     const style = document.createElement('style');
//     style.innerHTML = `
//       .btn-yellow{ background:${'black'}; color:#000; border:1px solid ${theme.border}; border-radius:0.75rem; padding:0.5rem 0.75rem; display:inline-flex; align-items:center; gap:6px; font-weight:500; }
//       .btn-ghost{ background:${theme.surface}; border:1px solid ${theme.border}; color:${theme.surfaceText}; border-radius:0.5rem; padding:0.35rem 0.6rem; display:inline-flex; align-items:center; gap:6px; font-size:0.875rem; }
//       .chip{ background:${theme.surface}; border:1px solid ${theme.border}; color:${theme.surfaceText}; border-radius:999px; padding:0.25rem 0.6rem; font-size:12px; }
//       .chip-on{ background:${'black'}; color:#000; }
//     `;
//     document.head.appendChild(style);
//     return () => { try { document.head.removeChild(style); } catch { } };
//   }, [theme]);
//   return null;
// }

// // === MAIN COMPONENT ===
// export function PramukaMain() {
//   const queryClient = useQueryClient();
//   const schoolInfo = SMAN25_CONFIG;
//   const theme = schoolInfo.theme;
//   const shortName = "";

//   const { data: rows = DEMO, isPending: busy, error } = usePramukaData();

//   const [detail, setDetail] = useState<Kegiatan | null>(null);
//   const [viewer, setViewer] = useState<{ open: boolean; items: DocItem[]; idx: number }>({ open: false, items: [], idx: 0 });

//   // Invalidate cache saat domain berubah
//   useEffect(() => {
//     queryClient.invalidateQueries({ queryKey: ['pramuka'] });
//   }, [queryClient]);

//   // Deep-link (#k={id})
//   useEffect(() => {
//     const openFromHash = () => {
//       const h = new URL(location.href).hash;
//       const id = h.startsWith("#k=") ? h.slice(3) : "";
//       if (!id) return;
//       const k = rows.find((r) => r.id === id);
//       if (k) setDetail(k);
//     };
//     openFromHash();
//     const onHash = () => openFromHash();
//     window.addEventListener("hashchange", onHash);
//     return () => window.removeEventListener("hashchange", onHash);
//   }, [rows]);

//   const sortedRows = useMemo(
//     () => rows.slice().sort((a, b) => (a.tanggal > b.tanggal ? -1 : a.tanggal < b.tanggal ? 1 : 0)),
//     [rows]
//   );

//   const [show, setShow] = useState(9);
//   const page = useMemo(() => sortedRows.slice(0, show), [sortedRows, show]);

//   const openDetail = useCallback((k: Kegiatan) => {
//     setDetail(k);
//     try { history.replaceState(null, "", `#k=${k.id}`); } catch { }
//   }, []);

//   const closeDetail = useCallback(() => {
//     setDetail(null);
//     try { if (location.hash.startsWith("#k=")) history.replaceState(null, "", location.pathname + location.search); } catch { }
//   }, []);

//   const openViewer = useCallback((items: DocItem[], idx: number = 0) => {
//     setViewer({ open: true, items, idx });
//   }, []);

//   const closeViewer = useCallback(() => {
//     setViewer((v) => ({ ...v, open: false }));
//   }, []);

//   const nextViewer = useCallback(() => {
//     setViewer((v) => ({ ...v, idx: (v.idx + 1) % (v.items.length || 1) }));
//   }, []);

//   const prevViewer = useCallback(() => {
//     setViewer((v) => ({
//       ...v,
//       idx: (v.idx - 1 + (v.items.length || 1)) % (v.items.length || 1),
//     }));
//   }, []);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && detail) closeDetail();
//       if (e.key === "Escape" && viewer.open) closeViewer();
//       if (e.key === "ArrowRight" && viewer.open) nextViewer();
//       if (e.key === "ArrowLeft" && viewer.open) prevViewer();
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [detail, viewer.open, closeDetail, closeViewer, nextViewer, prevViewer]);

//   return (
//     <div className="min-h-screen" style={{ background: theme.bg }}>
//       <NavbarComp theme={theme} />

//       <main
//         className="text-white"
//         style={{
//           background: `radial-gradient(1000px 600px at 10% -10%, ${'black'}22, transparent)`,
//         }}
//       >
//         <div className="max-w-6xl mx-auto px-4 py-6">
//           {/* HERO */}
//           <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
//             <div
//               className="rounded-3xl p-5 border overflow-hidden"
//               style={{
//                 borderColor: theme.border,
//                 background: `linear-gradient(135deg, ${theme.primary}, ${theme.bg})`,
//               }}
//             >
//               <div className="flex items-center gap-4">
//                 <div 
//                   className="w-14 h-14 rounded-full border grid place-items-center text-xs font-semibold"
//                   style={{ 
//                     background: theme.surface + "20", 
//                     borderColor: theme.border,
//                     color: theme.primaryText
//                   }}
//                 >
//                   {shortName}
//                 </div>
//                 <div>
//                   <div className="text-sm opacity-80" style={{ color: theme.primaryText }}>Beranda / Pramuka</div>
//                   <h1 className="text-2xl font-bold" style={{ color: theme.primaryText }}>Pramuka</h1>
//                   <p className="text-sm opacity-80" style={{ color: theme.primaryText }}>Galeri Kegiatan & Dokumentasi</p>
//                 </div>
//               </div>
//             </div>
//           </motion.section>

//           {/* Error */}
//           {error && (
//             <div
//               className="rounded-xl border p-4 mb-4 text-center"
//               style={{ 
//                 borderColor: theme.border, 
//                 background: theme.surface,
//                 color: theme.surfaceText 
//               }}
//             >
//               {error.message || "Gagal memuat data pramuka. Menggunakan data demo."}
//             </div>
//           )}

//           {/* Cards */}
//           <AnimatePresence mode="popLayout">
//             {busy ? (
//               <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {[...Array(3)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className="rounded-xl border p-4 animate-pulse"
//                     style={{ borderColor: theme.border, background: `${theme.surface}cc` }}
//                   >
//                     <div className="h-48 bg-white/20 rounded mb-3" />
//                     <div className="h-6 bg-white/20 rounded w-3/4 mb-2" />
//                     <div className="h-4 bg-white/20 rounded w-1/2 mb-2" />
//                     <div className="h-4 bg-white/20 rounded w-1/3" />
//                   </motion.div>
//                 ))}
//               </motion.div>
//             ) : page.length ? (
//               <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {page.map((k) => (
//                   <ActivityCard key={k.id} kegiatan={k} onOpenDetail={openDetail} onOpenViewer={openViewer} theme={theme} />
//                 ))}
//               </motion.div>
//             ) : (
//               <motion.div
//                 className="rounded-xl border p-6 text-center"
//                 style={{ 
//                   borderColor: theme.border, 
//                   background: theme.surface,
//                   color: theme.surfaceText 
//                 }}
//               >
//                 Tidak ada data pramuka yang tersedia.
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {show < sortedRows.length && (
//             <div className="flex justify-center mt-6">
//               <button 
//                 className="btn-ghost" 
//                 onClick={() => setShow((s) => s + 9)} 
//                 disabled={busy}
//                 style={{ color: theme.surfaceText }}
//               >
//                 Muat Lebih
//               </button>
//             </div>
//           )}
//         </div>
//       </main>

//       <FooterComp theme={theme} />

//       {detail && <DetailModal detail={detail} onClose={closeDetail} onOpenViewer={openViewer} theme={theme} />}
//       <Lightbox viewer={viewer} onClose={closeViewer} onNext={nextViewer} onPrev={prevViewer} theme={theme} />
//       <StyleInjector theme={theme} />
//     </div>
//   );
// }


import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
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

/****************************
 * HERO SECTION UNTUK PRAMUKA
 ****************************/
const HeroSection = () => {
  const scrollToContent = () => {
    document.querySelector("main")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      {/* Background Image - Representatif kegiatan Pramuka */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/pramuka.jpg')`, // Gunakan foto Pramuka yang representatif
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

// === NAVIGATION ===
type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};
const NAV: NavItem[] = [
  { label: "Beranda", href: "/dashboard" },
  { label: "Pramuka", href: "/pramuka" },
  { label: "Profil", children: [
      { label: "Sambutan", href: "/sambutan" },
      { label: "Visi & Misi", href: "/visiMisi" },
      { label: "Sejarah", href: "/sejarah" },
      { label: "Struktur", href: "/struktur" },
      { label: "Galeri", href: "/galeri" },
    ]},
  { label: "Akademik", children: [
      { label: "Kurikulum", href: "/kurikulum" },
      { label: "Kalender", href: "/kalender" },
      { label: "Jadwal", href: "/jadwal" },
      { label: "Guru & Tendik", href: "/guru-tendik" },
    ]},
  { label: "Kesiswaan", children: [
      { label: "OSIS", href: "/osis" },
      { label: "Pemilihan OSIS", href: "/kandidatosis" },
      { label: "Ekstrakurikuler", href: "/ekstrakulikuler" },
      { label: "Prestasi", href: "/prestasi" },
    ]},
  { label: "Perpustakaan", href: "/perpustakaan" },
  { label: "Informasi", children: [
      { label: "Pengumuman", href: "/pengumuman" },
      { label: "Berita", href: "/berita" },
      { label: "Agenda", href: "/agenda" },
      { label: "Buku alumni", href: "/buku-alumni" },
      { label: "PPDB", href: "/ppdb" },
      { label: "PPID", href: "/ppid" },
      { label: "Layanan", href: "/layanan" },
      { label: "Kelulusan", href: "/kelulusan" },
    ]},
  { label: "Galeri", href: "/dashboard#galeri" },
];

const PPDB_PERIOD = {
  start: new Date("2025-05-01T00:00:00+07:00"),
  end: new Date("2025-07-31T23:59:59+07:00"),
};
const isWithinPeriod = (now: Date, { start, end }: { start: Date; end: Date }) => now >= start && now <= end;

// === UTILITIES ===
const useOnClickOutside = (ref: React.RefObject<HTMLElement>, handler: (e: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (e: any) => {
      if (!ref.current || (e.target instanceof Node && ref.current.contains(e.target))) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// === TYPES ===
export type Jenis = "Latihan" | "Perkemahan" | "Lomba" | "Bakti" | "Rapat" | "Kursus";
export type Status = "Draft" | "Ajukan" | "Disetujui" | "Selesai";
export type DocItem = {
  name: string;
  url: string;
  type?: 'image/png' | 'image/jpeg' | 'video/mp4' | 'application/pdf';
  size?: number;
};
export type Kegiatan = {
  id: string;
  tenant?: string;
  judul: string;
  jenis: Jenis;
  tanggal: string;
  lokasi: string;
  penanggungJawab: string;
  peserta: number;
  status?: Status;
  webSekolah?: string;
  dokumentasi?: DocItem[];
  deskripsi?: string;
  kegiatan?: Array<{
    id: string;
    namaKegiatan: string;
    deskripsi: string;
    tanggal: string;
    lokasi: string;
    foto?: string;
  }>;
};

// === DEMO DATA ===
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
    status: "Disetujui",
    webSekolah: "https://sdn05.example.sch.id/berita/latihan",
    dokumentasi: [
      { name: "pembukaan.jpg", url: "https://placehold.co/1280x720/png?text=Pembukaan%20Pramuka", type: "image/png" },
      { name: "senam.jpg", url: "https://placehold.co/1280x720/png?text=Senam%20Pagi", type: "image/png" },
      { name: "yell.mp4", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", type: "video/mp4" }
    ]
  }
];

// === UTILS ===
function isImage(t?: string) { return !!t && t.startsWith('image/'); }
function isVideo(t?: string) { return !!t && t.startsWith('video/'); }

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

// === REACT-QUERY HOOK ===
const usePramukaData = () => {
  const xHost = getXHostHeader();
  return useQuery({
    queryKey: ['pramuka', xHost],
    queryFn: async () => {
      const res = await fetch("https://dev.kiraproject.id/pramuka", {
        cache: 'no-store',
        headers: {
          'X-Host': xHost,
          'Cache-Control': 'no-store',
        },
      });
      if (!res.ok) throw new Error("Failed to fetch pramuka data");
      const result: any = await res.json();

      return result.data.map((pramuka: any): Kegiatan => ({
        id: pramuka.id.toString(),
        judul: pramuka.nama,
        jenis: pramuka.tingkat,
        tanggal: pramuka.jadwalKegiatan,
        lokasi: pramuka.lokasi,
        penanggungJawab: pramuka.penanggungJawab || "Pembina",
        peserta: pramuka.peserta || 0,
        deskripsi: pramuka.deskripsi,
        dokumentasi: pramuka.thumbnail
          ? [{ name: pramuka.nama, url: pramuka.thumbnail, type: 'image/jpeg' as const }]
          : [],
        kegiatan: (pramuka.kegiatan || []).map((k: any) => ({
          id: k.id.toString(),
          namaKegiatan: k.namaKegiatan,
          deskripsi: k.deskripsi,
          tanggal: k.tanggal,
          lokasi: k.lokasi,
          foto: k.foto,
        })),
      }));
    },
    staleTime: 0,
    gcTime: 0,
    placeholderData: DEMO,
    retry: 1,
  });
};

// === ACTIVITY CARD ===
function ActivityCard({
  kegiatan,
  onOpenDetail,
  onOpenViewer,
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
      className="rounded-xl overflow-hidden border group"
      style={{ borderColor: theme.border, background: `${theme.surface}cc` }}
    >
      <div className="relative">
        <img src="/pramuka.jpg" alt="image-card" className="w-full h-48 object-cover" />
        <div className="absolute top-2 left-2 bg-black/60 text-xs px-2 py-1 rounded">
          {kegiatan.jenis}
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 text-xs px-2 py-1 rounded inline-flex items-center gap-1">
          <Calendar size={14} />
          {kegiatan.tanggal}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold line-clamp-2 mb-1" style={{ color: theme.surfaceText }}>{kegiatan.judul}</h3>
        <div className="text-xs opacity-80 flex items-center gap-2 mb-2" style={{ color: theme.surfaceText }}>
          <MapPin size={14} />
          <span className="line-clamp-1">{kegiatan.lokasi}</span>
        </div>
        <div className="flex items-center text-xs opacity-80 mb-3" style={{ color: theme.surfaceText }}>
          <span className="inline-flex items-center gap-1">
            <Users size={14} /> {kegiatan.peserta} Peserta
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="btn-yellow" 
            onClick={() => onOpenDetail(kegiatan)}
            style={{ background: 'black', color: "#000" }}
          >
            <Images size={16} /> Lihat Detail
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// === DETAIL MODAL ===
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
        <p className="text-sm opacity-80 mb-4">{detail.deskripsi}</p>
        <div className="text-sm mb-4 space-y-1">
          <p><strong>Tingkat:</strong> {detail.jenis}</p>
          <p><strong>Jadwal:</strong> {detail.tanggal}</p>
          <p><strong>Lokasi:</strong> {detail.lokasi}</p>
          <p><strong>Peserta:</strong> {detail.peserta} Peserta</p>
        </div>
        <h3 className="text-lg font-semibold mb-2">Daftar Kegiatan</h3>
        {detail.kegiatan && detail.kegiatan.length > 0 ? (
          <div className="space-y-3">
            {detail.kegiatan.map((k) => (
              <div
                key={k.id}
                className="rounded-lg border p-3"
                style={{ borderColor: theme.border, background: theme.surface }}
              >
                <h4 className="font-semibold" style={{ color: theme.surfaceText }}>{k.namaKegiatan}</h4>
                <p className="text-xs opacity-80" style={{ color: theme.surfaceText }}>{k.deskripsi}</p>
                <p className="text-xs opacity-80" style={{ color: theme.surfaceText }}>
                  <strong>Tanggal:</strong>{" "}
                  {new Date(k.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs opacity-80" style={{ color: theme.surfaceText }}>
                  <strong>Lokasi:</strong> {k.lokasi}
                </p>
                {k.foto && (
                  <button
                    className="btn-yellow text-xs mt-2"
                    onClick={() => onOpenViewer([{ name: k.namaKegiatan, url: k.foto, type: 'image/jpeg' }], 0)}
                    style={{ background: 'black', color: "#000" }}
                  >
                    Lihat Foto
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm opacity-80" style={{ color: theme.surfaceText }}>Tidak ada kegiatan terkait.</p>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn-ghost" onClick={onClose} style={{ color: theme.surfaceText }}>
            Tutup
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// === LIGHTBOX ===
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
          ) : isVideo(item?.type) ? (
            <video src={item?.url} controls className="object-contain max-h-[80vh] max-w-[90vw]" />
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
        {viewer.items.length > 1 && (
          <div className="mt-3 flex gap-2 flex-wrap justify-center max-w-[90vw]">
            {viewer.items.map((it, i) => (
              <button
                key={i}
                onClick={() => setViewer(v => ({ ...v, idx: i }))}
                className={`w-14 h-14 rounded overflow-hidden border ${i === viewer.idx ? 'border-white' : 'border-white/20'}`}
              >
                {isImage(it.type) ? (
                  <SafeImg src={it.url} alt={it.name || 'thumb'} className="w-full h-full object-cover" theme={theme} />
                ) : isVideo(it.type) ? (
                  <div className="w-full h-full grid place-items-center text-xs">Play Video</div>
                ) : (
                  <div className="w-full h-full grid place-items-center text-xs">Document</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// === STYLE INJECTOR ===
function StyleInjector({ theme }: { theme: any }) {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .btn-yellow{ background:${'black'}; color:#000; border:1px solid ${theme.border}; border-radius:0.75rem; padding:0.5rem 0.75rem; display:inline-flex; align-items:center; gap:6px; font-weight:500; }
      .btn-ghost{ background:${theme.surface}; border:1px solid ${theme.border}; color:${theme.surfaceText}; border-radius:0.5rem; padding:0.35rem 0.6rem; display:inline-flex; align-items:center; gap:6px; font-size:0.875rem; }
      .chip{ background:${theme.surface}; border:1px solid ${theme.border}; color:${theme.surfaceText}; border-radius:999px; padding:0.25rem 0.6rem; font-size:12px; }
      .chip-on{ background:${'black'}; color:#000; }
    `;
    document.head.appendChild(style);
    return () => { try { document.head.removeChild(style); } catch { } };
  }, [theme]);
  return null;
}

// === MAIN COMPONENT DENGAN HERO ===
export function PramukaMain() {
  const queryClient = useQueryClient();
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const shortName = "";

  const { data: rows = DEMO, isPending: busy, error } = usePramukaData();

  const [detail, setDetail] = useState<Kegiatan | null>(null);
  const [viewer, setViewer] = useState<{ open: boolean; items: DocItem[]; idx: number }>({ open: false, items: [], idx: 0 });

  // Invalidate cache saat domain berubah
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['pramuka'] });
  }, [queryClient]);

  // Deep-link (#k={id})
  useEffect(() => {
    const openFromHash = () => {
      const h = new URL(location.href).hash;
      const id = h.startsWith("#k=") ? h.slice(3) : "";
      if (!id) return;
      const k = rows.find((r) => r.id === id);
      if (k) setDetail(k);
    };
    openFromHash();
    const onHash = () => openFromHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [rows]);

  const sortedRows = useMemo(
    () => rows.slice().sort((a, b) => (a.tanggal > b.tanggal ? -1 : a.tanggal < b.tanggal ? 1 : 0)),
    [rows]
  );

  const [show, setShow] = useState(9);
  const page = useMemo(() => sortedRows.slice(0, show), [sortedRows, show]);

  const openDetail = useCallback((k: Kegiatan) => {
    setDetail(k);
    try { history.replaceState(null, "", `#k=${k.id}`); } catch { }
  }, []);

  const closeDetail = useCallback(() => {
    setDetail(null);
    try { if (location.hash.startsWith("#k=")) history.replaceState(null, "", location.pathname + location.search); } catch { }
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
      if (e.key === "Escape" && detail) closeDetail();
      if (e.key === "Escape" && viewer.open) closeViewer();
      if (e.key === "ArrowRight" && viewer.open) nextViewer();
      if (e.key === "ArrowLeft" && viewer.open) prevViewer();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [detail, viewer.open, closeDetail, closeViewer, nextViewer, prevViewer]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* HERO SECTION BARU */}
      <HeroSection />

      <main
        className="text-white"
        style={{
          background: `radial-gradient(1000px 600px at 10% -10%, ${'black'}22, transparent)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* HERO LAMA (breadcrumb + title) DIPINDAHKAN KE BAWAH HERO BARU */}
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
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
                  <img src="/pramuka.jpg" alt="gambar" className="w-full h-full" />
                </div>
                <div>
                  <div className="text-sm opacity-80" style={{ color: theme.primaryText }}>Beranda / Pramuka</div>
                  <h1 className="text-2xl font-bold" style={{ color: theme.primaryText }}>Pramuka</h1>
                  <p className="text-sm opacity-80" style={{ color: theme.primaryText }}>Galeri Kegiatan & Dokumentasi</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Error */}
          {error && (
            <div
              className="rounded-xl border p-4 mb-4 text-center"
              style={{ 
                borderColor: theme.border, 
                background: theme.surface,
                color: theme.surfaceText 
              }}
            >
              {error.message || "Gagal memuat data pramuka. Menggunakan data demo."}
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
                  <ActivityCard key={k.id} kegiatan={k} onOpenDetail={openDetail} onOpenViewer={openViewer} theme={theme} />
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
                Tidak ada data pramuka yang tersedia.
              </motion.div>
            )}
          </AnimatePresence>

          {show < sortedRows.length && (
            <div className="flex justify-center mt-6">
              <button 
                className="btn-ghost" 
                onClick={() => setShow((s) => s + 9)} 
                disabled={busy}
                style={{ color: theme.surfaceText }}
              >
                Muat Lebih
              </button>
            </div>
          )}
        </div>
      </main>

      <FooterComp theme={theme} />

      {detail && <DetailModal detail={detail} onClose={closeDetail} onOpenViewer={openViewer} theme={theme} />}
      <Lightbox viewer={viewer} onClose={closeViewer} onNext={nextViewer} onPrev={prevViewer} theme={theme} />
      <StyleInjector theme={theme} />
    </div>
  );
}