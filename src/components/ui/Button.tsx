import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
};

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    />
  );
}
