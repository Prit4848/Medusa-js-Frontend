"use client"

import { useState } from "react"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setErrorMsg("Name, email, and message are required.")
      setStatus("error")
      return
    }
    setStatus("loading")
    setErrorMsg("")
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
          },
          body: JSON.stringify(form),
        }
      )
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Something went wrong")
      }
      setStatus("success")
      setForm({ name: "", email: "", phone: "", message: "" })
    } catch (err: any) {
      setErrorMsg(err.message)
      setStatus("error")
    }
  }

  const inputClass =
    "w-full h-9 border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-gray-400"

  const labelClass = "block text-sm font-normal text-gray-800 mb-1"

  return (
    <div className="flex items-stretch px-16 py-12 gap-16 bg-white max-w-[1100px] mx-auto">

      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-start min-w-0">
        <h1 className="text-2xl font-semibold text-gray-900 mt-0 mb-1">
          Contact Us
        </h1>

        <p className="text-[13px] text-gray-500 mt-0 mb-5">
          If you have any questions please fill out the form
        </p>

        {status === "success" && (
          <div className="mb-4 px-3 py-2 bg-green-50 border border-green-200 text-green-800 text-xs">
            Message sent! We will get back to you soon.
          </div>
        )}
        {status === "error" && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-800 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Name */}
        <div className="mb-3">
          <label className={labelClass}>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Email + Phone */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className={labelClass}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="flex-1">
            <label className={labelClass}>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Message */}
        <div className="mb-5">
          <label className={labelClass}>Your Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={6}
            className="w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-gray-400 resize-y"
          />
        </div>

        {/* Button */}
        <div>
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className={`
              bg-[#8B4513] text-white border-none
              px-6 py-3
              text-[11px] font-bold tracking-[2px] uppercase
              ${status === "loading" ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}
            `}
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-[45%] min-w-0 self-stretch">
        <img
          src="/images/products/new.png"
          alt="Contact"
          className="w-full h-full object-cover object-center block"
        />
      </div>
    </div>
  )
}