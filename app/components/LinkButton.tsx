import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "danger" | "parchment";
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#100D08] cursor-pointer";

const variants: Record<string, string> = {
  primary:
    "bg-gradient-to-r from-[#C9A15B] via-[#D8B775] to-[#B8860B] text-[#100D08] hover:brightness-105 border border-[#E8D098]/70 shadow-md shadow-[#C9A15B]/20 focus:ring-[#C9A15B]",
  secondary:
    "bg-[#241B11] border border-[#33261A] text-[#E8DCC0] hover:bg-[#2D2115] hover:border-[#C9A15B]/50 hover:text-white shadow-sm focus:ring-[#C9A15B]/40",
  danger:
    "bg-[#9E2A2B] hover:bg-[#851E1F] text-white border border-[#BF3839]/60 shadow-md shadow-[#9E2A2B]/30 focus:ring-[#9E2A2B]",
  parchment:
    "bg-[#EBDCB7] text-[#17130E] hover:bg-[#F4ECDA] border border-[#C5B48E] shadow-sm font-serif",
};

export default function LinkButton({ children, href, variant = "primary", className = "" }: Props) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
