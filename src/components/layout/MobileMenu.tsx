"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ShoppingCart, Heart, User, Search } from "lucide-react";

export default function MobileMenu({ cartCount }: { cartCount: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-black hover:text-[#c47c48] transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-[#f5f5f5] z-[101] shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-10">
            <Link
              href="/"
              className="text-[24px] font-bold tracking-[-0.5px] text-black"
              onClick={() => setIsOpen(false)}
            >
              Flatlogic
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-black hover:text-[#c47c48] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            <Link
              href="/"
              className="text-[18px] font-light text-[#3f4654] hover:text-[#c47c48] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <MobileNavDropdown title="Pages">
              {[
                { label: "About Us", href: "/" },
                { label: "About Team", href: "/" },
                { label: "Contact Us", href: "/" },
                { label: "FAQ", href: "/" },
                { label: "404", href: "/" },
                { label: "Wishlist", href: "/wishlist" },
                { label: "Login", href: "/" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-2 text-[16px] text-[#4b5563]"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </MobileNavDropdown>

            <MobileNavDropdown title="Shop">
              <Link
                href="/shop"
                className="block py-2 text-[16px] text-[#4b5563]"
                onClick={() => setIsOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/categories"
                className="block py-2 text-[16px] text-[#4b5563]"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/account"
                className="block py-2 text-[16px] text-[#4b5563]"
                onClick={() => setIsOpen(false)}
              >
                Account
              </Link>
            </MobileNavDropdown>

            <MobileNavDropdown title="Blog">
              {["Blog", "Blog Article"].map((item) => (
                <Link
                  key={item}
                  href="/"
                  className="block py-2 text-[16px] text-[#4b5563]"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </MobileNavDropdown>
          </nav>

          <div className="mt-10 pt-10 border-t border-gray-200 flex items-center gap-6">
            <Link
              href="/search"
              className="text-black hover:text-[#c47c48] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Search size={22} />
            </Link>
            <Link
              href="/login"
              className="text-black hover:text-[#c47c48] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={22} />
            </Link>
            <Link
              href="/wishlist"
              className="text-black hover:text-[#c47c48] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Heart size={22} />
            </Link>
            <Link
              href="/cart"
              className="relative text-black hover:text-[#c47c48] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-[#c97a4a] text-white text-[11px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNavDropdown({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-[18px] font-light text-[#3f4654] hover:text-[#c47c48] transition-colors"
      >
        {title}
        <ChevronDown
          size={16}
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="pl-4 mt-2 flex flex-col gap-2">{children}</div>}
    </div>
  );
}
