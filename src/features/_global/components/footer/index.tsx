// components/FooterComp.jsx

const SITE_SINCE = Number.parseInt(
  (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_SITE_SINCE) || "2025",
  10
);

// Extended THEMES object with all schools
const THEMES = {
  smkn13: {
    name: "SMKN 13 Jakarta",
    primary: "#1F3B76",
    primaryText: "#ffffff",
    accent: "#F2C94C",
    bg: "#0B1733",
    surface: "#102347",
    surfaceText: "#ffffff",
    subtle: "#2C3F6B",
    pop: "#E63946",
  },
  sman25: {
    name: "SMAN 25 Jakarta",
    primary: "#457B9D",
    primaryText: "#ffffff",
    accent: "#F4A261",
    bg: "#E5E7EB",
    surface: "#ffffff",
    surfaceText: "#1F2937",
    subtle: "#9CA3AF",
    pop: "#DC2626",
  },
  sman65: {
    name: "SMAN 65 Jakarta",
    primary: "#2A9D8F",
    primaryText: "#ffffff",
    accent: "#E9C46A",
    bg: "#F4F4F4",
    surface: "#ffffff",
    surfaceText: "#264653",
    subtle: "#A3BFFA",
    pop: "#EF4444",
  },
  sman68: {
    name: "SMAN 68 Jakarta",
    primary: "#1F3B76",
    primaryText: "#ffffff",
    accent: "#F2C94C",
    bg: "#0B1733",
    surface: "#102347",
    surfaceText: "#ffffff",
    subtle: "#2C3F6B",
    pop: "#E63946",
  },
  sman78: {
    name: "SMAN 78 Jakarta",
    primary: "#6B7280",
    primaryText: "#ffffff",
    accent: "#FBBF24",
    bg: "#111827",
    surface: "#1F2937",
    surfaceText: "#F3F4F6",
    subtle: "#374151",
    pop: "#EF4444",
  },
  default: {
    name: "Default",
    primary: "#0E7490",
    primaryText: "#ffffff",
    accent: "#f59e0b",
    bg: "#f8fafc",
    surface: "#ffffff",
    surfaceText: "#0f172a",
    subtle: "#e2e8f0",
    pop: "#ef4444",
  },
};

// Get theme key based on domain
const getThemeKey = () => {
  const hostname = typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";

  // === SMKN 13 ===
  if (
    hostname.includes("smkn13jkt.kiraproject.id") ||
    hostname.includes("smkn13jakarta.sch.id") ||  // TAMBAHAN
    hostname === "localhost"
  ) return "smkn13";

  // === SMAN 25 ===
  if (
    hostname.includes("new.sman25-jkt.sch.id") ||
    hostname.includes("sman25jakarta.sch.id")  // TAMBAHAN
  ) return "sman25";

  // === SMAN 65 ===
  if (
    hostname.includes("new.sman65-jkt.sch.id") ||
    hostname.includes("sman65jakarta.sch.id")  // TAMBAHAN
  ) return "sman65";

  // === SMAN 68 ===
  if (
    hostname.includes("new.sman68-jkt.sch.id") ||
    hostname.includes("sman68jakarta.sch.id")  // TAMBAHAN
  ) return "sman68";

  // === SMAN 78 ===
  if (
    hostname.includes("new.sman78-jkt.sch.id") ||
    hostname.includes("sman78jakarta.sch.id")  // TAMBAHAN
  ) return "sman78";

  return "smkn13"; // Fallback to default theme
};

// Apply theme globally (optional, if not already applied elsewhere)
if (typeof document !== "undefined") {
  const theme = THEMES[getThemeKey()];
  document.documentElement.style.cssText = Object.entries(theme)
    .map(([k, v]) => `--${k}: ${v};`)
    .join("");
}

export const FooterComp = ({ theme }) => {
  const themeKey = getThemeKey();
  const safeTheme = THEMES[themeKey] || THEMES.default;
  // Determine school type for subtitle
  const schoolType = themeKey === "smkn13" ? "Sekolah Menengah Kejuruan Negeri" : "Sekolah Menengah Atas Negeri";

  return (
    <footer className="mt-8">
      <div
        className="w-full bg-blue-500 mx-auto px-5 md:px-32 py-10 border-t"
        style={{ borderColor: safeTheme.subtle }}
      >
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-2 w-full">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold"
                style={{ background: safeTheme.accent, color: "#111827" }}
              >
                {25}
              </div>
              <div>
                <div
                  className="text-base font-semibold"
                  style={{ color: safeTheme.primaryText }}
                >
                  {"SMAN 25 JAKARTA"}
                </div>
                <div
                  className="text-xs opacity-80"
                  style={{ color: safeTheme.primaryText }}
                >
                  {schoolType}
                </div>
              </div>
            </div>
            <p
              className="mt-3 text-sm opacity-85 w-[70%]"
              style={{ color: safeTheme.primaryText }}
            >
              Mewujudkan lulusan yang berkarakter profil pelajar pancasila, berbudaya dan berdaya saing global yang inklusif
            </p>
          </div>
          <div>
            <div
              className="text-sm font-semibold mb-2"
              style={{ color: safeTheme.primaryText }}
            >
              Tautan
            </div>
            <ul className="text-sm space-y-4" style={{ color: safeTheme.primaryText }}>
              <li>
                <a href="/sambutan" target="_blank">
                  Profil
                </a>
              </li>
              <li>
                <a href="/pengumuman" target="_blank">
                  Pengumuman
                </a>
              </li>
              <li>
                <a href="/galeri" target="_blank">
                  Galeri
                </a>
              </li>
              <li>
                <a href="/layanan" target="_blank">
                  Layanan
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div
              className="text-sm font-semibold mb-2"
              style={{ color: safeTheme.primaryText }}
            >
              Alamat
            </div>
            <div
              className="text-sm opacity-85"
              style={{ color: safeTheme.primaryText }}
            >
              {" Jalan A.M Sangaji No. 22-24 Petojo Utara Gambir RT.2/RW.5 2 5, RT.2/RW.5, Petojo Utara, Kecamatan Gambir, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10130"}
            </div>
          </div>
        </div>
        <div className="mt-8 flex border-t border-white pt-8 flex-col md:flex-row items-center justify-between gap-4">
          <div
            className="text-sm opacity-80"
            style={{ color: safeTheme.primaryText }}
          >
            © 2026 — {safeTheme.name}. All rights reserved.
          </div>
          <div
            className="text-xs"
            style={{ color: safeTheme.primaryText }}
          >
            Powered by <span className="font-semibold">Xpresensi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};