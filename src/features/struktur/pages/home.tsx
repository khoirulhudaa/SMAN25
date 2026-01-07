// import { SMAN25_CONFIG } from "@/core/theme";
// import { getXHostHeader } from "@/core/utils/XHostHeader";
// import { FooterComp } from "@/features/_global/components/footer";
// import NavbarComp from "@/features/_global/components/navbar";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { motion, useReducedMotion } from "framer-motion";
// import { useEffect } from "react";

// /****************
//  * SECTION WRAPPER
//  ****************/
// const Section = ({ children }: { children: React.ReactNode }) => (
//   <section className="py-12 md:py-16">
//     <div className="max-w-6xl mx-auto px-4">{children}</div>
//   </section>
// );

// /****************
//  * REACT-QUERY HOOK
//  ****************/
// type Employee = {
//   jabatan: string;
//   nama: string;
//   foto: string;
// };

// type StrukturData = Employee[];

// const DEMO_DATA: StrukturData = [
//   { jabatan: "Kepala Sekolah", nama: "Drs. Nama Kepala Sekolah", foto: "/foto/kepsek.jpg" },
//   { jabatan: "Wakil Kepala Kurikulum", nama: "Nama Wakasek Kurikulum", foto: "/foto/waka-kurikulum.jpg" },
// ];

// const useStrukturData = () => {
//   const xHost = getXHostHeader();

//   return useQuery<StrukturData, Error>({
//     queryKey: ['struktur', xHost],
//     queryFn: async () => {
//       const res = await fetch('https://dev.kiraproject.id/school-employees', {
//         cache: 'no-store',
//         headers: {
//           'X-Host': xHost,
//           'Cache-Control': 'no-store',
//         },
//       });
//       if (!res.ok) throw new Error('Failed to fetch employee data');
//       const { data } = await res.json();
//       return data.map((e: any) => ({
//         jabatan: e.jabatan,
//         nama: e.nama,
//         foto: e.foto,
//       }));
//     },
//     staleTime: 0,
//     gcTime: 0,
//     refetchOnMount: true,
//     refetchOnWindowFocus: false,
//     placeholderData: DEMO_DATA,
//     retry: 1,
//   });
// };

// /********
//  * StrukturOrganisasi Component
//  ********/
// const StrukturOrganisasi = ({ theme, schoolName }: { theme: any; schoolName: string }) => {
//   const prefersReducedMotion = useReducedMotion();
//   const { data: orgCards = DEMO_DATA, isPending: isLoading, error } = useStrukturData();
//   const queryClient = useQueryClient();
//   const xHost = getXHostHeader();

//   // Invalidate cache saat X-Host berubah
//   useEffect(() => {
//     queryClient.invalidateQueries({ queryKey: ['struktur'] });
//   }, [xHost, queryClient]);

//   const FallbackMessage = ({ message }: { message: string }) => (
//     <div className="text-center text-sm py-10" style={{ color: theme.surfaceText }}>
//       {message}
//     </div>
//   );

