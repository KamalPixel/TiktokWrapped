import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SLIDE_ORDER } from '../constants';
import WelcomeSlide from './slides/WelcomeSlide';
import KPISlide from './slides/KPISlide';
import ScreenTimeSlide from './slides/ScreenTimeSlide';
import DayRhythmSlide from './slides/DayRhythmSlide';
import TopCreatorsSlide from './slides/TopCreatorsSlide';
import HashtagSlide from './slides/HashtagSlide';
import CommentSlide from './slides/CommentSlide';
import CalendarSlide from './slides/CalendarSlide';
import SegmentationSlide from './slides/SegmentationSlide';
import RecommendationsSlide from './slides/RecommendationsSlide';
import ShareSlide from './slides/ShareSlide';

const SLIDE_COMPONENTS = {
  welcome: WelcomeSlide,
  kpi: KPISlide,
  screenTime: ScreenTimeSlide,
  dayRhythm: DayRhythmSlide,
  topCreators: TopCreatorsSlide,
  hashtags: HashtagSlide,
  comments: CommentSlide,
  calendar: CalendarSlide,
  segmentation: SegmentationSlide,
  recommendations: RecommendationsSlide,
  share: ShareSlide
};

const slideVariants = {
  enter: (direction) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction) => ({
    y: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95
  })
};

const SlideContainer = ({ data, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const availableSlides = SLIDE_ORDER.filter(
    slide => data.availableSlides[slide]
  );

  const currentSlide = availableSlides[currentIndex];
  const SlideComponent = SLIDE_COMPONENTS[currentSlide];

  const goToSlide = useCallback((newIndex, newDirection) => {
    if (isAnimating) return;
    if (newIndex < 0 || newIndex >= availableSlides.length) return;

    setIsAnimating(true);
    setDirection(newDirection);
    setCurrentIndex(newIndex);
  }, [isAnimating, availableSlides.length]);

  const nextSlide = useCallback(() => {
    if (currentIndex < availableSlides.length - 1) {
      goToSlide(currentIndex + 1, 1);
    }
  }, [currentIndex, availableSlides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1, -1);
    }
  }, [currentIndex, goToSlide]);

  // piltaster + mellomrom for å navigere
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        onRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, onRestart]);

  // swipe på mobil
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const diffY = touchStartY - touchEndY;
      const diffX = touchStartX - touchEndX;

      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
        if (diffY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextSlide, prevSlide]);

  return (
    <div className="fixed inset-0 bg-[var(--bg-void)] overflow-hidden">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[var(--bg-dark)]">
        <motion.div
          className="h-full bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-purple)] to-[var(--neon-cyan)]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / availableSlides.length) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Slide indicator dots */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {availableSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index, index > currentIndex ? 1 : -1)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === currentIndex
                ? 'bg-[var(--neon-pink)] scale-125 glow-pink'
                : 'bg-[var(--bg-elevated)] hover:bg-[var(--text-muted)]'
              }
            `}
            aria-label={`Gå til slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation buttons - Desktop */}
      <div className="hidden sm:block">
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-[var(--bg-surface)] border border-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-[var(--neon-cyan)] transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {currentIndex < availableSlides.length - 1 && (
          <button
            onClick={nextSlide}
            className="fixed right-16 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-[var(--bg-surface)] border border-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-[var(--neon-pink)] transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile navigation hint */}
      <div className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 text-[var(--text-muted)] text-xs flex items-center gap-2">
        <span>Swipe for å navigere</span>
        <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Restart button */}
      <button
        onClick={onRestart}
        className="fixed top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--bg-elevated)] text-[var(--text-muted)] text-xs hover:text-white hover:border-[var(--text-muted)] transition-all flex items-center gap-2"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Start på nytt
      </button>

      {/* Slide content */}
      <AnimatePresence
        initial={false}
        custom={direction}
        mode="wait"
        onExitComplete={() => setIsAnimating(false)}
      >
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="absolute inset-0"
        >
          <SlideComponent
            data={data}
            onNext={nextSlide}
            isLast={currentIndex === availableSlides.length - 1}
          />
        </motion.div>
      </AnimatePresence>

      {/* Noise overlay */}
      <div className="noise-overlay" />
    </div>
  );
};

export default SlideContainer;
