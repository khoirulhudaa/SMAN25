// import { SMAN25_CONFIG } from '@/core/theme';
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { AnimatePresence, motion } from "framer-motion";
// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// /****************************
//  * PLACEHOLDER AVATAR
//  ****************************/
// const PLACEHOLDER_AVATAR = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
// <svg xmlns="http://www.w3.org/2000/svg" width="400" height="320">
//   <defs>
//     <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
//       <stop offset="0" stop-color="%23a7c7ff"/>
//       <stop offset="1" stop-color="%23f2c94c"/>
//     </linearGradient>
//   </defs>
//   <rect width="100%" height="100%" fill="%230B1733"/>
//   <rect x="8" y="8" width="384" height="304" rx="18" fill="url(%23g)" fill-opacity="0.18"/>
//   <circle cx="200" cy="130" r="58" fill="%23ffffff" fill-opacity="0.18"/>
//   <rect x="90" y="220" width="220" height="16" rx="8" fill="%23ffffff" fill-opacity="0.14"/>
// </svg>
// `);

// /****************************
//  * TYPES
//  ****************************/
// interface AlumniItem {
//   id: string;
//   name: string;
//   title: string;
//   handle: string;
//   status: string;
//   avatarUrl: string;
//   jurusan: string;
//   angkatan: string;
//   jenjang?: string;
//   ig?: string;
//   linkedin?: string;
//   facebook?: string;
//   kampus?: string;
//   prodi?: string;
//   perusahaan?: string;
//   likes: number;
//   liked: boolean;
//   thumbs: number;
//   thumbed: boolean;
//   shares: number;
//   shared: boolean;
// }

// /****************************
//  * SOCIAL ICONS
//  ****************************/
// const IconInstagram: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
//     <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm6.25-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z"/>
//   </svg>
// );

// const IconLinkedIn: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
//     <path d="M20.45 20.45h-3.56v-5.18c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.74v5.28H9.6V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.36-1.85c3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.13 20.45H3.54V9h3.59v11.45z"/>
//   </svg>
// );

// const IconFacebook: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
//     <path d="M22 12a10 10 0 1 0-11.56 9.9v-7h-2.3V12h2.3V9.8c0-2.27 1.35-3.53 3.42-3.53.99 0 2.02.18 2.02.18v2.22h-1.14c-1.12 0-1.47.7-1.47 1.41V12h2.5l-.4 2.9h-2.1v7A10 10 0 0 0 22 12z"/>
//   </svg>
// );

// /****************************
//  * SECURITY UTILS
//  ****************************/
// const SALT_KEY = "app:salt";
// function ensureSalt() {
//   let salt = localStorage.getItem(SALT_KEY);
//   if (!salt) {
//     try {
//       const arr = new Uint8Array(16);
//       crypto.getRandomValues(arr);
//       salt = Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
//       localStorage.setItem(SALT_KEY, salt);
//     } catch {
//       salt = "fallback-salt";
//     }
//   }
//   return salt;
// }
// async function sha256Hex(input: string) {
//   const enc = new TextEncoder().encode(input);
//   const buf = await crypto.subtle.digest("SHA-256", enc);
//   return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
// }
// async function signKV(key: string, value: string) {
//   const salt = ensureSalt();
//   return sha256Hex(`${key}:${value}:${salt}`);
// }
// function sigKey(key: string) { return `sig:${key}`; }

// /****************************
//  * INLINE PROFILE CARD
//  ****************************/
// interface InlineProfileCardProps {
//   avatarUrl: string;
//   name?: string;
//   title?: string;
//   handle?: string;
//   showUserInfo?: boolean;
//   enableTilt?: boolean;
//   angkatan?: string;
//   jurusan?: string;
//   jenjang?: string;
//   ig?: string;
//   linkedin?: string;
//   facebook?: string;
//   kampus?: string;
//   prodi?: string;
//   perusahaan?: string;
//   height?: number;
//   onLike?: () => void;
//   onThumb?: () => void;
//   onShare?: () => void;
//   likes?: number;
//   liked?: boolean;
//   thumbs?: number;
//   thumbed?: boolean;
//   shares?: number;
//   shared?: boolean;
//   theme: any;
// }

// const InlineProfileCard: React.FC<InlineProfileCardProps> = ({
//   avatarUrl,
//   name = 'Nama Alumni',
//   title = 'Profesi / Posisi',
//   handle = 'handle',
//   showUserInfo = true,
//   enableTilt = true,
//   angkatan,
//   jurusan,
//   jenjang,
//   ig,
//   linkedin,
//   facebook,
//   kampus,
//   prodi,
//   perusahaan,
//   height = 320,
//   onLike,
//   onThumb,
//   onShare,
//   likes = 0,
//   liked = false,
//   thumbs = 0,
//   thumbed = false,
//   shares = 0,
//   shared = false,
//   theme,
// }) => {
//   const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
//   const [mouse, setMouse] = useState({ mx: 50, my: 50 });
//   const [hovered, setHovered] = useState(false);

//   const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const px = (x / rect.width) * 2 - 1;
//     const py = (y / rect.height) * 2 - 1;
//     const max = 8;
//     setMouse({ mx: (x / rect.width) * 100, my: (y / rect.height) * 100 });
//     if (!enableTilt) return;
//     setTilt({ rx: -(py * max), ry: px * max });
//   }, [enableTilt]);

//   const onLeave = useCallback(() => {
//     if (enableTilt) setTilt({ rx: 0, ry: 0 });
//     setMouse({ mx: 50, my: 50 });
//     setHovered(false);
//   }, [enableTilt]);

//   const cardStyle: React.CSSProperties = {
//     borderColor: theme.border,
//     background: theme.type === 'SMKN'
//       ? 'linear-gradient(145deg, rgba(113,196,255,0.08), rgba(31,59,118,0.12))'
//       : 'linear-gradient(145deg, rgba(251,191,36,0.12), rgba(14,116,144,0.08))',
//     transform: `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
//     transition: 'transform 180ms ease',
//     boxShadow: theme.type === 'SMKN'
//       ? 'inset 0 0 0 1px rgba(242,201,76,0.35), 0 18px 40px rgba(31,59,118,0.35)'
//       : 'inset 0 0 0 1px rgba(251,191,36,0.25), 0 12px 32px rgba(0,0,0,0.08)',
//   };

//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.95 }}
//       onMouseMove={onMove}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={onLeave}
//       className="relative overflow-hidden rounded-[28px]"
//       style={{ height }}
//     >
//       <div
//         className="pointer-events-none absolute inset-0 rounded-[28px]"
//         style={{
//           background: `radial-gradient(380px 260px at ${mouse.mx}% ${mouse.my}%, ${theme.gold}22, ${theme.primary}18 35%, transparent 70%),
//                        radial-gradient(60% 80% at 50% 110%, ${theme.surface}88, transparent 60%)`,
//           filter: 'blur(42px) saturate(1.2)',
//           opacity: hovered ? 0.95 : 0.55,
//           transition: 'opacity 160ms ease',
//         }}
//       />

//       <div className="relative overflow-hidden rounded-2xl border" style={cardStyle}>
//         <div
//           className="pointer-events-none absolute inset-0 rounded-[22px]"
//           style={{
//             background: `radial-gradient(40% 60% at 20% 0%, ${theme.primary}28, transparent 70%),
//                          radial-gradient(45% 65% at 85% 20%, ${theme.gold}22, transparent 70%)`,
//             mixBlendMode: 'screen',
//             opacity: hovered ? 1 : 0,
//             transition: 'opacity 180ms ease',
//           }}
//         />
//         <div
//           className="pointer-events-none absolute inset-0"
//           style={{
//             background: `radial-gradient(360px 360px at ${mouse.mx}% ${mouse.my}%, ${theme.gold}45, ${theme.primary}38 35%, transparent 70%)`,
//             filter: 'blur(40px)',
//             opacity: hovered ? 1 : 0,
//             mixBlendMode: 'screen',
//             transition: 'opacity 180ms ease',
//           }}
//         />
//         <div
//           className="pointer-events-none absolute inset-0 rounded-[22px] shine-move"
//           style={{
//             background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.12) 45%, transparent 60%)',
//             mixBlendMode: 'screen',
//           }}
//         />

