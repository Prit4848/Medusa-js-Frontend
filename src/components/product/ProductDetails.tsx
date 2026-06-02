'use client';
import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/lib/data/cart";
import toast from "react-hot-toast";
import { useState } from "react";
export default function ProductDetails({
    product,
    price,
}: {
    product: any;
    price: number;
}) {
    const handleAddToCart = async () => {
        try {
            const variantId = product?.variants?.[0]?.id;

            if (!variantId) {
                console.error("No variant found");
                return;
            }

            await addToCart({
                variantId,
                quantity,
                countryCode: "in",
            });

            toast.success(
                `${quantity} item(s) added to cart`
            );
        } catch (error) {
            console.error("Add to cart failed:", error);
        }
    };
    const [quantity, setQuantity] = useState(1);
    return (

        <>
            <div className="max-w-[1280px] mx-auto px-4 py-12">

                {/* Breadcrumb */}
                <div className="border-b border-gray-200 pb-8 mb-10 text-[15px] text-gray-400 flex items-center gap-2">
                    <Link
                        href="/shop"
                        className="hover:text-[#c87a4c]"
                    >
                        Products
                    </Link>

                    <span>&gt;</span>

                    <Link
                        href={`/category/${product.category_id}`}
                        className="hover:text-[#c87a4c]"
                    >
                        {product.category}
                    </Link>

                    <span>&gt;</span>

                    <span>{product.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* Left Image */}
                    <div className="bg-[#f7f6f4] aspect-square relative">
                        <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Right Content */}
                    <div>

                        <p className="text-[12px] text-gray-500 mb-8">
                            {product.category}
                        </p>

                        <h1 className="text-[38px] font-bold text-[#222] mb-8">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-3 mb-10">
                            <span className="text-[#d8a46c] text-xl">
                                ★★★★★
                            </span>

                            <span className="text-[#c87a4c] text-lg">
                                4 reviews
                            </span>
                        </div>

                        <p className="text-[#666] text-[12px] leading-[2] mb-12">
                            {product.description ||
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut ullamcorper leo, eget euismod orci."}
                        </p>

                        <div className="flex gap-24 mb-14">

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
                                        className="w-8 h-8 border rounded hover:bg-gray-100"
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
                                        className="w-8 h-8 border rounded hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-[12px] mb-4">
                                    PRICE
                                </p>

                                <p className="font-semibold text-[22px]">
                                    ${(price * quantity).toFixed(2)}
                                </p>
                            </div>

                        </div>

                        <div className="flex gap-6">

                            <button className="w-[280px] h-[68px] border border-[#c87a4c] text-[#c87a4c] font-semibold uppercase tracking-wide hover:bg-[#c87a4c] hover:text-white transition" onClick={handleAddToCart}>
                                Add To Cart
                            </button>

                            <button className="w-[280px] h-[68px] bg-[#c87a4c] text-white font-semibold uppercase tracking-wide hover:bg-[#b56c43] transition">
                                Buy Now
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}