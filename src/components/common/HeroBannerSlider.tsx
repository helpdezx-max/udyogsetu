import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface BannerSlide {
  id: string;
  image: string;
  alt: string;
  link: string;
  title: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: 'banner-1',
    image: '/images/banner-1.jpg',
    alt: 'Rozzy • 100+ Verified Jobs • Find work. Build your future.',
    link: '/jobs',
    title: '100+ Verified Jobs • Find work. Build your future.',
  },
  {
    id: 'banner-2',
    image: '/images/banner-2.jpg',
    alt: 'Rozzy • Good Work. Fair Hiring • Direct from factories',
    link: '/jobs',
    title: 'Good Work. Fair Hiring • Direct from factories',
  },
  {
    id: 'banner-3',
    image: '/images/banner-3.jpg',
    alt: 'Rozzy • Your Next Shift Starts Here • Chakan MIDC & Pune Belt',
    link: '/jobs',
    title: 'Your Next Shift Starts Here • Chakan MIDC & Pune Belt',
  },
];

// Triple-extended slides for smooth multi-item carousel looping
const EXTENDED_SLIDES = [...BANNERS, ...BANNERS, ...BANNERS];

export const HeroBannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const touchStartXRef = useRef<number | null>(null);

  // Responsive items count detector
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx % BANNERS.length);
  };

  // Auto-advance timer (every 5 seconds, pauses when hovered)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch Swipe Handlers for Mobile / Tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartXRef.current = null;
  };

  const slidePercentage = 100 / itemsPerView;

  return (
    <div
      className="relative w-full mx-auto select-none overflow-hidden sm:overflow-visible"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Window */}
      <div className="overflow-hidden py-1">
        {/* Slides Track */}
        <div
          className="flex -mx-1.5 sm:-mx-2 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * slidePercentage}%)` }}
        >
          {EXTENDED_SLIDES.map((banner, idx) => (
            <div
              key={`${banner.id}-${idx}`}
              className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-1.5 sm:px-2 relative"
            >
              <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200/90 shadow-subtle hover:border-zinc-300 hover:shadow-mobbin transition-all relative bg-zinc-50 aspect-[2/1]">
                <Link
                  href={banner.link}
                  className="block w-full h-full cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                  title={banner.title}
                >
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    className="w-full h-full object-cover block"
                    loading={idx < 3 ? 'eager' : 'lazy'}
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators (Pill Dots) */}
      <div className="flex items-center justify-center gap-1.5 mt-3 sm:mt-3.5">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === idx
                ? 'w-6 h-1.5 bg-zinc-950'
                : 'w-1.5 h-1.5 bg-zinc-300 hover:bg-zinc-500'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Left Slide Button (Tablet & Desktop only; Mobile uses native touch swipe) */}
      <button
        type="button"
        onClick={prevSlide}
        className="hidden sm:flex absolute left-1.5 sm:-left-5 lg:-left-6 xl:-left-7 top-[calc(50%-12px)] -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-zinc-50 text-zinc-900 shadow-xl border border-zinc-200/90 items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900 stroke-[2.2]" />
      </button>

      {/* Right Slide Button (Tablet & Desktop only; Mobile uses native touch swipe) */}
      <button
        type="button"
        onClick={nextSlide}
        className="hidden sm:flex absolute right-1.5 sm:-right-5 lg:-right-6 xl:-right-7 top-[calc(50%-12px)] -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-zinc-50 text-zinc-900 shadow-xl border border-zinc-200/90 items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-900 stroke-[2.2]" />
      </button>
    </div>
  );
};
