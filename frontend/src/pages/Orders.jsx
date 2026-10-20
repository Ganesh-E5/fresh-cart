import { ChevronRight, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../api/orderApi";
import Loader from "../components/common/Loader";
import OrderStatusBadge, { formatDate, formatStatus } from "../components/orders/OrderStatusBadge";

const STATUSES = [
    "Pending_Payment", "Placed", "Confirmed", "Processing",
    "Shipped", "Out for delivery", "Delivered", "Cancelled",
];

function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalOrders: 0 });
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        const fetchOrders = async () => {
            setLoading(true);
            setError("");
            try {
                const params = { page, limit: 10, sortBy: "createdAt", order: "desc" };
                if (status) params.status = status;

                const res = await getMyOrders(params);
                if (ignore) return;
                setOrders(res.orders);
                setPagination(res.pagination);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                if (!ignore) setError("Could not load your orders. Please try again.");
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchOrders();
        return () => {
            ignore = true;
        };
    }, [page, status]);

    return (
        <div className="px-3 md:px-8 py-6 bg-[#FFFDF8] min-h-screen max-w-4xl mx-auto">
            <div className="flex items-center justify-between gap-3 mb-5 px-1">
                <h1 className="text-xl font-bold text-slate-900">My Orders</h1>
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }}
                    className="text-sm border border-slate-200 rounded-lg bg-white px-3 py-2 outline-none focus:border-emerald-500"
                >
                    <option value="">All orders</option>
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {formatStatus(s)}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <p className="text-center text-sm text-red-600 py-10">{error}</p>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
                    <Package size={48} className="text-slate-300" />
                    <p className="font-medium">No orders found</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
                    >
                        Start shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-3">
                        {orders.map((order) => (
                            <button
                                key={order._id}
                                type="button"
                                onClick={() => navigate(`/orders/${order._id}`)}
                                className="flex items-center justify-between gap-3 text-left rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-emerald-300 transition"
                            >
                                <div className="min-w-0 flex flex-col gap-1.5">
                                    <span className="text-xs text-slate-400 font-medium">
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </span>
                                    <span className="text-sm text-slate-600">{formatDate(order)}</span>
                                    <span className="text-xs text-slate-500">
                                        {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online payment"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex flex-col items-end gap-1.5">
                                        <span className="font-bold text-slate-900">₹{order.amt}</span>
                                        <OrderStatusBadge status={order.status} />
                                    </div>
                                    <ChevronRight size={18} className="text-slate-400" />
                                </div>
                            </button>
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:border-emerald-500"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-slate-600">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button
                                disabled={page >= pagination.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:border-emerald-500"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Orders;