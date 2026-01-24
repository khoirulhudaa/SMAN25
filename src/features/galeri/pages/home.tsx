import { SMAN25_CONFIG } from "@/core/theme";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftCircle, ArrowRightCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

// HeroSection tetap sama seperti sebelumnya
const HeroSection = () => {
  const scrollToGallery = () => {
    document.getElementById("galeri-content")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[78vh] flex items-center justify-center z-[1] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/kgp2.jpeg')`,
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
          Galeri Kegiatan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 drop-shadow-lg"
        >
          Dokumentasi foto dan video kegiatan siswa, guru, dan sekolah SMAN 25 Jakarta
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          onClick={scrollToGallery}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          Lihat Album Galeri
        </motion.button>
      </div>
    </section>
  );
};

// CONFIG API (tetap dari versi sebelumnya)
const BASE_URL = "https://be-school.kiraproject.id";
// const BASE_URL = "http://localhost:5000";
const SCHOOL_ID = "25";

const getJsonHeaders = () => ({
  "Content-Type": "application/json",
});

const fetchAlbums = async () => {
  const res = await fetch(`${BASE_URL}/albums?schoolId=${SCHOOL_ID}&isActive=true`, {
    mode: 'cors', // Tambahkan ini
    headers: getJsonHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal mengambil album");
  const json = await res.json();
  console.log('json', json.data)
  if (!json.success) throw new Error(json.message || "API error");

  return (json.data || []).map((album: any) => ({
    ...album,
    coverUrl: album.coverUrl ? `${BASE_URL}${album.coverUrl}` : "/placeholder-album.jpg",
  }));
};

const fetchAlbumItems = async (albumId: string | number) => {
  const res = await fetch(`${BASE_URL}/gallery?albumId=${albumId}&isActive=true`, {
    headers: getJsonHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Gagal mengambil item");
  const json = await res.json();
  console.log('json item gallery:', json.data)
  if (!json.success) throw new Error(json.message || "API error");

  return (json.data || []).map((item: any) => ({
    id: item.id,
    title: item.title || "Foto kegiatan",
    description: item.description || "",
    date: item.createdAt || item.date || new Date().toISOString(),
    src: item.imageUrl ? `${BASE_URL}${item.imageUrl}` : "/placeholder.jpg",
  }));
};

// Hook useGallery (diperbarui untuk mendukung modal galeri penuh)
const useGallery = () => {
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchAlbums();
        setAlbums(data);
      } catch (err) {
        console.error(err);
        // Optional: fallback dummy jika perlu
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openAlbum = async (album: any) => {
    setSelectedAlbum(album);
    setCurrentIndex(0);
    setLoadingItems(true);

    try {
      const galleryItems = await fetchAlbumItems(album.id);
      setItems(galleryItems);
    } catch (err) {
      console.error("Gagal memuat item galeri:", err);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setItems([]);
    setCurrentIndex(0);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev >= items.length - 1 ? 0 : prev + 1));
  };

  const selectIndex = (index: number) => setCurrentIndex(index);

  return {
    albums,
    selectedAlbum,
    items,
    currentIndex,
    loading,
    loadingItems,
    openAlbum,
    closeAlbum,
    goPrev,
    goNext,
    selectIndex,
  };
};

const GalleryPage = () => {
  const { theme } = SMAN25_CONFIG;

  const {
    albums,
    selectedAlbum,
    items,
    currentIndex,
    loading,
    loadingItems,
    openAlbum,
    closeAlbum,
    goPrev,
    goNext,
    selectIndex,
  } = useGallery();

  const currentItem = items[currentIndex] || {};

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />
      <HeroSection />

      {/* Daftar Album */}
      <section id="galeri-content" className="py-20 md:py-28 -mt-12 relative z-[1]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: theme.primaryText }}>
              Galeri Kegiatan
            </h2>
            <p className="text-lg opacity-80 max-w-3xl mx-auto" style={{ color: theme.surfaceText }}>
              Koleksi dokumentasi kegiatan siswa, guru, dan sekolah SMAN 25 Jakarta
            </p>
          </motion.div>
        
          {loading ? (
            <div className="text-center py-20 text-xl">Memuat album...</div>
          ) : (
            <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {albums.map((album) => (
                <motion.div
                  key={album.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative border border-gray-300 rounded-2xl overflow-hidden shadow-2xl cursor-pointer bg-black/40"
                  onClick={() => openAlbum(album)}
                >
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    crossOrigin="anonymous"
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{album.title}</h3>
                    <p className="text-sm opacity-90">
                      {album.itemCount ?? "?"} foto
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====================== MODAL GALERI FULL ====================== */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
            onClick={closeAlbum}
          >
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/80 to-transparent">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedAlbum.title}
                </h2>
                <p className="text-white/70 text-sm md:text-base">
                  {items.length} foto • {new Date(selectedAlbum.createdAt || Date.now()).toLocaleDateString("id-ID")}
                </p>
              </div>
              <button
                onClick={closeAlbum}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center relative px-4 pb-4">
              {loadingItems ? (
                <div className="text-white text-xl">Memuat foto...</div>
              ) : items.length > 0 ? (
                <motion.img
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  src={currentItem.src}
                  alt={currentItem.title}
                  crossOrigin="anonymous"
                  className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="text-white text-xl">Tidak ada foto di album ini</div>
              )}

              {/* Navigasi Panah */}
              {items.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                  >
                    <ArrowLeftCircle size={40} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                  >
                    <ArrowRightCircle size={40} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {items.length > 0 && (
              <div className="relative z-10 bg-black/70 p-4 overflow-x-auto">
                <div className="flex gap-3 justify-center max-w-6xl mx-auto">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectIndex(index);
                      }}
                      className={`flex-shrink-0 w-20 md:w-28 h-16 md:h-20 rounded-lg overflow-hidden border-3 transition-all duration-200 ${
                        index === currentIndex
                          ? "border-white scale-110 shadow-lg"
                          : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <img
                        src={item.src}
                        alt="gambar"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <FooterComp theme={theme} />
    </div>
  );
};

export default GalleryPage;