"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShieldAlert,
  Clock,
  MapPin,
  Lock,
  MessageSquare,
  Compass,
  BookmarkCheck,
  FileText,
} from "lucide-react";
import { useGameState } from "./lib/gameState";
import { clues } from "./lib/data";

interface SuspectPreview {
  id: string;
  name: string;
  role: string;
  motiveShort: string;
  suspicionLevel: "High Priority" | "Person of Interest" | "Under Review";
  image: string;
  route: string;
}

const SUSPECT_PREVIEWS: SuspectPreview[] = [
  {
    id: "suspect-1",
    name: "Elena Marchetti",
    role: "COO",
    motiveShort: "$504M IPO equity at stake if algorithmic fraud audit is exposed.",
    suspicionLevel: "High Priority",
    image: "/images/suspect-elena.jpg",
    route: "/interrogation?suspect=suspect-1",
  },
  {
    id: "suspect-2",
    name: "Marcus Chen",
    role: "Lead Software Architect",
    motiveShort: "Core neural architecture patents secretly filed under CEO's name alone.",
    suspicionLevel: "Person of Interest",
    image: "/images/suspect-marcus.jpg",
    route: "/interrogation?suspect=suspect-2",
  },
  {
    id: "suspect-3",
    name: "Diana Okafor",
    role: "Head of Corporate Security",
    motiveShort: "Facing departmental purge and replacement by automated drone contractor.",
    suspicionLevel: "Under Review",
    image: "/images/suspect-diana.jpg",
    route: "/interrogation?suspect=suspect-3",
  },
];

