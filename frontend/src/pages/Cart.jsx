import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import useCart from "../hooks/useCart";

export default function Cart() {
    const {
        items,
        increment,
        decrement,
        removeItem,
        clearCart,
        cartCount,
        cartTotal,
    } = useCart();

    const totalSavings = items.reduce(
        (sum, item) => sum + (item.mrp - item.sp) * item.qty,
        0
    );

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                    <ShoppingBag size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Your cart is empty
                </h2>
                <p className="text-slate-500 mb-6 max-w-sm">
                    Looks like you haven't added anything to your cart yet. Explore our products and add them here!
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
                >
                    <ArrowLeft size={18} />
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Shopping Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
                </h1>
                <button
                    onClick={clearCart}
                    className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline flex items-center gap-1"
                >
                    <Trash2 size={16} />
                    Clear Cart
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.variantId}
                            className="flex flex-col sm:flex-row items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition gap-4"
                        >
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <img
                                    src={item.img_url || "/placeholder.png"}
                                    alt={item.name}
                                    className="w-20 h-20 object-contain rounded-xl bg-slate-50 p-2 border border-slate-100 flex-shrink-0"
                                />
                                <div>
                                    <h3 className="font-bold text-slate-800 text-base leading-snug">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {item.size} {item.unit}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="font-bold text-slate-900">
                                            ₹{item.sp}
                                        </span>
                                        {item.mrp > item.sp && (
                                            <span className="text-xs text-slate-400 line-through">
                                                ₹{item.mrp}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                    <button
                                        onClick={() => decrement(item.variantId)}
                                        className="p-2 text-slate-600 hover:bg-slate-200 transition"
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-4 font-semibold text-slate-800 text-sm">
                                        {item.qty}
                                    </span>
                                    <button
                                        onClick={() => increment(item.variantId)}
                                        disabled={item.qty >= item.stock}
                                        className="p-2 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition"
                                        aria-label="Increase quantity"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-slate-900 text-lg w-20 text-right">
                                        ₹{item.sp * item.qty}
                                    </span>
                                    <button
                                        onClick={() => removeItem(item.variantId)}
                                        className="text-slate-400 hover:text-red-500 transition p-1"
                                        title="Remove item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
                        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-slate-900">₹{cartTotal}</span>
                            </div>

                            {totalSavings > 0 && (
                                <div className="flex justify-between text-emerald-600 font-medium">
                                    <span>Total Discount</span>
                                    <span>- ₹{totalSavings}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-slate-600">
                                <span>Delivery Fee</span>
                                <span className="text-emerald-600 font-medium">FREE</span>
                            </div>

                            <hr className="my-3 border-slate-100" />

                            <div className="flex justify-between text-base font-bold text-slate-900 pt-1">
                                <span>Grand Total</span>
                                <span className="text-emerald-600 text-xl">₹{cartTotal}</span>
                            </div>
                        </div>

                        {totalSavings > 0 && (
                            <div className="mt-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-lg p-2.5 text-center font-medium">
                                You are saving ₹{totalSavings} on this order!
                            </div>
                        )}
                        <Link
                            to="/checkout"
                            className="w-full mt-6 bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-200 block text-center"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}