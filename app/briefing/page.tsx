import Image from "next/image";
import {
  ShieldAlert,
  Clock,
  Calendar,
  MapPin,
  Lock,
  FileText,
  AlertTriangle,
  Fingerprint,
  Camera,
  Activity,
  Skull,
  Eye,
  FileCheck2,
} from "lucide-react";
import { caseInfo } from "../lib/data";
import LinkButton from "../components/LinkButton";

export default function BriefingPage() {
  const { victim, summary, caseNumber, classification, date, time, location } = caseInfo;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in-up space-y-10 sm:space-y-12">
      {/* ── TOP CONFIDENTIAL CASEFILE DOSSIER HEADER ── */}
      <div className="parchment-sheet rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Classification Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[#C5B48E]/80 text-xs sm:text-sm font-mono">
          <div className="flex items-center gap-2.5">
            <span className="confidential-stamp">CONFIDENTIAL // HOMICIDE</span>
            <span className="hidden sm:inline text-[#5C4733]">•</span>
            <span className="hidden sm:inline text-[#17130E] uppercase tracking-wider font-bold">
              METROPOLITAN POLICE DEPARTMENT
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-[13px] font-mono font-bold text-[#100D08] bg-[#FAF6EB] border border-[#C5B48E] px-3 py-1 rounded">
              FILE: {caseNumber}
            </span>
            <span className="text-[#4A3525] text-xs sm:text-[13px] font-mono font-bold">CLEARANCE: DETECTIVE</span>
          </div>
        </div>

        {/* Title & Case Lead in Rich Dark Ink */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#754E18] text-xs sm:text-[13px] uppercase tracking-[0.25em] font-mono mb-2 font-bold">
              <span>HOMICIDE DOSSIER</span>
              <span className="text-[#C5B48E]">{"//"}</span>
              <span>SECTION 1: INCIDENT REPORT</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-[#100D08] tracking-tight">
              The Last Alibi
            </h1>
            <p className="mt-3.5 text-[#17130E] text-base sm:text-lg max-w-3xl leading-relaxed font-sans font-normal">
              Official preliminary investigative briefing into the locked-room homicide of tech founder Dr. Adrian Voss.
              Review all physical evidence, crime scene telemetry, and chronological timestamps before questioning suspects.
            </p>
          </div>

          {/* Red Stamp Badge */}
          <div className="inline-flex md:flex-col items-center justify-center px-5 py-3.5 rounded-xl border-2 border-[#9E2A2B] bg-[#9E2A2B]/10 text-[#9E2A2B] font-mono text-center tracking-widest uppercase shadow-md shrink-0">
            <span className="text-xs font-bold block mb-0.5">STATUS</span>
            <span className="text-base sm:text-lg font-black tracking-wider text-[#9E2A2B]">UNSOLVED</span>
          </div>
        </div>

        {/* Structured Docket Grid on Parchment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-[#17130E]">
          <div className="bg-[#FAF6EB] border border-[#C5B48E] rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#754E18] mb-1.5">
              <FileText className="w-4 h-4 text-[#754E18]" />
              <p className="text-xs uppercase tracking-wider font-mono font-bold">Case Docket</p>
            </div>
            <p className="text-lg font-serif font-black text-[#100D08]">{caseNumber}</p>
            <p className="text-xs sm:text-[13px] text-[#4A3525] mt-1 font-medium">Special Homicide Unit</p>
          </div>

          <div className="bg-[#FAF6EB] border border-[#C5B48E] rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#754E18] mb-1.5">
              <ShieldAlert className="w-4 h-4 text-[#754E18]" />
              <p className="text-xs uppercase tracking-wider font-mono font-bold">Classification</p>
            </div>
            <p className="text-lg font-serif font-black text-[#100D08]">{classification}</p>
            <p className="text-xs sm:text-[13px] text-[#4A3525] mt-1 font-medium">Override Suspected</p>
          </div>

          <div className="bg-[#FAF6EB] border border-[#C5B48E] rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#754E18] mb-1.5">
              <Calendar className="w-4 h-4 text-[#754E18]" />
              <p className="text-xs uppercase tracking-wider font-mono font-bold">Incident Date</p>
            </div>
            <p className="text-lg font-serif font-black text-[#100D08]">{date}</p>
            <p className="text-xs sm:text-[13px] text-[#4A3525] mt-1 font-medium">Late Evening Shift</p>
          </div>

          <div className="bg-[#FAF6EB] border-2 border-[#9E2A2B]/50 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#9E2A2B] mb-1.5">
              <Clock className="w-4 h-4 text-[#9E2A2B]" />
              <p className="text-xs uppercase tracking-wider font-mono font-bold">Body Discovered</p>
            </div>
            <p className="text-lg font-serif font-black text-[#9E2A2B]">{time}</p>
            <p className="text-xs sm:text-[13px] text-[#7A1D1E] mt-1 font-semibold">Night Guard Sweep</p>
          </div>
        </div>

        {/* Location Banner */}
        <div className="mt-5 bg-[#FAF6EB] border border-[#C5B48E] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-start sm:items-center gap-3">
            <MapPin className="w-4 h-4 text-[#754E18] shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-mono uppercase font-bold text-[#4A3525] mr-2 text-xs sm:text-sm">
                Primary Scene:
              </span>
              <span className="font-semibold text-[#100D08] text-sm sm:text-base">{location}</span>
            </div>
          </div>
          <span className="font-mono font-bold text-[#754E18] px-3 py-1.5 rounded bg-[#EBDCB7] border border-[#C5B48E] self-start sm:self-auto text-xs sm:text-[13px]">
            SUITE 4700 // NORTHEAST CORNER
          </span>
        </div>
      </div>

      {/* ── DUAL FORENSIC VISUALS: VICTIM PROFILE & CRIME SCENE EXHIBIT ── */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#33261A]">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#C9A15B]" />
            <h2 className="text-xs sm:text-sm uppercase tracking-widest text-[#C9A15B] font-mono font-bold">
              Forensic Photographic Exhibits // Section A
            </h2>
          </div>
          <span className="text-xs sm:text-[13px] font-mono text-[#D4C7B0]">ARCHIVE FILES V-01 & SC-47</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* ── LEFT: VICTIM PROFILE DOSSIER (COL 1-6) ── */}
          <div className="lg:col-span-6 flex flex-col rounded-2xl espresso-panel p-6 sm:p-8 shadow-xl border border-[#33261A]">
            <div className="flex items-center justify-between pb-3.5 mb-6 border-b border-[#33261A] text-xs sm:text-[13px] font-mono">
              <span className="text-[#F87171] font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9E2A2B] animate-pulse" />
                CORONER IDENTIFICATION // DECEASED
              </span>
              <span className="text-[#D4C7B0]">REF: VIC-01</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              {/* High-Resolution Victim Portrait with Vintage Photo Border */}
              <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-xl overflow-hidden border-2 border-[#33261A] shadow-xl shrink-0 bg-[#100D08]">
                <Image
                  src="/images/victim-adrian-voss.jpg"
                  alt="Dr. Adrian Voss, age 42, founder and CEO of NovaMind Technologies"
                  fill
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 176px, 192px"
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100D08]/85 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 right-2 text-center text-[11px] font-mono uppercase tracking-widest text-[#F87171] bg-[#9E2A2B]/85 border border-[#9E2A2B] rounded py-0.5 font-bold shadow-md">
                  DECEASED
                </span>
              </div>

              {/* Victim Core Demographics */}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs sm:text-[13px] uppercase tracking-widest text-[#D4C7B0] font-mono font-medium mb-1">
                  Homicide Victim
                </p>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#E8DCC0]">{victim.name}</h3>
                <p className="text-sm sm:text-base text-[#C9A15B] font-serif font-semibold mt-1 mb-3.5">
                  {victim.role} • Age {victim.age}
                </p>

                {/* Cause of Death Forensic Badge */}
                <div className="bg-[#9E2A2B]/15 border border-[#9E2A2B]/45 rounded-xl p-3.5 sm:p-4 text-left shadow-sm">
                  <div className="flex items-center gap-2 text-xs sm:text-[13px] font-mono uppercase text-[#F87171] font-bold mb-1.5">
                    <Activity className="w-4 h-4 text-[#F87171]" />
                    <span>Cause of Death:</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#E8DCC0] leading-snug font-medium">
                    {victim.causeOfDeath}
                  </p>
                </div>
              </div>
            </div>

            {/* Victim Coroner Notes */}
            <div className="mt-auto bg-[#17130E] border border-[#33261A] rounded-xl p-4 sm:p-5 text-sm sm:text-base text-[#E8DCC0] leading-relaxed">
              <span className="text-xs sm:text-[13px] font-mono text-[#C9A15B] uppercase tracking-widest block font-bold mb-2">
                Medical Examiner Field Observations:
              </span>
              <p className="text-[#D4C7B0] leading-relaxed text-sm sm:text-base">{victim.description}</p>
            </div>
          </div>

          {/* ── RIGHT: PRIMARY CRIME SCENE PHOTOGRAPH (COL 7-12) ── */}
          <div className="lg:col-span-6 flex flex-col rounded-2xl espresso-panel p-6 sm:p-8 shadow-xl border border-[#33261A]">
            <div className="flex items-center justify-between pb-3.5 mb-6 border-b border-[#33261A] text-xs sm:text-[13px] font-mono">
              <span className="text-[#C9A15B] font-bold uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#C9A15B]" />
                CRIME SCENE RECONSTRUCTION // EXHIBIT A-1
              </span>
              <span className="text-[#D4C7B0]">CAM-47 WIDE RAW</span>
            </div>

            {/* High-Resolution Crime Scene Photograph */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#33261A] shadow-xl bg-[#100D08] mb-5 group">
              <Image
                src="/images/crime-scene-hero.jpg"
                alt="47th floor crime scene office at night showing rain drenched glass overlooking city skyline"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100D08]/90 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3 bg-[#17130E]/90 border border-[#33261A] px-3 py-1.5 rounded text-xs font-mono text-[#E8DCC0] font-semibold shadow-md">
                FLOOR 47 • EXECUTIVE SUITE
              </div>
              <div className="absolute bottom-3 right-3 bg-[#9E2A2B]/90 border border-[#9E2A2B] px-3 py-1.5 rounded text-xs font-mono text-[#F87171] font-bold shadow-md">
                EVIDENCE HOTSPOTS DOCUMENTED
              </div>
            </div>

            {/* Scene Telemetry Notes */}
            <div className="mt-auto space-y-3.5 text-sm sm:text-base">
              <div className="flex items-start gap-3.5 text-[#D4C7B0] bg-[#17130E] border border-[#33261A] rounded-xl p-3.5 sm:p-4 leading-relaxed">
                <Lock className="w-4 h-4 text-[#C9A15B] mt-1 shrink-0" />
                <span>
                  <strong className="text-[#E8DCC0] font-bold">Magnetic Solenoid Portal:</strong> Locked securely from inside. Keycard audit confirms zero exterior card scans after 9:15 PM.
                </span>
              </div>
              <div className="flex items-start gap-3.5 text-[#D4C7B0] bg-[#17130E] border border-[#33261A] rounded-xl p-3.5 sm:p-4 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-[#F87171] mt-1 shrink-0" />
                <span>
                  <strong className="text-[#E8DCC0] font-bold">Staged Burglar Scene:</strong> Loosened ceiling ventilation grate and shattered tablet intentionally arranged to simulate outside entry.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHRONOLOGICAL FORENSIC TIMELINE (ESTABLISHED STORY FACTS) ── */}
      <div className="rounded-2xl espresso-panel p-6 sm:p-8 md:p-10 shadow-2xl border border-[#33261A]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-8 border-b border-[#33261A]">
          <div>
            <div className="flex items-center gap-2 text-[#C9A15B] text-xs sm:text-[13px] uppercase tracking-[0.2em] font-mono mb-1.5 font-bold">
              <Clock className="w-4 h-4 text-[#C9A15B]" />
              <span>FORENSIC TIMELINE RECONSTRUCTION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#E8DCC0] tracking-tight">
              Chronology of Fatal Events — October 26, 2024
            </h2>
          </div>
          <div className="self-start sm:self-auto text-xs sm:text-[13px] font-mono text-[#C9A15B] font-bold bg-[#C9A15B]/15 border border-[#C9A15B]/30 px-3.5 py-1.5 rounded-full">
            ESTABLISHED CANONICAL TIMESTAMPS
          </div>
        </div>

        {/* Timeline Items with Warm Vertical Spine */}
        <div className="relative pl-7 sm:pl-9 space-y-9 sm:space-y-10 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-1 before:bg-gradient-to-b before:from-[#C9A15B] before:via-[#9E2A2B] before:to-[#5C4733]">
          {/* Milestone 1: Last seen alive */}
          <div className="relative group">
            <div className="absolute -left-7 sm:-left-9 top-2 w-5 h-5 rounded-full bg-[#17130E] border-2 border-[#C9A15B] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#C9A15B]" />
            </div>

            <div className="bg-[#17130E] border border-[#33261A] rounded-xl p-5 sm:p-6 hover:border-[#C9A15B]/40 transition-colors shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                <span className="text-xs sm:text-sm font-mono font-bold text-[#E8DCC0] px-3.5 py-1.5 rounded-md bg-[#C9A15B]/15 border border-[#C9A15B]/30">
                  09:02 PM
                </span>
                <span className="text-xs sm:text-[13px] font-mono text-[#D4C7B0] uppercase tracking-wider font-semibold">
                  SECURITY TURNSTILE LOG
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#E8DCC0] mb-2">
                Dr. Adrian Voss Last Seen Alive
              </h3>
              <p className="text-sm sm:text-base text-[#D4C7B0] leading-relaxed font-normal">
                Building security logs Dr. Adrian Voss passing through Floor 47 turnstiles. He enters his private corner executive suite alone. No exterior visitors are logged accessing the executive wing afterward.
              </p>
            </div>
          </div>

          {/* Milestone 2: 12-Minute Camera Blackout */}
          <div className="relative group">
            <div className="absolute -left-7 sm:-left-9 top-2 w-5 h-5 rounded-full bg-[#17130E] border-2 border-[#C9A15B] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#C9A15B] animate-pulse" />
            </div>

            <div className="bg-[#17130E] border border-[#C9A15B]/35 rounded-xl p-5 sm:p-6 hover:border-[#C9A15B]/60 transition-colors shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                <span className="text-xs sm:text-sm font-mono font-bold text-[#E8DCC0] px-3.5 py-1.5 rounded-md bg-[#C9A15B]/20 border border-[#C9A15B]/40">
                  10:30 PM – 10:42 PM (12-Minute Window)
                </span>
                <span className="text-xs sm:text-[13px] font-mono text-[#C9A15B] uppercase tracking-wider font-bold">
                  SURVEILLANCE BLACKOUT
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#E8DCC0] mb-2">
                Floor 47 CCTV Feed Tampered & Overridden
              </h3>
              <p className="text-sm sm:text-base text-[#D4C7B0] leading-relaxed font-normal">
                Security cameras monitoring the Floor 47 executive corridor and suite entrances suffer a deliberate 12-minute blackout. Digital forensic logs verify the feed was manually masked using high-level administrative credentials.
              </p>
            </div>
          </div>

          {/* Milestone 3: Estimated Time of Death */}
          <div className="relative group">
            <div className="absolute -left-7 sm:-left-9 top-2 w-5 h-5 rounded-full bg-[#17130E] border-2 border-[#9E2A2B] flex items-center justify-center shadow-md shadow-[#9E2A2B]/40">
              <div className="w-2 h-2 rounded-full bg-[#9E2A2B] animate-ping" />
            </div>

            <div className="bg-gradient-to-r from-[#9E2A2B]/20 via-[#17130E] to-[#17130E] border-2 border-[#9E2A2B]/50 rounded-xl p-5 sm:p-7 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                <span className="text-xs sm:text-sm font-mono font-black text-[#F87171] px-3.5 py-1.5 rounded-md bg-[#9E2A2B]/25 border border-[#9E2A2B]/50 uppercase tracking-wider">
                  10:30 PM – 10:42 PM • ESTIMATED TIME OF DEATH
                </span>
                <span className="text-xs sm:text-[13px] font-mono text-[#F87171] uppercase tracking-widest font-bold">
                  FATAL TRAUMA INFLICTED
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#E8DCC0] mb-2.5">
                Coroner Window: Instantaneous Fatal Blunt Force Trauma
              </h3>
              <p className="text-sm sm:text-base text-[#E8DCC0] leading-relaxed font-normal">
                The coroner&apos;s preliminary autopsy report pinpoints Dr. Voss&apos;s death to the 12-minute surveillance blackout. Body temperature, vitreous potassium levels, and cranial trauma indicate the fatal strike occurred between 10:30 PM and 10:42 PM.
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs sm:text-sm font-mono text-[#F87171] bg-[#9E2A2B]/20 border border-[#9E2A2B]/50 px-4 py-2.5 rounded-lg shadow-sm">
                <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0" />
                <span>
                  <strong className="font-bold uppercase tracking-wide">CRITICAL FORENSIC DISTINCTION:</strong> Estimated Time of Death (10:30–10:42 PM) precedes body discovery by approximately 65 to 77 minutes.
                </span>
              </div>
            </div>
          </div>

          {/* Milestone 4: Discovery */}
          <div className="relative group">
            <div className="absolute -left-7 sm:-left-9 top-2 w-5 h-5 rounded-full bg-[#17130E] border-2 border-[#5C4733] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#D4C7B0]" />
            </div>

            <div className="bg-[#17130E] border border-[#33261A] rounded-xl p-5 sm:p-6 hover:border-[#5C4733] transition-colors shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                <span className="text-xs sm:text-sm font-mono font-bold text-[#E8DCC0] px-3.5 py-1.5 rounded-md bg-[#241B11] border border-[#33261A]">
                  11:47 PM
                </span>
                <span className="text-xs sm:text-[13px] font-mono text-[#D4C7B0] uppercase tracking-wider font-semibold">
                  DISCOVERY OF BODY
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#E8DCC0] mb-2">
                Night Patrol Officer Discovers Sealed Office
              </h3>
              <p className="text-sm sm:text-base text-[#D4C7B0] leading-relaxed font-normal">
                Night security officer observes office lights on through the glass door, with no verbal response. Officer triggers the emergency keycard override to find Dr. Voss dead over his mahogany desk. Homicide dispatch is notified at 11:49 PM.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── EVENT SUMMARY & HIGH-STAKES CONTEXT ── */}
      <div>
        <div className="flex items-center gap-2 mb-3.5">
          <FileText className="w-4 h-4 text-[#C9A15B]" />
          <h2 className="text-xs sm:text-sm uppercase tracking-widest text-[#C9A15B] font-mono font-bold">
            Executive Summary of Events
          </h2>
        </div>
        <div className="espresso-panel border-l-4 border-[#C9A15B] p-6 sm:p-8 rounded-r-xl shadow-xl border-y border-r border-[#33261A]">
          <p className="text-[#E8DCC0] text-sm sm:text-base md:text-lg leading-relaxed mb-6 font-normal">
            {summary}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-[#33261A] text-xs sm:text-sm font-mono">
            <div className="flex items-center gap-2 text-[#D4C7B0]">
              <span className="text-[#C9A15B] font-bold">▪</span>
              <span>IPO Valuation: <strong className="text-[#E8DCC0] font-bold">$4.2 Billion</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#D4C7B0]">
              <span className="text-[#C9A15B] font-bold">▪</span>
              <span>Countdown to IPO: <strong className="text-[#E8DCC0] font-bold">48 Hours</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[#D4C7B0]">
              <span className="text-[#C9A15B] font-bold">▪</span>
              <span>Room Access: <strong className="text-[#E8DCC0] font-bold">3 Keycard Holders</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── KEY FORENSIC FACTS & INVESTIGATIVE FINDINGS ── */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#33261A]">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#C9A15B]" />
            <h2 className="text-xs sm:text-sm uppercase tracking-widest text-[#C9A15B] font-mono font-bold">
              Key Established Forensic Facts
            </h2>
          </div>
          <span className="text-xs sm:text-[13px] font-mono text-[#D4C7B0]">6 FORENSIC OBSERVATIONS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              title: "Locked Room Mechanism",
              icon: Lock,
              badge: "ACCESS CONTROL",
              desc: "The office door was locked from the inside via electromagnetic solenoid keycard. Exterior emergency override was only activated at 11:47 PM upon discovery.",
            },
            {
              title: "12-Minute Surveillance Wipe",
              icon: Camera,
              badge: "DIGITAL TAMPERING",
              desc: "Security cameras on Floor 47 had a deliberate blackout from 10:30–10:42 PM. Security server logs indicate manual administrative credentials were used.",
            },
            {
              title: "$4.2B IPO Countdown",
              icon: Activity,
              badge: "HIGH MOTIVE",
              desc: "NovaMind's multi-billion IPO was scheduled 48 hours away. Dr. Voss threatened to cancel the IPO after discovering fraudulent AI benchmark data.",
            },
            {
              title: "Exclusive Security Privilege",
              icon: Fingerprint,
              badge: "SUSPECT ROSTER",
              desc: "Only three individuals possessed administrative override privileges to Floor 47 systems: Elena Marchetti, Marcus Chen, and Diana Okafor.",
            },
            {
              title: "Staged External Intrusion",
              icon: AlertTriangle,
              badge: "SCENE ANALYSIS",
              desc: "A loosened ceiling vent grate, overturned glass, and smashed tablet were staged to mimic an outside burglary. Building exterior shows zero ingress.",
            },
            {
              title: "Murder Weapon Identified",
              icon: Skull,
              badge: "CRIMINAL EVIDENCE",
              desc: "Heavy leaded-crystal executive paperweight found on desk with biological matter matching the victim. No fingerprints detected; weapon was wiped clean.",
            },
          ].map((fact, idx) => {
            const Icon = fact.icon;
            return (
              <div
                key={idx}
                className="rounded-xl espresso-panel p-5 sm:p-6 hover:border-[#C9A15B]/50 transition-all duration-300 flex flex-col justify-between shadow-md border border-[#33261A]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#C9A15B] bg-[#C9A15B]/15 px-2.5 py-1 rounded border border-[#C9A15B]/30 font-semibold">
                      {fact.badge}
                    </span>
                    <Icon className="w-4 h-4 text-[#C9A15B]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#E8DCC0] mb-2">{fact.title}</h3>
                  <p className="text-sm sm:text-[15px] text-[#D4C7B0] leading-relaxed font-normal">{fact.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── PRESERVED NAVIGATION BUTTONS ── */}
      <div className="rounded-2xl espresso-panel p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl border border-[#33261A]">
        <div className="text-center lg:text-left">
          <p className="text-xs sm:text-[13px] uppercase tracking-widest text-[#C9A15B] font-mono mb-1.5 font-bold">
            Next Investigative Phase
          </p>
          <p className="text-sm sm:text-base text-[#D4C7B0] max-w-xl">
            Proceed to inspect the suspects, search for physical evidence at the scene, or review gathered clues.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 w-full lg:w-auto">
          <LinkButton href="/suspects" className="w-full sm:w-auto">
            View Suspects →
          </LinkButton>
          <LinkButton href="/crime-scene" variant="secondary" className="w-full sm:w-auto">
            🚨 Examine Crime Scene
          </LinkButton>
          <LinkButton href="/evidence" variant="secondary" className="w-full sm:w-auto">
            📌 Evidence Board
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