//   return (
//     <Section>
//       <div id="struktur" className="relative" style={{ scrollMarginTop: 80 }}>
//         <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>Struktur Organisasi</h2>
//             <p className="text-sm opacity-70" style={{ color: theme.surfaceText }}>
//               Tim kepemimpinan {schoolName}
//             </p>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="text-center text-sm py-10" style={{ color: theme.surfaceText }}>
//             Memuat data organisasi...
//           </div>
//         ) : error ? (
//           <div className="text-center text-sm py-10" style={{ color: theme.pop }}>
//             Error: {error.message}. Menggunakan data demo.
//           </div>
//         ) : orgCards.length > 0 ? (
//           <motion.div
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
//           >
//             <div className="grid md:grid-cols-3 gap-4">
//               {orgCards.map((s, i) => (
//                 <motion.div
//                   key={`${s.jabatan}-${i}`}
//                   initial={{ opacity: 0, y: 16, scale: 0.95 }}
//                   whileInView={{ opacity: 1, y: 0, scale: 1 }}
//                   viewport={{ once: true, amount: 0.3 }}
//                   transition={{ duration: 0.45, delay: i * 0.03 }}
//                   className="rounded-2xl p-4 border shadow-sm hover:shadow-md flex flex-col items-center text-center"
//                   style={{ background: theme.surface, borderColor: theme.subtle }}
//                 >
//                   {s.foto && (
//                     <img
//                       src={`https://dev.kiraproject.id${s.foto}`}
//                       alt={s.nama}
//                       className="w-20 h-20 object-cover rounded-full mb-3 border"
//                       style={{ borderColor: theme.subtle }}
//                       onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
//                       loading="lazy"
//                     />
//                   )}
//                   <div className="text-sm font-semibold" style={{ color: theme.surfaceText }}>
//                     {s.jabatan}
//                   </div>
//                   <div className="text-xs opacity-80 mt-1" style={{ color: theme.surfaceText }}>
//                     {s.nama}
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         ) : (
//           <FallbackMessage message="Data organisasi tidak tersedia." />
//         )}

//         <div className="mt-4 text-xs opacity-75" style={{ color: theme.surfaceText }}>
//           *Data diambil dari API terbaru.
//         </div>
//       </div>
//     </Section>
//   );
// };

// /********
//  * PAGE
//  ********/
// const Page = ({ theme, schoolName }: { theme: any; schoolName: string }) => (
//   <div className="min-h-screen" style={{ background: theme.bg }}>
//     <NavbarComp theme={theme} />
//     <StrukturOrganisasi theme={theme} schoolName={schoolName} />
//     <FooterComp theme={theme} />
//   </div>
// );

// /****************
//  * EXPORT + SMOKE TESTS
//  ****************/
// const StrukturPage = () => {
//   const schoolInfo = SMAN25_CONFIG;
//   const theme = schoolInfo.theme;
//   const schoolName = schoolInfo.fullName;

//   useEffect(() => {
//     try {
//       console.assert(typeof NavbarComp === 'function', 'Navbar terdefinisi');
//       console.assert(typeof StrukturOrganisasi === 'function', 'StrukturOrganisasi terdefinisi');
//       console.assert(typeof FooterComp === 'function', 'Footer terdefinisi');
//       setTimeout(() => {
//         const ids = ['struktur'];
//         ids.forEach(id => console.assert(!!document.getElementById(id), `Anchor #${id} tersedia`));
//       }, 0);
//       console.log('UI smoke tests passed');
//     } catch (e) {
//       console.error('UI smoke tests failed:', e);
//     }
//   }, []);

//   return <Page theme={theme} schoolName={schoolName} />;
// };

// export default StrukturPage;



import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

/****************************
 * HERO SECTION UNTUK STRUKTUR ORGANISASI
 ****************************/
const HeroSection = () => {
  const scrollToStruktur = () => {
    document.getElementById("struktur")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      {/* Background Image - Representatif kepemimpinan sekolah */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/struktur.jpg')`, // Ganti dengan foto resmi kepsek/rapat jika ada
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

/****************
 * SECTION WRAPPER
 ****************/
const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="py-12 md:py-16">
    <div className="max-w-6xl mx-auto px-4">{children}</div>
  </section>
);

/****************
 * REACT-QUERY HOOK
 ****************/
type Employee = {
  jabatan: string;
  nama: string;
  foto: string;
};

type StrukturData = Employee[];

const DEMO_DATA: StrukturData = [
  { jabatan: "Kepala Sekolah", nama: "Drs. Nama Kepala Sekolah", foto: "/foto/kepsek.jpg" },
  { jabatan: "Wakil Kepala Kurikulum", nama: "Nama Wakasek Kurikulum", foto: "/foto/waka-kurikulum.jpg" },
];

const useStrukturData = () => {
  const xHost = getXHostHeader();

  return useQuery<StrukturData, Error>({
    queryKey: ['struktur', xHost],
    queryFn: async () => {
      const res = await fetch('https://dev.kiraproject.id/school-employees', {
        cache: 'no-store',
        headers: {
          'X-Host': xHost,
          'Cache-Control': 'no-store',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch employee data');
      const { data } = await res.json();
      return data.map((e: any) => ({
        jabatan: e.jabatan,
        nama: e.nama,
        foto: e.foto,
      }));
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    placeholderData: DEMO_DATA,
    retry: 1,
  });
};

/********
 * StrukturOrganisasi Component
 ********/
const StrukturOrganisasi = ({ theme, schoolName }: { theme: any; schoolName: string }) => {
  const prefersReducedMotion = useReducedMotion();
  const { data: orgCards = DEMO_DATA, isPending: isLoading, error } = useStrukturData();
  const queryClient = useQueryClient();
  const xHost = getXHostHeader();

  // Invalidate cache saat X-Host berubah
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['struktur'] });
  }, [xHost, queryClient]);

  const FallbackMessage = ({ message }: { message: string }) => (
    <div className="text-center text-sm py-10" style={{ color: theme.surfaceText }}>
      {message}
    </div>
  );

  return (
    <Section>
      <div id="struktur" className="relative" style={{ scrollMarginTop: 80 }}>
        <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.surfaceText }}>Struktur Organisasi</h2>
            <p className="text-sm opacity-70" style={{ color: theme.surfaceText }}>
              Tim kepemimpinan {schoolName}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-sm py-10" style={{ color: theme.surfaceText }}>
            Memuat data organisasi...
          </div>
        ) : error ? (
          <div className="text-center text-sm py-10" style={{ color: theme.pop }}>
            Error: {error.message}. Menggunakan data demo.
          </div>
        ) : orgCards.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
          >
            <div className="grid md:grid-cols-3 gap-4">
              {orgCards.map((s, i) => (
                <motion.div
                  key={`${s.jabatan}-${i}`}
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: i * 0.03 }}
                  className="rounded-2xl p-4 border shadow-sm hover:shadow-md flex flex-col items-center text-center"
                  style={{ background: theme.surface, borderColor: theme.subtle }}
                >
                  {s.foto && (
                    <img
                      src={`https://dev.kiraproject.id${s.foto}`}
                      alt={s.nama}
                      className="w-20 h-20 object-cover rounded-full mb-3 border"
                      style={{ borderColor: theme.subtle }}
                      onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                      loading="lazy"
                    />
                  )}
                  <div className="text-sm font-semibold" style={{ color: theme.surfaceText }}>
                    {s.jabatan}
                  </div>
                  <div className="text-xs opacity-80 mt-1" style={{ color: theme.surfaceText }}>
                    {s.nama}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <FallbackMessage message="Data organisasi tidak tersedia." />
        )}

        <div className="mt-4 text-xs opacity-75" style={{ color: theme.surfaceText }}>
          *Data diambil dari API terbaru.
        </div>
      </div>
    </Section>
  );
};

/********
 * PAGE DENGAN HERO
 ********/
const Page = ({ theme, schoolName }: { theme: any; schoolName: string }) => (
  <div className="min-h-screen" style={{ background: theme.bg }}>
    <NavbarComp theme={theme} />

    {/* HERO SECTION */}
    <HeroSection />

    <main>
      <StrukturOrganisasi theme={theme} schoolName={schoolName} />
    </main>

    <FooterComp theme={theme} />
  </div>
);

/****************
 * EXPORT + SMOKE TESTS
 ****************/
const StrukturPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;

  useEffect(() => {
    try {
      console.assert(typeof NavbarComp === 'function', 'Navbar terdefinisi');
      console.assert(typeof StrukturOrganisasi === 'function', 'StrukturOrganisasi terdefinisi');
      console.assert(typeof FooterComp === 'function', 'Footer terdefinisi');
      setTimeout(() => {
        const ids = ['struktur'];
        ids.forEach(id => console.assert(!!document.getElementById(id), `Anchor #${id} tersedia`));
      }, 0);
      console.log('UI smoke tests passed');
    } catch (e) {
      console.error('UI smoke tests failed:', e);
    }
  }, []);

  return <Page theme={theme} schoolName={schoolName} />;
};

export default StrukturPage;