import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ArrowRightLeft } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Raw Google Drive Image IDs provided by the user
const IMAGE_IDS = [
  "1L-_rs_5Ku67ZW3Xkq-U-O9G8HP3JpMjX",
  "1Nx3HAYQGy9AfFNVRl_E3vuKyf2hHhItd",
  "1Xszxc0GModLMLM3jBk3v3IRXqwqRhGV5",
  "1sJctDaVWvXeGk2-O5OWtbmF-Z_1WIbCB",
  "1RYnSQ7tGvF62GjM67SqUVwVjcm_KUlxI",
  "13JcQmGjeY5lMscXfHURu8XrlueXRBB3f",
  "1UDsL_oJUt8Yd-AfLskSgiSunLtAvLXvv",
  "1EOYQ3haXGabxDoYlCz7y5bV9iTXw2PjU",
  "1Kbw5a-LyT-IlHqgeZFS53vZca3QNMv8G",
  "1Eoo_kAlaCblbIPyRc1M8G6k7yzFMFJxW",
  "1Ib0Drd_PbRjr-DGOgmafEdzhcJ9WO9EW",
  "1nJbRJdfx_CwL3Qp-sMU8ga9GWaRcdMbo",
  "1pLPhXC4Go9sMtu9vIITrqj9BLhTTsZpO",
  "1jEQa46Mzg_Uox_CgH4T9Fb9wf_yP9tg7",
  "1H-wibz25njWBTJCVSRAyYSBDl9OJwj4n",
  "1MtX4TuoV3qhlP4Zt37DIzNG05UQIQDqE",
  "1kYEZIhvny_Hyo5o9xPut4qrCZ0Hx1Tsf",
  "1_YAqAnGG6cAkvO6fTaLx55bEAzfMRvMO",
  "1SsttBSwgVKiICpKKm66JLk1jcEDPX6P2",
  "1i9MgmLqwPFnb5RL2af91MT7_E_f8vi1K",
  "1H7jFssCJC2Ne8Ix48rZZkdYh_ryF8D63",
  "1ZAEZ_SmJDG1ckpZ00cE3EaMrA5a8SXhI",
  "1R8Y9OHyGcp_-l8a3dZz5nSKYgPUgjdJF",
  "1UYkr3npmREW7dSM-Xm5CsYvU_YyNFH-o",
  "13qt8bYC8KPX_twUjtr9Lq0TsZCVWUf6V",
  "1cyO9qWZUZz5f1-_JzVWTUwMy-rmvLYAs",
  "1XinMwH5hpgftQTv3egcOvsiuehQ7rOv2",
  "1ie-MFi5uG-Kf7ZgFfu6LyqGfX2RZ70Pm",
  "13BssDr81WdXvoq9y64zIIDsoctIngIh-",
  "1y8Ao8c30dx3yZ8m83SEzzvC79vG8BMPe",
  "1qn-bWwVqTN4WD8MmXy72_fxBDHayt2Be",
  "1swj2M31seYLdRL9qsrO4GRgq8xh4hmO2",
  "1UceJrQsuyZa9FzdyDxSgvGlpYN4NRfGN",
  "1U-yuTiboSbi_yu2MjNd2r1s9CWQGNF5n",
  "1AWG4ilPEMY8vAWRCCRDbu27b4CQCvN3S",
];

// Helper to convert typical web-viewable Google Drive file links into highly reliable direct image paths
const makeDirectUrl = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;

// Distributing the 35 images across 3 horizontal tracks for maximized visual variation
const ROW_1_BASIS = IMAGE_IDS.slice(0, 12).map(makeDirectUrl);
const ROW_2_BASIS = IMAGE_IDS.slice(12, 24).map(makeDirectUrl);
const ROW_3_BASIS = IMAGE_IDS.slice(24).map(makeDirectUrl);

// Tripling the rows ensures the horizontal tracks always have excess content to overlap nicely across viewport sizes
const TRIPLED_ROW_1 = [...ROW_1_BASIS, ...ROW_1_BASIS, ...ROW_1_BASIS];
const TRIPLED_ROW_2 = [...ROW_2_BASIS, ...ROW_2_BASIS, ...ROW_2_BASIS];
const TRIPLED_ROW_3 = [...ROW_3_BASIS, ...ROW_3_BASIS, ...ROW_3_BASIS];

