import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProductVariants } from "../api/productVariantApi";
import Loader from "../components/common/Loader";
import AddToCartButton from "../components/cart/AddToCartButton";

const LIMIT = 20;

function ProductListing() {
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("category_id") || undefined;
    const search = searchParams.get("search") || undefined;

    const [variants, setVariants] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

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

                setVariants((prev) =>
                    page === 1 ? res.products : [...prev, ...res.products]
                );
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

    const lastElementObserver = useCallback(
        (node) => {
            if (initialLoading || loadingMore) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observerRef.current.observe(node);
        },
        [initialLoading, loadingMore, hasMore]
    );

    return (
        <div className="px-3 md:px-6 py-4">
            <h1 className="text-xl font-semibold mb-4">
                {search ? `Results for "${search}"` : "Products"}
            </h1>

            {initialLoading ? (
                <Loader />
            ) : variants.length === 0 ? (
                <p className="text-slate-500 text-sm">No products found.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {variants.map((variant, index) => {
                        const isLast = index === variants.length - 1;
                        return (
                            <div
                                key={variant._id}
                                ref={isLast ? lastElementObserver : null}
                                className="rounded-xl border border-gray-200 bg-white p-3 flex flex-col"
                            >
                                <img
                                    src={variant.img_url}
                                    alt={variant.product_id?.name}
                                    className="w-full aspect-square object-cover rounded-lg mb-2"
                                />
                                <p className="text-sm font-medium truncate">{variant.product_id?.name}</p>
                                <p className="text-xs text-gray-500">{variant.unit || variant.size}</p>
                                <p className="font-bold text-sm mt-1 mb-2">₹{variant.sp}</p>
                                <AddToCartButton variant={variant} />
                            </div>
                        );
                    })}
                </div>
            )}

            {loadingMore && (
                <div className="flex justify-center py-6">
                    <Loader />
                </div>
            )}

            {!hasMore && variants.length > 0 && (
                <p className="text-center text-xs text-slate-400 py-6">
                    You've reached the end
                </p>
            )}
        </div>
    );
}

export default ProductListing;