"use client";

import Image from "next/image";
import {
  Clock,
  Fingerprint,
  AlertTriangle,
  MessageSquare,
  Key,
  Quote,
  CheckCircle2,
} from "lucide-react";
import { suspects } from "../lib/data";
import { useGameState } from "../lib/gameState";
import LinkButton from "../components/LinkButton";

const SUSPECT_IMAGES: Record<string, string> = {
  "suspect-1": "/images/suspect-elena.jpg",
  "suspect-2": "/images/suspect-marcus.jpg",
  "suspect-3": "/images/suspect-diana.jpg",
};

const SUSPECT_METADATA: Record<
  string,
  {
    dossierId: string;
    clearance: string;
    department: string;
  }
> = {
  "suspect-1": {
    dossierId: "POI-01",
    clearance: "Level 5 Executive Override",
    department: "Executive Committee / Operations",
  },
  "suspect-2": {
    dossierId: "POI-02",
    clearance: "Level 4 Systems Admin",
    department: "Core AI / Neural Systems Engineering",
  },
  "suspect-3": {
    dossierId: "POI-03",
    clearance: "Level 5 Physical Security Master",
    department: "Corporate Security & Threat Mitigation",
  },
};

const suspicionStyles: Record<string, { badge: string; text: string }> = {
  High: {
    badge: "bg-[#9E2A2B]/20 text-[#F87171] border-[#9E2A2B]/50",
    text: "text-[#F87171]",
  },
  Medium: {
    badge: "bg-[#C9A15B]/20 text-[#E8D098] border-[#C9A15B]/40",
    text: "text-[#C9A15B]",
  },
  Low: {
    badge: "bg-[#2D6A4F]/20 text-[#34D399] border-[#2D6A4F]/40",
    text: "text-[#34D399]",
  },
};

