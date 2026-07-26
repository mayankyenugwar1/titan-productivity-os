type TitanProgressProps = {
  value: number;
};

export default function TitanProgress({
  value,
}: TitanProgressProps) {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full border border-zinc-800/80 bg-[#101014]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#b38f28] to-[#e5c158] transition-all duration-700 ease-out shadow-[0_0_12px_rgba(212,175,55,0.2)]"
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  );
}