// import { SMAN25_CONFIG } from "@/core/theme";
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { AnimatePresence, motion } from "framer-motion";
// import { useEffect, useRef, useState } from "react";

// /****************************
//  * API CONFIG
//  ****************************/
// const API_BASE = "https://dev.kiraproject.id";
// const xHost = getXHostHeader();
// const headers = {
//   "X-Host": xHost,
//   "Content-Type": "application/json",
//   "Cache-Control": "no-store",
// };

// const fetchServices = async () => {
//   const res = await fetch(`${API_BASE}/services`, { headers, cache: "no-store" });
//   if (!res.ok) throw new Error(`HTTP ${res.status}`);
//   const json = await res.json();
//   if (!Array.isArray(json.data)) throw new Error("Data tidak valid");
//   return json.data;
// };

// const submitServiceRequest = async (payload: any) => {
//   const res = await fetch(`${API_BASE}/services/submit`, {
//     method: "POST",
//     headers,
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error(`HTTP ${res.status}`);
//   return res.json();
// };

// /****************************
//  * UTILS
//  ****************************/
// const useOnClickOutside = (ref: any, handler: any) => {
//   useEffect(() => {
//     const listener = (e: any) => {
//       if (!ref.current || ref.current.contains(e.target)) return;
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

// /****************************
//  * RATING STORAGE
//  ****************************/
// const getStoredRatings = () => {
//   if (typeof window === "undefined") return {};
//   try { return JSON.parse(localStorage.getItem("svc_ratings") || "{}"); } catch { return {}; }
// };

// const setStoredRatings = (obj: any) => {
//   if (typeof window === "undefined") return;
//   try { localStorage.setItem("svc_ratings", JSON.stringify(obj)); } catch {}
// };

// /****************************
//  * COMPONENTS
//  ****************************/
// const StarRating = ({ value = 0, onChange }: { value?: number; onChange?: (v: number) => void }) => {
//   const stars = [1, 2, 3, 4, 5];
//   return (
//     <div className="flex items-center gap-1">
//       {stars.map((s) => (
//         <button
//           key={s}
//           type="button"
//           onClick={() => onChange?.(s)}
//           aria-label={`Rating ${s}`}
//           className="text-2xl leading-none hover:scale-110 transition-transform"
//           style={{ color: s <= value ? theme.gold : (theme.type === 'SMKN' ? '#4B5563' : '#E5E7EB') }}
//         >
//           Star
//         </button>
//       ))}
//     </div>
//   );
// };

// const LoadingSpinner = () => (
//   <div className="flex items-center justify-center text-center py-12">
//     <p>Memuat...</p>
//     {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current" style={{ color: theme.gold }}></div> */}
//   </div>
// );

// const ErrorMessage = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
//   <div className="text-center py-12">
//     <p className="text-sm mb-4" style={{ color: theme.muted }}>Gagal memuat data layanan</p>
//     <button
//       onClick={onRetry}
//       className="px-6 py-2 rounded-xl border font-medium transition-colors"
//       style={{
//         borderColor: theme.gold,
//         color: theme.gold,
//         background: `rgba(${theme.type === 'SMKN' ? '242,201,76' : '245,158,11'}, 0.1)`,
//       }}
//       onMouseEnter={(e) => (e.currentTarget.style.background = `rgba(${theme.type === 'SMKN' ? '242,201,76' : '245,158,11'}, 0.2)`)}
//       onMouseLeave={(e) => (e.currentTarget.style.background = `rgba(${theme.type === 'SMKN' ? '242,201,76' : '245,158,11'}, 0.1)`)}
//     >
//       Retry
//     </button>
//   </div>
// );

