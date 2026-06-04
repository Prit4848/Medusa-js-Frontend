import PaymentMethods from "./PaymentMethods";
import BillingForm from "./BillingForm";
import CreditCardPanel from "./CreditCardPanel";
import BillingCheckoutForm from "./BillingCheckoutForm";
import { listRegions } from "@lib/data/regions";
import { listCartPaymentMethods } from "@lib/data/payment";

type BillingPageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const regions = await listRegions();
  const countryOptions =
    regions?.flatMap((region) =>
      region.countries?.map((country) => ({
        value: country.iso_2 ?? "",
        label: country.display_name || country.name || country.iso_2?.toUpperCase() || "",
      })) || []
    ).filter((country) => country.value) || [];
  const configuredDefaultCountry = process.env.NEXT_PUBLIC_DEFAULT_REGION || "in";
  const defaultCountryCode =
    countryOptions.find((country) => country.value === configuredDefaultCountry)?.value ||
    countryOptions[0]?.value ||
    configuredDefaultCountry;

  const currentRegion = regions?.find(r => 
    r.countries?.some(c => c.iso_2 === defaultCountryCode)
  ) || regions?.[0];

  const paymentProviders = currentRegion 
    ? await listCartPaymentMethods(currentRegion.id) 
    : [];

  const paymentMethod = (searchParams.payment_method as string) || paymentProviders?.[0]?.id || "manual";

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">

        {/* Returning Customer banner */}
        <div
          className="flex items-center justify-center mb-8 px-2 text-center"
          style={{ backgroundColor: "#f5f5f5", minHeight: "56px" }}
        >
          <p style={{ fontSize: "14px", color: "#888" }}>
            Returning customer?{" "}
            <span
              className="cursor-pointer hover:underline"
              style={{ color: "#c27a4a" }}
            >
              Click here to Login
            </span>
          </p>
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
            Choose a payment option below and fill out the appropriate information
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
            countryOptions={countryOptions}
            defaultCountryCode={defaultCountryCode}
          />
          <CreditCardPanel paymentMethod={paymentMethod} />
        </BillingCheckoutForm>

      </div>
    </main>
  );
}
