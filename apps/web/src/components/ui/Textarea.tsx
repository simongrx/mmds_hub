import type { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const base =
  "w-full rounded-xl border border-black/15 px-4 py-2.5 outline-none focus:border-honey focus:ring-2 focus:ring-honey/30";

export default function Textarea({ label, id, className = "", ...props }: Props) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <textarea id={id} rows={3} className={`${base} ${className}`} {...props} />
    </div>
  );
}
