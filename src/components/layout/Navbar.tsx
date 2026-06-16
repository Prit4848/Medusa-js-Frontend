import Link from 'next/link';
import {
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  Heart,
} from 'lucide-react';
import { retrieveCart } from "@lib/data/cart";
import MobileMenu from './MobileMenu';

export default async function Navbar() {
  const cart = await retrieveCart();

  const cartCount =
    cart?.items?.reduce(
      (acc: number, item: any) =>
        acc + item.quantity,
      0
    ) || 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f5f5f5] border-b border-gray-200">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-6 h-[75px] flex items-center justify-between">

        {/* LEFT — LOGO & MOBILE MENU */}
        <div className="flex-1 lg:w-1/4 flex items-center gap-2">
          <MobileMenu cartCount={cartCount} />
          <Link
            href="/"
            className="text-[20px] lg:text-[24px] font-bold tracking-[-0.5px] text-black"
          >
            Flatlogic
          </Link>
        </div>

        {/* CENTER — NAV (Desktop) */}
        <nav className="hidden lg:flex w-2/4 items-center justify-center gap-12">

          <Link
            href="/"
            className="group relative text-[16px] font-light text-[#3f4654] hover:text-[#c47c48] transition-colors duration-300"
          >
            <span className="flex items-center gap-2">
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
              <ChevronDown size={16} strokeWidth={2} className="mt-[2px]" />
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 top-[58px] w-[300px] bg-[#f5f5f5] shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="py-5">
                {[
                  { label: 'About Us', href: '/' },
                  { label: 'About Team', href: '/' },
                  { label: 'Contact Us', href: '/' },
                  { label: 'FAQ', href: '/' },
                  { label: '404', href: '/' },
                  { label: 'Wishlist', href: '/wishlist' },
                  { label: 'Login', href: '/' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block px-8 py-5 text-[18px] text-[#4b5563] hover:text-[#c47c48] transition-colors duration-300"
                  >
                    {item.label}
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
              <ChevronDown size={16} strokeWidth={2} className="mt-[2px]" />
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 top-[58px] w-[300px] bg-[#f5f5f5] shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="py-5">
                <Link href="/shop" className="block px-8 py-5 text-[15px] font-light text-[#4b5563] hover:text-[#c47c48] transition-colors duration-300">
                  Shop
                </Link>
                <Link href="/categories" className="block px-8 py-5 text-[15px] font-light text-[#4b5563] hover:text-[#c47c48] transition-colors duration-300">
                  Categories
                </Link>
                <Link href="/account" className="block px-8 py-5 text-[15px] font-light text-[#4b5563] hover:text-[#c47c48] transition-colors duration-300">
                  Account
                </Link>
              </div>
            </div>
          </div>

          {/* BLOG */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-[16px] font-light text-[#3f4654] hover:text-[#c47c48] transition-colors duration-300">
              <span className="relative flex items-center gap-2">
                <span className="relative w-5 h-[2px] overflow-hidden">
                  <span className="absolute left-0 top-0 h-full w-full bg-[#c47c48] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
                Blog
              </span>
              <ChevronDown size={16} strokeWidth={2} className="mt-[2px]" />
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
        <div className="flex-1 lg:w-1/4 flex items-center justify-end gap-4 lg:gap-10 text-black">

          <Link 
            href="/search"
            className="hidden sm:block hover:text-[#c47c48] transition-colors duration-300">
            <Search size={22} strokeWidth={1.8} />
          </Link>

           <Link
            href="/login"
            className="hidden sm:block hover:text-[#c47c48] transition-colors duration-300">
            <User size={22} strokeWidth={1.8} />
          </Link>

          <Link
            href="/wishlist"
            className="hidden sm:block hover:text-[#c47c48] transition-colors duration-300"
          >
            <Heart size={22} strokeWidth={1.8} />
          </Link>

          <Link
            href="/cart"
            className="relative hover:text-[#c47c48] transition-colors duration-300"
          >
            <ShoppingCart size={22} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-[#c97a4a] text-white text-[11px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
