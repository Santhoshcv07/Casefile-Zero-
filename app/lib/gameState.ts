"use client";

import { useSyncExternalStore, useCallback, useMemo } from "react";
import { clues, interrogationResponses } from "./data";

export interface InterrogationMessage {
  id: string;
  role: "detective" | "suspect" | "system";
  text: string;
  timestamp?: string;
}

export interface AccusationResult {
  suspectId: string;
  selectedClueIds: string[];
  selectedMotiveId: string;
  score: number;
  rank: "Master Detective" | "Senior Investigator" | "Inconclusive Case" | "Wrongful Conviction";
  verdict: string;
  breakdown: {
    suspectScore: number;
    evidenceScore: number;
    motiveScore: number;
    total: number;
  };
  narrative: string;
  truthExplanation: string;
  submittedAt: string;
}

export interface GameState {
  discoveredClueIds: string[];
  examinedHotspotIds: string[];
  interrogationLogs: Record<string, InterrogationMessage[]>;
  askedQuestionIds: Record<string, string[]>;
  accusationResult: AccusationResult | null;
  caseStarted: boolean;
  lastFeedback: string | null;
}

const STORAGE_KEY = "casefile_zero_investigation_state_v1";

const DEFAULT_STATE: GameState = {
  discoveredClueIds: [],
  examinedHotspotIds: [],
  interrogationLogs: {},
  askedQuestionIds: {},
  accusationResult: null,
  caseStarted: false,
  lastFeedback: null,
};

// True culprit is Elena Marchetti
export const TRUE_CULPRIT_ID = "suspect-1";

// Key evidence that directly proves the case against Elena
export const CRITICAL_EVIDENCE_IDS = ["clue-1", "clue-2", "clue-3", "clue-5"];

export const MOTIVE_OPTIONS = [
  {
    id: "motive-1",
    label: "IPO Sabotage Prevention & $504M Equity Protection",
    description: "Voss was canceling the IPO due to algorithm audit findings. Elena would lose her $504M payout and face fraud charges.",
    isCorrectForCulprit: true,
  },
  {
    id: "motive-2",
    label: "Algorithm Intellectual Property Dispute",
    description: "Voss secretly patented neural architecture code, cutting the original programmer out of royalties.",
    isCorrectForCulprit: false,
  },
  {
    id: "motive-3",
    label: "Retaliation for Security Department Outsourcing",
    description: "Voss planned to fire the internal corporate security team and replace them with a private contractor.",
    isCorrectForCulprit: false,
  },
  {
    id: "motive-4",
    label: "Random Burglary / Industrial Espionage Gone Wrong",
    description: "An outside thief navigated the maintenance shafts to steal prototype hardware and killed Voss in a panic.",
    isCorrectForCulprit: false,
  },
];

let currentState: GameState = DEFAULT_STATE;
let isInitialized = false;
const listeners = new Set<() => void>();

function getSnapshot(): GameState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  if (!isInitialized) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        currentState = {
          ...DEFAULT_STATE,
          ...JSON.parse(raw),
        };
      } else {
        currentState = DEFAULT_STATE;
      }
    } catch (err) {
      console.error("Failed to load investigation state from localStorage:", err);
      currentState = DEFAULT_STATE;
    }
    isInitialized = true;
  }
  return currentState;
}

function getServerSnapshot(): GameState {
  return DEFAULT_STATE;
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      isInitialized = false;
      getSnapshot();
      emitChange();
    }
  });
}

function saveState(state: GameState) {
  currentState = state;
  isInitialized = true;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Failed to persist investigation state:", err);
    }
  }
  emitChange();
}

