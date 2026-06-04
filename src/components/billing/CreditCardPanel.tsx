import { CreditCard, HelpCircle } from "lucide-react";
import SubmitButton from "./SubmitButton";

interface CreditCardPanelProps {
  paymentMethod: string;
}

export default function CreditCardPanel({ paymentMethod }: CreditCardPanelProps) {
  const isManual = paymentMethod.includes("manual") || paymentMethod === "cash";
  const isCreditCard = !isManual;

  return (
    <div
      className="p-4 sm:p-7"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      {isCreditCard && (
        <>
          <h2
            className="text-[#1a1a1a] font-bold mb-6"
            style={{ fontSize: "22px" }}
          >
            Credit Card Info
          </h2>

          <div className="space-y-5 mb-5">
            {/* Name On Card */}
            <PanelField label="Name On Card" name="card_name" />

            {/* Card Number */}
            <div>
              <label
                className="block text-[#222] mb-2"
                style={{ fontSize: "13px", fontWeight: 400 }}
              >
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="card_number"
                  placeholder="____-____-____-____"
                  required
                  className="w-full border border-[#d8d8d8] bg-white px-3 pr-10 outline-none focus:border-[#c27a4a] transition"
                  style={{ height: "44px", fontSize: "13px", color: "#444" }}
                />
                <CreditCard
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Exp Month + Exp Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-[#222] mb-2"
                  style={{ fontSize: "13px", fontWeight: 400 }}
                >
                  Exp.Month
                </label>
                <select
                  name="exp_month"
                  className="w-full border border-[#d8d8d8] bg-white px-3 outline-none focus:border-[#c27a4a] transition"
                  style={{ height: "44px", fontSize: "13px", color: "#444" }}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                      {(i + 1).toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-[#222] mb-2"
                  style={{ fontSize: "13px", fontWeight: 400 }}
                >
                  Exp. Year
                </label>
                <select
                  name="exp_year"
                  className="w-full border border-[#d8d8d8] bg-white px-3 outline-none focus:border-[#c27a4a] transition"
                  style={{ height: "44px", fontSize: "13px", color: "#444" }}
                >
                  {Array.from({ length: 15 }).map((_, i) => (
                    <option key={i} value={2024 + i}>{2024 + i}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* CVV + Set as default */}
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-none w-full sm:w-[130px]">
                <label
                  className="block text-[#222] mb-2"
                  style={{ fontSize: "13px", fontWeight: 400 }}
                >
                  CVV
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    required
                    className="w-full border border-[#d8d8d8] bg-white px-3 pr-9 outline-none focus:border-[#c27a4a] transition"
                    style={{ height: "44px", fontSize: "13px", color: "#444" }}
                  />
                  <HelpCircle
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              {/* Set as default */}
              <div className="flex items-start gap-2 pb-1">
                <input
                  type="checkbox"
                  id="default-payment"
                  name="default_payment"
                  className="mt-1 accent-[#c27a4a]"
                  style={{ width: "14px", height: "14px" }}
                />
                <label
                  htmlFor="default-payment"
                  className="text-[#555] leading-snug"
                  style={{ fontSize: "12px" }}
                >
                  Set as default
                  <br className="hidden sm:block" />
                  payment method
                </label>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Place Order */}
      <SubmitButton />
    </div>
  );
}

function PanelField({ label, name }: { label: string, name: string }) {
  return (
    <div>
      <label
        className="block text-[#222] mb-2"
        style={{ fontSize: "13px", fontWeight: 400 }}
      >
        {label}
      </label>
      <input
        type="text"
        name={name}
        required
        className="w-full border border-[#d8d8d8] bg-white px-3 outline-none focus:border-[#c27a4a] transition"
        style={{ height: "44px", fontSize: "13px" }}
      />
    </div>
  );
}
