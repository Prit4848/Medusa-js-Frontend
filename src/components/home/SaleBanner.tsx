'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SALE_END = new Date('2026-12-31T23:59:59');

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

function getTimeLeft(): TimeLeft {
  const diff = SALE_END.getTime() - Date.now();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0,
    };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

export default function SaleBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    setTimeLeft(getTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-[#f5f5f5] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 items-center min-h-[520px] gap-8 lg:gap-0">

          {/* LEFT */}
          <div className="pt-10 lg:pt-14 pb-8 lg:pb-12 order-2 lg:order-1">

            <p className="text-[12px] lg:text-[13px] font-bold tracking-[0.18em] uppercase text-[#222] mb-4 lg:mb-5">
              News And Inspiration
            </p>

            <h2
              className="text-[36px] lg:text-[58px] font-[800] uppercase text-[#222] leading-none mb-6"
              style={{ letterSpacing: '-0.03em' }}
            >
              New Arrivals
            </h2>

            <div className="w-[70px] h-[5px] bg-[#c17f4a] rounded-full mb-8" />

            {/* COUNTDOWN */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.mins, label: 'Mins' },
                { value: timeLeft.secs, label: 'Secs' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="
                    w-[60px]
                    lg:w-[68px]
                    h-[60px]
                    lg:h-[68px]
                    border
                    border-[#d4d4d4]
                    bg-white
                    flex
                    flex-col
                    items-center
                    justify-center
                  "
                >
                  <span className="text-[18px] lg:text-[22px] font-bold text-[#c17f4a] leading-none">
                    {String(value).padStart(2, '0')}
                  </span>

                  <span className="text-[9px] lg:text-[10px] text-[#8a8a8a] mt-1">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* PRICE */}
            <div className="flex items-end gap-4 mb-8">
              <span className="text-[28px] lg:text-[34px] text-[#8d8d8d] line-through leading-none">
                $140,56
              </span>

              <span className="text-[36px] lg:text-[42px] font-bold text-[#c17f4a] leading-none">
                $70
              </span>
            </div>

            {/* BUTTON */}
            <Link
              href="/shop"
              className="
                inline-flex
                items-center
                justify-center
                h-[50px]
                lg:h-[56px]
                px-8
                lg:px-10
                border
                border-[#c17f4a]
                text-[#c17f4a]
                text-[13px]
                lg:text-[14px]
                font-semibold
                tracking-[0.08em]
                uppercase
                transition-all
                duration-300
                hover:bg-[#c17f4a]
                hover:text-white
              "
            >
              Shop Now
            </Link>
          </div>

          {/* RIGHT */}
          <div className="relative flex items-center justify-center h-[300px] lg:h-full order-1 lg:order-2 mt-8 lg:mt-0">

            {/* Background Circle */}
            <div
              className="
                absolute
                left-1/2 lg:left-auto lg:right-6
                top-1/2
                -translate-x-1/2 lg:translate-x-0
                -translate-y-1/2
                rounded-full
                bg-[#dddddd]
              "
              style={{
                width: 'min(90vw, 460px)',
                height: 'min(90vw, 460px)',
              }}
            />

            {/* Product Image */}
            <div
              className="relative z-10 w-[280px] lg:w-[520px] h-[240px] lg:h-[420px]"
            >
              <Image
                src="/images/products/saleBanner.png"
                alt="New Arrivals"
                fill
                priority
                sizes="(max-width: 1024px) 280px, 520px"
                className="object-contain object-center"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
  }