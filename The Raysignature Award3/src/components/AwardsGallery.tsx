import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Google Drive file IDs of high-contrast elegant event images
const GALLERY_IMAGE_IDS = [
  "1L-_rs_5Ku67ZW3Xkq-U-O9G8HP3JpMjX",
  "1Nx3HAYQGy9AfFNVRl_E3vuKyf2hHhItd",
  "1Xszxc0GModLMLM3jBk3v3IRXqwqRhGV5",
  "1sJctDaVWvXeGk2-O5OWtbmF-Z_1WIbCB",
  "1RYnSQ7tGvF62GjM67SqUVwVjcm_KUlxI",
  "13JcQmGjeY5lMscXfHURu8XrlueXRBB3f",
  "1UDsL_oJUt8Yd-AfLskSgiSunLtAvLXvv",
  "1EOYQ3haXGabxDoYlCz7y5bV9iTXw2PjU"
];

const makeImageUrl = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;

export default function AwardsGallery() {
  const [startIndex, setStartIndex] = useState(0);

  // We display 4 items on desktop, 2 on tablet, and sliding behavior on mobile.
  // To allow slick paging, let's rotate when arrow is clicked
  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? GALLERY_IMAGE_IDS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev === GALLERY_IMAGE_IDS.length - 1 ? 0 : prev + 1));
  };

  // Get index-padded visible items (circular list wrapper)
  const getVisibleImages = () => {
    const list = [];
    for (let i = 0; i < 4; i++) {
      const idx = (startIndex + i) % GALLERY_IMAGE_IDS.length;
      list.push({
        id: GALLERY_IMAGE_IDS[idx],
        url: makeImageUrl(GALLERY_IMAGE_IDS[idx]),
        key: `${GALLERY_IMAGE_IDS[idx]}-${idx}`
      });
    }
    return list;
  };

  const visibleImages = getVisibleImages();

  return (
    <section
      id="gallery"
      className="relative w-full block clear-both py-24 px-4 overflow-hidden select-none bg-[#12072B]"
    >
      {/* Decorative Subtle Gold Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D8B05C]/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Header Layout (Matching image_289457.jpg) */}
      <div className="flex flex-col items-center text-center px-4 mb-16 max-w-4xl mx-auto relative z-10">
        
        {/* Top Pill with fading divider lines */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#D8B05C]/40" />
          <div className="px-5 py-1.5 rounded-full border border-[#D8B05C]/30 bg-[#1A0B36] shadow-[0_0_15px_rgba(216,176,92,0.1)]">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-[#D8B05C] uppercase font-bold">
              PHOTO GALLERY
            </span>
          </div>
          <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#D8B05C]/40" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans tracking-tight mb-4 text-white font-semibold">
          Awards <span className="text-[#D8B05C] italic font-display font-light">Gallery</span>
        </h2>

        {/* Subtitle */}
        <p className="text-zinc-400 text-xs sm:text-sm font-sans tracking-wide leading-relaxed max-w-xl font-medium">
          Take a look at these awesome pictures from our previous awards show celebration! Use the arrows or swipe to browse them.
        </p>
      </div>

      {/* Slider Grid Outer Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10 flex items-center justify-between gap-4">
        
        {/* Left Navigation Arrow */}
        <button
          onClick={handlePrev}
          aria-label="Previous images"
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-[#D8B05C]/30 hover:border-[#D8B05C]/90 hover:bg-[#D8B05C]/10 text-[#D8B05C] hover:scale-105 active:scale-95 transition-all cursor-pointer bg-[#1A0B36]/80 backdrop-blur shrink-0 shadow-[0_0_15px_rgba(216,176,92,0.05)]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Grid Container */}
        <div className="w-full overflow-hidden">
          {/* For desktop: simple beautiful CSS Grid of 4 cards */}
          <div className="hidden md:grid grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleImages.map((img, index) => (
                <motion.div
                  key={img.key}
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -15 }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.05 }}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#D8B05C]/20 bg-[#1A0B36]/50 shadow-[0_4px_30px_rgba(0,0,0,0.4)] hover:border-[#D8B05C]/50 hover:shadow-[0_4px_40px_rgba(216,176,92,0.15)] transition-all duration-300"
                >
                  {/* Image with subtle hover zoom */}
                  <img
                    src={img.url}
                    alt="Celebration Gala Moment"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12072B] via-transparent to-transparent opacity-85" />

                  {/* Gold-bordered 2024 Edition Pill */}
                  <div className="absolute bottom-5 left-5 z-20">
                    <div className="px-3 py-1 rounded-full border border-[#D8B05C]/40 bg-[#12072B]/85 backdrop-blur shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                      <span className="font-mono text-[9px] tracking-wider text-[#D8B05C] uppercase font-bold">
                        2024 EDITION
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* For tablet/mobile layout: horizontal scroll track with snap scrolling */}
          <div className="flex md:hidden overflow-x-auto snap-x scrollbar-none gap-4 px-1 pb-4">
            {GALLERY_IMAGE_IDS.map((id, index) => (
              <div
                key={`mobile-${id}`}
                className="snap-center shrink-0 w-[260px] sm:w-[300px] relative aspect-[3/4] rounded-xl overflow-hidden border border-[#D8B05C]/25 bg-[#1A0B36]/50 shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
              >
                {/* Image */}
                <img
                  src={makeImageUrl(id)}
                  alt="Celebration Gala Moment"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#12072B] via-transparent to-transparent opacity-85" />

                {/* Gold-bordered 2024 Edition Pill */}
                <div className="absolute bottom-4 left-4 z-20">
                  <div className="px-3 py-1 rounded-full border border-[#D8B05C]/40 bg-[#12072B]/85 backdrop-blur">
                    <span className="font-mono text-[9px] tracking-wider text-[#D8B05C] uppercase font-bold">
                      2024 EDITION
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Navigation Arrow */}
        <button
          onClick={handleNext}
          aria-label="Next images"
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-[#D8B05C]/30 hover:border-[#D8B05C]/90 hover:bg-[#D8B05C]/10 text-[#D8B05C] hover:scale-105 active:scale-95 transition-all cursor-pointer bg-[#1A0B36]/80 backdrop-blur shrink-0 shadow-[0_0_15px_rgba(216,176,92,0.05)]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

      </div>

      {/* Mobile Indicator Row for sliding navigation */}
      <div className="flex sm:hidden justify-center items-center gap-4 mt-6 relative z-10">
        <button
          onClick={handlePrev}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-[#D8B05C]/20 bg-[#1A0B36]/80 text-[#D8B05C] active:scale-90 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-mono text-[10px] text-zinc-500 tracking-wider font-bold">
          SWIPE OR TAP ARROWS TO BROWSE
        </span>
        <button
          onClick={handleNext}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-[#D8B05C]/20 bg-[#1A0B36]/80 text-[#D8B05C] active:scale-90 transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
