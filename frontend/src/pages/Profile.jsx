import {
    Bell,
    ChevronRight,
    LogOut,
    MapPin,
    Package,
    ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function MenuRow({ icon: Icon, label, description, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex items-center justify-between gap-3 w-full text-left rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-300 hover:shadow-sm transition"
        >
            <span className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Icon size={20} />
                </span>
                <span className="min-w-0">
                    <span className="block font-semibold text-slate-800">{label}</span>
                    {description && (
                        <span className="block text-xs text-slate-500 truncate">{description}</span>
                    )}
                </span>
            </span>
            <ChevronRight size={18} className="text-slate-400 shrink-0" />
        </button>
    );
}

function Profile() {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
        } finally {
            navigate("/login", { replace: true });
        }
    };

    if (!user) return null; 

    const initial = (user.username || "?").charAt(0).toUpperCase();

    return (
        <div className="px-3 md:px-8 py-6 bg-[#FFFDF8] min-h-screen max-w-2xl mx-auto">
            <h1 className="text-xl font-bold text-slate-900 mb-5 px-1">My Account</h1>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-5 flex items-center gap-4">
                <div className="w-16 h-16 shrink-0 rounded-full bg-emerald-600 text-white text-2xl font-bold flex items-center justify-center">
                    {initial}
                </div>
                <div className="min-w-0">
                    <p className="text-lg font-bold text-slate-900 truncate">{user.username}</p>
                    {user.email && (
                        <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    )}
                    {user.phone && (
                        <p className="text-sm text-slate-500">{user.phone}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <MenuRow
                    icon={Package}
                    label="My Orders"
                    description="Track, view and review your orders"
                    onClick={() => navigate("/orders")}
                />
                <MenuRow
                    icon={MapPin}
                    label="Saved Addresses"
                    description={
                        user.addresses?.length
                            ? `${user.addresses.length} saved`
                            : "Add a delivery address"
                    }
                    onClick={() => navigate("/profile/addresses")}
                />
                <MenuRow
                    icon={ShoppingCart}
                    label="My Cart"
                    description="Items waiting for checkout"
                    onClick={() => navigate("/cart")}
                />
                <MenuRow
                    icon={Bell}
                    label="Notifications"
                    onClick={() => navigate("/notifications")}
                />
            </div>

            <button
                type="button"
                onClick={handleLogout}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white text-red-600 font-semibold py-3 hover:bg-red-50 transition"
            >
                <LogOut size={18} />
                Log out
            </button>
        </div>
    );
}

export default Profile;