// const ServiceCard = ({ service, onClick }: { service: any; onClick: () => void }) => (
//   <motion.div
//     whileHover={{ y: -4, scale: 1.02 }}
//     onClick={onClick}
//     className="w-full rounded-2xl p-4 border cursor-pointer group transition-all"
//     style={{ background: theme.surface, borderColor: theme.border }}
//   >
//     <div className="flex items-start justify-between mb-3">
//       <div className="font-semibold text-base leading-tight" style={{ color: theme.surfaceText }}>
//         {service.title}
//       </div>
//       {service.sla && (
//         <span
//           className="text-xs px-2 py-1 rounded-full border font-medium"
//           style={{
//             borderColor: theme.gold,
//             color: theme.gold,
//             background: `rgba(${theme.type === 'SMKN' ? '242,201,76' : '245,158,11'}, 0.1)`,
//           }}
//         >
//           {service.sla}
//         </span>
//       )}
//     </div>
//     <p className="text-sm mb-4 leading-relaxed" style={{ color: theme.muted }}>
//       {service.description}
//     </p>
//     <div className="flex flex-col gap-2 pt-3 border-t" style={{ borderColor: theme.border }}>
//       <div className="flex items-center justify-between text-xs" style={{ color: theme.muted }}>
//         {service.accessUrl && (
//           <span className="flex items-center gap-1 truncate group-hover:underline">
//             Link {service.accessUrl.replace(/^https?:\/\//, "").split('/')[0]}
//           </span>
//         )}
//         {service.contact && (
//           <span className="flex items-center gap-1 truncate">{service.contact.split("@")[0]}...</span>
//         )}
//       </div>
//     </div>
//   </motion.div>
// );

// const Modal = ({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
//   const ref = useRef(null);
//   useOnClickOutside(ref, onClose);

//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
//     if (open) document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [open, onClose]);

//   if (!open) return null;

//   return (
//     <AnimatePresence>
//       {open && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center p-4"
//           style={{ background: "rgba(0,0,0,0.55)" }}
//         >
//           <motion.div
//             ref={ref}
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
//             style={{ background: theme.type === 'SMAN' ? '#ffffff' : '#1f2937', color: theme.surfaceText }}
//             role="dialog"
//             aria-modal="true"
//           >
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 text-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
//               style={{ color: theme.muted }}
//               aria-label="Tutup"
//             >
//               X
//             </button>
//             <h3 className="text-2xl font-bold mb-6" style={{ color: theme.primary }}>{title}</h3>
//             {children}
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// /****************************
//  * INTERNAL SERVICES
//  ****************************/
// const QuickServicesGrid = () => {
//   const queryClient = useQueryClient();
//   const [openKey, setOpenKey] = useState<string | null>(null);
//   const [formData, setFormData] = useState<Record<string, string>>({});
//   const [userRating, setUserRating] = useState(0);
//   const [userFeedback, setUserFeedback] = useState("");
//   const [ratings, setRatings] = useState<Record<string, { sum: number; count: number }>>({});
//   const [rateWindow, setRateWindow] = useState({ start: 0, count: 0 });
//   const RATE_LIMIT_MS = 5 * 60 * 1000;
//   const RATE_MAX = 3;

//   const { data: services = [], isPending: loading, error } = useQuery({
//     queryKey: ["services"],
//     queryFn: fetchServices,
//     staleTime: 0,
//     gcTime: 0,
//   });

//   const internal = services.filter((s: any) => s.type === "internal" && s.isActive);

//   // Load ratings
//   useEffect(() => {
//     setRatings(getStoredRatings());
//   }, []);

//   useEffect(() => {
//     setStoredRatings(ratings);
//   }, [ratings]);

//   // Rate limit
//   useEffect(() => {
//     const now = Date.now();
//     const start = Number(localStorage.getItem("svc_rate_start") || "0");
//     const count = Number(localStorage.getItem("svc_rate_count") || "0");
//     if (now - start > RATE_LIMIT_MS) {
//       localStorage.setItem("svc_rate_start", String(now));
//       localStorage.setItem("svc_rate_count", "0");
//       setRateWindow({ start: now, count: 0 });
//     } else {
//       setRateWindow({ start, count });
//     }
//   }, []);

