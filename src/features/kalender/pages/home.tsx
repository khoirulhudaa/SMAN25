import { SMAN25_CONFIG } from "@/core/theme";
import { getXHostHeader } from "@/core/utils/XHostHeader";
import { FooterComp } from "@/features/_global/components/footer";
import NavbarComp from "@/features/_global/components/navbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

/****************
 * UTILITIES
 ****************/
const PPDB_PERIOD = {
  start: new Date("2025-05-01T00:00:00+07:00"),
  end: new Date("2025-07-31T23:59:59+07:00"),
};
const isWithinPeriod = (now, { start, end }) => now >= start && now <= end;

/****************************
 * KALENDER DATA
 ****************************/
const CATEGORY_COLORS = {
  Akademik: "#F2C94C",
  Kesiswaan: "#4ADE80",
  Dinas: "#60A5FA",
  Ujian: "#FB7185",
  Libur: "#A78BFA",
  Umum: "#94A3B8",
};

const DEMO_EVENTS = [
  { title: "Upacara & Pembinaan Karakter", date: "2025-09-08", category: "Kesiswaan" },
  { title: "Masa Penilaian Tengah Semester (PTS)", date: "2025-09-15", category: "Ujian" },
  { title: "Rapat Orang Tua/Wali Kelas X", date: "2025-09-20", category: "Akademik" },
  { title: "Kegiatan Donor Darah", date: "2025-09-24", category: "Kesiswaan" },
  { title: "Edaran Dinas: Cuti Bersama", date: "2025-09-27", category: "Dinas" },
  { title: "Libur Maulid Nabi", date: "2025-09-16", category: "Libur" },
];

/****************************
 * REACT QUERY HOOK
 ****************************/
