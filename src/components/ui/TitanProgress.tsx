type TitanProgressProps = {
  value: number;
};

export default function TitanProgress({
  value,
}: TitanProgressProps) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
      <div
        className="h-full rounded-full bg-yellow-400 transition-all duration-700"
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}