"use client";

import { useState } from "react";
import Image from "next/image";
import { clues, suspects } from "../lib/data";
import { useGameState, MOTIVE_OPTIONS, AccusationResult } from "../lib/gameState";
import SectionHeader from "../components/SectionHeader";
import LinkButton from "../components/LinkButton";
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Scale,
  ShieldCheck,
  FileText,
  Fingerprint,
  Search,
  Award,
  RotateCcw,
  Edit3,
} from "lucide-react";

const SUSPECT_IMAGES: Record<string, string> = {
  "suspect-1": "/images/suspect-elena.jpg",
  "suspect-2": "/images/suspect-marcus.jpg",
  "suspect-3": "/images/suspect-diana.jpg",
};

const CLUE_EXHIBITS: Record<
  string,
  {
    exhibitNumber: string;
    image: string;
    category: string;
    chainOfCustody: string;
  }
> = {
  "clue-1": {
    exhibitNumber: "EXHIBIT A-01",
    image: "/images/clue-1.jpg",
    category: "Digital Hardware // Unsent Communications",
    chainOfCustody: "Recovered from Dr. Voss's mahogany desk at 23:54 • Unsent SEC draft preserved in situ.",
  },
  "clue-2": {
    exhibitNumber: "EXHIBIT A-02",
    image: "/images/clue-2.jpg",
    category: "Forensic Toxicology // Chemical Residue",
    chainOfCustody: "Recovered beside victim's chair at 00:12 • Glencairn glass positive for 10mg Diazepam.",
  },
  "clue-3": {
    exhibitNumber: "EXHIBIT A-03",
    image: "/images/clue-3.jpg",
    category: "Audit Logs // Cyber Telemetry",
    chainOfCustody: "Extracted from Floor 46 workstation • 12-minute camera blackout logged from 10:30 to 10:42 PM.",
  },
  "clue-4": {
    exhibitNumber: "EXHIBIT A-04",
    image: "/images/clue-4.jpg",
    category: "Physical Staging // Trace Particulates",
    chainOfCustody: "Examined by CSI team • Grate unscrewed from below; undisturbed thick dust proves zero body passage.",
  },
  "clue-5": {
    exhibitNumber: "EXHIBIT A-05",
    image: "/images/clue-5.jpg",
    category: "Biological Evidence // Metallurgy & DNA",
    chainOfCustody: "Bagged in crevice behind desk at 00:28 • Platinum monogram 'E.M.' stained with Voss's Type-A blood.",
  },
  "clue-6": {
    exhibitNumber: "EXHIBIT A-06",
    image: "/images/clue-6.jpg",
    category: "Documentary Exhibit // Timestamped Alibi",
    chainOfCustody: "Logged in East Stairwell at 00:45 • Printed receipt timestamped 10:36 PM on Floor 14.",
  },
};

