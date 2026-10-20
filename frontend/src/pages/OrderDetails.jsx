import { ArrowLeft, MapPin, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../api/orderApi";
import Loader from "../components/common/Loader";
import OrderStatusBadge, { formatDate } from "../components/orders/OrderStatusBadge";

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        const fetchOrder = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getOrderById(id);
                if (ignore) return;
                setOrder(res.order);
                setItems(res.orderDetails);
            } catch (err) {
                console.error("Failed to fetch order:", err);
                if (!ignore) {
                    setError(
                        err.response?.status === 404
                            ? "Order not found."
                            : "Could not load this order. Please try again."
                    );
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchOrder();
        return () => {
            ignore = true;
        };
    }, [id]);

    if (loading) return <Loader />;

    if (error || !order) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <p className="text-sm text-red-600 mb-4">{error || "Order not found."}</p>
                <button
                    onClick={() => navigate("/orders")}
                    className="text-sm font-semibold text-emerald-700 hover:underline"
                >
                    Back to orders
                </button>
            </div>
        );
    }

    const address = order.shippingAddress;
    const itemsTotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    return (
        <div className="px-3 md:px-8 py-6 bg-[#FFFDF8] min-h-screen max-w-4xl mx-auto">
            <button
                onClick={() => navigate("/orders")}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 mb-4 px-1"
            >
                <ArrowLeft size={16} /> Back to orders
            </button>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg font-bold text-slate-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-sm text-slate-500">Placed on {formatDate(order)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-4">
                <h2 className="font-bold text-slate-900 mb-3">Items ({items.length})</h2>
                <div className="divide-y divide-slate-100">
                    {items.map((item) => {
                        const variant = item.product_variant_id; 
                        const product = variant?.product_id;

                        return (
                            <div key={item._id} className="flex items-center gap-3 py-3">
                                <div className="w-16 h-16 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1">
                                    {variant?.img_url && (
                                        <img
                                            src={variant.img_url}
                                            alt={product?.name}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    {product?.brand && (
                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                                            {product.brand}
                                        </span>
                                    )}
                                    <p className="text-sm font-bold text-slate-800 line-clamp-2">
                                        {product?.name || `Item ${item.sku}`}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {variant?.unit || variant?.size || item.sku}
                                    </p>
                                </div>

                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-slate-900">
                                        ₹{item.price * item.qty}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        ₹{item.price} × {item.qty}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h2 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <MapPin size={16} className="text-emerald-600" /> Delivery address
                    </h2>
                    <p className="text-sm font-semibold text-slate-800">{address.name}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {[address.houseNo, address.street, address.landmark].filter(Boolean).join(", ")}
                        <br />
                        {address.city}, {address.state} - {address.pincode}
                        <br />
                        {address.country}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">Phone: {address.phone}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <h2 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <CreditCard size={16} className="text-emerald-600" /> Payment
                    </h2>
                    <div className="text-sm text-slate-600 flex flex-col gap-1.5">
                        <div className="flex justify-between">
                            <span>Method</span>
                            <span className="font-medium text-slate-800">
                                {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Status</span>
                            <span className="font-medium text-slate-800">{order.paymentStatus}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Items total</span>
                            <span className="font-medium text-slate-800">₹{itemsTotal}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-2 mt-1 text-base">
                            <span className="font-bold text-slate-900">Total</span>
                            <span className="font-bold text-slate-900">₹{order.amt}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;