//         <img
//           src={avatarUrl || PLACEHOLDER_AVATAR}
//           alt={`${name} avatar`}
//           className="w-full h-full object-cover"
//           loading="lazy"
//           onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_AVATAR; }}
//         />

//         <div
//           className="pointer-events-none absolute inset-0"
//           style={{
//             background: theme.type === 'SMKN'
//               ? 'linear-gradient(to top, rgba(11,23,51,0.9), rgba(11,23,51,0.0) 60%)'
//               : 'linear-gradient(to top, rgba(248,250,252,0.9), rgba(248,250,252,0.0) 60%)',
//           }}
//         />

//         <div className="absolute left-4 right-4 top-4 text-left">
//           <h3 className="m-0 text-lg font-semibold" style={{ color: 'black', textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
//             {name}
//           </h3>
//           <p className="m-0 text-sm" style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 1px 4px rgba(0,0,0,0.65)' }}>
//             {title}
//           </p>
//         </div>

//         {showUserInfo && (
//           <div className="absolute left-4 right-4 bottom-4 flex justify-between items-end gap-2">
//             <div>
//               <div className="text-[12px]" style={{ color: 'black' }}>
//                 @{handle} • {angkatan && `Angkatan ${angkatan}`} {jurusan && `· ${jurusan}`}
//               </div>
//               <div className="mt-1 text-[11px] space-y-0.5" style={{ color: 'black' }}>
//                 {jenjang && (
//                   <span className="inline-block px-2 py-0.5 rounded-full border mr-2"
//                     style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)' }}>
//                     {jenjang}
//                   </span>
//                 )}
//               </div>
//             </div>
//             <div className="flex flex-col items-end gap-2">
//               <div className="flex gap-1">
//                 {ig && (
//                   <a href={ig.startsWith('http') ? ig : `https://instagram.com/${ig}`} target="_blank" rel="noreferrer"
//                     className="w-8 h-8 rounded-full border flex items-center justify-center hover:scale-110 transition"
//                     style={{ borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
//                     <IconInstagram />
//                   </a>
//                 )}
//                 {linkedin && (
//                   <a href={linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`} target="_blank" rel="noreferrer"
//                     className="w-8 h-8 rounded-full border flex items-center justify-center hover:scale-110 transition"
//                     style={{ borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
//                     <IconLinkedIn />
//                   </a>
//                 )}
//                 {facebook && (
//                   <a href={facebook.startsWith('http') ? facebook : `https://facebook.com/${facebook}`} target="_blank" rel="noreferrer"
//                     className="w-8 h-8 rounded-full border flex items-center justify-center hover:scale-110 transition"
//                     style={{ borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
//                     <IconFacebook />
//                   </a>
//                 )}
//               </div>
//               <div className="flex gap-2">
//                 <div className="group relative flex flex-col items-center">
//                   <button onClick={onLike} disabled={liked}
//                     className={`w-8 h-8 rounded-full border transition-all ${liked ? 'bg-rose-600 text-white border-rose-600' : 'bg-white/30 text-rose-600 border-white hover:bg-white/70 hover:scale-110'}`}
//                     aria-label={liked ? 'Disukai' : 'Love'}>
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mx-auto" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.936 0-3.597 1.126-4.312 2.733C11.285 4.876 9.624 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
//                     </svg>
//                   </button>
//                   <div className="text-xs mt-1 px-2 py-0.5 rounded-full bg-white/90 text-slate-800 font-medium shadow">{likes}</div>
//                 </div>
//                 <div className="group relative flex flex-col items-center">
//                   <button onClick={onThumb} disabled={thumbed}
//                     className={`w-8 h-8 rounded-full border transition-all ${thumbed ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/30 text-blue-600 border-white hover:bg-white/70 hover:scale-110'}`}
//                     aria-label={thumbed ? 'Dijempol' : 'Like'}>
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mx-auto" fill={thumbed ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
//                       <path d="M2 10h4v12H2zM22 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13 2 7.59 7.41C7.22 7.78 7 8.3 7 8.83V20c0 1.1.9 2 2 2h8c.78 0 1.48-.45 1.82-1.14l3.58-7.16c.37-.74.56-1.55.56-2.36V10z" />
//                     </svg>
//                   </button>
//                   <div className="text-xs mt-1 px-2 py-0.5 rounded-full bg-white/90 text-slate-800 font-medium shadow">{thumbs}</div>
//                 </div>
//                 <div className="group relative flex flex-col items-center">
//                   <button onClick={onShare}
//                     className={`w-8 h-8 rounded-full border transition-all ${shared ? 'bg-white/60' : 'bg-white/30 hover:bg-white/70 hover:scale-110'}`}
//                     aria-label="Share">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-auto">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M7 8l5-5 5 5M12 3v12m6 4H6a2 2 0 01-2-2V9" />
//                     </svg>
//                   </button>
//                   <div className="text-xs mt-1 px-2 py-0.5 rounded-full bg-white/90 text-slate-800 font-medium shadow">{shares}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// /****************************
//  * VIRTUALIZED GRID
//  ****************************/
// function VirtualizedGrid({ items, renderItem, theme }: { items: AlumniItem[]; renderItem: (a: AlumniItem, i: number) => React.ReactNode; theme: any }) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [range, setRange] = useState({ start: 0, end: 16, cols: 1 });

//   useEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;

//     const getCols = (w: number) => (w >= 1280 ? 4 : w >= 1024 ? 3 : w >= 640 ? 2 : 1);
//     let frame = 0;
//     const ROW_H = 440;

//     const recompute = () => {
//       const cols = getCols(el.clientWidth);
//       const y = el.scrollTop;
//       const vh = el.clientHeight;
//       const startRow = Math.max(0, Math.floor(y / ROW_H) - 2);
//       const endRow = Math.ceil((y + vh) / ROW_H) + 2;
//       const start = startRow * cols;
//       const end = Math.min(items.length, endRow * cols);
//       setRange({ start, end, cols });
//     };

//     const onScroll = () => {
//       if (frame) return;
//       frame = requestAnimationFrame(() => { frame = 0; recompute(); });
//     };
//     const onResize = () => {
//       if (frame) return;
//       frame = requestAnimationFrame(() => { frame = 0; recompute(); });
//     };

//     recompute();
//     el.addEventListener('scroll', onScroll, { passive: true });
//     const ro = new ResizeObserver(onResize);
//     ro.observe(el);
//     return () => {
//       el.removeEventListener('scroll', onScroll);
//       ro.disconnect();
//       if (frame) cancelAnimationFrame(frame);
//     };
//   }, [items.length]);

//   const ROW_H = 440;
//   const topRows = Math.floor(range.start / Math.max(1, range.cols));
//   const bottomRows = Math.ceil((items.length - range.end) / Math.max(1, range.cols));
//   const topSpace = topRows * ROW_H;
//   const bottomSpace = bottomRows * ROW_H;

//   const visible = items.slice(range.start, range.end);

//   return (
//     <div ref={containerRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 no-scrollbar" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
//       <div style={{ height: topSpace, gridColumn: '1 / -1' }} />
//       {visible.map((a, i) => renderItem(a, range.start + i))}
//       <div style={{ height: bottomSpace, gridColumn: '1 / -1' }} />
//     </div>
//   );
// }

// /****************************
//  * SELF-TESTS
//  ****************************/
// function filterAlumni(seed: AlumniItem[], q: string) {
//   const s = q.trim().toLowerCase();
//   return seed.filter(a => {
//     return !s ||
//       a.name.toLowerCase().includes(s) ||
//       a.handle.toLowerCase().includes(s) ||
//       a.title.toLowerCase().includes(s) ||
//       a.jurusan.toLowerCase().includes(s) ||
//       a.kampus?.toLowerCase().includes(s) ||
//       a.prodi?.toLowerCase().includes(s) ||
//       a.perusahaan?.toLowerCase().includes(s);
//   });
// }

