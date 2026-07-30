export default function DashboardMetric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink/60">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-2 font-heading text-3xl font-bold">{value}</p>
    </div>
  );
}
