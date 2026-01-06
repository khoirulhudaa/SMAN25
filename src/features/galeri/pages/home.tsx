// import { SMAN25_CONFIG } from "@/core/theme";
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
// import { Camera } from "lucide-react";
// import { useEffect, useState } from "react";

// /****************************
//  * SVG GENERATOR
//  ****************************/
// const makeSvg = (
//   width: number,
//   height: number,
//   color1: string,
//   color2: string,
//   title: string,
//   subtitle: string = ""
// ): string => {
//   const svgContent = `
//     <?xml version="1.0" encoding="UTF-8"?>
//     <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
//       <defs>
//         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0%" stop-color="${color1}"/>
//           <stop offset="100%" stop-color="${color2}"/>
//         </linearGradient>
//       </defs>
//       <rect width="${width}" height="${height}" fill="url(#g)"/>
//       <g fill="rgba(255, 255, 255, 0.95)" font-family="Inter, Arial, sans-serif" font-weight="700">
//         <text x="6%" y="55%" font-size="${Math.round(height / 12)}">${title.replace(/&/g, "&amp;")}</text>
//         <text x="6%" y="70%" font-size="${Math.round(height / 24)}" opacity="0.9">${subtitle.replace(/&/g, "&amp;")}</text>
//       </g>
//     </svg>
//   `.trim();

//   return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
// };

// /****************************
//  * ANIMATION VARIANTS
//  ****************************/
// const gridVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.06, delayChildren: 0.02 }
//   },
//   exit: { opacity: 0 }
// };
// const cardVariants = {
//   hidden: { opacity: 0, y: 12, scale: 0.98 },
//   show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
//   exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } }
// };

// /****************************
//  * GALLERY DATA (demo fallback)
//  ****************************/
// const GALLERY = [
//   { id: 'img-1', type: 'photo', title: 'Upacara Bendera', album: 'Kegiatan Sekolah', date: '2025-08-22', src: makeSvg(1600, 1000, '#1F3B76', '#2C3F6B', 'Upacara Bendera', 'Lapangan'), w:1600, h:1000 },
//   { id: 'img-2', type: 'photo', title: 'Lomba Futsal', album: 'Olahraga', date: '2025-08-15', src: makeSvg(1600, 1000, '#0B1733', '#102347', 'Turnamen Futsal', 'Provinsi DKI Jakarta'), w:1600, h:1000 },
//   { id: 'img-3', type: 'photo', title: 'Pameran Karya RPL', album: 'Akademik', date: '2025-07-30', src: makeSvg(1600, 1000, '#F2C94C', '#1F3B76', 'Pameran Karya', 'Jurusan RPL'), w:1600, h:1000 },
//   { id: 'img-4', type: 'photo', title: 'Kegiatan Pramuka', album: 'Kesiswaan', date: '2025-07-12', src: makeSvg(1600, 1000, '#2C3F6B', '#0B1733', 'Latihan Pramuka', 'Lapangan Belakang'), w:1600, h:1000 },
//   { id: 'vid-1', type: 'video', title: 'Profil Sekolah', album: 'Video', date: '2025-07-10', embed: 'https://www.youtube.com/embed/5qap5aO4i9A' },
//   { id: 'img-5', type: 'photo', title: 'Wisuda Siswa', album: 'Kegiatan Sekolah', date: '2025-06-25', src: makeSvg(1600, 1000, '#1F3B76', '#F2C94C', 'Wisuda 2025', 'Jakarta'), w:1600, h:1000 },
//   { id: 'img-6', type: 'photo', title: 'Lomba Inovasi', album: 'Akademik', date: '2025-06-10', src: makeSvg(1600, 1000, '#1F3B76', '#4CAF50', 'Inovasi Teknologi', 'Juara 1 Kota'), w:1600, h:1000 },
// ];

// /****************************
//  * LOCAL STORAGE — views counter
//  ****************************/
// const VIEWS_KEY = 'galleryViews:v1';
// const loadViews = () => { try { return JSON.parse(localStorage.getItem(VIEWS_KEY) || '{}'); } catch { return {}; } };
// const saveViews = (obj: Record<string, number>) => { try { localStorage.setItem(VIEWS_KEY, JSON.stringify(obj)); } catch {} };

// /****************************
//  * GALLERY CARD & LIGHTBOX
//  ****************************/
// const GalleryCard = ({ item, theme, onOpen, views = 0 }) => {
//   const isVideo = item.type === 'video';
//   const [loaded, setLoaded] = useState(false);
//   const prefersReducedMotion = useReducedMotion();

