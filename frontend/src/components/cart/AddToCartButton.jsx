import { Minus, Plus } from "lucide-react";
import useCart from "../../hooks/useCart";

function AddToCartButton({ variant }) {
    const { getItemQty, addItem, increment, decrement } = useCart();
    const qty = getItemQty(variant._id);
    const outOfStock = variant.qty <= 0;

    if (outOfStock) {
        return (
            <button
                disabled
                className="w-full py-1.5 rounded-lg bg-slate-200 text-slate-400 text-xs font-medium cursor-not-allowed"
            >
                Out of Stock
            </button>
        );
    }

    if (qty === 0) {
        return (
            <button
                onClick={() => addItem(variant)}
                className="w-full py-1.5 rounded-lg border border-emerald-600 text-emerald-600 text-xs font-semibold hover:bg-emerald-50 transition-colors cursor-pointer"
            >
                Add to Cart
            </button>
        );
    }

    return (
        <div className="flex items-center justify-between w-full rounded-lg bg-emerald-600 text-white overflow-hidden">
            <button
                onClick={() => decrement(variant._id)}
                className="flex-1 flex items-center justify-center py-1.5 hover:bg-emerald-700 transition-colors cursor-pointer"
            >
                <Minus size={14} />
            </button>
            <span className="px-2 text-sm font-semibold min-w-[20px] text-center">{qty}</span>
            <button
                onClick={() => increment(variant._id)}
                disabled={qty >= variant.qty}
                className="flex-1 flex items-center justify-center py-1.5 hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Plus size={14} />
            </button>
        </div>
    );
}

export default AddToCartButton;