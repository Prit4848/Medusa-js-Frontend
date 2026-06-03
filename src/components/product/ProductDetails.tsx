'use client';
import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/lib/data/cart";
import toast from "react-hot-toast";
import { useState } from "react";
import { convertToLocale } from "@lib/util/money";
import { useRouter } from "next/navigation";

const DEFAULT_COUNTRY_CODE = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us";

export default function ProductDetails({
    product,
    price,
    currencyCode,
}: {
    product: any;
    price: number;
    currencyCode: string;
}) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    const formattedPrice = convertToLocale({
        amount: price * quantity,
        currency_code: currencyCode,
    });

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            const variant = product?.variants?.[0];
            const variantId = variant?.id;

            if (!variantId) {
                console.error("No variant found");
                toast.error("No variant found for this product");
                return;
            }

            if (variant.manage_inventory && (variant.inventory_quantity ?? 0) < quantity) {
                toast.error("This product is out of stock");
                return;
            }

            if (!variant.price || variant.price <= 0) {
                toast.error("This product is not priced for the selected region");
                return;
            }

            const result = await addToCart({
                variantId,
                quantity,
                countryCode: DEFAULT_COUNTRY_CODE,
            });

            if (!result.success) {
                toast.error(result.error || "Unable to add item to cart");
                return;
            }

            toast.success(
                `${quantity} item(s) added to cart`
            );
        } catch (error) {
            console.error("Add to cart failed:", error);
            toast.error(error instanceof Error ? error.message : "Unable to add item to cart");
        } finally {
            setIsAdding(false);
        }
    };

    const handleBuyNow = async () => {
        setIsBuying(true);
        try {
            const variant = product?.variants?.[0];
            const variantId = variant?.id;

            if (!variantId) {
                toast.error("No variant found for this product");
                return;
            }

            const result = await addToCart({
                variantId,
                quantity,
                countryCode: DEFAULT_COUNTRY_CODE,
            });

            if (result.success) {
                router.push("/billing");
            } else {
                toast.error(result.error || "Unable to process request");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsBuying(false);
        }
    };
    return (

        <>
            <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-8 lg:py-12">

                {/* Breadcrumb */}
                <div className="border-b border-gray-200 pb-6 lg:pb-8 mb-8 lg:mb-10 text-[13px] lg:text-[15px] text-gray-400 flex flex-wrap items-center gap-2">
                    <Link
                        href="/shop"
                        className="hover:text-[#c87a4c]"
                    >
                        Products
                    </Link>

                    <span>&gt;</span>

                    <Link
                        href={`/categories/${product.category_handle}`}
                        className="hover:text-[#c87a4c]"
                    >
                        {product.category}
                    </Link>

                    <span>&gt;</span>

                    <span className="text-[#222] truncate max-w-[150px] lg:max-w-none">{product.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

                    {/* Left Image */}
                    <div className="bg-[#f7f6f4] aspect-square relative">
                        <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>

                    {/* Right Content */}
                    <div>

                        <p className="text-[12px] text-gray-500 mb-4 lg:mb-8">
                            {product.category}
                        </p>

                        <h1 className="text-[28px] lg:text-[38px] font-bold text-[#222] mb-6 lg:mb-8 leading-tight">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-3 mb-8 lg:mb-10">
                            <span className="text-[#d8a46c] text-lg lg:text-xl">
                                ★★★★★
                            </span>

                            <span className="text-[#c87a4c] text-base lg:text-lg">
                                4 reviews
                            </span>
                        </div>

                        <p className="text-[#666] text-[14px] lg:text-[12px] leading-[1.8] lg:leading-[2] mb-10 lg:mb-12">
                            {product.description ||
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut ullamcorper leo, eget euismod orci."}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-10 lg:gap-24 mb-10 lg:mb-14">

                            <div>
                                <p className="font-bold text-[12px] mb-4">
                                    QUANTITY
                                </p>

                                <div className="flex items-center gap-5 text-lg">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((prev) =>
                                                Math.max(1, prev - 1)
                                            )
                                        }
                                        className="w-10 h-10 lg:w-8 lg:h-8 border rounded hover:bg-gray-100 flex items-center justify-center"
                                    >
                                        -
                                    </button>

                                    <span className="min-w-[30px] text-center font-semibold">
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((prev) => prev + 1)
                                        }
                                        className="w-10 h-10 lg:w-8 lg:h-8 border rounded hover:bg-gray-100 flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-[12px] mb-4">
                                    PRICE
                                </p>

                                <p className="font-semibold text-[22px] lg:text-[22px]">
                                    {formattedPrice}
                                </p>
                            </div>

                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">

                            <button
                                className="w-full sm:w-[280px] h-[60px] lg:h-[68px] border border-[#c87a4c] text-[#c87a4c] font-semibold uppercase tracking-wide hover:bg-[#c87a4c] hover:text-white transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleAddToCart}
                                disabled={isAdding}
                            >
                                {isAdding ? (
                                    <div className="w-6 h-6 border-2 border-[#c87a4c] border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Add To Cart"
                                )}
                            </button>

                            <button
                                className="w-full h-[60px] lg:h-[68px] bg-[#c97a4a] text-white text-[17px] font-bold hover:opacity-90 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleBuyNow}
                                disabled={isBuying}
                            >
                                {isBuying ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "BUY NOW"
                                )}
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
