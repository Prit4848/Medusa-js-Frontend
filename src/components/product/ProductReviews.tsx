export default function ProductReviews({
  reviews,
}: {
  reviews: any[];
}) {
  return (
    <>
      <section className="max-w-[1280px] mx-auto mt-5 border-t border-gray-200 pt-10 lg:pt-16 px-4 lg:px-6">

  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 lg:mb-16">

    <h2 className="text-[24px] lg:text-[28px] font-bold text-[#222]">
      Reviews:
    </h2>

    <button className="text-[#c87a4c] font-semibold hover:underline">
      + Leave Feedback
    </button>

  </div>

  {reviews.map((review) => (
    <div
      key={review.id}
      className="flex flex-col sm:flex-row gap-6 lg:gap-10 py-8 lg:py-10 border-b border-gray-100"
    >
      <img
        src={review.avatar}
        className="w-16 h-16 lg:w-28 lg:h-28 rounded-full object-cover"
        alt={review.name}
      />

      <div className="flex-1">

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 lg:mb-6">

          <div>

            <h3 className="font-bold text-lg text-[#222]">
              {review.name}
            </h3>

            <div className="text-[#d8a46c] text-lg">
              ★★★★★
            </div>

          </div>

          <span className="text-gray-400 text-sm lg:text-base">
            {review.date}
          </span>

        </div>

        <p className="text-gray-600 leading-relaxed text-[16px] lg:text-[18px]">
          {review.comment}
        </p>

      </div>
    </div>
  ))}
</section>
    </>
  );
}