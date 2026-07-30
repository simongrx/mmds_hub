export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-honey border-t-transparent ${className}`}
      role="status"
      aria-label="Cargando"
    />
  );
}
