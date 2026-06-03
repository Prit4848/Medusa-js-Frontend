'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const slides = [
    {
        id: 1,
        eyebrow: 'CHAIR',
        bg: '/images/hero/slide1.png',
    },
    {
        id: 2,
        eyebrow: 'CHAIR',
        bg: '/images/hero/slide2.png',
    },
    {
        id: 3,
        eyebrow: 'CHAIR',
        bg: '/images/hero/slide3.png',
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    const goTo = useCallback(
        (index: number) => {
            if (animating) return;

            setAnimating(true);

            setTimeout(() => {
                setCurrent(index);
                setAnimating(false);
            }, 400);
        },
        [animating]
    );

    const prev = () =>
        goTo((current - 1 + slides.length) % slides.length);

    const next = useCallback(
        () => goTo((current + 1) % slides.length),
        [current, goTo]
    );

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    return (
        <section className="relative w-full h-[60vh] lg:h-[78vh] min-h-[400px] lg:min-h-[620px] overflow-hidden bg-[#ede9e3]">
            {/* Background Images */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{
                        opacity: index === current ? 1 : 0,
                        backgroundImage: `url(${slide.bg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                    }}
                />
            ))}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 lg:via-white/30 to-transparent" />

            {/* Content */}
           <div
  className="relative z-10 h-full flex items-start pt-[80px] lg:pt-[135px]"
                style={{
                    opacity: animating ? 0 : 1,
                    transition: 'opacity 0.4s ease',
                }}
            >
                <div className="max-w-[1320px] mx-auto px-6 lg:px-8 lg:pl-[25px] w-full">
                    {/* Small Label */}
                    <p className="text-[12px] lg:text-[14px] font-[800] tracking-[0.08em] uppercase text-[#c17f4a] mb-4 lg:mb-6">
                        {slides[current].eyebrow}
                    </p>

                    <h1 className="mb-6 lg:mb-10 text-[#222] max-w-[700px]">
                        <span className="block text-[28px] lg:text-[40px] leading-none font-light">
                            get all
                        </span>

                        <span className="block mt-3 text-[36px] lg:text-[48px] leading-[0.95] font-[800] uppercase">
                            THE GOOD STUFF
                        </span>
                    </h1>
                    {/* CTA Button */}
                    <Link
                        href="/shop"
                        className="
    inline-flex
    items-center
    gap-4
    h-[54px]
    lg:h-[64px]
    px-10
    lg:px-14
    border
    border-[#c17f4a]
    text-[#c17f4a]
    text-[14px]
    lg:text-[15px]
    font-semibold
    tracking-[0.02em]
    transition-all
    duration-300
    hover:bg-[#c17f4a]
    hover:text-white
  "
                    >
                        VIEW MORE

                        <svg
                            className="w-5 h-5 lg:w-6 lg:h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Previous */}
            <button
                onClick={prev}
                aria-label="Previous slide"
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 text-black/50 lg:text-white/70 hover:text-[#c17f4a] transition-colors"
            >
                <svg
                    className="w-10 h-10 lg:w-14 lg:h-14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            {/* Next */}
            <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 text-black/50 lg:text-white/70 hover:text-[#c17f4a] transition-colors"
            >
                <svg
                    className="w-10 h-10 lg:w-14 lg:h-14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            {/* Vertical Dots */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`rounded-full transition-all duration-300 ${index === current
                            ? 'bg-[#c17f4a] h-10 w-[3px]'
                            : 'bg-gray-400/40 h-4 w-[3px] hover:bg-gray-500'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}