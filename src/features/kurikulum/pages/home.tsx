import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";

/****************************
 * HERO SECTION UNTUK KURIKULUM
 ****************************/
const HeroSection = () => {
  const scrollToKurikulum = () => {
    document.getElementById("kurikulum")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      {/* Background Image - Representatif pendidikan/kurikulum */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/curriculum.jpg')`, // Ganti dengan foto kelas atau kegiatan belajar jika ada
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
          Kurikulum
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Informasi kurikulum, dokumen resmi, dan jadwal jam pelajaran SMAN 25 Jakarta
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          onClick={scrollToKurikulum}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          Lihat Kurikulum
        </motion.button>
      </div>
    </section>
  );
};

/****************
 * FETCH HOOK (HANYA BAGIAN INI YANG DIUBAH)
 ****************/
type Dokumen = {
  id: string;
  title: string;
  url: string;
  updatedAt: string;
};

type JamPelajaran = {
  key: string;
  start: string;
  end: string;
  order: number;
};

type KurikulumData = {
  dokumen: Dokumen[];
  jamPelajaran: JamPelajaran[];
};

const DEMO_DATA: KurikulumData = {
  dokumen: [
    { id: "1", title: "Kurikulum Merdeka 2025", url: "https://example.com/kurikulum.pdf", updatedAt: "2025-01-15T00:00:00Z" },
  ],
  jamPelajaran: [
    { key: "Jam 1", start: "07:00", end: "07:45", order: 1 },
    { key: "Jam 2", start: "07:45", end: "08:30", order: 2 },
  ],
};

const useKurikulumData = () => {
  const [data, setData] = useState<KurikulumData>(DEMO_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKurikulum = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://be-school.kiraproject.id/kurikulum?schoolId=88`, {
          method: "GET",
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Response tidak valid");
        }

        // Mapping sesuai struktur API baru
        const mappedData: KurikulumData = {
          dokumen: (result.data || []).map((doc: any) => ({
            id: doc.id?.toString() || "",
            title: doc.name || "Dokumen Kurikulum",
            url: doc.documentUrl || "",
            description: doc.description || "",
            year: doc.year || "",
            type: doc.type || "",
            updatedAt: doc.updatedAt || new Date().toISOString(),
          })),
          jamPelajaran: [], // API kurikulum tidak punya jam pelajaran → kosongkan atau ambil dari API lain jika perlu
        };

        setData(mappedData);
      } catch (err) {
        console.warn("Fetch error:", err);
        setError("Gagal memuat data kurikulum. Menampilkan data demo.");
        setData(DEMO_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchKurikulum();
  }, []); // Hanya fetch sekali saat mount

  return { data, isPending: loading, error };
};

/****************
 * Curriculum Component
 ****************/