//   return (
//     <motion.div
//       whileHover={{ y: prefersReducedMotion ? 0 : -4 }}
//       transition={{ type: 'spring', stiffness: 220, damping: 18 }}
//       className="rounded-2xl overflow-hidden border hover:shadow-md transition flex flex-col break-inside-avoid mb-4 cursor-pointer"
//       style={{ borderColor: theme.subtle, background: theme.surface }}
//       onClick={() => onOpen(item)}
//     >
//       <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9', background: theme.subtle }}>
//         {isVideo ? (
//           <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: theme.primaryText }}>Video</div>
//         ) : (
//           <motion.img
//             layoutId={`media-${item.id}`}
//             src={item.src}
//             alt={item.title}
//             loading="lazy"
//             onLoad={() => setLoaded(true)}
//             initial={{ scale: 1 }}
//             animate={{ scale: prefersReducedMotion ? 1 : 1.1 }}
//             transition={{ duration: 12, repeat: Infinity, repeatType: 'mirror' }}
//             className="w-full h-full object-cover"
//             style={{ filter: loaded ? 'none' : 'blur(12px)', transformOrigin: 'center' }}
//           />
//         )}
//       </div>
//       <div className="p-3 flex flex-col gap-1">
//         <div className="font-semibold line-clamp-1" style={{ color: theme.primaryText }}>{item.title}</div>
//         <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>
//           {new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} · {item.album}
//         </div>
//         <div className="text-[11px] opacity-80" style={{ color: theme.surfaceText }}>{views}x dilihat</div>
//         <span className="mt-1 text-xs px-3 py-1 rounded-lg border self-start" style={{ borderColor: theme.subtle, color: theme.primaryText }}>
//           Lihat
//         </span>
//       </div>
//     </motion.div>
//   );
// };

// const Lightbox = ({
//   open,
//   onClose,
//   item,
//   theme,
//   onViewed,
//   onPrev,
//   onNext,
//   items = [],
//   index = -1,
//   count = 0,
//   direction = 0,
//   onJump,
//   autoPlay = true,
//   autoInterval = 5000,
// }) => {
//   if (!open) return null;

//   const isVideo = item?.type === 'video';
//   const hasItems = items.length > 0;

//   useEffect(() => {
//     if (item && hasItems) onViewed?.(item);
//   }, [item, hasItems, onViewed]);

//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose?.();
//       if (e.key === 'ArrowLeft' && hasItems) onPrev?.();
//       if (e.key === 'ArrowRight' && hasItems) onNext?.();
//     };
//     document.addEventListener('keydown', onKey);
//     return () => document.removeEventListener('keydown', onKey);
//   }, [open, onClose, onPrev, onNext, hasItems]);

//   const [auto, setAuto] = useState(!!autoPlay && hasItems);
//   const [paused, setPaused] = useState(false);
//   useEffect(() => {
//     if (!open || !auto || paused || !hasItems || count <= 1) return;
//     const id = setInterval(() => onNext?.(), Math.max(2000, autoInterval));
//     return () => clearInterval(id);
//   }, [open, auto, paused, count, autoInterval, onNext, index, hasItems]);

//   const slideVariants = {
//     enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
//     center: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 26 } },
//     exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.18 } })
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[60] flex items-center justify-center p-4"
//     >
//       <div className="absolute inset-0" style={{ background: "rgba(0, 0, 0, 0.6)" }} onClick={onClose} />
//       <motion.div
//         initial={{ opacity: 0, y: 16, scale: 0.98 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         exit={{ opacity: 0, y: -8, scale: 0.98 }}
//         className="relative w-full max-w-5xl rounded-2xl border overflow-hidden"
//         style={{ background: theme.surface, borderColor: theme.subtle }}
//       >
//         <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: `1px solid ${theme.subtle}` }}>
//           <div className="font-semibold" style={{ color: theme.primaryText }}>
//             {hasItems ? item?.title : "Album Kosong"}
//           </div>
//           <button
//             onClick={onClose}
//             className="px-2 py-1 rounded-lg border text-xs focus:ring-2 focus:ring-yellow-300"
//             style={{ borderColor: theme.subtle, color: theme.primaryText }}
//             aria-label="Tutup"
//           >
//             Tutup
//           </button>
//         </div>

