import Link from "next/link";
import Image from "next/image";
import { convertToLocale } from "@lib/util/money";

export default function RelatedProducts({
  products,
}: {
  products: any[];
}) {
  return (
    <section className="max-w-[1280px] mx-auto mt-5 border-t border-gray-200 pt-10 lg:pt-16 px-4 lg:px-6">
      <h2 className="text-[24px] lg:text-[28px] font-bold mb-10 lg:mb-14 text-[#222]">
        You may also like:
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {products.map((item) => {
           const currencyCode = item.price?.currency_code ?? item.variants?.[0]?.currency_code ?? "USD";
           const amount = item.price?.amount ?? item.variants?.[0]?.price ?? 0;
           const formattedPrice = convertToLocale({ amount, currency_code: currencyCode });

           return (
            <Link
              key={item.id}
              href={`/products/${item.handle}`}
              className="group"
            >
              <div>
                <div className="bg-[#f7f6f4] aspect-square relative mb-6 overflow-hidden">
                  <Image
                    src={item.thumbnail || "/placeholder.png"}
                    alt={item.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                <p className="text-gray-400 text-sm mb-1">
                  {item.category || "Category"}
                </p>

                <h3 className="text-[17px] font-bold mb-2 text-[#222] group-hover:text-[#c87a4c] transition-colors">
                  {item.title}
                </h3>

                <p className="text-[17px] font-semibold text-[#333]">
                  {formattedPrice}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}