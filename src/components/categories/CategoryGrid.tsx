import Image from "next/image";
import Link from "next/link";

interface PromoBannerTile {
  id: string;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  label?: string;
  heading?: string;
  ctaText?: string;
  ctaHref?: string;
  discountLabel?: string;
  variant: "badge" | "label-cta" | "discount-title" | "title-only";
}

const DEFAULT_TILES: PromoBannerTile[] = [
  {
    id: "spring-sale",
    imageUrl: "/images/category/cat-spring-sale.png",
    imageAlt: "Modern kitchen with wooden stools",
    badge: "SPRING SALE",
    variant: "badge",
  },
  {
    id: "accessories-living-1",
    imageUrl: "/images/category/cat-living-clock.png",
    imageAlt: "Gold wall clock in living room",
    label: "ACCESSORIES",
    heading: "For Living Room",
    ctaText: "View Collection",
    ctaHref: "/shop?collection=living-room",
    variant: "label-cta",
  },
  {
    id: "pillows",
    imageUrl: "/images/category/cat-pillows.png",
    imageAlt: "Assorted decorative pillows",
    discountLabel: "up to 60%",
    heading: "Pillows",
    variant: "discount-title",
  },
  {
    id: "accessories-living-2",
    imageUrl: "/images/category/cat-herbs.png",
    imageAlt: "Natural herbs and spices flat lay",
    label: "ACCESSORIES",
    heading: "For Living Room",
    ctaText: "View Collection",
    ctaHref: "/shop?collection=living-room-accessories",
    variant: "label-cta",
  },
  {
    id: "bed-linen",
    imageUrl: "/images/category/cat-bed-linen.png",
    imageAlt: "Cosy armchair with bed linen",
    heading: "Bed Linen",
    variant: "title-only",
  },
];

interface CategoryGridProps {
  tiles?: PromoBannerTile[];
}

export default function CategoryGrid({
  tiles = DEFAULT_TILES,
}: CategoryGridProps) {
  return (
    <section className="max-w-[1280px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-4 sm:mb-8">
        {tiles.slice(0, 2).map((tile) => (
          <PromoBannerCard
            key={tile.id}
            tile={tile}
            row={1}
          />
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        {tiles.slice(2, 5).map((tile) => (
          <PromoBannerCard
            key={tile.id}
            tile={tile}
            row={2}
          />
        ))}
      </div>
    </section>
  );
}

function PromoBannerCard({
  tile,
  row,
}: {
  tile: PromoBannerTile;
  row: 1 | 2;
}) {
  const height =
    row === 1
      ? "h-[200px] sm:h-[240px]"
      : "h-[180px] sm:h-[210px]";

  const isLabelCard =
    tile.variant === "label-cta";

  return (
    <Link
      href={tile.ctaHref ?? "#"}
      className={`relative block overflow-hidden group ${height}`}
      style={{
        textDecoration: "none",
        background: isLabelCard
          ? "#f4efe8"
          : undefined,
      }}
    >
      {/* CLOCK CARD */}
      {isLabelCard ? (
        <div className="absolute right-0 top-0 w-[42%] h-full">
          <Image
            src={tile.imageUrl}
            alt={tile.imageAlt}
            fill
            sizes="(max-width: 640px) 42vw, (max-width: 1024px) 21vw, 15vw"
            className="
              object-cover
              object-center
              transition-transform
              duration-700
            "
          />
        </div>
      ) : (
        <Image
          src={tile.imageUrl}
          alt={tile.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="
            object-cover
            object-center
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />
      )}

      {/* SPRING SALE */}
      {tile.variant === "badge" && (
        <div className="absolute inset-0 flex items-center justify-end pr-6 sm:pr-10">
          <span
            className="
              bg-[#1e1e1e]
              text-white
              uppercase
              font-semibold
              px-6 sm:px-10
              py-3 sm:py-5
            "
            style={{
              fontSize: "clamp(12px, 2vw, 14px)",
              letterSpacing: "0.18em",
            }}
          >
            {tile.badge}
          </span>
        </div>
      )}

      {/* ACCESSORIES */}
      {tile.variant === "label-cta" && (
        <div
          className="absolute left-6 sm:left-11 z-10 max-w-[50%]"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <p
            className="mb-1 sm:mb-3 uppercase"
            style={{
              fontSize: "clamp(9px, 1.5vw, 11px)",
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: "#222",
            }}
          >
            {tile.label}
          </p>

          <h2
            className="text-[#222] mb-2 sm:mb-5"
            style={{
              fontSize: "clamp(18px, 3vw, 32px)",
              fontWeight: 600,
              lineHeight: "1.15",
            }}
          >
            {tile.heading}
          </h2>

          <span
            style={{
              color: "#c27a4a",
              fontSize: "clamp(13px, 1.5vw, 15px)",
              fontWeight: 500,
            }}
          >
            {tile.ctaText}
          </span>
        </div>
      )}

      {/* PILLOWS */}
      {tile.variant === "discount-title" && (
        <div className="absolute left-6 sm:left-7 top-1/2 -translate-y-1/2">
          <p
            className="mb-1 sm:mb-2"
            style={{
              fontSize: "clamp(13px, 1.5vw, 15px)",
              color: "#c27a4a",
              fontWeight: 500,
            }}
          >
            {tile.discountLabel}
          </p>

          <h2
            className="text-[#222]"
            style={{
              fontSize: "clamp(20px, 3vw, 32px)",
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {tile.heading}
          </h2>
        </div>
      )}

      {/* BED LINEN */}
      {tile.variant === "title-only" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h2
            className="text-white"
            style={{
              fontSize: "clamp(20px, 3vw, 32px)",
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {tile.heading}
          </h2>
        </div>
      )}
    </Link>
  );
}

