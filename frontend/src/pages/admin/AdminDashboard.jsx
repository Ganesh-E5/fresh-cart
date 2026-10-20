import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import { getAllOrders } from "../../api/orderApi";
import { getAllProducts } from "../../api/productApi";
import { getAllProductVariants } from "../../api/productVariantApi";
import { getAllCategories } from "../../api/categoryApi";
import { getAllUsers } from "../../api/userApi";
import { 
    Package, 
    Layers, 
    FolderTree, 
    Users, 
    ShoppingBag, 
    AlertTriangle, 
    TrendingUp, 
    IndianRupee,
    ArrowUpRight
} from "lucide-react";

function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalVariants: 0,
        totalCategories: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrdersCount: 0,
        completedOrdersCount: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockVariants, setLowStockVariants] = useState([]);
    const [topCategories, setTopCategories] = useState([]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [ordersRes, productsRes, variantsRes, categoriesRes, usersRes] =
                await Promise.allSettled([
                    getAllOrders(), 
                    getAllProducts({ limit: 1 }),
                    getAllProductVariants({ limit: 100 }), 
                    getAllCategories(),
                    getAllUsers({ limit: 1 }),
                ]);

            const totalProducts = productsRes.status === "fulfilled" ? (productsRes.value?.pagination?.totalProducts || 0) : 0;
            const totalCategories = categoriesRes.status === "fulfilled" ? (categoriesRes.value?.categories?.length || 0) : 0;
            const totalUsers = usersRes.status === "fulfilled" ? (usersRes.value?.pagination?.totalUsers || 0) : 0;

            let totalVariants = 0;
            let lowStock = [];
            if (variantsRes.status === "fulfilled") {
                const varData = variantsRes.value;
                totalVariants = varData?.pagination?.totalDocuments || 0;
                const fetchedVariants = varData?.products || varData?.variants || [];
                lowStock = fetchedVariants.filter((v) => typeof v.qty === "number" && v.qty <= 60).slice(0, 5);
            }

            let ordersList = [];
            let totalRev = 0;
            let pendingCount = 0;
            let completedCount = 0;

            if (ordersRes.status === "fulfilled" && ordersRes.value) {
                ordersList = ordersRes.value.orders || ordersRes.value.data || (Array.isArray(ordersRes.value) ? ordersRes.value : []);
                
                ordersList.forEach((order) => {
                    const amount = order.amt ;
                    totalRev += Number(amount);
                    if (order.status === "Delivered" || order.status === "completed") {
                        completedCount++;
                    } else if (order.status !== "Cancelled" || order.status === "processing") {
                        pendingCount++;
                    }
                });
            }

            const rawCategories = categoriesRes.status === "fulfilled" ? (categoriesRes.value?.categories || []) : [];

            setStats({
                totalProducts,
                totalVariants,
                totalCategories,
                totalUsers,
                totalOrders: ordersList.length,
                totalRevenue: totalRev,
                pendingOrdersCount: pendingCount,
                completedOrdersCount: completedCount,
            });

            setRecentOrders(ordersList.slice(0, 5));
            setLowStockVariants(lowStock);
            setTopCategories(rawCategories.slice(0, 6));

        } catch (error) {
            console.error("Failed to compile dashboard metrics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-120 flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time overview of store inventory, orders, and users.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1 flex items-center">
                            <IndianRupee size={20} className="mr-0.5" />
                            {stats.totalRevenue.toLocaleString("en-IN")}
                        </h3>
                        <p className="text-xs text-emerald-600 mt-2 flex items-center font-medium">
                            <TrendingUp size={14} className="mr-1" /> Gross Store Earnings
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <IndianRupee size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.totalOrders}</h3>
                        <p className="text-xs text-slate-500 mt-2 font-medium">
                            <span className="text-amber-600 font-semibold">{stats.pendingOrdersCount} Pending</span> • {stats.completedOrdersCount} Delivered
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        <ShoppingBag size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Catalog Items</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.totalProducts}</h3>
                        <p className="text-xs text-slate-500 mt-2 font-medium">
                            Across <span className="font-semibold text-slate-700">{stats.totalVariants} Variants</span>
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                        <Package size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Users</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.totalUsers}</h3>
                        <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center">
                            <ArrowUpRight size={14} className="mr-0.5" /> Active Registered Accounts
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                            <ShoppingBag size={18} className="text-blue-600" /> Recent Orders
                        </h2>
                        <span className="text-xs font-medium text-slate-500">Showing last {recentOrders.length}</span>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        {recentOrders.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                No orders recorded yet.
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-5 py-3">Order ID</th>
                                        <th className="px-5 py-3">Customer</th>
                                        <th className="px-5 py-3">Amount</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                    {recentOrders.map((order, idx) => (
                                        <tr key={order._id || idx} className="hover:bg-slate-50 transition">
                                            <td className="px-5 py-3.5 font-mono text-xs font-medium text-slate-800">
                                                #{order._id ? order._id.slice(-6).toUpperCase() : `ORD-${idx + 1}`}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {order.user?.username || order.shippingAddress?.name || "Customer"}
                                            </td>
                                            <td className="px-5 py-3.5 font-medium text-slate-900">
                                                ₹{(order.amt).toLocaleString("en-IN")}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                    order.status === "delivered" 
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : order.status === "cancelled"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-amber-100 text-amber-800"
                                                }`}>
                                                    {order.status || "pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-amber-50/50 rounded-t-xl">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-600" /> Low Stock Variants
                        </h2>
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                            {lowStockVariants.length} Items
                        </span>
                    </div>

                    <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
                        {lowStockVariants.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-6">All variant stock levels are healthy.</p>
                        ) : (
                            lowStockVariants.map((item) => (
                                <div key={item._id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {item.img_url ? (
                                            <img src={item.img_url} alt={item.sku} className="h-10 w-10 rounded object-cover border border-slate-200 shrink-0" />
                                        ) : (
                                            <div className="h-10 w-10 rounded bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                                <Package size={18} />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-slate-800 truncate">
                                                {item.product_id?.name || item.sku}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                SKU: {item.sku} • {item.unit || item.size || ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 pl-2">
                                        <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-700 font-bold text-xs">
                                            {item.qty} left
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                        <FolderTree size={18} className="text-purple-600" /> Active Categories Overview
                    </h2>
                    <span className="text-xs font-medium text-slate-500">{stats.totalCategories} Categories Total</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {topCategories.map((cat) => (
                        <div key={cat._id} className="flex flex-col items-center p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-slate-300 transition text-center">
                            {cat.img_url ? (
                                <img src={cat.img_url} alt={cat.name} className="h-12 w-12 rounded-full object-cover border border-slate-200 mb-2" />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg mb-2">
                                    {cat.name?.charAt(0)}
                                </div>
                            )}
                            <span className="text-xs font-medium text-slate-700 truncate w-full">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;