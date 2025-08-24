import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { icons } from "@/Constants/icons";
import {
  useShippingPreview,
  useGetUserAddresses,
} from "@/Api/queriesAndMutations";
import type {
  ShippingAddress,
  ShippingPreviewSuccess,
  ShippingPreviewError,
  UserAddress,
} from "@/Types/types";
import CountrySelector from "./country-selector";
import type { AliExpressCountry } from "@/Constants/aliexpressCountries";
import { ALIEXPRESS_COUNTRIES } from "@/Constants/aliexpressCountries";

interface ShippingPreviewFormProps {
  onSuccess?: (data: ShippingPreviewSuccess) => void;
  onError?: (error: ShippingPreviewError) => void;
  setShippingAddress?: (address: ShippingAddress) => void;
}

const ShippingPreviewForm = ({
  onSuccess,
  onError,
  setShippingAddress,
}: ShippingPreviewFormProps) => {
  const [formData, setFormData] = useState<ShippingAddress>({
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
    order_comment: "",
  });

  // Store country code separately for API calls
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");

  const shippingPreviewMutation = useShippingPreview();
  const { data: addressesData, isLoading: addressesLoading } =
    useGetUserAddresses();
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);

  const handleAddressSelect = (address: UserAddress) => {
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
      order_comment: "",
    };
    setFormData(shippingAddress);
    
    // Extract country code from the selected address
    const countryCode = getCountryCodeByName(address.country);
    setSelectedCountryCode(countryCode || "");
    
    setShowSavedAddresses(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create API payload with country code instead of name
      const apiPayload = {
        ...formData,
        country: selectedCountryCode, // Use country code for API
      };
      
      const result = await shippingPreviewMutation.mutateAsync(apiPayload);
      console.log("result", result);
      onSuccess?.(result);
      setShippingAddress?.(formData); // Keep original formData for display
    } catch (error) {
      console.error("Failed to get shipping preview:", error);
      onError?.(error as unknown as ShippingPreviewError);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountrySelect = (country: AliExpressCountry) => {
    setFormData((prev) => ({ 
      ...prev, 
      country: country.name, // Keep name for display
      phone_country: country.phone_code || "+1" // Auto-populate phone code
    }));
    setSelectedCountryCode(country.code); // Store code for API
  };

  const getCountryCodeByName = (countryName: string): string | undefined => {
    const country = ALIEXPRESS_COUNTRIES.find(c => c.name === countryName);
    return country?.code;
  };

  // const getPhoneCodeByCountryName = (countryName: string): string => {
  //   const country = ALIEXPRESS_COUNTRIES.find(c => c.name === countryName);
  //   return country?.phone_code || "+1";
  // };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Saved Addresses Section */}
        {addressesLoading ? (
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <i className={`${icons.spinner} animate-spin text-primary`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Loading Saved Addresses
                </h3>
                <p className="text-xs text-muted-foreground">Please wait...</p>
              </div>
            </div>
          </div>
        ) : addressesData?.data && addressesData.data.length > 0 ? (
          <motion.div
            className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20 cursor-pointer hover:from-primary/10 hover:to-primary/15 transition-all duration-200"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowSavedAddresses(true)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <i className={`${icons.location} text-primary`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Use Saved Address
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    You have {addressesData.data.length} saved address
                    {addressesData.data.length > 1 ? "es" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <i className={`${icons.chevronRight} text-primary text-sm`} />
              </div>
            </div>
          </motion.div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label
              htmlFor="contact_person"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Contact Person
            </label>
            <input
              type="text"
              id="contact_person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
            />
          </div>

          {/* Country */}
          <div className="md:col-span-2">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Country
            </label>
            <CountrySelector
              selectedCountry={formData.country ? getCountryCodeByName(formData.country) : undefined}
              onCountrySelect={handleCountrySelect}
              placeholder="Select your country"
            />
          </div>

          {/* Province/State */}
          <div>
            <label
              htmlFor="province"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Province/State
            </label>
            <input
              type="text"
              id="province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-foreground mb-1"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
            />
          </div>

          {/* Address 2 */}
          <div className="md:col-span-2">
            <label
              htmlFor="address2"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              id="address2"
              name="address2"
              value={formData.address2}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
            />
          </div>

          {/* ZIP/Postal Code */}
          <div className="md:col-span-2">
            <label
              htmlFor="zip"
              className="block text-sm font-medium text-foreground mb-1"
            >
              ZIP/Postal Code
            </label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
            />
          </div>

          {/* Phone */}
          <div className="flex gap-2 md:col-span-2">
            <div className="w-28">
              <label
                htmlFor="phone_country"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Code
              </label>
              <input
                type="text"
                id="phone_country"
                name="phone_country"
                value={formData.phone_country}
                disabled
                className="w-full px-3 py-2 rounded-md border border-border bg-muted text-muted-foreground cursor-not-allowed text-center"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="mobile_no"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="mobile_no"
                name="mobile_no"
                value={formData.mobile_no}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
              />
            </div>
          </div>

          {/* Order Comment */}
          <div className="md:col-span-2">
            <label
              htmlFor="order_comment"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Order Comment (Optional)
            </label>
            <textarea
              id="order_comment"
              name="order_comment"
              value={formData.order_comment}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={shippingPreviewMutation.isPending}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {shippingPreviewMutation.isPending ? (
            <>
              <i className={`${icons.spinner} animate-spin`} />
              Calculating Shipping...
            </>
          ) : (
            <>
              <i className={icons.truck} />
              Calculate Shipping
            </>
          )}
        </motion.button>
      </form>

      {/* Address Selection Modal */}
      <AnimatePresence>
        {showSavedAddresses && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 pb-10"
            onClick={() => setShowSavedAddresses(false)}
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <i className={`${icons.location} text-primary`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        Select Address
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Choose a saved address
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSavedAddresses(false)}
                    className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    <i className={`${icons.close} text-muted-foreground`} />
                  </button>
                </div>
              </div>

              {/* Addresses List */}
              <div className="p-6">
                <div className="space-y-3">
                  {addressesData?.data?.map((address) => (
                    <motion.button
                      key={address.id}
                      type="button"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddressSelect(address)}
                      className="w-full text-left bg-card border border-border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all duration-200"
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
                              <div className="flex items-center gap-4 text-xs text-muted-foreground w-max">
                                <span className="w-max">
                                  {address.phone_country} {address.mobile_no}
                                </span>
                                <span>•</span>
                                <span className="w-min">{address.contact_person}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Click any address above to auto-fill the shipping form
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShippingPreviewForm;
