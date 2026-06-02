import Link from "next/link";
import Image from "next/image";

export default function RelatedProducts({
  products,
}: {
  products: any[];
}) {
  return (
    <section className="max-w-[1280px] mx-auto mt-5 border-t border-gray-200 pt-16">
      <h2 className="text-[28px] font-bold mb-14">
        You may also like:
      </h2>

      <div className="grid grid-cols-4 gap-10">
        {products.map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.handle}`}
          >
            <div>
              <div className="bg-[#f7f6f4] aspect-square relative mb-6">
                <Image
                  src={item.thumbnail || "/placeholder.png"}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>

              <p className="text-gray-400 text-lg mb-2">
                {item.category || "Category"}
              </p>

              <h3 className="text-[18px] font-bold mb-2">
                {item.title}
              </h3>

              <p className="text-[18px]">
                $
                {item.price?.amount
                  ? item.price.amount / 100
                  : item.variants?.[0]?.price || 0}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}