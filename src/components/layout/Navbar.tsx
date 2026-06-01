'use client';

import Link from 'next/link';
import {
  Search,
  User,
  ShoppingCart,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#f5f5f5] border-b border-gray-200">
      <div className="max-w-[1320px] mx-auto px-6 h-[75px] flex items-center justify-between">

        {/* LEFT — LOGO */}
        <div className="w-1/4">
          <Link
            href="/"
            className="text-[24px] font-bold tracking-[-0.5px] text-black"
          >
            Flatlogic
          </Link>
        </div>

        {/* CENTER — NAV */}
        <nav className="w-2/4 flex items-center justify-center gap-12">

          <Link
            href="/"
            className="group relative text-[16px] font-light text-[#3f4654] hover:text-[#c47c48] transition-colors duration-300"
          >
            <span className="flex items-center gap-2">

              {/* Animated line */}
              <span className="relative w-5 h-[2px] overflow-hidden">
                <span className="absolute left-0 top-0 h-full w-full bg-[#c47c48] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>

              Home
            </span>
          </Link>

          {/* PAGES */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-[16px] font-light text-[#3f4654] hover:text-[#c47c48] transition-colors duration-300">
              <span className="relative flex items-center gap-2">
                <span className="relative w-5 h-[2px] overflow-hidden">
  <span className="absolute left-0 top-0 h-full w-full bg-[#c47c48] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
</span>
                Pages
              </span>

              <ChevronDown
                size={16}
                strokeWidth={2}
                className="mt-[2px]"
              />
            </button>

            {/* DROPDOWN */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[58px] w-[300px] bg-[#f5f5f5] shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="py-5">
                {[
                  'About Us',
                  'About Team',
                  'Contact Us',
                  'FAQ',
                  '404',
                  'Wishlist',
                  'Login',
                ].map((item) => (
                  <Link
                    key={item}
                    href="/"
                    className="block px-8 py-5 text-[18px] text-[#4b5563] hover:text-[#c47c48] transition-colors duration-300"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* SHOP */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-[16px] font-light text-[#3f4654] hover:text-[#c47c48] transition-colors duration-300">
              <span className="relative flex items-center gap-2">
                <span className="relative w-5 h-[2px] overflow-hidden">
                  <span className="absolute left-0 top-0 h-full w-full bg-[#c47c48] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
                Shop
              </span>

              <ChevronDown
                size={16}
                strokeWidth={2}
                className="mt-[2px]"
              />
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 top-[58px] w-[300px] bg-[#f5f5f5] shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="py-5">
                {['Shop', 'Categories', 'Account'].map((item) => (
                  <Link
                    key={item}
                    href="/"
                    className="block px-8 py-5 text-[15px] font-light text-[#4b5563] hover:text-[#c47c48] transition-colors duration-300"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* BLOG */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-text-[16px] font-light text-[#3f4654] hover:text-[#c47c48] transition-colors duration-300">
              <span className="relative flex items-center gap-2">
                <span className="relative w-5 h-[2px] overflow-hidden">
                  <span className="absolute left-0 top-0 h-full w-full bg-[#c47c48] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
                Blog
              </span>

              <ChevronDown
                size={16}
                strokeWidth={2}
                className="mt-[2px]"
              />
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 top-[58px] w-[300px] bg-[#f5f5f5] shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="py-5">
                {['Blog', 'Blog Article'].map((item) => (
                  <Link
                    key={item}
                    href="/"
                    className="block px-8 py-5 text-[15px] font-light text-[#4b5563] hover:text-[#c47c48] transition-colors duration-300"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* RIGHT — ICONS */}
        <div className="w-1/4 flex items-center justify-end gap-10 text-black">

          <button className="hover:text-[#c47c48] transition-colors duration-300">
            <Search size={22} strokeWidth={1.8} />
          </button>

          <button className="hover:text-[#c47c48] transition-colors duration-300">
            <User size={22} strokeWidth={1.8} />
          </button>

          <button className="hover:text-[#c47c48] transition-colors duration-300">
            <ShoppingCart size={22} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}