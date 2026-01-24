// components/Navbar.jsx
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Theme Tokens for Multiple Schools
const THEME_TOKENS = {
  sman25: {
    name: "SMAN 25 JAKARTA",
    "--brand-primary": "#457B9D",
    "--brand-primaryText": "#ffffff",
    "--brand-accent": "#F4A261",
    "--brand-bg": "#E5E7EB",
    "--brand-surface": "#ffffff",
    "--brand-surfaceText": "#1F2937",
    "--brand-subtle": "#9CA3AF",
    "--brand-pop": "#DC2626",
  }
};

// Get theme based on domain
const getThemeKey = () => {
  return "sman25"; // Default
};

// Shim Link (ganti dengan next/link bila pakai Next.js)
const Link = ({ href, className, style, children, target, rel }) => (
  <a href={href} className={className} style={style} target={target} rel={rel}>
    {children}
  </a>
);

// Hook click-outside
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || (e.target instanceof Node && ref.current.contains(e.target))) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// Hook untuk ambil profil sekolah (sama seperti di homepage)
const useSchoolProfile = () => {
  const schoolId = 25; // ← sesuaikan dengan ID sekolah SMAN 25 di database

  const API_BASE = 'https://be-school.kiraproject.id';
  // ? 'http://localhost:5005' 
  // : 'https://be-school.kiraproject.id';

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

// === DATA NAVIGASI ===
const NAV = [
  {
    label: "Profil Sekolah",
    children: [
      { label: "Halaman Utama", href: "/halaman-utama" },
      { label: "Sambutan", href: "/sambutan" },
      { label: "Visi & Misi", href: "/visiMisi" },
      { label: "Galeri", href: "/galeri" },
      { label: "Sejarah", href: "/sejarah" },
      // { label: "Struktur", href: "/struktur" },
    ],
  },
  {
    label: "Akademik",
    children: [
      { label: "Prestasi", href: "/prestasi" },
      { label: "Kurikulum", href: "/kurikulum" },
      { label: "Kalender", href: "/kalender" },
      { label: "Jadwal", href: "/jadwal" },
      { label: "Guru & Tendik", href: "/guru-tendik" },
    ],
  },
  { label: "Program", href: "/program" },
  {
    label: "Kegiatan",
    children: [
      { label: "OSIS", href: "/osis" },
      { label: "Ekstrakurikuler", href: "/ekstrakulikuler" },
      { label: "Pramuka", href: "/pramuka" },
    ],
  },
  { label: "Perpus", href: "/perpustakaan" },
  {
    label: "Informasi",
    children: [
      { label: "Pengumuman", href: "/pengumuman" },
      { label: "Berita", href: "/berita" },
      // { label: "Agenda", href: "/agenda" },
      { label: "Buku Alumni", href: "/buku-alumni" },
      { label: "PPDB", href: "/ppdb" },
      { label: "PPID", href: "/ppid" },
      { label: "Layanan", href: "/layanan" },
      // { label: "Kelulusan", href: "/kelulusan" },
    ],
  },
];

// === PPDB PERIOD ===
const PPDB_PERIOD = {
  start: new Date("2025-05-01T00:00:00+07:00"),
  end: new Date("2025-07-31T23:59:59+07:00"),
};
const isWithinPeriod = (now, { start, end }) => now >= start && now <= end;

// === LOGIN MENU ===
const LoginMenu = ({ theme }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  const items = [
    { label: "Admin", href: "https://admin.kiraproject.id/auth/login" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        className="text-sm font-medium rounded-lg bg-blue-500 gap-3 text-white px-3 py-2 flex items-center"
        style={{ background: theme.accent, color: "white" }}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <p className="uppercase">Login</p>
        <ChevronDown className="w-[14px]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 mt-2 border uppercase border-blue-700 w-48 rounded-lg shadow-2xl p-2 bg-white"
            style={{ borderColor: theme.subtle }}
            role="menu"
          >
            {items.map((i) => (
              <Link
                key={i.label}
                href={i.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-lg uppercase text-sm hover:bg-black/5"
                style={{ color: "black" }}
                role="menuitem"
              >
                {i.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// === DROPDOWN (Desktop) ===
const NavDropdown = ({ item, theme }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));
  const hasChild = Array.isArray(item.children) && item.children.length > 0;

  if (!hasChild) {
    const isRoute = typeof item.href === "string" && item.href.startsWith("/");
    return isRoute ? (
      <Link
        href={item.href}
        className="text-sm px-1 w-max py-1 uppercase hover:underline"
        style={{ color: 'black' }}
      >
        {item.label}
      </Link>
    ) : (
      <a
        href={item.href}
        className="text-sm px-1 w-max py-1 uppercase hover:underline"
        style={{ color: 'black' }}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="text-sm px-1 py-1 w-max uppercase flex items-center gap-1"
        style={{ color: 'black' }}
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <span aria-hidden>
          <ChevronDown className="w-[14px]" />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 mt-2 w-44 rounded-xl uppercase border shadow-xl p-2"
            style={{ background: "rgba(16,23,71,0.9)", borderColor: theme.subtle }}
          >
            {item.children.map((c) => {
              const isRoute = typeof c.href === "string" && c.href.startsWith("/");
              return isRoute ? (
                <Link
                  key={c.label}
                  href={c.href}
                  className="block px-3 py-2 rounded-lg text-sm uppercase hover:bg-white/10"
                  style={{ color: 'white' }}
                >
                  {c.label}
                </Link>
              ) : (
                <a
                  key={c.label}
                  href={c.href}
                  className="block px-3 py-2 rounded-lg text-sm uppercase hover:bg-white/10"
                  style={{ color: 'black' }}
                >
                  {c.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// === MOBILE ACCORDION ===
const MobileAccordion = ({ item, theme }) => {
  const [open, setOpen] = useState(false);
  const hasChild = Array.isArray(item.children) && item.children.length > 0;

  if (!hasChild) {
    const isRoute = typeof item.href === "string" && item.href.startsWith("/");
    return isRoute ? (
      <Link
        href={item.href}
        className="block px-4 py-3 rounded-lg uppercase hover:bg-white/10 transition-colors"
        style={{ color: 'white' }}
      >
        {item.label}
      </Link>
    ) : (
      <a
        href={item.href}
        className="block px-4 py-3 rounded-lg uppercase hover:bg-white/10 transition-colors"
        style={{ color: 'white' }}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center uppercase justify-between px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
        style={{ color: 'white' }}
      >
        <span>{item.label}</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden pl-4"
          >
            {item.children.map((c) => {
              const isRoute = typeof c.href === "string" && c.href.startsWith("/");
              return isRoute ? (
                <Link
                  key={c.label}
                  href={c.href}
                  className="block px-4 py-2 uppercase rounded-lg text-sm hover:bg-white/5 transition-colors mt-1"
                  style={{ color: 'white' }}
                >
                  {c.label}
                </Link>
              ) : (
                <a
                  key={c.label}
                  href={c.href}
                  className="block px-4 py-2 uppercase rounded-lg text-sm hover:bg-white/5 transition-colors mt-1"
                  style={{ color: 'white' }}
                >
                  {c.label}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// === MOBILE MENU HOOK ===
const useMobileMenu = (isOpen, onClose) => {
  const ref = useRef(null);
  useOnClickOutside(ref, onClose);
  return ref;
};

// === NAVBAR COMPONENT (FULLY INDEPENDENT) ===
export const NavbarComp = ({ theme = {}, onTenantChange = () => {}, currentKey = "smkn13" }) => {
  const themeKey = getThemeKey();
  const safeTheme = THEME_TOKENS[themeKey] || THEME_TOKENS.smkn13;
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useMobileMenu(mobileOpen, () => setMobileOpen(false));

  // Ambil data profil sekolah
  const { data: profile, isPending } = useSchoolProfile();

  // Filter PPDB jika tidak aktif (kode asli tetap)
  const navItems = NAV.map((it) =>
    it.children
      ? {
          ...it,
          // children: it.children.filter((c) => c.label !== "PPDB" || ppdbActive),
        }
      : it
  );

  // Notify parent of tenant change
  useEffect(() => {
    if (themeKey !== currentKey) {
      onTenantChange(themeKey);
    }
  }, [themeKey, currentKey, onTenantChange]);

  return (
    <>
      <header className="w-full text-xs px-16 uppercase font-normal bg-blue-500 text-white hidden md:flex items-center justify-center p-3">
        {isPending ? (
          <p className="animate-pulse">Memuat informasi sekolah...</p>
        ) : profile ? (
          <p>
            {profile.phone || "+62 21 1234 5678"} • {profile.email || "info@sman25-jkt.sch.id"} • {profile.address || "Jakarta, Jalan A.M Sangaji No. 22-24 Petojo Utara Gambir"}
          </p>
        ) : (
          <p>
            +62 21 1234 5678 • info@sman25-jkt.sch.id • Jakarta, Jalan A.M Sangaji No. 22-24 Petojo Utara Gambir
          </p>
        )}
      </header>

      {/* Header (Desktop + Mobile) */}
      <div
        className="w-full sticky top-0 z-[4] backdrop-blur shadow-xl justify-between bg-white"
      >
        <div className="max-w-7xl mx-auto md:px-1">
          <div className="w-full flex items-center justify-between px-5 md:px-0 py-3 md:py-4">
            {/* Logo */}
            <div className="flex items-center gap-2 w-[30%]">
              <div className="leading-none flex gap-4 items-center">
                <div
                  className="flex items-center gap-3 text-md w-max md:text-lg font-semibold"
                  style={{ color: 'black' }}
                >
                  <img src="/logoMain.jpg" alt="logo SMAN 25 JKT" className="w-10 h-10" />
                  {safeTheme.name}
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex uppercase items-center w-max gap-6 xl:gap-8">
              {navItems.map((item) => (
                <NavDropdown key={item.label} item={item} theme={safeTheme} />
              ))}
            </div>

            {/* Login + Mobile Toggle */}
            <div className="flex items-center w-[30%] uppercase justify-end gap-4">
              <LoginMenu theme={safeTheme} />
              <button
                className="md:hidden inline-flex items-center justify-center flex-col gap-1 w-14 h-14"
                aria-label="Menu"
                onClick={() => setMobileOpen((v) => !v)}
                style={{ borderColor: safeTheme.subtle, color: 'black' }}
              >
                <div className="w-[20px] h-[2px] bg-black"></div>
                <div className="w-[20px] h-[2px] bg-black"></div>
                <div className="w-[20px] h-[2px] bg-black"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 lg:hidden z-[99999999999]"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              ref={mobileRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed left-0 top-0 h-full w-[100vw] bg-[rgba(16,23,71,0.98)] border-r shadow-2xl p-4 z-[9999999999999] lg:hidden overflow-y-auto"
              style={{ borderColor: safeTheme.subtle }}
            >
              <div className="flex items-center justify-between mb-10 border-b border-white pb-8 pt-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-2xl flex items-center justify-center font-bold text-lg"
                    style={{ background: safeTheme.accent, color: "white" }}
                  >
                    {themeKey === "smkn13" ? "13" : themeKey.replace("sman", "")}
                  </div>
                  |
                  <div
                    className="text-lg font-semibold ml-1"
                    style={{ color: safeTheme.primaryText }}
                  >
                    Menu
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl bg-white text-red-600 w-9 h-9 flex items-center justify-center rounded-md"
                  style={{ color: safeTheme.primaryText }}
                  aria-label="Tutup Menu"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <MobileAccordion key={item.label} item={item} theme={safeTheme} />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarComp;