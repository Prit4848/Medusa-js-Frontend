import React from "react"

import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"
import { HttpTypes } from "@medusajs/types"

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer
  region: HttpTypes.StoreRegion
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, region }) => {
  const { addresses } = customer
  return (
    <div className="w-full">
      {/* Add button sits above the grid */}
      <div className="mb-5">
        <AddAddress region={region} addresses={addresses} />
      </div>

      {addresses.length === 0 ? (
        <div className="text-sm text-gray-400 py-6 text-center">
          No saved addresses yet. Add one above.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <EditAddress region={region} address={address} key={address.id} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressBook
