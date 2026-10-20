import { useEffect, useState } from "react";
import { getAllOrders, getOrderById, updateOrderStatus } from "../../api/orderApi";
import AdminToolbar from "../../components/admin/AdminToolbar";
import Loader from "../../components/common/Loader";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import toast from "react-hot-toast";
import { X, MapPin, CreditCard, Package, User, Phone, RefreshCw } from "lucide-react";

const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date);
};

const STATUS_OPTIONS = [
    "Pending_Payment",
    "Placed",
    "Confirmed",
    "Processing",
    "Shipped",
    "Out for delivery",
    "Delivered",
    "Cancelled"
];

export default function AdminOrders() {
    const [search, setSearch] = useState("");
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});
    const [orderDetails, setOrderDetails] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [panelMode, setPanelMode] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchOrders = async () => {
        setFetching(true);
        try {
            const data = await getAllOrders({});
            setOrders(data?.orders || []);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong", {
                id: "orders-fetch-error"
            });
        } finally {
            setFetching(false);
        }
    };

    const fetchOrderById = async (id) => {
        setModalLoading(true);
        try {
            const data = await getOrderById(id);
            const fetchedOrder = data?.order || {};
            setOrder(fetchedOrder);
            setSelectedStatus(fetchedOrder?.status || "");
            setOrderDetails(data?.orderDetails || []);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong", {
                id: "order-fetch-error"
            });
        } finally {
            setModalLoading(false);
        }
    };

    const handleOrderById = async (id) => {
        setPanelMode(true);
        await fetchOrderById(id);
    };

    const handleStatusUpdate = async () => {
        if (!order?._id || !selectedStatus) return;

        if (selectedStatus === order.status) {
            toast.error("Status is already set to " + selectedStatus);
            return;
        }

        setUpdatingStatus(true);
        try {
            const res = await updateOrderStatus({ id: order._id, status: selectedStatus });
            const updatedOrder = res?.order || { ...order, status: selectedStatus };

            setOrder(updatedOrder);

            setOrders((prevOrders) =>
                prevOrders.map((ord) =>
                    ord._id === order._id ? { ...ord, status: selectedStatus } : ord
                )
            );

            toast.success(res?.message || "Order status updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const closePanel = () => {
        setPanelMode(false);
        setOrder({});
        setOrderDetails([]);
        setSelectedStatus("");
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((ord) => {
        const query = search.toLowerCase();
        const matchesId = ord._id?.toLowerCase().includes(query);
        const matchesName = ord.shippingAddress?.name?.toLowerCase().includes(query);
        const matchesPhone = ord.shippingAddress?.phone?.toLowerCase().includes(query);
        return matchesId || matchesName || matchesPhone;
    });

    return (
        <div className="relative">
            <h1 className="text-2xl font-semibold text-slate-800 mb-6">Orders</h1>

            <AdminToolbar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search orders by ID, customer name, or phone..."
            />

            {fetching ? (
                <div className="min-h-[50vh] flex justify-center items-center">
                    <Loader />
                </div>
            ) : filteredOrders.length === 0 ? (
                <p className="text-slate-500 text-sm mt-4">No orders found</p>
            ) : (
                <div className="w-full rounded-lg border border-slate-200 bg-white shadow-sm mt-4">
                    <div className="max-h-175 overflow-auto">
                        <table className="w-full text-left border-collapse text-sm text-slate-600">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 font-medium text-slate-700">
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Customer & Contact</th>
                                    <th className="p-4">Shipping Address</th>
                                    <th className="p-4">Payment</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredOrders.map((ord, index) => (
                                    <tr 
                                        key={ord._id || index} 
                                        className="hover:bg-slate-50 transition-colors cursor-pointer" 
                                        onClick={() => handleOrderById(ord._id)}
                                    >
                                        <td className="p-4 font-mono text-xs" title={ord._id}>
                                            <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 select-all border border-slate-200">
                                                #{ord._id ? `${ord._id.substring(0, 8)}...` : "N/A"}
                                            </span>
                                        </td>

                                        <td className="p-4 whitespace-nowrap text-slate-600 text-xs">
                                            {formatDate(ord.date || ord.createdAt)}
                                        </td>

                                        <td className="p-4">
                                            <div className="font-medium text-slate-900">
                                                {ord.shippingAddress?.name || "N/A"}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {ord.shippingAddress?.phone}
                                            </div>
                                        </td>

                                        <td className="p-4 max-w-xs text-xs line-clamp-2 hover:line-clamp-none whitespace-normal">
                                            <div>
                                                {ord.shippingAddress?.houseNo}, {ord.shippingAddress?.street}
                                            </div>
                                            {ord.shippingAddress?.landmark && (
                                                <div className="text-slate-400 italic">
                                                    Near {ord.shippingAddress.landmark}
                                                </div>
                                            )}
                                            <div className="text-slate-500">
                                                {ord.shippingAddress?.city}, {ord.shippingAddress?.state} - {ord.shippingAddress?.pincode}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="text-slate-800">{ord.paymentMethod}</div>
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                {ord.paymentStatus}
                                            </div>
                                        </td>

                                        <td className="p-4 font-semibold text-slate-900">
                                            ₹{ord.amt}
                                        </td>

                                        <td className="p-4">
                                            <OrderStatusBadge status={ord.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {panelMode && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 flex justify-end">
                    <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <div>
                                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    <Package size={18} className="text-slate-600" />
                                    Order #{order?._id ? order._id.slice(-8) : "..."}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Placed on {formatDate(order?.date || order?.createdAt)}
                                </p>
                            </div>
                            <button
                                onClick={closePanel}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto flex-1 space-y-6 text-xs text-slate-600">
                            {modalLoading ? (
                                <div className="py-20 flex justify-center">
                                    <Loader />
                                </div>
                            ) : (
                                <>
                                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Status</span>
                                            <OrderStatusBadge status={order?.status} />
                                        </div>

                                        <div className="pt-2 border-t border-slate-200/80">
                                            <label className="text-[10px] text-slate-500 font-semibold uppercase block mb-1.5">
                                                Update Order Status
                                            </label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-400"
                                                >
                                                    {STATUS_OPTIONS.map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt.replace(/_/g, " ")}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={handleStatusUpdate}
                                                    disabled={updatingStatus || selectedStatus === order?.status}
                                                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                                                >
                                                    {updatingStatus && <RefreshCw size={13} className="animate-spin" />}
                                                    Update Status
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Order Total</span>
                                            <span className="text-base font-bold text-slate-900 mt-0.5 block">
                                                ₹{order?.amt}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Items Count</span>
                                            <span className="text-sm font-semibold text-slate-700 mt-0.5 block">
                                                {orderDetails.length} Items
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2 text-xs">
                                            <MapPin size={15} className="text-emerald-600" /> Shipping & Customer Details
                                        </h4>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-slate-700">
                                            <div className="flex items-center gap-2 font-semibold text-slate-900">
                                                <User size={13} className="text-slate-400" />
                                                {order?.shippingAddress?.name || "N/A"}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Phone size={13} className="text-slate-400" />
                                                {order?.shippingAddress?.phone || "N/A"}
                                            </div>
                                            <div className="pt-2 border-t border-slate-200/60 text-slate-600 leading-relaxed">
                                                <p>{order?.shippingAddress?.houseNo}, {order?.shippingAddress?.street}</p>
                                                {order?.shippingAddress?.landmark && (
                                                    <p className="text-slate-500 italic">Near {order.shippingAddress.landmark}</p>
                                                )}
                                                <p>
                                                    {order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.pincode}
                                                </p>
                                                <p className="font-medium text-slate-700">{order?.shippingAddress?.country}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2 text-xs">
                                            <CreditCard size={15} className="text-emerald-600" /> Payment Information
                                        </h4>
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex justify-between items-center">
                                            <div>
                                                <p className="text-slate-500 text-[11px]">Method</p>
                                                <p className="font-bold text-slate-800 uppercase mt-0.5">{order?.paymentMethod || "COD"}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-slate-500 text-[11px]">Payment Status</p>
                                                <p className="font-bold text-emerald-600 uppercase mt-0.5">{order?.paymentStatus || "Pending"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2 text-xs">
                                            <Package size={15} className="text-emerald-600" /> Order Items ({orderDetails.length})
                                        </h4>
                                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                                            {orderDetails.map((item, idx) => {
                                                const product = item?.product_variant_id?.product_id || {};
                                                const variant = item?.product_variant_id || {};

                                                return (
                                                    <div key={item._id || idx} className="p-3 flex items-start gap-3 hover:bg-slate-50/50 transition">
                                                        <img
                                                            src={variant?.img_url || product?.img_url || "https://via.placeholder.com/60"}
                                                            alt={product?.name || "Product"}
                                                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 p-0.5 bg-white shrink-0"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <p className="font-bold text-slate-800 truncate">
                                                                    {product?.name || "Product"}
                                                                </p>
                                                                <span className="font-bold text-slate-900 shrink-0 ml-2">
                                                                    ₹{(item.price || variant.sp || 0) * (item.qty || 1)}
                                                                </span>
                                                            </div>

                                                            {product?.brand && (
                                                                <p className="text-[10px] text-slate-400 font-medium">
                                                                    {product.brand}
                                                                </p>
                                                            )}

                                                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                                                                <span>Qty: <strong className="text-slate-700">{item.qty}</strong></span>
                                                                <span>•</span>
                                                                <span>₹{item.price || variant.sp} / item</span>
                                                                {variant.mrp && variant.mrp > (item.price || variant.sp) && (
                                                                    <span className="line-through text-slate-400">₹{variant.mrp}</span>
                                                                )}
                                                            </div>

                                                            {variant.unit && (
                                                                <span className="inline-block mt-1 px-1.5 py-0.2 text-[10px] bg-slate-100 text-slate-600 rounded">
                                                                    {variant.unit}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
                            <button
                                onClick={closePanel}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-xs transition"
                            >
                                Close Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}