import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ================= CONFIG ================= */
const BASE_URL = "https://be-school.kiraproject.id";


/* ================= COMPONENTS ================= */
const Card = ({ children }: any) => (
  <div className="rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition">
    {children}
  </div>
);

const Loading = () => (
  <div className="py-20 md:text-center text-left text-sm text-black/80">Memuat data…</div>
);

/* ================= HERO SECTION ================= */
const HeroSection = () => {

  const scrollToServices = () => {
    document
      .getElementById("layanan-internal")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative z-[1] h-[84vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/hero1.png')`,
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-[1] md:text-center text-left -mt-14 text-white px-6 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Layanan
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
          className="px-8 py-4 rounded-xl bg-white text-black font-medium hover:bg-gray-100 transition shadow-lg"
        >
          Jelajahi Layanan
        </motion.button>
      </div>
    </section>
  );
};

/* ================= SERVICES ================= */
const ServicesGrid = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/layanan?schoolId=88`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Gagal memuat layanan");

        const json = await res.json();

        if (json.success) {
          setServices(json.data || []);
        } else {
          setError(json.message || "Gagal memuat data");
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Pisahkan internal & publik
  const internalServices = services.filter((s: any) => s.type === "internal");
  const publicServices = services.filter((s: any) => s.type === "publik");

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="md:text-center text-left py-20 text-red-600">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 text-blue-600 underline"
        >
          Coba lagi
        </button>
      </div>
    );

  return (
    <section id="layanan-internal" className="py-16 bg-gray-50 relative z-[1]">
      <div className="max-w-7xl mx-auto px-4">
        {/* ================= LAYANAN INTERNAL ================= */}
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:text-center text-left text-black">
          Layanan Internal
        </h2>

        {internalServices.length === 0 ? (
          <p className="text-center text-gray-600 py-8 mb-12">
            Belum ada layanan internal yang tersedia saat ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 md:justify-start items-start gap-6 mb-16">
            {internalServices.map((s: any) => (
              <Card key={s.id}>
                <div
                  className="p-6 text-left w-full min-h-[260px] rounded-lg shadow-xl transition"
                >
                  <div className="font-semibold w-full justify-between flex items-center gao-4 mb-7 text-lg text-black">
                    {s.title}
                  </div>
                  <p className="text-sm text-black/80 min-h-[80px] mb-4 line-clamp-3">
                    {s.description}
                  </p>

                  <div className="flex w-full items-center text-xs text-gray-700 leading-loose gap-6 border-t border-black/20 pt-4 mt-3">
                   <p>
                      <strong className='mr-1'>Telepon:</strong> 
                    {s.noTelephone ? (
                      <>
                        {s.noTelephone}
                      </>
                    ): '-'}
                    </p>
                    <p>
                      <strong className='mr-1'>Email:</strong> 
                      {s.email ? (
                        <>
                          {s.email}
                        </>
                      ): '-'}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ================= LAYANAN PUBLIK ================= */}
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:text-center text-left text-black mt-12">
          Layanan Publik
        </h2>

        {publicServices.length === 0 ? (
          <p className="text-center text-gray-600 py-8">
            Belum ada layanan publik yang tersedia saat ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 md:justify-start items-start gap-6">
            {publicServices.map((s: any) => (
              <Card key={s.id}>
                <div
                  className="p-6 text-left w-full min-h-[260px] rounded-lg shadow-xl transition"
                >
                  <div className="font-semibold w-full justify-between flex items-center gao-4 mb-7 text-lg text-black">
                    <p>
                      {s.title}
                    </p>
                    {/* <PhoneCall className="text-black w-5 h-5 relative top-[-6px]" /> */}
                  </div>
                  <p className="text-sm min-h-[80px] text-black/80 mb-4 line-clamp-3">
                    {s.description}
                  </p>

                  <div className="flex w-full items-center text-xs text-gray-700 leading-loose gap-6 border-t border-black/20 pt-4 mt-3">
                    {/* {s.atasNama && (
                      <p>
                        <strong className='mr-1'>Atas Nama:</strong> {s.atasNama}
                      </p>
                    )} */}
                    <p>
                      <strong className='mr-1'>Telepon:</strong> 
                    {s.noTelephone ? (
                      <>
                        {s.noTelephone}
                      </>
                    ): '-'}
                    </p>
                    <p>
                      <strong className='mr-1'>Email:</strong> 
                      {s.email ? (
                        <>
                          {s.email}
                        </>
                      ): '-'}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
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
      
      <HeroSection />

      <main className="flex-1 -mt-10 relative z-[1]">
        <ServicesGrid />
      </main>
      
      <FooterComp theme={theme} />
    </div>
  );
}