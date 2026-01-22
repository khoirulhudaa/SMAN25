import { SMAN25_CONFIG } from '@/core/theme';
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";

/****************************
 * HERO SECTION
 ****************************/
const HeroSection = () => {
  const scrollToContent = () => {
    document.querySelector("main")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/alumnus.jpg')`,
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
          Buku Alumni
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Jejaring alumni SMAN 25 Jakarta – temukan teman seangkatan dan inspirasi karier
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
          Telusuri Alumni
        </motion.button>
      </div>
    </section>
  );
};

/****************************
 * PLACEHOLDER AVATAR
 ****************************/
const PLACEHOLDER_AVATAR = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="320">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="%23a7c7ff"/>
      <stop offset="1" stop-color="%23f2c94c"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="%230B1733"/>
  <rect x="8" y="8" width="384" height="304" rx="18" fill="url(%23g)" fill-opacity="0.18"/>
  <circle cx="200" cy="130" r="58" fill="%23ffffff" fill-opacity="0.18"/>
  <rect x="90" y="220" width="220" height="16" rx="8" fill="%23ffffff" fill-opacity="0.14"/>
</svg>
`);

/****************************
 * TYPES
 ****************************/
interface AlumniItem {
  id: string;
  name: string;
  graduationYear: number | string;
  description?: string;
  photoUrl?: string;
  angkatan: string;
  title?: string;
  handle?: string;
  likes: number;
  liked: boolean;
  thumbs: number;
  thumbed: boolean;
  shares: number;
  shared: boolean;
}

/****************************
 * INLINE PROFILE CARD (sederhana)
 ****************************/
const InlineProfileCard: React.FC<{
  avatarUrl: string;
  name: string;
  title?: string;
  angkatan: string;
  description?: string;
  theme: any;
}> = ({ avatarUrl, name, title, angkatan }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden border border-blue-300 rounded-2xl shadow-xl h-[380px]"
      // whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={avatarUrl || PLACEHOLDER_AVATAR}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => (e.currentTarget.src = PLACEHOLDER_AVATAR)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-sm opacity-90 mt-1">Angkatan {angkatan}</p>
        {title && <p className="text-sm mt-2 opacity-80">{title}</p>}
        {/* {description && (
          <p className="text-xs mt-3 line-clamp-3 opacity-75">{description}</p>
        )} */}
      </div>
    </motion.div>
  );
};

/****************************
 * MAIN COMPONENT - Buku Alumni
 ****************************/
const API_BASE_URL = "https://be-school.kiraproject.id";
const SCHOOL_ID = 88; 

const registerAlumniSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  graduationYear: z.string().regex(/^\d{4}$/, "Tahun harus 4 digit (contoh: 2023)"),
  major: z.string().min(2, "Jurusan asal wajib diisi").optional(),
  description: z.string().max(500, "Maksimal 500 karakter").optional(),
});

type RegisterAlumniForm = z.infer<typeof registerAlumniSchema>;

export function BukuAlumni() {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;

  const [alumniData, setAlumniData] = useState<AlumniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterAlumniForm>({
    resolver: zodResolver(registerAlumniSchema),
  });

  // Fetch data alumni
  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/alumni?schoolId=${SCHOOL_ID}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (!json.success || !Array.isArray(json.data)) {
        throw new Error('Format response tidak valid');
      }

      // ── Optimasi utama di sini ───────────────────────────────
      const mapped = json.data.map((item) => {
        const description = item.description || '';
        const parts = description.split(/[\r\n]+/);

        const title = parts[0]?.trim() || 'Alumni';
        const desc = parts[1]?.trim() || '';

        return {
          id: String(item.id),
          name: item.name || 'Tanpa Nama',
          graduationYear: item.graduationYear || '—',
          description, // tetap simpan full text kalau perlu di tempat lain
          photoUrl: item.photoUrl || PLACEHOLDER_AVATAR,
          angkatan: item.graduationYear != null ? String(item.graduationYear) : '—',
          title,
          desc,
          handle: (item.name || '').toLowerCase().replace(/\s+/g, '.'),
          // nilai default yang sering berulang → bisa di luar map kalau mau hemat memori
          likes: 0,
          liked: false,
          thumbs: 0,
          thumbed: false,
          shares: 0,
          shared: false,
        };
      });

      setAlumniData(mapped);
    } catch (err) {
      console.error('Fetch alumni error:', err);
      setError('Gagal memuat data alumni. Silakan coba lagi nanti.');
      setAlumniData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  // Handle upload foto + preview
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Submit registrasi
  const onRegisterAlumni = async (data: RegisterAlumniForm) => {
    setRegisterLoading(true);
    setRegisterError(null);
    setRegisterSuccess(false);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("graduationYear", data.graduationYear);

      // Gabungkan major ke description jika ada
      let desc = data.description || "";
      if (data.major) {
        desc = `Jurusan asal: ${data.major}${desc ? `\n\n${desc}` : ''}`;
      }
      if (desc) formData.append("description", desc);

      formData.append("schoolId", String(SCHOOL_ID));

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const res = await fetch(`${API_BASE_URL}/alumni`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Gagal mendaftarkan alumni");
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Registrasi gagal");

      setRegisterSuccess(true);

      // Reset form & tutup modal setelah 1.5 detik
      setTimeout(() => {
        reset();
        setPhotoFile(null);
        setPhotoPreview(null);
        setShowRegisterModal(false);
        fetchAlumni(); // Refresh data
      }, 1500);
    } catch (err: any) {
      setRegisterError(err.message || "Terjadi kesalahan");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />
      <HeroSection />

      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'black' }}>
              Buku Alumni {schoolInfo.fullName}
            </h1>
            <p className="text-lg text-gray-600">
              Menampilkan {alumniData.length} alumni terdaftar
            </p>
          </div>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2.5 rounded-md bg-blue-600 font-normal text-white text-md shadow-lg hover:shadow-xl transition-all"
            style={{ background: theme.gold }}
          >
            + Daftar sebagai Alumni
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : alumniData.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-lg">
            Belum ada data alumni.<br />
            Jadilah yang pertama mendaftar!
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {alumniData.map((alumni) => (
              <InlineProfileCard
                key={alumni.id}
                avatarUrl={alumni.photoUrl || PLACEHOLDER_AVATAR}
                name={alumni.name}
                title={alumni.title}
                angkatan={alumni.angkatan}
                description={alumni.description}
                theme={theme}
              />
            ))}
          </div>
        )}
      </main>

      {/* MODAL REGISTRASI */}
      <AnimatePresence>
        {showRegisterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowRegisterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="relative w-[94vw] md:w-[80vw] h-max bg-white rounded-lg shadow-2xl overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8">
                <h2 className="md:flex hidden text-2xl md:text-2xl text-black font-bold mb-8 text-left">
                  Daftar sebagai Alumni SMAN 25
                </h2>

                <form onSubmit={handleSubmit(onRegisterAlumni)} className="gap-5 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("name")}
                      className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Nama lengkap Anda"
                    />
                    {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>}
                  </div>

                  <div className='w-full gap-3 flex items-center'>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Tahun Kelulusan <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("graduationYear")}
                        className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="Contoh: 2023"
                        maxLength={4}
                      />
                      {errors.graduationYear && (
                        <p className="mt-1.5 text-sm text-red-600">{errors.graduationYear.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Jurusan
                      </label>
                      <input
                        {...register("major")}
                        className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="Contoh: IPA, IPS, Bahasa"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Deskripsi / Pencapaian Saat Ini (opsional)
                    </label>
                    <input
                      {...register("description")}
                      className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition"
                      placeholder="Ceritakan sedikit tentang diri Anda saat ini..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto Profil (opsional)
                    </label>

                    <div className="items-start flex flex-col gap-3">
                      {photoPreview ? (
                        <div className="relative">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-md border-4 border-gray-200 shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoFile(null);
                              setPhotoPreview(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow text-lg font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300">
                          <span className="text-gray-400 text-sm text-center px-4">Foto Profil</span>
                        </div>
                      )}

                      <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-6 py-3 rounded-lg border border-blue-700 transition font-medium">
                        Pilih Foto
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
                      </label>
                    </div>
                  </div>

                  {registerError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                      {registerError}
                    </div>
                  )}

                  {registerSuccess && (
                    <div className="bg-green-50 h-max border border-green-200 text-green-700 p-4 rounded-lg text-center font-medium">
                      Registrasi berhasil! Terima kasih telah bergabung.
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:flex nd:justify-end md:w-max md:absolute md:bottom-4 md:right-4 items-center gap-4 md:mt-8">
                    <button
                      type="button"
                      onClick={() => setShowRegisterModal(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition"
                      disabled={registerLoading}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={registerLoading}
                      className="px-8 py-3 justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60 flex items-center gap-3"
                    >
                      {registerLoading && (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      <p className='w-max'>
                        Daftar
                      </p>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterComp theme={theme} />
    </div>
  );
}