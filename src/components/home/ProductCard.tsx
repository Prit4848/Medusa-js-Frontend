import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  image: string;
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  large?: boolean;
}

export default function ProductCard({
  image,
  title,
  subtitle,
  description,
  badge,
  large = false,
}: ProductCardProps) {
  return (
    <div
      className={`relative overflow-hidden group bg-white ${
        large ? 'h-[400px] lg:h-[500px]' : 'h-[235px]'
      }`}
    >
      <Image
        src={image}
        alt={title || 'Product'}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Large Card */}
      {large && (
        <div className="absolute top-10 lg:top-14 left-6 lg:left-10 z-10">
          <p className="text-[#c17f4a] text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.08em] mb-3 lg:mb-4">
            {subtitle}
          </p>

          <h3 className="text-[24px] lg:text-[30px] font-bold uppercase text-[#c17f4a] leading-none mb-3 lg:mb-4">
            {title}
          </h3>

          <div className="w-[30px] lg:w-[36px] h-[3px] bg-[#c17f4a] mb-4 lg:mb-6" />

          <p className="text-[13px] lg:text-[14px] text-[#666666] font-light">
            {description}
          </p>
        </div>
      )}

      {/* Online Exclusive Card */}
      {!large && title && !badge && (
        <div className="absolute top-9 right-7 text-right z-10">
          <h4 className="text-[14px] font-semibold text-[#c17f4a] mb-2">
            {title}
          </h4>

          <Link
            href="/shop"
            className="text-[12px] text-[#c17f4a] underline"
          >
            shop now
          </Link>
        </div>
      )}

      {/* Sale Badge Cards */}
      {badge && (
        <div className="absolute bottom-7 right-0 bg-[#1f1f1f] px-6 py-3 z-10">
          <span className="text-white text-[14px] font-semibold uppercase tracking-[0.02em]">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}