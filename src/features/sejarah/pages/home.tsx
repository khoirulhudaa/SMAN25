import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { animate, motion, useMotionValue, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/****************************
 * HERO SECTION
 ****************************/
const HeroSection = ({ schoolName }: { schoolName: string }) => {
  const scrollToContent = () => {
    document.getElementById("sejarah")?.scrollIntoView({ behavior: "smooth" });
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
          Sejarah {schoolName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Jejak perjalanan, tonggak penting, dan warisan yang membentuk karakter sekolah hingga hari ini.
        </motion.p>
        <motion.button
          onClick={scrollToContent}
          className="px-10 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          Jelajahi Sejarah
        </motion.button>
      </div>
    </section>
  );
};

const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="py-12 md:py-16">
    <div className="max-w-7xl mx-auto px-4 md:px-4">{children}</div>
  </section>
);

const ScrollProgress = ({ theme }: { theme: any }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div style={{ scaleX, transformOrigin: "0% 50%", background: theme.accent }} className="fixed left-0 right-0 top-0 h-1 z-[60]" />;
};

const Counter: React.FC<{ to: number }> = ({ to }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (to === 0) return;
    let current = 0;
    const duration = 2000;
    const step = to / 60;
    const interval = setInterval(() => {
      current += step;
      if (current >= to) {
        setCount(to);
        clearInterval(interval);
      } else {
        setCount(Math.round(current));
      }
    }, duration / 60);
    return () => clearInterval(interval);
  }, [to]);
  return <span>{count}</span>;
};

const HeroSejarah: React.FC<{ theme: any; data: any }> = ({ theme, data }) => {
  return (
    <Section>
      <div id="sejarah" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-0 py-4">
          <h2 className="text-2xl font-bold" style={{ color: theme.surfaceText }}>Tentang Kami</h2>
          <p className="mt-3 text-base md:text-lg opacity-90 w-full" style={{ color: theme.primaryText }}>
            {data?.deskripsi || "Informasi mengenai sejarah sekolah sedang dalam proses pembaruan data."}
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 md:gap-4">
            {[
              { label: "Tahun Berdiri", val: data?.tahunBerdiri || 0 },
              { label: "Kepala Sekolah", val: data?.jumlahKepalaSekolah || 0 },
              { label: "Kompetensi", val: data?.jumlahKompetensiKeahlian || 0 },
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl p-4 border border-gray-500" style={{ background: theme.surface }}>
                <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>{item.label}</div>
                <div className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>
                  <Counter to={item.val} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

const Timeline: React.FC<{ theme: any; data: any[] }> = ({ theme, data }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) return null;

  return (
    <Section>
      <div className="grid md:grid-cols-[240px,1fr] gap-6 items-start">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>Timeline</h2>
        <div className="relative" ref={lineRef}>
          <div className="absolute left-4 top-0 w-1 h-full" style={{ background: theme.accent, opacity: 0.3 }} />
          <ul className="space-y-5">
            {data.map((it, i) => (
              <li key={i} className="relative gap-4 flex p-5 py-6 rounded-2xl border border-gray-500" style={{ background: theme.surface }}>
                <div className="relative w-max h-max px-2 rounded-md bg-blue-500 text-white">
                  <p className="w-max">
                    {it.year}
                  </p>
                </div>
                <div>
                  {/* <span className="text-xs font-bold mb-1" style={{ color: theme.accent }}>{it.year}</span> */}
                  <div className="text-base font-semibold" style={{ color: theme.surfaceText }}>{it.title}</div>
                  <p className="text-sm mt-1 opacity-80" style={{ color: theme.surfaceText }}>{it.deskripsi}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

const KepalaSekolahGrid: React.FC<{ theme: any; data: any[] }> = ({ theme, data }) => {
  if (!data || data.length === 0) return null;
  return (
    <Section>
      <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: theme.surfaceText }}>Daftar Kepala Sekolah</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((p, i) => (
          <div key={i} className="rounded-2xl p-4 border border-gray-500 text-center" style={{ background: theme.surface }}>
            <div 
                className="w-20 h-20 mx-auto rounded-full mb-3 bg-gray-200 bg-cover bg-center border" 
                style={{ backgroundImage: p.fotoUrl ? `url(${p.fotoUrl})` : "none" }} 
            >
                {!p.fotoUrl && <span className="text-[10px] flex h-full items-center justify-center">No Photo</span>}
            </div>
            <div className="text-sm font-semibold" style={{ color: theme.surfaceText }}>{p.nama || p.name}</div>
            <div className="text-xs opacity-70" style={{ color: theme.surfaceText }}>{p.masaJabatan || p.period}</div>
          </div>
        ))}
      </div>
    </Section>
  );
};

/**************** * MAIN PAGE COMPONENT ****************/
const SejarahPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const { theme, fullName: schoolName } = schoolInfo;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSejarah = async () => {
      try {
        const response = await fetch("https://be-school.kiraproject.id/sejarah?schoolId=88");
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSejarah();
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ background: theme.bg }}>
      <ScrollProgress theme={theme} />
      <NavbarComp theme={theme} />
      
      <HeroSection schoolName={schoolName} />
      
      {/* Jika loading, bisa tampilkan skeleton atau biarkan saja karena HeroSection sudah muncul */}
      {!loading ? (
        <>
          <HeroSejarah theme={theme} data={data} />
          <Timeline theme={theme} data={data?.timeline} />
          <KepalaSekolahGrid theme={theme} data={data?.daftarKepalaSekolah} />
        </>
      ) : (
        <div className="py-20 text-center opacity-50">Memuat data sejarah...</div>
      )}
      
      <FooterComp theme={theme} />
    </div>
  );
};

export default SejarahPage;