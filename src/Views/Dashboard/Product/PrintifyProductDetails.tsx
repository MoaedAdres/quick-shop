import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import { icons } from "@/Constants/icons";
import {
  useGetPrintifyProductDetails,
  useAddToCart,
} from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { PrintifyProductDetails, AddToCartPayload } from "@/Types/types";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PrintifyProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  // State for image gallery
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const swiperRef = useRef<SwiperRef | null>(null);

  // State for product selection
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<{
    id: string;
    title: string;
    price: number;
  } | null>(null);

  // State for option selections
  const [selectedOptions, setSelectedOptions] = useState<{
    [optionId: string]: string;
  }>({});
  console.log("selectedOptions", selectedOptions);
  // Fetch product details
  const {
    data: productDetails,
    isLoading,
    error,
  } = useGetPrintifyProductDetails(productId || "");
  const addToCartMutation = useAddToCart();

  // Reset image index and set initial variant when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    if (swiperRef.current?.swiper) {
      // When in loop mode, we need to use slideToLoop for proper navigation
      swiperRef.current.swiper.slideToLoop(0);
    }

    // Set initial variant when product data loads
    if (productDetails?.data?.variants) {
      const firstEnabledVariant = productDetails.data.variants.find(
        (v) => v.is_enabled
      );
      if (firstEnabledVariant) {
        setSelectedVariant({
          id: firstEnabledVariant.id.toString(),
          title: firstEnabledVariant.title,
          price: firstEnabledVariant.price,
        });
      }
    }
  }, [productId, productDetails]);

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    if (swiperRef.current?.swiper) {
      // When in loop mode, we need to use slideToLoop for proper navigation
      swiperRef.current.swiper.slideToLoop(index);
    }
  };

  // Handle slide change
  const handleSlideChange = (swiper: any) => {
    // When in loop mode, we need to get the real index
    const realIndex =
      swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
    setSelectedImageIndex(realIndex);
  };

  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 100) {
      setQuantity(newQuantity);
    }
  };

  // Handle option selection (toggle functionality)
  const handleOptionSelect = (optionId: string, valueId: string) => {
    setSelectedOptions((prev) => {
      const currentValue = prev[optionId];

      // If clicking the same option, unselect it
      if (currentValue === valueId) {
        const newOptions = { ...prev };
        delete newOptions[optionId];
        return newOptions;
      }

      // Otherwise, select the new option
      return {
        ...prev,
        [optionId]: valueId,
      };
    });
  };

  // Get filtered variants based on selected options
  const getFilteredVariants = useCallback(() => {
    if (!productDetails?.data?.variants) return [];

    const filtered = productDetails.data.variants.filter((variant) => {
      // If no options are selected, show all enabled variants
      if (Object.keys(selectedOptions).length === 0) {
        return variant.is_enabled;
      }
      // Check if variant matches all selected options
      const selectedOptionEntries = Object.entries(selectedOptions);

      return (
        variant.is_enabled &&
        selectedOptionEntries.every(([optionIndex, selectedValueId]) => {
          // Get the option values for this variant
          const optionIndexNum = parseInt(optionIndex);
          const variantOptionValue = variant.options[optionIndexNum];

          // Check if the variant's option value matches the selected value
          return (
            variantOptionValue &&
            variantOptionValue.toString() === selectedValueId
          );
        })
      );
    });

    // Sort enabled variants first, then by title
    return filtered.sort((a, b) => {
      if (a.is_enabled && !b.is_enabled) return -1;
      if (!a.is_enabled && b.is_enabled) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [selectedOptions, productDetails?.data?.variants]);

  // Auto-select variant when options change
  useEffect(() => {
    const filteredVariants = getFilteredVariants();

    if (filteredVariants.length > 0) {
      // Select the first available variant
      const firstVariant = filteredVariants[0];
      setSelectedVariant({
        id: firstVariant.id.toString(),
        title: firstVariant.title,
        price: firstVariant.price,
      });
    } else if (Object.keys(selectedOptions).length > 0) {
      // No variants match the selected options, clear selection
      setSelectedVariant(null);
    }
  }, [selectedOptions, productDetails?.data?.variants, getFilteredVariants]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant || !productDetails?.data) {
      toast.error("Please select a variant");
      return;
    }

    // Construct sku_attr string from Printify product data
    const skuAttrParts = [
      `print_provider_id:${productDetails.data.print_provider_id}`,
      `blueprint_id:${productDetails.data.blueprint_id}`,
    ];
    const skuAttr = skuAttrParts.join(",");

    const payload: AddToCartPayload = {
      source: "printify",
      product: {
        product_id: productId!,
        name: productDetails.data.title,
        sku_id: selectedVariant.id,
        sku_attr: skuAttr,
        price: selectedVariant.price,
        image_url: productDetails.data.images[0].src,
      },
      quantity,
    };

    try {
      await addToCartMutation.mutateAsync(payload);
      toast.success("Added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
    }
  };
  const filteredVariants = getFilteredVariants();
  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full">
        <div className="flex items-center justify-center h-full">
          <i
            className={`${icons.spinner} text-2xl text-primary animate-spin`}
          />
          <span className="ml-2 text-muted-foreground">Loading product...</span>
        </div>
      </RFlex>
    );
  }

  if (error || !productDetails) {
    return (
      <RFlex className="flex-col h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <i className={`${icons.error} text-4xl text-destructive mb-4`} />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Product Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={handleBack} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </RFlex>
    );
  }

  const product = productDetails.data;
  const images = product.images || [];

  return (
    <RFlex className="flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <i className={`${icons.arrowLeft} text-lg`} />
          Back
        </Button>
        <h1 className="text-lg font-semibold text-foreground">
          Product Details
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Product Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 pb-20 md:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image Swiper */}
              <div className="relative">
                <Swiper
                  ref={swiperRef}
                  modules={[Pagination, Autoplay]}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                    el: ".swiper-pagination",
                    type: "bullets",
                  }}
                  loop={true}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  onSlideChange={handleSlideChange}
                  className="h-96 rounded-lg overflow-hidden"
                  style={
                    {
                      "--swiper-pagination-color": "hsl(var(--primary))",
                    } as React.CSSProperties
                  }
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image.src}
                        alt={`${product.title} - ${image.position}`}
                        className="w-full h-full object-fill"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all relative ${
                        selectedImageIndex === index
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={`${product.title} - ${image.position}`}
                        className="w-full h-full object-fill"
                      />
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 md:pb-[50px]">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {product.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {product.tags.slice(0, 10).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted text-xs text-muted-foreground rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {" "}
                  Price
                </h3>
                <div className="flex items-center gap-4">
                  {selectedVariant ? (
                    <span className="text-3xl font-bold text-primary">
                      ${(selectedVariant.price / 100).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-lg text-muted-foreground">
                      Please select a variant
                    </span>
                  )}
                </div>
              </div>

              {/* Options */}
              {product.options.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Options
                  </h3>
                  {product.options.map((option) => {
                    const index = option?.type == "size" ? "0" : "1";
                    return (
                      <div key={index} className="space-y-2">
                        <h4 className="font-medium text-foreground">
                          {option.name}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value) => (
                            <button
                              key={value.id}
                              onClick={() =>
                                handleOptionSelect(index, value.id.toString())
                              }
                              className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                                selectedOptions[index.toString()] ===
                                value.id.toString()
                                  ? "border-primary border-2 bg-primary/10 text-primary"
                                  : "border-[#383737] border-2 hover:border-primary/50"
                              }`}
                              style={
                                option.type === "color" && value.colors
                                  ? {
                                      backgroundColor: value.colors[0],
                                      color:
                                        value.colors[0] === "#FFFFFF"
                                          ? "#000"
                                          : "#FFF",
                                    }
                                  : {}
                              }
                            >
                              {option.type == "color" ? (
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{
                                    backgroundColor: value.colors?.[0],
                                  }}
                                />
                              ) : (
                                value.title
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Variants */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">
                    Available Variants
                  </h3>
                  {Object.keys(selectedOptions).length > 0 && (
                    <button
                      onClick={() => setSelectedOptions({})}
                      className="text-sm text-primary hover:underline"
                    >
                      Clear selections
                    </button>
                  )}
                </div>
                {filteredVariants.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() =>
                          setSelectedVariant({
                            id: variant.id.toString(),
                            title: variant.title,
                            price: variant.price,
                          })
                        }
                        className={`p-3 rounded-lg border text-sm transition-all ${
                          selectedVariant?.id === variant.id.toString()
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-medium">{variant.title}</div>
                          <div className="text-xs text-muted-foreground">
                            ${(variant.price / 100).toFixed(2)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : Object.keys(selectedOptions).length > 0 ? (
                  <div className="p-4 text-center border border-dashed border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      No variants available for the selected options
                    </p>
                  </div>
                ) : (
                  <div className="p-4 text-center border border-dashed border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Select options to see available variants
                    </p>
                  </div>
                )}
              </div>
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Description
                </h3>
                <div
                  className="text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
              <div className="mt-12 space-y-8">
                {/* Product Specifications */}
                {/* <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Product Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">
                        Created
                      </span>
                      <p className="font-medium">
                        {new Date(product.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">
                        Last Updated
                      </span>
                      <p className="font-medium">
                        {new Date(product.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div> */}
                {/* Quantity and Total */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground">Quantity</h3>
                    {selectedVariant && (
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          Total Price
                        </div>
                        <div className="text-lg font-bold text-primary">
                          $
                          {((selectedVariant.price * quantity) / 100).toFixed(
                            2
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-50"
                    >
                      <i className={icons.remove} />
                    </button>
                    <span className="font-medium text-foreground">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 100}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-50"
                    >
                      <i className={icons.add} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || addToCartMutation.isPending}
                  >
                    {addToCartMutation.isPending ? (
                      <>
                        <i className={`${icons.spinner} animate-spin mr-2`} />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <i className={`${icons.cart} mr-2`} />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional Details */}

            {/* Variants Table */}
            {/* {product.variants.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Available Variants
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2">Variant</th>
                        <th className="text-left py-2">Price</th>
                        <th className="text-left py-2">Weight</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                                         <tbody>
                       {product.variants
                         .sort((a, b) => {
                           // Sort enabled variants first, then by title
                           if (a.is_enabled && !b.is_enabled) return -1;
                           if (!a.is_enabled && b.is_enabled) return 1;
                           return a.title.localeCompare(b.title);
                         })
                         .slice(0, 10)
                         .map((variant) => (
                           <tr
                             key={variant.id}
                             className="border-b border-border/50"
                           >
                             <td className="py-2">{variant.title}</td>
                             <td className="py-2">
                               ${(variant.price / 100).toFixed(2)}
                             </td>
                             <td className="py-2">{variant.grams}g</td>
                             <td className="py-2">
                               <span
                                 className={`px-2 py-1 rounded-full text-xs ${
                                   variant.is_enabled
                                     ? "bg-green-100 text-green-800"
                                     : "bg-gray-100 text-gray-800"
                                 }`}
                               >
                                 {variant.is_enabled ? "Enabled" : "Disabled"}
                               </span>
                             </td>
                           </tr>
                         ))}
                     </tbody>
                  </table>
                  {product.variants.length > 10 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing first 10 variants of {product.variants.length}{" "}
                      total
                    </p>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </RFlex>
  );
};

export default PrintifyProductDetails;
