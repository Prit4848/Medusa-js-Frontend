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
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(defaultAddress)
  const [showAddressPicker, setShowAddressPicker] = useState(false)

  const [fields, setFields] = useState({
    first_name: defaultAddress?.first_name || customer.first_name || "",
    country_code: defaultAddress?.country_code || defaultCountryCode,
    city: defaultAddress?.city || "",
    address_1: defaultAddress?.address_1 || "",
    address_2: defaultAddress?.address_2 || "",
    postal_code: defaultAddress?.postal_code || "",
    phone: defaultAddress?.phone || customer.phone || "",
    zip_code: "",
    email: customer.email || "",
  })

  const handleAddressSelect = (addr: Address) => {
    setSelectedAddress(addr)
    setShowAddressPicker(false)
    setFields({
      first_name: addr.first_name || customer.first_name || "",
      country_code: addr.country_code || defaultCountryCode,
      city: addr.city || "",
      address_1: addr.address_1 || "",
      address_2: addr.address_2 || "",
      postal_code: addr.postal_code || "",
      phone: addr.phone || customer.phone || "",
      zip_code: "",
      email: customer.email || "",
    })
  }

  const handleChange =
    (field: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [field]: e.target.value }))
    }

  return (
    <div>
      {/* Saved address picker toggle */}
      {addresses.length > 0 && (
        <div className="flex items-center justify-between mb-5">
          <span style={{ fontSize: "13px", color: "#888" }}>
            {addresses.length} saved address{addresses.length > 1 ? "es" : ""}
          </span>
          <button
            type="button"
            onClick={() => setShowAddressPicker((p) => !p)}
            style={{ fontSize: "13px", color: "#bd744c" }}
            className="hover:underline"
          >
            {showAddressPicker ? "Hide" : addresses.length > 1 ? "Change address" : "Use saved address"}
          </button>
        </div>
      )}

      {showAddressPicker && addresses.length > 0 && (
        <div className="mb-6 overflow-hidden" style={{ border: "1px solid #e0e0e0" }}>
          {addresses.map((addr) => (
            <button
              key={addr.id}
              type="button"
              onClick={() => handleAddressSelect(addr)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition"
              style={{ borderBottom: "1px solid #f0f0f0", display: "block" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#1a1a1a" }}>
                    {addr.first_name}
                  </p>
                  <p style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
                    {addr.address_1}, {addr.city}, {addr.country_code?.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {addr.is_default_shipping && (
                    <span style={{ fontSize: "11px", padding: "2px 8px", background: "#EAF3DE", color: "#3B6D11", borderRadius: "99px" }}>
                      Default
                    </span>
                  )}
                  {selectedAddress?.id === addr.id && (
                    <span style={{ fontSize: "11px", padding: "2px 8px", background: "#FAECE7", color: "#993C1D", borderRadius: "99px" }}>
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
        <div className="mb-5 px-4 py-3" style={{ fontSize: "13px", background: "#FAEEDA", color: "#854F0B", border: "1px solid #FAC775" }}>
          No saved addresses found. Please fill in your details below.
        </div>
      )}

      {/* ── Form layout exactly matching screenshot ── */}
      <div className="flex flex-col gap-5">

        {/* Row 1: First Name — full width */}
        <Field
          label="First Name"
          name="first_name"
          required
          value={fields.first_name}
          onChange={handleChange("first_name")}
        />

        {/* Row 2: Country + City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField
            label="Country"
            name="country_code"
            required
            options={countryOptions}
            value={fields.country_code}
            onChange={handleChange("country_code")}
          />
          <Field
            label="City"
            name="city"
            required
            value={fields.city}
            onChange={handleChange("city")}
          />
        </div>

        {/* Row 3: Street + Apt/Suite/Other */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

        {/* Row 4: Postcode + Phone + ZIP Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
          <Field
            label="ZIP Code"
            name="zip_code"
            value={fields.zip_code}
            onChange={handleChange("zip_code")}
          />
        </div>

        {/* Row 5: Email — full width */}
        <Field
          label="Email"
          name="email"
          type="email"
          required
          value={fields.email}
          onChange={handleChange("email")}
        />

      </div>
    </div>
  )
}

/* ─── Shared styles ─────────────────────────────────────────── */

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 400,
  color: "#222",
  marginBottom: "6px",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  fontSize: "14px",
  color: "#1a1a1a",
  background: "#fff",
  border: "1px solid #d8d8d8",
  borderRadius: 0,
  padding: "0 12px",
  outline: "none",
}

function Field({
  label,
  name,
  type = "text",
  placeholder = "",
  required = false,
  value,
  onChange,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: "#bd744c" }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        style={inputStyle}
        className="focus:border-[#bd744c] transition-colors"
      />
    </div>
  )
}

function SelectField({
  label,
  name,
  required = false,
  options,
  value,
  onChange,
}: {
  label: string
  name: string
  required?: boolean
  options: CountryOption[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: "#bd744c" }}>*</span>}
      </label>
      <select
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        style={{ ...inputStyle, color: "#444" }}
        className="focus:border-[#bd744c] transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}