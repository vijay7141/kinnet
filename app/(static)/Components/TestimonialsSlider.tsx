'use client'

import { useEffect, useState } from "react";

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
  const visibleIndex =
    ((activeIndex % testimonialCount) + testimonialCount) % testimonialCount;

  const goToSlide = (index: number) => {
    setIsTransitionEnabled(true);
    setActiveIndex(testimonialCount + index);
  };

  const goToPrevious = () => {
    setIsTransitionEnabled(true);
    setActiveIndex((currentIndex) => currentIndex - 1);
  };

  const goToNext = () => {
    setIsTransitionEnabled(true);
    setActiveIndex((currentIndex) => currentIndex + 1);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIsTransitionEnabled(true);
      setActiveIndex((currentIndex) => currentIndex + 1);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

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

  return (
    <div className="kinnect-testimonial-slider">
      <div className="kinnect-slider-controls" aria-label="Testimonial navigation">
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
      </div>

      <div className="kinnect-slider-viewport">
        <div
          className={
            isTransitionEnabled
              ? "kinnect-slider-track"
              : "kinnect-slider-track is-static"
          }
          style={{
            transform: `translateX(calc(${activeIndex} * -1 * (var(--testimonial-card-width) + var(--testimonial-gap))))`,
          }}
          onTransitionEnd={handleTransitionEnd}
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