export default function EvidencePage() {
  const {
    discoveredClueIds,
    accusationResult,
    submitAccusation,
    resetCase,
  } = useGameState();

  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);

  // Accusation form local state
  const [accusedSuspectId, setAccusedSuspectId] = useState<string | null>(
    accusationResult?.suspectId || null
  );
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(
    accusationResult?.selectedClueIds || []
  );
  const [selectedMotiveId, setSelectedMotiveId] = useState<string | null>(
    accusationResult?.selectedMotiveId || null
  );
  const [isEditingAccusation, setIsEditingAccusation] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const cluesCollectedCount = discoveredClueIds.length;
  const totalClues = clues.length;
  const progressPercent = Math.round((cluesCollectedCount / totalClues) * 100);

  const activeClue = clues.find((c) => c.id === selectedClueId);
  const activeExhibit = activeClue ? CLUE_EXHIBITS[activeClue.id] : null;

  const toggleEvidence = (clueId: string) => {
    setSelectedEvidenceIds((prev) =>
      prev.includes(clueId) ? prev.filter((id) => id !== clueId) : [...prev, clueId]
    );
  };

  const handleAccusationSubmit = () => {
    if (!accusedSuspectId) {
      setFormError("Please select the prime suspect you wish to indict.");
      return;
    }
    if (selectedEvidenceIds.length === 0) {
      setFormError("You must attach at least one piece of supporting evidence from your locker.");
      return;
    }
    if (!selectedMotiveId) {
      setFormError("Please identify the primary motive behind the murder.");
      return;
    }

    setFormError(null);
    submitAccusation(accusedSuspectId, selectedEvidenceIds, selectedMotiveId);
    setIsEditingAccusation(false);
  };

  const handleResetCase = () => {
    resetCase();
    setAccusedSuspectId(null);
    setSelectedEvidenceIds([]);
    setSelectedMotiveId(null);
    setIsEditingAccusation(false);
    setSelectedClueId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in-up space-y-10 motion-reduce:animate-none">
      <SectionHeader label="Case Archive // Indictment Chamber">
        Evidence Locker & Legal Accusation Board
      </SectionHeader>

      {/* ── TOP CHAIN OF CUSTODY STATUS BANNER ── */}
      <div className="espresso-panel rounded-2xl p-6 sm:p-7 border border-[#33261A] shadow-2xl relative overflow-hidden">
        {/* Subtle warm desk lamp glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(201,161,91,0.06)_0%,transparent_60%)] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#C9A15B] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C9A15B]" />
                FORENSIC CHAIN OF CUSTODY // CASE #CZ-2024-0731
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#100D08] text-[#D4C7B0] border border-[#33261A]">
                Floor 47 Homicide Inquest
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#E8DCC0] tracking-tight">
              Physical Evidence Vault ({cluesCollectedCount}/{totalClues} Exhibits Cataloged)
            </h2>
            <p className="text-xs sm:text-sm text-[#D4C7B0] mt-1.5 max-w-2xl leading-relaxed">
              Every physical exhibit recovered from Dr. Adrian Voss&apos;s executive suite is cataloged below with
              full laboratory spectrometry, chain of custody logs, and motive corroboration.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <div className="bg-[#100D08] border border-[#33261A] px-4 py-2.5 rounded-xl text-right">
              <span className="text-[10px] font-mono text-[#B3A184] uppercase tracking-wider block">
                Evidence Recovery
              </span>
              <span className="text-lg font-serif font-bold text-[#E8DCC0]">
                {progressPercent}% Complete
              </span>
            </div>
            <LinkButton href="/crime-scene" variant="secondary" className="text-xs py-3 px-4">
              <Search className="w-3.5 h-3.5 inline mr-1.5 text-[#C9A15B]" />
              Search Crime Scene
            </LinkButton>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#100D08] rounded-full h-2.5 overflow-hidden border border-[#33261A] mt-5 relative z-10">
          <div
            className="bg-gradient-to-r from-[#B8860B] via-[#C9A15B] to-[#EBDCB7] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ── SECTION 1: PHYSICAL EVIDENCE EXHIBITS (LOCKER) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#33261A]">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#C9A15B] font-mono font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#C9A15B]" />
              Physical Evidence Exhibits
            </span>
            <h3 className="text-xl font-serif font-bold text-[#E8DCC0] mt-0.5">
              Cataloged Forensic Artifacts
            </h3>
          </div>
          <span className="text-xs text-[#B3A184] font-mono hidden sm:inline">
            Click any exhibit card to inspect detailed laboratory analysis
          </span>
        </div>

        {/* 6 Clues Physical Exhibits Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clues.map((clue) => {
            const isDiscovered = discoveredClueIds.includes(clue.id);
            const isSelected = selectedClueId === clue.id;
            const exhibit = CLUE_EXHIBITS[clue.id];

            return (
              <button
                key={clue.id}
                type="button"
                onClick={() => {
                  if (isDiscovered) {
                    setSelectedClueId(isSelected ? null : clue.id);
                  }
                }}
                className={`text-left rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col group ${
                  !isDiscovered
                    ? "bg-[#14100B] border-[#2A1E14] opacity-70 hover:opacity-85"
                    : isSelected
                    ? "bg-[#241B11] border-[#C9A15B] shadow-2xl ring-1 ring-[#C9A15B]/50 scale-[1.01]"
                    : "espresso-panel hover:border-[#C9A15B]/50 hover:bg-[#241B11]"
                }`}
              >
                {/* Physical Evidence Photo Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#100D08] border-b border-[#33261A]">
                  {isDiscovered ? (
                    <>
                      <Image
                        src={exhibit.image}
                        alt={clue.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out motion-reduce:transition-none"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#17130E] via-transparent to-transparent opacity-80 pointer-events-none" />

                      {/* Exhibit ID Tag */}
                      <div className="absolute top-3 left-3 bg-[#17130E]/90 border border-[#C9A15B]/40 px-2 py-0.5 rounded text-[11px] font-mono text-[#C9A15B] font-bold shadow-md">
                        {exhibit.exhibitNumber}
                      </div>

                      {/* Cataloged Pill */}
                      <div className="absolute top-3 right-3 bg-[#2D6A4F]/90 border border-[#34D399]/40 px-2 py-0.5 rounded text-[10px] font-mono text-[#34D399] font-bold shadow-md">
                        ✓ Cataloged
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#100D08]/90 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#17130E] border border-[#33261A] flex items-center justify-center mb-2.5 text-[#7A664F]">
                        <Lock className="w-5 h-5 text-[#C9A15B]/60" />
                      </div>
                      <span className="text-[11px] font-mono text-[#C9A15B] font-bold uppercase tracking-wider">
                        {exhibit.exhibitNumber} • PENDING RECOVERY
                      </span>
                      <p className="text-xs text-[#B3A184] mt-1 max-w-xs">
                        Investigate {clue.location} at the crime scene to recover this exhibit.
                      </p>
                    </div>
                  )}
                </div>

                {/* Exhibit Details Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#B3A184] font-semibold truncate">
                        {isDiscovered ? exhibit.category : "Uncataloged Physical Lead"}
                      </span>
                    </div>

                    <h4
                      className={`text-base font-serif font-bold leading-snug ${
                        isDiscovered ? "text-[#E8DCC0]" : "text-[#B3A184]"
                      }`}
                    >
                      {isDiscovered ? clue.name : "Unrecovered Forensic Item"}
                    </h4>

                    <p className="text-xs font-mono text-[#C9A15B] mt-1 truncate">
                      {isDiscovered ? `📍 ${clue.location}` : "Search at Crime Scene"}
                    </p>

                    <p className="text-xs text-[#D4C7B0] leading-relaxed mt-2 line-clamp-2">
                      {isDiscovered
                        ? clue.description
                        : "Examine the crime scene to lift fingerprints, recover particulates, and unlock this clue."}
                    </p>
                  </div>

                  {/* Exhibit Footer Badge with exact "✓ Cataloged" text preserved for tests */}
                  <div className="pt-3 border-t border-[#33261A] flex items-center justify-between text-xs font-mono">
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        isDiscovered ? "text-[#34D399]" : "text-[#7A664F]"
                      }`}
                    >
                      {isDiscovered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                          ✓ Cataloged
                        </>
                      ) : (
                        "Missing Lead"
                      )}
                    </span>

                    {isDiscovered && (
                      <span className="text-[#C9A15B] text-[11px] font-bold underline decoration-[#C9A15B]/40 hover:text-white">
                        {isSelected ? "Collapse Dossier" : "Inspect Forensic Report →"}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── SELECTED EVIDENCE EXPANDED DOSSIER (PARCHMENT INSPECTION) ── */}
        {activeClue && activeExhibit && (
          <div className="mt-6 p-6 sm:p-8 rounded-2xl parchment-sheet shadow-2xl animate-fade-in-up border-[#C5B48E]">
            <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-[#C5B48E]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#754E18] font-bold">
                    METROPOLITAN CRIME LAB // FORENSIC REPORT // {activeExhibit.exhibitNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#754E18]/15 text-[#17130E] border border-[#754E18]/30">
                    CHAIN OF CUSTODY VERIFIED
                  </span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-serif font-black text-[#17130E]">
                  {activeClue.name}
                </h4>
                <p className="text-xs font-mono text-[#5C4733] mt-1 font-semibold">
                  Location Secured: {activeClue.location}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedClueId(null)}
                className="text-xs font-mono font-bold text-[#4A3527] hover:text-[#17130E] px-3 py-1.5 rounded-lg border border-[#C5B48E] hover:bg-[#FAF4E6] cursor-pointer shrink-0"
              >
                Close Report ✕
              </button>
            </div>

            <div className="grid md:grid-cols-[300px_1fr] gap-6 items-start">
              {/* Large Evidence Photo */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-[#C5B48E] shadow-md bg-[#FAF4E6]">
                <Image
                  src={activeExhibit.image}
                  alt={activeClue.name}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
                <div className="absolute bottom-2 left-2 bg-[#17130E]/80 text-[#EBDCB7] px-2 py-0.5 rounded text-[10px] font-mono">
                  {activeExhibit.exhibitNumber}
                </div>
              </div>

              {/* Detailed Forensic Notes */}
              <div className="space-y-4 text-[#17130E]">
                <div>
                  <h5 className="text-xs uppercase font-mono font-bold text-[#754E18] mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#754E18]" />
                    Physical Evidence Description & Spectrometry:
                  </h5>
                  <p className="text-sm leading-relaxed text-[#17130E] font-medium">
                    {activeClue.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF4E6] border border-[#C5B48E]">
                  <h5 className="text-xs uppercase font-mono font-bold text-[#754E18] mb-1 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#754E18]" />
                    Investigative Significance & Motive Corroboration:
                  </h5>
                  <p className="text-xs sm:text-sm italic text-[#17130E] leading-relaxed">
                    {activeClue.significance}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#FAF4E6]/60 border border-[#C5B48E] text-[11px] font-mono text-[#5C4733]">
                  <span className="font-bold text-[#754E18]">CHAIN OF CUSTODY LOG:</span>{" "}
                  {activeExhibit.chainOfCustody}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 2: EVIDENCE CONNECTIONS INVESTIGATIVE BOARD ── */}
      <div className="espresso-panel rounded-2xl p-6 sm:p-7 border border-[#33261A] shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#33261A] flex-wrap gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C9A15B] font-bold flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-[#C9A15B]" />
              FORENSIC HYPOTHESIS MAPPING // CANONICAL TIMELINE
            </span>
            <h3 className="text-xl font-serif font-black text-[#E8DCC0] mt-0.5">
              Investigative Connections & Contradictions
            </h3>
          </div>
          <span className="text-xs font-mono text-[#D4C7B0]">
            6 Verified Factual Corroborations
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#D4C7B0] leading-relaxed max-w-3xl">
          The homicide board connects physical findings to suspect motives, alibis, and timeline events.
          Discovered exhibits illuminate undeniable links and dismantle false alibis.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              clueId: "clue-1",
              title: "Cracked Tablet",
              linkTarget: "Elena's $504M Motive",
              status: "Proves Motive",
              note: "Unsent email confirms Voss was canceling the IPO due to Elena's benchmark fraud, destroying her equity.",
            },
            {
              clueId: "clue-2",
              title: "Laced Whiskey Glass",
              linkTarget: "Premeditated Sedation",
              status: "Proves Method",
              note: "Chemical analysis proved 10mg Diazepam (Valium) in scotch, matching Elena's prescription.",
            },
            {
              clueId: "clue-3",
              title: "Security Override Log",
              linkTarget: "Floor 46 Executive Terminal",
              status: "Refutes Alibi",
              note: "12-minute camera blackout (10:30–10:42 PM) originated from Elena's desk, not Diana's control post.",
            },
            {
              clueId: "clue-4",
              title: "Ceiling Vent Grate",
              linkTarget: "Manufactured Break-In",
              status: "Exposes Staging",
              note: "Unscrewed grate was a staged distraction; thick undisturbed dust proves zero intruder transit.",
            },
            {
              clueId: "clue-5",
              title: "Monogrammed Cufflink",
              linkTarget: "Elena's Physical Presence",
              status: "Direct Physical Link",
              note: "Platinum cufflink engraved 'E.M.' stained with Dr. Voss's Type-A blood recovered behind desk.",
            },
            {
              clueId: "clue-6",
              title: "Vending Receipt",
              linkTarget: "Marcus Chen Exoneration",
              status: "Proves Alibi",
              note: "Timestamp 10:36 PM on Floor 14 proves Chen was 33 floors below during the fatal strike window.",
            },
          ].map((conn, i) => {
            const isProven = discoveredClueIds.includes(conn.clueId);

            return (
              <div
                key={i}
                className={`p-4 rounded-xl border transition-all ${
                  isProven
                    ? "bg-[#17130E] border-[#C9A15B]/40 shadow-md"
                    : "bg-[#100D08]/60 border-[#33261A] opacity-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#33261A] text-xs font-mono">
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      isProven ? "text-[#C9A15B]" : "text-[#7A664F]"
                    }`}
                  >
                    {isProven ? "✓" : "🔒"} {conn.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      isProven
                        ? "bg-[#C9A15B]/15 text-[#E8DCC0] border border-[#C9A15B]/30"
                        : "bg-[#17130E] text-[#7A664F] border border-[#33261A]"
                    }`}
                  >
                    {conn.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-serif font-bold text-[#E8DCC0]">
                    → {conn.linkTarget}
                  </span>
                </div>

                <p className="text-xs text-[#D4C7B0] leading-relaxed">
                  {isProven
                    ? conn.note
                    : "Examine the crime scene to uncover this corroborating connection."}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3: FINAL GRAND JURY ACCUSATION DOSSIER ── */}
      <div className="espresso-panel border-2 border-[#9E2A2B]/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Header Banner */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3 pb-3 border-b border-[#33261A]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#F87171] font-bold flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#F87171]" />
              CONFIDENTIAL INDICTMENT DOSSIER // GRAND JURY SUBMISSION
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#E8DCC0] mt-0.5">
              Formal Murder Indictment
            </h3>
          </div>

          {accusationResult && (
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#C9A15B]/15 text-[#E8DCC0] border border-[#C9A15B]/30 font-bold">
              Current Verdict on Record: {accusationResult.rank} ({accusationResult.score}/100)
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-[#D4C7B0] mb-8 max-w-3xl leading-relaxed">
          You are preparing a formal indictment for the First-Degree Murder of Dr. Adrian Voss.
          Carefully select the prime suspect, attach your cataloged physical evidence, and establish the primary
          motive. An indictment without critical corroboration will collapse in court.
        </p>

        {/* Accusation Form (Shown when no verdict yet OR player clicked modify) */}
        {(!accusationResult || isEditingAccusation) && (
          <div className="space-y-8">
            {/* Step 1: Select Suspect */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono uppercase text-[#C9A15B] font-bold flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#C9A15B] text-[#100D08] flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Select Prime Suspect to Indict:
                </p>
                <span className="text-[11px] text-[#B3A184] font-mono">
                  {accusedSuspectId ? "1 Suspect Selected" : "Selection Required"}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {suspects.map((s) => {
                  const isSelected = accusedSuspectId === s.id;
                  const img = SUSPECT_IMAGES[s.id] || "/images/victim-adrian-voss.jpg";

                  return (
                    <button
                      key={s.id}
                      type="button"
                      data-testid={`accuse-suspect-${s.id}`}
                      onClick={() => setAccusedSuspectId(s.id)}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#9E2A2B]/20 border-[#9E2A2B] text-white shadow-xl ring-2 ring-[#9E2A2B]/60 scale-[1.01]"
                          : "bg-[#17130E] border-[#33261A] text-[#B3A184] hover:border-[#C9A15B]/40 hover:text-[#E8DCC0]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#33261A]">
                          <Image
                            src={img}
                            alt={s.name}
                            fill
                            className="object-cover object-top"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`font-serif font-bold text-sm ${
                              isSelected ? "text-[#F87171]" : "text-[#E8DCC0]"
                            }`}
                          >
                            {s.name}
                          </p>
                          <p className="text-[11px] text-[#B3A184] font-mono leading-tight mt-0.5">
                            {s.role}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Supporting Evidence */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-xs font-mono uppercase text-[#C9A15B] font-bold flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#C9A15B] text-[#100D08] flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  Attach Corroborating Physical Evidence ({selectedEvidenceIds.length} Selected):
                </p>
                <span className="text-[11px] text-[#B3A184] font-mono">
                  Only cataloged exhibits can be entered into evidence
                </span>
              </div>

              {cluesCollectedCount === 0 ? (
                <div className="p-4 rounded-xl bg-[#17130E] border border-[#C9A15B]/30 text-xs text-[#E8DCC0]">
                  ⚠️ You have not cataloged any clues yet! Visit the Crime Scene to recover physical evidence before submitting.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {clues.map((clue) => {
                    const isCollected = discoveredClueIds.includes(clue.id);
                    const isChecked = selectedEvidenceIds.includes(clue.id);
                    const exhibit = CLUE_EXHIBITS[clue.id];

                    return (
                      <button
                        key={clue.id}
                        type="button"
                        data-testid={`accuse-evidence-${clue.id}`}
                        disabled={!isCollected}
                        onClick={() => toggleEvidence(clue.id)}
                        className={`text-left p-3.5 rounded-xl border text-xs transition-all flex items-center gap-3 cursor-pointer ${
                          !isCollected
                            ? "bg-[#17130E]/40 border-[#33261A] text-[#7A664F] cursor-not-allowed opacity-50"
                            : isChecked
                            ? "bg-[#C9A15B]/20 border-[#C9A15B] text-[#E8DCC0] shadow-md shadow-[#C9A15B]/10 ring-1 ring-[#C9A15B]/40"
                            : "bg-[#17130E] border-[#33261A] text-[#B3A184] hover:border-[#C9A15B]/40 hover:text-[#E8DCC0]"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md border flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                            isChecked
                              ? "bg-[#C9A15B] text-[#100D08] border-[#C9A15B]"
                              : "border-[#4A3527] bg-[#100D08] text-transparent"
                          }`}
                        >
                          ✓
                        </span>

                        <div className="relative w-9 h-9 rounded overflow-hidden shrink-0 border border-[#33261A]">
                          <Image
                            src={exhibit.image}
                            alt={clue.name}
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-serif font-bold text-[#E8DCC0] truncate">
                            {clue.name}
                          </p>
                          <p className="text-[10px] text-[#B3A184] font-mono truncate">
                            {exhibit.exhibitNumber} • {clue.location}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 3: Select Motive Theory */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono uppercase text-[#C9A15B] font-bold flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#C9A15B] text-[#100D08] flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  Establish Primary Motive Theory:
                </p>
                <span className="text-[11px] text-[#B3A184] font-mono">
                  {selectedMotiveId ? "1 Theory Selected" : "Selection Required"}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {MOTIVE_OPTIONS.map((m) => {
                  const isSelected = selectedMotiveId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      data-testid={`accuse-motive-${m.id}`}
                      onClick={() => setSelectedMotiveId(m.id)}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#9E2A2B]/20 border-[#9E2A2B] text-white ring-1 ring-[#9E2A2B]/60 shadow-md"
                          : "bg-[#17130E] border-[#33261A] text-[#B3A184] hover:border-[#C9A15B]/30 hover:text-[#E8DCC0]"
                      }`}
                    >
                      <p className="font-serif font-bold text-sm text-[#E8DCC0] mb-1">
                        {m.label}
                      </p>
                      <p className="text-xs text-[#D4C7B0] leading-relaxed">
                        {m.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message Notice */}
            {formError && (
              <div
                data-testid="form-error"
                className="p-3.5 rounded-xl bg-[#9E2A2B]/20 border border-[#9E2A2B]/40 text-[#F87171] text-xs font-medium flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Submit Indictment Button */}
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                data-testid="submit-indictment-btn"
                onClick={handleAccusationSubmit}
                className="px-8 py-3.5 bg-gradient-to-r from-[#9E2A2B] to-[#851E1F] hover:from-[#BF3839] hover:to-[#9E2A2B] text-white font-serif font-bold text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-[#9E2A2B]/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Scale className="w-4 h-4" />
                Submit Indictment to Grand Jury
              </button>

              <LinkButton href="/interrogation" variant="secondary">
                💬 Return to Interrogation Room
              </LinkButton>
            </div>
          </div>
        )}

        {/* ── FINAL VERDICT DISPLAY COMPONENT ── */}
        {accusationResult && !isEditingAccusation && (
          <AccusationResultCard
            result={accusationResult}
            onReopen={() => {
              setIsEditingAccusation(true);
              setFormError(null);
            }}
            onRestart={handleResetCase}
          />
        )}
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex flex-wrap gap-4 pt-4 border-t border-[#33261A]">
        <LinkButton href="/crime-scene" variant="secondary">
          🚨 Return to Crime Scene
        </LinkButton>
        <LinkButton href="/interrogation" variant="secondary">
          💬 Interrogation Room
        </LinkButton>
        <LinkButton href="/briefing" variant="secondary">
          📋 Case Briefing
        </LinkButton>
        <LinkButton href="/" variant="secondary">
          🏠 Main Dossier
        </LinkButton>
      </div>
    </div>
  );
}

function AccusationResultCard({
  result,
  onReopen,
  onRestart,
}: {
  result: AccusationResult;
  onReopen: () => void;
  onRestart: () => void;
}) {
  const accused = suspects.find((s) => s.id === result.suspectId) || suspects[0];
  const isMaster = result.rank === "Master Detective";

  return (
    <div className="animate-fade-in-up space-y-6 motion-reduce:animate-none">
      {/* Verdict Header Banner */}
      <div
        className={`p-6 sm:p-7 rounded-2xl border ${
          isMaster
            ? "bg-[#2D6A4F]/25 border-[#34D399]/40 text-[#34D399]"
            : result.score >= 70
            ? "bg-[#C9A15B]/20 border-[#C9A15B]/50 text-[#E8DCC0]"
            : "bg-[#9E2A2B]/25 border-[#9E2A2B]/60 text-[#F87171]"
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#33261A] shadow-md">
              <Image
                src={SUSPECT_IMAGES[accused.id] || "/images/victim-adrian-voss.jpg"}
                alt={accused.name}
                fill
                className="object-cover object-top"
                sizes="56px"
              />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#B3A184]">
                METROPOLITAN GRAND JURY // OFFICIAL EVALUATION
              </p>
              <h4
                data-testid="verdict-title"
                className="text-2xl sm:text-3xl font-serif font-black text-[#E8DCC0] mt-0.5"
              >
                {result.verdict}
              </h4>
            </div>
          </div>

          <div className="text-right font-mono">
            <p
              data-testid="verdict-score"
              className="text-3xl sm:text-4xl font-serif font-black text-white"
            >
              {result.score} / 100
            </p>
            <p
              data-testid="verdict-rank"
              className="text-xs sm:text-sm text-[#C9A15B] font-bold mt-0.5 flex items-center justify-end gap-1"
            >
              <Award className="w-4 h-4 text-[#C9A15B]" />
              {result.rank}
            </p>
          </div>
        </div>

        {/* Score Breakdown Grid */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono pt-4 border-t border-white/10">
          <div className="bg-[#100D08] p-3 rounded-xl border border-[#33261A]">
            <span className="text-[#B3A184] block text-[10px] uppercase font-bold">
              Culprit Match
            </span>
            <span className="font-bold text-[#E8DCC0] text-sm mt-0.5 block">
              {result.breakdown.suspectScore} / 40
            </span>
          </div>
          <div className="bg-[#100D08] p-3 rounded-xl border border-[#33261A]">
            <span className="text-[#B3A184] block text-[10px] uppercase font-bold">
              Evidence Proof
            </span>
            <span className="font-bold text-[#E8DCC0] text-sm mt-0.5 block">
              {result.breakdown.evidenceScore} / 40
            </span>
          </div>
          <div className="bg-[#100D08] p-3 rounded-xl border border-[#33261A]">
            <span className="text-[#B3A184] block text-[10px] uppercase font-bold">
              Motive Theory
            </span>
            <span className="font-bold text-[#E8DCC0] text-sm mt-0.5 block">
              {result.breakdown.motiveScore} / 20
            </span>
          </div>
        </div>
      </div>

      {/* Narrative Court Outcome */}
      <div className="bg-[#17130E] border border-[#33261A] rounded-2xl p-6 shadow-md">
        <h5 className="text-xs uppercase font-mono tracking-widest text-[#C9A15B] font-bold mb-2 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[#C9A15B]" />
          Court Proceedings & Trial Outcome
        </h5>
        <p className="text-[#E8DCC0] text-sm leading-relaxed whitespace-pre-line font-sans">
          {result.narrative}
        </p>
      </div>

      {/* The Full Case Truth Dossier */}
      <div className="bg-[#17130E] border border-[#C9A15B]/30 rounded-2xl p-6 shadow-md">
        <h5 className="text-xs uppercase font-mono tracking-widest text-[#C9A15B] font-bold mb-3 flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#C9A15B]" />
          The Canonical Truth of Case #CZ-2024-0731
        </h5>
        <div className="text-[#E8DCC0] text-xs sm:text-sm leading-relaxed font-mono whitespace-pre-line bg-[#100D08] p-5 rounded-xl border border-[#33261A]">
          {result.truthExplanation}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap gap-4 pt-2">
        <button
          type="button"
          data-testid="modify-accusation-btn"
          onClick={onReopen}
          className="px-6 py-3 rounded-xl text-xs font-mono font-bold bg-[#241B11] hover:bg-[#2D2115] text-[#E8DCC0] border border-[#33261A] transition-all cursor-pointer flex items-center gap-2 shadow-md hover:border-[#C9A15B]/40"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#C9A15B]" />
          Modify Accusation / Review Facts
        </button>

        <button
          type="button"
          data-testid="restart-case-btn"
          onClick={onRestart}
          className="px-6 py-3 rounded-xl text-xs font-mono font-bold bg-[#9E2A2B]/20 hover:bg-[#9E2A2B]/30 text-[#F87171] border border-[#9E2A2B]/40 transition-all cursor-pointer flex items-center gap-2 shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#F87171]" />
          Restart Case File from Beginning
        </button>
      </div>
    </div>
  );
}
