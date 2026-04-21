'use client'

import { useCallback, useEffect, useRef, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  title: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      '"Kinnect has transformed our referral speed. We save hours every day that used to be spent chasing phone calls."',
    name: "Dr. Sarah Mitchell",
    title: "Senior Veterinarian, Urban Vet Care",
    avatar: "avatar-1.png",
  },
  {
    quote:
      '"The transparency for pet owners is a game changer. Our clients feel held and informed through every step."',
    name: "Dr. James Chen",
    title: "Referral Coordinator, City Specialty Center",
    avatar: "avatar-1.png",
  },
  {
    quote:
      '"Kinnect helps us move referrals forward without the back-and-forth that used to slow everything down for our team."',
    name: "Dr. Priya Reynolds",
    title: "Practice Owner, Riverside Veterinary Care",
    avatar: "avatar-1.png",
  },
  {
    quote:
      '"We can communicate faster, keep records cleaner, and make the entire handoff feel much more professional for pet owners."',
    name: "Dr. Elena Brooks",
    title: "Medical Director, Northside Animal Clinic",
    avatar: "avatar-1.png",
  },
];

export default function TestimonialsSlider() {
  const testimonialCount = testimonials.length;
  const loopedTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const [activeIndex, setActiveIndex] = useState(testimonialCount);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef<{
    startX: number;
    currentX: number;
    hasMoved: boolean;
  } | null>(null);
  const autoSlideRef = useRef<number | null>(null);
  const visibleIndex =
    ((activeIndex % testimonialCount) + testimonialCount) % testimonialCount;
  const trackTranslate = `calc(${activeIndex} * -1 * (var(--testimonial-card-width) + var(--testimonial-gap)) + ${dragOffset}px)`;

  const clearAutoSlide = () => {
    if (autoSlideRef.current !== null) {
      window.clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  const startAutoSlide = useCallback(() => {
    clearAutoSlide();
    autoSlideRef.current = window.setInterval(() => {
      setIsTransitionEnabled(true);
      setDragOffset(0);
      setActiveIndex((currentIndex) => currentIndex + 1);
    }, 4500);
  }, []);

  const goToSlide = (index: number) => {
    setIsTransitionEnabled(true);
    setDragOffset(0);
    setActiveIndex(testimonialCount + index);
  };

  const goToPrevious = () => {
    setIsTransitionEnabled(true);
    setDragOffset(0);
    setActiveIndex((currentIndex) => currentIndex - 1);
  };

  const goToNext = () => {
    setIsTransitionEnabled(true);
    setDragOffset(0);
    setActiveIndex((currentIndex) => currentIndex + 1);
  };

  useEffect(() => {
    startAutoSlide();

    return () => clearAutoSlide();
  }, [startAutoSlide]);

  const handleTransitionEnd = () => {
    if (activeIndex < testimonialCount) {
      setIsTransitionEnabled(false);
      setActiveIndex(activeIndex + testimonialCount);
    } else if (activeIndex >= testimonialCount * 2) {
      setIsTransitionEnabled(false);
      setActiveIndex(activeIndex - testimonialCount);
    }
  };

  useEffect(() => {
    if (!isTransitionEnabled) {
      const frame = window.requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });

      return () => window.cancelAnimationFrame(frame);
    }
  }, [isTransitionEnabled]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    clearAutoSlide();
    setIsDragging(true);
    setIsTransitionEnabled(false);
    setDragOffset(0);
    dragStateRef.current = {
      startX: event.clientX,
      currentX: event.clientX,
      hasMoved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState) {
      return;
    }

    dragState.currentX = event.clientX;
    const nextOffset = dragState.currentX - dragState.startX;

    if (Math.abs(nextOffset) > 6) {
      dragState.hasMoved = true;
    }

    setDragOffset(nextOffset);
  };

  const finishDrag = () => {
    const dragState = dragStateRef.current;
    if (!dragState) {
      return;
    }

    const finalOffset = dragState.currentX - dragState.startX;
    const threshold = 70;

    dragStateRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
    setIsTransitionEnabled(true);

    if (finalOffset <= -threshold) {
      setActiveIndex((currentIndex) => currentIndex + 1);
    } else if (finalOffset >= threshold) {
      setActiveIndex((currentIndex) => currentIndex - 1);
    }

    startAutoSlide();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    finishDrag();
  };

  const handlePointerCancel = () => {
    if (!dragStateRef.current) {
      return;
    }

    finishDrag();
  };

  return (
    <div className="kinnect-testimonial-slider">
      {/* <div className="kinnect-slider-controls" aria-label="Testimonial navigation">
        <button
          type="button"
          className="kinnect-slider-button"
          onClick={goToPrevious}
          aria-label="Show previous testimonial"
        >
          Prev
        </button>
        <button
          type="button"
          className="kinnect-slider-button"
          onClick={goToNext}
          aria-label="Show next testimonial"
        >
          Next
        </button>
      </div> */}

      <div className="kinnect-slider-viewport">
        <div
          className={
            isTransitionEnabled
              ? isDragging
                ? "kinnect-slider-track is-dragging"
                : "kinnect-slider-track"
              : isDragging
                ? "kinnect-slider-track is-static is-dragging"
                : "kinnect-slider-track is-static"
          }
          style={{
            transform: `translateX(${trackTranslate})`,
          }}
          onTransitionEnd={handleTransitionEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerCancel}
        >
          {loopedTestimonials.map((testimonial, index) => (
            <div
              className="kinnect-slider-slide"
              key={`${testimonial.name}-${index}`}
            >
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 kinnect-quote-card">
                <div className="kinnect-quote-mark" aria-hidden="true">
                  &rdquo;
                </div>
                <p className="kinnect-quote-copy mb-4">{testimonial.quote}</p>
                <div className="mt-auto d-flex gap-3 align-items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="img-fluid kinnect-quote-avatar"
                  />
                  <div>
                    <p className="kinnect-quote-name mb-1">{testimonial.name}</p>
                    <p className="kinnect-quote-title mb-0">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="kinnect-slider-dots" aria-label="Select testimonial">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.name}
            type="button"
            className={
              index === visibleIndex
                ? "kinnect-slider-dot is-active"
                : "kinnect-slider-dot"
            }
            onClick={() => goToSlide(index)}
            aria-label={`Show testimonial ${index + 1}`}
            aria-pressed={index === visibleIndex}
          />
        ))}
      </div>
    </div>
  );
}