// function runSelfTests(items: AlumniItem[]) {
//   const logs: string[] = [];
//   let pass = 0, fail = 0;

//   const tests = [
//     { name: 'filter by name', run: () => filterAlumni(items, 'jane').some(x => x.name.toLowerCase().includes('jane')) },
//     { name: 'filter by angkatan', run: () => filterAlumni(items, '2023').some(x => x.angkatan.includes('2023')) },
//     { name: 'filter by jurusan', run: () => filterAlumni(items, 'informatika').some(x => x.jurusan.toLowerCase().includes('informatika')) },
//     { name: 'limit manual', run: () => filterAlumni(items, '').slice(0, 2).length <= 2 },
//     { name: 'case-insensitive handle', run: () => filterAlumni(items, 'BUDI.JOE').some(x => x.handle.toLowerCase() === 'budi.joe') },
//     { name: 'combined query', run: () => filterAlumni(items, 'jane informatika').some(x => x.name.toLowerCase().includes('jane') && x.jurusan.toLowerCase().includes('informatika')) },
//     { name: 'jenjang filter', run: () => filterAlumni(items, '').filter(a => a.jenjang === 'SMA').every(a => a.jenjang === 'SMA') },
//     { name: 'no results', run: () => filterAlumni(items, 'zzzxxyy').length === 0 },
//   ];

//   tests.forEach(t => {
//     if (t.run()) { pass++; logs.push(`${t.name} PASS`); } else { fail++; logs.push(`${t.name} FAIL`); }
//   });

//   return { pass, fail, logs };
// }

// /****************************
//  * CREATE ALUMNI SCHEMA (TANPA KATEGORI)
//  ****************************/
// const createAlumniSchema = z.object({
//   nama: z.string().min(1, "Nama wajib diisi"),
//   email: z.string().email("Email tidak valid"),
//   kontak: z.string().min(10, "Nomor kontak minimal 10 digit"),
//   tahunKelulusan: z.string().regex(/^\d{4}\/\d{4}$/, "Format: 2020/2021"),
//   jenjangAsal: z.enum(["SMA", "SMK", "MA"]),
//   institusiTujuan: z.string().min(1, "Institusi tujuan wajib diisi"),
//   programStudi: z.string().min(1, "Program studi wajib diisi"),
//   jenisInstitusi: z.enum(["PTN", "PTS", "Luar Negeri"]),
// });
// type CreateAlumniForm = z.infer<typeof createAlumniSchema>;

// /****************************
//  * MAIN COMPONENT
//  ****************************/
// export function BukuAlumni() {
//   const schoolInfo = SMAN25_CONFIG;
//   const theme = schoolInfo.theme;
//   const schoolName = schoolInfo.fullName;

//   const [q, setQ] = useState('');
//   const [limit, setLimit] = useState(16);
//   const [zoomItem, setZoomItem] = useState<AlumniItem | null>(null);
//   const [page, setPage] = useState(1);
//   const [debouncedQ, setDebouncedQ] = useState(q);
//   const [alumniData, setAlumniData] = useState<AlumniItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [totalPages, setTotalPages] = useState(1);

//   // Create Modal
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [createLoading, setCreateLoading] = useState(false);
//   const [createError, setCreateError] = useState<string | null>(null);
//   const [createSuccess, setCreateSuccess] = useState(false);

//   const xHost = getXHostHeader();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<CreateAlumniForm>({
//     resolver: zodResolver(createAlumniSchema),
//   });

//   // Debounce search
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedQ(q), 300);
//     return () => clearTimeout(t);
//   }, [q]);

//   // Fetch alumni
//   useEffect(() => {
//     const fetchAlumni = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch(
//           `https://dev.kiraproject.id/alumni?page=${page}&limit=${limit}&sortBy=nama&order=asc`,
//           {
//             cache: 'no-store',
//             headers: {
//               'X-Host': xHost,
//               'Cache-Control': 'no-store',
//             },
//           }
//         );

//         if (!res.ok) throw new Error('Failed to fetch');
//         const json = await res.json();

//         if (!json.success || !json.data) throw new Error('Invalid response');

//         const mapped: AlumniItem[] = json.data.map((item: any) => ({
//           id: String(item.id),
//           name: item.nama || 'Tanpa Nama',
//           title: item.beasiswa || 'Alumni',
//           handle: (item.nama || '').toLowerCase().replace(/\s+/g, '.'),
//           status: `Angkatan ${item.tahunKelulusan} · ${item.jurusanAsal || item.programStudi || 'Tidak Diketahui'}`,
//           avatarUrl: item.fotoProfile || PLACEHOLDER_AVATAR,
//           jurusan: item.jurusanAsal || item.programStudi || 'Tidak Diketahui',
//           angkatan: item.tahunKelulusan,
//           jenjang: item.jenjangAsal,
//           ig: undefined,
//           linkedin: undefined,
//           facebook: undefined,
//           kampus: item.institusiTujuan,
//           prodi: item.programStudi,
//           perusahaan: undefined,
//           likes: 0,
//           liked: false,
//           thumbs: 0,
//           thumbed: false,
//           shares: 0,
//           shared: false,
//         }));

//         setAlumniData(prev => page === 1 ? mapped : [...prev, ...mapped]);
//         setTotalPages(json.pagination?.totalPages || 1);
//       } catch (err) {
//         console.warn("Fetch Error:", err);
//         setError("Gagal memuat data alumni");
//         setAlumniData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAlumni();
//   }, [page, limit, xHost]);

//   // Load interactions from localStorage
//   useEffect(() => {
//     if (alumniData.length === 0) return;
//     setAlumniData(prev => prev.map(a => {
//       const likes = localStorage.getItem(`likes:${a.id}`);
//       const liked = localStorage.getItem(`liked:${a.id}`) === 'true';
//       const thumbs = localStorage.getItem(`thumbs:${a.id}`);
//       const thumbed = localStorage.getItem(`thumbed:${a.id}`) === 'true';
//       const shares = localStorage.getItem(`shares:${a.id}`);
//       const shared = localStorage.getItem(`shared:${a.id}`) === 'true';
//       return {
//         ...a,
//         likes: likes ? parseInt(likes) : a.likes,
//         liked: liked || a.liked,
//         thumbs: thumbs ? parseInt(thumbs) : a.thumbs,
//         thumbed: thumbed || a.thumbed,
//         shares: shares ? parseInt(shares) : a.shares,
//         shared: shared || a.shared,
//       };
//     }));
//   }, [alumniData.length]);

//   // Filter
//   const filtered = useMemo(() => filterAlumni(alumniData, debouncedQ), [alumniData, debouncedQ]);
//   const displayed = useMemo(() => filtered.slice(0, limit), [filtered, limit]);

//   const loadMore = () => {
//     if (page < totalPages) setPage(p => p + 1);
//     else if (displayed.length < filtered.length) setLimit(l => l + 8);
//   };

//   const handleLike = (item: AlumniItem) => async () => {
//     if (item.liked) return;
//     const newLikes = item.likes + 1;
//     setAlumniData(prev => prev.map(a => a.id === item.id ? { ...a, likes: newLikes, liked: true } : a));
//     try {
//       localStorage.setItem(`likes:${item.id}`, String(newLikes));
//       localStorage.setItem(`liked:${item.id}`, "true");
//       const sig = await signKV(`liked:${item.id}`, "true");
//       localStorage.setItem(sigKey(`liked:${item.id}`), sig);
//     } catch {}
//   };

