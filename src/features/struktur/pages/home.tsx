import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/* ================================
          HERO SECTION
================================ */
const HeroSection = () => {
  const scrollToStruktur = () => {
    document.getElementById("struktur")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/struktur.jpg')`,
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
          Struktur Organisasi
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Tim kepemimpinan dan tenaga pendidik SMAN 25 Jakarta
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          onClick={scrollToStruktur}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          Lihat Struktur
        </motion.button>
      </div>
    </section>
  );
};

const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="py-12 md:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
  </section>
);

/* ================================
           TIPE DATA
================================ */
type Organization = {
  id: number;
  position: string;
  description?: string;
  assignedEmployeeId?: number | null;
  GuruTendik?: {
    id: number;
    nama: string;
    photoUrl: string | null;
  };
  parentId: number | null;
  Children?: Organization[];
  createdAt?: string;
  updatedAt?: string;
  schoolId?: number;
  isActive?: boolean;
};

/* ================================
     KOMPONEN NODE TREE (REKURSIF + GARIS LEBIH RAPI)
================================ */
const OrgNode = ({
  node,
  level = 0,
  theme,
}: {
  node: Organization;
  level?: number;
  theme: any;
}) => {
  const hasChildren = !!node.Children?.length;

  return (
    <div className={`relative ${level > 0 ? "mt-8" : "mt-4"}`}>
      {/* Garis vertikal utama (hanya jika bukan root) */}
      {level > 0 && (
        <div
          className="absolute top-0 left-[1.125rem] w-px bg-gray-500/50 -translate-x-1/2"
          style={{ height: "2rem" }}
        />
      )}

      {/* Card utama */}
      <div className="relative flex justify-center">
        <div
          className={`
            relative z-10 w-72 sm:w-80 p-5 rounded-2xl border shadow-lg text-center
            transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
            ${level === 0 ? "bg-gradient-to-br from-indigo-900/40 to-blue-950/30 border-indigo-500/40" : "bg-gray-900/30 backdrop-blur-md border-gray-700/50"}
          `}
          style={{ borderColor: theme.subtle }}
        >
          {node.GuruTendik?.photoUrl ? (
            <img
              src={`https://be-school.kiraproject.id${node.GuruTendik.photoUrl}`}
              alt={node.GuruTendik.nama}
              className="w-24 h-24 mx-auto object-cover rounded-full mb-4 border-4 shadow-md"
              style={{ borderColor: theme.subtle || "#4f46e5" }}
              onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder-user.jpg")}
              loading="lazy"
            />
          ) : (
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-800 mb-4 flex items-center justify-center text-3xl font-bold text-gray-400 border-4 border-gray-700">
              {node.GuruTendik?.nama?.charAt(0) || node.position?.charAt(0) || "?"}
            </div>
          )}

          <h3 className="text-xl font-bold mb-1" style={{ color: theme.surfaceText }}>
            {node.position}
          </h3>

          <p className="text-base font-medium opacity-90" style={{ color: theme.surfaceText }}>
            {node.GuruTendik?.nama || "—"}
          </p>

          {node.description && (
            <p className="text-sm mt-3 opacity-75 italic" style={{ color: theme.surfaceText }}>
              {node.description}
            </p>
          )}
        </div>
      </div>

      {/* Garis penghubung ke children */}
      {hasChildren && (
        <>
          <div
            className="absolute left-1/2 w-px bg-gray-500/50 -translate-x-1/2"
            style={{ top: "100%", height: "2rem" }}
          />

          <div className="flex justify-center flex-wrap gap-x-16 gap-y-12 mt-12 relative">
            {node.Children!.map((child, index) => {
              const isFirst = index === 0;
              const isLast = index === node.Children!.length - 1;

              return (
                <div key={child.id} className="relative">
                  {/* Garis horizontal kecil ke setiap child */}
                  <div
                    className="absolute top-[-2rem] w-px h-8 bg-gray-500/50 left-1/2 -translate-x-1/2"
                  />

                  <OrgNode node={child} level={level + 1} theme={theme} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

/* ================================
       KOMPONEN UTAMA - TREE VIEW
================================ */
const SCHOOL_ID = 88;

const StrukturOrganisasi = ({ theme, schoolName }: { theme: any; schoolName: string }) => {
  const prefersReducedMotion = useReducedMotion();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://be-school.kiraproject.id/organisasi?schoolId=${SCHOOL_ID}`,
          {
            cache: "no-store",
            headers: { Accept: "application/json" },
          }
        );

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const json = await res.json();
        if (!json.success) throw new Error(json.message || "API response failed");

        setOrganizations(json.data || []);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Gagal memuat data struktur");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Root = parentId null
  const roots = organizations.filter((org) => org.parentId === null);

  return (
    <Section>
      <div id="struktur" className="relative" style={{ scrollMarginTop: "80px" }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: theme.surfaceText }}>
            Struktur Organisasi {schoolName}
          </h2>
          <p className="text-lg md:text-xl opacity-80" style={{ color: theme.surfaceText }}>
            Hierarki Kepemimpinan Sekolah
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xl" style={{ color: theme.surfaceText }}>
            Memuat struktur organisasi...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400 text-xl">{error}</div>
        ) : roots.length === 0 ? (
          <div className="text-center py-20 opacity-70 text-lg" style={{ color: theme.surfaceText }}>
            Belum ada data struktur organisasi
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            className="py-10"
          >
            <div className="flex flex-col items-center gap-16 md:gap-20">
              {roots.map((root) => (
                <OrgNode key={root.id} node={root} level={0} theme={theme} />
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-20 text-sm opacity-60 text-center" style={{ color: theme.surfaceText }}>
          Data diambil real-time • Terakhir diperbarui: {new Date().toLocaleString("id-ID")}
        </div>
      </div>
    </Section>
  );
};

/* ================================
           HALAMAN UTAMA
================================ */
const Page = ({ theme, schoolName }: { theme: any; schoolName: string }) => (
  <div className="min-h-screen" style={{ background: theme.bg }}>
    <NavbarComp theme={theme} />
    <HeroSection />
    <main>
      <StrukturOrganisasi theme={theme} schoolName={schoolName} />
    </main>
    <FooterComp theme={theme} />
  </div>
);

const StrukturPage = () => {
  const { theme, fullName: schoolName } = SMAN25_CONFIG;
  return <Page theme={theme} schoolName={schoolName} />;
};

export default StrukturPage;