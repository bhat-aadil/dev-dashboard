import { useEffect, useState } from "react";
import moment from "moment-timezone";

const STORAGE_KEY = "devdash-timezones";
const DEFAULT_ZONES = [
  "Asia/Kolkata",
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Tokyo",
];
const allTimezones = moment.tz.names();

function formatTimeForZone(zone) {
  const now = new Date();
  const opts = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: zone,
  };
  const time = new Intl.DateTimeFormat([], opts).format(now);
  const offset =
    new Intl.DateTimeFormat([], { timeZoneName: "short", timeZone: zone })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value || "";
  return { time, offset };
}

export default function WorldClockWidget() {
  const [zones, setZones] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_ZONES;
    } catch {
      return DEFAULT_ZONES;
    }
  });
  const [nowTick, setNowTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNowTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
  }, [zones]);

  const removeZone = (z) => setZones((prev) => prev.filter((x) => x !== z));

  return (
    <div className="p-4 flex flex-col bg-gray-800 text-gray-300 rounded-2xl shadow h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Work Remote</h3>
        <div className="text-xs text-slate-500">Remote-friendly</div>
      </div>

      <div>
        <select
          className="font-semibold border w-[80%] mb-4 rounded bg-gray-900"
          value=""
          onChange={(e) =>
            !zones.includes(e.target.value)
              ? setZones((prev) => [e.target.value, ...prev])
                ? e.target.value == ""
                : null
              : null
          }
        >
          <option value="">Add TimeZone</option>
          {allTimezones.map((t, index) => (
            <option key={index} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2 max-[485px]:grid-cols-1">
        {zones.map((z) => {
          const { time, offset } = formatTimeForZone(z);
          return (
            <div key={z} className="p-2 border rounded bg-gray-950">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-300 overflow-hidden">
                  {z.replace("_", " ")}
                </div>
                <button
                  onClick={() => removeZone(z)}
                  className="text-xs text-gray-200 font-bold cursor-pointer"
                >
                  X
                </button>
              </div>
              <div className="text-2xl font-mono mt-2 overflow-hidden">
                {time}
              </div>
              <div className="text-xs text-slate-500 mt-1">{offset}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
