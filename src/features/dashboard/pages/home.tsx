import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import BeritaComp from "@/features/_global/components/berita";
import { FooterComp } from "@/features/_global/components/footer";
import GalleryComp from "@/features/_global/components/galeri";
import NavbarComp from "@/features/_global/components/navbar";
import { queryClient } from "@/features/_root/queryClient";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, FileCheck, Thermometer, UserCheck, UserX } from "lucide-react";
import { useEffect, useState } from "react";

const BASE_URL = 'https://be-school.kiraproject.id/profileSekolah';

interface SchoolProfile {
  schoolId?: number;
  schoolName?: string;
  headmasterName?: string;
  headmasterWelcome?: string;
  heroTitle?: string;
  heroSubTitle?: string;
  photoHeadmasterUrl?: string;
  studentCount?: number;
  teacherCount?: number;
  roomCount?: number;
  achievementCount?: number;
  linkYoutube?: string;
}

let useSwipeable;
try { useSwipeable = require("react-swipeable").useSwipeable; } catch { useSwipeable = () => ({}) }

const SafeImage = ({ src, alt, className, style }: any) => {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className={className} aria-label={alt || 'image'}
           style={{ ...style, background: "repeating-linear-gradient(45deg, #e2e8f0 0 10px, #cbd5e1 10px 20px)" }} />
    );
  }
  return <img src={src} alt={alt || ''} className={className} style={style} loading="lazy" decoding="async"
              referrerPolicy="no-referrer" crossOrigin="anonymous" onError={() => setFailed(true)} />;
};

const Badge = ({ children, theme }: any) => (
  <span className="px-3 py-1 text-xs font-medium rounded-full border"
        style={{ background: theme.accent + "30", color: theme.accentText, borderColor: theme.accent }}>
    {children}
  </span>
);

const useStats = () => {
  const xHost = getXHostHeader();
  return useQuery({
    queryKey: ['stats', xHost],
    queryFn: async () => {
      const res = await fetch("https://dev.kiraproject.id/public/statistics/daily", {
        cache: 'no-store',
        headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
      });
      if (!res.ok) throw new Error("Failed to fetch statistics");
      const data = await res.json();
      if (!data.success) throw new Error("Invalid response");
      return [
        { k: "HADIR", v: data.data.hadirHariIni },
        { k: "IZIN", v: data.data.izinSakit },
        { k: "TERLAMBAT", v: data.data.terlambat },
        { k: "GURU HADIR", v: data.data.guruHadir },
      ];
    },
  });
};

const useSambutanAndHeadmasters = () => {
  const xHost = getXHostHeader();
  return useQueries({
    queries: [
      {
        queryKey: ['sambutan', xHost],
        queryFn: async () => {
          const res = await fetch("https://dev.kiraproject.id/beranda", {
            cache: 'no-store',
            headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
          });
          if (!res.ok) throw new Error("Failed to fetch sambutan");
          const data = await res.json();
          return data.sambutan;
        },
      },
      {
        queryKey: ['headmasters', xHost],
        queryFn: async () => {
          const res = await fetch("https://dev.kiraproject.id/sejarah/kepsek", {
            cache: 'no-store',
            headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
          });
          if (!res.ok) throw new Error("Failed to fetch headmasters");
          const data = await res.json();
          return data.items;
        },
      },
    ],
  });
};

const useAnnouncements = () => {
  const xHost = getXHostHeader();
  return useQuery({
    queryKey: ['announcements', xHost],
    queryFn: async () => {
      const res = await fetch(`https://dev.kiraproject.id/public/announcements?page=1&limit=10`, {
        cache: 'no-store',
        headers: { 'X-Host': xHost, 'Cache-Control': 'no-store' },
      });
      const data = await res.json();
      if (!data.success) throw new Error("Failed to fetch announcements");
      return data.data;
    },
  });
};