export default function TimelineShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const track3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track1 = track1Ref.current;
    const track2 = track2Ref.current;
    const track3 = track3Ref.current;

    if (!container || !track1 || !track2 || !track3) return;

    const ctx = gsap.context(() => {
      // Establish off-center seed points to prevent looking identically offset
      gsap.set(track1, { xPercent: -15 });
      gsap.set(track2, { xPercent: -45 });
      gsap.set(track3, { xPercent: -25 });

      // Row 1 drifts LEFT on scroll
      gsap.to(track1, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Row 2 drifts RIGHT on scroll
      gsap.to(track2, {
        xPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Row 3 drifts LEFT on scroll
      gsap.to(track3, {
        xPercent: -55,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="winners"
      className="relative w-full py-20 sm:py-32 bg-[#06070a] border-t border-zinc-900/40 overflow-hidden select-none"
    >
      {/* Decorative Ambient Cinematic Lighting Accents */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#d8b05c]/[0.02] rounded-full blur-[110px] pointer-events-none" />

      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 relative z-10 mb-12 sm:mb-20">
        <div className="max-w-3xl text-center md:text-left select-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 mb-5 sm:mb-6 transition-all duration-300 transform hover:scale-[1.02]">
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.25em] text-amber-300 uppercase font-medium">
              Bidirectional Horizon
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans tracking-tight font-semibold text-zinc-100 mb-4 leading-tight sm:leading-none">
            Interactive Timeline{" "}
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-[#d8b05c] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(218,176,92,0.2)]">
              Showcase
            </span>
          </h2>
          <p className="text-zinc-400/90 text-xs sm:text-sm leading-relaxed font-sans max-w-xl">
            Witness our legendary multi-decker scroll tapestry. Watch the three tracks orbit in perfectly synchronized, opposing layers driven entirely by your vertical travel.
          </p>
        </div>
      </div>

      {/* Track Layout Container - Pointer Events None on outer container, pointer-events-auto on visual cards */}
      <div className="space-y-6 sm:space-y-10 w-full relative pointer-events-none">
        
        {/* Row 1 (Drifts LEFT) */}
        <div className="relative overflow-hidden w-full py-1">
          <div 
            ref={track1Ref}
            className="flex gap-4 sm:gap-6 w-max items-center px-4"
          >
            {TRIPLED_ROW_1.map((url, index) => (
              <div
                key={`r1-${index}`}
                className="w-[180px] sm:w-[325px] aspect-[16/10] sm:aspect-[16/10] rounded-xl overflow-hidden bg-zinc-950 border border-amber-500/10 p-1 sm:p-1.5 backdrop-blur-sm pointer-events-auto select-none hover:border-amber-400/35 hover:shadow-[0_4px_25px_rgba(218,176,92,0.08)] hover:scale-[1.02] transition-all duration-500 group"
              >
                <div className="relative w-full h-full overflow-hidden rounded-lg">
                  <img
                    src={url}
                    alt={`Showcase item 1-${index}`}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06070a]/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 (Drifts RIGHT) */}
        <div className="relative overflow-hidden w-full py-1">
          <div 
            ref={track2Ref}
            className="flex gap-4 sm:gap-6 w-max items-center px-4"
          >
            {TRIPLED_ROW_2.map((url, index) => (
              <div
                key={`r2-${index}`}
                className="w-[180px] sm:w-[325px] aspect-[16/10] sm:aspect-[16/10] rounded-xl overflow-hidden bg-zinc-950 border border-amber-500/10 p-1 sm:p-1.5 backdrop-blur-sm pointer-events-auto select-none hover:border-amber-400/35 hover:shadow-[0_4px_25px_rgba(218,176,92,0.08)] hover:scale-[1.02] transition-all duration-500 group"
              >
                <div className="relative w-full h-full overflow-hidden rounded-lg">
                  <img
                    src={url}
                    alt={`Showcase item 2-${index}`}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06070a]/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 (Drifts LEFT) */}
        <div className="relative overflow-hidden w-full py-1">
          <div 
            ref={track3Ref}
            className="flex gap-4 sm:gap-6 w-max items-center px-4"
          >
            {TRIPLED_ROW_3.map((url, index) => (
              <div
                key={`r3-${index}`}
                className="w-[180px] sm:w-[325px] aspect-[16/10] sm:aspect-[16/10] rounded-xl overflow-hidden bg-zinc-950 border border-amber-500/10 p-1 sm:p-1.5 backdrop-blur-sm pointer-events-auto select-none hover:border-amber-400/35 hover:shadow-[0_4px_25px_rgba(218,176,92,0.08)] hover:scale-[1.02] transition-all duration-500 group"
              >
                <div className="relative w-full h-full overflow-hidden rounded-lg">
                  <img
                    src={url}
                    alt={`Showcase item 3-${index}`}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06070a]/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Branding Notes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 relative z-10 mt-10 sm:mt-16 text-center md:text-left">
        <div className="inline-flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500/40" />
          <span>Interactive parallax track depth is optimized dynamically</span>
        </div>
      </div>
    </section>
  );
}
