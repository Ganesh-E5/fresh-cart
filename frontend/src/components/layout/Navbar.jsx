import { BellIcon, LocationEdit, Search, ShoppingCart, User2Icon } from "lucide-react"
import { useState } from "react";
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom";

function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cartCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmed = searchTerm.trim();
        if (!trimmed) return;
        navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    };

    return (
        <div className="bg-[#F8F6EF] px-3 py-2 md:px-4">
            <div className="flex items-center justify-between gap-2 md:gap-4">
                <img src="/images/logo.png" alt="Company logo" className="w-24 md:w-40 shrink-0" />

                <button
                    type="button"
                    className="hidden md:flex items-center gap-2 hover:cursor-pointer shrink-0"
                >
                    <LocationEdit size={20} color="green" />
                    <div className="flex flex-col text-left">
                        <p className="font-extralight text-gray-600 text-xs">Delivering to,</p>
                        <span className="font-bold">Hyderabad 500001</span>
                    </div>
                </button>

                <form
                    onSubmit={handleSearchSubmit}
                    className="hidden md:flex h-11 flex-1 items-center rounded-xl border border-gray-300 bg-white px-3 transition-all duration-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100"
                >
                    <label htmlFor="search-desktop">
                        <Search size={20} className="text-gray-500" />
                    </label>
                    <input
                        id="search-desktop"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for fruits, vegetables..."
                        className="ml-3 flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none min-w-0"
                    />
                </form>

                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    <button
                        type="button"
                        className="flex items-center gap-2 hover:cursor-pointer min-w-0"
                        onClick={() => navigate(user ? "/profile" : "/login")}
                    >
                        <User2Icon size={20} className="shrink-0" />
                        {user ? (
                            <p className="hidden sm:block truncate max-w-[100px]">{user.username}</p>
                        ) : (
                            <p className="text-xs sm:text-sm whitespace-nowrap">Sign in</p>
                        )}
                    </button>

                    <button
                        type="button"
                        aria-label="Notifications"
                        className="hover:cursor-pointer shrink-0"
                        onClick={() => navigate("/notifications")}
                    >
                        <BellIcon size={20} />
                    </button>

                    <button
                        type="button"
                        aria-label="Cart"
                        className="relative hover:cursor-pointer shrink-0"
                        onClick={() => navigate("/cart")}
                    >
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex md:hidden items-center gap-2 mt-2">
                <div className="flex h-10 flex-1 items-center rounded-xl border border-gray-300 bg-white px-3 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 min-w-0">
                    <label htmlFor="search-mobile">
                        <Search size={18} className="text-gray-500 shrink-0" />
                    </label>
                    <input
                        id="search-mobile"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="ml-2 flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none min-w-0"
                    />
                </div>
                <button type="button" aria-label="Change location" className="shrink-0">
                    <LocationEdit size={20} color="green" />
                </button>
            </form>
        </div>
    )
}

export default Navbar