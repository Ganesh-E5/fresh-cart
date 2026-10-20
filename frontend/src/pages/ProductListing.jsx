import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { getAllProductVariants } from "../api/productVariantApi";
import Loader from "../components/common/Loader";
import AddToCartButton from "../components/cart/AddToCartButton";

const LIMIT = 20;

function ProductCard({ variant, navigate, observerRef }) {
    const discount =
        variant.mrp && variant.sp
            ? Math.round(((variant.mrp - variant.sp) / variant.mrp) * 100)
            : 0;

    return (
        <div
            ref={observerRef}
            onClick={() => navigate(`/products/info?product_id=${variant._id}`)}
            className="group relative flex flex-col w-full min-w-0 rounded-xl border border-gray-200 bg-white overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-emerald-200"
        >
            {discount > 0 && (
                <span className="absolute top-1.5 left-1.5 z-10 bg-emerald-600 text-white text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.5 rounded-full">
                    {discount}% OFF
                </span>
            )}

            <div className="aspect-square bg-gray-50 p-2 sm:p-3 flex items-center justify-center w-full min-w-0 overflow-hidden">
                <img
                    src={variant.img_url}
                    alt={variant.product_id?.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                />
            </div>

            <div className="flex flex-col flex-1 p-2 sm:p-3 min-w-0">
                {variant.product_id?.brand && (
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wide text-slate-400 font-medium mb-0.5 truncate">
                        {variant.product_id.brand}
                    </span>
                )}

                <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 leading-snug h-8 sm:h-10 overflow-hidden">
                    {variant.product_id?.name}
                </p>

                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate">{variant.unit || variant.size}</p>

                {variant.rating > 0 && (
                    <span className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-600 mt-1">
                        <Star size={11} fill="#facc15" color="#facc15" />
                        {variant.rating}
                    </span>
                )}

                <div className="flex items-baseline gap-1 mt-1.5 sm:mt-2">
                    <span className="font-bold text-xs sm:text-sm text-gray-900">₹{variant.sp}</span>
                    {variant.mrp > variant.sp && (
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">₹{variant.mrp}</span>
                    )}
                </div>

                <div className="mt-2 sm:mt-3 w-full min-w-0" onClick={(e) => e.stopPropagation()}>
                    <AddToCartButton variant={variant} />
                </div>
            </div>
        </div>
    );
}

function ProductListing() {
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("category_id") || undefined;
    const search = searchParams.get("search") || undefined;
    const navigate = useNavigate();

    const [variants, setVariants] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const observer = useRef(null);

    useEffect(() => {
        setVariants([]);
        setPage(1);
        setHasMore(true);
        setInitialLoading(true);
    }, [categoryId, search]);

    useEffect(() => {
        let cancelled = false;

        const fetchVariants = async () => {
            if (page === 1) setInitialLoading(true);
            else setLoadingMore(true);

            try {
                const res = await getAllProductVariants({
                    category_id: categoryId,
                    search,
                    page,
                    limit: LIMIT,
                });

                if (cancelled) return;

                setVariants((prev) => (page === 1 ? res.products : [...prev, ...res.products]));
                setHasMore(page < res.pagination.totalPages);
            } catch (error) {
                console.error(error);
            } finally {
                if (!cancelled) {
                    setInitialLoading(false);
                    setLoadingMore(false);
                }
            }
        };

        fetchVariants();
        return () => { cancelled = true; };
    }, [categoryId, search, page]);

    const lastElementRef = useCallback(
        (node) => {
            if (initialLoading || loadingMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [initialLoading, loadingMore, hasMore]
    );

    return (
        <div className="w-full max-w-full px-2 sm:px-6 py-4 sm:py-6 box-border overflow-x-hidden">
            <h1 className="text-base sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-5 px-1">
                {search ? `Results for "${search}"` : "All Products"}
            </h1>

            {initialLoading ? (
                <Loader />
            ) : variants.length === 0 ? (
                <p className="text-slate-500 text-sm px-1">We're adding products to this category soon.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 w-full box-border min-w-0">
                    {variants.map((variant, index) => (
                        <ProductCard
                            key={variant._id}
                            variant={variant}
                            navigate={navigate}
                            observerRef={index === variants.length - 1 ? lastElementRef : null}
                        />
                    ))}
                </div>
            )}

            {loadingMore && (
                <div className="flex justify-center py-6">
                    <Loader />
                </div>
            )}

            {!hasMore && variants.length > 0 && (
                <p className="text-center text-xs text-slate-400 py-6">You've reached the end</p>
            )}
        </div>
    );
}

export default ProductListing;