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
          value: country.iso_2 ?? "",
          label:
            country.display_name ||
            country.name ||
            country.iso_2?.toUpperCase() ||
            "",
        }))
      )
      .filter((c) => c?.value) || []

  const configuredDefaultCountry =
    process.env.NEXT_PUBLIC_DEFAULT_REGION || "in"
  const defaultCountryCode =
    countryOptions.find((c) => c?.value === configuredDefaultCountry)?.value ||
    countryOptions[0]?.value ||
    configuredDefaultCountry

  const currentRegion =
    regions?.find((r) =>
      r.countries?.some((c) => c.iso_2 === defaultCountryCode)
    ) || regions?.[0]

  const paymentProviders = currentRegion
    ? await listCartPaymentMethods(currentRegion.id)
    : []

  const paymentMethod =
    (searchParams.payment_method as string) ||
    paymentProviders?.[0]?.id ||
    "manual"

  // Find default shipping address, fallback to first address
  const addresses = (customer as any).addresses || []
  const defaultAddress =
    addresses.find((a: any) => a.is_default_shipping) || addresses[0] || null

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">

        {/* Logged in banner */}
        <div
          className="flex items-center justify-center mb-8 px-2 text-center"
          style={{ backgroundColor: "#f5f5f5", minHeight: "56px" }}
        >
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1
            className="text-[#1a1a1a] font-bold mb-1"
            style={{ fontSize: "clamp(22px, 5vw, 28px)" }}
          >
            Billing Info
          </h1>
          <p style={{ fontSize: "13px", color: "#888" }}>
            Choose a payment option below and fill out the appropriate
            information
          </p>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <PaymentMethods
            selected={paymentMethod}
            providers={paymentProviders || []}
          />
        </div>

        <BillingCheckoutForm>
          <input type="hidden" name="payment_method" value={paymentMethod} />
          <BillingForm
            countryOptions={countryOptions as any}
            defaultCountryCode={defaultCountryCode}
            customer={customer as any}
            addresses={addresses}
            defaultAddress={defaultAddress}
          />
          <CreditCardPanel paymentMethod={paymentMethod} />
        </BillingCheckoutForm>
      </div>
    </main>
  )
}