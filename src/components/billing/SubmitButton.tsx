"use client"

import { useFormStatus } from "react-dom"

export default function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full text-white uppercase font-semibold tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
      style={{
        height: "54px",
        fontSize: "13px",
        letterSpacing: "0.15em",
        borderRadius: 0,
        background: "#bd744c",
        border: "none",
        cursor: pending ? "not-allowed" : "pointer",
        marginTop: "8px",
      }}
    >
      {pending ? "Placing Order..." : "Place Order"}
    </button>
  )
}