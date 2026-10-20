import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../api/categoryApi";
import { getAllProductVariants } from "../api/productVariantApi";
import AddToCartButton from "../components/cart/AddToCartButton";
import Loader from "../components/common/Loader";

function CategoryCard({ category }) {
    const navigate = useNavigate();
    return (
        <button
            type="button"
            onClick={() => navigate(`/products?category_id=${category._id}`)}
            className="flex flex-col items-center gap-2 shrink-0 snap-start hover:cursor-pointer group w-16 md:w-20"
        >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden group-hover:border-emerald-500 transition-colors shadow-sm">
                <img
                    src={category.img_url}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                />
            </div>
            <span className="text-xs md:text-sm font-medium text-slate-700 text-center leading-tight line-clamp-2 h-8 md:h-9">
                {category.name}
            </span>
        </button>
    );
}

function ProductCard({ variant }) {
    const navigate = useNavigate();

    const discount =
        variant.mrp && variant.sp
            ? Math.round(((variant.mrp - variant.sp) / variant.mrp) * 100)
            : 0;

    return (
        <div
            onClick={() => navigate(`/products/info?product_id=${variant._id}`)}
            className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3.5 hover:shadow-lg hover:border-emerald-300 hover:cursor-pointer transition-all h-full"
        >
            {discount > 0 && (
                <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                    {discount}% OFF
                </span>
            )}

            <div>
                <div className="w-full h-32 sm:h-36 flex items-center justify-center bg-slate-50 rounded-xl mb-3 p-2 border border-slate-100">
                    <img
                        src={variant.img_url}
                        alt={variant.product_id?.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-200"
                    />
                </div>

                {variant.product_id?.brand && (
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
                        {variant.product_id.brand}
                    </span>
                )}

                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug min-h-[2.5rem]">
                    {variant.product_id?.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1 font-medium">
                    {variant.unit || variant.size}
                </p>
            </div>

            <div className="mt-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-base text-slate-900">₹{variant.sp}</span>
                        {variant.mrp > variant.sp && (
                            <span className="text-xs text-slate-400 line-through">₹{variant.mrp}</span>
                        )}
                    </div>
                    {variant.rating > 0 && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md">
                            <Star size={12} fill="#facc15" color="#facc15" />
                            {variant.rating}
                        </span>
                    )}
                </div>

                <div className="w-full" onClick={(e) => e.stopPropagation()}>
                    <AddToCartButton variant={variant} />
                </div>
            </div>
        </div>
    );
}

function Section({ title, children, loading, layout = "grid" }) {
    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 px-1">{title}</h2>
            {loading ? (
                <Loader />
            ) : layout === "scroll" ? (
                <div className="flex gap-4 overflow-x-auto pb-3 px-1 snap-x snap-mandatory hover-scrollbar">
                    {children}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-1">
                    {children}
                </div>
            )}
        </div>
    );
}

function Home() {
    const [categories, setCategories] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingTopRated, setLoadingTopRated] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                setCategories(res.categories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        };

        const fetchTopRated = async () => {
            try {
                const res = await getAllProductVariants({
                    sortBy: "rating",
                    order: "desc",
                    limit: 10,
                });
                setTopRated(res.products);
            } catch (error) {
                console.error("Failed to fetch top rated products:", error);
            } finally {
                setLoadingTopRated(false);
            }
        };

        fetchCategories();
        fetchTopRated();
    }, []);

    return (
        <div className="px-3 md:px-8 py-6 bg-[#FFFDF8] min-h-screen max-w-7xl mx-auto">
            <Section title="Shop by Category" loading={loadingCategories} layout="scroll">
                {categories.map((cat) => (
                    <CategoryCard key={cat._id} category={cat} />
                ))}
            </Section>

            {!loadingTopRated && topRated.length > 0 && (
                <Section title="Top Rated Products">
                    {topRated.map((variant) => (
                        <ProductCard key={variant._id} variant={variant} />
                    ))}
                </Section>
            )}
        </div>
    );
}

export default Home;