//   const handleThumb = (item: AlumniItem) => async () => {
//     if (item.thumbed) return;
//     const newThumbs = item.thumbs + 1;
//     setAlumniData(prev => prev.map(a => a.id === item.id ? { ...a, thumbs: newThumbs, thumbed: true } : a));
//     try {
//       localStorage.setItem(`thumbs:${item.id}`, String(newThumbs));
//       localStorage.setItem(`thumbed:${item.id}`, "true");
//       const sig = await signKV(`thumbed:${item.id}`, "true");
//       localStorage.setItem(sigKey(`thumbed:${item.id}`), sig);
//     } catch {}
//   };

//   const handleShare = (item: AlumniItem) => async () => {
//     if (item.shared) return;
//     const newShares = item.shares + 1;
//     try {
//       const shareData = { title: item.name, text: `Lihat profil alumni ${item.name}`, url: location.href };
//       if (navigator.share) await navigator.share(shareData);
//       else if (navigator.clipboard) { await navigator.clipboard.writeText(shareData.url); alert('Link disalin'); }
//       else alert('Bagikan: ' + shareData.url);

//       setAlumniData(prev => prev.map(a => a.id === item.id ? { ...a, shares: newShares, shared: true } : a));
//       localStorage.setItem(`shares:${item.id}`, String(newShares));
//       localStorage.setItem(`shared:${item.id}`, "true");
//       const sig = await signKV(`shared:${item.id}`, "true");
//       localStorage.setItem(sigKey(`shared:${item.id}`), sig);
//     } catch {}
//   };

//   // CREATE ALUMNI (kategori: "dalam_negeri" secara otomatis)
//   const onCreateAlumni = async (data: CreateAlumniForm) => {
//     setCreateLoading(true);
//     setCreateError(null);
//     setCreateSuccess(false);

//     try {
//       const payload = {
//         ...data,
//         kategori: "dalam_negeri", // HARDCODED
//       };

//       const res = await fetch("https://dev.kiraproject.id/alumni/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Host": xHost,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const err = await res.text();
//         throw new Error(err || "Gagal menyimpan");
//       }

//       setCreateSuccess(true);
//       reset();
//       setShowCreateModal(false);
//       setPage(1);
//       // setAlumniData([]);
//     } catch (e: any) {
//       setCreateError(e.message ?? "Terjadi kesalahan");
//     } finally {
//       setCreateLoading(false);
//     }
//   };

//   // Self-tests
//   useEffect(() => {
//     if (alumniData.length > 0) {
//       const { pass, fail } = runSelfTests(alumniData);
//       console.log(`Self-tests: ${pass} passed, ${fail} failed`);
//     }
//   }, [alumniData]);

//   return (
//     <div className="min-h-screen" style={{ background: theme.bg }}>
//       <style>{`
//         @keyframes shine { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
//         .shine-move { animation: shine 6s ease-in-out infinite; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; } }
//       `}</style>

//       <NavbarComp theme={theme} />

//       <main className="mx-auto max-w-7xl px-4 py-10">
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
//         >
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'black' }}>
//               Buku Alumni {schoolName}
//             </h1>
//             <p className="mt-2 text-sm" style={{ color: theme.subtle }}>
//               Telusuri profil alumni untuk jejaring profesional.
//             </p>
//           </div>
//         </motion.div>

//         <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex gap-3">
//           <input
//             value={q}
//             onChange={e => setQ(e.target.value)}
//             placeholder="Cari nama / handle / jurusan / kampus / perusahaan"
//             className="flex-1 rounded-xl bg-transparent ring-1 px-4 py-2 outline-none"
//             style={{ color: 'black', borderColor: theme.border }}
//             disabled={loading}
//           />
//           <button
//             onClick={() => setShowCreateModal(true)}
//             className="px-4 py-2 rounded-xl font-medium whitespace-nowrap"
//             style={{
//               background: theme.gold,
//               color: theme.bg,
//               border: `1px solid ${theme.border}`,
//             }}
//           >
//             + Tambah Alumni
//           </button>
//         </motion.div>

//         {error && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="mt-4 rounded-xl border p-4 text-center"
//             style={{ borderColor: theme.border, background: theme.surface, color: theme.pop }}
//           >
//             {error}
//           </motion.div>
//         )}

//         <div className="mt-8">
//           {loading ? (
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="rounded-3xl border p-4 animate-pulse" style={{ borderColor: theme.border, background: theme.surface }}>
//                   <div className="h-80 bg-white/10 rounded-2xl mb-3" />
//                   <div className="h-6 bg-white/20 rounded w-3/4 mb-2" />
//                   <div className="h-4 bg-white/20 rounded w-1/2" />
//                 </div>
//               ))}
//             </div>
//           ) : displayed.length === 0 ? (
//             <motion.div
//               layout
//               className="col-span-full rounded-2xl p-8 text-center"
//               style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
//             >
//               <p className="text-sm" style={{ color: theme.subtle }}>Tidak ada hasil. Coba ubah kata kunci.</p>
//             </motion.div>
//           ) : (
//             <VirtualizedGrid
//               items={displayed}
//               theme={theme}
//               renderItem={(a) => (
//                 <motion.article
//                   layout
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   key={a.id}
//                   onClick={() => setZoomItem(a)}
//                   className="cursor-zoom-in"
//                 >
//                   <div className="rounded-3xl p-3" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
//                     <InlineProfileCard
//                       {...a}
//                       theme={theme}
//                       onLike={handleLike(a)}
//                       onThumb={handleThumb(a)}
//                       onShare={handleShare(a)}
//                     />
//                   </div>
//                 </motion.article>
//               )}
//             />
//           )}
//         </div>

//         {(displayed.length < filtered.length || page < totalPages) && !loading && (
//           <div className="mt-8 flex justify-center">
//             <button
//               onClick={loadMore}
//               className="px-4 py-2 rounded-xl font-semibold shadow"
//               style={{ background: theme.gold, color: theme.bg, border: `1px solid ${theme.border}` }}
//             >
//               Muat lebih banyak ({displayed.length}/{filtered.length})
//             </button>
//           </div>
//         )}

//         {/* Zoom Modal */}
//         <AnimatePresence>
//           {zoomItem && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center"
//               onClick={() => setZoomItem(null)}
//             >
//               <motion.div
//                 initial={{ scale: 0.9 }}
//                 animate={{ scale: 1 }}
//                 exit={{ scale: 0.9 }}
//                 className="w-full max-w-3xl"
//                 onClick={e => e.stopPropagation()}
//               >
//                 <div className="relative rounded-3xl p-4" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
//                   <button
//                     onClick={() => setZoomItem(null)}
//                     className="absolute right-4 top-4 px-3 py-1.5 rounded-lg text-sm"
//                     style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${theme.border}`, color: 'black' }}
//                   >
//                     Tutup
//                   </button>
//                   <InlineProfileCard
//                     {...zoomItem}
//                     height={520}
//                     theme={theme}
//                     onLike={handleLike(zoomItem)}
//                     onThumb={handleThumb(zoomItem)}
//                     onShare={handleShare(zoomItem)}
//                   />
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* CREATE ALUMNI MODAL (TANPA KATEGORI) */}
//         <AnimatePresence>
//           {showCreateModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
//               onClick={() => setShowCreateModal(false)}
//             >
//               <motion.div
//                 initial={{ scale: 0.95, y: 20 }}
//                 animate={{ scale: 1, y: 0 }}
//                 exit={{ scale: 0.95, y: 20 }}
//                 className="w-full max-w-[45vw]"
//                 onClick={e => e.stopPropagation()}
//               >
//                 <div
//                   className="rounded-3xl p-6 shadow-2xl"
//                   style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
//                 >
//                   <h2 className="text-xl font-semibold mb-4" style={{ color: 'black' }}>
//                     Tambah Alumni Baru
//                   </h2>

//                   <form onSubmit={handleSubmit(onCreateAlumni)} className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm mb-1" style={{ color: 'black' }}>Nama Lengkap</label>
//                       <input {...register("nama")} className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }} placeholder="Budi Alumni Sukses" />
//                       {errors.nama && <p className="text-xs mt-1" style={{ color: theme.pop }}>{errors.nama.message}</p>}
//                     </div>

