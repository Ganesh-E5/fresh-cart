const STYLES = {
    Pending_Payment: "bg-amber-50 text-amber-700 border-amber-200",
    Placed: "bg-blue-50 text-blue-700 border-blue-200",
    Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    Processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Shipped: "bg-purple-50 text-purple-700 border-purple-200",
    "Out for delivery": "bg-orange-50 text-orange-700 border-orange-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export const formatStatus = (status) => (status || "").replace(/_/g, " ");

export const formatDate = (order) =>
    new Date(order.createdAt || order.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

export default function OrderStatusBadge({ status }) {
    return (
        <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                STYLES[status] || "bg-slate-50 text-slate-700 border-slate-200"
            }`}
        >
            {formatStatus(status)}
        </span>
    );
}