//         <div
//           className="flex items-center justify-center relative"
//           style={{ minHeight: 400 }}
//           onMouseEnter={() => setPaused(true)}
//           onMouseLeave={() => setPaused(false)}
//         >
//           {hasItems ? (
//             <AnimatePresence custom={direction} mode="wait">
//               <motion.div
//                 key={item.id}
//                 custom={direction}
//                 variants={slideVariants}
//                 initial="enter"
//                 animate="center"
//                 exit="exit"
//                 className="w-full flex items-center justify-center select-none"
//                 drag="x"
//                 dragElastic={0.2}
//                 onDragEnd={(_, info) => {
//                   if (info.offset.x > 120) onPrev();
//                   else if (info.offset.x < -120) onNext();
//                 }}
//               >
//                 {isVideo ? (
//                   <div className="w-full aspect-video">
//                     <iframe
//                       className="w-full h-full"
//                       src={item.embed}
//                       title={item.title}
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                       allowFullScreen
//                     />
//                   </div>
//                 ) : (
//                   <motion.img
//                     layoutId={`media-${item.id}`}
//                     src={item.src}
//                     alt={item.title}
//                     className="max-h-[70vh] rounded-lg border shadow-lg w-auto object-contain"
//                     style={{ borderColor: "rgba(255,255,255,0.3)" }}
//                     initial={{ scale: 1.02 }}
//                     animate={{ scale: 1.08 }}
//                     transition={{ duration: 16, repeat: Infinity, repeatType: "mirror" }}
//                   />
//                 )}
//               </motion.div>
//             </AnimatePresence>
//           ) : (
//             <div className="text-center p-8">
//               <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
//               <p className="text-lg font-medium" style={{ color: theme.primaryText }}>Album kosong</p>
//               <p className="text-sm mt-2 opacity-70" style={{ color: theme.surfaceText }}>Belum ada foto atau video.</p>
//             </div>
//           )}
//         </div>

//         {hasItems && (
//           <>
//             <div className="px-4 py-3 text-sm" style={{ color: theme.surfaceText }}>
//               <div>
//                 {new Date(item.date).toLocaleDateString("id-ID", { dateStyle: "long" })} · Album: <strong>{item.album}</strong> · {index + 1}/{count}
//               </div>
//             </div>

//             <div className="px-3 pb-3 overflow-x-auto">
//               <div className="flex gap-2 min-w-full">
//                 {items.map((it, i) => (
//                   <button
//                     key={it.id}
//                     onClick={() => onJump(i)}
//                     className="shrink-0 rounded-lg overflow-hidden border"
//                     style={{ borderColor: i === index ? theme.accent : theme.subtle }}
//                     aria-label={`Lihat ${it.title}`}
//                   >
//                     {it.type === "video" ? (
//                       <div className="w-24 h-16 flex items-center justify-center text-[10px]" style={{ background: theme.subtle, color: theme.primaryText }}>
//                         Video
//                       </div>
//                     ) : (
//                       <img src={it.src} alt={it.title} className="w-24 h-16 object-cover" />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
//               {Array.from({ length: count }).map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => onJump(i)}
//                   className="w-2 h-2 rounded-full border"
//                   style={{
//                     background: i === index ? theme.accent : "transparent",
//                     borderColor: theme.subtle,
//                   }}
//                   aria-label={`Slide ${i + 1}`}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };

// /****************************
//  * API HELPERS
//  ****************************/
// const API_BASE = "https://dev.kiraproject.id";
// const API_HEADERS = {
//   "X-Host": getXHostHeader(),
//   'Cache-Control': 'no-store',
// };

// const fetchAlbums = async (): Promise<any[]> => {
//   const res = await fetch(`${API_BASE}/albums?includeItems=false`, { headers: API_HEADERS, cache: 'no-store' });
//   if (!res.ok) throw new Error(`HTTP ${res.status}`);
//   const json = await res.json();
//   if (!json.success) throw new Error("API response not success");
//   return json.data.filter((a: any) => a.isActive);
// };

// const fetchAlbumItems = async (albumId: number): Promise<any[]> => {
//   const res = await fetch(`${API_BASE}/gallery?albumId=${albumId}&isActive=true`, { headers: API_HEADERS, cache: 'no-store' });
//   if (!res.ok) throw new Error(`HTTP ${res.status}`);
//   const json = await res.json();
//   if (!json.success) throw new Error("API gallery not success");
//   return (json.data || []).map((it: any) => ({
//     id: `api-gallery-${it.id}`,
//     type: "photo",
//     title: it.title,
//     album: it.albumTitle || "Album",
//     date: it.date || it.createdAt,
//     src: it.imageUrl,
//     description: it.description,
//   }));
// };