const Curriculum = ({ theme, schoolName }: { theme: any; schoolName: string }) => {
  const prefersReducedMotion = useReducedMotion();
  const { data = DEMO_DATA, isPending: loading, error } = useKurikulumData();

  if (loading) {
    return (
      <section id="kurikulum" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: 'black' }}
          >
            Memuat data kurikulum...
          </motion.p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="kurikulum" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: 'red' }}
          >
            Error: {error}. Menggunakan data demo.
          </motion.p>
        </div>
      </section>
    );
  }

  return (
    <section id="kurikulum" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto flex flex-col justify-center md:items-center md:text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-2xl md:text-3xl md:px-0 px-4 md:w-max w-[90%] font-bold mb-2"
          style={{ color: 'black' }}
        >
          Kurikulum 
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.1 }}
          className="text-base md:px-0 px-4 opacity-85 mb-8"
          style={{ color: 'black' }}
        >
          Kurikulum dirancang untuk membentuk lulusan yang berkarakter, kompeten, dan siap kerja.
        </motion.p>

        {/* Dokumen Kurikulum - Tampilkan Deskripsi, Jenis, Tahun */}
        {data.dokumen.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
            className="mb-8 md:-[36vw] md:px-0 px-4"
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: theme.primaryText }}>
              Daftar Kurikulum
            </h3>
            <div className="w-full gap-6">
              {data.dokumen.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : 0.25 + i * 0.05 }}
                  className="rounded-xl w-full border text-left p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
                  style={{ borderColor: theme.subtle, background: theme.surface }}
                >
                  {/* Judul Kurikulum */}
                  <h4 className="text-lg font-semibold" style={{ color: theme.primaryText }}>
                    {doc.title}
                  </h4>

                  {/* Jenis Kurikulum */}
                  <div className="text-sm flex items-center gap-2">
                    <span style={{ color: 'black' }}>Jenis:</span>
                    <span className="font-medium px-2 text-black py-0.5 rounded-full text-sm">
                      {doc.type || "Tidak diketahui"}
                    </span>
                  </div>

                  {/* Tahun */}
                  <div className="text-sm flex items-center gap-2">
                    <span style={{ color: 'black' }}>Tahun:</span>
                    <span className="font-medium text-black">{doc.year || "—"}</span>
                  </div>

                  {/* Deskripsi */}
                  {doc?.description && (
                    <p className="text-sm opacity-90 mt-1 border-t border-black/30 pt-3" style={{ color: 'black' }}>
                      {doc?.description}
                    </p>
                  )}

                  {/* Tombol Lihat Dokumen */}
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:brightness-95 active:scale-[0.97] justify-center gap-2 px-4 py-2 w-max mt-3 rounded-full text-sm font-medium transition-colors shadow-sm"
                      style={{ background: theme.accent, color: "#111827" }}
                    >
                      <FaFilePdf className="mr-2 text-red-500" />
                      Lihat Dokumen
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Jam Pelajaran Section (tetap sama seperti sebelumnya) */}
        {data.jamPelajaran.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.3 }}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: theme.subtle }}
          >
            <table className="w-full text-sm">
              <thead style={{ background: "rgba(255,255,255,0.06)" }}>
                <tr>
                  <th className="text-left p-3" style={{ color: theme.primaryText }}>Jadwal</th>
                  <th className="text-left p-3" style={{ color: theme.primaryText }}>Waktu Mulai</th>
                  <th className="text-left p-3" style={{ color: theme.primaryText }}>Waktu Selesai</th>
                  <th className="text-left p-3" style={{ color: theme.primaryText }}>Urutan</th>
                </tr>
              </thead>
              <tbody>
                {data.jamPelajaran.map((jp, i) => (
                  <motion.tr
                    key={jp.key}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: prefersReducedMotion ? 0 : 0.4 + i * 0.03 }}
                    className="border-t"
                    style={{ borderColor: theme.subtle }}
                  >
                    <td className="p-3" style={{ color: 'black' }}>{jp.key}</td>
                    <td className="p-3" style={{ color: 'black' }}>{jp.start}</td>
                    <td className="p-3" style={{ color: 'black' }}>{jp.end}</td>
                    <td className="p-3" style={{ color: 'black' }}>{jp.order}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {data.dokumen.length === 0 && data.jamPelajaran.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            style={{ color: 'black' }}
            className="bg-white border border-gray-500/30 w-max rounded-md p-4"
          >
            Tidak ada data kurikulum tersedia.
          </motion.p>
        )}
      </div>
    </section>
  );
};

/****************************
 * PAGE DENGAN HERO
 ****************************/
const CurriculumPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      console.assert(!!theme, "Theme harus ada");
      const keys = ["bg", "primary", "primaryText", "surface", "surfaceText", "subtle", "accent"];
      keys.forEach((k) => console.assert(k in theme, `Theme key '${k}' harus ada`));
      console.assert(typeof Curriculum === "function", "Curriculum component harus terdefinisi");
      console.assert(typeof NavbarComp === "function", "Navbar harus terdefinisi");
      console.assert(typeof FooterComp === "function", "Footer harus terdefinisi");

      console.log("UI smoke tests passed (theme, Navbar/Footer)");
    } catch (e) {
      console.error("UI smoke tests failed:", e);
    }
  }, [prefersReducedMotion, theme]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* HERO SECTION */}
      <HeroSection />

      <main>
        <Curriculum theme={theme} schoolName={schoolName} />
      </main>

      <FooterComp theme={theme} />
    </div>
  );
};

export default CurriculumPage;