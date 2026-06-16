import ProductDetails from "@/components/product/ProductDetails";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import { AdapterFactory } from "@/middleware/factory/adapter.factory";
import { convertToLocale } from "@lib/util/money";
import { notFound } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

async function fetchFeedback(productId: string) {
  try {
    // Fetch reviews list and cached stats in parallel
    const [feedbackRes, statsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/store/feedback?product_id=${productId}`, {
        headers: { "x-publishable-api-key": PUB_KEY },
       cache: "no-store"
      }),
      fetch(`${BACKEND_URL}/store/feedback/averages?product_ids=${productId}`, {
        headers: { "x-publishable-api-key": PUB_KEY },
        cache: "no-store"
      }),
    ])

    const [feedbackData, statsData] = await Promise.all([
      feedbackRes.ok ? feedbackRes.json() : { feedback: [] },
      statsRes.ok ? statsRes.json() : { averages: {} },
    ])

    const feedback = feedbackData.feedback || []
    const stats = statsData.averages?.[productId]

    // Prefer cached stats (fast), fallback to computing from list if stats not yet created
    const reviewCount = stats?.count ?? feedback.length
    const averageRating =
      stats?.average != null
        ? Math.round(stats.average * 2) / 2  // round to nearest 0.5 for half-star
        : feedback.length > 0
          ? Math.round(
              (feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / feedback.length) * 2
            ) / 2
          : 0

    return { feedback, averageRating, reviewCount }
  } catch {
    return { feedback: [], averageRating: 0, reviewCount: 0 }
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const adapter = AdapterFactory.getAdapter();
  const [product, relatedResult] = await Promise.all([
    adapter.getProductByHandle(id),
    adapter.listProducts({ limit: 4 }),
  ]);

  if (!product) notFound();

  const relatedProducts = relatedResult.products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const { feedback, averageRating, reviewCount } = await fetchFeedback(product.id)

  const price = product.price?.amount ?? product.variants?.[0]?.price ?? 0
  const currencyCode =
    product.price?.currency_code ?? product.variants?.[0]?.currency_code ?? "USD"

  return (
    <>
      <ProductDetails
        product={product}
        price={price}
        currencyCode={currencyCode}
        averageRating={averageRating}
        reviewCount={reviewCount}
      />

      <ProductReviews
        productId={product.id}
        productName={product.title}
        productImage={product.thumbnail || ""}
        productPrice={convertToLocale({ amount: price, currency_code: currencyCode })}
        initialFeedback={feedback}
      />

      <RelatedProducts products={relatedProducts} />
    </>
  );
}