// /****************************
//  * HOOK: useGallery
//  ****************************/
// const useGallery = () => {
//   const [albums, setAlbums] = useState<any[]>([]);
//   const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
//   const [items, setItems] = useState<any[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [loadingItems, setLoadingItems] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const data = await fetchAlbums();
//         setAlbums(data);
//       } catch (e: any) {
//         setError(e.message);
//         setAlbums([]);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const openAlbum = async (album: any) => {
//     setSelectedAlbum(album);
//     setCurrentIndex(0);
//     setLoadingItems(true);
//     setItems([]);

//     try {
//       const data = await fetchAlbumItems(album.id);
//       setItems(data.length > 0 ? data : GALLERY);
//     } catch (e: any) {
//       setError(e.message);
//       setItems(GALLERY);
//     } finally {
//       setLoadingItems(false);
//     }
//   };

//   const closeAlbum = () => {
//     setSelectedAlbum(null);
//     setItems([]);
//     setCurrentIndex(0);
//   };

//   const goTo = (index: number) => setCurrentIndex(index);
//   const goPrev = () => setCurrentIndex(i => (i <= 0 ? items.length - 1 : i - 1));
//   const goNext = () => setCurrentIndex(i => (i >= items.length - 1 ? 0 : i + 1));

//   return {
//     albums,
//     selectedAlbum,
//     items,
//     currentIndex,
//     loading,
//     loadingItems,
//     error,
//     openAlbum,
//     closeAlbum,
//     goTo,
//     goPrev,
//     goNext,
//   };
// };

// /****************************
//  * ALBUM LIST CARD
//  ****************************/
// const AlbumListCard = ({ album, theme, onOpen }: { album: any; theme: any; onOpen: (a: any) => void }) => {
//   const cover = album.coverUrl;

//   return (
//     <motion.div
//       whileHover={{ scale: 1.02 }}
//       className="rounded-xl overflow-hidden border cursor-pointer relative"
//       style={{ borderColor: theme.subtle, background: theme.surface }}
//       onClick={() => onOpen(album)}
//     >
//       <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
//         {cover ? (
//           <img
//             src={`${API_BASE}${cover}`}
//             alt={album.title}
//             className="w-full h-full object-cover"
//             loading="lazy"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-700 flex items-center justify-center">
//             <Camera className="w-12 h-12 text-gray-500" />
//           </div>
//         )}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
//         <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
//           <div className="font-semibold text-sm line-clamp-1">{album.title}</div>
//           <div className="text-xs opacity-80">
//             {new Date(album.createdAt).toLocaleDateString("id-ID", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             })}
//           </div>
//         </div>
//       </div>

//       <div className="p-3">
//         <span className="block w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium text-center border" style={{
//           background: theme.accent,
//           color: "#111827",
//           borderColor: theme.accent,
//         }}>
//           Lihat
//         </span>
//       </div>
//     </motion.div>
//   );
// };

// /****************************
//  * GALLERY SECTION
//  ****************************/
// const GallerySection = ({ theme, schoolName }: { theme: any; schoolName: string }) => {
//   const {
//     albums,
//     selectedAlbum,
//     items,
//     currentIndex,
//     loading,
//     loadingItems,
//     error,
//     openAlbum,
//     closeAlbum,
//     goTo,
//     goPrev,
//     goNext,
//   } = useGallery();

//   const [viewsMap, setViewsMap] = useState<Record<string, number>>(loadViews());
//   const [navDir, setNavDir] = useState(0);

//   const handleViewed = (item: any) => {
//     const next = { ...viewsMap, [item.id]: (viewsMap[item.id] || 0) + 1 };
//     setViewsMap(next);
//     saveViews(next);
//   };

//   const handlePrev = () => { setNavDir(-1); goPrev(); };
//   const handleNext = () => { setNavDir(1); goNext(); };
//   const handleJump = (index: number) => { setNavDir(index > currentIndex ? 1 : -1); goTo(index); };

//   const currentItem = items[currentIndex];

//   if (loading) {
//     return (
//       <section id="galeri" className="py-12 md:py-16">
//         <div className="max-w-6xl mx-auto px-4 text-center">
//           <p style={{ color: theme.primaryText }}>Memuat album...</p>
//         </div>
//       </section>
//     );
//   }

