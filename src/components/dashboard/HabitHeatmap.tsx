import { Flame } from "lucide-react";
import { ICON_SIZES, SectionHeader, TitanCard } from "@/components/ui";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const data = Array.from({ length: 7 }, () =>
  Array.from({ length: 26 }, () => Math.floor(Math.random() * 5))
);

const COLORS = [
  "bg-zinc-900",
  "bg-yellow-400/20",
  "bg-yellow-400/40",
  "bg-yellow-400/70",
  "bg-yellow-400",
];

export default function HabitHeatmap() {
  return (
    <TitanCard variant="default" padding="lg">
      <SectionHeader
        badge="Consistency"
        title="Mission Heatmap"
        description="Your activity over the last six months."
        action={
          <div className="rounded-2xl bg-yellow-400/10 p-3">
            <Flame size={ICON_SIZES.lg} className="text-yellow-400" />
          </div>
        }
      />

      {/* Months */}
      <div className="mt-10 ml-10 flex justify-between text-xs text-zinc-500">
        {MONTHS.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {/* Days */}
        <div className="flex flex-col justify-between py-1 text-xs text-zinc-500">
          {DAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        {/* Cells */}
        <div className="flex gap-[6px]">
          {data.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-[6px]">
              {column.map((value, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`size-4 rounded-[4px] transition-all duration-300 hover:scale-125 hover:ring-2 hover:ring-yellow-400 ${COLORS[value]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Less</span>
          {COLORS.map((color) => (
            <div key={color} className={`size-3 rounded ${color}`} />
          ))}
          <span>More</span>
        </div>
        <p className="text-sm text-zinc-500">186 contributions this year</p>
      </div>
    </TitanCard>
  );
}
