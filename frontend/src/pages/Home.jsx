import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../api/categoryApi";

const topRatedProducts = [
    { id: 1, name: "Fresh Bananas", image: "/images/products/banana.png", price: 40, rating: 4.6, unit: "1 dozen" },
    { id: 2, name: "Organic Tomatoes", image: "/images/products/tomato.png", price: 30, rating: 4.5, unit: "500g" },
    { id: 3, name: "Amul Milk", image: "/images/products/milk.png", price: 28, rating: 4.8, unit: "500ml" },
    { id: 4, name: "Brown Bread", image: "/images/products/bread.png", price: 45, rating: 4.4, unit: "400g" },
];

function CategoryCard({ category }) {
    const navigate = useNavigate();
    return (
        <button
            type="button"
            // BUG FIX: category.id doesn't exist on a MongoDB document — it's category._id
            onClick={() => navigate(`/products?category_id=${category._id}`)}
            className="flex flex-col items-center gap-2 shrink-0 snap-start hover:cursor-pointer group w-16 md:w-20"
        >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden group-hover:border-green-500 transition-colors">
                <img
                    src={category.img_url}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                />
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-700 text-center leading-tight line-clamp-2 h-8 md:h-9">
                {category.name}
            </span>
        </button>
    );
}

function ProductCard({ product }) {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex flex-col shrink-0 snap-start w-36 md:w-44 rounded-xl border border-gray-200 bg-white p-3 hover:shadow-md hover:cursor-pointer transition-shadow"
        >
            <div className="w-full h-24 md:h-28 flex items-center justify-center bg-gray-50 rounded-lg mb-2">
                <img src={product.image} alt={product.name} loading="lazy" className="max-h-full max-w-full object-contain" />
            </div>
            <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
            <p className="text-xs text-gray-500">{product.unit}</p>
            <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-sm">₹{product.price}</span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                    <Star size={12} fill="#facc15" color="#facc15" />
                    {product.rating}
                </span>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3 px-1">{title}</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x snap-mandatory hover-scrollbar">
                {children}
            </div>
        </div>
    );
}

function Home() {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const res = await getAllCategories();
            setCategories(res.categories);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="px-3 md:px-6 py-4 bg-[#FFFDF8] min-h-screen">
            <Section title="Shop by Category">
                {categories.map((cat) => (
                    // BUG FIX: was cat.id (undefined) — Mongo documents use _id
                    <CategoryCard key={cat._id} category={cat} />
                ))}
            </Section>

            <Section title="Top Rated">
                {topRatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </Section>
        </div>
    );
}

export default Home;