export default function SuspectsPage() {
  const { interrogationLogs } = useGameState();

  const totalInterviewed = suspects.filter(
    (s) => (interrogationLogs[s.id]?.length || 0) > 1
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in-up space-y-10 sm:space-y-12">
      {/* ── TOP CLASSIFIED DOSSIER HEADER ── */}
      <div className="espresso-panel rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden border border-[#33261A]">
        {/* Classification Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#33261A] text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-2.5">
            <span className="confidential-stamp-sm">RESTRICTED // PERSONS OF INTEREST</span>
            <span className="hidden sm:inline text-[#5C4733]">•</span>
            <span className="hidden sm:inline text-[#E8DCC0] uppercase tracking-wider font-semibold">
              CASE #CZ-2024-0731
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#C9A15B]/15 border border-[#C9A15B]/35 text-[#E8DCC0] font-bold tracking-wider text-xs sm:text-[13px] font-mono">
              <Fingerprint className="w-3.5 h-3.5 text-[#C9A15B]" />
              {totalInterviewed} OF 3 INTERVIEWED
            </span>
            <span className="text-[#D4C7B0] text-xs sm:text-[13px] font-mono">CLEARANCE: DETECTIVE</span>
          </div>
        </div>

        {/* Title & Case Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#C9A15B] text-xs sm:text-[13px] uppercase tracking-[0.25em] font-mono mb-2 font-bold">
              <span>ACTIVE HOMICIDE INQUIRY</span>
              <span className="text-[#5C4733]">{"//"}</span>
              <span>SUSPECT DOSSIERS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#E8DCC0] tracking-tight">
              Persons of Interest
            </h1>
            <p className="mt-3.5 text-[#D4C7B0] text-base sm:text-lg max-w-3xl leading-relaxed font-normal">
              Three NovaMind executives held credentials capable of manipulating Floor 47 systems during the 10:30–10:42 PM murder blackout.
              Examine each suspect&apos;s documented motive, alibi discrepancies, and security privileges before conducting private interviews.
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="flex items-center gap-4 shrink-0 bg-[#17130E] border border-[#33261A] rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="text-center px-2">
              <span className="text-xs sm:text-[13px] uppercase font-mono text-[#D4C7B0] block font-semibold">Suspects</span>
              <span className="text-xl sm:text-2xl font-serif font-black text-[#E8DCC0]">3</span>
            </div>
            <div className="h-8 w-px bg-[#33261A]" />
            <div className="text-center px-2">
              <span className="text-xs sm:text-[13px] uppercase font-mono text-[#D4C7B0] block font-semibold">Blackout</span>
              <span className="text-xl sm:text-2xl font-serif font-black text-[#C9A15B]">12 min</span>
            </div>
            <div className="h-8 w-px bg-[#33261A]" />
            <div className="text-center px-2">
              <span className="text-xs sm:text-[13px] uppercase font-mono text-[#D4C7B0] block font-semibold">Stakes</span>
              <span className="text-xl sm:text-2xl font-serif font-black text-[#F87171]">$4.2B</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUSPECT DOSSIER CARDS (3 COLUMNS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {suspects.map((s) => {
          const messageCount = interrogationLogs[s.id]?.length || 0;
          const isQuestioned = messageCount > 1;
          const imageSrc = SUSPECT_IMAGES[s.id] || "/images/victim-adrian-voss.jpg";
          const meta = SUSPECT_METADATA[s.id] || {
            dossierId: "POI-??",
            clearance: "Unknown",
            department: "NovaMind Technologies",
          };
          const suspicion = suspicionStyles[s.suspicionLevel] || suspicionStyles.Medium;

          return (
            <div
              key={s.id}
              className="group relative flex flex-col justify-between rounded-2xl espresso-panel border border-[#33261A] hover:border-[#C9A15B]/50 hover:shadow-2xl transition-all duration-300 overflow-hidden shadow-xl"
            >
              <div>
                {/* Dossier Header Strip with Clean Line Wrapping */}
                <div className="px-5 py-3.5 bg-[#17130E] border-b border-[#33261A] flex items-center justify-between gap-3 text-xs sm:text-[13px] font-mono min-h-[56px]">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[#C9A15B] font-bold shrink-0">{meta.dossierId}</span>
                    <span className="text-[#5C4733] shrink-0">•</span>
                    <span className="text-[#D4C7B0] font-medium leading-snug">
                      {meta.department}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs uppercase font-bold tracking-wider border shadow-sm shrink-0 whitespace-nowrap ${suspicion.badge}`}
                  >
                    {s.suspicionLevel}
                  </span>
                </div>

                {/* Cinematic Portrait Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#100D08] border-b border-[#33261A]">
                  <Image
                    src={imageSrc}
                    alt={`${s.name}, ${s.role}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C150E] via-transparent to-transparent opacity-90 pointer-events-none" />

                  {/* Corner Clearance Stamp */}
                  <div className="absolute top-3 left-3 bg-[#17130E]/90 border border-[#33261A] px-2.5 py-1 rounded text-xs font-mono text-[#E8DCC0] font-semibold shadow-md">
                    {meta.clearance}
                  </div>

                  {/* Interview Status Badge */}
                  <div className="absolute bottom-3 right-3">
                    {isQuestioned ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#2D6A4F]/90 border border-[#387656] text-[#34D399] text-xs sm:text-[13px] font-mono font-bold shadow-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                        INTERVIEWED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#17130E]/90 border border-[#33261A] text-[#D4C7B0] text-xs sm:text-[13px] font-mono font-medium shadow-lg">
                        <MessageSquare className="w-3.5 h-3.5 text-[#C9A15B]" />
                        PENDING
                      </span>
                    )}
                  </div>
                </div>

                {/* Suspect Identity Details */}
                <div className="p-5 sm:p-6 pb-5">
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-widest text-[#D4C7B0] font-mono mb-1 font-semibold">
                      Person of Interest
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#E8DCC0] tracking-tight group-hover:text-[#C9A15B] transition-colors">
                      {s.name}
                    </h2>
                    <p className="text-base sm:text-lg font-serif font-semibold text-[#C9A15B] mt-1">
                      {s.role}
                    </p>
                    <p className="text-xs sm:text-sm font-mono text-[#D4C7B0] mt-1">
                      Age {s.age} • NovaMind Technologies
                    </p>
                  </div>

                  {/* Suspect Key Quote in Vintage Parchment Style */}
                  <div className="mb-5">
                    <blockquote className="relative border-l-2 border-[#C9A15B]/60 pl-3.5 py-2 italic text-[#E8DCC0] text-xs sm:text-sm leading-relaxed bg-[#17130E] rounded-r-lg">
                      <Quote className="w-3.5 h-3.5 text-[#C9A15B]/30 absolute -top-1.5 -left-1.5" />
                      &ldquo;{s.keyQuote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Intel Sections */}
                  <div className="space-y-3.5">
                    {/* Documented Motive */}
                    <div className="bg-[#9E2A2B]/10 border border-[#9E2A2B]/35 rounded-xl p-4">
                      <div className="flex items-center gap-1.5 font-mono uppercase text-[#F87171] font-bold text-xs sm:text-[13px] mb-1.5">
                        <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0" />
                        <span>Documented Motive</span>
                      </div>
                      <p className="text-sm sm:text-base text-[#E8DCC0] leading-relaxed font-normal">
                        {s.motive}
                      </p>
                    </div>

                    {/* Stated Alibi */}
                    <div className="bg-[#17130E] border border-[#33261A] rounded-xl p-4">
                      <div className="flex items-center gap-1.5 font-mono uppercase text-[#C9A15B] font-bold text-xs sm:text-[13px] mb-1.5">
                        <Clock className="w-4 h-4 text-[#C9A15B] shrink-0" />
                        <span>Stated Alibi & Discrepancies</span>
                      </div>
                      <p className="text-sm sm:text-base text-[#D4C7B0] leading-relaxed font-normal">
                        {s.alibi}
                      </p>
                    </div>

                    {/* Security Access & Background */}
                    <div className="bg-[#17130E] border border-[#33261A] rounded-xl p-4">
                      <div className="flex items-center gap-1.5 font-mono uppercase text-[#E8DCC0] font-bold text-xs sm:text-[13px] mb-1.5">
                        <Key className="w-4 h-4 text-[#C9A15B] shrink-0" />
                        <span>Background & Clearance</span>
                      </div>
                      <p className="text-sm sm:text-base text-[#D4C7B0] leading-relaxed font-normal">
                        <strong className="text-[#E8DCC0] font-semibold">{meta.clearance}.</strong> {s.background}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 sm:p-6 pt-0 mt-auto">
                <LinkButton
                  href={`/interrogation?suspect=${s.id}`}
                  className="w-full text-sm sm:text-base font-bold py-3"
                >
                  <MessageSquare className="w-4 h-4 text-[#100D08]" />
                  <span>Begin Interrogation →</span>
                </LinkButton>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── WORKING NAVIGATION BUTTONS ── */}
      <div className="rounded-2xl espresso-panel p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl border border-[#33261A]">
        <div className="text-center lg:text-left">
          <p className="text-xs sm:text-[13px] uppercase tracking-widest text-[#C9A15B] font-mono mb-1.5 font-bold">
            Investigation Operations
          </p>
          <p className="text-sm sm:text-base text-[#D4C7B0] max-w-xl">
            Examine physical evidence recovered from the executive suite or return to the incident briefing.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 w-full lg:w-auto">
          <LinkButton href="/crime-scene" className="w-full sm:w-auto">
            🚨 Examine Crime Scene →
          </LinkButton>
          <LinkButton href="/interrogation" variant="secondary" className="w-full sm:w-auto">
            💬 Interrogation Room
          </LinkButton>
          <LinkButton href="/briefing" variant="secondary" className="w-full sm:w-auto">
            ← Case Briefing
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
