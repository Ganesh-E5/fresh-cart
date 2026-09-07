import { Fragment } from "react";
import { NavLink } from "react-router-dom";
function AdminSidebar() {
    const navItems = [
        { to: "/admin", label: "Dashboard", end: true },
        { to: "/admin/categories", label: "Categories" },
        { to: "/admin/products", label: "Products" },
        { to: "/admin/product-variants", label: "Product variants" },
        { to: "/admin/orders", label: "Orders" },
        { to: "/admin/users", label: "Admins" }
    ]
    const navlinkStyle = ({ isActive }) =>
        `px-8 py-3 transition-colors  ${isActive
            ? "bg-emerald-500 text-white"
            : "text-slate-300 hover:bg-slate-700"
        }`;
    return (
        <>
            <div className="flex flex-col  justify-between gap-1 min-h-screen min-w-1/4 bg-slate-800 text-slate-300">
                <div className="flex flex-col">
                    {navItems.map(({ to, label, end }) => (
                        <Fragment key={to}>
                            <NavLink to={to} end={end} className={navlinkStyle}>{label}</NavLink>
                            <div className="h-px bg-slate-500 mx-2"></div>
                        </Fragment>
                    ))}
                </div>

                <div className="bg-red-500 px-4 py-3 hover:cursor-pointer ">Logout</div>
            </div>
        </>
    )
}

export default AdminSidebar;