export function useNews(schoolId: string | number | undefined) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setError("schoolId tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`https://be-school.kiraproject.id/berita?schoolId=${schoolId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Jika nanti pakai autentikasi: "Authorization": `Bearer ${token}`,
          },
          cache: "no-store", // agar selalu fresh
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Gagal mengambil berita");
        }

        // Mapping data sesuai struktur backend baru
        const mappedNews = json.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          date: new Date(item.publishDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          tag: item.category || "Umum",
          img: item.imageUrl || "/default-news.jpg",
          excerpt: item.content.substring(0, 150) + "...", // potong jadi excerpt
          source: item.source || "Sekolah",
        }));

        setNews(mappedNews);
      } catch (err: any) {
        console.error("Fetch news error:", err);
        setError(err.message || "Gagal memuat berita");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [schoolId]);

  return { news, loading, error };
}

// Hook baru untuk profil sekolah (hanya ini yang ditambah)
const useSchoolProfile = () => {
  const schoolId = 88; // ← sesuaikan dengan ID sekolah yang ada di database

  const API_BASE = 'https://be-school.kiraproject.id';

  return useQuery({
    queryKey: ['schoolProfile', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/profileSekolah?schoolId=${schoolId}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`Gagal mengambil profil sekolah: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Response tidak valid");
      return data.data; // null atau objek profil
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// ──────────────────────────────────────────────────────────────
// Hero - tetap layout & style asli, hanya ganti teks dari profil
// ──────────────────────────────────────────────────────────────

const Hero = () => {
  const { data: profile, isPending } = useSchoolProfile();

  const title = isPending || !profile?.heroTitle 
    ? "SEKOLAH BERPRESTASI DAN BERKARAKTER" 
    : profile.heroTitle;

  const subTitle = isPending || !profile?.heroSubTitle 
    ? "Jadilah bagian dari generasi berprestasi dengan fasilitas modern, pembelajaran inovatif, dan kegiatan ekstrakurikuler yang mendukung potensi terbaik Anda." 
    : profile.heroSubTitle;

  return (
    <div className="relative h-[80vh] md:h-[85vh] overflow-hidden">
      <SafeImage src="/hero2.png" alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/60" />
      <div className="absolute md:px-0 px-5 mt-[-20px] w-full mx-auto h-full flex flex-col text-left md:text-center md:items-center md:justify-center text-white">
        <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: 0 }} className="text-left md:text-center w-full h-full flex flex-col justify-center items-center leading-loose">
          <h1 className="text-3xl md:text-6xl md:w-[80%] leading-[35px] md:leading-tight h-max font-bold relative">{title}</h1>
          <p className="mt-6 text-md md:text-lg w-[100%] md:max-w-[70%] leading-loose text-gray-300">{subTitle}</p>
          <div className="mt-8 flex gap-4 w-full items-center justify-center">
            <a href={"#keunggulan"} className="md:w-max w-full px-8 py-4 rounded-md md:rounded-md font-semibold text-white bg-blue-500 shadow-lg">{"Telusuri Sekarang"}</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// SambutanSection - layout & style persis sama, hanya data dari profil
// ──────────────────────────────────────────────────────────────

const SambutanSection = () => {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ganti dengan schoolId yang sesuai (bisa dari env, context, atau props)
  const SCHOOL_ID = 88; // ← contoh: SMAN 25 Jakarta → sesuaikan!!!

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // tambahkan Authorization jika nanti pakai JWT
          },
          cache: 'no-store', // atau 'force-cache' tergantung kebutuhan
        });

        const result = await res.json();

        if (!result.success) {
          throw new Error(result.message || 'Gagal mengambil data profil');
        }

        setProfile(result.data);
      } catch (err: any) {
        console.error('Error fetching school profile:', err);
        setError(err.message || 'Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="py-24 text-left md:text-center">Memuat sambutan kepala sekolah...</div>;
  }

  if (error) {
    return (
      <div className="py-24 text-left md:text-center text-red-600">
        {error} (schoolId: {SCHOOL_ID})
      </div>
    );
  }

  // Fallback values jika data null / field kosong
  const headmasterName    = profile?.headmasterName   || 'Kepala Sekolah';
  const headmasterWelcome = profile?.headmasterWelcome || 
    'Alhamdulillah, segala puji hanya milik Allah SWT...'; // fallback default Anda
  const photoUrl          = profile?.photoHeadmasterUrl || '/kapalaSekolah.png';
  const schoolName        = profile?.schoolName       || 'SMAN 25 Jakarta';

  const stats = [
    { value: profile?.studentCount ? `${profile.studentCount}+` : '540+', label: 'Peserta Didik' },
    { value: profile?.teacherCount  ? `${profile.teacherCount}+`  : '45+',  label: 'Guru Tendik' },
    { value: profile?.roomCount     ? `${profile.roomCount}+`     : '30+',  label: 'Ruangan' },
    { value: profile?.achievementCount ? `${profile.achievementCount}` : '100', label: 'Penghargaan' },
  ];

  return (
    <section
      className="pt-10 md:pt-16 pb-16 md:pb-24 z-[1] bg-white relative overflow-hidden"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: `
          radial-gradient(#d1d5db 1.5px, transparent 1.5px),
          radial-gradient(#e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: '44px 44px, 76px 76px',
        backgroundPosition: '0 0, 22px 22px',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-left md:text-center mb-12" style={{ color: 'black' }}>
          SAMBUTAN KEPALA SEKOLAH
        </h2>

        <div className="grid md:grid-cols-1 gap-12 items-center justify-center text-left md:text-center">
          <div className="relative">
            <div className="absolute top-0 left-0 z-10 w-48 md:w-64 -translate-y-8 md:-translate-y-12 -translate-x-4 md:-translate-x-8">
              <SafeImage src="/sman25-sign.jpg" alt="SMAN 25 JAKARTA" className="w-full" />
            </div>

            <div className="relative rounded-2xl overflow-hidden">
              <SafeImage
                src={photoUrl}
                alt="Kepala Sekolah"
                className="w-full h-[400px] md:h-[460px] object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div className="text-lg text-gray-700 leading-relaxed space-y-4">
              {headmasterWelcome.split('\n').map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-2xl font-bold" style={{ color: 'black' }}>
                {headmasterName}
              </p>
              <p className="text-gray-600 text-lg">Kepala Sekolah {schoolName}</p>
            </div>

            <div className="hidden md:grid grid-cols-1 md:grid-cols-4 border-t border-gray-300 justify-center items-center gap-8 mt-14 pt-14">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="text-left md:text-center gap-3 w-full flex items-center justify-center relative"
                >
                  <p className="text-3xl md:text-5xl font-bold" style={{ color: 'black' }}>
                    {stat.value}
                  </p>
                  <p className="text-gray-600">{stat.label}</p>
                  {i < stats.length - 1 && (
                    <div className="hidden md:block absolute w-px bg-gray-300 top-0 bottom-0 right-0 translate-x-1/2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface Facility {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string | null;
}

const FasilitasSection = () => {
  const schoolId = "88";

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setError("School ID tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchFacilities = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`https://be-school.kiraproject.id/fasilitas?schoolId=${schoolId}`, {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (!json.success || !Array.isArray(json.data)) {
          throw new Error("Format response tidak valid");
        }

        // Mapping data dari backend
        const mapped = json.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          imageUrl: item.imageUrl || null,
        }));

        setFacilities(mapped);
      } catch (err: any) {
        console.error("Fetch fasilitas error:", err);
        setError(err.message || "Gagal memuat fasilitas");
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [schoolId]);

  if (loading) {
    return (
      <section className="py-8 md:py-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">Memuat fasilitas sekolah...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 md:py-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (facilities.length === 0) {
    return (
      <section className="py-8 md:py-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold" style={{ color: "black" }}>
            Fasilitas Sekolah Kami
          </h2>
          <p className="text-gray-500 mt-4">Belum ada data fasilitas yang tersedia saat ini.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-20 bg-gradient-to-b from-indigo-100 via-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-left md:text-center"
          style={{ color: "black" }}
        >
          Fasilitas Sekolah Kami
        </motion.h2>
        <p className="text-xs mb-16 text-left md:text-center mx-auto mt-3 text-gray-500">
          (Data diambil dari sistem sekolah)
        </p>

        {/* Masonry grid responsif */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
          {facilities.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500"
            >
              <img
                src={item.imageUrl || "/default-facility.jpg"} 
                alt={item.name}
                className="w-full h-full object-cover scale-110 transition-transform duration-700 group-hover:scale-125"
                style={{ minHeight: "300px" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-facility.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 opacity-100 transition-opacity duration-500 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm mt-2 opacity-90 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PengurusSection = () => {
  const [, headmastersQuery] = useSambutanAndHeadmasters();
  const headmasters = headmastersQuery.data || [];

  // Tambah wakil hardcoded sementara (bisa diganti API nanti)
  const pengurus = [
    ...headmasters.slice(0, 1).map((h: any) => ({ jabatan: 'Kepala Sekolah', nama: h.name })),
    { jabatan: 'Wakil Kepala Kurikulum', nama: 'Dr. Siti Nurhaliza, M.Pd', img: '/p1.png' },
    { jabatan: 'Wakil Kepala Kesiswaan', nama: 'Budi Santoso, S.Pd', img: '/p2.png' },
    { jabatan: 'Wakil Kepala Sarpras', nama: 'Ir. Rina Wati', img: '/p3.png' },
    { jabatan: 'Wakil Kepala Sarpras', nama: 'Ir. Rina Wati', img: '/p4.png' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-left md:text-center mb-12" style={{ color: 'black' }}>Pengurus Sekolah</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {pengurus.map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-blue-50 w-full to-white rounded-xl shadow-md p-4 md:p-6 text-left md:text-center border border-gray-500 md:border-blue-100 hover:shadow-xl transition-shadow">
              <img src={item.img} alt="photo" className="w-full bg-cover" />
              <h3 className="font-semibold text-lg mt-6 mb-2" style={{ color: 'black' }}>{'Pengajar'}</h3>
              <p className="text-gray-700">{'SMAN 25 Jakarta'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BeritaSection = () => {
  const SCHOOL_ID = "88";
  const { news: items = [], loading, error } = useNews(SCHOOL_ID);

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-600">
        Memuat berita sekolah...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        Belum ada berita saat ini
      </div>
    );
  }

  return (
    <section className="py-0 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: "black" }}
          >
            Berita Sekolah
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((n: any, i: number) => (
            <div
              key={n.id || i}
              className="bg-white rounded-xl cursor-pointer hover:brightness-95 overflow-hidden shadow-2xl transition-shadow duration-300"
            >
              {/* Gambar atau placeholder */}
              {n.img ? (
                <img
                  src={n.img}
                  alt={n.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-news.jpg";
                  }}
                />
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Calendar className="text-white" size={64} />
                </div>
              )}

              <div className="p-6">
                <span
                  className="inline-block px-4 py-1 rounded-full text-xs font-semibold mb-4"
                  style={{
                    background: `${theme?.accent || "#3b82f6"}40`,
                    color: "black",
                  }}
                >
                  {n.tag}
                </span>
                <h3 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2">
                  {n.title}
                </h3>
                <p className="text-sm text-gray-500">{n.date}</p>
                {/* Optional: tampilkan excerpt jika mau */}
                {/* <p className="mt-3 text-gray-600 line-clamp-3">{n.excerpt}</p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const VideoSection = () => {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const SCHOOL_ID = 88; // ← sesuaikan!!!

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}?schoolId=${SCHOOL_ID}`);
        const result = await res.json();

        if (result.success) {
          setProfile(result.data);
        }
      } catch (err) {
        console.error('Gagal memuat video profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getYouTubeId = (url?: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(profile?.linkYoutube);

  if (loading) {
    return (
      <section className="md:py-6">
        <div className="max-w-7xl py-6 rounded-lg mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-2xl md:text-5xl text-black font-bold text-left md:text-center"
          >
            Kegiatan Sekolah dalam Video
          </motion.h2>
          <p className="text-left md:text-center w-full mb-12 text-gray-500 mt-5">
            Memuat video...
          </p>
          <div className="max-w-7xl mx-auto">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (!videoId) {
    return (
      <section className="md:py-6">
        <div className="max-w-7xl py-6 rounded-lg mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-2xl md:text-5xl text-black font-bold text-left md:text-center"
          >
            Kegiatan Sekolah dalam Video
          </motion.h2>
          <p className="text-left md:text-center w-full mb-12 text-gray-500 mt-5">
            Video kegiatan sekolah belum tersedia
          </p>
          <div className="max-w-7xl mx-auto">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-lg">Tidak ada video saat ini</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <section className="md:py-6">
      <div className="max-w-7xl py-6 rounded-lg mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-2xl md:text-5xl text-black font-bold text-left md:text-center"
        >
          Kegiatan Sekolah dalam Video
        </motion.h2>
        <p className="text-left md:text-center w-full mb-12 text-gray-500 mt-5">
          {profile?.heroTitle || 'Kegiatan Sekolah SMAN 25 Jakarta'}
        </p>

        <div className="max-w-7xl mx-auto">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={`Video dari ${profile?.schoolName || 'SMAN 25 Jakarta'}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const InstagramFeedSection = ({ theme }: any) => {
  // Data post sesuai konten yang diberikan (statis, karena tidak ada akun IG resmi)
  const posts = [
   {
      username: "sman25jkt_official",
      profilePic: "/logo.jpg", // Ganti dengan foto profil sekolah jika ada
      media: "/feed2.jpg", // Foto Hari Guru
      type: "image",
      likes: 48,
      date: "25 November 2025",
      caption: "Peringatan Hari Guru Nasional, Setelah upacara hari Guru, pemberian ucapan Selamat hari Guru oleh komite SMAN 25. Pemotongan kue dan tumpeng, dilanjutkan lomba tumpeng diikuti seluruh kelas X,XI dan XII #Bangsa yang besar adalah bangsa yang menghargai jasa para Pahlawan, Guru adalah pahlawan tanpa tanda Jasa , Guru Hebat Indonesia Kuat#Selamat Hari Guru Nasional 25 November 2025 untuk semua Guru dimanapun berada#Tetaplah berkarya untuk menghasilkan Generasi Emas Indonesia",
      // comments: 5, // Estimasi
      link: "https://www.instagram.com/p/DReriL1kjS_/",
    },
    {
      username: "sman25jkt_official",
      profilePic: "/logo.jpg",
      media: "/feed1.png", // Foto pengambilan raport
      type: "image",
      likes: 36,
      date: "19 Desember 2025",
      caption: "Gerakan ayah mengambil raport kelas X,,XI dan XII #wujudkan tanggungjawab orangtua terhadap anak#Selesai sudah pengambilan raport semester Gasal 2025/2026, terimakasih Anak2, Bapak/Ibu guru yang telah bekerja sama sehingga KBM berjalan lancar semester ini, semoga prestasi Siswa/i SMAN 25 Jakarta semakin baik semester berikutnya, aamiin..#Selamat Libur Semester Ganjil 22 Desember 2025 - 4 Januari 2026#Sampai jumpa semester depan dengan Prestasi yang lebih baik lagi..",
      // comments: 8,
      link: "https://www.instagram.com/p/DSb6tUsEjzt/",
    },
    {
      username: "sman25jkt_official",
      profilePic: "/logo.jpg",
      media: "/feed.mp4", // Reel video
      type: "video",
      likes: 12,
      date: "05 Januari 2026",
      caption: "Besok kembali ke sekolah..semangat anak2",
      // comments: 3,
      link: "https://www.instagram.com/reel/DTF2DgfEqXi/",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-left md:text-center mb-12"
          style={{ color: theme.primaryText }}
        >
          Kegiatan Terbaru di Media Sosial
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.a
              key={i}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col hover:brightness-[90%] transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-white p-0.5">
                      <img src={post.profilePic} alt={post.username} className="w-full h-full rounded-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-black">{post.username}</p>
                    <p className="text-xs text-gray-500">{post.date}</p>
                  </div>
                </div>
                <button className="text-2xl">⋯</button>
              </div>

              {/* Media (Image or Video) */}
              <div className="aspect-square overflow-hidden relative">
                {post.type === "video" ? (
                  <video controls className="w-full h-full object-cover">
                    <source src={post.media} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={post.media} alt="Post" className="w-full h-full object-cover" />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-4xl">{post.type === "video" ? "▶️" : "📸"}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-5 text-2xl">
                  <span>❤️</span>
                  <span>💬</span>
                  <span>📤</span>
                </div>
                <span>🔖</span>
              </div>

              {/* Likes & Caption */}
              <div className="px-4 pb-4 text-black">
                <p className="font-bold text-sm">{post.likes} suka</p>
                <p className="text-sm leading-normal text-left mt-4 mb-4 line-clamp-4 text-gray-600">
                  <span className="font-bold">{post.username}</span> {post.caption}
                </p>
                {/* <p className="text-sm text-gray-500 mt-2">Lihat semua {post.comments} komentar</p> */}
                <p className="text-xs text-gray-400 mt-3">Lihat di Instagram →</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

// === STATS BAR ===
const StatsBar = () => {
  const { data: stats = [], isPending, error } = useStats();

  // Daftar icon sesuai urutan stats (sesuaikan dengan data stats kamu)
  const icons = [
      <UserCheck className="w-12 h-12 md:w-12 md:h-12 p-3 rounded-md bg-green-600 text-white" />,     // Kehadiran
      <UserX className="w-12 h-12 md:w-12 md:h-12 p-3 rounded-md bg-red-600 text-white" />,           // Alpha
      <Thermometer className="w-12 h-12 md:w-12 md:h-12 p-3 rounded-md bg-orange-600 text-white" />,  // Sakit
      <FileCheck className="w-12 h-12 md:w-12 md:h-12 p-3 rounded-md bg-blue-600 text-white" />,      // Izin
  ];

  if (isPending) return <div className="py-6 text-center">Loading stats...</div>;
  if (error) return <div className="py-6 text-red-400 text-center">Error: {error.message}</div>;

  return (
    <section id="stats" className="w-full md:w-7xl px-2 md:px-16 rounded-2xl mx-auto relative py-6 mt-[-60px] h-max">
      <div className="w-full mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6">
          {stats.map((s: any, i: number) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl px-6 border shadow-lg h-[110px] bg-white pb-0 border-gray-300 flex flex-col items-start justify-center"
            >
              <div className="flex items-center gap-6 relative mt-1">
                {/* Icon */}
                <div className="text-black h-full w-[30%] opacity-80">
                  {icons[i] || null} {/* fallback null jika urutan tidak cocok */}
                </div>
                <div className="flex flex-col h-max items-start gap-2 text-xl md:text-2xl font-bold" style={{ color: 'black' }}>
                  {/* Label */}
                  <div className="text-xs md:text-[16px] w-max opacity-80" style={{ color: 'black' }}>
                    {s.k}
                  </div>
                  <div className="w-max flex items-center gap-2">
                    {s.v} 
                    <p className="text-sm font-normal text-gray-500">
                      Orang
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const useComments = (schoolId: number) => {   // parameter tetap number
  const API_BASE = 'https://be-school.kiraproject.id';

  const query = useQuery({
    queryKey: ['comments', schoolId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/rating?schoolId=${schoolId}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Gagal memuat komentar');
      return data.data || [];
    },
    staleTime: 2 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async (newComment: { name: string; email: string; comment: string; rating: number }) => {
      const res = await fetch(`${API_BASE}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...newComment,
          schoolId,              
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Gagal mengirim komentar');
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', schoolId] });
    },
  });

  return { ...query, mutate: mutation.mutate, isSubmitting: mutation.isPending };
};

const CommentSection = () => {
  const schoolId = 88;  // ← number, bukan string "88"

  const { data: comments = [], isPending, error } = useComments(schoolId);
  const { mutate, isSubmitting } = useComments(schoolId);

  const [form, setForm] = useState({
    name: '',
    email: '',
    comment: '',
    rating: 5,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value: number) => {
    setForm(prev => ({ ...prev, rating: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) {
      alert('Nama dan komentar wajib diisi');
      return;
    }

    // Catatan: userId sementara kita hardcode atau bisa ambil dari auth nanti
    mutate({
      email: form.email.trim() || 'anonymous@example.com',
      name: form.name.trim(),
      comment: form.comment.trim(),
      rating: form.rating,
    }, {
      onSuccess: () => {
        setForm({ name: '', email: '', comment: '', rating: 5 });
        alert('Terima kasih atas ulasan Anda!');
      },
      onError: (err: any) => {
        alert('Gagal mengirim: ' + (err.message || 'Unknown error'));
      }
    });
  };

  const averageRating = comments.length > 0
    ? (comments.reduce((sum: number, c: any) => sum + Number(c.rating), 0) / comments.length).toFixed(1)
    : '0.0';

  return (
    <section className="py-12 md:pt-16 pb-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: 'black' }}>
          Ulasan & Rating
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Rating rata-rata: <span className="font-bold text-2xl text-yellow-600">{averageRating} ★</span> 
          <span className="ml-2">
            ({comments.length} ulasan)
          </span>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border mb-12">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-black text-sm font-medium mb-2">Nama</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full text-black px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label className="block text-black text-sm font-medium mb-2">Email (opsional)</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 text-black py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@contoh.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-black text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star: any) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`text-3xl transition-colors ${
                    star <= form.rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-500`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-black text-sm font-medium mb-2">Komentar / Saran</label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 text-black py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tuliskan pengalaman atau saran Anda..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
          </button>
        </form>
      </div>
    </section>
  );
};

interface Sponsor {
  id: number;
  name: string;
  imageUrl?: string | null;
}

const SponsorMarqueeSection = () => {
  const schoolId = "88";

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) return;

    const fetchSponsors = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://be-school.kiraproject.id/partner?schoolId=${schoolId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Gagal memuat sponsor");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSponsors(json.data);
        }
      } catch (err) {
        console.error("Error fetch sponsor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, [schoolId]);

  // Duplikat data agar terlihat seamless infinite loop
  const duplicatedSponsors = [...sponsors, ...sponsors];

  if (loading || sponsors.length === 0) {
    return null; 
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
          Mitra & Sponsor Kami
        </h2>

        <div className="relative mt-16">
          {/* Marquee container */}
          <div
            className="flex animate-marquee hover:pause-marquee whitespace-nowrap"
            style={{
              animation: "marquee 30s linear infinite",
            }}
          >
            {duplicatedSponsors.map((sponsor, index) => (
              <div
                key={`${sponsor.id}-${index}`}
                className="flex-shrink-0 mx-2 flex flex-col items-center justify-center"
                style={{ minWidth: "200px" }}
              >
                {sponsor.imageUrl ? (
                  <img
                    src={sponsor.imageUrl}
                    alt={sponsor.name}
                    className="h-20 md:h-24 w-auto object-contain transition-all duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-16 md:h-20 w-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                    Logo
                  </div>
                )}
                {/* <p className="mt-3 text-sm text-gray-600 font-medium text-center">
                  {sponsor.name}
                </p> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animasi */}
      <style jsx global>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .pause-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

// Page utama
const Page = ({ theme, onTenantChange, currentKey }: any) => (
  <div className="min-h-screen bg-white">
    <NavbarComp theme={theme} onTenantChange={onTenantChange} currentKey={currentKey} />
    <Hero />
    {/* <StatsBar theme={theme} /> */}
    <SambutanSection />
    <FasilitasSection />
    <VideoSection />
    <PengurusSection />
    <BeritaComp />
    <GalleryComp />
    <InstagramFeedSection theme={theme} />
    <CommentSection />
    <SponsorMarqueeSection />
    <FooterComp theme={theme} />
  </div>
);

const Homepage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const [key, setKey] = useState(schoolInfo.fullName);
  const theme = schoolInfo.theme;

  useEffect(() => {
    queryClient.invalidateQueries();
  }, [key]);

  return <Page theme={theme} onTenantChange={setKey} currentKey={key} />;
};

export default Homepage;

// Tema dominan biru tua
export const SMAN25_THEME = {
  primary: "#1e3a8a",
  accent: "#fcd34d",
} as const;