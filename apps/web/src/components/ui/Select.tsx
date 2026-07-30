import type { SelectHTMLAttributes } from "react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const base =
  "w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 outline-none focus:border-honey focus:ring-2 focus:ring-honey/30";

export default function Select({
  label,
  id,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <select id={id} className={`${base} ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}
