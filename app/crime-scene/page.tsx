"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Sparkles,
  CheckCircle2,
  Scan,
  Lock,
  Eye,
  Compass,
  ShieldCheck,
} from "lucide-react";
import { crimeSceneHotspots, clues } from "../lib/data";
import { useGameState } from "../lib/gameState";
import LinkButton from "../components/LinkButton";

export default function CrimeScenePage() {
  const { discoveredClueIds, discoverClue, examineHotspot } = useGameState();
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [actionAlert, setActionAlert] = useState<{ message: string; isNew: boolean } | null>(null);

  const activeHotspot = crimeSceneHotspots.find((h) => h.id === activeHotspotId);
  const linkedClue = activeHotspot?.clueId ? clues.find((c) => c.id === activeHotspot.clueId) : null;
  const isClueDiscovered = linkedClue ? discoveredClueIds.includes(linkedClue.id) : false;

  function handleHotspotClick(hotspotId: string, clueId: string | null) {
    setActiveHotspotId(hotspotId);

    if (clueId) {
      const { newlyDiscovered, clueName } = discoverClue(clueId, hotspotId);
      if (newlyDiscovered) {
        setActionAlert({
          message: `⭐ DISCOVERED NEW EVIDENCE: ${clueName}! Added to your Evidence Locker.`,
          isNew: true,
        });
      } else {
        setActionAlert({
          message: `Already cataloged: ${clueName}. Inspected again for details.`,
          isNew: false,
        });
      }
    } else {
      examineHotspot(hotspotId);
      setActionAlert(null);
    }
  }

  const cluesFoundCount = discoveredClueIds.length;
  const totalClues = clues.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in-up space-y-8 sm:space-y-10">
      {/* ── FORENSIC HUD HEADER ── */}
      <div className="espresso-panel rounded-2xl border border-[#33261A] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Watermark */}
        <div
          className="absolute -right-16 -top-16 w-80 h-80 rounded-full border border-[#C9A15B]/10 pointer-events-none flex items-center justify-center opacity-25 select-none"
          aria-hidden="true"
        >
          <div className="w-64 h-64 rounded-full border border-[#9E2A2B]/15 flex items-center justify-center">
            <span className="text-[120px] font-black text-[#C9A15B]/10 select-none font-mono">SC</span>
          </div>
        </div>

        {/* Agency Classification Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#33261A] text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-2.5">
            <span className="confidential-stamp-sm">
              <Scan className="w-3.5 h-3.5 text-[#9E2A2B] animate-pulse inline mr-1" />
              FORENSIC INVESTIGATION // LIVE SCENE
            </span>
            <span className="hidden sm:inline text-[#5C4733] font-bold">•</span>
            <span className="hidden sm:inline text-[#E8DCC0] uppercase tracking-widest text-xs font-semibold">
              CASE #CZ-2024-0731
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#C9A15B]/15 border border-[#C9A15B]/35 text-[#E8DCC0] font-bold tracking-wider text-xs font-mono">
              <Compass className="w-3.5 h-3.5 text-[#C9A15B]" />
              FLOOR 47 CORNER SUITE
            </span>
            <span className="text-[#B3A184] text-xs font-mono font-medium">SEALED AT 11:47 PM</span>
          </div>
        </div>

        {/* Header Title & Instructions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#C9A15B] text-xs sm:text-sm uppercase tracking-[0.25em] font-mono mb-2 font-bold">
              <span>PHYSICAL RECONNAISSANCE</span>
              <span className="text-[#5C4733]">{"//"}</span>
              <span>EXECUTIVE OFFICE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#E8DCC0] tracking-tight">
              Floor 47 — Executive Office
            </h1>
            <p className="mt-3 text-[#B3A184] text-base sm:text-lg max-w-3xl leading-relaxed">
              Examine the sealed crime scene. Click or tap suspicious forensic artifacts, architectural fixtures, and points of interest
              to uncover physical clues, reconstruct the timeline, and collect evidence.
            </p>
          </div>

          {/* Recovery Counter Card */}
          <div className="shrink-0 bg-[#17130E] border border-[#33261A] rounded-xl p-4 sm:p-5 shadow-lg min-w-[220px]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs uppercase font-mono text-[#B3A184] font-semibold">Forensic Recovery</span>
              <span className="text-xs font-mono font-bold text-[#C9A15B]">
                {Math.round((cluesFoundCount / totalClues) * 100)}%
              </span>
            </div>
            <div className="text-2xl font-serif font-black text-[#E8DCC0] mb-2.5">
              {cluesFoundCount} <span className="text-sm font-normal text-[#B3A184] font-mono">/ {totalClues} Clues</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#100D08] rounded-full h-2 overflow-hidden border border-[#33261A]">
              <div
                className="bg-gradient-to-r from-[#B8860B] to-[#E8DCC0] h-2 rounded-full transition-all duration-500"
                style={{ width: `${(cluesFoundCount / totalClues) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTION NOTIFICATION ALERT ── */}
      {actionAlert && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between animate-fade-in-up shadow-xl ${
            actionAlert.isNew
              ? "bg-[#C9A15B]/15 border-[#C9A15B]/40 text-[#E8DCC0]"
              : "bg-[#17130E] border-[#33261A] text-[#E8DCC0]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl shrink-0">{actionAlert.isNew ? "⭐" : "🔎"}</span>
            <span className="font-medium text-sm sm:text-base">{actionAlert.message}</span>
          </div>
          <button
            onClick={() => setActionAlert(null)}
            className="text-[#B3A184] hover:text-white px-3 py-1 text-xs rounded-lg border border-[#33261A] hover:border-[#C9A15B]/40 transition-colors shrink-0 font-mono cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── CRIME SCENE INTERACTIVE VIEWPORT (MAIN FOCUS) ── */}
      <div className="relative rounded-2xl overflow-hidden border border-[#33261A] bg-[#100D08] shadow-2xl group flex flex-col">
        {/* Terminal Surveillance HUD Chrome */}
        <div className="px-4 sm:px-6 py-3 bg-[#17130E] border-b border-[#33261A] flex items-center justify-between text-xs font-mono z-30">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9E2A2B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C53030]" />
            </span>
            <span className="text-[#F87171] font-bold uppercase tracking-wider text-[11px] sm:text-xs">
              LIVE SURVEILLANCE FEED // 11:47:00 PM
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#B3A184] text-[11px] font-mono">
            <span className="hidden sm:inline">OPTICAL ZOOM: 1.0X</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">CAM-47-EXEC // SENSOR RAW</span>
            <span className="text-[#C9A15B] font-semibold">8 HOTSPOTS ACTIVE</span>
          </div>
        </div>

        {/* 16:9 Aspect Ratio Viewport Container (Required for test selector & responsiveness) */}
        <div className="relative w-full aspect-[16/9] bg-[#100D08] overflow-hidden select-none">
          {/* High-Resolution Crime Scene Environment Artwork */}
          <Image
            src="/images/crime-scene-interactive.jpg"
            alt="Dr. Voss's 47th floor executive office crime scene at night showing rain covered panoramic skyscraper windows, executive desk with banker lamp, overturned glass, cracked tablet, and dangling ventilation vent"
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1152px"
            className="object-cover object-center pointer-events-none"
          />

          {/* Layer 1: Volumetric Amber Desk Lamp Glow */}
          <div
            className="absolute inset-0 pointer-events-none animate-glow-pulse"
            style={{
              background:
                "radial-gradient(ellipse 45% 35% at 44% 56%, rgba(201, 161, 91, 0.28) 0%, rgba(184, 134, 11, 0.1) 36%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* Layer 2: Cool Rain Mist & Skyline Ambient Lighting */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 65% 50% at 85% 35%, rgba(201, 161, 91, 0.08) 0%, rgba(35, 27, 20, 0.12) 40%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* Layer 3: Warm Vintage Vignette */}
          <div className="absolute inset-0 pointer-events-none vintage-vignette" aria-hidden="true" />

          {/* Layer 4: Interactive Hotspots Over Objects */}
          {crimeSceneHotspots.map((h) => {
            const isSelected = activeHotspotId === h.id;
            const hasClue = h.clueId !== null;
            const isCollected = h.clueId ? discoveredClueIds.includes(h.clueId) : false;

            return (
              <button
                key={h.id}
                onClick={() => handleHotspotClick(h.id, h.clueId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleHotspotClick(h.id, h.clueId);
                  }
                }}
                className="absolute group z-20 focus:outline-none cursor-pointer"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                aria-label={h.label}
                aria-expanded={isSelected}
                tabIndex={0}
              >
                {/* Animated Radar Pulse Ring for Undiscovered Evidence */}
                {hasClue && !isCollected && (
                  <span
                    className="absolute inset-0 -m-2 sm:-m-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#C9A15B]/35 hotspot-ring pointer-events-none"
                    aria-hidden="true"
                  />
                )}

                {/* Hotspot Marker Badge */}
                <span
                  className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-300 font-mono text-xs font-bold shadow-xl backdrop-blur-sm ${
                    isSelected
                      ? "bg-[#C9A15B] text-[#100D08] border-white scale-125 shadow-[#C9A15B]/70 ring-4 ring-[#C9A15B]/40"
                      : isCollected
                      ? "bg-[#2D6A4F] text-white border-[#34D399] shadow-[#2D6A4F]/30 hover:scale-115"
                      : hasClue
                      ? "bg-[#C9A15B] text-[#100D08] border-[#FAF6EB] shadow-[#C9A15B]/40 hover:scale-115"
                      : "bg-[#241B11] text-[#E8DCC0] border-[#33261A] shadow-black/50 hover:scale-115 hover:bg-[#33261A]"
                  }`}
                >
                  {isCollected ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : hasClue ? (
                    <Search className="w-4 h-4 text-[#100D08]" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-[#E8DCC0]" />
                  )}
                </span>

                {/* Hover / Focus Tooltip */}
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-200 pointer-events-none z-30 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#17130E]/95 border border-[#C9A15B]/40 text-xs font-mono font-bold text-[#E8DCC0] shadow-2xl backdrop-blur-md">
                    <span>{h.label}</span>
                    {isCollected ? (
                      <span className="text-[#34D399] text-[10px] uppercase font-semibold">✓ Cataloged</span>
                    ) : hasClue ? (
                      <span className="text-[#C9A15B] text-[10px] uppercase font-semibold">★ Inspect Evidence</span>
                    ) : (
                      <span className="text-[#B3A184] text-[10px] uppercase font-semibold">Recon</span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Viewport Footer Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#17130E] border-t border-[#33261A] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#B3A184]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C9A15B] animate-glow-pulse" />
            <span className="text-[#E8DCC0]">Click or tap any highlighted object or use keyboard Tab to navigate</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#E8DCC0]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9A15B] inline-block" />
              Unrecovered Clue
            </span>
            <span className="flex items-center gap-1.5 text-[#34D399]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F] inline-block" />
              Cataloged
            </span>
            <span className="flex items-center gap-1.5 text-[#B3A184]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#33261A] inline-block" />
              Scene Context
            </span>
          </div>
        </div>
      </div>

      {/* ── SELECTED HOTSPOT FORENSIC INSPECTION DOSSIER ── */}
      {activeHotspot ? (
        <div className="animate-fade-in-up rounded-2xl espresso-panel border border-[#33261A] p-6 sm:p-8 shadow-2xl">
          <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#33261A]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#17130E] border border-[#C9A15B]/35 flex items-center justify-center text-2xl shrink-0 shadow-md">
                {linkedClue ? linkedClue.icon : "🔎"}
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#C9A15B] uppercase tracking-widest font-bold">
                  <span>FORENSIC INSPECTION DOSSIER</span>
                  <span className="text-[#5C4733]">{"//"}</span>
                  <span>{activeHotspot.id.toUpperCase()}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-[#E8DCC0] tracking-tight">
                  {activeHotspot.label}
                </h3>
              </div>
            </div>

            {/* Status Badge */}
            {linkedClue ? (
              <span
                className={`text-xs px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider border shadow-sm ${
                  isClueDiscovered
                    ? "bg-[#2D6A4F]/20 text-[#34D399] border-[#2D6A4F]/50"
                    : "bg-[#C9A15B]/20 text-[#E8DCC0] border-[#C9A15B]/50 animate-pulse"
                }`}
              >
                {isClueDiscovered ? "✓ Cataloged in Evidence Locker" : "⚠️ Uncollected Physical Evidence"}
              </span>
            ) : (
              <span className="text-xs px-3 py-1 rounded-full font-mono font-semibold uppercase tracking-wider bg-[#17130E] text-[#B3A184] border border-[#33261A]">
                Environmental Recon
              </span>
            )}
          </div>

          {/* Narrative Inspection Description */}
          <p className="text-[#E8DCC0] text-base sm:text-lg leading-relaxed mb-6 font-normal">
            {activeHotspot.description}
          </p>

          {/* Detailed Linked Clue Breakdown */}
          {linkedClue ? (
            <div className="bg-[#17130E] border border-[#33261A] rounded-xl p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#33261A]">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#C9A15B] font-mono font-bold">
                    Forensic Evidence Item:
                  </span>
                  <span className="text-[#E8DCC0] font-serif font-bold text-base sm:text-lg">{linkedClue.name}</span>
                </div>
                <span className="text-xs font-mono text-[#B3A184]">
                  CHAIN OF CUSTODY // CLUE ID: {linkedClue.id.toUpperCase()}
                </span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider font-mono text-[#B3A184] mb-1 font-semibold">
                  Physical Evidence Analysis
                </p>
                <p className="text-sm sm:text-base text-[#E8DCC0] leading-relaxed font-normal">
                  {linkedClue.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#33261A] flex items-start gap-3 bg-[#C9A15B]/5 rounded-lg p-3.5 border border-[#C9A15B]/20">
                <Sparkles className="w-5 h-5 text-[#C9A15B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#E8DCC0] font-mono font-bold block mb-0.5">
                    Investigative Significance
                  </span>
                  <p className="text-xs sm:text-sm text-[#E8DCC0] italic font-medium leading-relaxed">
                    {linkedClue.significance}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#17130E] border border-[#33261A] rounded-xl p-4 sm:p-5 text-sm text-[#B3A184] flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#C9A15B] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs uppercase tracking-wider font-mono text-[#C9A15B] font-bold block mb-1">
                  Detective Observation:
                </span>
                <p className="leading-relaxed">
                  No removable physical evidence found on this architectural feature, but its structural and log status
                  provides vital corroborating context for Dr. Voss&apos;s locked-room environment.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#33261A] bg-[#17130E]/60 p-6 text-center text-sm font-mono text-[#B3A184]">
          Click any active marker on the crime scene feed above to inspect artifacts and collect forensic evidence.
        </div>
      )}

      {/* ── DISCOVERED EVIDENCE LOCKER PREVIEW ── */}
      <div className="rounded-2xl espresso-panel border border-[#33261A] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-[#33261A]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C9A15B]" />
            <h2 className="text-sm sm:text-base uppercase tracking-widest text-[#C9A15B] font-mono font-bold">
              Evidence Locker ({cluesFoundCount}/{totalClues} Cataloged)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#B3A184]">Persisted in local case file</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clues.map((c) => {
            const isFound = discoveredClueIds.includes(c.id);
            return (
              <div
                key={c.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  isFound
                    ? "bg-[#17130E] border-[#2D6A4F]/50 text-[#E8DCC0] shadow-md"
                    : "bg-[#17130E]/70 border-[#33261A] text-[#B3A184] opacity-60"
                }`}
              >
                <span className="text-2xl shrink-0 mt-0.5">{isFound ? c.icon : "🔒"}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-serif font-bold text-[#E8DCC0] truncate">{isFound ? c.name : "Uncataloged Evidence"}</p>
                  <p className="text-xs text-[#B3A184] truncate mt-0.5 font-mono">{isFound ? c.location : "Search Crime Scene"}</p>
                </div>
                {isFound ? (
                  <span className="text-[#34D399] text-xs font-mono font-bold bg-[#2D6A4F]/15 border border-[#2D6A4F]/40 px-2 py-0.5 rounded">
                    Cataloged
                  </span>
                ) : (
                  <span className="text-[#B3A184] text-xs font-mono bg-[#100D08] border border-[#33261A] px-2 py-0.5 rounded">
                    Uncollected
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── WORKING NAVIGATION BUTTONS ── */}
      <div className="rounded-2xl espresso-panel border border-[#33261A] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="text-center lg:text-left">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-[#C9A15B] font-mono mb-1.5 font-bold">
            Next Investigative Phase
          </p>
          <p className="text-sm sm:text-base text-[#B3A184] max-w-xl">
            Confront suspects with the evidence you gathered, assemble clues on the Evidence Board, or review the suspect profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 w-full lg:w-auto">
          <LinkButton href="/interrogation" className="w-full sm:w-auto">
            💬 Interrogate Suspects With Evidence →
          </LinkButton>
          <LinkButton href="/evidence" variant="secondary" className="w-full sm:w-auto">
            📌 View Evidence Board
          </LinkButton>
          <LinkButton href="/suspects" variant="secondary" className="w-full sm:w-auto">
            ← Suspect Profiles
          </LinkButton>
          <LinkButton href="/briefing" variant="secondary" className="w-full sm:w-auto">
            Review Briefing
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
