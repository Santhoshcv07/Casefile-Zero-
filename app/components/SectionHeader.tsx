import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  label: string;
}

export default function SectionHeader({ children, label }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A15B]" />
        <p className="text-[#C9A15B] text-[11px] uppercase tracking-[0.25em] font-mono font-bold">
          {label}
        </p>
      </div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#E8DCC0] tracking-tight">
        {children}
      </h1>
      <div className="mt-3.5 h-px w-32 bg-gradient-to-r from-[#C9A15B] via-[#C9A15B]/50 to-transparent" />
    </div>
  );
}
