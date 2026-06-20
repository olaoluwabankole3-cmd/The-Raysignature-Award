import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Check, Award, Trophy } from "lucide-react";
import { VotingCategory } from "../types";

interface NomineesSectionProps {
  categories: VotingCategory[];
}

export default function NomineesSection({ categories }: NomineesSectionProps) {
  // ==========================================
  // CONFIGURATION TOGGLE 
  // Set this to true when you want the voting grid to go live!
  // ==========================================
  const hasNomineesReleased = false; 

  // Voting State
  const [votes, setVotes] = useState<{ [categoryId: string]: string }>(() => {
    try {
      const persisted = localStorage.getItem("aurum_gala_votes");
      return persisted ? JSON.parse(persisted) : {};
    } catch {
      return {};
    }
  });

  const [activeBlastNominee, setActiveBlastNominee] = useState<string | null>(null);

  const castVote = (categoryId: string, nomineeId: string) => {
    const updatedVotes = { ...votes, [categoryId]: nomineeId };
    setVotes(updatedVotes);
    localStorage.setItem("aurum_gala_votes", JSON.stringify(updatedVotes));
    
    setActiveBlastNominee(nomineeId);

    try {
      confetti({
        particleCount: 90,
        spread: 85,
        origin: { y: 0.65 },
        colors: ["#fbbf24", "#f59e0b", "#d97706", "#fef08a", "#fffbeb", "#ffffff"],
      });
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.85 },
        colors: ["#fbbf24", "#f59e0b", "#d97706", "#fffbeb"],
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.85 },
        colors: ["#fbbf24", "#f59e0b", "#d97706", "#fffbeb"],
      });
    } catch (e) {
      console.error("Confetti launch details:", e);
    }
    
    setTimeout(() => {
      setActiveBlastNominee(null);
    }, 3000);
  };

  // ==========================================
  // STATE 1: NOMINEES NOT SELECTED (COMING SOON)
  // No data mapping, no image rendering, no buttons.
  // ==========================================
  if (!hasNomineesReleased) {
    return (
      <section className="relative w-full py-24 sm:py-36 bg-[#0b0c10] border-t border-zinc-900/40 overflow-hidden text-center">
        {/* Cinematic Backdrop Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/[0.04] rounded-full blur-[130px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.04] border border-amber-400/40 mb-6 sm:mb-8 shadow-[0_0_15px_rgba(245,158,11,0.12)]"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.25em] bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent uppercase font-bold">
              Aurum Gala Registry
            </span>
          </motion.div>

          {/* Premium Glassmorphic Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="mx-auto max-w-2xl bg-zinc-950/45 border border-amber-500/15 rounded-3xl p-5 sm:p-14 backdrop-blur-xl shadow-[0_20px_50px_rgba(218,176,92,0.03)]"
          >
            <div className="mx-auto w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/5 mb-6 text-amber-400">
              <Award className="w-6 h-6 animate-pulse" />
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-sans tracking-tight font-semibold text-zinc-100 mb-4 pl-0.5 animate-pulse">
              Nominees{" "}
              <span className="bg-gradient-to-r from-amber-100 via-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(218,176,92,0.15)] font-extrabold pb-1">
                Coming Soon
              </span>
            </h2>

            {/* Premium Gold Accent Label: Optimized with responsive flex-wrap, max-w-full and tracking on mobile */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-full sm:w-max mx-auto mb-6 py-2 px-3 sm:px-4 rounded-md border border-amber-400/30 bg-amber-500/[0.02] shadow-[0_0_10px_rgba(245,158,11,0.05)]">
              <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
              <span className="font-mono text-[8px] sm:text-[9px] tracking-normal sm:tracking-widest bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent uppercase font-bold text-center leading-normal">
                CROWNING CREATIVE EXCELLENCE • SEALED BALLOTS
              </span>
              <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-4 font-sans px-2 sm:px-0">
              The selection committee is currently lifting the gold seal on this year's elite roster of visual architects, digital curators, and groundbreaking visionaries.
            </p>
            <p className="text-[#d8b05c]/60 text-[10px] uppercase font-mono tracking-widest leading-loose px-2 sm:px-0">
              Public voting and token assignment options will unlock immediately upon official presentation.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  // ==========================================
  // STATE 2: LIVE VOTING GRID
  // Only shows up when hasNomineesReleased = true
  // ==========================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-16 pt-28 sm:pt-36 pb-20 sm:pb-32"
    >
      <div className="max-w-3xl mb-12 sm:mb-16 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-[9px] tracking-widest text-amber-300 uppercase">
            Secure Digital Balloting Suite
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans tracking-tight font-semibold mb-4 text-zinc-100">
          Cast Your Signature Ballot
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans max-w-xl">
          Your votes are safely captured and stored securely in local app memory. Review the elite fields below and assign your tokens to register your support.
        </p>
      </div>

      <section className="space-y-16 sm:space-y-24">
        {categories.map((category) => {
          const categoryVoteId = votes[category.id];
          const isCategoryVoted = !!categoryVoteId;

          return (
            <div 
              key={category.id} 
              className="border-t border-zinc-900 pt-10 sm:pt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
            >
              <div className="lg:col-span-1 max-w-md">
                <span className="font-mono text-[9px] tracking-[0.25em] text-[#d6aa47] uppercase block mb-2">
                  OFFICIAL CATEGORY
                </span>
                <h3 className="text-xl sm:text-2xl font-sans font-semibold text-zinc-100 mb-3 sm:mb-4">
                  {category.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  {category.description}
                </p>
                
                {isCategoryVoted && (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-900 text-emerald-400 font-mono text-[10px] tracking-wide uppercase animate-pulse">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Ballot Submitted
                  </div>
                )}
              </div>

              <div className="nominee-grid-container lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {category.nominees.map((nominee) => {
                  const isWinner = categoryVoteId === nominee.id;
                  
                  return (
                    <div
                      key={nominee.id}
                      className={`group relative flex flex-col justify-between p-4 rounded-2xl bg-zinc-950/40 border transition-all duration-500 backdrop-blur-sm overflow-hidden h-full ${
                        isWinner
                          ? "border-amber-400/40 bg-amber-500/[0.02]"
                          : "border-zinc-900/60 hover:border-zinc-800"
                      }`}
                    >
                      <div>
                        <div className="relative rounded-xl overflow-hidden aspect-[4/5] mb-4 border border-zinc-900 group-hover:border-amber-500/20 transition-all duration-300">
                          <img
                            src={nominee.image}
                            alt={nominee.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-80" />
                          
                          <AnimatePresence>
                            {isWinner && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4 z-10"
                              >
                                <motion.div
                                  initial={{ y: 10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  className="flex items-center justify-center w-10 h-10 rounded-full border border-amber-400 bg-amber-400/10 mb-2.5"
                                >
                                  <Check className="w-5 h-5 text-amber-400" />
                                </motion.div>
                                <span className="font-mono text-[9px] tracking-[0.2em] text-amber-300 font-semibold uppercase">
                                  VOTE REGISTERED
                                </span>
                                <p className="text-[10px] text-zinc-400 mt-1 italic px-2">
                                  "Thank you for supporting this legacy."
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <h4 className="text-base font-sans font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors">
                          {nominee.name}
                        </h4>
                        <p className="font-mono text-[9px] tracking-wider text-amber-500 uppercase mt-0.5 mb-2.5">
                          {nominee.role}
                        </p>
                        <p className="text-zinc-400 text-[11px] leading-relaxed font-sans mb-5">
                          {nominee.contributions}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isCategoryVoted}
                        onClick={() => castVote(category.id, nominee.id)}
                        className={`w-full py-2 rounded-lg font-sans text-[10px] tracking-widest font-semibold uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                          isWinner
                            ? "bg-amber-400 text-black border border-amber-400"
                            : isCategoryVoted
                            ? "bg-zinc-900/40 text-zinc-600 border border-zinc-900/60 cursor-not-allowed"
                            : "bg-zinc-950 text-zinc-300 hover:text-black hover:bg-amber-400 border border-zinc-800 hover:border-amber-400"
                        }`}
                      >
                        {isWinner ? (
                          <>
                            <Check className="w-3 h-3" />
                            MATCH SECURED
                          </>
                        ) : isCategoryVoted ? (
                          "LOCKED"
                        ) : (
                          "CAST VOTE"
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </motion.div>
  );
}