// components/Navbar.jsx
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Theme Tokens for Multiple Schools
// Theme Tokens for Multiple Schools
const THEME_TOKENS = {
  sman25: {
    name: "SMAN 25 Jakarta",
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

// === DATA NAVIGASI ===
const NAV = [
  // { label: "Beranda", href: "/dashboard" },
  // { label: "Pramuka", href: "/pramuka" },
  {
    label: "Profil Sekolah",
    children: [
      { label: "Halaman Utama", href: "/dashboard" },
      { label: "Sambutan", href: "/sambutan" },
      { label: "Visi & Misi", href: "/visiMisi" },
      { label: "Galeri", href: "/galeri" },
      // { label: "Sejarah", href: "/sejarah" },
      // { label: "Struktur", href: "/struktur" },
    ],
  },
  // {
    //   label: "Akademik",
    //   children: [
      //     { label: "Kurikulum", href: "/kurikulum" },
  //     { label: "Kalender", href: "/kalender" },
  //     { label: "Jadwal", href: "/jadwal" },
  //     { label: "Guru & Tendik", href: "/guru-tendik" },
  //   ],
  // },
  { label: "Program", href: "/program" },
  {
    label: "Kegiatan",
    children: [
      { label: "OSIS", href: "/osis" },
      { label: "Ekstrakurikuler", href: "/ekstrakulikuler" },
      { label: "Prestasi", href: "/prestasi" },
    ],
  },
  { label: "Perpus", href: "/perpustakaan" },
  {
    label: "Informasi",
    children: [
      { label: "Pengumuman", href: "/pengumuman" },
      { label: "Berita", href: "/berita" },
      // { label: "Agenda", href: "/agenda" },
      // { label: "Buku Alumni", href: "/buku-alumni" },
      // { label: "PPDB", href: "/ppdb" },
      // { label: "PPID", href: "/ppid" },
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
        <p>Login</p>
        <ChevronDown className="w-[14px]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 mt-2 border border-blue-700 w-48 rounded-lg shadow-2xl p-2 bg-white"
            style={{ borderColor: theme.subtle }}
            role="menu"
          >
            {items.map((i) => (
              <Link
                key={i.label}
                href={i.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-lg text-sm hover:bg-black/5"
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
        className="text-sm px-1 w-max py-1 hover:underline"
        style={{ color: 'black' }}
      >
        {item.label}
      </Link>
    ) : (
      <a
        href={item.href}
        className="text-sm px-1 w-max py-1 hover:underline"
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
        className="text-sm px-1 py-1 w-max flex items-center gap-1"
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
            className="absolute left-0 mt-2 w-44 rounded-xl border shadow-xl p-2"
            style={{ background: "rgba(16,23,71,0.9)", borderColor: theme.subtle }}
          >
            {item.children.map((c) => {
              const isRoute = typeof c.href === "string" && c.href.startsWith("/");
              return isRoute ? (
                <Link
                  key={c.label}
                  href={c.href}
                  className="block px-3 py-2 rounded-lg text-sm hover:bg-white/10"
                  style={{ color: 'white' }}
                >
                  {c.label}
                </Link>
              ) : (
                <a
                  key={c.label}
                  href={c.href}
                  className="block px-3 py-2 rounded-lg text-sm hover:bg-white/10"
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
        className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
        style={{ color: 'white' }}
      >
        {item.label}
      </Link>
    ) : (
      <a
        href={item.href}
        className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
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
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
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
                  className="block px-4 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors mt-1"
                  style={{ color: 'white' }}
                >
                  {c.label}
                </Link>
              ) : (
                <a
                  key={c.label}
                  href={c.href}
                  className="block px-4 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors mt-1"
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
  const ppdbActive = isWithinPeriod(new Date(), PPDB_PERIOD);

  // Filter PPDB jika tidak aktif
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
      <header className="w-full text-xs px-16 font-normal bg-blue-500 tex-white hidden md:flex items-center justify-center p-3">
        <p>
          +1 (212)-695-1962info@sman25-jkt.sch.id, Jakarta, Jalan A.M Sangaji No. 22-24 Petojo Utara Gambir
        </p>
      </header>
      {/* Header (Desktop + Mobile) */}
      <div
        className="w-full sticky top-0 z-[4] backdrop-blur justify-between bg-white"
        // style={{ background: "rgba(0,0,0,0.25)", borderBottom: `1px solid ${safeTheme.subtle}` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-full flex items-center justify-between py-3 md:py-4">
            {/* Logo */}
            <div className="flex items-center gap-2 w-[30%]">
              <div className="leading-none flex gap-4 items-center">
                <div className="rounded-lg bg-blue-500 flex items-center justify-center text-white w-10 h-10 shadow-md">
                  25
                </div>
                <div
                  className="text-base md:text-lg font-semibold"
                  style={{ color: 'black' }}
                >
                  {safeTheme.name}
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center w-max gap-6 xl:gap-8">
              {navItems.map((item) => (
                <NavDropdown key={item.label} item={item} theme={safeTheme} />
              ))}
            </div>

            {/* Login + Mobile Toggle */}
            <div className="flex items-center w-[30%] justify-end gap-2">
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
              className="fixed left-0 top-0 h-full w-4/5 max-w-sm bg-[rgba(16,23,71,0.98)] border-r shadow-2xl p-4 z-[9999999999999] lg:hidden overflow-y-auto"
              style={{ borderColor: safeTheme.subtle }}
            >
              <div className="flex items-center justify-between mb-6 pt-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-2xl flex items-center justify-center font-bold text-xs"
                    style={{ background: safeTheme.accent, color: "white" }}
                  >
                    {themeKey === "smkn13" ? "13" : themeKey.replace("sman", "")}
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: safeTheme.primaryText }}
                  >
                    Menu
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl"
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