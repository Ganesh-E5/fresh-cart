import { NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
    `relative block px-8 py-3 transition-colors ${isActive ? "text-white" : "text-slate-300 hover:bg-slate-700"
    }`;

const navItems = [
    { to: "/admin", label: "Dashboard", end: true },
    { to: "/admin/categories", label: "Categories" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/product-variants", label: "Product Variants" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/users", label: "Users" },
];

function AdminSidebar() {
    return (
        <div className="flex flex-col justify-between gap-1 min-h-screen min-w-1/4 bg-slate-800 text-slate-300">
            <div className="flex flex-col">
                {navItems.map(({ to, label, end }) => (
                    <div key={to}>
                        <NavLink to={to} end={end} className={navLinkClass}>
                            {({ isActive }) => (
                                <>
                                    {label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-4 right-4 h-[4px] bg-emerald-500 rounded-full" />
                                    )}
                                </>
                            )}
                        </NavLink>
                        <div className="h-px bg-slate-500 mx-4" />
                    </div>
                ))}
            </div>

            <div className="bg-red-500 px-4 py-3 hover:cursor-pointer">Logout</div>
        </div>
    );
}

export default AdminSidebar;