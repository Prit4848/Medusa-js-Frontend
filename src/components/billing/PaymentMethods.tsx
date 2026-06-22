"use client"

import Link from "next/link"

interface PaymentMethodsProps {
  selected: string
  providers: any[]
}

type Method = { id: string; title: string }

/* Only show two payment methods: Credit Card (maps to a real provider) and Cash/manual. */
function buildMethods(providers: any[]): Method[] {
  const creditId =
    providers.find((p) => p.id.includes("stripe") || p.id.includes("credit"))?.id ||
    providers.find((p) => !p.id.includes("manual") && !p.id.includes("cash"))?.id ||
    providers[0]?.id ||
    "stripe"

  const cashId =
    providers.find((p) => p.id.includes("manual") || p.id.includes("cash"))?.id ||
    "manual"

  return [
    { id: creditId, title: "Credit Card" },
    { id: cashId,   title: "Cash" },
  ]
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#bd744c"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export default function PaymentMethods({ selected, providers }: PaymentMethodsProps) {
  const methods = buildMethods(providers)

  return (
    <div className="grid grid-cols-2" style={{ border: "1px solid #e0e0e0" }}>
      {methods.map((method, idx) => {
        const active = selected === method.id
        const isLast = idx === methods.length - 1
        return (
          <Link
            key={method.id}
            href={`?payment_method=${method.id}`}
            scroll={false}
            className="flex items-center justify-center gap-3 bg-white transition-colors duration-150"
            style={{
              height: "80px",
              borderRight: isLast ? "none" : "1px solid #e0e0e0",
              outline: active ? "2px solid #bd744c" : "none",
              outlineOffset: "-2px",
              textDecoration: "none",
            }}
          >
            <HeartIcon active={active} />
            <span style={{ fontSize: "15px", fontWeight: 500, color: "#1a1a1a" }}>
              {method.title}
            </span>
          </Link>
        )
      })}
    </div>
  )
}