//   const incrementRate = () => {
//     const now = Date.now();
//     let { start, count } = rateWindow;
//     if (now - start > RATE_LIMIT_MS) {
//       start = now;
//       count = 0;
//     }
//     count += 1;
//     localStorage.setItem("svc_rate_start", String(start));
//     localStorage.setItem("svc_rate_count", String(count));
//     setRateWindow({ start, count });
//   };

//   const mutation = useMutation({
//     mutationFn: submitServiceRequest,
//     onSuccess: () => {
//       incrementRate();
//       const svc = internal.find((s: any) => s.id === openKey);
//       alert(`Permohonan "${svc?.title}" berhasil!\nTiket: #${Date.now().toString().slice(-6)}`);
//       if (userRating > 0) {
//         setRatings((prev) => {
//           const cur = prev[openKey] || { sum: 0, count: 0 };
//           return { ...prev, [openKey]: { sum: cur.sum + userRating, count: cur.count + 1 } };
//         });
//       }
//       onClose();
//     },
//     onError: () => {
//       incrementRate();
//       alert("Gagal mengirim. Coba lagi.");
//     },
//   });

//   const onOpen = (svc: any) => {
//     setOpenKey(svc.id);
//     setFormData({});
//     setUserRating(0);
//     setUserFeedback("");
//   };

//   const onClose = () => {
//     setOpenKey(null);
//     setFormData({});
//     setUserRating(0);
//     setUserFeedback("");
//   };

//   const onSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (rateWindow.count >= RATE_MAX) {
//       alert("Terlalu sering. Tunggu 5 menit.");
//       return;
//     }
//     if (!formData.nama?.trim() || !formData.email?.trim()) {
//       alert("Nama dan kontak wajib diisi");
//       return;
//     }
//     const svc = internal.find((s: any) => s.id === openKey);
//     mutation.mutate({
//       serviceId: openKey,
//       serviceTitle: svc.title,
//       ...formData,
//       rating: userRating,
//       feedback: userFeedback,
//       timestamp: new Date().toISOString(),
//     });
//   };

//   const getAvg = (id: string) => {
//     const r = ratings[id];
//     return r && r.count > 0 ? Math.round((r.sum / r.count) * 10) / 10 : 0;
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorMessage error={(error as any).message} onRetry={() => queryClient.invalidateQueries({ queryKey: ["services"] })} />;

//   return (
//     <section id="layanan" className="py-12">
//       <div className="max-w-6xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h2 className="text-3xl font-bold" style={{ color: theme.gold }}>Layanan Internal</h2>
//           <p className="text-sm mt-1" style={{ color: theme.muted }}>Untuk siswa, guru, dan staf</p>
//         </motion.div>

//         {internal.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-sm" style={{ color: theme.muted }}>Belum ada layanan</p>
//           </div>
//         ) : (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {internal.map((svc: any) => (
//               <ServiceCard key={svc.id} service={svc} onClick={() => onOpen(svc)} />
//             ))}
//           </div>
//         )}

//         <Modal open={!!openKey} onClose={onClose} title={internal.find((s: any) => s.id === openKey)?.title || ""}>
//           <form onSubmit={onSubmit} className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <label className="block space-y-2">
//                 <span className="text-sm font-semibold" style={{ color: theme.surfaceText }}>
//                   Nama Lengkap <span className="text-red-500">*</span>
//                 </span>
//                 <input
//                   name="nama"
//                   type="text"
//                   required
//                   value={formData.nama || ""}
//                   onChange={(e) => setFormData((p) => ({ ...p, nama: e.target.value }))}
//                   className="w-full rounded-xl px-4 py-3 border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
//                   style={{ borderColor: theme.border, background: theme.type === 'SMAN' ? '#fff' : '#1f2937', color: theme.surfaceText }}
//                   placeholder="Nama lengkap"
//                 />
//               </label>
//               <label className="block space-y-2">
//                 <span className="text-sm font-semibold" style={{ color: theme.surfaceText }}>
//                   Kontak <span className="text-red-500">*</span>
//                 </span>
//                 <input
//                   name="email"
//                   type="text"
//                   required
//                   value={formData.email || ""}
//                   onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
//                   className="w-full rounded-xl px-4 py-3 border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
//                   style={{ borderColor: theme.border, background: theme.type === 'SMAN' ? '#fff' : '#1f2937', color: theme.surfaceText }}
//                   placeholder="email / WA"
//                 />
//               </label>
//             </div>

