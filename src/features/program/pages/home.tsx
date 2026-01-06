import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { motion } from "framer-motion";
import { useEffect } from "react";

const HeroSection = () => {
  const scrollToEkskul = () => {
    document.getElementById("ekskul")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative z-[1] h-[78vh] flex items-center justify-center overflow-hidden">
      {/* Background Image - Gedung SMA di Jakarta (mirip SMAN 25) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/pro1.webp')`,
        }}
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 -mt-6 md:text-center text-left text-white px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Program Sekolah
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 text-white/90"
        >
          Berbagai program unggulan untuk pengembangan potensi siswa secara menyeluruh, akademik maupun non-akademik.
        </motion.p>

        <a href="#pro">
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={scrollToEkskul}
            className="px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Jelajahi Program
          </motion.button>
        </a>
      </div>
    </section>
  );
};


/****************************
 * PROGRAM SEKOLAH PAGE (Modern & Soft)
 ****************************/
const ProgramSekolahPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  useEffect(() => {
    // Simple page view tracker jika diperlukan
    console.log("Program Sekolah Page loaded");
  }, []);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />

      {/* HERO SECTION */}
      <HeroSection />

      {/* KONTEN UTAMA */}
      <section id="pro" className="py-20 md:py-32 -mt-12 relative z-[1]">
        <div className="max-w-6xl mx-auto px-6">

          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold md:text-center text-left mb-16"
            style={{ color: theme.primaryText }}
          >
            Program Unggulan
          </motion.h2>

          <div className="grid gap-16 md:grid-cols-3">

            {/* Program Prestasi Akademik Unggulan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/20 text-left"
            >
              <div>
                <img src={'/i1.png'} alt="icon" className="w-12 h-12 mb-5" />
              </div>
              <div>
                <h3 className="text-md font-bold mb-4" style={{ color: 'black' }}>
                  Prestasi Akademik Unggulan
                </h3>
                <p className="opacity-90 text-sm" style={{ color: theme.primaryText }}>
                  Fokus pada pembinaan siswa berprestasi di bidang olimpiade sains, kompetisi akademik nasional, dan persiapan masuk perguruan tinggi terbaik.
                </p>
              </div>
            </motion.div>

            {/* Green School Initiative */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/20 text-left"
            >
              <div>
                <img src={'/i1.png'} alt="icon" className="w-12 h-12 mb-5" />
              </div>
              <div>
                <h3 className="text-md font-bold mb-4" style={{ color: 'black' }}>
                  Program Sekolah Ramah Lingkungan
                </h3>
                <p className="opacity-90 text-sm" style={{ color: theme.primaryText }}>
                  Komitmen sekolah dalam menjaga lingkungan melalui pengelolaan sampah, penanaman pohon, edukasi eco-friendly, dan kegiatan konservasi alam.
                </p>
              </div>
            </motion.div>

            {/* Pengembangan Karakter & Kepemimpinan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/20 text-left"
            >
              <div>
                <img src={'/i1.png'} alt="icon" className="w-12 h-12 mb-5" />
              </div>
              <div>
                <h3 className="text-md font-bold mb-4" style={{ color: 'black' }}>
                  Pengembangan Karakter dan Kepemimpinan
                </h3>
                <p className="opacity-90 text-sm" style={{ color: theme.primaryText }}>
                  Melalui OSIS, LDKS, pramuka, dan kegiatan ekstrakurikuler lainnya, siswa dibekali nilai karakter Profil Pelajar Pancasila dan jiwa kepemimpinan.
                </p>
              </div>
            </motion.div>

          </div>

          {/* Judul Utama */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl mt-20 font-bold md:text-center text-left mb-8"
            style={{ color: theme.primaryText }}
          >
            Program Sekolah
          </motion.h1>

          {/* Deskripsi Pengantar */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-md md:text-lg md:text-center text-left max-w-full mx-auto opacity-90 leading-relaxed"
            style={{ color: theme.surfaceText }}
          >
            SMA Negeri 25 Jakarta memiliki berbagai program unggulan yang dirancang untuk mendukung pengembangan potensi siswa secara menyeluruh, baik di bidang akademik maupun non-akademik. Program-program ini bertujuan untuk menciptakan lulusan yang berprestasi, berkarakter, dan siap menghadapi tantangan global.
          </motion.p>

          {/* Kurikulum Merdeka */}
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative flex flex-col items-center mt-20"
            >
              {/* Title Utama (opsional jika ingin judul di atas) */}
              <h3 className="text-3xl md:text-4xl font-bold md:text-center md:flex hidden text-left mb-12" style={{ color: theme.primaryText }}>
                Transformasi Pembelajaran dengan Kurikulum Merdeka
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
                {/* Gambar BEFORE */}
                <div className="border border-gray-300 relative group rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/pro2.png"
                    alt="Sebelum Kurikulum Merdeka"
                    className="w-full h-96 md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />

                  {/* Caption kecil di bawah */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white text-lg md:text-xl font-medium drop-shadow-lg">
                      BEFORE
                    </p>
                  </div>
                </div>

                {/* Gambar AFTER */}
                <div className="border border-gray-300 relative group rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/pro3.png"
                    alt="Setelah Kurikulum Merdeka"
                    className="w-full h-96 md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />

                  {/* Caption kecil di bawah */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white text-lg md:text-xl font-medium drop-shadow-lg">
                      AFTER
                    </p>
                  </div>
                </div>
              </div>

              {/* Deskripsi Tambahan (opsional) */}
              <p className="mt-12 md:text-center text-left text-lg md:text-xl max-w-4xl opacity-90" style={{ color: theme.surfaceText }}>
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