import ProductCard from './ProductCard';

export default function TopSellingProducts() {
    return (
        <section className="bg-white py-12">
            <div className="max-w-[1180px] mx-auto px-8">

                {/* Heading */}
                <div className="text-center mb-8">
                    <h2 className="text-[28px] font-bold text-[#222222] mb-5">
                        Top Selling Products
                    </h2>

                    <p className="max-w-[800px] mx-auto text-[15px] leading-[30px] text-[#8a8a8a] font-light">
                        These furniture sets will become an essential part of an ecosystem
                        of elements in your home. Your domestic space will easily embrace
                        these tables, chairs, and bookshelves.
                    </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-[1.55fr_1fr] gap-6">

                    {/* Large Card */}
                    <ProductCard
                        large
                        image="/images/tsp/image1.png"
                        subtitle="ALL NEW"
                        title="SPRING THINGS"
                        description="Save up to 30%"
                    />

                    {/* Right Side */}
                    <div className="grid grid-cols-2 gap-6">

                        {/* Online Exclusive */}
                        <ProductCard
                            image="/images/tsp/image2.png"
                            title="Online Exclusive"
                        />

                        {/* 70 Sale */}
                        <ProductCard
                            image="/images/tsp/image3.png"
                            badge="70% SALE"
                        />

                        {/* Spring Sale */}
                        <ProductCard
                            image="/images/tsp/image4.png"
                            badge="SPRING SALE"
                        />

                        {/* Summer Collection */}
                        <div className="relative overflow-hidden h-[235px] bg-white group">
                            <img
                                src="/images/tsp/image5.png"
                                alt="Summer Collection"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            <div className="absolute top-6 left-0 w-full flex flex-col items-center z-10">

                                <div className="flex items-center w-full px-4">
                                    <div className="flex-1 h-[1px] bg-[#4f4f4f]" />

                                    <span className="mx-4 text-[12px] font-light text-[#666666] lowercase">
                                        collection
                                    </span>

                                    <div className="flex-1 h-[1px] bg-[#4f4f4f]" />
                                </div>

                                <h4 className="mt-0 text-[18px] font-bold uppercase tracking-[0.03em] text-[#c17f4a]">
                                    Summer
                                </h4>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}