//   if (error && albums.length === 0) {
//     return (
//       <section id="galeri" className="py-12 md:py-16">
//         <div className="max-w-6xl mx-auto px-4 text-center">
//           {/* <p className="text-red-400">Gagal memuat: {error}</p> */}
//           <p className="text-sm mt-2" style={{ color: theme.surfaceText }}>Data tidak tersedia</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section id="galeri" className="py-12 md:py-16">
//       <div className="max-w-6xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="mb-8"
//         >
//           <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.accent }}>
//             Galeri {schoolName}
//           </h2>
//           <p className="text-sm opacity-85" style={{ color: theme.surfaceText }}>
//             Pilih album untuk melihat foto dan video kegiatan.
//           </p>
//         </motion.div>

//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//           variants={gridVariants}
//           initial="hidden"
//           animate="show"
//         >
//           <AnimatePresence mode="popLayout">
//             {albums.map((album) => (
//               <motion.div key={album.id} variants={cardVariants} layout>
//                 <AlbumListCard album={album} theme={theme} onOpen={openAlbum} />
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </motion.div>

//         <Lightbox
//           open={!!selectedAlbum && !loadingItems && items.length > 0}
//           onClose={closeAlbum}
//           item={currentItem}
//           theme={theme}
//           onViewed={handleViewed}
//           onPrev={handlePrev}
//           onNext={handleNext}
//           items={items}
//           index={currentIndex}
//           count={items.length}
//           direction={navDir}
//           onJump={handleJump}
//           autoPlay={true}
//           autoInterval={5000}
//         />

//         {loadingItems && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//             <p className="text-white text-lg">Memuat foto...</p>
//           </div>
//         )}

//         {selectedAlbum && !loadingItems && items.length === 0 && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={closeAlbum}>
//             <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-sm text-center">
//               <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//               <p className="font-medium">Album kosong</p>
//               <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Belum ada foto di album ini.</p>
//               <button onClick={closeAlbum} className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-medium">
//                 Tutup
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// /****************************
//  * DEFAULT PAGE + TESTS
//  ****************************/
// const GalleryPage = () => {
//   const schoolInfo = SMAN25_CONFIG;
//   const theme = schoolInfo.theme;
//   const schoolName = schoolInfo.fullName;

//   return (
//     <div className="min-h-screen" style={{ background: theme.bg }}>
//       <NavbarComp theme={theme} />
//       <main>
//         <GallerySection theme={theme} schoolName={schoolName} />
//       </main>
//       <FooterComp theme={theme} />
//     </div>
//   );
// };

// export default GalleryPage;



import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/****************************
 * HERO SECTION UNTUK GALERI
 ****************************/
