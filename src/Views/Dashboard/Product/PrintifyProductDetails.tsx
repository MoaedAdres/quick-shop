import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import { icons } from "@/Constants/icons";
import { useGetPrintifyProductDetails } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import { Button } from "@/components/ui/button";
import type { PrintifyProductDetails } from "@/Types/types";

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

  // Fetch product details
  const { data: productDetails, isLoading, error } = useGetPrintifyProductDetails(
    productId || ""
  );

  // Reset image index when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    if (swiperRef.current?.swiper) {
      // When in loop mode, we need to use slideToLoop for proper navigation
      swiperRef.current.swiper.slideToLoop(0);
    }
  }, [productId]);

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
    const realIndex = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
    setSelectedImageIndex(realIndex);
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full">
        <div className="flex items-center justify-center h-full">
          <i className={`${icons.spinner} text-2xl text-primary animate-spin`} />
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
        <h1 className="text-lg font-semibold text-foreground">Product Details</h1>
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
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation={true}
                  pagination={{ 
                    clickable: true, 
                    dynamicBullets: true,
                    el: '.swiper-pagination',
                    type: 'bullets'
                  }}
                  loop={true}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  onSlideChange={handleSlideChange}
                  className="h-96 rounded-lg overflow-hidden"
                  style={{
                    "--swiper-navigation-color": "hsl(var(--primary))",
                    "--swiper-pagination-color": "hsl(var(--primary))",
                  } as React.CSSProperties}
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image.src}
                        alt={`${product.title} - ${image.position}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
                        className="w-full h-full object-cover"
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
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {product.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {product.tags.slice(0, 5).map((tag, index) => (
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
                <h3 className="text-lg font-semibold text-foreground">Price</h3>
                <div className="flex items-center gap-4">
                  {product.variants.find(v => v.is_enabled) ? (
                    <span className="text-3xl font-bold text-primary">
                      ${(product.variants.find(v => v.is_enabled)!.price / 100).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-lg text-muted-foreground">Price varies by variant</span>
                  )}
                </div>
              </div>

              {/* Options */}
              {product.options.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Options</h3>
                  {product.options.map((option, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium text-foreground">{option.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => (
                          <button
                            key={value.id}
                            className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                              option.type === "color" && value.colors
                                ? "border-border hover:border-primary"
                                : "border-border hover:border-primary"
                            }`}
                            style={
                              option.type === "color" && value.colors
                                ? {
                                    backgroundColor: value.colors[0],
                                    color: value.colors[0] === "#FFFFFF" ? "#000" : "#FFF",
                                  }
                                : {}
                            }
                          >
                            {value.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Description</h3>
                <div 
                  className="text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button className="flex-1" size="lg">
                  <i className={`${icons.cart} mr-2`} />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <i className={`${icons.heart} mr-2`} />
                  Wishlist
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mt-12 space-y-8">
            {/* Product Specifications */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Product Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Blueprint ID</span>
                  <p className="font-medium">{product.blueprint_id}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Print Provider ID</span>
                  <p className="font-medium">{product.print_provider_id}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <p className="font-medium">
                    {new Date(product.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <p className="font-medium">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Variants Table */}
            {product.variants.length > 0 && (
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
                      {product.variants.slice(0, 10).map((variant) => (
                        <tr key={variant.id} className="border-b border-border/50">
                          <td className="py-2">{variant.title}</td>
                          <td className="py-2">${(variant.price / 100).toFixed(2)}</td>
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
                      Showing first 10 variants of {product.variants.length} total
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </RFlex>
  );
};

export default PrintifyProductDetails;
