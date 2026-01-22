import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQuery } from '@tanstack/react-query';
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/****************************
 * HERO SECTION UNTUK PPID
 ****************************/
const HeroSection = () => {
  const scrollToContent = () => {
    document.querySelector("main > div")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero2.png')`,
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
          PPID SMAN 25 Jakarta
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Pejabat Pengelola Informasi dan Dokumentasi – Informasi publik terbuka untuk semua
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
          Lihat Informasi Publik
        </motion.button>
      </div>
    </section>
  );
};

const IFile = () => "🗃️";
const IFilter = () => "🔎";
const ILink = () => "🔗"
const IUpload = () => "💾";
const IShield = () => "🛡️";

/****************************
 * UTILS
 ****************************/
const Section = ({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-32 py-10">
    <div className="max-w-7xl mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-xl sm:text-2xl text-black font-bold mb-4 flex items-center gap-2"
      >
        {icon} <span>{title}</span>
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 sm:p-6"
        style={{ background: theme.surface, border: `1px solid black` }}
      >
        {children}
      </motion.div>
    </div>
  </section>
);

/****************************
 * API CONFIG PPID
 ****************************/
const PPID_API_BASE = "https://be-school.kiraproject.id/ppid";
const SCHOOL_ID = 88;

const fetchPPIDDocuments = async () => {
  const response = await fetch(`${PPID_API_BASE}?schoolId=${SCHOOL_ID}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const json = await response.json();

  if (!json.success) throw new Error(json.message || "Response tidak valid");

  return json.data || [];
};

/****************************
 * ADAPTER DATA → format DokumenList
 ****************************/
const mapToDokumenFormat = (items: any[]) => {
  return items.map(item => ({
    id: item.id,
    judul: item.title || "—",
    categoryName: item.category || "lainnya",
    tahun: item.publishedDate
      ? new Date(item.publishedDate).getFullYear()
      : (item.createdAt ? new Date(item.createdAt).getFullYear() : new Date().getFullYear()),
    tipe: "Dokumen",
    url: item.documentUrl || "",
  }));
};

/****************************
 * DOKUMEN LIST
 ****************************/
const DokumenList = ({ kategoriFilter }: { kategoriFilter: string }) => {
  const [q, setQ] = useState("");
  const [kategori, setKategori] = useState(kategoriFilter || "Semua");
  const [tahun, setTahun] = useState("Semua");

  const { data: rawData = [], isPending: loading, error } = useQuery({
    queryKey: ['ppid-documents', SCHOOL_ID],
    queryFn: fetchPPIDDocuments,
  });

  const documents = useMemo(() => mapToDokumenFormat(rawData), [rawData]);

  const { tahunOpts, kategoriOpts, filtered } = useMemo(() => {
    const years = Array.from(new Set(documents.map((d: any) => d.tahun))).sort((a: number, b: number) => b - a);
    const cats = Array.from(new Set(documents.map((d: any) => d.categoryName)));
    const filteredDocs = documents.filter((d: any) =>
      (kategori === "Semua" || d.categoryName === kategori) &&
      (tahun === "Semua" || String(d.tahun) === tahun) &&
      (q === "" || d.judul.toLowerCase().includes(q.toLowerCase()))
    );
    return {
      tahunOpts: ["Semua", ...years.map(String)],
      kategoriOpts: ["Semua", ...cats.sort()],
      filtered: filteredDocs,
    };
  }, [documents, q, kategori, tahun]);

  if (loading) return <div className="text-center py-8" style={{ color: 'black' }}>Memuat dokumen...</div>;
  if (error) return <div className="text-center py-8" style={{ color: theme?.pop }}>Gagal memuat dokumen</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs" style={{ color: 'black' }}>Pencarian</label>
          <div className="mt-1 flex items-center gap-2 rounded-xl px-2 py-2" style={{ background: `rgba(255,255,255,0.05)`, border: `1px solid black` }}>
            <IFilter/>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari judul…" className="bg-transparent outline-none text-sm flex-1" style={{ color: theme.surfaceText }}/>
          </div>
        </div>
        <div>
          <label className="text-xs" style={{ color: 'black' }}>Tahun</label>
          <select value={tahun} onChange={e => setTahun(e.target.value)} className="mt-1 w-full rounded-xl px-3 py-2 text-sm" style={{ background: `rgba(255,255,255,0.05)`, border: `1px solid black`, color: theme.surfaceText }}>
            {tahunOpts.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-2xl" style={{ border: `1px solid black` }}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead style={{ background: `rgba(255,255,255,0.08)` }} className="border-b border-black/60">
              <tr>
                <th className="text-left px-4 py-2" style={{ color: theme.surfaceText }}>Kategori</th>
                <th className="text-left px-4 py-2" style={{ color: theme.surfaceText }}>Judul</th>
                <th className="text-left px-4 py-2" style={{ color: theme.surfaceText }}>Tahun</th>
                <th className="text-left px-4 py-2" style={{ color: theme.surfaceText }}>Tipe</th>
                <th className="text-left px-4 py-2" style={{ color: theme.surfaceText }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d: any, i: number) => (
                <tr key={d.id} style={{ background: i % 2 ? 'transparent' : 'rgba(255,255,255,0.03)' }} className="border-b border-black/60">
                  <td className="px-4 py-2" style={{ color: 'black' }}>{d.categoryName}</td>
                  <td className="px-4 py-2" style={{ color: theme.surfaceText }}>{d.judul}</td>
                  <td className="px-4 py-2" style={{ color: 'black' }}>{d.tahun}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs" style={{ background: `rgba(255,255,255,0.1)`, border: `1px solid black`, color: 'black' }}>
                      {d.tipe}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {d.url ? (
                        <>
                        <div className="bg-blue-200 gap-2 px-3 py-1.5 rounded-full text-xs border transition hover:scale-105 border-blue-400 text-blue-800">
                          <a href={d.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center" style={{ background: `rgba(255,255,255,0.1)` }}>
                            <div className="bg-white rounded-full p-[1px] mr-2">
                              <ILink/> 
                            </div>
                            <p className="font-semibold">
                              LIHAT | UNDUH
                            </p>
                          </a>
                        </div>
                        </>
                      ) : (
                        <span className="text-xs opacity-70">Tidak ada dokumen</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center" style={{ color: 'black' }}>Tidak ada dokumen.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

/****************************
 * MAIN PPID PAGE – tanpa Profil PPID
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

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      <HeroSection />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden border-b"
        style={{ background: theme.surface, borderColor: theme.border }}
      >
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14 grid sm:grid-cols-1 gap-6 items-center">
          <div className="w-full">
            <div className="w-full grid grid-cols-3 items-center">
              <h1 className="text-2xl w-max sm:text-4xl font-extrabold leading-tight" style={{ color: theme.surfaceText }}>
                DokUMEN PPID
              </h1>
              <div className="inline-flex justify-center items-center text-md gap-1 font-normal rounded-full" style={{ background: theme.gold, color: '#1b1b1b' }}>
                [
                <IShield/> 
                <p>
                  Transparansi data
                </p>
                ]
              </div>
              <div className="flex justify-end">
                <h1 className="text-2xl w-max sm:text-4xl font-extrabold leading-tight" style={{ color: theme.surfaceText }}>
                  INFO PUBLIK
                </h1>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section hanya sesuai kategori backend */}
      <Section id="berkala" title="Informasi Berkala" icon={<IFile/>}>
        <DokumenList kategoriFilter="berkala" />
      </Section>

      <Section id="setiap-saat" title="Informasi Setiap Saat" icon={<IFile/>}>
        <DokumenList kategoriFilter="setiap-saat" />
      </Section>

      <Section id="serta-merta" title="Informasi Serta Merta" icon={<IFile/>}>
        <DokumenList kategoriFilter="serta-merta" />
      </Section>

      <Section id="keuangan" title="Keuangan" icon={<IFile/>}>
        <DokumenList kategoriFilter="keuangan" />
      </Section>

      <Section id="kegiatan" title="Kegiatan" icon={<IFile/>}>
        <DokumenList kategoriFilter="kegiatan" />
      </Section>

      <Section id="profil" title="Profil Sekolah" icon={<IFile/>}>
        <DokumenList kategoriFilter="profil" />
      </Section>

      <Section id="ppdb" title="PPDB" icon={<IFile/>}>
        <DokumenList kategoriFilter="ppdb" />
      </Section>

      {/* Jika ingin menambahkan bagian Pelayanan / Permohonan & Rating, silakan tambahkan di sini */}
      {/* Contoh: <PublicService /> jika ada */}

      <FooterComp theme={theme} />
    </div>
  );
}