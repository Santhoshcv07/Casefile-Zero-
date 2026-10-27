"use client";

import { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle2,
  Fingerprint,
  Sparkles,
  FileText,
  ShieldCheck,
  Scale,
  Search,
} from "lucide-react";
import { suspects, interrogationTopics, interrogationResponses, clues } from "../lib/data";
import { useGameState, InterrogationMessage } from "../lib/gameState";
import { getDeterministicFallbackAnswer } from "../lib/interrogationPrompts";
import SectionHeader from "../components/SectionHeader";
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
    relatedClueIds: string[];
  }
> = {
  "suspect-1": {
    dossierId: "POI-01",
    clearance: "Level 5 Executive Override",
    department: "Executive Committee & Operations",
    relatedClueIds: ["clue-1", "clue-2", "clue-3", "clue-4", "clue-5"],
  },
  "suspect-2": {
    dossierId: "POI-02",
    clearance: "Level 4 Systems Admin",
    department: "Core AI & Neural Systems Engineering",
    relatedClueIds: ["clue-1", "clue-6"],
  },
  "suspect-3": {
    dossierId: "POI-03",
    clearance: "Level 5 Physical Security Master",
    department: "Corporate Security & Threat Mitigation",
    relatedClueIds: ["clue-3", "clue-4"],
  },
};

