import ProductDetails from "@/components/product/ProductDetails";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";

import { AdapterFactory } from "@/middleware/factory/adapter.factory";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const adapter = AdapterFactory.getAdapter();



  // Fetch product and related products in parallel
  const [product, relatedResult] = await Promise.all([
    adapter.getProductByHandle(id),
    adapter.listProducts({ limit: 4 }), // Just get some for now
  ]);



  if (!product) {
    notFound();
  }

  const relatedProducts = relatedResult.products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const reviews = [
    {
      id: 1,
      name: "John Smith",
      date: "2026-02-10",
      avatar: "/review1.jpg",
      comment: "Amazing product",
    },
    {
      id: 2,
      name: "Sarah Parker",
      date: "2026-03-05",
      avatar: "/review2.jpg",
      comment: "Very good quality and fast delivery.",
    },
  ];

  return (
    <>
      <ProductDetails
        product={product}
        price={
          product.price?.amount ??
          product.variants?.[0]?.price ??
          0
        }
        currencyCode={
          product.price?.currency_code ??
          product.variants?.[0]?.currency_code ??
          "USD"
        }
      />

      <ProductReviews reviews={reviews} />

      <RelatedProducts
        products={relatedProducts}
      />
    </>
  );
}