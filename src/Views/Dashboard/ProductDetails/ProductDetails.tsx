import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { icons } from "@/Constants/icons";
import { Button } from "@/components/ui/button";
import { useGetProductDetails } from "@/Api/queriesAndMutations";

const ProductDetails = () => {
  const { productId } = useParams();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  
  const { data, isLoading, isError } = useGetProductDetails(productId!);
  const product = data?.data;

  // Set initial selected image when data is loaded
  if (product && !selectedImage && product.media_info.images.length > 0) {
    setSelectedImage(product.media_info.images[0]);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-primary">
          <i className={`${icons.spinner} text-3xl`} />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <i className={`${icons.error} text-4xl text-destructive`} />
        <h2 className="text-xl font-semibold">Product Not Found</h2>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      const newQuantity = increment ? prev + 1 : prev - 1;
      return Math.max(1, Math.min(newQuantity, product.sku_info.sku_available_stock));
    });
  };

  return (
    <div className="flex flex-col h-full overflow-auto pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images Section */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-lg overflow-hidden bg-muted"
            >
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {product.media_info.images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    selectedImage === image ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{product.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <i className={`${icons.location} text-muted-foreground`} />
                  <span className="text-sm text-muted-foreground">{product.store_info.store_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className={`${icons.shoppingBag} text-muted-foreground`} />
                  <span className="text-sm text-muted-foreground">{product.sales_count} sold</span>
                </div>
              </div>
            </div>

            {/* Price and Stock */}
            <div className="space-y-4 py-4 border-y border-border">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {product.sku_info.currency_code} {parseFloat(product.sku_info.offer_sale_price).toFixed(2)}
                </span>
                {product.sku_info.price_include_tax && (
                  <span className="text-xs text-muted-foreground">(Tax included)</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <i className={`${icons.orders} text-muted-foreground`} />
                <span className="text-sm">
                  {product.sku_info.sku_available_stock > 0
                    ? `${product.sku_info.sku_available_stock} units available`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Store Ratings */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-sm font-medium">Description</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-primary">{product.store_info.item_as_described_rating}</span>
                  <i className={`${icons.star} text-yellow-400`} />
                </div>
              </div>
              <div className="text-center border-x border-border">
                <div className="text-sm font-medium">Communication</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-primary">{product.store_info.communication_rating}</span>
                  <i className={`${icons.star} text-yellow-400`} />
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">Shipping</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-primary">{product.store_info.shipping_speed_rating}</span>
                  <i className={`${icons.star} text-yellow-400`} />
                </div>
              </div>
            </div>

            {/* Quantity Selector and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(false)}
                    disabled={quantity <= 1}
                  >
                    <i className={icons.remove} />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(true)}
                    disabled={quantity >= product.sku_info.sku_available_stock}
                  >
                    <i className={icons.add} />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1" size="lg">
                  <i className={icons.cart} />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <i className={icons.heart} />
                  Add to Wishlist
                </Button>
              </div>
            </div>

            {/* Package Information */}
            <div className="space-y-2 pt-4 border-t border-border">
              <h3 className="font-medium">Package Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <i className={`${icons.orders} text-muted-foreground`} />
                  <span>
                    {product.package_info.package_length} × {product.package_info.package_width} × {product.package_info.package_height} cm
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className={`${icons.truck} text-muted-foreground`} />
                  <span>{product.package_info.gross_weight} kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 