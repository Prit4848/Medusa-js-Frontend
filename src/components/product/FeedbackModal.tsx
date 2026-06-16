"use client"

import { useState } from "react"
import StarRating from "./StarRating"

type Props = {
    productId: string
    productName: string
    productImage: string
    productPrice: string
    onClose: () => void
    onSubmitted: () => void
}

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export default function FeedbackModal({
    productId,
    productName,
    productImage,
    productPrice,
    onClose,
    onSubmitted,
}: Props) {
    const [rating, setRating] = useState(0)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [comment, setComment] = useState("")
    const [imageFiles, setImageFiles] = useState<File[]>([])  // ← multiple files
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit() {
        // All three now required
        if (!rating) return setError("Please select a rating.")
        if (!firstName.trim()) return setError("First name is required.")
        if (!comment.trim()) return setError("Comment is required.")

        setSubmitting(true)
        setError("")

        try {
            const formData = new FormData()
            formData.append("product_id", productId)
            formData.append("first_name", firstName)
            formData.append("last_name", lastName)
            formData.append("rating", String(rating))
            formData.append("comment", comment)
            // Append all images under the same "files" key
            imageFiles.forEach((file) => formData.append("files", file))

            const res = await fetch(`${BACKEND_URL}/store/feedback`, {
                method: "POST",
                headers: {
                    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
                },
                body: formData,
            })

            if (!res.ok) throw new Error("Submission failed")

            onSubmitted()
            onClose()
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = Array.from(e.target.files || [])
        setImageFiles((prev) => [...prev, ...selected])
        // Reset input so same file can be re-selected if removed
        e.target.value = ""
    }

    function removeFile(index: number) {
        setImageFiles((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-2xl mx-4 rounded-md p-8 relative max-h-[90vh] overflow-y-auto">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-6">Leave Your Feedback</h2>

                {/* Product row */}
                <div className="flex items-center gap-4 border-b pb-4 mb-6">
                    <img
                        src={productImage}
                        alt={productName}
                        className="w-20 h-20 object-cover rounded bg-[#f7f6f4]"
                    />
                    <div className="flex-1">
                        <p className="font-semibold">{productName}</p>
                    </div>
                    <p className="font-medium text-gray-700">{productPrice}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-5">
                    <span className="text-sm font-medium text-gray-700">Rate Product</span>
                    <StarRating value={rating} onChange={setRating} />
                </div>

                {/* Name fields */}
                <div className="flex gap-3 mb-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="First Name *"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full border border-gray-200 rounded px-4 py-3 text-sm outline-none focus:border-gray-400"
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border border-gray-200 rounded px-4 py-3 text-sm outline-none focus:border-gray-400"
                        />
                    </div>
                </div>

                {/* Comment — required */}
                <textarea
                    placeholder="Add your comment *"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    className="w-full border border-gray-200 rounded px-4 py-3 text-sm outline-none focus:border-gray-400 resize-none mb-4"
                />

                {/* Image upload — multiple */}
                <div className="mb-6">
                    <p className="text-sm text-gray-700 mb-2">Images</p>

                    {/* Selected files list */}
                    {imageFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {imageFiles.map((file, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1 text-sm text-gray-700"
                                >
                                    <span className="max-w-[140px] truncate">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="text-gray-400 hover:text-red-500 font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <label className="inline-block border border-gray-300 rounded px-4 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                        + Add images
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-black text-white py-3 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                </button>
            </div>
        </div>
    )
}