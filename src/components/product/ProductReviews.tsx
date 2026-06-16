"use client"

import { useState } from "react"
import StarRating from "./StarRating"
import FeedbackModal from "./FeedbackModal"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

type Feedback = {
  id: string
  first_name: string
  last_name: string
  rating: number
  comment: string | null
  image_urls: string[] | null
  created_at: string
}

export default function ProductReviews({
  productId,
  productName,
  productImage,
  productPrice,
  initialFeedback,
}: {
  productId: string
  productName: string
  productImage: string
  productPrice: string
  initialFeedback: Feedback[]
}) {
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback)
  const [showModal, setShowModal] = useState(false)
  const [lightbox, setLightbox] = useState<{ urls: string[]; index: number } | null>(null)

  async function fetchFeedback() {
    try {
      const res = await fetch(`${BACKEND_URL}/store/feedback?product_id=${productId}`, {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
      })
      const data = await res.json()
      setFeedback(data.feedback || [])
    } catch (e) {
      console.error("Failed to fetch feedback", e)
    }
  }

  return (
    <>
      <section className="max-w-[1280px] mx-auto mt-5 border-t border-gray-200 pt-10 lg:pt-16 px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 lg:mb-16">
          <h2 className="text-[24px] lg:text-[28px] font-bold text-[#222]">Reviews:</h2>
          <button
            onClick={() => setShowModal(true)}
            className="text-[#c87a4c] font-semibold hover:underline"
          >
            + Leave Feedback
          </button>
        </div>

        {feedback.length === 0 && (
          <p className="text-gray-400 text-sm pb-10">No reviews yet. Be the first!</p>
        )}

        {feedback.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row gap-6 lg:gap-10 py-8 lg:py-10 border-b border-gray-100"
          >
            <div className="w-16 h-16 lg:w-28 lg:h-28 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 shrink-0">
              {item.first_name[0]}{item.last_name?.[0] || ""}
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4 lg:mb-6">
                <div>
                  <h3 className="font-bold text-lg text-[#222]">
                    {item.first_name} {item.last_name}
                  </h3>
                  <StarRating value={item.rating} readonly />
                </div>
                <span className="text-gray-400 text-sm lg:text-base">
                  {new Date(item.created_at).toLocaleDateString("en-CA")}
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed text-[16px] lg:text-[18px]">
                {item.comment}
              </p>

              {item.image_urls && item.image_urls.length > 0 && (
                <div className="flex gap-3 mt-4">
                  {item.image_urls.slice(0, 4).map((url, i) => {
                    const remaining = item.image_urls!.length - 4
                    const isLast = i === 3 && remaining > 0
                    return (
                      <div
                        key={i}
                        className="relative w-24 h-24 shrink-0 cursor-pointer"
                        onClick={() => setLightbox({ urls: item.image_urls!, index: i })}
                      >
                        <img
                          src={url}
                          className="w-full h-full object-cover rounded"
                          alt={`review-image-${i + 1}`}
                        />
                        {isLast && (
                          <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">+{remaining}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-6 text-white text-3xl hover:text-gray-300"
            onClick={() => setLightbox(null)}
          >✕</button>

          <p className="absolute top-5 left-6 text-white text-sm">
            {lightbox.index + 1} / {lightbox.urls.length}
          </p>

          <img
            src={lightbox.urls[lightbox.index]}
            className="max-h-[75vh] max-w-[85vw] object-contain rounded"
            alt="lightbox"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="flex items-center gap-6 mt-6" onClick={(e) => e.stopPropagation()}>
            <button
              disabled={lightbox.index === 0}
              onClick={() => setLightbox((prev) => prev && { ...prev, index: prev.index - 1 })}
              className="text-white text-2xl disabled:opacity-30 hover:text-gray-300 px-4"
            >‹</button>

            <div className="flex gap-2">
              {lightbox.urls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  onClick={() => setLightbox((prev) => prev && { ...prev, index: i })}
                  className={`w-14 h-14 object-cover rounded cursor-pointer border-2 transition-all ${
                    i === lightbox.index ? "border-white" : "border-transparent opacity-60"
                  }`}
                  alt={`thumb-${i}`}
                />
              ))}
            </div>

            <button
              disabled={lightbox.index === lightbox.urls.length - 1}
              onClick={() => setLightbox((prev) => prev && { ...prev, index: prev.index + 1 })}
              className="text-white text-2xl disabled:opacity-30 hover:text-gray-300 px-4"
            >›</button>
          </div>
        </div>
      )}

      {showModal && (
        <FeedbackModal
          productId={productId}
          productName={productName}
          productImage={productImage}
          productPrice={productPrice}
          onClose={() => setShowModal(false)}
          onSubmitted={fetchFeedback}
        />
      )}
    </>
  )
}