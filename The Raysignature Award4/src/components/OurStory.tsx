import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function OurStory() {
  return (
    <section
      id="our-story"
      className="relative w-full block clear-both bg-[#12072B] py-24 sm:py-32 px-6 overflow-hidden select-none"
    >
      {/* Subtle background luxury ambient glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-[#D8B05C]/[0.02] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#D8B05C]/[0.01] rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 max-w-7xl mx-auto items-center relative z-10">
        
        {/* Left Column: The Narrative Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start space-y-6 text-left"
        >
          {/* Top Pill Label */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-1 rounded-full border border-[#D8B05C]/30 bg-[#1A0B36] shadow-[0_0_15px_rgba(216,176,92,0.08)]">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-[#D8B05C] uppercase font-bold">
                OUR HISTORY
              </span>
            </div>
            <div className="h-[1px] w-8 bg-[#D8B05C]/30" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans tracking-tight text-white font-semibold leading-[1.15]">
            Our Story: <span className="text-[#D8B05C] italic font-display font-light">Cheering</span> for Creative People.
          </h2>

          {/* Body Paragraphs */}
          <div className="space-y-4 text-zinc-400 text-sm sm:text-base tracking-wide leading-relaxed font-medium">
            <p>
              We created The Raysignature Awards to celebrate people who build and design wonderful things. We look all over the world to find people who don't just do their job, but invent totally new ways of doing it!
            </p>
            <p>
              Our main goal is to remember these amazing accomplishments forever. By doing this, we hope to inspire future kids and creators to work hard and build amazing things, too!
            </p>
          </div>

          {/* Core values row */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zinc-900/60 w-full">
            <div>
              <div className="font-display italic text-2xl text-[#D8B05C]">01</div>
              <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Honesty</div>
            </div>
            <div>
              <div className="font-display italic text-2xl text-[#D8B05C]">02</div>
              <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">New Ideas</div>
            </div>
            <div>
              <div className="font-display italic text-2xl text-[#D8B05C]">03</div>
              <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Great Work</div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: The Visual Focus */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="relative w-full flex justify-center lg:justify-end"
        >
          {/* Main Visual Box */}
          <div className="relative aspect-[4/5] w-full max-w-[420px] rounded-2xl overflow-hidden border border-[#D8B05C]/25 bg-[#1A0B36]/50 shadow-[0_4px_40px_rgba(0,0,0,0.5)] group hover:border-[#D8B05C]/50 transition-all duration-500">
            
            {/* Ambient luxury image pattern using our custom brand image */}
            <img
              src="https://lh3.googleusercontent.com/d/1lPtxbLAKQcr5sXsLJAefUAxbHXIYl9U6"
              alt="The Raysignature Gallery Showcase"
              className="w-full h-full object-cover opacity-100 transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