//             <label className="block space-y-2">
//               <span className="text-sm font-semibold" style={{ color: theme.surfaceText }}>Kelas/NIS/NIP</span>
//               <input
//                 name="kelas"
//                 type="text"
//                 value={formData.kelas || ""}
//                 onChange={(e) => setFormData((p) => ({ ...p, kelas: e.target.value }))}
//                 className="w-full rounded-xl px-4 py-3 border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
//                 style={{ borderColor: theme.border, background: theme.type === 'SMAN' ? '#fff' : '#1f2937', color: theme.surfaceText }}
//                 placeholder="XII TKJ 1 / 123456"
//               />
//             </label>

//             <label className="block space-y-2">
//               <span className="text-sm font-semibold" style={{ color: theme.surfaceText }}>Keterangan</span>
//               <textarea
//                 name="keterangan"
//                 rows={4}
//                 value={formData.keterangan || ""}
//                 onChange={(e) => setFormData((p) => ({ ...p, keterangan: e.target.value }))}
//                 className="w-full rounded-xl px-4 py-3 border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-vertical"
//                 style={{ borderColor: theme.border, background: theme.type === 'SMAN' ? '#fff' : '#1f2937', color: theme.surfaceText }}
//                 placeholder="Detail kebutuhan..."
//               />
//             </label>

//             <div className="p-6 rounded-2xl border" style={{ borderColor: theme.border, background: theme.type === 'SMAN' ? 'linear-gradient(to right, #fefce8, #fff7ed)' : 'linear-gradient(to right, #1a1a2e, #16213e)' }}>
//               <div className="text-lg font-bold mb-4" style={{ color: theme.surfaceText }}>Penilaian</div>
//               <div className="flex items-center justify-between mb-4">
//                 <StarRating value={userRating} onChange={setUserRating} />
//                 {getAvg(openKey!) > 0 && (
//                   <div className="text-sm px-3 py-1 rounded-full" style={{ background: theme.type === 'SMAN' ? '#fff' : '#1f2937', color: theme.surfaceText }}>
//                     {getAvg(openKey!)}/5
//                   </div>
//                 )}
//               </div>
//               <textarea
//                 className="w-full rounded-xl px-4 py-3 border focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm"
//                 style={{ borderColor: theme.border, background: theme.type === 'SMAN' ? '#fff' : '#1f2937', color: theme.surfaceText }}
//                 placeholder="Saran..."
//                 value={userFeedback}
//                 onChange={(e) => setUserFeedback(e.target.value)}
//                 rows={3}
//               />
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 pt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex-1 px-6 py-3 rounded-xl border font-medium transition-all"
//                 style={{ borderColor: theme.border, color: theme.surfaceText, background: `rgba(255,255,255,0.1)` }}
//               >
//                 Batal
//               </button>
//               <button
//                 type="submit"
//                 disabled={mutation.isPending || rateWindow.count >= RATE_MAX}
//                 className="flex-1 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
//                 style={{
//                   background: mutation.isPending || rateWindow.count >= RATE_MAX ? '#9CA3AF' : theme.gold,
//                   color: '#111827',
//                 }}
//               >
//                 {mutation.isPending ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Mengirim...
//                   </>
//                 ) : (
//                   "Kirim Permohonan"
//                 )}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       </div>
//     </section>
//   );
// };

// /****************************
//  * PUBLIC SERVICES
//  ****************************/
// const PublicServices = () => {
//   const { data: services = [], isPending: loading, error } = useQuery({
//     queryKey: ["services"],
//     queryFn: fetchServices,
//     staleTime: 0,
//     gcTime: 0,
//   });

//   const publicServices = services.filter((s: any) => s.type === "public" && s.isActive);

