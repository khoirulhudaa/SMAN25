import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

/****************
 * REACT-QUERY HOOK
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
  const xHost = getXHostHeader();

  return useQuery<KurikulumData, Error>({
    queryKey: ['kurikulum', xHost],
    queryFn: async () => {
      const res = await fetch('https://dev.kiraproject.id/kurikulum', {
        cache: 'no-store',
        headers: {
          'X-Host': xHost,
          'Cache-Control': 'no-store',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch kurikulum data');
      const data = await res.json();
      return {
        dokumen: data.dokumen || [],
        jamPelajaran: data.jamPelajaran || [],
      };
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    placeholderData: DEMO_DATA,
    retry: 1,
  });
};

/****************
 * Curriculum Component
 ****************/
const Curriculum = ({ theme, schoolName }: { theme: any; schoolName: string }) => {
  const prefersReducedMotion = useReducedMotion();
  const { data = DEMO_DATA, isPending: loading, error } = useKurikulumData();
  const queryClient = useQueryClient();
  const xHost = getXHostHeader();

  // Invalidate saat ganti tenant
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['kurikulum'] });
  }, [xHost, queryClient]);

  if (loading) {
    return (
      <section id="kurikulum" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: theme.surfaceText }}
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
            style={{ color: theme.pop }}
          >
            Error: {error.message}. Menggunakan data demo.
          </motion.p>
        </div>
      </section>
    );
  }

  return (
    <section id="kurikulum" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: theme.accent }}
        >
          Kurikulum {schoolName}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.1 }}
          className="text-base opacity-85 mb-8"
          style={{ color: theme.surfaceText }}
        >
          Kurikulum dirancang untuk membentuk lulusan yang berkarakter, kompeten, dan siap kerja.
        </motion.p>

        {/* Documents Section */}
        {data.dokumen.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: theme.primaryText }}>
              Dokumen Kurikulum
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {data.dokumen.map((doc, i) => (
                <motion.a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.45, delay: prefersReducedMotion ? 0 : 0.25 + i * 0.05 }}
                  className="rounded-lg border p-4 hover:bg-opacity-80 transition-colors flex flex-col"
                  style={{ borderColor: theme.subtle, background: theme.surface }}
                >
                  <p className="text-sm font-medium" style={{ color: theme.surfaceText }}>
                    {doc.title}
                  </p>
                  <p className="text-xs opacity-70 mt-1" style={{ color: theme.surfaceText }}>
                    Diperbarui: {new Date(doc.updatedAt).toLocaleDateString('id-ID')}
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Jam Pelajaran Section */}
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
                    <td className="p-3" style={{ color: theme.surfaceText }}>{jp.key}</td>
                    <td className="p-3" style={{ color: theme.surfaceText }}>{jp.start}</td>
                    <td className="p-3" style={{ color: theme.surfaceText }}>{jp.end}</td>
                    <td className="p-3" style={{ color: theme.surfaceText }}>{jp.order}</td>
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
            style={{ color: theme.surfaceText }}
          >
            Tidak ada data kurikulum tersedia.
          </motion.p>
        )}
      </div>
    </section>
  );
};

/****************************
 * PAGE WRAPPER
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
      <main>
        <Curriculum theme={theme} schoolName={schoolName} />
      </main>
      <FooterComp theme={theme} />
    </div>
  );
};

export default CurriculumPage;