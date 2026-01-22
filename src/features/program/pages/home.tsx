import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://be-school.kiraproject.id";

interface ProgramItem {
  title: string;
  description: string;
}

interface Program {
  id: number;
  mainTitle: string;
  mainDescription: string | null;
  items: ProgramItem[];
  schoolId: number;
  createdAt: string;
  updatedAt: string;
}

const HeroSection = () => {
  const scrollToEkskul = () => {
    document.getElementById("pro")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative z-[1] h-[78vh] flex items-center justify-center overflow-hidden">
      {/* Background Image - Gedung SMA di Jakarta (mirip SMAN 25) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/teacher.jpg')`,
        }}
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 -mt-6 md:text-center text-left text-white px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Program
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 text-white/90"
        >
          Berbagai program unggulan untuk pengembangan potensi siswa secara menyeluruh, akademik maupun non-akademik.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={scrollToEkskul}
          className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition shadow-lg"
        >
          Jelajahi Program
        </motion.button>
      </div>
    </section>
  );
};

const ProgramSekolahPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;

  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/program`, {
          params: { schoolId: 88 },
        });

        if (response.data.success) {
          setPrograms(response.data.data);
        } else {
          setError(response.data.message || "Gagal memuat program");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data program");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);


  console.log(programs)
  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* HERO SECTION */}
      <HeroSection />

      {/* KONTEN UTAMA */}
      <section id="pro" className="py-20 md:py-32 -mt-12 relative z-[1]">
        <div className="max-w-7xl mx-auto px-4 md:px-0">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-bold md:text-center text-left mb-8 md:mb-16"
            style={{ color: theme.primaryText }}
          >
            {programs?.[0]?.mainTitle}
          </motion.h2>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl" style={{ color: theme.primaryText }}>
                Memuat program...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-600">
              <p>{error}</p>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-20 opacity-70">
              <p>Belum ada program yang tersedia saat ini.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:gap-16 md:grid-cols-3">
              {programs?.[0]?.items.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white backdrop-blur-md rounded-3xl p-6 md:p-6 shadow-md md:shadow-xl text-left"
                >
                  <div>
                    {/* Kamu bisa ganti icon sesuai kebutuhan atau buat mapping */}
                    <img
                      src="/i1.png"
                      alt="icon"
                      className="w-12 h-12 mb-5"
                    />
                  </div>
                  <div>
                    <h3
                      className="text-md font-bold mb-4"
                      style={{ color: "black" }}
                    >
                      {program.title || 'Program Unggulan'}
                    </h3>

                    {program.description && (
                      <p
                        className="opacity-90 text-sm mb-6"
                        style={{ color: theme.primaryText }}
                      >
                        {program.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bagian deskripsi & Kurikulum Merdeka tetap sama seperti sebelumnya */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl mt-12 md:mt-20 font-bold md:text-center text-left mb-8"
            style={{ color: theme.primaryText }}
          >
            Program Sekolah
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-md md:text-lg md:text-center text-left max-w-full mx-auto opacity-90 leading-relaxed"
            style={{ color: theme.surfaceText }}
          >
            {programs?.[0]?.mainDescription || '-'}
          </motion.p>

          {/* Kurikulum Merdeka (tetap sama) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col items-center mt-12 md:mt-20"
          >
            <h3
              className="text-2xl md:text-4xl font-bold md:text-center md:flex hidden text-left mb-12"
              style={{ color: theme.primaryText }}
            >
              Transformasi Pembelajaran dengan Kurikulum Merdeka
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
              <div className="border border-gray-300 relative group rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/pro2.png"
                  alt="Sebelum Kurikulum Merdeka"
                  className="w-full h-96 md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-lg md:text-xl font-medium drop-shadow-lg">
                    BEFORE
                  </p>
                </div>
              </div>

              <div className="border border-gray-300 relative group rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/pro3.png"
                  alt="Setelah Kurikulum Merdeka"
                  className="w-full h-96 md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-lg md:text-xl font-medium drop-shadow-lg">
                    AFTER
                  </p>
                </div>
              </div>
            </div>

            <p
              className="mt-12 md:text-center text-left text-lg md:text-xl max-w-4xl opacity-90"
              style={{ color: theme.surfaceText }}
            >
              Kurikulum Merdeka memberikan kebebasan bagi siswa untuk belajar sesuai minat dan bakat, menciptakan pengalaman belajar yang lebih bermakna, kreatif, dan menyenangkan.
            </p>
          </motion.div>
        </div>
      </section>

      <FooterComp theme={theme} />
    </div>
  );
};

export default ProgramSekolahPage;