import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { icons } from "@/Constants/icons";
import {
  useGetUserAddresses,
  useCreateAddress,
} from "@/Api/queriesAndMutations";
import type {
  UserAddress,
  CreateAddressPayload,
  ShippingAddress,
} from "@/Types/types";
import { toast } from "sonner";
import CountrySelector from "./country-selector";
import type { AliExpressCountry } from "@/Constants/aliexpressCountries";
import { ALIEXPRESS_COUNTRIES } from "@/Constants/aliexpressCountries";

interface AddressManagementProps {
  onAddressSelect?: (address: ShippingAddress) => void;
  showSelectButton?: boolean;
}

const AddressManagement = ({
  onAddressSelect,
  showSelectButton = false,
}: AddressManagementProps) => {
  const { data: addressesData, isLoading, error } = useGetUserAddresses();
  const createAddressMutation = useCreateAddress();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<CreateAddressPayload>({
    address: "",
    address2: "",
    city: "",
    province: "",
    country: "",
    zip: "",
    contact_person: "",
    full_name: "",
    mobile_no: "",
    phone_country: "+1",
  });

  const handleCountrySelect = (country: AliExpressCountry) => {
    setFormData((prev) => ({
      ...prev,
      country: country.name,
      phone_country: country.phone_code || "+1", // Auto-populate phone code
    }));
  };

  const getCountryCodeByName = (countryName: string): string | undefined => {
    // Find the country by name and return its code
    const country = ALIEXPRESS_COUNTRIES.find((c) => c.name === countryName);
    return country?.code;
  };

  // const getPhoneCodeByCountryName = (countryName: string): string => {
  //   const country = ALIEXPRESS_COUNTRIES.find(c => c.name === countryName);
  //   return country?.phone_code || "+1";
  // };

  const handleInputChange = (
    field: keyof CreateAddressPayload,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createAddressMutation.mutateAsync(formData);
      setShowAddForm(false);
      setFormData({
        address: "",
        address2: "",
        city: "",
        province: "",
        country: "",
        zip: "",
        contact_person: "",
        full_name: "",
        mobile_no: "",
        phone_country: "+1",
      });
    } catch (error) {
      console.error("Failed to create address:", error);
    }
  };

  const handleAddressSelect = (address: UserAddress) => {
    if (onAddressSelect) {
      const shippingAddress: ShippingAddress = {
        address: address.address,
        address2: address.address2 || "",
        city: address.city,
        province: address.province,
        country: address.country,
        zip: address.zip,
        contact_person: address.contact_person,
        full_name: address.full_name,
        mobile_no: address.mobile_no,
        phone_country: address.phone_country,
      };
      onAddressSelect(shippingAddress);
      toast.success("Address selected successfully!");
    }
  };

  const formatAddress = (address: UserAddress) => {
    const parts = [
      address.address,
      address.address2,
      address.city,
      address.province,
      address.country,
      address.zip,
    ].filter(Boolean);
    return parts.join(", ");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <i className={`${icons.spinner} text-2xl text-primary animate-spin`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <i className={`${icons.error} text-3xl text-red-500 mb-2`} />
        <p className="text-muted-foreground">Failed to load addresses</p>
      </div>
    );
  }

  const addresses = addressesData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Saved Addresses
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage your shipping addresses for faster checkout
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-primary text-primary-foreground px-2 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
        >
          <i className={`${icons.add} text-sm`} />
          <span className="w-max">Add Address</span>
        </motion.button>
      </div>

      {/* Addresses List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <i
              className={`${icons.location} text-3xl text-muted-foreground mb-2`}
            />
            <p className="text-muted-foreground">No saved addresses yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first address to get started
            </p>
          </div>
        ) : (
          addresses.map((address: UserAddress) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className={`${icons.location} text-primary`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground mb-1">
                        {address.full_name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formatAddress(address)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {address.phone_country} {address.mobile_no}
                        </span>
                        <span>•</span>
                        <span>{address.contact_person}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {showSelectButton && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddressSelect(address)}
                    className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-medium"
                  >
                    Select
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Address Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60  p-4 pb-15"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto border border-border"
            >
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Add New Address
                  </h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    <i className={`${icons.close} text-muted-foreground`} />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) =>
                        handleInputChange("full_name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contact_person}
                      onChange={(e) =>
                        handleInputChange("contact_person", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Country *
                  </label>
                  <CountrySelector
                    selectedCountry={
                      formData.country
                        ? getCountryCodeByName(formData.country)
                        : undefined
                    }
                    onCountrySelect={handleCountrySelect}
                    placeholder="Select your country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Address 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.address2 || ""}
                    onChange={(e) =>
                      handleInputChange("address2", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Province/State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.province}
                      onChange={(e) =>
                        handleInputChange("province", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => handleInputChange("zip", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="w-32">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Phone Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone_country}
                      disabled
                      className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed text-center"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.mobile_no}
                      onChange={(e) =>
                        handleInputChange("mobile_no", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2 px-4 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createAddressMutation.isPending}
                    className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium disabled:opacity-50"
                  >
                    {createAddressMutation.isPending
                      ? "Adding..."
                      : "Add Address"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressManagement;
