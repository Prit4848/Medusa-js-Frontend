type CountryOption = {
  value: string
  label: string
}

type BillingFormProps = {
  countryOptions: CountryOption[]
  defaultCountryCode: string
}

export default function BillingForm({
  countryOptions,
  defaultCountryCode,
}: BillingFormProps) {
  return (
    <div>
      <h2
        className="text-[#1a1a1a] font-bold mb-8"
        style={{ fontSize: "22px" }}
      >
        Billing Address
      </h2>

      <div className="space-y-5">
        {/* First Name — full width */}
        <Field label="First Name*" name="first_name" />

        {/* Country + City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Country*"
            name="country_code"
            options={countryOptions}
            defaultValue={defaultCountryCode}
          />
          <Field label="City*" name="city" />
        </div>

        {/* Street + Apt/Suite */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Street" name="address_1" />
          <Field label="Apt / Suite / Other" name="address_2" />
        </div>

        {/* Postcode + Phone + ZIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Postcode" name="postal_code" />
          <Field label="Phone" name="phone" placeholder="+ 375 (29)" />
          <Field label="ZIP Code" name="zip" />
        </div>

        {/* Email — full width */}
        <Field label="Email*" name="email" type="email" />
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder = "",
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        className="block text-[#222] mb-1"
        style={{ fontSize: "13px", fontWeight: 400 }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required
        className="w-full border border-[#e0e0e0] bg-white px-3 outline-none focus:border-[#c27a4a] transition"
        style={{ height: "44px", fontSize: "14px" }}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: CountryOption[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label
        className="block text-[#222] mb-1"
        style={{ fontSize: "13px", fontWeight: 400 }}
      >
        {label}
      </label>
      <select
        defaultValue={defaultValue}
        name={name}
        className="w-full border border-[#e0e0e0] bg-white px-3 outline-none focus:border-[#c27a4a] transition appearance-auto"
        style={{ height: "44px", fontSize: "14px", color: "#444" }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