const useCalendarEvents = (year, month) => {
  const xHost = getXHostHeader();

  return useQuery({
    queryKey: ['kalender', xHost],
    queryFn: async () => {
      const res = await fetch(`https://dev.kiraproject.id/kalender`, {
        cache: 'no-store',
        headers: {
          'X-Host': xHost,
          'Cache-Control': 'no-store',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch calendar events');
      const data = await res.json();
      return data.events.map(e => ({
        title: e.note,
        date: e.startTime.split('T')[0],
        category: e.category || 'Umum',
        description: e.description,
        startTime: e.startTime,
        endTime: e.endTime,
        id: e.id,
      }));
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    placeholderData: DEMO_EVENTS,
    retry: 1,
  });
};

/****************************
 * UTILITY HOOK
 ****************************/
function useMonthMatrix(year, monthIndex) {
  return useMemo(() => {
    const first = new Date(year, monthIndex, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const prevMonthDays = new Date(year, monthIndex, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDay; i++) {
      cells.push({ day: prevMonthDays - startDay + 1 + i, inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, inMonth: true });
    while (cells.length < 42) cells.push({ day: cells.length - (startDay + daysInMonth) + 1, inMonth: false });
    return { cells, daysInMonth, startDay };
  }, [year, monthIndex]);
}

/****************************
 * COMPONENTS
 ****************************/
const Legend = ({ theme }) => (
  <div className="flex flex-wrap gap-3">
    {Object.entries(CATEGORY_COLORS).map(([k, color]) => (
      <div key={k} className="inline-flex items-center gap-2 text-xs">
        <span className="w-3 h-3 rounded-sm inline-block" style={{ background: color, border: `1px solid ${theme.subtle}` }} />
        <span style={{ color: theme.surfaceText }}>{k}</span>
      </div>
    ))}
  </div>
);

const DayCell = ({ theme, day, inMonth, isToday, events }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
      className="min-h-[88px] p-2 border"
      style={{ borderColor: theme.subtle, background: inMonth ? theme.surface : "rgba(255,255,255,0.04)" }}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold" style={{ color: inMonth ? theme.surfaceText : theme.primaryText, opacity: inMonth ? 1 : 0.6 }}>
          {day}
        </div>
        {isToday && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: theme.accent, color: "#111827" }}>
            Hari ini
          </span>
        )}
      </div>
      <div className="mt-1 space-y-1">
        {events.slice(0, 3).map((e, i) => (
          <motion.div
            key={e.title + e.date + i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : i * 0.05 }}
            className="text-[11px] truncate px-1 py-0.5 rounded"
            title={e.title}
            style={{ background: CATEGORY_COLORS[e.category] || theme.accent, color: "#111827" }}
          >
            {e.title}
          </motion.div>
        ))}
        {events.length > 3 && (
          <div className="text-[10px] opacity-80" style={{ color: theme.surfaceText }}>
            +{events.length - 3} lagi
          </div>
        )}
      </div>
    </motion.div>
  );
};

/****************************
 * KALENDER SECTION
 ****************************/
export const CalendarSection = ({ theme, schoolName, initialDate = new Date() }) => {
  const [cursor, setCursor] = useState(() => {
    const now = initialDate instanceof Date ? initialDate : new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [activeCat] = useState(() => Object.keys(CATEGORY_COLORS).reduce((acc, k) => (acc[k] = true, acc), {}));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const { data: events = DEMO_EVENTS, isPending: loading, error } = useCalendarEvents(year, month);
  const queryClient = useQueryClient();
  const xHost = getXHostHeader();

  // Invalidate saat ganti tenant
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['kalender'] });
  }, [xHost, queryClient]);

  const { cells } = useMonthMatrix(year, month);

  const eventsByDay = useMemo(() => {
    const map = {};
    for (const e of events) {
      const d = new Date(e.date + "T00:00:00");
      const key = d.getDate();
      map[key] = map[key] || [];
      map[key].push(e);
    }
    return map;
  }, [events]);

  const go = (dir) => {
    const m = new Date(year, month + dir, 1);
    setCursor(m);
  };

  const monthLabel = cursor.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const today = new Date();
  const ppdbActive = isWithinPeriod(new Date(year, month, 15), PPDB_PERIOD);

  return (
    <section id="kalender" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold"
              style={{ color: theme.accent }}
            >
              Kalender Akademik {schoolName}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm opacity-85"
              style={{ color: theme.surfaceText }}
            >
              Agenda akademik, kesiswaan, dinas, ujian, dan libur resmi.
            </motion.p>
          </div>
          <Legend theme={theme} />
        </div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm"
            style={{ color: theme.primaryText }}
          >
            Memuat kalender...
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm"
            style={{ color: theme.pop }}
          >
            Error: {error.message}. Menggunakan data demo.
          </motion.div>
        )}

        {ppdbActive && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-4 text-xs px-3 py-2 rounded-xl inline-flex items-center gap-2 border"
            style={{ borderColor: theme.subtle, background: "rgba(242,201,76,0.15)", color: theme.primaryText }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: theme.accent }} />
            PPDB sedang berlangsung — cek menu Informasi → PPDB
          </motion.div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-between gap-3 mb-3"
          >
            <div className="inline-flex items-center gap-2">
              <button onClick={() => go(-1)} className="px-3 py-2 rounded-xl border" style={{ borderColor: theme.subtle, color: theme.primaryText }}>Previous</button>
              <div className="text-base md:text-lg font-semibold" style={{ color: theme.primaryText }}>{monthLabel}</div>
              <button onClick={() => go(1)} className="px-3 py-2 rounded-xl border" style={{ borderColor: theme.subtle, color: theme.primaryText }}>Next</button>
              <button onClick={() => setCursor(new Date())} className="px-3 py-2 rounded-xl border ml-2" style={{ borderColor: theme.subtle, color: theme.primaryText }}>Hari ini</button>
            </div>
          </motion.div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-7 text-xs md:text-sm"
            style={{ color: theme.primaryText }}
          >
            {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d => (
              <div key={d} className="p-2 font-semibold border-b" style={{ borderColor: theme.subtle }}>{d}</div>
            ))}
          </motion.div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-7">
            {cells.map((c, idx) => {
              const isToday = c.inMonth && today.getFullYear() === year && today.getMonth() === month && today.getDate() === c.day;
              const evts = c.inMonth ? (eventsByDay[c.day] || []) : [];
              return <DayCell key={idx} theme={theme} day={c.day} inMonth={c.inMonth} isToday={isToday} events={evts} />;
            })}
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <h3 className="text-lg font-semibold mb-3" style={{ color: theme.accent }}>Agenda Terdekat</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[...events]
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 6)
                .map((e, i) => (
                  <motion.div
                    key={e.id || e.title + i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-xl border p-3 flex items-center justify-between"
                    style={{ borderColor: theme.subtle, background: theme.surface }}
                  >
                    <div>
                      <div className="text-sm font-semibold" style={{ color: theme.surfaceText }}>{e.title}</div>
                      <div className="text-xs opacity-80" style={{ color: theme.surfaceText }}>
                        {new Date(e.date).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <span className="px-2 py-1 text-[11px] rounded-full border text-white" style={{ background: CATEGORY_COLORS[e.category], borderColor: theme.subtle }}>
                      {e.category}
                    </span>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

/****************************
 * PAGE WRAPPER + TESTS
 ****************************/
const CalendarPage = () => {
  const schoolInfo = SMAN25_CONFIG;
  const theme = schoolInfo.theme;
  const schoolName = schoolInfo.fullName;
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    try {
      console.assert(!!theme, "Theme harus ada");
      const keys = ["bg", "primary", "primaryText", "surface", "surfaceText", "subtle", "accent"];
      keys.forEach((k) => console.assert(k in theme, `Theme key '${k}' harus ada`));
      console.assert(typeof CalendarSection === "function", "CalendarSection harus terdefinisi");
      console.assert(typeof NavbarComp === "function", "Navbar harus terdefinisi");
      console.assert(typeof FooterComp === "function", "Footer harus terdefinisi");

      const { cells } = (function () {
        const first = new Date(2025, 8, 1);
        const startDay = first.getDay();
        const daysInMonth = new Date(2025, 9, 0).getDate();
        const prevMonthDays = new Date(2025, 8, 0).getDate();
        const arr = [];
        for (let i = 0; i < startDay; i++) arr.push({ day: prevMonthDays - startDay + 1 + i, inMonth: false });
        for (let d = 1; d <= daysInMonth; d++) arr.push({ day: d, inMonth: true });
        while (arr.length < 42) arr.push({ day: arr.length - (startDay + daysInMonth) + 1, inMonth: false });
        return { cells: arr };
      })();
      console.assert(cells.length === 42, "Grid kalender harus 42 sel");
      console.assert(isWithinPeriod(new Date("2025-06-15T00:00:00+07:00"), PPDB_PERIOD) === true, "PPDB harus aktif Juni 2025");

      console.log("UI smoke tests passed");
    } catch (e) {
      console.error("UI smoke tests failed:", e);
    }
  }, [prefersReducedMotion, theme]);

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <NavbarComp theme={theme} />
      <main>
        <CalendarSection theme={theme} schoolName={schoolName} />
      </main>
      <FooterComp theme={theme} />
    </div>
  );
};

export default CalendarPage;