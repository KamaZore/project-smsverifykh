import { Skeleton } from "@mui/material";

const ACCENTS = {
  indigo: "#6366f1",
  emerald: "#10b981",
  amber: "#f59e0b",
  sky: "#0ea5e9",
  rose: "#f43f5e",
  violet: "#8b5cf6",
};

export default function StatCard({
  icon,
  title,
  value,
  subtitle,
  color = "indigo",
  loading = false,
}) {
  const accent = ACCENTS[color] || ACCENTS.indigo;

  return (
    <div className="relative bg-white rounded-md border border-[#e3e6f0] shadow-sm overflow-hidden">
      {/* AdminLTE info-box left accent bar */}
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: accent }}
      />

      <div className="flex items-center gap-4 p-4 pl-6">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-md shrink-0 text-xl"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 truncate">
            {title}
          </div>
          {loading ? (
            <Skeleton width={90} height={26} />
          ) : (
            <div className="text-2xl font-bold text-[#343a40] leading-tight">
              {value}
            </div>
          )}
          {subtitle && !loading && (
            <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
}
