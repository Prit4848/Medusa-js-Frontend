'use client';

import Link from 'next/link';
import {
  FaGoogle,
  FaTwitter,
  FaLinkedinIn,
  FaFacebookF,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className=" text-white bg-[#1a1a1a]">
      <div className="max-w-[1320px] mx-auto px-6">

        {/* TOP NEWSLETTER */}
        <div className="flex items-start justify-between pt-[32px] pb-[32px] border-b border-[#3a3a3a]">

          {/* LEFT */}
          <div className="max-w-[520px]">
            <h3 className="text-[22px] font-bold mb-4">
              Many desktop publishing
            </h3>

            <p className="text-[#5f5f5f] text-[15px] leading-[28px] font-light">
              Do you want to receive exclusive email offers? Subscribe to our
              newsletter! You will receive a unique promo code which gives you
              a 20% discount on all our products in 10 minutes.
            </p>
          </div>

          {/* RIGHT */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-4 mt-1"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-[300px] h-[56px] bg-[#f5f5f5] px-7 text-[16px] text-black outline-none placeholder:text-[#cfcfcf]"
            />

            <button
              type="submit"
              className="w-[180px] h-[56px] bg-[#c47c48] text-white text-[16px] font-semibold hover:bg-[#b36d3c] transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* MAIN FOOTER */}
        <div className="grid grid-cols-[1.7fr_1fr_1fr_1fr] gap-12 py-[42px] border-b border-[#3a3a3a]">

          {/* LEFT */}
          <div>

            <Link
              href="/"
              className="inline-block text-[22px] font-extrabold tracking-tight mb-8"
            >
              Flatlogic.
            </Link>

            <p className="text-[#e2e2e2] text-[16px] leading-[30px] max-w-[430px] mb-10 font-light">
              Lorem Ipsum has been the industry's standard dummy text ever
              since the 1500s,
            </p>

            {/* SOCIALS */}
            <div className="flex items-center gap-5 text-white">

              <a
                href="#"
                className="text-[16px] hover:text-[#c47c48] transition-colors duration-300"
              >
                <FaGoogle />
              </a>

              <a
                href="#"
                className="text-[16px] hover:text-[#c47c48] transition-colors duration-300"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                className="text-[16px] hover:text-[#c47c48] transition-colors duration-300"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="#"
                className="text-[18px] hover:text-[#c47c48] transition-colors duration-300"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-[16px] font-extrabold uppercase mb-6">
              Company
            </h3>

            <ul className="space-y-5">
              {[
                'What We Do',
                'Available Services',
                'Latest Posts',
                'FAQs',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="text-[#5f5f5f] text-[16px] hover:text-[#c47c48] transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ACCOUNT */}
          <div>
            <h3 className="text-[15px] font-extrabold uppercase mb-8">
              My Account
            </h3>

            <ul className="space-y-4">
              {[
                'Sign In',
                'View Cart',
                'Order Tracking',
                'Help & Support',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="text-[#5f5f5f] text-[16px] hover:text-[#c47c48] transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CUSTOMER SERVICE */}
          <div>
            <h3 className="text-[15px] font-extrabold uppercase mb-8">
              Customer Service
            </h3>

            <ul className="space-y-4">
              {[
                'Help & Contact Us',
                'Returns & Refunds',
                'Online Stores',
                'Terms & Conditions',
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/"
                    className="text-[#5f5f5f] text-[16px] hover:text-[#c47c48] transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="py-[22px]">
          <p className="text-[#5f5f5f] text-[15px] font-light">
            © 2020-2026 powered by Flatlogic
          </p>
        </div>
      </div>
    </footer>
  );
}