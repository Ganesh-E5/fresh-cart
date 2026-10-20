import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getProductVariantById,
  getAllProductVariants,
} from "../api/productVariantApi";
import AddToCartButton from "../components/cart/AddToCartButton";

function ProductDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productId = searchParams.get("product_id");

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRelatedLoading, setIsRelatedLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setError("No product ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getProductVariantById(productId);
        setProduct(res.product);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  useEffect(() => {
    const categoryId = product?.product_id?.category_id?._id;
    if (!categoryId) return;

    const fetchRelated = async () => {
      setIsRelatedLoading(true);
      try {
        const res = await getAllProductVariants({
          category_id: categoryId,
          page: 1,
          limit: 10,
        });

        const filtered = (res.products || []).filter(
          (item) => item._id !== product._id
        );
        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Error fetching related products:", err);
      } finally {
        setIsRelatedLoading(false);
      }
    };

    fetchRelated();
  }, [product]);

  const discount =
    product?.mrp && product?.sp && product.mrp > product.sp
      ? Math.round(((product.mrp - product.sp) / product.mrp) * 100)
      : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {error || "Product not found."}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border shadow-sm p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-gray-50 rounded-xl flex items-center justify-center p-8">
          <img
            src={product.img_url}
            alt={product.product_id?.name || "Product Image"}
            className="max-h-[450px] w-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
            {product.product_id?.name}
          </h1>

          <p className="text-gray-500 mt-4 leading-7">
            {product.product_id?.description}
          </p>

          <div className="flex items-center gap-4 mt-8">
            <span className="text-4xl font-bold text-green-700">
              ₹{product.sp}
            </span>

            {product.mrp && product.mrp > product.sp && (
              <span className="text-lg line-through text-gray-400">
                ₹{product.mrp}
              </span>
            )}

            {discount > 0 && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium flex items-center gap-1">
              <span>⭐</span> {product.rating || 0}
            </span>
            <span className="text-gray-500 text-sm">Customer Rating</span>
          </div>

          <div className="mt-8 bg-gray-50 rounded-xl p-5 border">
            <h3 className="font-semibold text-gray-800 mb-4">Product Details</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between border-b pb-2">
                <span>Size / Unit</span>
                <span className="font-medium text-gray-800">
                  {product.size || product.unit || "N/A"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>SKU</span>
                <span className="font-medium text-gray-800">
                  {product.sku || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Category</span>
                <span className="font-medium text-gray-800">
                  {product.product_id?.category_id?.name || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <AddToCartButton variant={product} />
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 pb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Related Products
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {relatedProducts.map((variant) => (
              <div
                key={variant._id}
                onClick={() => navigate(`/products/info?product_id=${variant._id}`)}
                className="bg-white border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <img
                    src={variant.img_url}
                    alt={variant.product_id?.name || "Related Product"}
                    className="w-full aspect-square object-contain bg-gray-50 p-3"
                  />

                  <div className="p-3">
                    <p className="font-medium text-sm text-gray-800 line-clamp-2 h-10">
                      {variant.product_id?.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {variant.unit || variant.size}
                    </p>

                    <div className="flex gap-2 items-center mt-2">
                      <span className="font-bold text-gray-900">
                        ₹{variant.sp}
                      </span>
                      {variant.mrp && variant.mrp > variant.sp && (
                        <span className="text-xs line-through text-gray-400">
                          ₹{variant.mrp}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="p-3 pt-0 mt-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AddToCartButton variant={variant} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;