function InterrogationContent() {
  const searchParams = useSearchParams();
  const initialSuspect = searchParams.get("suspect") || suspects[0].id;

  const {
    discoveredClueIds,
    interrogationLogs,
    askedQuestionIds,
    recordInterrogationMessage,
  } = useGameState();

  const [activeSuspectId, setActiveSuspectId] = useState(initialSuspect);
  const [inputText, setInputText] = useState("");
  const [isInterrogating, setIsInterrogating] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "ai" | "fallback" | "error";
    text: string;
  } | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const suspect = suspects.find((s) => s.id === activeSuspectId) || suspects[0];
  const meta = SUSPECT_METADATA[activeSuspectId] || {
    dossierId: "POI-??",
    clearance: "Level 4 Access",
    department: "NovaMind Technologies",
    relatedClueIds: [],
  };
  const suspectGreeting =
    interrogationResponses[activeSuspectId]?.greeting || "I have nothing to say.";

  // Retrieve current suspect messages from persistent state, or generate default greeting
  const messages: InterrogationMessage[] = useMemo(() => {
    if (interrogationLogs[activeSuspectId] && interrogationLogs[activeSuspectId].length > 0) {
      return interrogationLogs[activeSuspectId];
    }
    return [
      {
        id: `greet-${activeSuspectId}`,
        role: "suspect",
        text: suspectGreeting,
      },
    ];
  }, [interrogationLogs, activeSuspectId, suspectGreeting]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingQuestion, isInterrogating]);

  // Filter available interrogation topics for the active suspect
  const availableTopics = interrogationTopics.filter((topic) => {
    if (topic.suspectId !== activeSuspectId) return false;
    if (topic.requiredClueId && !discoveredClueIds.includes(topic.requiredClueId)) {
      return false;
    }
    return true;
  });

  const askedList = askedQuestionIds[activeSuspectId] || [];
  const unlockedBreakthroughs = availableTopics.filter((t) => Boolean(t.requiredClueId));

  // Related clues for active suspect
  const suspectRelatedClues = meta.relatedClueIds
    .map((id) => clues.find((c) => c.id === id))
    .filter((c): c is typeof clues[0] => Boolean(c));

  const discoveredRelatedCount = suspectRelatedClues.filter((c) =>
    discoveredClueIds.includes(c.id)
  ).length;

  const handleAskQuestion = async (
    questionText: string,
    topicId: string | null = null
  ) => {
    const trimmed = questionText.trim();
    if (!trimmed || isInterrogating) return;

    setIsInterrogating(true);
    setPendingQuestion(trimmed);
    setInputText("");

    try {
      const response = await fetch("/api/interrogate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suspectId: activeSuspectId,
          question: trimmed,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          discoveredClueIds,
          topicId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to reach interrogation API`);
      }

      const data = await response.json();
      const answer = data.answer || getDeterministicFallbackAnswer(activeSuspectId, trimmed, topicId);

      recordInterrogationMessage(activeSuspectId, topicId, trimmed, answer);

      if (data.isFallback) {
        // Player-friendly status message that never exposes internal API keys or dev setup
        setStatusMessage({
          type: "fallback",
          text: "Archival deposition records active. Sworn testimony referenced from official case files.",
        });
      } else {
        setStatusMessage({
          type: "ai",
          text: `Neural interrogation generated via Groq (${data.model || "Llama 3.3"}).`,
        });
      }
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "Interrogation network error";
      console.warn("Falling back to deterministic transcript:", errorText);

      const fallbackAnswer = getDeterministicFallbackAnswer(activeSuspectId, trimmed, topicId);
      recordInterrogationMessage(activeSuspectId, topicId, trimmed, fallbackAnswer);

      // Player-friendly error note without dev instructions or leaked variables
      setStatusMessage({
        type: "error",
        text: "Direct neural link unavailable. Loaded verified case transcript.",
      });
    } finally {
      setPendingQuestion(null);
      setIsInterrogating(false);
    }
  };

  const handleSelectTopic = (topic: typeof interrogationTopics[0]) => {
    handleAskQuestion(topic.question, topic.id);
  };

  const handleCustomSend = () => {
    handleAskQuestion(inputText, null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCustomSend();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in-up space-y-8 motion-reduce:animate-none">
      <SectionHeader label="Interview Room 03">Formal Suspect Interrogation</SectionHeader>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6 sm:gap-8 items-start">
        {/* ── LEFT COLUMN: SUSPECT SPOTLIGHT & INVESTIGATION DOSSIER ── */}
        <div className="space-y-6">
          {/* Suspect Switcher Carousel / Tab strip */}
          <div className="espresso-panel rounded-2xl p-4 border border-[#33261A] shadow-xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] uppercase tracking-widest text-[#C9A15B] font-mono font-bold flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-[#C9A15B]" />
                Persons of Interest
              </span>
              <span className="text-[11px] font-mono text-[#D4C7B0]">3 Suspects</span>
            </div>

            <div className="space-y-2">
              {suspects.map((s) => {
                const isSelected = s.id === activeSuspectId;
                const loggedCount = interrogationLogs[s.id]?.length || 0;
                const qCount = Math.floor(loggedCount / 2);
                const img = SUSPECT_IMAGES[s.id] || "/images/victim-adrian-voss.jpg";

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (!isInterrogating) {
                        setActiveSuspectId(s.id);
                        setStatusMessage(null);
                      }
                    }}
                    disabled={isInterrogating}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#241B11] border-[#C9A15B] text-[#E8DCC0] shadow-lg ring-1 ring-[#C9A15B]/50"
                        : "bg-[#17130E] border-[#33261A] text-[#D4C7B0] hover:border-[#C9A15B]/40 hover:text-white"
                    } ${isInterrogating ? "opacity-60 cursor-not-allowed" : ""}`}
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
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`font-serif font-bold text-sm ${
                              isSelected ? "text-[#C9A15B]" : "text-[#E8DCC0]"
                            }`}
                          >
                            {s.name}
                          </p>
                          {qCount > 0 ? (
                            <span className="text-[10px] font-mono text-[#34D399] font-bold flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-[#34D399]" />
                              {qCount} Qs
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-[#B3A184] shrink-0">
                              Pending
                            </span>
                          )}
                        </div>
                        {/* Full role without truncation */}
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

          {/* ── CINEMATIC ACTIVE SUSPECT SPOTLIGHT CARD ── */}
          <div className="espresso-panel rounded-2xl border border-[#33261A] overflow-hidden shadow-2xl">
            {/* Large Cinematic Portrait Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#100D08] border-b border-[#33261A] group">
              <Image
                src={SUSPECT_IMAGES[suspect.id] || "/images/victim-adrian-voss.jpg"}
                alt={`${suspect.name}, ${suspect.role}`}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out motion-reduce:transition-none"
                sizes="(max-width: 1024px) 100vw, 380px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17130E] via-transparent to-transparent opacity-90 pointer-events-none" />

              {/* Clearance Badge Over Portrait */}
              <div className="absolute top-3 left-3 bg-[#17130E]/90 border border-[#33261A] px-2.5 py-1 rounded text-xs font-mono text-[#E8DCC0] font-semibold shadow-md">
                {meta.clearance}
              </div>

              {/* Suspicion Level Pill */}
              <div className="absolute bottom-3 right-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider border shadow-lg ${
                    suspect.suspicionLevel === "High"
                      ? "bg-[#9E2A2B]/90 text-[#F87171] border-[#9E2A2B]"
                      : "bg-[#C9A15B]/90 text-[#100D08] border-[#C9A15B]"
                  }`}
                >
                  {suspect.suspicionLevel} Suspicion
                </span>
              </div>
            </div>

            {/* Suspect Identity Profile */}
            <div className="p-5 space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#B3A184] font-mono font-semibold block mb-0.5">
                  Deposition Subject Profile • {meta.dossierId}
                </span>
                <h2 className="text-2xl font-serif font-black text-[#E8DCC0] tracking-tight">
                  {suspect.name}
                </h2>
                <p className="text-sm font-serif font-semibold text-[#C9A15B] mt-0.5 leading-snug">
                  {suspect.role}
                </p>
                <p className="text-xs font-mono text-[#D4C7B0] mt-1">
                  Age {suspect.age} • {meta.department}
                </p>
              </div>

              {/* Personality / Comportment Observation */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-[#C9A15B] font-mono font-bold flex items-center gap-1">
                  <Scale className="w-3 h-3 text-[#C9A15B]" />
                  Behavioral Disposition & Comportment
                </span>
                <div className="bg-[#17130E] border-l-2 border-[#C9A15B] p-3 rounded-r-xl border-y border-r border-[#33261A] text-xs text-[#D4C7B0] leading-relaxed">
                  <p className="font-sans italic">&ldquo;{suspect.personality}&rdquo;</p>
                </div>
              </div>

              {/* Verbatim Suspect Stated Alibi */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest text-[#B3A184] font-mono font-bold">
                  Stated Alibi on Record (10:30–10:42 PM)
                </span>
                <div className="bg-[#17130E] p-3 rounded-xl border border-[#33261A] text-xs text-[#D4C7B0] leading-relaxed font-sans">
                  {suspect.alibi}
                </div>
              </div>

              {/* Investigation Ties & Leverage Clues */}
              <div className="pt-2 border-t border-[#33261A] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#C9A15B] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A15B]" />
                    Investigation Leverage
                  </span>
                  <span className="text-[#E8DCC0] font-bold">
                    {discoveredRelatedCount}/{suspectRelatedClues.length} Discovered
                  </span>
                </div>

                <div className="space-y-1.5">
                  {suspectRelatedClues.map((c) => {
                    const isDiscovered = discoveredClueIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                          isDiscovered
                            ? "bg-[#17130E] border border-[#34D399]/40 text-[#E8DCC0]"
                            : "bg-[#100D08]/50 text-[#7A664F] border border-[#33261A]"
                        }`}
                      >
                        <span className="text-sm shrink-0">{isDiscovered ? c.icon : "🔒"}</span>
                        <span className="truncate flex-1 text-[11px]">{c.name}</span>
                        <span
                          className={`text-[10px] font-bold uppercase shrink-0 ${
                            isDiscovered ? "text-[#34D399]" : "text-[#7A664F]"
                          }`}
                        >
                          {isDiscovered ? "Recovered" : "Missing"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-2 space-y-2">
                <LinkButton href="/crime-scene" variant="secondary" className="w-full text-xs py-2">
                  <Search className="w-3.5 h-3.5 inline mr-1" />
                  Search Crime Scene for Leads
                </LinkButton>
                <LinkButton href="/evidence" variant="primary" className="w-full text-xs py-2.5">
                  📌 Proceed to Evidence Board →
                </LinkButton>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: CINEMATIC INTERROGATION TERMINAL ── */}
        <div className="espresso-panel rounded-2xl border border-[#33261A] flex flex-col h-[760px] shadow-2xl overflow-hidden relative">
          {/* Subtle Ambient Desk Lamp Lighting Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,161,91,0.08)_0%,transparent_70%)] pointer-events-none" />

          {/* Chamber Header & Deposition Status Bar */}
          <div className="px-5 py-3.5 border-b border-[#33261A] bg-[#17130E] flex items-center justify-between flex-wrap gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#33261A]">
                <Image
                  src={SUSPECT_IMAGES[suspect.id] || "/images/victim-adrian-voss.jpg"}
                  alt={suspect.name}
                  fill
                  className="object-cover object-top"
                  sizes="40px"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[#E8DCC0] font-serif font-black text-sm sm:text-base">
                    {suspect.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C9A15B]/15 text-[#C9A15B] border border-[#C9A15B]/30 font-bold">
                    {meta.dossierId}
                  </span>
                </div>
                <p className="text-[11px] text-[#D4C7B0] font-mono leading-tight">{suspect.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              {statusMessage?.type === "ai" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold bg-[#2D6A4F]/20 text-[#34D399] border border-[#2D6A4F]/40 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                  GROQ AI ONLINE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold bg-[#C9A15B]/15 text-[#E8DCC0] border border-[#C9A15B]/30 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#C9A15B]" />
                  ARCHIVE DEPOSITION MODE
                </span>
              )}

              {/* Accurate Deposition Text Status */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#100D08] border border-[#33261A]">
                <span className="w-2 h-2 rounded-full bg-[#C9A15B]" />
                <span className="text-[#D4C7B0] font-semibold text-[11px] tracking-wider uppercase">
                  SWORN TEXT DEPOSITION
                </span>
              </div>
            </div>
          </div>

          {/* Dismissible Status / Feedback Notice */}
          {statusMessage && (
            <div
              className={`px-4 py-2 border-b flex items-center justify-between text-xs z-10 ${
                statusMessage.type === "error"
                  ? "bg-[#9E2A2B]/20 border-[#9E2A2B]/40 text-[#F87171]"
                  : statusMessage.type === "ai"
                  ? "bg-[#2D6A4F]/20 border-[#2D6A4F]/40 text-[#34D399]"
                  : "bg-[#241B11] border-[#33261A] text-[#D4C7B0]"
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === "error" ? (
                  <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#C9A15B] shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
              <button
                onClick={() => setStatusMessage(null)}
                className="hover:text-[#E8DCC0] font-mono text-xs ml-2 cursor-pointer underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ── CHAT TRANSCRIPT AREA (Authentic Police Deposition Style) ── */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5 bg-[#100D08]/90 relative z-10">
            {/* Deposition Header Docket Banner */}
            <div className="p-4 rounded-xl bg-[#17130E] border border-[#33261A] text-xs font-mono text-[#D4C7B0] space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2 text-[#C9A15B] font-bold pb-2 border-b border-[#33261A]">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C9A15B]" />
                  METROPOLITAN POLICE DEPARTMENT // SWORN DEPOSITION TRANSCRIPT
                </span>
                <span>CASE #CZ-2024-0731</span>
              </div>
              <div className="flex flex-wrap items-center justify-between text-[11px] text-[#B3A184] pt-0.5">
                <span>INTERVIEW CHAMBER 03 • FLOOR 47 HOMICIDE INVESTIGATION</span>
                <span>
                  DEPONENT: {suspect.name.toUpperCase()} ({suspect.role.toUpperCase()})
                </span>
              </div>
            </div>

            {/* Empty-State Protocol Guidance Card (Shown when dialogue is fresh) */}
            {messages.length <= 1 && (
              <div className="p-4 rounded-xl bg-[#17130E]/80 border border-[#33261A] text-xs space-y-2 text-[#D4C7B0] animate-fade-in-up motion-reduce:animate-none">
                <div className="flex items-center gap-2 text-[#C9A15B] font-mono font-bold uppercase tracking-wider text-[11px]">
                  <Scale className="w-4 h-4 text-[#C9A15B]" />
                  Homicide Investigation Protocol
                </div>
                <p className="leading-relaxed">
                  You are interrogating <span className="text-[#E8DCC0] font-semibold">{suspect.name}</span> regarding the death of Dr. Adrian Voss in his locked 47th-floor office. Select a line of inquiry from the controls below, or submit custom questions into the deposition terminal.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-mono text-[#B3A184]">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#C9A15B]">⚡</span> Clues unlock confrontation questions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#34D399]">✓</span> Transcripts persist automatically
                  </span>
                </div>
              </div>
            )}

            {/* Message History */}
            {messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`flex ${
                  msg.role === "detective" ? "justify-end" : "justify-start"
                } animate-fade-in-up motion-reduce:animate-none`}
              >
                {msg.role === "detective" ? (
                  /* Detective Inquiry Message in Parchment Style */
                  <div className="max-w-[85%] sm:max-w-[80%] p-4 rounded-2xl parchment-sheet rounded-tr-none border-[#C5B48E] shadow-md">
                    <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-black/10 text-xs font-mono">
                      <span className="font-mono uppercase tracking-wider font-bold text-[#754E18] flex items-center gap-1.5">
                        <Fingerprint className="w-3.5 h-3.5 text-[#754E18]" />
                        DETECTIVE INQUIRY
                      </span>
                      <span className="text-[10px] text-[#5C4733] font-bold">
                        QUERY #{Math.floor(i / 2) + 1}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-[#17130E] font-sans font-medium whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>
                ) : (
                  /* Suspect Sworn Testimony Message */
                  <div className="max-w-[85%] sm:max-w-[80%] p-4 sm:p-5 rounded-2xl bg-[#241B11] text-[#E8DCC0] border border-[#33261A] rounded-tl-none shadow-lg">
                    <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/10 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <div className="relative w-5 h-5 rounded-full overflow-hidden border border-[#C9A15B] shrink-0">
                          <Image
                            src={SUSPECT_IMAGES[suspect.id] || "/images/victim-adrian-voss.jpg"}
                            alt={suspect.name}
                            fill
                            className="object-cover object-top"
                            sizes="20px"
                          />
                        </div>
                        <span className="font-mono uppercase tracking-wider font-bold text-[#C9A15B]">
                          {suspect.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#D4C7B0] uppercase tracking-wider font-semibold">
                        SWORN TESTIMONY
                      </span>
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-[#E8DCC0] whitespace-pre-wrap font-sans font-normal">
                      {msg.text}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Pending Question with Instant Feedback */}
            {pendingQuestion && (
              <div className="flex justify-end animate-fade-in-up motion-reduce:animate-none">
                <div className="max-w-[85%] sm:max-w-[80%] p-4 rounded-2xl parchment-sheet rounded-tr-none border-[#C5B48E] shadow-md opacity-90">
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-black/10 text-xs font-mono">
                    <span className="font-mono uppercase tracking-wider font-bold text-[#754E18] flex items-center gap-1.5">
                      <Fingerprint className="w-3.5 h-3.5 text-[#754E18]" />
                      DETECTIVE INQUIRY
                    </span>
                    <span className="text-[10px] text-[#5C4733] font-bold">SUBMITTING...</span>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-[#17130E] font-sans font-medium whitespace-pre-wrap">
                    {pendingQuestion}
                  </p>
                </div>
              </div>
            )}

            {/* Waiting for Response Typing Indicator (Active ONLY during isInterrogating) */}
            {isInterrogating && (
              <div className="flex justify-start animate-fade-in-up motion-reduce:animate-none">
                <div className="max-w-[85%] sm:max-w-[80%] p-4 rounded-2xl bg-[#241B11] text-[#E8DCC0] border border-[#C9A15B]/40 rounded-tl-none shadow-xl">
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/5 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="relative w-5 h-5 rounded-full overflow-hidden border border-[#C9A15B] shrink-0">
                        <Image
                          src={SUSPECT_IMAGES[suspect.id] || "/images/victim-adrian-voss.jpg"}
                          alt={suspect.name}
                          fill
                          className="object-cover object-top"
                          sizes="20px"
                        />
                      </div>
                      <span className="font-mono uppercase tracking-wider font-bold text-[#C9A15B]">
                        {suspect.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#C9A15B] uppercase">Testifying...</span>
                  </div>
                  <div className="flex items-center gap-3 py-1.5 text-[#D4C7B0]">
                    <div className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#C9A15B] animate-bounce [animation-delay:-0.3s]" />
                      <span className="inline-block w-2 h-2 rounded-full bg-[#C9A15B] animate-bounce [animation-delay:-0.15s]" />
                      <span className="inline-block w-2 h-2 rounded-full bg-[#C9A15B] animate-bounce" />
                    </div>
                    <span className="text-xs sm:text-sm italic font-mono text-[#E8DCC0]">
                      {suspect.name} is dictating sworn testimony...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* ── INVESTIGATION CONTROLS: EVIDENCE CONFRONTATIONS & TOPICS ── */}
          <div className="p-4 border-t border-[#33261A] bg-[#17130E] relative z-10">
            <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#C9A15B] uppercase tracking-wider font-bold">
                  Cross-Examination Inquiries ({availableTopics.length})
                </span>
                {unlockedBreakthroughs.length > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C9A15B]/20 text-[#E8DCC0] border border-[#C9A15B]/40 font-bold">
                    ⚡ {unlockedBreakthroughs.length} Evidence Confrontations
                  </span>
                )}
              </div>
              <span className="text-xs text-[#D4C7B0]">
                {isInterrogating ? "Interrogation in progress..." : "Click to cross-examine"}
              </span>
            </div>

            {/* Preserving exact class `.max-h-36` and `button` structure for automated e2e audit */}
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
              {availableTopics.map((topic) => {
                const wasAsked = askedList.includes(topic.id);
                const isBreakthrough = Boolean(topic.requiredClueId);

                return (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic)}
                    disabled={isInterrogating}
                    className={`text-xs px-3 py-2 rounded-xl border transition-all text-left flex items-center gap-2 ${
                      wasAsked
                        ? "bg-[#100D08] text-[#7A664F] border-[#241B11] line-through opacity-70"
                        : isBreakthrough
                        ? "bg-[#C9A15B]/20 hover:bg-[#C9A15B]/30 text-[#E8DCC0] border-[#C9A15B] shadow-md shadow-[#C9A15B]/10 font-medium ring-1 ring-[#C9A15B]/30"
                        : "bg-[#241B11] hover:bg-[#2D2115] text-[#D4C7B0] border-[#33261A] hover:border-[#C9A15B]/40"
                    } ${isInterrogating ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span className="shrink-0">{isBreakthrough ? "⚡" : "💬"}</span>
                    <span className="leading-snug">{topic.question}</span>
                    {isBreakthrough && !wasAsked && (
                      <span className="ml-1 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#C9A15B] text-[#100D08] font-bold shrink-0">
                        EVIDENCE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── CUSTOM QUESTION FREE-FORM INPUT ── */}
          <div className="p-4 bg-[#17130E] border-t border-[#33261A] relative z-10">
            <div className="flex gap-2.5">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${suspect.name} any question (e.g. whereabouts, motive, keycard)...`}
                disabled={isInterrogating}
                className="flex-1 bg-[#100D08] border border-[#33261A] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#E8DCC0] placeholder-[#B3A184]/60 focus:outline-none focus:border-[#C9A15B] font-sans disabled:opacity-50 transition-colors shadow-inner"
              />
              <button
                onClick={handleCustomSend}
                disabled={!inputText.trim() || isInterrogating}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#100D08] font-bold rounded-xl text-xs sm:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
              >
                <span>Ask</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InterrogationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-12 text-[#B3A184] font-mono">
          Loading Interrogation Chambers...
        </div>
      }
    >
      <InterrogationContent />
    </Suspense>
  );
}
