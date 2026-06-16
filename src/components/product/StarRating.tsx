"use client"

type Props = {
  value: number
  onChange?: (val: number) => void
  readonly?: boolean
}

export default function StarRating({ value, onChange, readonly = false }: Props) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`text-xl ${
            star <= value ? "text-[#d8a46c]" : "text-gray-300"
          } ${!readonly ? "cursor-pointer hover:text-[#d8a46c]" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}