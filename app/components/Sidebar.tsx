"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Shield,
  FileText,
  Users,
  Compass,
  MessageSquare,
  BookmarkCheck,
  RotateCcw,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";
import { useGameState } from "../lib/gameState";
import { clues } from "../lib/data";

interface NavItem {
  href: string;
  label: string;
  category: string;
  icon: typeof Shield;
}

const navItems: NavItem[] = [
  { href: "/", label: "Case Dashboard", category: "OVERVIEW", icon: Shield },
  { href: "/briefing", label: "Confidential Briefing", category: "DOSSIER", icon: FileText },
  { href: "/suspects", label: "Persons of Interest", category: "RECON", icon: Users },
  { href: "/crime-scene", label: "Crime Scene Feed", category: "FORENSICS", icon: Compass },
  { href: "/interrogation", label: "Interrogation Room", category: "WITNESS", icon: MessageSquare },
  { href: "/evidence", label: "Evidence & Accusation", category: "INDICTMENT", icon: BookmarkCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { discoveredClueIds, resetCase, lastFeedback, clearFeedback } = useGameState();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cluesFound = discoveredClueIds.length;
  const totalClues = clues.length;

  const handleReset = () => {
    resetCase();
    setShowConfirmReset(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ── MOBILE TOP HEADER BAR (Hidden on md/desktop) ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#17130E] border-b border-[#241B11] px-4 flex items-center justify-between shadow-xl">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#C9A15B]/30 to-[#8A6328]/40 border border-[#C9A15B]/50 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#E8DCC0]" />
          </div>
          <div>
            <span className="font-serif font-black tracking-wider text-sm text-[#E8DCC0] uppercase block leading-none">
              Casefile Zero
            </span>
            <span className="text-[9px] font-mono text-[#C9A15B] tracking-widest uppercase">The Last Alibi</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Mobile Clue Counter Badge */}
          <Link
            href="/evidence"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#241B11] border border-[#C9A15B]/30 text-xs font-mono text-[#E8DCC0]"
          >
            <span>📎</span>
            <span>{cluesFound}/{totalClues}</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-[#241B11] border border-[#33261A] text-[#B3A184] hover:text-[#C9A15B] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── MOBILE SLIDE-OUT DRAWER OVERLAY ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#100D08]/85 backdrop-blur-sm animate-fade-in-up">
          <div className="w-72 max-w-[85%] h-full bg-[#17130E] border-r border-[#241B11] p-5 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#241B11]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-[#C9A15B]/20 border border-[#C9A15B]/50 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#E8DCC0]" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-sm text-[#E8DCC0] uppercase">Casefile Zero</h2>
                    <p className="text-[9px] font-mono text-[#C9A15B] tracking-widest uppercase">Dept. Homicide</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-[#B3A184] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Clue Progress */}
              <div className="mb-5 p-3 rounded-lg bg-[#241B11] border border-[#33261A]">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-[#B3A184] uppercase tracking-wider">Evidence Locker</span>
                  <span className="text-[#C9A15B] font-bold">{cluesFound}/{totalClues} Clues</span>
                </div>
                <div className="w-full bg-[#100D08] h-1.5 rounded-full overflow-hidden border border-[#33261A]">
                  <div
                    className="bg-gradient-to-r from-[#C9A15B] to-[#E8DCC0] h-full rounded-full transition-all duration-300"
                    style={{ width: `${(cluesFound / totalClues) * 100}%` }}
                  />
                </div>
              </div>

              {/* Mobile Nav Links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[#C9A15B]/20 text-[#E8DCC0] border-l-4 border-[#C9A15B] shadow-inner font-semibold"
                          : "text-[#B3A184] hover:text-[#E8DCC0] hover:bg-[#241B11]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#C9A15B]" : "text-[#B3A184]"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#241B11] space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowConfirmReset(true);
                }}
                className="w-full px-3 py-2 text-xs font-mono text-[#B3A184] hover:text-[#F87171] hover:bg-[#9E2A2B]/10 rounded-lg border border-[#241B11] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Investigation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP FIXED LEFT SIDEBAR (w-64) ── */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 bg-[#17130E] border-r border-[#241B11] flex-col justify-between shadow-2xl select-none">
        {/* Top Header & Branding */}
        <div>
          <div className="p-5 border-b border-[#241B11]">
            <Link href="/" className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C9A15B]/25 to-[#8A6328]/35 border border-[#C9A15B]/50 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Shield className="w-5 h-5 text-[#E8DCC0]" />
              </div>
              <div>
                <h1 className="font-serif font-black tracking-wide text-base text-[#E8DCC0] uppercase group-hover:text-[#C9A15B] transition-colors leading-tight">
                  Casefile Zero
                </h1>
                <p className="text-[10px] font-mono tracking-widest text-[#C9A15B] uppercase font-bold mt-0.5">
                  The Last Alibi
                </p>
                <span className="inline-block mt-1 text-[9px] font-mono px-2 py-0.5 rounded bg-[#241B11] border border-[#33261A] text-[#B3A184] uppercase tracking-wider">
                  CASE #CZ-2024-0731
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links inside semantic <nav> */}
          <nav className="p-3 space-y-1">
            {/* Clue Progress Badge (Preserves test selector nav span:nth-child(2)) */}
            <div className="px-2 pt-2 pb-3">
              <Link
                href="/evidence"
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition-all ${
                  cluesFound === totalClues
                    ? "bg-[#2D6A4F]/20 text-[#34D399] border-[#2D6A4F]/40 shadow-sm"
                    : cluesFound > 0
                    ? "bg-[#C9A15B]/15 text-[#E8DCC0] border-[#C9A15B]/35 shadow-sm"
                    : "bg-[#241B11] text-[#B3A184] border-[#33261A]"
                }`}
                title="Click to inspect cataloged evidence"
              >
                <div className="flex items-center gap-2">
                  <span>📎</span>
                  <span className="font-bold">{cluesFound}/{totalClues} Clues</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#C9A15B] font-semibold">
                  {Math.round((cluesFound / totalClues) * 100)}%
                </span>
              </Link>
            </div>

            <div className="px-3 pb-1 text-[10px] font-mono text-[#B3A184]/70 uppercase tracking-widest font-semibold">
              Investigation Files
            </div>

            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#241B11] to-[#1C150E] text-[#E8DCC0] border-l-4 border-[#C9A15B] shadow-md font-semibold"
                      : "text-[#B3A184] hover:text-[#E8DCC0] hover:bg-[#241B11]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-[#C9A15B]" : "text-[#B3A184] group-hover:text-[#C9A15B]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A15B] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Investigator Profile & Case Controls */}
        <div className="p-4 border-t border-[#241B11] space-y-3">
          {/* Active Case Telemetry Stamp */}
          <div className="p-3 rounded-xl bg-[#241B11] border border-[#33261A]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#1C150E] border border-[#C9A15B]/40 flex items-center justify-center text-xs font-serif font-black text-[#C9A15B]">
                INQ
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#E8DCC0] truncate font-serif">Lead Investigator</p>
                <p className="text-[10px] text-[#B3A184] font-mono truncate">Dept. of Homicide</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#33261A] text-[10px] font-mono">
              <span className="text-[#B3A184]">STATUS:</span>
              <span className="text-[#C9A15B] font-bold tracking-wider">ACTIVE RECON</span>
            </div>
          </div>

          {/* Restart Case Action */}
          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full px-3 py-2 text-xs font-mono text-[#B3A184] hover:text-[#F87171] hover:bg-[#9E2A2B]/10 rounded-lg border border-[#241B11] hover:border-[#9E2A2B]/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            title="Reset investigation and clear all collected clues"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#B3A184]" />
            <span>Restart Case File</span>
          </button>
        </div>
      </aside>

      {/* ── GLOBAL FEEDBACK BANNER (Preserves test selector .animate-fade-in-up) ── */}
      {lastFeedback && (
        <div className="fixed top-16 md:top-6 right-4 z-50 max-w-sm animate-fade-in-up bg-[#241B11] border border-[#C9A15B]/40 text-[#E8DCC0] text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="text-base">📌</span>
            <span className="font-medium">{lastFeedback}</span>
          </div>
          <button
            onClick={clearFeedback}
            className="text-[#B3A184] hover:text-white text-base leading-none px-1 cursor-pointer"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* ── CONFIRMATION MODAL FOR RESETTING CASE ── */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#100D08]/85 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#241B11] border border-[#C9A15B]/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-[#E8DCC0] mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#C9A15B]" />
              Reset Case Investigation?
            </h3>
            <p className="text-xs sm:text-sm text-[#B3A184] mb-6 leading-relaxed">
              This action will permanently wipe your recovered physical clues, examined crime scene hotspots, suspect
              interrogation logs, and grand jury indictment findings.
            </p>
            <div className="flex justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-lg text-[#B3A184] hover:text-white bg-[#17130E] border border-[#33261A] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg font-bold bg-[#9E2A2B]/25 text-[#F87171] hover:bg-[#9E2A2B]/40 border border-[#9E2A2B]/50 transition-colors cursor-pointer"
              >
                Confirm Full Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
