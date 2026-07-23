type SectionHeaderProps = {
  badge: string;
  title: string;
  description: string;
};

export default function SectionHeader({
  badge,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-8">

      <p className="text-xs uppercase tracking-[0.35em] text-yellow-400">
        {badge}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-2 text-zinc-400">
        {description}
      </p>

    </div>
  );
}