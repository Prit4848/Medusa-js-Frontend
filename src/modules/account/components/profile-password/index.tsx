"use client"

import React from "react"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)
  const [errorState, setErrorState] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined)

  const clearState = () => {
    setSuccessState(false)
    setErrorState(false)
    setErrorMessage(undefined)
  }

  const updatePassword = async (formData: FormData) => {
    const oldPassword = formData.get("old_password") as string
    const newPassword = formData.get("new_password") as string
    const confirmPassword = formData.get("confirm_password") as string

    // Client-side validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required")
      setErrorState(true)
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match")
      setErrorState(true)
      return
    }
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customer.email,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update password")
        setErrorState(true)
        return
      }

      setSuccessState(true)
      setErrorState(false)
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred")
      setErrorState(true)
    }
  }

  return (
    <form
      action={updatePassword}
      onReset={() => clearState()}
      className="w-full"
    >
      <AccountInfo
        label="Password"
        currentInfo={
          <span className="text-gray-500 text-sm">
            Not shown for security reasons
          </span>
        }
        isSuccess={successState}
        isError={errorState}
        errorMessage={errorMessage}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Old password"
            name="old_password"
            required
            type="password"
            data-testid="old-password-input"
          />
          <Input
            label="New password"
            type="password"
            name="new_password"
            required
            data-testid="new-password-input"
          />
          <Input
            label="Confirm new password"
            type="password"
            name="confirm_password"
            required
            data-testid="confirm-password-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword