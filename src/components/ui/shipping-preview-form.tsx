import { useState } from "react";
import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useShippingPreview, useGetUserAddresses } from "@/Api/queriesAndMutations";
import type {
  ShippingAddress,
  ShippingPreviewSuccess,
  ShippingPreviewError,
  UserAddress,
} from "@/Types/types";

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

  const shippingPreviewMutation = useShippingPreview();
  const { data: addressesData } = useGetUserAddresses();
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
      const result = await shippingPreviewMutation.mutateAsync(formData);
      console.log("result", result);
      onSuccess?.(result);
      setShippingAddress?.(formData);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Saved Addresses Section */}
      {addressesData?.data && addressesData.data.length > 0 && (
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Saved Addresses</h3>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSavedAddresses(!showSavedAddresses)}
              className="text-primary text-sm font-medium flex items-center gap-1"
            >
              <i className={`${showSavedAddresses ? icons.chevronUp : icons.chevronDown} text-xs`} />
              {showSavedAddresses ? "Hide" : "Show"} Saved Addresses
            </motion.button>
          </div>
          
          {showSavedAddresses && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {addressesData.data.map((address) => (
                <motion.button
                  key={address.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddressSelect(address)}
                  className="w-full text-left p-3 bg-background rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-foreground text-sm mb-1">
                        {address.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {formatAddress(address)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {address.phone_country} {address.mobile_no} • {address.contact_person}
                      </div>
                    </div>
                    <i className={`${icons.check} text-primary text-sm`} />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      )}

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

        {/* Phone */}
        <div className="flex gap-2">
          <div className="w-24">
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
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
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

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
          />
        </div>

        {/* ZIP/Postal Code */}
        <div>
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
  );
};

export default ShippingPreviewForm;
