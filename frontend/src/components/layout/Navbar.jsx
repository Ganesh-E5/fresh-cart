import { BellIcon, MapPin, Search, ShoppingCart, User2Icon } from "lucide-react";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const { user } = useAuth();
    const { items } = useCart();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const productCount = items ? items.length : 0;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();
        if (!trimmed) return;
        navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    };

    return (
        <div className="bg-[#F8F6EF] border-b border-slate-200/60 sticky top-0 z-50 px-3 py-2.5 md:px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-6">
                <img
                    src="/images/logo.png"
                    alt="Company logo"
                    className="w-24 md:w-36 shrink-0 cursor-pointer object-contain"
                    onClick={() => navigate("/")}
                />

                <form
                    onSubmit={handleSearchSubmit}
                    className="hidden md:flex h-11 flex-1 max-w-xl items-center rounded-xl border border-slate-200 bg-white px-3.5 shadow-sm transition-all duration-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100"
                >
                    <label htmlFor="search-desktop" className="cursor-pointer">
                        <Search size={18} className="text-slate-400" />
                    </label>
                    <input
                        id="search-desktop"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for fresh fruits, vegetables, groceries..."
                        className="ml-2.5 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none min-w-0"
                    />
                </form>

                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <button
                        type="button"
                        className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition p-1.5 rounded-lg hover:bg-slate-100/60"
                        onClick={() => navigate(user ? "/profile" : "/login")}
                    >
                        <User2Icon size={20} className="shrink-0" />
                        {user ? (
                            <span className="hidden sm:inline font-medium text-xs md:text-sm truncate max-w-[100px]">
                                {user.username}
                            </span>
                        ) : (
                            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                                Sign in
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        aria-label="Notifications"
                        className="text-slate-700 hover:text-emerald-600 transition p-1.5 rounded-lg hover:bg-slate-100/60 shrink-0"
                        onClick={() => navigate("/notifications")}
                    >
                        <BellIcon size={20} />
                    </button>

                    <button
                        type="button"
                        aria-label="Cart"
                        className="relative flex items-center gap-2 bg-emerald-600 text-white px-3.5 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-sm shrink-0"
                        onClick={() => navigate("/cart")}
                    >
                        <ShoppingCart size={18} />
                        <span className="hidden sm:inline text-xs font-bold">Cart</span>
                        {productCount > 0 && (
                            <span className="bg-white text-emerald-700 text-xs font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center border border-emerald-200">
                                {productCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex md:hidden items-center gap-2 mt-2.5">
                <div className="flex h-10 flex-1 items-center rounded-xl border border-slate-200 bg-white px-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 min-w-0">
                    <label htmlFor="search-mobile">
                        <Search size={18} className="text-slate-400 shrink-0" />
                    </label>
                    <input
                        id="search-mobile"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="ml-2 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none min-w-0"
                    />
                </div>
            </form>
        </div>
    );
}

export default Navbar;