import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useGetProductDetails, useAddToCart } from "@/Api/queriesAndMutations";
import RFlex from "@/RComponents/RFlex";
import { toast } from "sonner";
import type { AddToCartPayload } from "@/Types/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { SwiperRef } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSku, setSelectedSku] = useState<{
    sku_id: string;
    sku_attr: string;
    price: string;
  } | null>(null);

  const swiperRef = useRef<SwiperRef | null>(null);

  const { data: productData, isLoading } = useGetProductDetails(productId!);
  const addToCartMutation = useAddToCart();

  // Set initial variant and reset image when data loads
  useEffect(() => {
    if (productData?.data?.sku_info) {
      const firstSku = Array.isArray(productData.data.sku_info)
        ? productData.data.sku_info[0]
        : productData.data.sku_info;

      setSelectedSku({
        sku_id: firstSku.sku_id,
        sku_attr: firstSku.sku_attr,
        price: firstSku.offer_sale_price,
      });
    }

    // Reset selected image to first image when product changes
    setSelectedImageIndex(0);
    if (swiperRef.current?.swiper) {
      // When in loop mode, we need to use slideToLoop for proper navigation
      swiperRef.current.swiper.slideToLoop(0);
    }
  }, [productData]);

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    if (swiperRef.current?.swiper) {
      // When in loop mode, we need to use slideToLoop for proper navigation
      swiperRef.current.swiper.slideToLoop(index);
    }
  };

  // Handle swiper slide change
  const handleSlideChange = (swiper: any) => {
    // When in loop mode, we need to get the real index
    const realIndex = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
    setSelectedImageIndex(realIndex);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSku) {
      toast.error("Please select a variant");
      return;
    }

    const payload: AddToCartPayload = {
      source: "aliexpress", // TODO: Make this dynamic based on product source
      product: {
        product_id: productId!,
        name: productData?.data.title || "",
        sku_id: selectedSku.sku_id,
        sku_attr: selectedSku.sku_attr,
        price: parseFloat(selectedSku.price),
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

  if (isLoading) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">
            Product Details
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <i
            className={`${icons.spinner} text-2xl text-primary animate-spin`}
          />
        </div>
      </RFlex>
    );
  }

  if (!productData) {
    return (
      <RFlex className="flex-col h-full pb-20 md:pb-0">
        <div className="bg-card border-b border-border p-4">
          <h1 className="text-xl font-semibold text-foreground">
            Product Details
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <i className={`${icons.error} text-3xl text-red-500 mb-2`} />
            <p className="text-muted-foreground">
              Failed to load product details
            </p>
          </div>
        </div>
      </RFlex>
    );
  }

  const product = productData.data;

  return (
    <RFlex className="flex-col h-full pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <h1 className="text-xl font-semibold text-foreground">
          Product Details
        </h1>
      </div>

             {/* Product Content */}
       <div className="flex-1 overflow-y-auto">
         <div className="p-4 md:p-6 pb-20 md:pb-6">
          {/* Product Images */}
          <div className="mb-6">
            {/* Main Image Swiper */}
            <div className="aspect-square rounded-lg overflow-hidden mb-4">
              <Swiper
                ref={swiperRef}
                onSlideChange={handleSlideChange}
                modules={[Navigation, Pagination, Autoplay]}
                navigation={true}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                className="h-full [&_.swiper-button-next]:text-primary [&_.swiper-button-prev]:text-primary [&_.swiper-pagination-bullet]:bg-primary [&_.swiper-pagination-bullet-active]:bg-primary [&_.swiper-button-next]:!w-4 [&_.swiper-button-prev]:!w-4 [&_.swiper-button-next]:!h-4 [&_.swiper-button-prev]:!h-4 [&_.swiper-button-next]:!min-w-4 [&_.swiper-button-prev]:!min-w-4 [&_.swiper-button-next]:!min-h-4 [&_.swiper-button-prev]:!min-h-4 [&_.swiper-button-next::after]:!text-sm [&_.swiper-button-prev::after]:!text-sm [&_.swiper-button-next::after]:!text-[15px] [&_.swiper-button-prev::after]:!text-[15px]"
                style={
                  {
                    "--swiper-navigation-color": "var(--primary)",
                    "--swiper-pagination-color": "var(--primary)",
                  } as React.CSSProperties
                }
              >
                {product.media_info.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full h-full">
                      <img
                        src={image}
                        alt={`${product.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {product.media_info.images.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Active indicator */}
                  {selectedImageIndex === index && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              {product.title}
            </h2>

            {/* Store Info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <i className={icons.store} />
              <span>{product.store_info.store_name}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <i className={icons.star} />
                <span>{product.store_info.item_as_described_rating}</span>
              </div>
            </div>

            {/* Price and Stock */}
            {selectedSku ? (
              <div>
                <div className="text-2xl font-bold text-primary">
                  ${parseFloat(selectedSku.price).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Selected variant: {selectedSku.sku_attr}
                </div>
              </div>
            ) : (
              <div className="text-lg text-muted-foreground">
                Please select a variant
              </div>
            )}

            {/* Variants */}
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">
                Available Variants
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[product.sku_info].flat().map((sku) => (
                  <motion.button
                    key={sku.sku_id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      setSelectedSku({
                        sku_id: sku.sku_id,
                        sku_attr: sku.sku_attr,
                        price: sku.offer_sale_price,
                      })
                    }
                    className={`p-3 rounded-lg border text-sm ${
                      selectedSku?.sku_id === sku.sku_id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {sku.sku_attr}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Quantity</h3>
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-50"
                >
                  <i className={icons.remove} />
                </motion.button>
                <span className="font-medium text-foreground">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-50"
                >
                  <i className={icons.add} />
                </motion.button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!selectedSku || addToCartMutation.isPending}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg mt-6 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {addToCartMutation.isPending ? (
                <>
                  <i className={`${icons.spinner} animate-spin`} />
                  Adding to Cart...
                </>
              ) : (
                <>
                  <i className={icons.cart} />
                  Add to Cart
                </>
              )}
            </motion.button>

            {/* Product Details */}
            <div className="space-y-4 mt-8">
              <h3 className="font-medium text-foreground">Product Details</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Sales</span>
                  <span>{product.sales_count}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Package Weight</span>
                  <span>{product.package_info.gross_weight}kg</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span>Package Dimensions</span>
                  <span>
                    {product.package_info.package_length}x
                    {product.package_info.package_width}x
                    {product.package_info.package_height}cm
                  </span>
                </div>
              </div>
            </div>

            {/* Store Ratings */}
            <div className="space-y-4 mt-8">
              <h3 className="font-medium text-foreground">Store Ratings</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Item as Described
                  </span>
                  <div className="flex items-center gap-1">
                    <i className={`${icons.star} text-yellow-400`} />
                    <span className="text-sm font-medium">
                      {product.store_info.item_as_described_rating}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Communication
                  </span>
                  <div className="flex items-center gap-1">
                    <i className={`${icons.star} text-yellow-400`} />
                    <span className="text-sm font-medium">
                      {product.store_info.communication_rating}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Shipping Speed
                  </span>
                  <div className="flex items-center gap-1">
                    <i className={`${icons.star} text-yellow-400`} />
                    <span className="text-sm font-medium">
                      {product.store_info.shipping_speed_rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RFlex>
  );
};

export default ProductDetails;