export function useGameState() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isHydrated = typeof window !== "undefined";

  const discoverClue = useCallback((clueId: string, hotspotId?: string): { newlyDiscovered: boolean; clueName: string } => {
    const clue = clues.find((c) => c.id === clueId);
    const clueName = clue?.name || "Evidence";

    const current = getSnapshot();
    const alreadyDiscovered = current.discoveredClueIds.includes(clueId);

    const updatedClues = alreadyDiscovered ? current.discoveredClueIds : [...current.discoveredClueIds, clueId];
    const updatedHotspots = hotspotId && !current.examinedHotspotIds.includes(hotspotId)
      ? [...current.examinedHotspotIds, hotspotId]
      : current.examinedHotspotIds;

    const feedbackMsg = alreadyDiscovered
      ? `Already cataloged: ${clueName}`
      : `New clue cataloged: ${clueName}! Check Evidence Board for leads.`;

    const nextState: GameState = {
      ...current,
      discoveredClueIds: updatedClues,
      examinedHotspotIds: updatedHotspots,
      caseStarted: true,
      lastFeedback: feedbackMsg,
    };

    saveState(nextState);
    return { newlyDiscovered: !alreadyDiscovered, clueName };
  }, []);

  const examineHotspot = useCallback((hotspotId: string) => {
    const current = getSnapshot();
    if (!current.examinedHotspotIds.includes(hotspotId)) {
      const nextState: GameState = {
        ...current,
        caseStarted: true,
        examinedHotspotIds: [...current.examinedHotspotIds, hotspotId],
      };
      saveState(nextState);
    }
  }, []);

  const recordInterrogationMessage = useCallback(
    (suspectId: string, questionId: string | null, questionText: string, answerText: string) => {
      const current = getSnapshot();
      const existingLogs = (current.interrogationLogs[suspectId] && current.interrogationLogs[suspectId].length > 0)
        ? current.interrogationLogs[suspectId]
        : [
            {
              id: `greet-${suspectId}`,
              role: "suspect" as const,
              text: interrogationResponses[suspectId]?.greeting || "I have nothing to say.",
            },
          ];
      const existingQuestions = current.askedQuestionIds[suspectId] || [];

      const newDetectiveMsg: InterrogationMessage = {
        id: `msg-${Date.now()}-q`,
        role: "detective",
        text: questionText,
      };
      const newSuspectMsg: InterrogationMessage = {
        id: `msg-${Date.now()}-a`,
        role: "suspect",
        text: answerText,
      };

      const updatedQuestions = questionId && !existingQuestions.includes(questionId)
        ? [...existingQuestions, questionId]
        : existingQuestions;

      const nextState: GameState = {
        ...current,
        caseStarted: true,
        interrogationLogs: {
          ...current.interrogationLogs,
          [suspectId]: [...existingLogs, newDetectiveMsg, newSuspectMsg],
        },
        askedQuestionIds: {
          ...current.askedQuestionIds,
          [suspectId]: updatedQuestions,
        },
      };

      saveState(nextState);
    },
    []
  );

  const submitAccusation = useCallback(
    (suspectId: string, selectedClueIds: string[], selectedMotiveId: string): AccusationResult => {
      const current = getSnapshot();
      const isCulpritCorrect = suspectId === TRUE_CULPRIT_ID;

      // 1. Suspect Score: exactly 40 for Elena, 0 for innocent suspects
      const suspectScore = isCulpritCorrect ? 40 : 0;

      // 2. Evidence Score: up to 40 (exactly 10 per relevant key clue that proves the case)
      let evidenceScore = 0;
      if (isCulpritCorrect) {
        const matchingKeyClues = selectedClueIds.filter((id) => CRITICAL_EVIDENCE_IDS.includes(id));
        evidenceScore = Math.min(40, matchingKeyClues.length * 10);
      } else {
        evidenceScore = 0;
      }

      // 3. Method/Motive Score: exactly 20 for correct motive (motive-1), 0 otherwise
      let motiveScore = 0;
      if (isCulpritCorrect && selectedMotiveId === "motive-1") {
        motiveScore = 20;
      } else {
        motiveScore = 0;
      }

      // Exact total: suspect (0 or 40) + evidence (0, 10, 20, 30, 40) + motive (0 or 20) -> max 100
      const total = suspectScore + evidenceScore + motiveScore;

      let rank: AccusationResult["rank"] = "Wrongful Conviction";
      let verdict = "Case Dismissed — Wrongful Accusation";

      if (isCulpritCorrect) {
        if (total === 100) {
          rank = "Master Detective";
          verdict = "Ironclad Conviction — First-Degree Murder";
        } else if (total >= 70) {
          rank = "Senior Investigator";
          verdict = "Conviction with Commendation";
        } else {
          rank = "Inconclusive Case";
          verdict = "Mistrial — Insufficient Supporting Evidence";
        }
      } else {
        rank = "Wrongful Conviction";
        verdict = "Case Dismissed — Wrongful Accusation";
      }

      let narrative = "";
      if (isCulpritCorrect) {
        if (rank === "Master Detective") {
          narrative = `District Attorney Statement: "The evidence compiled against COO Elena Marchetti is an absolute masterclass in forensic investigation. By tying her car's GPS presence directly to the 10:30 PM blackout window, proving the Diazepam poisoning, recovering her bloodstained monogrammed cufflink, and exposing the staged ceiling vent, the prosecution secured an unbroken chain of custody. When confronted with the draft email on Dr. Voss's cracked tablet proving he was about to cancel the $4.2B IPO, Marchetti broke down during cross-examination and confessed to the murder."`;
        } else if (rank === "Senior Investigator") {
          narrative = `You correctly identified Elena Marchetti as Dr. Voss's killer. The jury voted to convict on second-degree murder charges. While some defense attorneys attempted to poke holes regarding the timeline and missing forensic connections, the core motive—her $504 million equity at stake—and your presented evidence were enough to convince ten of the twelve jurors.`;
        } else {
          narrative = `You pointed your finger at the right culprit, Elena Marchetti, but failed to present sufficient forensic corroboration. Without the critical physical evidence (the drugged drink, the bloodied cufflink, and the email exposing the IPO halt), her high-priced defense team cast reasonable doubt by arguing she remained at Ristorante Nero all evening. The judge declared a mistrial.`;
        }
      } else if (suspectId === "suspect-2") {
        narrative = `Marcus Chen was arrested, but the indictment collapsed within 48 hours. Server logs confirmed Chen made git commits at 10:18 PM and 10:49 PM. The credit card receipt from the 14th-floor vending machine at 10:36 PM provided an airtight alibi. Chen's civil rights attorneys filed a multimillion-dollar countersuit against the police department for false imprisonment. Meanwhile, Dr. Voss's true killer walked free.`;
      } else {
        narrative = `Diana Okafor was formally accused, but the case never made it past the grand jury. Building logs and elevator biometric telemetry proved Diana was on Floor 32 inspecting a tripped fire sensor from 10:25 PM to 10:44 PM. Furthermore, the terminal used to disable Floor 47's cameras was tracked to the Floor 46 executive suite—not Diana's security post. The real murderer escaped justice while the police department faced public humiliation.`;
      }

      const truthExplanation = `The Truth of Case CZ-2024-0731:\n
1. THE CULPRIT: COO Elena Marchetti.
2. THE MOTIVE: Dr. Adrian Voss had discovered that Marchetti fraudulently altered the core neural-mapping audit data to artificially inflate NovaMind's valuation ahead of the $4.2 billion IPO. At 9:00 PM, Voss informed Marchetti in his office that he was drafting an email to the board of directors to halt the IPO and request an independent federal inquiry (revealed on the Cracked Tablet). Marchetti's $504 million stock options and career were about to be destroyed.
3. THE METHOD: During their heated discussion, Marchetti poured single-malt scotch and dosed Voss's glass with 10mg of Diazepam (Valium) which she had been prescribed. As the sedative kicked in, Voss collapsed. Marchetti seized a heavy crystal executive paperweight from the desk and struck him on the back of the head.
4. THE COVER-UP & CONTRADICTIONS:
   - At 10:30 PM, Marchetti logged into her terminal on Floor 46 to execute an admin camera override, blinding Floor 47 for 12 minutes.
   - She loosened the screws on the ceiling ventilation grate to manufacture a fake "intruder break-in," but the thick layer of settled dust inside proved no human body had passed through.
   - She staged an alibi at Ristorante Nero, but her car's GPS telemetry placed her parked right behind NovaMind HQ during the blackout.
   - In her rush to escape, her platinum cufflink ("E.M.") snapped off and fell behind the desk, catching a splatter of Voss's Type-A blood.`;

      const result: AccusationResult = {
        suspectId,
        selectedClueIds,
        selectedMotiveId,
        score: total,
        rank,
        verdict,
        breakdown: {
          suspectScore,
          evidenceScore,
          motiveScore,
          total,
        },
        narrative,
        truthExplanation,
        submittedAt: new Date().toLocaleTimeString(),
      };

      const nextState: GameState = {
        ...current,
        accusationResult: result,
        lastFeedback: `Case submitted! Evaluation: ${rank} (${total}/100)`,
      };

      saveState(nextState);
      return result;
    },
    []
  );

  const resetCase = useCallback(() => {
    saveState(DEFAULT_STATE);
  }, []);

  const clearFeedback = useCallback(() => {
    const current = getSnapshot();
    const nextState = { ...current, lastFeedback: null };
    saveState(nextState);
  }, []);

  return useMemo(
    () => ({
      ...state,
      isHydrated,
      discoverClue,
      examineHotspot,
      recordInterrogationMessage,
      submitAccusation,
      resetCase,
      clearFeedback,
    }),
    [state, isHydrated, discoverClue, examineHotspot, recordInterrogationMessage, submitAccusation, resetCase, clearFeedback]
  );
}
