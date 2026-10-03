import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react"
import Navbar from "./Navbar";
export const AuthLayout = () => {
    return (
        <>
            <Outlet />
        </>
    )
}

export const MainLayout = () => {
    return (
        <>
        <div className="relative">
            <div className="sticky top-0 z-50">
            <Navbar />
            </div>
            <Outlet />
        </div>
        </>
    )
}
export const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen">
            <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-800 text-white">
                <span className="font-semibold">Fresh-Cart Admin</span>
                <button onClick={() => setSidebarOpen(true)}>
                    <Menu size={24} />
                </button>
            </div>

            <div
                className={`
                    fixed md:static inset-y-0 left-0 z-50
                    w-64 max-w-[80vw] md:w-64 md:max-w-none
                    transform transition-transform duration-300
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
                `}
            >
                <AdminSidebar onClose={() => setSidebarOpen(false)} />

                <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden absolute top-4 right-4 text-slate-300 hover:text-white"
                >
                    <X size={22} />
                </button>
            </div>

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 min-w-0 bg-slate-100 p-6 pt-20 md:pt-6 overflow-x-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;