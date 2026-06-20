import { useState, useRef, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Mic, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Minus,
  Send, 
  Copy, 
  Check, 
  Volume2, 
  Clapperboard, 
  History, 
  Star,
  Menu,
  X
} from "lucide-react";
import Scene3D from "./components/Scene3D";
import TimelineShowcase from "./components/TimelineShowcase";
import NomineesSection from "./components/NomineesSection";
import { AWARDS_CONFIG } from "./config";
import { VotingCategory } from "./types";

const VOTING_DATA: VotingCategory[] = [
  {
    id: "visual-architect",
    title: "Visual Architect of the Year",
    description: "Pioneers crafting supreme digital dimensions, high-end motion frameworks, and immersive render models of the century.",
    nominees: [
      {
        id: "nominee-elena",
        name: "Elena Rostova",
        role: "Lead Cinematic 3D Sculptor",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
        contributions: "Architected the immersive realtime digital runway aesthetics for global couture houses."
      },
      {
        id: "nominee-marcus",
        name: "Marcus Vance",
        role: "Volumetric Shader Designer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
        contributions: "Engineered ultra-realistic ray-traced shadows and cinematic physical rendering shaders."
      },
      {
        id: "nominee-sora",
        name: "Sora Takahashi",
        role: "Generative Spatial Vectorist",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
        contributions: "Pioneered neural-guided multi-dimensional structures merging real-world materials."
      }
    ]
  },
  {
    id: "culture-icon",
    title: "Culture Icon & Digital Curator",
    description: "Honoring visionary directors and thinkers who forge deep connections and dictate the world's cultural cadence through media.",
    nominees: [
      {
        id: "nominee-amara",
        name: "Amara Kente",
        role: "Mixed Reality Museum Curator",
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600",
        contributions: "Brought ancestral art galleries to interactive spatial environments for millions globally."
      },
      {
        id: "nominee-jaxson",
        name: "Jaxson Thorne",
        role: "Experimental Spatial Acoustic Lead",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
        contributions: "Synthesized the ambient sonic atmospheres driving the premier electronic galas."
      },
      {
        id: "nominee-zoe",
        name: "Zoe Lin",
        role: "Subtle Interactive Creator",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
        contributions: "Designed physical-to-digital kinetic invitations for luxury art galas."
      }
    ]
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<"gala" | "voting">("gala");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [revealExpanded, setRevealExpanded] = useState(false);
  const [excellenceExpanded, setExcellenceExpanded] = useState(false);

  // Hero Spotlight Mouse Tracker with smooth GSAP damping
  const heroSpotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentPage !== "gala") return;

    // Continuous ambient pulse tween using GSAP
    const pulseTween = gsap.to(heroSpotlightRef.current, {
      scale: 1.15,
      opacity: 1.25,
      duration: 3.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

    const heroSection = document.getElementById("welcome");
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroSection || !heroSpotlightRef.current) return;
      
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Dampened move toward mouse coords relative to center
      gsap.to(heroSpotlightRef.current, {
        x: x * 0.18,
        y: y * 0.18,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto"
      });
    };

    const handleMouseLeave = () => {
      if (!heroSpotlightRef.current) return;
      // Smooth return to exactly dead center
      gsap.to(heroSpotlightRef.current, {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto"
      });
    };

    if (heroSection) {
      heroSection.addEventListener("mousemove", handleMouseMove);
      heroSection.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      pulseTween.kill();
      if (heroSection) {
        heroSection.removeEventListener("mousemove", handleMouseMove);
        heroSection.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [currentPage]);

  // Scroll Progress State
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = (window.scrollY / docHeight) * 100;
        setScrollProgress(scrolled);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    // Calculate initially
    handleScroll();

    // Re-check after a brief timeout to ensure dynamic elements have fully rendered
    const timer = setTimeout(handleScroll, 200);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, [currentPage]);

  // Preloader State
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [windowLoaded, setWindowLoaded] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  const handleThreeLoaded = () => {
    setThreeLoaded(true);
  };

  // Countdown State (Target set in the past to hold at zero. Update with your future target date string when ready)
  const targetDate = new Date("2026-01-01T00:00:00Z").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    if (document.readyState === "complete") {
      setWindowLoaded(true);
    } else {
      const handleLoad = () => setWindowLoaded(true);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  useEffect(() => {
    if (threeLoaded && windowLoaded) {
      const timer = setTimeout(() => {
        setShowPreloader(false);
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 400);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [threeLoaded, windowLoaded]);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);
    return () => clearTimeout(timer);
  }, [currentPage]);

  useEffect(() => {
    ScrollTrigger.refresh();
    const timer1 = setTimeout(() => ScrollTrigger.refresh(), 100);
    const timer2 = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [revealExpanded, excellenceExpanded]);

  // Register the ScrollTrigger plugin once. NOTE: previously this effect also
  // contained a `gsap.matchMedia("(max-width: 1023px)")` block that gave mobile
  // its own slide-in/slide-out scrub animation for #reveal-card and
  // #excellence-card. That divergent mobile-only animation has been removed —
  // desktop never animated those cards (they just sit static as you scroll
  // past), so mobile now behaves identically: same layout, same (lack of)
  // scroll-scrub effect, just scaled down by the existing responsive classes.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Desktop has its own #reveal / #excellence sections (lg+ only); mobile's
  // equivalent content lives inside the single #reveal-mobile winding-path
  // section. Resolve to whichever is actually visible so nav links scroll
  // correctly on both breakpoints.
  const resolveSectionId = (sectionId: string) => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop && (sectionId === "reveal" || sectionId === "excellence")) {
      return "reveal-mobile";
    }
    return sectionId;
  };

  const navigateToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const targetId = resolveSectionId(sectionId);
    if (currentPage !== "gala") {
      setCurrentPage("gala");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 500);
      }, 150);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0b0c10] text-zinc-100 selection:bg-amber-500 selection:text-black overflow-x-hidden">
      
      {/* 1. PREMIUM PRELOADER */}
      <AnimatePresence>
        {showPreloader && (
          <motion.div
            id="premium-preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="fixed inset-0 w-full h-full bg-[#0b0c10] z-[9999] flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.1 }}
              className="flex flex-col items-center max-w-md text-center"
            >
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-amber-500/20 bg-[#0b0c10]/40 backdrop-blur-md mb-6 sm:mb-8">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400/90 animate-pulse" />
                <div className="absolute inset-0 rounded-full border border-amber-500/10 animate-ping duration-[3000ms]" />
                <div className="absolute -inset-2 rounded-full border border-dashed border-amber-500/20 animate-[spin_24s_linear_infinite]" />
              </div>
              
              <h2 className="text-lg sm:text-2xl font-light text-[#d8b05c] tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-4 pl-[0.3em] sm:pl-[0.4em]">
                Preparing the Stage...
              </h2>
              <div className="h-[1px] w-28 sm:w-36 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-2 animate-pulse" />
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-mono mt-2 pl-[0.25em]">
                Unveiling Cinematic Luxury
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Kinetic Background Scene - Handled perfectly with CSS rules */}
      <div 
        id="canvas-container" 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100vw", 
          height: "100vh", 
          zIndex: 1, 
          pointerEvents: "none" 
        }}
        className="fixed inset-0 select-none touch-none"
      >
        {/* Soft, wide amber-gold glow backdrop directly behind the 3D Trophy (Animated via GSAP) */}
        <div 
          ref={heroSpotlightRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none select-none mix-blend-screen will-change-transform z-0"
        >
          <div className="absolute inset-0 bg-yellow-400/[0.12] rounded-full blur-[130px]" />
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-yellow-100/[0.06] rounded-full blur-[80px]" />
        </div>

        {/* Cinematic Luxury Light Rays Backdrop (Fanning up from pedestal area) */}
        <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 z-0 ${currentPage === "gala" ? "opacity-100" : "opacity-0"}`}>
          {/* Main vertical intense beam */}
          <div 
            className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[160px] sm:w-[240px] h-[80vh] bg-gradient-to-t from-yellow-300/[0.28] via-yellow-400/[0.12] to-transparent opacity-95 blur-md pointer-events-none mix-blend-screen"
            style={{ clipPath: 'polygon(50% 100%, 15% 0, 85% 0)' }}
          />
          
          {/* Angled rays fanning out - inspired by image_d4a3c9.png / changed to luminous gold */}
          {/* Far Left Ray */}
          <div 
            className="absolute bottom-[20%] left-1/2 w-[100px] h-[75vh] bg-gradient-to-t from-yellow-400/[0.20] via-yellow-500/[0.06] to-transparent blur-sm pointer-events-none mix-blend-screen origin-[bottom_center]"
            style={{ 
              transform: 'translateX(-50%) rotate(-36deg)',
              clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
            }}
          />
          {/* Left Ray */}
          <div 
            className="absolute bottom-[20%] left-1/2 w-[110px] h-[78vh] bg-gradient-to-t from-yellow-300/[0.24] via-yellow-400/[0.08] to-transparent blur-sm pointer-events-none mix-blend-screen origin-[bottom_center]"
            style={{ 
              transform: 'translateX(-50%) rotate(-18deg)',
              clipPath: 'polygon(50% 100%, 10% 0, 90% 0)'
            }}
          />
          {/* Subtle Mid Left Ray */}
          <div 
            className="absolute bottom-[20%] left-1/2 w-[80px] h-[80vh] bg-gradient-to-t from-yellow-300/[0.18] via-yellow-400/[0.05] to-transparent blur-sm pointer-events-none mix-blend-screen origin-[bottom_center]"
            style={{ 
              transform: 'translateX(-50%) rotate(-9deg)',
              clipPath: 'polygon(50% 100%, 20% 0, 80% 0)'
            }}
          />
          {/* Subtle Mid Right Ray */}
          <div 
            className="absolute bottom-[20%] left-1/2 w-[80px] h-[80vh] bg-gradient-to-t from-yellow-300/[0.18] via-yellow-400/[0.05] to-transparent blur-sm pointer-events-none mix-blend-screen origin-[bottom_center]"
            style={{ 
              transform: 'translateX(-50%) rotate(9deg)',
              clipPath: 'polygon(50% 100%, 20% 0, 80% 0)'
            }}
          />
          {/* Right Ray */}
          <div 
            className="absolute bottom-[20%] left-1/2 w-[110px] h-[78vh] bg-gradient-to-t from-yellow-300/[0.24] via-yellow-400/[0.08] to-transparent blur-sm pointer-events-none mix-blend-screen origin-[bottom_center]"
            style={{ 
              transform: 'translateX(-50%) rotate(18deg)',
              clipPath: 'polygon(50% 100%, 10% 0, 90% 0)'
            }}
          />
          {/* Far Right Ray */}
          <div 
            className="absolute bottom-[20%] left-1/2 w-[100px] h-[75vh] bg-gradient-to-t from-yellow-400/[0.20] via-yellow-500/[0.06] to-transparent blur-sm pointer-events-none mix-blend-screen origin-[bottom_center]"
            style={{ 
              transform: 'translateX(-50%) rotate(36deg)',
              clipPath: 'polygon(50% 100%, 0 0, 100% 0)'
            }}
          />

          {/* Floor-level spotlight perspective lines shooting forward/outward from the base */}
          <div className="absolute bottom-0 left-0 right-0 h-[22%] overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full flex justify-center">
              {/* Radial Perspective Rays from image_d4a3c9 */}
              {[-65, -50, -35, -20, -8, 8, 20, 35, 50, 65].map((angle, idx) => (
                <div 
                  key={idx}
                  className="absolute bottom-[-15px] w-[1px] md:w-[2px] bg-gradient-to-t from-yellow-400/0 via-yellow-300/30 to-yellow-100/60 origin-bottom shadow-[0_0_12px_rgba(253,224,71,0.35)]"
                  style={{
                    height: '240%',
                    transform: `translateX(-50%) rotate(${angle}deg)`,
                    left: `${50 + (angle * 0.72)}%`,
                    filter: "blur(0.5px)"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Highly concentrated, bright white-gold spot right behind the center of the trophy to create a strong silhouette effect */}
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-yellow-200/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

          {/* Floating gold/white square particles as sparkling stage dust */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(25)].map((_, i) => {
              const sizes = ["w-1 h-1", "w-[3px] h-[3px]", "w-[1.5px] h-[1.5px]"];
              const sizeClass = sizes[i % sizes.length];
              const speeds = [8, 12, 15, 10, 14];
              const duration = speeds[i % speeds.length];
              const delay = (i * 0.4).toFixed(1);
              const leftPos = (10 + (i * 3.3) % 80).toFixed(1);
              const bottomPos = (5 + (i * 4.1) % 45).toFixed(1);
              return (
                <div 
                  key={`stage-dust-${i}`}
                  className={`absolute ${sizeClass} bg-yellow-300/60 shadow-[0_0_8px_rgba(250,204,21,0.5)] animate-float-up`}
                  style={{
                    left: `${leftPos}%`,
                    bottom: `${bottomPos}%`,
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`
                  }}
                />
              );
            })}
          </div>


          {/* THE ELEVATED GOLD PODIUM was completely removed to avoid flat layout capsule artifacts, letting only the clean 3D WebGL dark podium mesh be visible */}
        </div>

        <Scene3D page={currentPage} onLoaded={handleThreeLoaded} />
      </div>

      {/* Decorative Cinematic Top Lighting Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-black/80 pointer-events-none z-10" />

      {/* Cinematic Borders & Framing */}
      <div className="fixed inset-x-0 top-0 h-1.5 sm:h-2 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 z-[101]" />
      
      {/* Subtle Scroll Progress line */}
      <div 
        className="fixed top-0 left-0 h-[3px] sm:h-[4px] bg-gradient-to-r from-amber-100 via-yellow-400 to-amber-500 z-[102] shadow-[0_1px_15px_rgba(245,158,11,0.9)] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      <div className="fixed inset-y-0 left-0 w-12 hidden lg:flex items-center justify-center pointer-events-none z-40 border-r border-zinc-900/40 bg-black/10">
        <div className="rotate-270 text-[9px] uppercase tracking-[0.4em] text-zinc-500 whitespace-nowrap font-mono">
          ★ THE RAYSIGNATURE GALA 2026 ★
        </div>
      </div>
      <div className="fixed inset-y-0 right-0 w-12 hidden lg:flex items-center justify-center pointer-events-none z-40 border-l border-zinc-900/40 bg-black/10">
        <div className="rotate-90 text-[9px] uppercase tracking-[0.4em] text-zinc-500 whitespace-nowrap font-mono">
          ★ HONOURING CREATIVE ICONS ★
        </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <header 
        style={{ zIndex: 100 }} 
        className="fixed top-0 left-0 w-full bg-[#0b0c10]/60 backdrop-blur-[12px] border-b border-zinc-900/60 py-4 sm:py-5 px-4 sm:px-6 md:px-16 flex items-center justify-between"
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <button 
            type="button"
            onClick={() => navigateToSection("welcome")}
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none cursor-pointer group z-50"
          >
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-amber-400/40 bg-[#0b0c10]/70 shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:border-amber-300 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.30)] transition-all duration-300">
              <Trophy className="w-4 h-4 sm:w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-ping" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-sans tracking-[0.25em] font-semibold text-zinc-200 group-hover:text-amber-300 transition-colors">
                THE RAYSIGNATURE
              </div>
              <div className="text-[8px] sm:text-[9px] font-mono tracking-widest bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-bold uppercase">
                AWARDS
              </div>
            </div>
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest text-zinc-400">
            <button 
              type="button"
              onClick={() => navigateToSection("welcome")}
              className={`hover:text-amber-300 tracking-[0.15em] transition-colors cursor-pointer uppercase ${currentPage === "gala" ? "bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent font-bold" : ""}`}
            >
              Home
            </button>
            <button 
              type="button"
              onClick={() => navigateToSection("reveal")}
              className="hover:text-amber-300 tracking-[0.15em] transition-colors cursor-pointer uppercase"
            >
              About
            </button>
            <button 
              type="button"
              onClick={() => navigateToSection("winners")}
              className="hover:text-amber-300 tracking-[0.15em] transition-colors cursor-pointer uppercase"
            >
              Winners
            </button>
            <button 
              type="button"
              onClick={() => { setCurrentPage("voting"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
              className={`hover:text-amber-300 tracking-[0.15em] transition-colors cursor-pointer uppercase flex items-center gap-2 ${currentPage === "voting" ? "bg-gradient-to-r from-amber-100 to-amber-300 bg-clip-text text-transparent font-bold" : "text-amber-500/70"}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Vote
            </button>
          </nav>

          {/* Desktop Action Trigger */}
          <div className="hidden md:block">
            {currentPage === "gala" ? (
              <button 
                type="button"
                onClick={() => { setCurrentPage("voting"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-amber-400/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:bg-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.30)] hover:text-black font-semibold text-xs tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer"
              >
                GO TO BALLOTS
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => { setCurrentPage("gala"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-amber-400/30 bg-zinc-950/65 hover:border-amber-400 hover:text-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.20)] font-semibold text-xs tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer"
              >
                MAIN AUDITORIUM
              </button>
            )}
          </div>

          {/* Mobile Menu Icon Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md border border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:text-amber-400 z-50 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Context Navigation Dropdown Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[65px] bg-[#050505]/95 border-b border-zinc-900 backdrop-blur-xl z-50 flex flex-col p-6 gap-5 font-mono text-xs tracking-widest text-zinc-300 md:hidden"
          >
            <button
              type="button"
              onClick={() => navigateToSection("welcome")}
              className="text-left py-2 hover:text-amber-400 border-b border-zinc-900 pb-2 cursor-pointer"
            >
              HOME
            </button>
            <button
              type="button"
              onClick={() => navigateToSection("reveal")}
              className="text-left py-2 hover:text-amber-400 border-b border-zinc-900 pb-2 cursor-pointer"
            >
              ABOUT
            </button>
            <button
              type="button"
              onClick={() => navigateToSection("winners")}
              className="text-left py-2 hover:text-amber-400 border-b border-zinc-900 pb-2 cursor-pointer"
            >
              WINNERS
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); setCurrentPage("voting"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="text-left py-2 text-amber-400 flex items-center gap-2 border-b border-zinc-900 pb-2 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              VOTE BALLOTS
            </button>
            
            {currentPage === "gala" ? (
              <button 
                type="button"
                onClick={() => { setMobileMenuOpen(false); setCurrentPage("voting"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="w-full text-center py-3 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-300 font-semibold font-sans mt-2"
              >
                GO TO BALLOTS
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => { setMobileMenuOpen(false); setCurrentPage("gala"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                className="w-full text-center py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 font-semibold font-sans mt-2"
              >
                MAIN AUDITORIUM
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Narrative Scroll Layout */}
      <main className="relative z-30 pointer-events-auto overflow-x-hidden w-full">
        {currentPage === "gala" && (
          <>
            {/* Section 1: Welcome Hero */}
            <section 
              id="welcome" 
              className="min-h-screen flex flex-col justify-between max-w-7xl mx-auto px-4 md:px-16 pt-24 md:pt-32 pb-12 md:pb-24 relative"
            >
              <div className="my-auto max-w-2xl pt-6 md:pt-12 text-center md:text-left">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.04] border border-amber-400/40 mb-6 md:mb-8 backdrop-blur shadow-[0_0_15px_rgba(245,158,11,0.12)] mx-auto md:mx-0 text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.25em] bg-gradient-to-r from-amber-100 via-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent uppercase font-extrabold drop-shadow-[0_1px_10px_rgba(253,224,71,0.1)]">
                    {AWARDS_CONFIG.sections[0].tagline}
                  </span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, delay: 0.4 }}
                  className="text-2xl md:text-5xl font-sans tracking-tight leading-tight md:leading-none mb-6 font-semibold text-zinc-100 drop-shadow-[0_2px_28px_rgba(251,191,36,0.18)]"
                >
                  The{" "}
                  <span className="bg-gradient-to-r from-yellow-100 via-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_30px_rgba(251,191,36,0.45)] font-extrabold">
                    Raysignature Awards
                  </span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.6, delay: 0.6 }}
                  className="text-zinc-400 text-xs md:text-base leading-relaxed font-sans mb-8 max-w-lg mx-auto md:mx-0"
                >
                  {AWARDS_CONFIG.sections[0].description}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, delay: 0.8 }}
                  className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4"
                >
                  <a 
                    href="#reveal" 
                    className="w-full md:w-auto group flex items-center justify-center gap-3 bg-white text-black py-3 px-6 rounded-md hover:bg-amber-400 transition-all duration-300 font-sans font-semibold text-sm cursor-pointer"
                  >
                    Reveal the Grail
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </a>
                  <div className="flex gap-3 items-center mt-2 md:mt-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                      SCROLL TO EXPLORE
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Indicator of Scroll */}
              <div className="flex flex-col items-center justify-center mt-auto pt-6 select-none pointer-events-none">
                <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-500 uppercase mb-2 animate-pulse">
                  Scroll Linked 3D
                </span>
                <ChevronDown className="w-4 h-4 text-amber-400/60 animate-bounce" />
              </div>
            </section>

            {/* Section 2: The Grand Reveal (DESKTOP ONLY — unchanged, just gated to lg+) */}
            <section 
              id="reveal" 
              className="hidden lg:flex min-h-screen items-center max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-16 md:py-32"
            >
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="hidden lg:block h-2" />
                
                <div id="reveal-card" className="max-w-xl bg-zinc-950/65 border border-zinc-900/60 p-5 md:p-12 rounded-2xl backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.04] border border-amber-400/40 mb-4 md:mb-6 shadow-[0_0_15px_rgba(245,158,11,0.12)]">
                    <Award className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span className="font-mono text-[9px] tracking-widest bg-gradient-to-r from-amber-100 via-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent uppercase font-extrabold">
                      {AWARDS_CONFIG.sections[1].tagline}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans tracking-tight mb-3 md:mb-4 font-semibold text-zinc-100 drop-shadow-[0_2px_28px_rgba(251,191,36,0.18)]">
                    Honoring The{" "}
                    <span className="bg-gradient-to-r from-yellow-100 via-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_30px_rgba(251,191,36,0.45)] font-extrabold">
                      Visionaries
                    </span>
                  </h2>
                  <h3 className="bg-gradient-to-r from-amber-200 via-yellow-300 via-amber-400 to-amber-600 bg-clip-text text-transparent font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-4 md:mb-6 font-semibold drop-shadow-[0_1px_8px_rgba(251,191,36,0.1)]">
                    {AWARDS_CONFIG.sections[1].subtitle}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed mb-5 md:mb-8">
                    {AWARDS_CONFIG.sections[1].description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 md:pt-6 border-t border-zinc-900">
                    <div>
                      <div className="text-lg sm:text-xl md:text-2xl font-sans font-semibold text-amber-400">Global State</div>
                      <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-zinc-500 mt-1">
                        CULTURAL INFLUENCE
                      </div>
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl md:text-2xl font-sans font-semibold text-amber-400">Signature Seal</div>
                      <div className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-zinc-500 mt-1">
                        AUTHENTICATED LAURELS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Celebrating Excellence (DESKTOP ONLY — unchanged, just gated to lg+) */}
            <section 
              id="excellence" 
              className="hidden lg:flex min-h-screen items-center max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-16 md:py-32"
            >
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div id="excellence-card" className="max-w-xl bg-zinc-950/65 border border-zinc-900/60 p-5 md:p-12 rounded-2xl backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.04] border border-amber-400/40 mb-4 md:mb-6 shadow-[0_0_15px_rgba(245,158,11,0.12)]">
                    <Clapperboard className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span className="font-mono text-[9px] tracking-widest bg-gradient-to-r from-amber-100 via-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent uppercase font-extrabold">
                      {AWARDS_CONFIG.sections[2].tagline}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans tracking-tight mb-3 md:mb-4 font-semibold text-zinc-100 drop-shadow-[0_2px_28px_rgba(251,191,36,0.18)]">
                    Icons of The{" "}
                    <span className="bg-gradient-to-r from-yellow-100 via-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_30px_rgba(251,191,36,0.45)] font-extrabold">
                      Culture
                    </span>
                  </h2>
                  <h3 className="bg-gradient-to-r from-amber-200 via-yellow-300 via-amber-400 to-amber-600 bg-clip-text text-transparent font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-4 md:mb-6 font-semibold drop-shadow-[0_1px_8px_rgba(251,191,36,0.1)]">
                    {AWARDS_CONFIG.sections[2].subtitle}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed mb-5 md:mb-8">
                    {AWARDS_CONFIG.sections[2].description}
                  </p>

                  <div className="p-3 md:p-4 bg-amber-500/5 border border-amber-400/10 rounded-lg flex items-start gap-3 sm:gap-4">
                    <Award className="w-4 h-4 sm:w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] sm:text-xs font-semibold text-zinc-200 uppercase font-mono tracking-wide">
                        Verified Excellence
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-1 leading-normal">
                        Every honoree is carefully vetted through rigorous peer metrics, ensuring only true pioneers receive the signature seal.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block h-2" />
              </div>
            </section>

            {/* ============================================================ */}
            {/* MOBILE-ONLY (lg:hidden)                                       */}
            {/* Desktop #reveal / #excellence sections above are untouched —  */}
            {/* they're just gated with `hidden lg:flex` so they only render  */}
            {/* at lg+. This is the dedicated mobile version: simple, centered */}
            {/* stacked cards, no overlapping elements. Nav scrolling to       */}
            {/* "reveal"/"excellence" on mobile is redirected to this section's*/}
            {/* id via resolveSectionId().                                    */}
            {/* ============================================================ */}
            {/* MOBILE-ONLY (lg:hidden)                                       */}
            {/* ============================================================ */}
            <section
              id="reveal-mobile"
              className="lg:hidden relative w-full max-w-md mx-auto px-4 overflow-hidden select-none"
            >
              <div className="relative z-10 flex flex-col gap-0">                {/* STOP 1: Text Card (Left) -> Trophy Space (Right) */}
                <div className="grid grid-cols-2 w-full gap-4 items-center min-h-[100vh] content-center py-10">
                  
                  {/* The Grand Reveal text card on left */}
                  <motion.div 
                    initial={{ opacity: 0, x: -30, scale: 0.96 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ type: "spring", stiffness: 70, damping: 14 }}
                    className="bg-zinc-950/80 border border-zinc-900/60 p-4.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-md hover:border-amber-400/20 transition-all duration-300 transform-gpu relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/[0.04] border border-amber-400/40 mb-2.5 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                        <Award className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
                        <span className="font-mono text-[7px] tracking-[0.15em] bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent uppercase font-extrabold">
                          {AWARDS_CONFIG.sections[1].tagline}
                        </span>
                      </div>
                      
                      <h2 className="text-xs font-display tracking-[0.06em] uppercase mb-1.5 font-semibold text-zinc-100 drop-shadow-[0_2px_15px_rgba(251,191,36,0.1)] leading-tight">
                        Honoring The{" "}
                        <span className="bg-gradient-to-r from-yellow-100 via-amber-300 to-amber-500 bg-clip-text text-transparent font-extrabold font-sans">
                          Visionaries
                        </span>
                      </h2>
                      
                      <h3 className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent font-mono text-[7px] tracking-[0.18em] uppercase mb-2 font-semibold">
                        {AWARDS_CONFIG.sections[1].subtitle}
                      </h3>
                      
                      <p className="text-zinc-400 text-[10px] leading-relaxed mb-3 line-clamp-3">
                        {AWARDS_CONFIG.sections[1].description}
                      </p>

                      {/* Toggle Button for mobile screens */}
                      <button
                        onClick={() => setRevealExpanded(true)}
                        className="mt-3 inline-flex items-center gap-1 text-[9px] uppercase font-mono tracking-wider text-amber-400 hover:text-amber-300 font-extrabold transition-colors duration-200 animate-pulse hover:animate-none"
                      >
                        <span>Read Full Vision</span>
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>

                  {/* Empty Spacer Column for Trophy to slide over beautifully */}
                  <div className="h-2" />

                </div>

                {/* STOP 2: Trophy Space (Left) -> Text Card (Right) */}
                <div className="grid grid-cols-2 w-full gap-4 items-center min-h-[100vh] content-center py-10">
                  
                  {/* Empty Spacer Column for Trophy to slide over beautifully */}
                  <div className="h-2" />

                  {/* Celebrating Excellence text card on right */}
                  <motion.div 
                    initial={{ opacity: 0, x: 30, scale: 0.96 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ type: "spring", stiffness: 70, damping: 14 }}
                    className="bg-zinc-950/80 border border-zinc-900/60 p-4.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-md hover:border-amber-400/20 transition-all duration-300 transform-gpu relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/[0.04] border border-amber-400/40 mb-2.5 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                        <Clapperboard className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
                        <span className="font-mono text-[7px] tracking-[0.15em] bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent uppercase font-extrabold">
                          {AWARDS_CONFIG.sections[2].tagline}
                        </span>
                      </div>
                      
                      <h2 className="text-xs font-display tracking-[0.06em] uppercase mb-1.5 font-semibold text-zinc-100 drop-shadow-[0_2px_15px_rgba(251,191,36,0.1)] leading-tight">
                        Icons of The{" "}
                        <span className="bg-gradient-to-r from-yellow-100 via-amber-300 to-amber-500 bg-clip-text text-transparent font-extrabold font-sans">
                          Culture
                        </span>
                      </h2>
                      
                      <h3 className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent font-mono text-[7px] tracking-[0.18em] uppercase mb-2 font-semibold">
                        {AWARDS_CONFIG.sections[2].subtitle}
                      </h3>
                      
                      <p className="text-zinc-400 text-[10px] leading-relaxed mb-3 line-clamp-3">
                        {AWARDS_CONFIG.sections[2].description}
                      </p>

                      {/* Toggle Button for mobile screens */}
                      <button
                        onClick={() => setExcellenceExpanded(true)}
                        className="mt-3 inline-flex items-center gap-1 text-[9px] uppercase font-mono tracking-wider text-amber-400 hover:text-amber-300 font-extrabold transition-colors duration-200 animate-pulse hover:animate-none"
                      >
                        <span>Read Full Vision</span>
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>

                </div>
              </div>
            </section>

            {/* Past Winners Bidirectional Showcase Timeline Section */}
            <TimelineShowcase />
          </>
        )}

        {/* Section 4: Ballots & Dynamic Categories */}
        {currentPage === "voting" && (
          <NomineesSection categories={VOTING_DATA} />
        )}

        {currentPage === "gala" && (
          <>
            {/* Pristine 3D Spotlight Showcase Stage */}
            <section 
              id="showcase" 
              className="min-h-[120vh] relative flex items-center justify-center pointer-events-none"
            />
          </>
        )}

      </main>

      {/* Cinematic Red Carpet Footer */}
      <footer className="relative z-40 bg-zinc-950 border-t border-zinc-900 py-12 sm:py-16 text-zinc-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 flex flex-col gap-10 sm:gap-12">
          
          {/* 4. INLINE COUNTDOWN TIMER */}
          {AWARDS_CONFIG.status.showCountdown && (
            <div className="border-b border-zinc-900 pb-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
              <div className="text-center lg:text-left max-w-md">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[9px] font-mono tracking-[0.25em] text-amber-300 uppercase">
                    Countdown to Immortality
                  </span>
                </div>
                <p className="text-zinc-200 text-xs sm:text-sm font-semibold">
                  The grand signature ceremony and voting closes soon. Register your ballots.
                </p>
              </div>

              {/* Countdown Digits in Champagne Gold */}
              <div className="flex items-center gap-3 sm:gap-5 font-mono text-center">
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-4xl font-light text-[#F8E7C9] tracking-tight transition-transform duration-300 select-none drop-shadow-[0_0_15px_rgba(248,231,201,0.15)]">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 mt-1">Days</span>
                </div>
                <span className="text-xl sm:text-2xl font-light text-amber-500/20 mb-3">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-4xl font-light text-[#F8E7C9] tracking-tight transition-transform duration-300 select-none drop-shadow-[0_0_15px_rgba(248,231,201,0.15)]">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 mt-1">Hours</span>
                </div>
                <span className="text-xl sm:text-2xl font-light text-amber-500/20 mb-3">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-4xl font-light text-[#F8E7C9] tracking-tight transition-transform duration-300 select-none drop-shadow-[0_0_15px_rgba(248,231,201,0.15)]">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 mt-1">Mins</span>
                </div>
                <span className="text-xl sm:text-2xl font-light text-amber-500/20 mb-3">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-4xl font-light text-[#F8E7C9] tracking-tight transition-transform duration-300 select-none drop-shadow-[0_0_15px_rgba(248,231,201,0.15)]">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-zinc-500 mt-1">Secs</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center items-center border-t border-zinc-900/40 pt-8 mt-4">
            <div className="text-[9px] sm:text-[10px] text-zinc-600 font-mono tracking-[0.2em] text-center uppercase">
              © {new Date().getFullYear()} THE RAYSIGNATURE AWARDS. ALL RIGHTS PRESERVED.
            </div>
          </div>
        </div>
      </footer>

      {/* Immersive Mobile Full-Screen Modals */}
      <AnimatePresence>
        {revealExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] w-full h-full bg-[#0b0c10]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="relative bg-zinc-950/90 border border-zinc-900 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.8)] max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col gap-5 select-none"
            >
              {/* Close Button UI matches premium control aesthetic */}
              <button
                onClick={() => setRevealExpanded(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white bg-zinc-900/40 p-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 hover:scale-105 active:scale-95 transition-all z-[210] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10 pt-4 flex flex-col gap-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/[0.04] border border-amber-400/40 w-fit shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                  <Award className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="font-mono text-[8px] tracking-[0.15em] bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent uppercase font-extrabold">
                    {AWARDS_CONFIG.sections[1].tagline}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-display tracking-[0.06em] uppercase mb-1 font-semibold text-zinc-100 drop-shadow-[0_2px_15px_rgba(251,191,36,0.1)] leading-tight">
                    Honoring The{" "}
                    <span className="bg-gradient-to-r from-yellow-100 via-amber-300 to-amber-500 bg-clip-text text-transparent font-extrabold font-sans">
                      Visionaries
                    </span>
                  </h2>
                  <h3 className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent font-mono text-[9px] tracking-[0.18em] uppercase font-semibold">
                    {AWARDS_CONFIG.sections[1].subtitle}
                  </h3>
                </div>

                <div className="border-t border-zinc-900/80 my-1" />

                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans">
                  {AWARDS_CONFIG.sections[1].description}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-3 mt-1 border-t border-zinc-900/80">
                  <div className="bg-zinc-900/30 border border-zinc-900/40 p-3 rounded-2xl">
                    <div className="text-xs sm:text-sm font-sans font-semibold text-amber-400 leading-none">Global State</div>
                    <div className="text-[7px] uppercase font-mono tracking-wider text-zinc-500 mt-1 font-bold">INFLUENCE</div>
                  </div>
                  <div className="bg-zinc-900/30 border border-zinc-900/40 p-3 rounded-2xl">
                    <div className="text-xs sm:text-sm font-sans font-semibold text-amber-400 leading-none">Signature Seal</div>
                    <div className="text-[7px] uppercase font-mono tracking-wider text-zinc-500 mt-1 font-bold">LAURELS</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {excellenceExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] w-full h-full bg-[#0b0c10]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
              className="relative bg-zinc-950/90 border border-zinc-900 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.8)] max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col gap-5 select-none"
            >
              {/* Close Button UI matches premium control aesthetic */}
              <button
                onClick={() => setExcellenceExpanded(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white bg-zinc-900/40 p-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 hover:scale-105 active:scale-95 transition-all z-[210] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10 pt-4 flex flex-col gap-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/[0.04] border border-amber-400/40 w-fit shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                  <Clapperboard className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="font-mono text-[8px] tracking-[0.15em] bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent uppercase font-extrabold">
                    {AWARDS_CONFIG.sections[2].tagline}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-display tracking-[0.06em] uppercase mb-1 font-semibold text-zinc-100 drop-shadow-[0_2px_15px_rgba(251,191,36,0.1)] leading-tight">
                    Icons of The{" "}
                    <span className="bg-gradient-to-r from-yellow-100 via-amber-300 to-amber-500 bg-clip-text text-transparent font-extrabold font-sans">
                      Culture
                    </span>
                  </h2>
                  <h3 className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent font-mono text-[9px] tracking-[0.18em] uppercase font-semibold">
                    {AWARDS_CONFIG.sections[2].subtitle}
                  </h3>
                </div>

                <div className="border-t border-zinc-900/80 my-1" />

                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans">
                  {AWARDS_CONFIG.sections[2].description}
                </p>

                <div className="bg-amber-500/5 border border-amber-400/10 rounded-2xl items-start gap-3 flex p-4 mt-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-zinc-200 uppercase font-mono tracking-wide leading-none">
                      Verified Excellence
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed font-bold">
                      Every honoree is carefully vetted through rigorous peer metrics, ensuring only true pioneers receive.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
