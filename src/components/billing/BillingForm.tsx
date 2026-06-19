"use client"

import { useState } from "react"

type CountryOption = { value: string; label: string }
type Address = {
  id: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  postal_code?: string
  province?: string
  country_code?: string
  phone?: string
  is_default_shipping?: boolean
}

type BillingFormProps = {
  countryOptions: CountryOption[]
  defaultCountryCode: string
  customer: {
    email?: string
    first_name?: string
    last_name?: string
    phone?: string
  }
  addresses: Address[]
  defaultAddress: Address | null
}

export default function BillingForm({
  countryOptions,
  defaultCountryCode,
  customer,
  addresses,
  defaultAddress,
}: BillingFormProps) {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    defaultAddress
  )
  const [showAddressPicker, setShowAddressPicker] = useState(false)

  // Controlled field state — initialized from defaultAddress or customer
  const [fields, setFields] = useState({
    first_name: defaultAddress?.first_name || customer.first_name || "",
    country_code: defaultAddress?.country_code || defaultCountryCode,
    city: defaultAddress?.city || "",
    address_1: defaultAddress?.address_1 || "",
    address_2: defaultAddress?.address_2 || "",
    postal_code: defaultAddress?.postal_code || "",
    phone: defaultAddress?.phone || customer.phone || "",
    email: customer.email || "",
  })

  const handleAddressSelect = (addr: Address) => {
    setSelectedAddress(addr)
    setShowAddressPicker(false)
    // Update ALL fields when address changes
    setFields({
      first_name: addr.first_name || customer.first_name || "",
      country_code: addr.country_code || defaultCountryCode,
      city: addr.city || "",
      address_1: addr.address_1 || "",
      address_2: addr.address_2 || "",
      postal_code: addr.postal_code || "",
      phone: addr.phone || customer.phone || "",
      email: customer.email || "",
    })
  }

  const handleChange = (field: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFields((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#1a1a1a] font-bold" style={{ fontSize: "22px" }}>
          Billing Address
        </h2>

        {addresses.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAddressPicker((p) => !p)}
            className="text-sm text-[#c27a4a] hover:underline"
          >
            {showAddressPicker
              ? "Hide"
              : addresses.length > 1
              ? "Change address"
              : "View saved address"}
          </button>
        )}
      </div>

      {/* Address picker */}
      {showAddressPicker && addresses.length > 0 && (
        <div className="mb-6 border border-[#e0e0e0] rounded overflow-hidden">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              type="button"
              onClick={() => handleAddressSelect(addr)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-[#f0f0f0] last:border-0 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {addr.first_name} {addr.last_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {addr.address_1}, {addr.city},{" "}
                    {addr.country_code?.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {addr.is_default_shipping && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "#EAF3DE", color: "#3B6D11" }}
                    >
                      Default
                    </span>
                  )}
                  {selectedAddress?.id === addr.id && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "#FAECE7", color: "#993C1D" }}
                    >
                      Selected
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {addresses.length === 0 && (
        <div
          className="mb-5 px-4 py-3 text-sm rounded"
          style={{
            background: "#FAEEDA",
            color: "#854F0B",
            border: "1px solid #FAC775",
          }}
        >
          No saved addresses found. Please fill in your details below.
        </div>
      )}

      <div className="space-y-5">
        {/* First Name */}
        <Field
          label="First Name*"
          name="first_name"
          value={fields.first_name}
          onChange={handleChange("first_name")}
        />

        {/* Country + City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Country*"
            name="country_code"
            options={countryOptions}
            value={fields.country_code}
            onChange={handleChange("country_code")}
          />
          <Field
            label="City*"
            name="city"
            value={fields.city}
            onChange={handleChange("city")}
          />
        </div>

        {/* Street + Apt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Street"
            name="address_1"
            value={fields.address_1}
            onChange={handleChange("address_1")}
          />
          <Field
            label="Apt / Suite / Other"
            name="address_2"
            value={fields.address_2}
            onChange={handleChange("address_2")}
          />
        </div>

        {/* Postcode + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Postcode"
            name="postal_code"
            value={fields.postal_code}
            onChange={handleChange("postal_code")}
          />
          <Field
            label="Phone"
            name="phone"
            value={fields.phone}
            onChange={handleChange("phone")}
            placeholder="+ 375 (29)"
          />
        </div>

        {/* Email */}
        <Field
          label="Email*"
          name="email"
          type="email"
          value={fields.email}
          onChange={handleChange("email")}
        />
      </div>
    </div>
  )
}

// Controlled input
function Field({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
        value={value}
        onChange={onChange}
        className="w-full border border-[#e0e0e0] bg-white px-3 outline-none focus:border-[#c27a4a] transition"
        style={{ height: "44px", fontSize: "14px" }}
      />
    </div>
  )
}

// Controlled select
function SelectField({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string
  name: string
  options: CountryOption[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
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
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-[#e0e0e0] bg-white px-3 outline-none focus:border-[#c27a4a] transition"
        style={{ height: "44px", fontSize: "14px", color: "#444" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}