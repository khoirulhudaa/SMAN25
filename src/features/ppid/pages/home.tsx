import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, File, Inbox, Info, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/****************************
 * ICONS
 ****************************/
const Icon = ({ label }: { label: string }) => (
  <span className="inline-block w-[18px] text-center select-none align-middle">{label}</span>
);
const IInfo = () => <Icon label="Info"/>;
const IBook = () => <Icon label="Book"/>;
const IShield = () => <Icon label="Shield"/>;
const IFile = () => <Icon label="File"/>;
const IChart = () => <Icon label="Chart"/>;
const IInbox = () => <Icon label="Inbox"/>;
const IPhone = () => <Icon label="Phone"/>;
const IFilter = () => <Icon label="Filter"/>;
const IArrowDown = () => <Icon label="Down"/>;
const IArrowRight = () => <Icon label="Right"/>;
const ICheck = () => <Icon label="Check"/>;
const IClock = () => <Icon label="Clock"/>;
const IAlert = () => <Icon label="Alert"/>;
const ILink = () => <Icon label="Link"/>;
const IUpload = () => <Icon label="Upload"/>;
const IPrint = () => <Icon label="Print"/>;

/****************************
 * UTILS
 ****************************/
const cls = (...arr: (string | boolean | undefined)[]) => arr.filter(Boolean).join(" ");
const Section = ({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-32 py-10">
    <div className="max-w-6xl mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2"
      >
        {icon} <span>{title}</span>
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 sm:p-6"
        style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
      >
        {children}
      </motion.div>
    </div>
  </section>
);

/****************************
 * API CONFIG
 ****************************/
const API_BASE = "https://dev.kiraproject.id";
const xHost = getXHostHeader();
const headers = { "X-Host": xHost, "Cache-Control": "no-store" };

const fetchDocuments = async () => {
  const res = await fetch(`${API_BASE}/documents`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error("Gagal memuat dokumen");
  const json = await res.json();
  if (!json.success) throw new Error("Data tidak valid");
  return json.data;
};

const fetchProfile = async () => {
  const school = SMAN25_CONFIG;
  const endpointMap: Record<string, string> = {
    "13": "/content/profile",
    "25": "/content/profile25",
    "65": "/content/profile65",
    "68": "/content/profile68",
    "78": "/content/profile78",
  };
  const endpoint = endpointMap[school.number] || "/content/profile78";

  const res = await fetch(`${API_BASE}${endpoint}`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error("Gagal memuat profil");
  const json = await res.json();
  if (!json.success || !json.data) return null;
  return json.data;
};

const fetchRatingSummary = async () => {
  const res = await axios.get(`${API_BASE}/ratings/summary`, { headers });
  return res.data;
};

const submitPermohonan = async (data: any) => {
  const res = await axios.post(`${API_BASE}/permohonan`, data, { headers: { ...headers, "Content-Type": "application/json" } });
  return res.data;
};

const submitRating = async (data: any) => {
  const res = await axios.post(`${API_BASE}/ratings`, data, { headers: { ...headers, "Content-Type": "application/json" } });
  return res.data;
};

/****************************
 * SUBNAV
 ****************************/
const SubNav = ({ items }: { items: { href: string; label: string }[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-16 z-30 w-full backdrop-blur border-b"
      style={{ background: `rgba(${theme.type === 'SMKN' ? '16,35,71' : '248,250,252'}, 0.85)`, borderColor: theme.border }}
    >
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3">
        <button onClick={() => setOpen(!open)} className="sm:hidden inline-flex items-center gap-1 text-sm" style={{ color: theme.surfaceText }}>
          <IFilter/> Menu <IArrowDown/>
        </button>
        <nav className={cls("flex-1", open ? "block" : "hidden sm:block")}>
          <ul className="flex flex-wrap items-center gap-2 py-1">
            {items.map((it) => (
              <li key={it.href}>
                <a href={it.href} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition hover:scale-105" style={{ background: `rgba(255,255,255,0.08)`, borderColor: theme.border, color: theme.surfaceText }}>
                  <ILink/> {it.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button onClick={() => window.print()} className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition hover:scale-105" style={{ background: `rgba(255,255,255,0.1)`, borderColor: theme.border, color: theme.surfaceText }}>
          <IPrint/> Cetak
        </button>
      </div>
    </motion.div>
  );
};

/****************************
 * DOKUMEN LIST
 ****************************/
const DokumenList = ({ kategoriFilter }: { kategoriFilter: string }) => {
  const [q, setQ] = useState("");
  const [kategori, setKategori] = useState(kategoriFilter || "Semua");
  const [tahun, setTahun] = useState("Semua");

  const { data: documents = [], isPending: loading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  });

  const { tahunOpts, kategoriOpts, filtered } = useMemo(() => {
    const years = Array.from(new Set(documents.map((d: any) => d.tahun))).sort((a: number, b: number) => b - a);
    const cats = Array.from(new Set(documents.map((d: any) => d.categoryName)));
    const filtered = documents.filter((d: any) =>
      (kategori === "Semua" || d.categoryName === kategori) &&
      (tahun === "Semua" || String(d.tahun) === tahun) &&
      (q === "" || d.judul.toLowerCase().includes(q.toLowerCase()))
    );
    return {
      tahunOpts: ["Semua", ...years.map(String)],
      kategoriOpts: ["Semua", ...cats.sort()],
      filtered,
    };
  }, [documents, q, kategori, tahun]);

  if (loading) return <div className="text-center py-8" style={{ color: 'white' }}>Memuat dokumen...</div>;
  if (error) return <div className="text-center py-8" style={{ color: theme.pop }}>Gagal memuat dokumen</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs" style={{ color: 'white' }}>Pencarian</label>
          <div className="mt-1 flex items-center gap-2 rounded-xl px-2 py-2" style={{ background: `rgba(255,255,255,0.05)`, border: `1px solid ${theme.border}` }}>
            <IFilter/>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari judul…" className="bg-transparent outline-none text-sm flex-1" style={{ color: theme.surfaceText }}/>
          </div>
        </div>
        <div>
          <label className="text-xs" style={{ color: 'white' }}>Kategori</label>
          <select value={kategori} onChange={e => setKategori(e.target.value)} className="mt-1 w-full rounded-xl px-3 py-2 text-sm" style={{ background: `rgba(255,255,255,0.05)`, border: `1px solid ${theme.border}`, color: theme.surfaceText }}>
            {kategoriOpts.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs" style={{ color: 'white' }}>Tahun</label>
          <select value={tahun} onChange={e => setTahun(e.target.value)} className="mt-1 w-full rounded-xl px-3 py-2 text-sm" style={{ background: `rgba(255,255,255,0.05)`, border: `1px solid ${theme.border}`, color: theme.surfaceText }}>
            {tahunOpts.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${theme.border}` }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead style={{ background: `rgba(255,255,255,0.08)` }}>
              <tr>
                <th className="text-left px-4 py-2" style={{ color: theme.surfaceText }}>Kategori</th>
                <th className="text-left px-4 py-2" style={{ color: theme.surfaceText }}>Judul</th>
                <th className="text-left px-4 py-2" style={{ color: theme.surfaceText }}>Tahun</th>
                <th className="text-left px-4 py-2" style={{ color: theme.surfaceText }}>Tipe</th>
                <th className="text-left px-4 py-2" style={{ color: theme.surfaceText }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d: any, i: number) => {
                const url = `${API_BASE}${d.url}`;
                return (
                  <tr key={d.id} style={{ background: i % 2 ? 'transparent' : 'rgba(255,255,255,0.03)' }}>
                    <td className="px-4 py-2" style={{ color: 'white' }}>{d.categoryName}</td>
                    <td className="px-4 py-2" style={{ color: theme.surfaceText }}>{d.judul}</td>
                    <td className="px-4 py-2" style={{ color: 'white' }}>{d.tahun}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs" style={{ background: `rgba(255,255,255,0.1)`, border: `1px solid ${theme.border}`, color: 'white' }}>
                        {d.tipe}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition hover:scale-105" style={{ background: `rgba(255,255,255,0.1)`, borderColor: theme.border, color: theme.surfaceText }}>
                          <ILink/> Lihat
                        </a>
                        <a href={url} download className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition hover:scale-105" style={{ background: `rgba(255,255,255,0.1)`, borderColor: theme.border, color: theme.surfaceText }}>
                          <IUpload/> Unduh
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center" style={{ color: 'white' }}>Tidak ada dokumen.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

/****************************
 * PROFIL PPID
 ****************************/
const ProfilPPID = () => {
  const { data: profile, isPending: loading, error } = useQuery({
    queryKey: ['ppid-profile'],
    queryFn: fetchProfile,
  });

  if (loading) return <div className="text-center py-8" style={{ color: 'white' }}>Memuat profil...</div>;
  if (error) return <div className="text-center py-8" style={{ color: theme.pop }}>Gagal memuat profil</div>;
  if (!profile) return <div className="text-center py-8" style={{ color: 'white' }}>Profil belum tersedia</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="prose prose-invert max-w-none"
      style={{ color: theme.surfaceText }}
    >
      <h3 className="text-xl font-bold">{profile.title}</h3>
      <p>{profile.description}</p>
      <ul className="mt-3 space-y-1 ml-5">
        {profile.details.map((d: string, i: number) => <li key={i} className="list-disc">{d}</li>)}
      </ul>
    </motion.div>
  );
};

/****************************
 * PUBLIC SERVICE & RATING
 ****************************/
const PublicService = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'permohonan' | 'saran'>('permohonan');
  const [jenis, setJenis] = useState('Permohonan Informasi');
  const [nama, setNama] = useState('');
  const [kontak, setKontak] = useState('');
  const [pesan, setPesan] = useState('');
  const [kode, setKode] = useState(generateTicketCode());
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState('');
  const [isHuman, setIsHuman] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalIsSuccess, setModalIsSuccess] = useState(true);
  const [submitsInWindow, setSubmitsInWindow] = useState(0);
  const RATE_WINDOW_MS = 5 * 60 * 1000;
  const RATE_MAX = 3;

  const { data: ratingSummary = { average_rating: 0, total_ratings: 0, stats: {} }, isPending: ratingLoading } = useQuery({
    queryKey: ['rating-summary'],
    queryFn: fetchRatingSummary,
  });

  const avg = Math.round(ratingSummary.average_rating * 10) / 10;

  useEffect(() => {
    const now = Date.now();
    const slot = Number(localStorage.getItem('svc_rate_slot') || '0');
    const count = Number(localStorage.getItem('svc_rate_count') || '0');
    if (now - slot > RATE_WINDOW_MS) {
      localStorage.setItem('svc_rate_slot', String(now));
      localStorage.setItem('svc_rate_count', '0');
      setSubmitsInWindow(0);
    } else {
      setSubmitsInWindow(count);
    }
  }, []);

  const incRate = () => {
    const now = Date.now();
    let slot = Number(localStorage.getItem('svc_rate_slot') || '0');
    let count = Number(localStorage.getItem('svc_rate_count') || '0');
    if (now - slot > RATE_WINDOW_MS) { slot = now; count = 0; }
    count += 1;
    localStorage.setItem('svc_rate_slot', String(slot));
    localStorage.setItem('svc_rate_count', String(count));
    setSubmitsInWindow(count);
  };

  const permohonanMutation = useMutation({
    mutationFn: submitPermohonan,
    onSuccess: () => {
      incRate();
      openModal('Sukses', `Permohonan terkirim! Kode: ${kode}`, true);
      resetForm();
    },
    onError: (err: any) => {
      incRate();
      openModal('Gagal', err.response?.data?.message || 'Gagal mengirim', false);
    },
  });

  const ratingMutation = useMutation({
    mutationFn: submitRating,
    onSuccess: () => {
      incRate();
      queryClient.invalidateQueries({ queryKey: ['rating-summary'] });
      openModal('Sukses', 'Terima kasih atas rating Anda!', true);
      setEmail(''); setRating(0); setPesan(''); setIsHuman(false);
    },
    onError: (err: any) => {
      incRate();
      openModal('Gagal', err.response?.data?.message || 'Gagal mengirim', false);
    },
  });

  const openModal = (title: string, msg: string, success: boolean) => {
    setModalTitle(title); setModalMessage(msg); setModalIsSuccess(success); setModalOpen(true);
  };

  const resetForm = () => {
    setNama(''); setKontak(''); setPesan(''); setKode(generateTicketCode()); setIsHuman(false);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (tab === 'permohonan') {
      if (nama.trim().length < 3) e.nama = 'Nama minimal 3 karakter';
      if (!/^(.+@.+\..+|\+?\d{9,15})$/.test(kontak)) e.kontak = 'Kontak tidak valid';
      if (pesan.trim().length < 10) e.pesan = 'Uraian minimal 10 karakter';
      if (!isHuman) e.isHuman = 'Centang verifikasi';
    } else {
      if (rating < 1) e.rating = 'Pilih rating';
      if (!/.+@.+\..+/.test(email)) e.email = 'Email tidak valid';
      if (pesan.trim().length < 3) e.pesan = 'Saran minimal 3 karakter';
      if (!isHuman) e.isHuman = 'Centang verifikasi';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePermohonan = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitsInWindow >= RATE_MAX) return openModal('Gagal', 'Terlalu sering. Coba lagi nanti.', false);
    if (!validate()) return;
    permohonanMutation.mutate({ jenis, nama: nama || 'Anonym', kontak: kontak || '-', kodeTiket: kode, pesan, isHuman });
  };

  const handleRating = () => {
    if (submitsInWindow >= RATE_MAX) return openModal('Gagal', 'Terlalu sering. Coba lagi nanti.', false);
    if (!validate()) return;
    ratingMutation.mutate({ email: email || 'anon@anon.com', rating, saran: pesan || 'Tidak ada' });
  };

  return (
    <Section id="pelayanan" title="Pelayanan & Rating" icon={<Inbox />}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 rounded-xl border p-3 flex items-center justify-between"
        style={{ borderColor: theme.border, background: theme.surface }}
      >
        <div className="flex items-center gap-3">
          <div className="text-sm opacity-80" style={{ color: 'white' }}>Rata-rata</div>
          <div className="text-2xl font-semibold" style={{ color: theme.surfaceText }}>{avg}<span className="text-base opacity-70">/5</span></div>
          <div className="flex items-center" style={{ color: theme.gold }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
                  fill={i < Math.round(avg) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Form & Stats */}
      <div className={`grid ${tab !== 'permohonan' ? "lg:grid-cols-3" : "lg:grid-cols-1"} gap-4`}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 rounded-2xl border p-4 md:p-5"
          style={{ background: theme.surface, borderColor: theme.border }}
        >
          <div className="flex items-center gap-2 mb-4">
            {(['permohonan', 'saran'] as const).map(key => (
              <button
                key={key}
                onClick={() => { setTab(key); setErrors({}); }}
                className="px-3 py-2 text-sm rounded-xl border transition"
                style={{
                  background: tab === key ? theme.gold : 'transparent',
                  color: tab === key ? '#1b1b1b' : theme.surfaceText,
                  borderColor: theme.border
                }}
              >
                {key === 'permohonan' ? 'Permohonan' : 'Rating'}
              </button>
            ))}
          </div>

          {tab === 'permohonan' && (
            <form onSubmit={handlePermohonan} className="grid gap-3">
              {/* Form fields */}
              <div className="grid md:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  <span style={{ color: theme.surfaceText }}>Jenis</span>
                  <select value={jenis} onChange={e => setJenis(e.target.value)} className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.border, color: theme.surfaceText }}>
                    <option>Permohonan Informasi</option>
                    <option>Pengaduan</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm">
                  <span style={{ color: theme.surfaceText }}>Nama</span>
                  <input value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama lengkap" className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.border, color: theme.surfaceText }}/>
                  {errors.nama && <span className="text-xs" style={{ color: theme.gold }}>{errors.nama}</span>}
                </label>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  <span style={{ color: theme.surfaceText }}>Kontak</span>
                  <input value={kontak} onChange={e => setKontak(e.target.value)} placeholder="Email / No. HP" className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.border, color: theme.surfaceText }}/>
                  {errors.kontak && <span className="text-xs" style={{ color: theme.gold }}>{errors.kontak}</span>}
                </label>
                <label className="grid gap-1 text-sm">
                  <span style={{ color: theme.surfaceText }}>Kode Tiket</span>
                  <input value={kode} readOnly className="rounded-xl px-3 py-2 border bg-transparent opacity-70" style={{ borderColor: theme.border, color: theme.surfaceText }}/>
                </label>
              </div>
              <label className="grid gap-1 text-sm">
                <span style={{ color: theme.surfaceText }}>Uraian</span>
                <textarea value={pesan} onChange={e => setPesan(e.target.value)} rows={4} placeholder="Detail kebutuhan" className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.border, color: theme.surfaceText }}/>
                {errors.pesan && <span className="text-xs" style={{ color: theme.gold }}>{errors.pesan}</span>}
              </label>
              <label className="flex items-center gap-2 text-xs mt-1">
                <input type="checkbox" checked={isHuman} onChange={e => setIsHuman(e.target.checked)}/>
                <span style={{ color: theme.surfaceText }}>Saya bukan robot</span>
                {errors.isHuman && <span className="ml-2" style={{ color: theme.gold }}>{errors.isHuman}</span>}
              </label>
              <div className="flex justify-end pt-2">
                <button type="submit" className="rounded-xl px-4 py-2 text-sm font-medium transition hover:scale-105" style={{ background: theme.gold, color: '#1b1b1b' }}>
                  Kirim
                </button>
              </div>
            </form>
          )}

          {tab === 'saran' && (
            <div className="grid gap-4">
              <label className="grid gap-1 text-sm">
                <span style={{ color: theme.surfaceText }}>Email</span>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@anda" className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.border, color: theme.surfaceText }}/>
                {errors.email && <span className="text-xs" style={{ color: theme.gold }}>{errors.email}</span>}
              </label>
              <div>
                <div className="text-sm mb-1" style={{ color: theme.surfaceText }}>Rating</div>
                <div className="flex items-center gap-1" style={{ color: theme.gold }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" onClick={() => setRating(i + 1)} className="w-5 h-5">
                      <svg viewBox="0 0 24 24" className="w-full h-full">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
                          fill={i < rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                  ))}
                  {errors.rating && <span className="ml-2 text-xs" style={{ color: theme.gold }}>{errors.rating}</span>}
                </div>
              </div>
              <label className="grid gap-1 text-sm">
                <span style={{ color: theme.surfaceText }}>Saran</span>
                <textarea rows={3} value={pesan} onChange={e => setPesan(e.target.value)} placeholder="Pengalaman Anda" className="rounded-xl px-3 py-2 border bg-transparent" style={{ borderColor: theme.border, color: theme.surfaceText }}/>
                {errors.pesan && <span className="text-xs" style={{ color: theme.gold }}>{errors.pesan}</span>}
              </label>
              <label className="flex items-center gap-2 text-xs mt-1">
                <input type="checkbox" checked={isHuman} onChange={e => setIsHuman(e.target.checked)}/>
                <span style={{ color: theme.surfaceText }}>Saya bukan robot</span>
                {errors.isHuman && <span className="ml-2" style={{ color: theme.gold }}>{errors.isHuman}</span>}
              </label>
              <div className="flex justify-end">
                <button type="button" onClick={handleRating} className="rounded-xl px-4 py-2 text-sm font-medium transition hover:scale-105" style={{ background: theme.gold, color: '#1b1b1b' }}>
                  Kirim
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {tab === 'saran' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border p-4 md:p-5 flex flex-col gap-4"
            style={{ background: theme.surface, borderColor: theme.border }}
          >
            <div className="flex items-end justify-between">
              <div>
                <div className="text-sm opacity-75" style={{ color: 'white' }}>Rata-rata</div>
                <div className="text-3xl font-bold" style={{ color: theme.surfaceText }}>{avg}<span className="text-base opacity-70">/5</span></div>
              </div>
              <div className="flex items-center" style={{ color: theme.gold }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"
                      fill={i < Math.floor(avg) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              {[5,4,3,2,1].map(n => (
                <div key={n} className="flex items-center gap-2 text-sm">
                  <span className="w-8" style={{ color: 'white' }}>{n} stars</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'white' }}>
                    <div className="h-full transition-all" style={{ width: `${ratingSummary.total_ratings ? (ratingSummary.stats[`rating_${n}`] / ratingSummary.total_ratings) * 100 : 0}%`, background: theme.gold }}/>
                  </div>
                  <span className="w-6 text-right" style={{ color: 'white' }}>{ratingSummary.stats[`rating_${n}`] || 0}</span>
                </div>
              ))}
            </div>
            <div className="text-xs opacity-75" style={{ color: 'white' }}>Total: {ratingSummary.total_ratings}</div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} message={modalMessage} isSuccess={modalIsSuccess} />
        )}
      </AnimatePresence>
    </Section>
  );
};

/****************************
 * MODAL
 ****************************/
const Modal = ({ isOpen, onClose, title, message, isSuccess }: { isOpen: boolean; onClose: () => void; title: string; message: string; isSuccess: boolean }) => {
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="rounded-2xl border p-6 max-w-md w-full"
        style={{ background: theme.surface, borderColor: theme.border, color: theme.surfaceText }}
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm mb-4">{message}</p>
        <button onClick={onClose} className="w-full px-4 py-2 rounded-xl border font-medium transition hover:scale-105" style={{ background: `rgba(255,255,255,0.1)`, borderColor: theme.border }}>
          Tutup
        </button>
      </motion.div>
    </motion.div>
  );
};

/****************************
 * TICKET CODE
 ****************************/
const generateTicketCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

/****************************
 * MAIN COMPONENT
 ****************************/
let theme: any = {};
export function PPIDMain() {
  const school = SMAN25_CONFIG;
  theme = school.theme;

  useEffect(() => {
    document.documentElement.style.setProperty("--brand-primary", theme.primary);
    document.documentElement.style.setProperty("--brand-accent", theme.gold);
    document.documentElement.style.setProperty("--brand-bg", theme.bg);
    document.documentElement.style.setProperty("--brand-surface", theme.surface);
  }, []);

  const subItems = [
    { href: "#profil", label: "Profil PPID" },
    { href: "#berkala", label: "Informasi Berkala" },
    { href: "#setiap-saat", label: "Informasi Setiap Saat" },
    { href: "#serta-merta", label: "Informasi Serta-merta" },
    { href: "#laporan-keuangan", label: "Laporan Keuangan" },
    { href: "#laporan-kinerja", label: "Laporan Kinerja" },
    { href: "#pelayanan", label: "Layanan" },
  ];

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden border-b"
        style={{ background: theme.surface, borderColor: theme.border }}
      >
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 grid sm:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-3" style={{ background: theme.gold, color: '#1b1b1b' }}>
              <IShield/> Transparansi
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight" style={{ color: theme.surfaceText }}>
              PPID {school.fullName}
            </h1>
            <p className="mt-3" style={{ color: 'white' }}>Informasi publik terbuka untuk semua.</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a href="#pelayanan" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition hover:scale-105" style={{ background: theme.gold, color: '#1b1b1b' }}>
                <Inbox/> Ajukan
              </a>
              <a href="#berkala" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition hover:scale-105" style={{ borderColor: theme.border, color: theme.surfaceText }}>
                Lihat Dokumen
              </a>
            </div>
          </div>
          <div className="sm:justify-self-end">
            <div className="rounded-2xl p-4" style={{ background: `rgba(255,255,255,0.05)`, border: `1px solid ${theme.border}` }}>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2 items-center" style={{ color: 'white' }}><Info/> <b>NPSN:</b> {school.npsn}</li>
                <li className="flex gap-2 items-center" style={{ color: 'white' }}><Clock/> <b>Jam:</b> {school.hours}</li>
                <li className="flex gap-2 items-center" style={{ color: 'white' }}><MessageCircle/> <b>Email:</b> {school.email}</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* <SubNav items={subItems} /> */}

      <Section id="profil" title="Profil PPID" icon={<Info/>}><ProfilPPID /></Section>
      <Section id="berkala" title="Informasi Berkala" icon={<File/>}><DokumenList kategoriFilter="Informasi Berkala" /></Section>
      <Section id="setiap-saat" title="Informasi Setiap Saat" icon={<File/>}><DokumenList kategoriFilter="Informasi Setiap Saat" /></Section>
      <Section id="serta-merta" title="Informasi Serta-merta" icon={<File/>}><DokumenList kategoriFilter="Informasi Serta-merta" /></Section>
      <Section id="laporan-keuangan" title="Laporan Keuangan" icon={<File/>}><DokumenList kategoriFilter="Laporan Keuangan" /></Section>
      <Section id="laporan-kinerja" title="Laporan Kinerja" icon={<File/>}><DokumenList kategoriFilter="Laporan Kinerja" /></Section>

      <PublicService />
      <FooterComp theme={theme} />
    </div>
  );
}