//   const handleClick = (svc: any) => {
//     if (svc.accessUrl) {
//       window.open(svc.accessUrl, "_blank", "noopener,noreferrer");
//     } else {
//       const msg = `Layanan: ${svc.title}\nKontak: ${svc.contact || "Tidak ada"}\nDeskripsi: ${svc.description}`;
//       navigator.clipboard.writeText(msg);
//       alert(`Info disalin!\n\n${msg}`);
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorMessage error={(error as any).message} onRetry={() => location.reload()} />;

//   return (
//     <section id="layanan-publik" className="py-12 border-t" style={{ borderColor: theme.border }}>
//       <div className="max-w-6xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="mb-12"
//         >
//           <h2 className="text-3xl font-bold mb-4" style={{ color: theme.gold }}>Layanan Publik</h2>
//           <p className="text-sm max-w-2xl" style={{ color: theme.surfaceText }}>Untuk masyarakat umum</p>
//         </motion.div>

//         {publicServices.length === 0 ? (
//           <div className="text-center py-16">
//             <p className="text-sm" style={{ color: theme.muted }}>Belum ada layanan publik</p>
//           </div>
//         ) : (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {publicServices.map((svc: any) => (
//               <ServiceCard key={svc.id} service={svc} onClick={() => handleClick(svc)} />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// /****************************
//  * MAIN PAGE
//  ****************************/
// let theme: any = {};
// export default function LayananPage() {
//   const school = SMAN25_CONFIG;
//   theme = school.theme;

//   useEffect(() => {
//     document.documentElement.style.setProperty("--brand-primary", theme.primary);
//     document.documentElement.style.setProperty("--brand-accent", theme.gold);
//     document.documentElement.style.setProperty("--brand-bg", theme.bg);
//     document.documentElement.style.setProperty("--brand-surface", theme.surface);
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: theme.bg }}>
//       <NavbarComp theme={theme} />
//       <main className="flex-1">
//         <QuickServicesGrid />
//         <PublicServices />
//       </main>
//       <FooterComp theme={theme} />
//     </div>
//   );
// }



