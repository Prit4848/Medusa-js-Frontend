"use client"

import { CreditCard, HelpCircle } from "lucide-react"
import SubmitButton from "./SubmitButton"

interface CreditCardPanelProps {
  paymentMethod: string
}

export default function CreditCardPanel({ paymentMethod }: CreditCardPanelProps) {
  const isManual = paymentMethod.includes("manual") || paymentMethod === "cash"
  const isCreditCard = !isManual

  return (
    <div>
      {isCreditCard && (
        <>
          <h2 className="font-bold text-[#1a1a1a] mb-5" style={{ fontSize: "20px" }}>
            Credit Card Info
          </h2>

          <div className="space-y-4 mb-5">

            {/* Name On Card */}
            <PanelField label="Name On Card" name="card_name">
              <input
                type="text"
                name="card_name"
                style={inputStyle}
                className="focus:border-[#bd744c] transition-colors"
              />
            </PanelField>

            {/* Card Number */}
            <PanelField label="Card Number" name="card_number">
              <div className="relative">
                <input
                  type="text"
                  name="card_number"
                  placeholder="____-____-____-____"
                  style={inputStyle}
                  className="focus:border-[#bd744c] transition-colors"
                />
                <CreditCard
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa]"
                  strokeWidth={1.5}
                />
              </div>
            </PanelField>

            {/* Exp Month + Exp Year — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <PanelField label="Exp.Month" name="exp_month">
                <select
                  name="exp_month"
                  style={{ ...inputStyle, color: "#444" }}
                  className="focus:border-[#bd744c] transition-colors"
                >
                  {Array.from({ length: 12 }).map((_, i) => {
                    const v = (i + 1).toString().padStart(2, "0")
                    return <option key={v} value={v}>{v}</option>
                  })}
                </select>
              </PanelField>

              <PanelField label="Exp. Year" name="exp_year">
                <select
                  name="exp_year"
                  style={{ ...inputStyle, color: "#444" }}
                  className="focus:border-[#bd744c] transition-colors"
                >
                  {Array.from({ length: 10 }).map((_, i) => {
                    const y = (2025 + i).toString()
                    return <option key={y} value={y}>{y}</option>
                  })}
                </select>
              </PanelField>
            </div>

            {/* CVV + Set as default — side by side */}
            <div className="flex items-end gap-4">
              <div style={{ width: "130px", flexShrink: 0 }}>
                <PanelField label="CVV" name="cvv">
                  <div className="relative">
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      maxLength={4}
                      style={inputStyle}
                      className="focus:border-[#bd744c] transition-colors"
                    />
                    <HelpCircle
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa]"
                      strokeWidth={1.5}
                    />
                  </div>
                </PanelField>
              </div>

              <label
                className="flex items-start gap-2 cursor-pointer select-none pb-1"
                style={{ fontSize: "12px", color: "#555", lineHeight: "1.4" }}
              >
                <input
                  type="checkbox"
                  name="default_payment"
                  style={{ width: "14px", height: "14px", marginTop: "2px", accentColor: "#bd744c", flexShrink: 0 }}
                />
                Set as default payment method
              </label>
            </div>

          </div>
        </>
      )}

      <SubmitButton />
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  fontSize: "13px",
  color: "#1a1a1a",
  background: "#fff",
  border: "1px solid #d8d8d8",
  borderRadius: 0,
  padding: "0 10px",
  outline: "none",
}

function PanelField({
  label,
  name,
  children,
}: {
  label: string
  name: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={name}
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 400,
          color: "#222",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}