//                     <div>
//                       <label className="block text-sm mb-1" style={{ color: 'black' }}>Email</label>
//                       <input {...register("email")} type="email" className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }} placeholder="budi@example.com" />
//                       {errors.email && <p className="text-xs mt-1" style={{ color: theme.pop }}>{errors.email.message}</p>}
//                     </div>

//                     <div>
//                       <label className="block text-sm mb-1" style={{ color: 'black' }}>Kontak (WA)</label>
//                       <input {...register("kontak")} className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }} placeholder="081234567891" />
//                       {errors.kontak && <p className="text-xs mt-1" style={{ color: theme.pop }}>{errors.kontak.message}</p>}
//                     </div>

//                     <div>
//                       <label className="block text-sm mb-1" style={{ color: 'black' }}>Tahun Kelulusan</label>
//                       <input {...register("tahunKelulusan")} placeholder="2020/2021" className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }} />
//                       {errors.tahunKelulusan && <p className="text-xs mt-1" style={{ color: theme.pop }}>{errors.tahunKelulusan.message}</p>}
//                     </div>

//                     <div>
//                       <label className="block text-sm mb-1" style={{ color: 'black' }}>Jenjang Asal</label>
//                       <select {...register("jenjangAsal")} className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }}>
//                         <option value="SMA">SMA</option>
//                         <option value="SMK">SMK</option>
//                         <option value="MA">MA</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm mb-1" style={{ color: 'black' }}>Institusi Tujuan</label>
//                       <input {...register("institusiTujuan")} className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }} placeholder="Universitas XYZ" />
//                       {errors.institusiTujuan && <p className="text-xs mt-1" style={{ color: theme.pop }}>{errors.institusiTujuan.message}</p>}
//                     </div>

//                     <div>
//                       <label className="block text-sm mb-1" style={{ color: 'black' }}>Program Studi</label>
//                       <input {...register("programStudi")} className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }} placeholder="Teknik Informatika" />
//                       {errors.programStudi && <p className="text-xs mt-1" style={{ color: theme.pop }}>{errors.programStudi.message}</p>}
//                     </div>

//                     <div>
//                       <label className="block text-sm mb-1" style={{ color: 'black' }}>Jenis Institusi</label>
//                       <select {...register("jenisInstitusi")} className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }}>
//                         <option value="PTN">PTN</option>
//                         <option value="PTS">PTS</option>
//                         <option value="Luar Negeri">Luar Negeri</option>
//                       </select>
//                     </div>

//                     {createError && <p className="text-sm" style={{ color: theme.pop }}>{createError}</p>}
//                     {createSuccess && <p className="text-sm" style={{ color: theme.gold }}>Alumni berhasil ditambahkan!</p>}

//                     <div></div>
//                     <div className="flex justify-end w-full ml-auto gap-3 mt-6">
//                       <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${theme.border}`, color: 'black' }}>
//                         Batal
//                       </button>
//                       <button type="submit" disabled={createLoading} className="px-4 py-2 rounded-lg font-medium flex items-center gap-2" style={{ background: theme.gold, color: theme.bg, border: `1px solid ${theme.border}` }}>
//                         {createLoading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" /><path fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
//                         Simpan
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </main>

//       <FooterComp theme={theme} />
//     </div>
//   );
// }



import { SMAN25_CONFIG } from '@/core/theme';
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";

/****************************
 * HERO SECTION UNTUK BUKU ALUMNI
 ****************************/