import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MapPin, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ================= API ================= */
const API_BASE = "https://dev.kiraproject.id";
const headers = {
  "X-Host": getXHostHeader(),
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

const fetchServices = async () => {
  const r = await fetch(`${API_BASE}/services`, { headers, cache: "no-store" });
  if (!r.ok) throw new Error("Gagal memuat");
  const j = await r.json();
  return j.data ?? [];
};

const submitServiceRequest = async (payload: any) => {
  const r = await fetch(`${API_BASE}/services/submit`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("Submit gagal");
  return r.json();
};

/* ================= UI UTILS ================= */
const useOnClickOutside = (ref: any, cb: any) => {
  useEffect(() => {
    const h = (e: any) => ref.current && !ref.current.contains(e.target) && cb();
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
};

/* ================= COMPONENTS ================= */
const Card = ({ children }: any) => (
  <div className="rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition">
    {children}
  </div>
);

const Loading = () => (
  <div className="py-20 text-center text-sm text-black/80">Memuat data…</div>
);

const StarRating = ({ value, onChange }: any) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        onClick={() => onChange(s)}
        className={`text-xl transition ${
          s <= value ? "text-black" : "text-black/20"
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

/* ================= MODAL ================= */
const Modal = ({ open, onClose, title, children }: any) => {
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 inset-0 z-[9999999999999999999] bg-black/90 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={ref}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl relative"
        >
          <button
            onClick={onClose}
            className="absolute z-[9999999] top-4 right-4 text-black/80 hover:text-black"
          >
            <X />
          </button>
          <h3 className="text-xl font-bold mb-6">{title}</h3>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ================= HERO SECTION ================= */
const HeroSection = () => {
  const theme = SMAN25_CONFIG.theme;

  const scrollToServices = () => {
    document
      .getElementById("layanan-internal")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative z-[1] h-[84vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/hero1.png')`, // Ganti dengan URL gambar sekolah yang sesuai jika ada
        }}
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Layanan Internal SMAN 25 Jakarta
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 text-white/90"
        >
          Kami siap membantu segala kebutuhan administrasi, fasilitas, dan layanan pendukung lainnya untuk warga sekolah.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={scrollToServices}
          className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition shadow-lg"
        >
          Jelajahi Layanan
        </motion.button>
      </div>
    </section>
  );
};

/* ================= SERVICES ================= */
const ServicesGrid = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [rating, setRating] = useState(0);

  const { data = [], isPending, error } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const services = data.filter((s: any) => s.type === "internal");

  const mutation = useMutation({
    mutationFn: submitServiceRequest,
    onSuccess: () => {
      alert("Permohonan berhasil dikirim");
      setOpen(null);
      setForm({});
      setRating(0);
    },
  });

  if (isPending) return <Loading />;
  if (error)
    return (
      <div className="text-center py-20">
        <button onClick={() => qc.invalidateQueries({ queryKey: ["services"] })}>
          Muat ulang
        </button>
      </div>
    );

  return (
    <section id="layanan-internal" className="py-16 bg-gray-50 relative z-[1]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center text-black">
          Layanan Internal
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {services.map((s: any) => (
            <Card key={s.id}>
              <button
                onClick={() => setOpen(s)}
                className="p-6 text-left w-full h-full border border-blue-600 rounded-lg shadow-md"
              >
                <div className="font-semibold mb-3 text-lg text-black">
                  {s.title}
                </div>
                <p className="text-sm text-black/80 line-clamp-4">
                  {s.description}
                </p>
              </button>
            </Card>
          ))}
        </div>
      </div>

        <Modal open={!!open} onClose={() => setOpen(null)} title={open?.title}>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const payload = {
                service_id: open?.id,
                nama: form.nama,
                kontak: form.kontak,
                keterangan: (e.target as any).keterangan.value,
                rating,
              };
              mutation.mutate(payload);
            }}
          >
            <input
              required
              placeholder="Nama Lengkap"
              className="w-full rounded-xl border px-4 py-3"
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />
            <input
              required
              placeholder="Kontak (WA/Email)"
              className="w-full rounded-xl border px-4 py-3"
              onChange={(e) => setForm({ ...form, kontak: e.target.value })}
            />
            <textarea
              required
              name="keterangan"
              placeholder="Keterangan / Detail Permohonan"
              rows={4}
              className="w-full rounded-xl border px-4 py-3 resize-none"
            />

            <div>
              <p className="text-sm mb-2 text-black/80">Rating Kepuasan (opsional)</p>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-xl bg-black text-white py-3 font-semibold disabled:opacity-70"
            >
              {mutation.isPending ? "Mengirim..." : "Kirim Permohonan"}
            </button>
          </form>
        </Modal>
    </section>
  );
};

/* ================= CONTACT ================= */
const ContactSection = () => {
  const theme = SMAN25_CONFIG.theme;
  return (
    <section className="relative z-[1] py-20 bg-white border-t">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: MapPin,
            title: "Alamat",
            text: "Jl. A.M Sangaji No.22-24, Jakarta",
          },
          { icon: Phone, title: "Telepon", text: "(021) 6331921" },
          { icon: Mail, title: "Email", text: "info@sman25-jkt.sch.id" },
        ].map((c, i) => (
          <Card key={i}>
            <div className="p-8 text-left space-y-4 bg-blue-500 rounded-lg">
              <c.icon size={32} style={{ color: 'white' }} />
              <div className="font-semibold text-lg text-white">{c.title}</div>
              <div className="text-sm text-white">{c.text}</div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

/* ================= PAGE ================= */
export default function LayananPage() {
  const theme = SMAN25_CONFIG.theme;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarComp theme={theme} />
      
      {/* Hero baru */}
      <HeroSection />

      <main className="flex-1 -mt-10 relative z-[1]">
        <ServicesGrid />
        <ContactSection />
      </main>
      
      <FooterComp theme={theme} />
    </div>
  );
}