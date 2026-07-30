import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-honey text-ink hover:bg-mustard-dark hover:text-white",
  secondary:
    "bg-ink text-white hover:bg-ink/80",
  ghost:
    "bg-transparent text-ink hover:bg-black/5",
  danger:
    "bg-error text-white hover:bg-error/85",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`rounded-xl px-4 py-2.5 font-heading text-sm font-semibold transition disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
