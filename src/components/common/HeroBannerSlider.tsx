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
    alt: 'UdyogSetu • Find Verified Factory Jobs Without Middlemen • Chakan MIDC & Pune Belt',
    link: '/jobs',
    title: 'Find Verified Factory Jobs Without Middlemen',
  },
  {
    id: 'banner-2',
    image: '/images/banner-2.jpg',
    alt: 'UdyogSetu • Good Work. Fair Hiring • Walk-in Drives & Salary Details Upfront',
    link: '/jobs',
    title: 'Good Work. Fair Hiring. Direct from Factories',
  },
  {
    id: 'banner-3',
    image: '/images/banner-3.jpg',
    alt: 'UdyogSetu • Your Next Shift Starts Here • Chakan MIDC & Pune Belt',
    link: '/jobs',
    title: 'Your Next Shift Starts Here',
  },
];

export const HeroBannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
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

  return (
    <div
      className="relative max-w-4xl mx-auto group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Window */}
      <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200/90 shadow-subtle hover:border-zinc-300 hover:shadow-mobbin transition-all relative bg-zinc-50">
        {/* Slides Track */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {BANNERS.map((banner, idx) => (
            <div key={banner.id} className="w-full shrink-0 relative">
              <Link href={banner.link} className="block w-full cursor-pointer" title={banner.title}>
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-auto object-cover block"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Slide Indicators (Pill Dots) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/35 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Left Slide Button */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-zinc-900 shadow-lg border border-zinc-200/90 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-900 stroke-[2.2]" />
      </button>

      {/* Right Slide Button */}
      <button
        type="button"
        onClick={nextSlide}
        className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-zinc-900 shadow-lg border border-zinc-200/90 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-900 stroke-[2.2]" />
      </button>
    </div>
  );
};
