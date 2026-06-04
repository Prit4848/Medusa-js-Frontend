import Image from "next/image";

interface CategoryHeroProps {
  imageUrl?: string;
  title?: string;
}

export default function CategoryHero({
  imageUrl = "/images/category/categories-hero.png",
  title = "NEW ARRIVALS",
}: CategoryHeroProps) {
  return (
    <section className="w-full py-4 px-4 sm:px-[14%]">
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[530px] overflow-hidden">
        <Image
          src={imageUrl}
          alt="Category hero"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* no dark overlay — reference image is bright/light */}
        <div className="absolute inset-0 flex items-center justify-center ">
          <h1
            className="text-white font-extrabold uppercase"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              letterSpacing: "0.35em",
            }}
          >
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