const HeroSection = () => {
  const scrollToContent = () => {
    document.querySelector("main")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      {/* Background Image - Representatif alumni / kegiatan sekolah */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/alumnus.jpg')`, // Ganti dengan foto alumni atau wisuda jika ada
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
          Buku Alumni
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Jejaring alumni SMAN 25 Jakarta – temukan teman seangkatan dan inspirasi karier
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
          Telusuri Alumni
        </motion.button>
      </div>
    </section>
  );
};

/****************************
 * PLACEHOLDER AVATAR
 ****************************/
const PLACEHOLDER_AVATAR = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="320">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="%23a7c7ff"/>
      <stop offset="1" stop-color="%23f2c94c"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="%230B1733"/>
  <rect x="8" y="8" width="384" height="304" rx="18" fill="url(%23g)" fill-opacity="0.18"/>
  <circle cx="200" cy="130" r="58" fill="%23ffffff" fill-opacity="0.18"/>
  <rect x="90" y="220" width="220" height="16" rx="8" fill="%23ffffff" fill-opacity="0.14"/>
</svg>
`);

/****************************
 * TYPES
 ****************************/
interface AlumniItem {
  id: string;
  name: string;
  title: string;
  handle: string;
  status: string;
  avatarUrl: string;
  jurusan: string;
  angkatan: string;
  jenjang?: string;
  ig?: string;
  linkedin?: string;
  facebook?: string;
  kampus?: string;
  prodi?: string;
  perusahaan?: string;
  likes: number;
  liked: boolean;
  thumbs: number;
  thumbed: boolean;
  shares: number;
  shared: boolean;
}

/****************************
 * SOCIAL ICONS
 ****************************/
const IconInstagram: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm6.25-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25z"/>
  </svg>
);

const IconLinkedIn: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.45 20.45h-3.56v-5.18c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.74v5.28H9.6V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.36-1.85c3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.13 20.45H3.54V9h3.59v11.45z"/>
  </svg>
);

const IconFacebook: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 12a10 10 0 1 0-11.56 9.9v-7h-2.3V12h2.3V9.8c0-2.27 1.35-3.53 3.42-3.53.99 0 2.02.18 2.02.18v2.22h-1.14c-1.12 0-1.47.7-1.47 1.41V12h2.5l-.4 2.9h-2.1v7A10 10 0 0 0 22 12z"/>
  </svg>
);

/****************************
 * SECURITY UTILS
 ****************************/
const SALT_KEY = "app:salt";
function ensureSalt() {
  let salt = localStorage.getItem(SALT_KEY);
  if (!salt) {
    try {
      const arr = new Uint8Array(16);
      crypto.getRandomValues(arr);
      salt = Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
      localStorage.setItem(SALT_KEY, salt);
    } catch {
      salt = "fallback-salt";
    }
  }
  return salt;
}
async function sha256Hex(input: string) {
  const enc = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
async function signKV(key: string, value: string) {
  const salt = ensureSalt();
  return sha256Hex(`${key}:${value}:${salt}`);
}
function sigKey(key: string) { return `sig:${key}`; }

/****************************
 * INLINE PROFILE CARD
 ****************************/
interface InlineProfileCardProps {
  avatarUrl: string;
  name?: string;
  title?: string;
  handle?: string;
  showUserInfo?: boolean;
  enableTilt?: boolean;
  angkatan?: string;
  jurusan?: string;
  jenjang?: string;
  ig?: string;
  linkedin?: string;
  facebook?: string;
  kampus?: string;
  prodi?: string;
  perusahaan?: string;
  height?: number;
  onLike?: () => void;
  onThumb?: () => void;
  onShare?: () => void;
  likes?: number;
  liked?: boolean;
  thumbs?: number;
  thumbed?: boolean;
  shares?: number;
  shared?: boolean;
  theme: any;
}

const InlineProfileCard: React.FC<InlineProfileCardProps> = ({
  avatarUrl,
  name = 'Nama Alumni',
  title = 'Profesi / Posisi',
  handle = 'handle',
  showUserInfo = true,
  enableTilt = true,
  angkatan,
  jurusan,
  jenjang,
  ig,
  linkedin,
  facebook,
  kampus,
  prodi,
  perusahaan,
  height = 320,
  onLike,
  onThumb,
  onShare,
  likes = 0,
  liked = false,
  thumbs = 0,
  thumbed = false,
  shares = 0,
  shared = false,
  theme,
}) => {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [mouse, setMouse] = useState({ mx: 50, my: 50 });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 2 - 1;
    const py = (y / rect.height) * 2 - 1;
    const max = 8;
    setMouse({ mx: (x / rect.width) * 100, my: (y / rect.height) * 100 });
    if (!enableTilt) return;
    setTilt({ rx: -(py * max), ry: px * max });
  }, [enableTilt]);

  const onLeave = useCallback(() => {
    if (enableTilt) setTilt({ rx: 0, ry: 0 });
    setMouse({ mx: 50, my: 50 });
    setHovered(false);
  }, [enableTilt]);

  const cardStyle: React.CSSProperties = {
    borderColor: theme.border,
    background: theme.type === 'SMKN'
      ? 'linear-gradient(145deg, rgba(113,196,255,0.08), rgba(31,59,118,0.12))'
      : 'linear-gradient(145deg, rgba(251,191,36,0.12), rgba(14,116,144,0.08))',
    transform: `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
    transition: 'transform 180ms ease',
    boxShadow: theme.type === 'SMKN'
      ? 'inset 0 0 0 1px rgba(242,201,76,0.35), 0 18px 40px rgba(31,59,118,0.35)'
      : 'inset 0 0 0 1px rgba(251,191,36,0.25), 0 12px 32px rgba(0,0,0,0.08)',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      className="relative overflow-hidden rounded-[28px]"
      style={{ height }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px]"
        style={{
          background: `radial-gradient(380px 260px at ${mouse.mx}% ${mouse.my}%, ${theme.gold}22, ${theme.primary}18 35%, transparent 70%),
                       radial-gradient(60% 80% at 50% 110%, ${theme.surface}88, transparent 60%)`,
          filter: 'blur(42px) saturate(1.2)',
          opacity: hovered ? 0.95 : 0.55,
          transition: 'opacity 160ms ease',
        }}
      />

      <div className="relative overflow-hidden rounded-2xl border" style={cardStyle}>
        <div
          className="pointer-events-none absolute inset-0 rounded-[22px]"
          style={{
            background: `radial-gradient(40% 60% at 20% 0%, ${theme.primary}28, transparent 70%),
                         radial-gradient(45% 65% at 85% 20%, ${theme.gold}22, transparent 70%)`,
            mixBlendMode: 'screen',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 180ms ease',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(360px 360px at ${mouse.mx}% ${mouse.my}%, ${theme.gold}45, ${theme.primary}38 35%, transparent 70%)`,
            filter: 'blur(40px)',
            opacity: hovered ? 1 : 0,
            mixBlendMode: 'screen',
            transition: 'opacity 180ms ease',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[22px] shine-move"
          style={{
            background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.12) 45%, transparent 60%)',
            mixBlendMode: 'screen',
          }}
        />

        <img
          src={avatarUrl || PLACEHOLDER_AVATAR}
          alt={`${name} avatar`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_AVATAR; }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: theme.type === 'SMKN'
              ? 'linear-gradient(to top, rgba(11,23,51,0.9), rgba(11,23,51,0.0) 60%)'
              : 'linear-gradient(to top, rgba(248,250,252,0.9), rgba(248,250,252,0.0) 60%)',
          }}
        />

        <div className="absolute left-4 right-4 top-4 text-left">
          <h3 className="m-0 text-lg font-semibold" style={{ color: 'black', textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
            {name}
          </h3>
          <p className="m-0 text-sm" style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 1px 4px rgba(0,0,0,0.65)' }}>
            {title}
          </p>
        </div>

        {showUserInfo && (
          <div className="absolute left-4 right-4 bottom-4 flex justify-between items-end gap-2">
            <div>
              <div className="text-[12px]" style={{ color: 'black' }}>
                @{handle} • {angkatan && `Angkatan ${angkatan}`} {jurusan && `· ${jurusan}`}
              </div>
              <div className="mt-1 text-[11px] space-y-0.5" style={{ color: 'black' }}>
                {jenjang && (
                  <span className="inline-block px-2 py-0.5 rounded-full border mr-2"
                    style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)' }}>
                    {jenjang}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-1">
                {ig && (
                  <a href={ig.startsWith('http') ? ig : `https://instagram.com/${ig}`} target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:scale-110 transition"
                    style={{ borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
                    <IconInstagram />
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`} target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:scale-110 transition"
                    style={{ borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
                    <IconLinkedIn />
                  </a>
                )}
                {facebook && (
                  <a href={facebook.startsWith('http') ? facebook : `https://facebook.com/${facebook}`} target="_blank" rel="noreferrer"
                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:scale-110 transition"
                    style={{ borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
                    <IconFacebook />
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <div className="group relative flex flex-col items-center">
                  <button onClick={onLike} disabled={liked}
                    className={`w-8 h-8 rounded-full border transition-all ${liked ? 'bg-rose-600 text-white border-rose-600' : 'bg-white/30 text-rose-600 border-white hover:bg-white/70 hover:scale-110'}`}
                    aria-label={liked ? 'Disukai' : 'Love'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mx-auto" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.936 0-3.597 1.126-4.312 2.733C11.285 4.876 9.624 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>
                  <div className="text-xs mt-1 px-2 py-0.5 rounded-full bg-white/90 text-slate-800 font-medium shadow">{likes}</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <button onClick={onThumb} disabled={thumbed}
                    className={`w-8 h-8 rounded-full border transition-all ${thumbed ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/30 text-blue-600 border-white hover:bg-white/70 hover:scale-110'}`}
                    aria-label={thumbed ? 'Dijempol' : 'Like'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mx-auto" fill={thumbed ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 10h4v12H2zM22 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13 2 7.59 7.41C7.22 7.78 7 8.3 7 8.83V20c0 1.1.9 2 2 2h8c.78 0 1.48-.45 1.82-1.14l3.58-7.16c.37-.74.56-1.55.56-2.36V10z" />
                    </svg>
                  </button>
                  <div className="text-xs mt-1 px-2 py-0.5 rounded-full bg-white/90 text-slate-800 font-medium shadow">{thumbs}</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <button onClick={onShare}
                    className={`w-8 h-8 rounded-full border transition-all ${shared ? 'bg-white/60' : 'bg-white/30 hover:bg-white/70 hover:scale-110'}`}
                    aria-label="Share">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-auto">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8l5-5 5 5M12 3v12m6 4H6a2 2 0 01-2-2V9" />
                    </svg>
                  </button>
                  <div className="text-xs mt-1 px-2 py-0.5 rounded-full bg-white/90 text-slate-800 font-medium shadow">{shares}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/****************************
 * VIRTUALIZED GRID
 ****************************/
function VirtualizedGrid({ items, renderItem, theme }: { items: AlumniItem[]; renderItem: (a: AlumniItem, i: number) => React.ReactNode; theme: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState({ start: 0, end: 16, cols: 1 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const getCols = (w: number) => (w >= 1280 ? 4 : w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    let frame = 0;
    const ROW_H = 440;

    const recompute = () => {
      const cols = getCols(el.clientWidth);
      const y = el.scrollTop;
      const vh = el.clientHeight;
      const startRow = Math.max(0, Math.floor(y / ROW_H) - 2);
      const endRow = Math.ceil((y + vh) / ROW_H) + 2;
      const start = startRow * cols;
      const end = Math.min(items.length, endRow * cols);
      setRange({ start, end, cols });
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; recompute(); });
    };
    const onResize = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; recompute(); });
    };

    recompute();
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(onResize);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items.length]);

  const ROW_H = 440;
  const topRows = Math.floor(range.start / Math.max(1, range.cols));
  const bottomRows = Math.ceil((items.length - range.end) / Math.max(1, range.cols));
  const topSpace = topRows * ROW_H;
  const bottomSpace = bottomRows * ROW_H;

  const visible = items.slice(range.start, range.end);

  return (
    <div ref={containerRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 no-scrollbar" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
      <div style={{ height: topSpace, gridColumn: '1 / -1' }} />
      {visible.map((a, i) => renderItem(a, range.start + i))}
      <div style={{ height: bottomSpace, gridColumn: '1 / -1' }} />
    </div>
  );
}

/****************************
 * SELF-TESTS
 ****************************/
function filterAlumni(seed: AlumniItem[], q: string) {
  const s = q.trim().toLowerCase();
  return seed.filter(a => {
    return !s ||
      a.name.toLowerCase().includes(s) ||
      a.handle.toLowerCase().includes(s) ||
      a.title.toLowerCase().includes(s) ||
      a.jurusan.toLowerCase().includes(s) ||
      a.kampus?.toLowerCase().includes(s) ||
      a.prodi?.toLowerCase().includes(s) ||
      a.perusahaan?.toLowerCase().includes(s);
  });
}

function runSelfTests(items: AlumniItem[]) {
  const logs: string[] = [];
  let pass = 0, fail = 0;

  const tests = [
    { name: 'filter by name', run: () => filterAlumni(items, 'jane').some(x => x.name.toLowerCase().includes('jane')) },
    { name: 'filter by angkatan', run: () => filterAlumni(items, '2023').some(x => x.angkatan.includes('2023')) },
    { name: 'filter by jurusan', run: () => filterAlumni(items, 'informatika').some(x => x.jurusan.toLowerCase().includes('informatika')) },
    { name: 'limit manual', run: () => filterAlumni(items, '').slice(0, 2).length <= 2 },
    { name: 'case-insensitive handle', run: () => filterAlumni(items, 'BUDI.JOE').some(x => x.handle.toLowerCase() === 'budi.joe') },
    { name: 'combined query', run: () => filterAlumni(items, 'jane informatika').some(x => x.name.toLowerCase().includes('jane') && x.jurusan.toLowerCase().includes('informatika')) },
    { name: 'jenjang filter', run: () => filterAlumni(items, '').filter(a => a.jenjang === 'SMA').every(a => a.jenjang === 'SMA') },
    { name: 'no results', run: () => filterAlumni(items, 'zzzxxyy').length === 0 },
  ];

  tests.forEach(t => {
    if (t.run()) { pass++; logs.push(`${t.name} PASS`); } else { fail++; logs.push(`${t.name} FAIL`); }
  });

  return { pass, fail, logs };
}

/****************************
 * CREATE ALUMNI SCHEMA (TANPA KATEGORI)
 ****************************/
const createAlumniSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  kontak: z.string().min(10, "Nomor kontak minimal 10 digit"),
  tahunKelulusan: z.string().regex(/^\d{4}\/\d{4}$/, "Format: 2020/2021"),
  jenjangAsal: z.enum(["SMA", "SMK", "MA"]),
  institusiTujuan: z.string().min(1, "Institusi tujuan wajib diisi"),
  programStudi: z.string().min(1, "Program studi wajib diisi"),
  jenisInstitusi: z.enum(["PTN", "PTS", "Luar Negeri"]),
});
type CreateAlumniForm = z.infer<typeof createAlumniSchema>;

/****************************
 * MAIN COMPONENT DENGAN HERO
 ****************************/
export function BukuAlumni() {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(16);
  const [zoomItem, setZoomItem] = useState<AlumniItem | null>(null);
  const [page, setPage] = useState(1);
  const [debouncedQ, setDebouncedQ] = useState(q);
  const [alumniData, setAlumniData] = useState<AlumniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  const xHost = getXHostHeader();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAlumniForm>({
    resolver: zodResolver(createAlumniSchema),
  });

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // Fetch alumni
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://dev.kiraproject.id/alumni?page=${page}&limit=${limit}&sortBy=nama&order=asc`,
          {
            cache: 'no-store',
            headers: {
              'X-Host': xHost,
              'Cache-Control': 'no-store',
            },
          }
        );

        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();

        if (!json.success || !json.data) throw new Error('Invalid response');

        const mapped: AlumniItem[] = json.data.map((item: any) => ({
          id: String(item.id),
          name: item.nama || 'Tanpa Nama',
          title: item.beasiswa || 'Alumni',
          handle: (item.nama || '').toLowerCase().replace(/\s+/g, '.'),
          status: `Angkatan ${item.tahunKelulusan} · ${item.jurusanAsal || item.programStudi || 'Tidak Diketahui'}`,
          avatarUrl: item.fotoProfile || PLACEHOLDER_AVATAR,
          jurusan: item.jurusanAsal || item.programStudi || 'Tidak Diketahui',
          angkatan: item.tahunKelulusan,
          jenjang: item.jenjangAsal,
          ig: undefined,
          linkedin: undefined,
          facebook: undefined,
          kampus: item.institusiTujuan,
          prodi: item.programStudi,
          perusahaan: undefined,
          likes: 0,
          liked: false,
          thumbs: 0,
          thumbed: false,
          shares: 0,
          shared: false,
        }));

        setAlumniData(prev => page === 1 ? mapped : [...prev, ...mapped]);
        setTotalPages(json.pagination?.totalPages || 1);
      } catch (err) {
        console.warn("Fetch Error:", err);
        setError("Gagal memuat data alumni");
        setAlumniData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [page, limit, xHost]);

  // Load interactions from localStorage
  useEffect(() => {
    if (alumniData.length === 0) return;
    setAlumniData(prev => prev.map(a => {
      const likes = localStorage.getItem(`likes:${a.id}`);
      const liked = localStorage.getItem(`liked:${a.id}`) === 'true';
      const thumbs = localStorage.getItem(`thumbs:${a.id}`);
      const thumbed = localStorage.getItem(`thumbed:${a.id}`) === 'true';
      const shares = localStorage.getItem(`shares:${a.id}`);
      const shared = localStorage.getItem(`shared:${a.id}`) === 'true';
      return {
        ...a,
        likes: likes ? parseInt(likes) : a.likes,
        liked: liked || a.liked,
        thumbs: thumbs ? parseInt(thumbs) : a.thumbs,
        thumbed: thumbed || a.thumbed,
        shares: shares ? parseInt(shares) : a.shares,
        shared: shared || a.shared,
      };
    }));
  }, [alumniData.length]);

  // Filter
  const filtered = useMemo(() => filterAlumni(alumniData, debouncedQ), [alumniData, debouncedQ]);
  const displayed = useMemo(() => filtered.slice(0, limit), [filtered, limit]);

  const loadMore = () => {
    if (page < totalPages) setPage(p => p + 1);
    else if (displayed.length < filtered.length) setLimit(l => l + 8);
  };

  const handleLike = (item: AlumniItem) => async () => {
    if (item.liked) return;
    const newLikes = item.likes + 1;
    setAlumniData(prev => prev.map(a => a.id === item.id ? { ...a, likes: newLikes, liked: true } : a));
    try {
      localStorage.setItem(`likes:${item.id}`, String(newLikes));
      localStorage.setItem(`liked:${item.id}`, "true");
      const sig = await signKV(`liked:${item.id}`, "true");
      localStorage.setItem(sigKey(`liked:${item.id}`), sig);
    } catch {}
  };

  const handleThumb = (item: AlumniItem) => async () => {
    if (item.thumbed) return;
    const newThumbs = item.thumbs + 1;
    setAlumniData(prev => prev.map(a => a.id === item.id ? { ...a, thumbs: newThumbs, thumbed: true } : a));
    try {
      localStorage.setItem(`thumbs:${item.id}`, String(newThumbs));
      localStorage.setItem(`thumbed:${item.id}`, "true");
      const sig = await signKV(`thumbed:${item.id}`, "true");
      localStorage.setItem(sigKey(`thumbed:${item.id}`), sig);
    } catch {}
  };

  const handleShare = (item: AlumniItem) => async () => {
    if (item.shared) return;
    const newShares = item.shares + 1;
    try {
      const shareData = { title: item.name, text: `Lihat profil alumni ${item.name}`, url: location.href };
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard) { await navigator.clipboard.writeText(shareData.url); alert('Link disalin'); }
      else alert('Bagikan: ' + shareData.url);

      setAlumniData(prev => prev.map(a => a.id === item.id ? { ...a, shares: newShares, shared: true } : a));
      localStorage.setItem(`shares:${item.id}`, String(newShares));
      localStorage.setItem(`shared:${item.id}`, "true");
      const sig = await signKV(`shared:${item.id}`, "true");
      localStorage.setItem(sigKey(`shared:${item.id}`), sig);
    } catch {}
  };

  // CREATE ALUMNI (kategori: "dalam_negeri" secara otomatis)
  const onCreateAlumni = async (data: CreateAlumniForm) => {
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess(false);

    try {
      const payload = {
        ...data,
        kategori: "dalam_negeri", // HARDCODED
      };

      const res = await fetch("https://dev.kiraproject.id/alumni/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Host": xHost,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Gagal menyimpan");
      }

      setCreateSuccess(true);
      reset();
      setShowCreateModal(false);
      setPage(1);
      // setAlumniData([]);
    } catch (e: any) {
      setCreateError(e.message ?? "Terjadi kesalahan");
    } finally {
      setCreateLoading(false);
    }
  };

  // Self-tests
  useEffect(() => {
    if (alumniData.length > 0) {
      const { pass, fail } = runSelfTests(alumniData);
      console.log(`Self-tests: ${pass} passed, ${fail} failed`);
    }
  }, [alumniData]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <style>{`
        @keyframes shine { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
        .shine-move { animation: shine 6s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; } }
      `}</style>

      <NavbarComp theme={theme} />

      {/* HERO SECTION BARU */}
      <HeroSection />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: 'black' }}>
              Buku Alumni {schoolName}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Telusuri profil alumni untuk jejaring profesional.
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex gap-3">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Cari nama / handle / jurusan / kampus / perusahaan"
            className="flex-1 rounded-xl bg-transparent ring-1 px-4 py-2 outline-none"
            style={{ color: 'black', borderColor: theme.border }}
            disabled={loading}
          />
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl font-medium whitespace-nowrap"
            style={{
              background: theme.gold,
              color: theme.bg,
              border: `1px solid ${theme.border}`,
            }}
          >
            + Tambah Alumni
          </button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 rounded-xl border p-4 text-center"
            style={{ borderColor: theme.border, background: theme.surface, color: theme.pop }}
          >
            {error}
          </motion.div>
        )}

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-3xl border p-4 animate-pulse" style={{ borderColor: theme.border, background: theme.surface }}>
                  <div className="h-80 bg-white/10 rounded-2xl mb-3" />
                  <div className="h-6 bg-white/20 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-white/20 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <motion.div
              layout
              className="col-span-full rounded-2xl p-8 text-center"
              style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
            >
              <p className="text-sm" style={{ color: theme.subtle }}>Tidak ada hasil. Coba ubah kata kunci.</p>
            </motion.div>
          ) : (
            <VirtualizedGrid
              items={displayed}
              theme={theme}
              renderItem={(a) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={a.id}
                  onClick={() => setZoomItem(a)}
                  className="cursor-zoom-in"
                >
                  <div className="rounded-3xl p-3" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
                    <InlineProfileCard
                      {...a}
                      theme={theme}
                      onLike={handleLike(a)}
                      onThumb={handleThumb(a)}
                      onShare={handleShare(a)}
                    />
                  </div>
                </motion.article>
              )}
            />
          )}
        </div>

        {(displayed.length < filtered.length || page < totalPages) && !loading && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              className="px-4 py-2 rounded-xl font-semibold shadow"
              style={{ background: theme.gold, color: theme.bg, border: `1px solid ${theme.border}` }}
            >
              Muat lebih banyak ({displayed.length}/{filtered.length})
            </button>
          </div>
        )}

        {/* Zoom Modal */}
        <AnimatePresence>
          {zoomItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center"
              onClick={() => setZoomItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-3xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="relative rounded-3xl p-4" style={{ background: theme.surface, border: `1px solid ${theme.border}` }}>
                  <button
                    onClick={() => setZoomItem(null)}
                    className="absolute right-4 top-4 px-3 py-1.5 rounded-lg text-sm"
                    style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${theme.border}`, color: 'black' }}
                  >
                    Tutup
                  </button>
                  <InlineProfileCard
                    {...zoomItem}
                    height={520}
                    theme={theme}
                    onLike={handleLike(zoomItem)}
                    onThumb={handleThumb(zoomItem)}
                    onShare={handleShare(zoomItem)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CREATE ALUMNI MODAL (TANPA KATEGORI) */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-[45vw]"
                onClick={e => e.stopPropagation()}
              >
                <div
                  className="rounded-3xl p-6 shadow-2xl"
                  style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
                >
                  <h2 className="text-xl font-semibold mb-4" style={{ color: 'black' }}>
                    Tambah Alumni Baru
                  </h2>

                  <form onSubmit={handleSubmit(onCreateAlumni)} className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1" style={{ color: 'black' }}>Nama Lengkap</label>
                      <input {...register("nama")} className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }} placeholder="Budi Alumni Sukses" />
                      {errors.nama && <p className="text-xs mt-1" style={{ color: theme.pop }}>{errors.nama.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm mb-1" style={{ color: 'black' }}>Email</label>
                      <input {...register("email")} type="email" className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }} placeholder="budi@example.com" />
                      {errors.email && <p className="text-xs mt-1" style={{ color: theme.pop }}>{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm mb-1" style={{ color: 'black' }}>Kontak (WA)</label>
                      <input {...register("kontak")} className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }} placeholder="081234567891" />
                      {errors.kontak && <p className="text-xs mt-1" style={{ color: theme.pop }}>{errors.kontak.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm mb-1" style={{ color: 'black' }}>Tahun Kelulusan</label>
                      <input {...register("tahunKelulusan")} placeholder="2020/2021" className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }} />
                      {errors.tahunKelulusan && <p className="text-xs mt-1" style={{ color: theme.pop }}>{errors.tahunKelulusan.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm mb-1" style={{ color: 'black' }}>Jenjang Asal</label>
                      <select {...register("jenjangAsal")} className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }}>
                        <option value="SMA">SMA</option>
                        <option value="SMK">SMK</option>
                        <option value="MA">MA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm mb-1" style={{ color: 'black' }}>Institusi Tujuan</label>
                      <input {...register("institusiTujuan")} className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }} placeholder="Universitas XYZ" />
                      {errors.institusiTujuan && <p className="text-xs mt-1" style={{ color: theme.pop }}>{errors.institusiTujuan.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm mb-1" style={{ color: 'black' }}>Program Studi</label>
                      <input {...register("programStudi")} className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }} placeholder="Teknik Informatika" />
                      {errors.programStudi && <p className="text-xs mt-1" style={{ color: theme.pop }}>{errors.programStudi.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm mb-1" style={{ color: 'black' }}>Jenis Institusi</label>
                      <select {...register("jenisInstitusi")} className="w-full rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: 'black' }}>
                        <option value="PTN">PTN</option>
                        <option value="PTS">PTS</option>
                        <option value="Luar Negeri">Luar Negeri</option>
                      </select>
                    </div>

                    {createError && <p className="text-sm" style={{ color: theme.pop }}>{createError}</p>}
                    {createSuccess && <p className="text-sm" style={{ color: theme.gold }}>Alumni berhasil ditambahkan!</p>}

                    <div></div>
                    <div className="flex justify-end w-full ml-auto gap-3 mt-6">
                      <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${theme.border}`, color: 'black' }}>
                        Batal
                      </button>
                      <button type="submit" disabled={createLoading} className="px-4 py-2 rounded-lg font-medium flex items-center gap-2" style={{ background: theme.gold, color: theme.bg, border: `1px solid ${theme.border}` }}>
                        {createLoading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" /><path fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
                        Simpan
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <FooterComp theme={theme} />
    </div>
  );
}