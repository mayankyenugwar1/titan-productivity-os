import { Flame } from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

// 0 = no activity
// 1-4 = activity intensity
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
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">
            Consistency
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            Habit Heatmap
          </h2>

          <p className="mt-2 text-zinc-500">
            Your activity over the last six months.
          </p>

        </div>

        <div className="rounded-2xl bg-yellow-400/10 p-3">
          <Flame className="h-6 w-6 text-yellow-400" />
        </div>

      </div>

      {/* Months */}

      <div className="mt-10 ml-10 flex justify-between text-xs text-zinc-500">

        {MONTHS.map((month) => (
          <span key={month}>{month}</span>
        ))}

      </div>

      {/* Grid */}

      <div className="mt-3 flex gap-2">

        {/* Days */}

        <div className="flex flex-col justify-between py-1 text-xs text-zinc-500">

          {DAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}

        </div>

        {/* Cells */}

        <div className="flex gap-[6px]">

          {data.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="flex flex-col gap-[6px]"
            >
              {column.map((value, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`
                    h-4
                    w-4
                    rounded-[4px]
                    transition-all
                    duration-300
                    hover:scale-125
                    hover:ring-2
                    hover:ring-yellow-400
                    ${COLORS[value]}
                  `}
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
            <div
              key={color}
              className={`h-3 w-3 rounded ${color}`}
            />
          ))}

          <span>More</span>

        </div>

        <p className="text-sm text-zinc-500">
          186 contributions this year
        </p>

      </div>

    </section>
  );
}