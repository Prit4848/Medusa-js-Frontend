import { Heart } from "lucide-react";
import Link from "next/link";

interface PaymentMethodsProps {
  selected: string;
  providers: any[];
}

const mapProviderTitle = (id: string) => {
  if (id.includes("stripe")) return "Credit Card";
  if (id.includes("manual")) return "Cash";
  return id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, " ");
};

export default function PaymentMethods({ selected, providers }: PaymentMethodsProps) {
  // If no providers from backend, fallback to some defaults to avoid empty UI
  const displayMethods = providers.length > 0 
    ? providers.map(p => ({ id: p.id, title: mapProviderTitle(p.id) }))
    : [
        { id: "credit-card", title: "Credit Card" },
        { id: "cash", title: "Cash" },
      ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {displayMethods.map((method) => {
        const active = selected === method.id;

        return (
          <Link
            key={method.id}
            href={`?payment_method=${method.id}`}
            scroll={false}
            className="flex items-center justify-center gap-2 bg-white transition-all duration-150 hover:border-[#c27a4a]"
            style={{
              height: "58px",
              border: active ? "1px solid #c27a4a" : "1px solid #e0e0e0",
              borderRadius: 0,
            }}
          >
            <Heart
              size={20}
              strokeWidth={1.5}
              style={{ color: "#c27a4a" }}
            />
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#222",
              }}
            >
              {method.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}