const HeroSection = () => {
  const scrollToGallery = () => {
    document.getElementById("galeri-content")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      {/* Background Image - Kegiatan Sekolah Representatif */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/kgp2.jpeg')`, // Ganti jika ada foto resmi
          backgroundPosition: "center 35%",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
           className="text-4xl md:text-6xl font-bold mb-6"
        >
          Galeri Kegiatan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Dokumentasi foto dan video kegiatan siswa, guru, dan sekolah SMAN 25 Jakarta
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          onClick={scrollToGallery}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          Lihat Album Galeri
        </motion.button>
      </div>
    </section>
  );
};

/****************************
 * DUMMY DATA GALERI (Fallback jika API gagal)
 ****************************/
const DUMMY_ALBUMS = [
  {
    id: 1,
    title: "Kegiatan di Bulan Ramadhan",
    createdAt: "2025-03-15",
    coverUrl: "/kgs1.jpeg",
    itemCount: 6,
  },
  {
    id: 2,
    title: "Kegiatan Kesiswaan",
    createdAt: "2025-09-10",
    coverUrl: "/kg1.jpeg",
    itemCount: 6,
  },
  {
    id: 3,
    title: "Kegiatan Kurikulum",
    createdAt: "2025-08-20",
    coverUrl: "/kgr1.jpg",
    itemCount: 3,
  },
  {
    id: 4,
    title: "Kegiatan Sarana Prasarana",
    createdAt: "2025-07-05",
    coverUrl: "/kgp1.jpeg",
    itemCount: 8,
  },
];

const DUMMY_ITEMS = {
  1: Array.from({ length: 6 }, (_, i) => ({
    id: `kgs-${i + 1}`,
    type: "photo",
    title: `Kegiatan Ramadhan ${i + 1}`,
    albumTitle: "Kegiatan Keagamaan di Bulan Ramadhan",
    date: "2025-03-15",
    imageUrl: `/kgs${i + 1}.jpeg`,
  })),
  2: Array.from({ length: 6 }, (_, i) => ({
    id: `kg-${i + 1}`,
    type: "photo",
    title: `Kegiatan Kesiswaan ${i + 1}`,
    albumTitle: "Kegiatan Kesiswaan",
    date: "2025-09-10",
    imageUrl: `/kg${i + 1}.jpeg`,
  })),
  3: Array.from({ length: 3 }, (_, i) => ({
    id: `kgr-${i + 1}`,
    type: "photo",
    title: `Kegiatan Kurikulum ${i + 1}`,
    albumTitle: "Kegiatan Kurikulum",
    date: "2025-08-20",
    imageUrl: `/kgr${i + 1}.jpg`,
  })),
  4: Array.from({ length: 8 }, (_, i) => ({
    id: `kgp-${i + 1}`,
    type: "photo",
    title: `Sarana Prasarana ${i + 1}`,
    albumTitle: "Kegiatan Sarana Prasarana",
    date: "2025-07-05",
    imageUrl: `/kgp${i + 1}.jpeg`,
  })),
};

/****************************
 * GALLERY PAGE DENGAN HERO & DUMMY DATA
 ****************************/
const GalleryPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);

  // Load dummy albums (bisa diganti dengan API jika tersedia)
  useEffect(() => {
    setLoading(true);
    // Simulasi loading
    setTimeout(() => {
      setAlbums(DUMMY_ALBUMS);
      setLoading(false);
    }, 600);
  }, []);

  const openAlbum = (album: any) => {
    setSelectedAlbum(album);
    setCurrentIndex(0);
    setLoadingItems(true);

    setTimeout(() => {
      const dummyData = DUMMY_ITEMS[album.id as keyof typeof DUMMY_ITEMS] || [];
      setItems(dummyData.map((it: any) => ({
        id: it.id,
        type: it.type,
        title: it.title,
        album: it.albumTitle,
        date: it.date,
        src: it.imageUrl,
      })));
      setLoadingItems(false);
    }, 800);
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setItems([]);
    setCurrentIndex(0);
  };

  const goPrev = () => setCurrentIndex(i => (i <= 0 ? items.length - 1 : i - 1));
  const goNext = () => setCurrentIndex(i => (i >= items.length - 1 ? 0 : i + 1));
  const goTo = (index: number) => setCurrentIndex(index);

  const currentItem = items[currentIndex];

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* HERO SECTION */}
      <HeroSection />

      {/* KONTEN GALERI */}
      <section id="galeri-content" className="py-20 md:py-28 -mt-12 relative z-[1]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: theme.primaryText }}>
              Galeri {schoolName}
            </h2>
            <p className="text-lg opacity-80 max-w-3xl mx-auto" style={{ color: theme.surfaceText }}>
              Koleksi foto kegiatan siswa, guru, dan sekolah sepanjang tahun ajaran.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-lg" style={{ color: theme.primaryText }}>Memuat album...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-8">
              {albums.map((album) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                  onClick={() => openAlbum(album)}
                >
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{album.title}</h3>
                    <p className="text-sm opacity-90">
                      {album.itemCount} foto 
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <span className="text-white text-2xl font-bold">Lihat →</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX (dari kode asli, disederhanakan untuk dummy) */}
      {selectedAlbum && !loadingItems && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90"
          onClick={closeAlbum}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeAlbum}
              className="absolute top-4 right-4 z-10 w-12 h-12 md:w-16 md:h-16 bg-red-700 text-white flex items-center justify-center rounded-full backdrop-blur hover:bg-white/40 text-3xl"
            >
              ✕
            </button>

            <img
              src={currentItem.src}
              alt={currentItem.title}
              className="w-full max-h-[85vh] object-contain rounded-2xl"
            />

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{currentItem.title}</h3>
              <p className="text-sm opacity-90">
                Album: {currentItem.album} · {new Date(currentItem.date).toLocaleDateString("id-ID", { dateStyle: "long" })}
              </p>
            </div>

            {/* Navigation */}
            {items.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 text-white text-3xl"
                >
                  ‹
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 text-white text-3xl"
                >
                  ›
                </button>
              </>
            )}

            {/* Thumbnails */}
            <div className="absolute bottom-20 left-0 right-0 px-6 overflow-x-auto">
              <div className="flex gap-2 justify-center">
                {items.map((it, i) => (
                  <button
                    key={it.id}
                    onClick={() => goTo(i)}
                    className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-4 transition-all ${
                      i === currentIndex ? "border-white scale-110" : "border-transparent opacity-60"
                    }`}
                  >
                    <img src={it.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <FooterComp theme={theme} />
    </div>
  );
};

export default GalleryPage;