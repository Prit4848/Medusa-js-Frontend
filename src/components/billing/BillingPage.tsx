import PaymentMethods from "./PaymentMethods"
import BillingForm from "./BillingForm"
import CreditCardPanel from "./CreditCardPanel"
import BillingCheckoutForm from "./BillingCheckoutForm"
import { listRegions } from "@lib/data/regions"
import { listCartPaymentMethods } from "@lib/data/payment"
import { retrieveCustomerFresh } from "@lib/data/customer"
import { redirect } from "next/navigation"

type BillingPageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const regions = await listRegions()
  const customer = await retrieveCustomerFresh()

  if (!customer) redirect("/login?redirectTo=/billing")

  const countryOptions =
    regions
      ?.flatMap((region) =>
        region.countries?.map((country) => ({
          value: (country.iso_2 || "").toLowerCase(),
          label:
            country.display_name ||
            country.name ||
            country.iso_2?.toUpperCase() ||
            "",
        }))
      )
      .filter((c) => c?.value) || []

  const configuredDefaultCountry = process.env.NEXT_PUBLIC_DEFAULT_REGION || "in"

  const defaultCountryCode =
    countryOptions.find((c) => c?.value === configuredDefaultCountry)?.value ||
    countryOptions[0]?.value ||
    configuredDefaultCountry

  const currentRegion =
    regions?.find((r) =>
      r.countries?.some((c) => (c?.iso_2 || "").toLowerCase() === (defaultCountryCode || "").toLowerCase())
    ) || regions?.[0]

  const paymentProviders = currentRegion
    ? await listCartPaymentMethods(currentRegion.id)
    : []

  // Determine a sensible default: prefer a credit-card provider (stripe/credit),
  // otherwise fall back to first provider or manual.
  const creditProviderId =
    paymentProviders?.find((p: any) => p.id.includes("stripe") || p.id.includes("credit"))?.id ||
    paymentProviders?.find((p: any) => !p.id.includes("manual") && !p.id.includes("cash"))?.id ||
    paymentProviders?.[0]?.id ||
    "manual"

  const paymentMethod = (searchParams.payment_method as string) || creditProviderId

  const addresses = (customer as any).addresses || []

  const defaultAddress =
    addresses.find((a: any) => a.is_default_shipping) ||
    addresses[0] ||
    null

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10">

        {/* Returning customer — full-width centred grey banner */}
        <div
          className="flex items-center justify-center mb-10"
          style={{ background: "#f5f5f5", height: "52px" }}
        >
          <p style={{ fontSize: "14px", color: "#555" }}>
            Returning customer?{" "}
            <a
              href="/login"
              style={{ color: "#bd744c", textDecoration: "none" }}
              className="hover:underline"
            >
              Click here to Login
            </a>
          </p>
        </div>

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="font-bold text-[#1a1a1a] mb-1" style={{ fontSize: "28px" }}>
            Billing Info
          </h1>
          <p style={{ fontSize: "14px", color: "#888" }}>
            Choose a payment option below and fill out the appropriate information
          </p>
        </div>

        <BillingCheckoutForm>
          <input type="hidden" name="payment_method" value={paymentMethod} />

          {/* Payment methods — full width above the split */}
          <div className="mb-10">
            <PaymentMethods
              selected={paymentMethod}
              providers={paymentProviders || []}
            />
          </div>

          {/* Two-column layout: left = billing form, right = card panel */}
          <div
            className="grid grid-cols-1 items-start"
            style={{ gridTemplateColumns: "1fr 300px", gap: "40px" }}
          >
            {/* LEFT — Billing Address */}
            <div>
              <h2
                className="font-bold text-[#1a1a1a] mb-6"
                style={{ fontSize: "24px" }}
              >
                Billing Address
              </h2>

              <BillingForm
                countryOptions={countryOptions as any}
                defaultCountryCode={defaultCountryCode}
                customer={customer as any}
                addresses={addresses}
                defaultAddress={defaultAddress}
              />
            </div>

            {/* RIGHT — Credit card panel */}
            <div className="sticky top-10">
              <div style={{ background: "#f3f3f3", padding: "28px" }}>
                <CreditCardPanel paymentMethod={paymentMethod} />
              </div>
            </div>
          </div>

        </BillingCheckoutForm>
      </div>
    </main>
  )
}