export default function LandingPage() {
  const { discoveredClueIds, accusationResult } = useGameState();

  const cluesFound = discoveredClueIds.length;
  const totalClues = clues.length;
  const isCaseActive = cluesFound > 0 || !!accusationResult;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in-up space-y-10 sm:space-y-12">
      {/* ── TOP FORENSIC AGENCY BANNER ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#33261A] text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="confidential-stamp-sm">EYES ONLY // HOMICIDE</span>
          <span className="text-[#B3A184]">•</span>
          <span className="text-[#E8DCC0] uppercase tracking-wider font-semibold">
            DEPARTMENT OF FORENSIC RECONNAISSANCE
          </span>
        </div>
        <div className="flex items-center gap-3 text-[#B3A184]">
          <span>SEALED: 11:47 PM</span>
          <span>•</span>
          <span className="text-[#C9A15B] font-bold">CASE #CZ-2024-0731</span>
        </div>
      </div>

      {/* ── MAIN DASHBOARD HERO GRID ── */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* ── LEFT: CONFIDENTIAL CASEFILE DOSSIER SHEET ── */}
        <div className="lg:col-span-7 flex flex-col justify-between parchment-sheet rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          {/* Subtle Paper Texture Top Corner Stamp */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#C5B48E]/80">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="confidential-stamp">CONFIDENTIAL</span>
                <span className="text-[11px] font-mono text-[#4A3527] uppercase tracking-widest font-bold">
                  HOMICIDE DIVISION // ACTIVE BRIEF
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#100D08] tracking-tight leading-tight">
                CASEFILE ZERO
              </h1>
              <p className="text-lg sm:text-xl font-serif italic text-[#33261A] font-semibold mt-1">
                The Last Alibi — Murder at NovaMind Penthouse
              </p>
            </div>
            <div className="hidden sm:block text-right font-mono text-[11px] text-[#4A3527] border-l border-[#C5B48E] pl-4">
              <p className="font-bold uppercase text-[#100D08]">FLOOR 47</p>
              <p>NOVAMIND TOWER</p>
              <p className="text-[#9E2A2B] font-bold mt-1">LOCKED ROOM</p>
            </div>
          </div>

          {/* Narrative Lead Dossier Text in Dark Ink */}
          <div className="my-6 space-y-4 text-[#17130E]">
            <p className="text-sm sm:text-base leading-relaxed font-sans font-normal">
              At <strong className="font-bold text-[#100D08]">11:47 PM</strong>, visionary tech founder{" "}
              <strong className="font-bold text-[#100D08]">Dr. Adrian Voss</strong> was discovered bludgeoned to death inside his
              fortified executive corner suite. The steel-core solenoid door was locked from within. A{" "}
              <strong className="font-bold text-[#9E2A2B]">12-minute camera blackout</strong> blinded building security
              between 10:30 PM and 10:42 PM.
            </p>
            <p className="text-sm sm:text-base leading-relaxed font-sans font-normal text-[#241B11]">
              With a <strong className="font-bold text-[#100D08]">$4.2 billion IPO</strong> scheduled in 48 hours, three
              confidants held secrets worth killing to protect. Review the crime scene, cross-examine suspects with
              recovered physical evidence, and deliver an airtight indictment to the Grand Jury.
            </p>

            {/* Key Telemetry Badges on Parchment */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono text-[#241B11]">
              <div className="bg-[#FAF6EB] p-2.5 rounded border border-[#C5B48E] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C9A15B] shrink-0" />
                <div>
                  <span className="block text-[9px] uppercase text-[#5C4733] font-semibold">Time of Death</span>
                  <span className="font-bold text-[#100D08]">10:30–10:42 PM</span>
                </div>
              </div>
              <div className="bg-[#FAF6EB] p-2.5 rounded border border-[#C5B48E] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C9A15B] shrink-0" />
                <div>
                  <span className="block text-[9px] uppercase text-[#5C4733] font-semibold">Scene Status</span>
                  <span className="font-bold text-[#100D08]">Sealed Inside</span>
                </div>
              </div>
              <div className="bg-[#FAF6EB] p-2.5 rounded border border-[#C5B48E] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#9E2A2B] shrink-0" />
                <div>
                  <span className="block text-[9px] uppercase text-[#5C4733] font-semibold">Blackout</span>
                  <span className="font-bold text-[#9E2A2B]">12 Minutes</span>
                </div>
              </div>
              <div className="bg-[#FAF6EB] p-2.5 rounded border border-[#C5B48E] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C9A15B] shrink-0" />
                <div>
                  <span className="block text-[9px] uppercase text-[#5C4733] font-semibold">Location</span>
                  <span className="font-bold text-[#100D08]">Penthouse 47</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#C5B48E]/80 flex flex-wrap items-center gap-3.5">
            <Link
              href="/briefing"
              className="px-6 py-3 bg-gradient-to-r from-[#C9A15B] via-[#D8B775] to-[#B8860B] hover:brightness-105 text-[#100D08] border border-[#E8D098]/70 rounded-lg font-serif font-bold text-sm tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Read Case Briefing</span>
              <span>→</span>
            </Link>
            <Link
              href="/crime-scene"
              className="px-6 py-3 bg-[#241B11] hover:bg-[#33261A] text-[#E8DCC0] border border-[#33261A] rounded-lg font-serif font-bold text-sm tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#C9A15B]" />
              <span>Investigate Crime Scene</span>
            </Link>
            {isCaseActive && (
              <Link
                href="/evidence"
                className="px-4 py-3 bg-[#FAF6EB] hover:bg-[#F3E8CD] text-[#17130E] border border-[#C5B48E] rounded-lg font-mono text-xs font-bold transition-all ml-auto flex items-center gap-1.5 cursor-pointer"
              >
                <span>📎 Resume Board ({cluesFound}/{totalClues})</span>
              </Link>
            )}
          </div>
        </div>

        {/* ── RIGHT: ACTIVE INVESTIGATION EXHIBIT CARD ── */}
        <div className="lg:col-span-5 espresso-panel rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-2xl border border-[#33261A]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#33261A] text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C9A15B] animate-glow-pulse" />
                <span className="text-[#C9A15B] font-bold uppercase tracking-wider">
                  SCENE EXHIBIT // 11:47 PM
                </span>
              </div>
              <span className="text-[#B3A184] font-mono">CAM-47 EXEC</span>
            </div>

            {/* Crime Scene Photo Frame */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#33261A] shadow-xl group">
              <Image
                src="/images/crime-scene-interactive.jpg"
                alt="47th floor executive crime scene at night"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100D08] via-transparent to-transparent opacity-85" />

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-[#17130E]/95 border border-[#C9A15B]/40 text-[#E8DCC0]">
                  8 Hotspots Ready for Inspection
                </span>
                <Link
                  href="/crime-scene"
                  className="px-2.5 py-1 rounded bg-[#C9A15B] text-[#100D08] font-bold hover:bg-[#D8B775] transition-colors cursor-pointer"
                >
                  Enter Room →
                </Link>
              </div>
            </div>

            {/* Quick Clue Locker Telemetry */}
            <div className="mt-5 p-4 rounded-xl bg-[#17130E] border border-[#33261A] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#E8DCC0] font-semibold flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-[#C9A15B]" />
                  Forensic Recovery Progress
                </span>
                <span className="text-[#C9A15B] font-bold">
                  {Math.round((cluesFound / totalClues) * 100)}%
                </span>
              </div>
              <div className="w-full bg-[#100D08] h-2 rounded-full overflow-hidden border border-[#33261A]">
                <div
                  className="bg-gradient-to-r from-[#C9A15B] to-[#E8DCC0] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(cluesFound / totalClues) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-[#B3A184] font-mono pt-1">
                {cluesFound === 0
                  ? "Zero clues cataloged. Begin forensic sweep in the executive office."
                  : `${cluesFound} of ${totalClues} physical evidence leads secured in local file.`}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#33261A] flex items-center justify-between text-xs font-mono text-[#B3A184]">
            <span>NOVAMIND TECHNOLOGIES HQ</span>
            <span className="text-[#C9A15B]">LEVEL 47 SUITE</span>
          </div>
        </div>
      </div>

      {/* ── CASEBOOK: PERSONS OF INTEREST SECTION ── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-[#33261A]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#C9A15B] uppercase tracking-widest font-bold">
              <span>CASEBOOK DOSSIERS</span>
              <span className="text-[#5C4733]">{"//"}</span>
              <span>PERSONS OF INTEREST</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#E8DCC0] tracking-tight mt-1">
              Primary Suspects Under Investigation
            </h2>
          </div>
          <Link
            href="/suspects"
            className="text-xs font-mono text-[#C9A15B] hover:text-[#E8DCC0] flex items-center gap-1 uppercase tracking-wider font-bold cursor-pointer"
          >
            <span>View Full Suspect Dossiers</span>
            <span>→</span>
          </Link>
        </div>

        {/* 3 Suspect Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {SUSPECT_PREVIEWS.map((suspect) => (
            <div
              key={suspect.id}
              className="espresso-panel rounded-xl overflow-hidden border border-[#33261A] hover:border-[#C9A15B]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Character Portrait with Vintage Dark-Frame */}
                <div className="relative aspect-[4/3] w-full bg-[#17130E] overflow-hidden">
                  <Image
                    src={suspect.image}
                    alt={suspect.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C150E] via-transparent to-transparent opacity-90" />

                  {/* Suspicion Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border shadow-md ${
                        suspect.suspicionLevel === "High Priority"
                          ? "bg-[#9E2A2B]/25 text-[#F87171] border-[#9E2A2B]/50"
                          : suspect.suspicionLevel === "Person of Interest"
                          ? "bg-[#C9A15B]/20 text-[#E8DCC0] border-[#C9A15B]/40"
                          : "bg-[#241B11] text-[#B3A184] border-[#33261A]"
                      }`}
                    >
                      {suspect.suspicionLevel}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-xl font-serif font-black text-[#E8DCC0] group-hover:text-[#C9A15B] transition-colors">
                      {suspect.name}
                    </h3>
                    <p className="text-xs font-mono text-[#C9A15B] uppercase tracking-wider font-semibold">
                      {suspect.role}
                    </p>
                  </div>

                  <p className="text-xs text-[#B3A184] leading-relaxed">
                    {suspect.motiveShort}
                  </p>
                </div>
              </div>

              {/* Action Link to Interrogation */}
              <div className="p-5 pt-0">
                <Link
                  href={suspect.route}
                  className="w-full py-2.5 rounded-lg bg-[#17130E] hover:bg-[#241B11] border border-[#33261A] hover:border-[#C9A15B]/40 text-[#E8DCC0] hover:text-white font-mono text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#C9A15B]" />
                  <span>Interrogate Suspect →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK INVESTIGATION ARCHIVE MODULES ── */}
      <div className="grid gap-6 sm:grid-cols-3 pt-2">
        <Link
          href="/briefing"
          className="espresso-panel p-5 rounded-xl border border-[#33261A] hover:border-[#C9A15B]/40 transition-all flex items-start gap-4 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-[#17130E] border border-[#33261A] flex items-center justify-center text-[#C9A15B] group-hover:scale-105 transition-transform shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#E8DCC0] group-hover:text-[#C9A15B] transition-colors">
              Homicide Dossier
            </h4>
            <p className="text-xs text-[#B3A184] mt-1 leading-relaxed">
              Examine the official autopsy findings, 10:30 PM blackout window, and room architecture.
            </p>
          </div>
        </Link>

        <Link
          href="/crime-scene"
          className="espresso-panel p-5 rounded-xl border border-[#33261A] hover:border-[#C9A15B]/40 transition-all flex items-start gap-4 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-[#17130E] border border-[#33261A] flex items-center justify-center text-[#C9A15B] group-hover:scale-105 transition-transform shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#E8DCC0] group-hover:text-[#C9A15B] transition-colors">
              Physical Recon
            </h4>
            <p className="text-xs text-[#B3A184] mt-1 leading-relaxed">
              Inspect Dr. Voss&apos;s desk, the cracked tablet, poisoned scotch, and staged HVAC vent.
            </p>
          </div>
        </Link>

        <Link
          href="/evidence"
          className="espresso-panel p-5 rounded-xl border border-[#33261A] hover:border-[#C9A15B]/40 transition-all flex items-start gap-4 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-[#17130E] border border-[#33261A] flex items-center justify-center text-[#C9A15B] group-hover:scale-105 transition-transform shrink-0">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#E8DCC0] group-hover:text-[#C9A15B] transition-colors">
              Evidence & Indictment
            </h4>
            <p className="text-xs text-[#B3A184] mt-1 leading-relaxed">
              Assemble corroborating physical clues and present your formal charge to the Grand Jury.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
