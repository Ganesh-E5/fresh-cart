import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    MapPin,
    CreditCard,
    Truck,
    CheckCircle2,
    Plus,
    ShoppingBag,
    ArrowLeft,
    Loader2
} from "lucide-react";
import useCart from "../hooks/useCart";
import { getAddresses, addAddress, createOrder } from "../api/userService";
import { getRazorpayKey, createPaymentOrder, verifyPayment } from "../api/paymentApi";
export default function Checkout() {
    const navigate = useNavigate();
    const { items, cartTotal, clearCart } = useCart();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: "",
        phone: "",
        houseNo: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getAddresses();
                const fetchedAddresses = data?.addresses || [];
                setAddresses(fetchedAddresses);

                if (fetchedAddresses.length > 0) {
                    const defaultAddr = fetchedAddresses.find((a) => a.isDefault) || fetchedAddresses[0];
                    setSelectedAddressId(defaultAddr._id);
                }
            } catch (err) {
                console.error("Failed to fetch user addresses:", err);
            } finally {
                setLoadingAddresses(false);
            }
        };

        fetchUserData();
    }, []);

    const handleAddressInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const data = await addAddress(newAddress);
            const updatedAddresses = data?.addresses || [];
            setAddresses(updatedAddresses);

            const added = updatedAddresses[updatedAddresses.length - 1];
            if (added) setSelectedAddressId(added._id);

            setShowAddressForm(false);
            setNewAddress({
                name: "",
                phone: "",
                houseNo: "",
                street: "",
                landmark: "",
                city: "",
                state: "",
                pincode: "",
                country: "India",
            });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add address");
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            setErrorMsg("Please select or add a delivery address.");
            return;
        }

        setErrorMsg("");
        setIsPlacingOrder(true);

        try {
            if (paymentMethod === "COD") {
                const payload = {
                    addressId: selectedAddressId,
                    paymentMethod,
                    items: items.map((item) => ({
                        product_variant_id: item.variantId,
                        qty: item.qty,
                    })),
                };
                const data = await createOrder(payload);
                clearCart();
                const orderId = data.order._id;
                navigate(`/orders/${orderId}`);
            }

            else {
                const keyData = await getRazorpayKey();
                const razorpayOrder = await createPaymentOrder(cartTotal);

                const options = {
                    key: keyData.key,
                    amount: razorpayOrder.order.amount,
                    currency: "INR",
                    name: "Fresh Cart",
                    description: "Order Payment",
                    order_id: razorpayOrder.order.id,
                    handler: async function (response) {
                        try {
                            setIsPlacingOrder(true);
                            const verificationPayload = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                addressId: selectedAddressId,
                                items: items.map((item) => ({
                                    product_variant_id: item.variantId,
                                    qty: item.qty,
                                })),
                            };

                            const data = await verifyPayment(verificationPayload);
                            clearCart();
                            navigate(`/orders/${data.order._id}`);
                        } catch (err) {
                            console.error("Payment verification failed:", err);
                            setErrorMsg(err.response?.data?.message || "Payment verification failed.");
                        } finally {
                            setIsPlacingOrder(false);
                        }
                    },
                    prefill: {
                        name: addresses.find(a => a._id === selectedAddressId)?.name || "Customer",
                        email: "customer@gmail.com",
                        contact: addresses.find(a => a._id === selectedAddressId)?.phone || "9999999999"
                    },
                    theme: {
                        color: "#059669"
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            }
        } catch (err) {
            console.error("Checkout failed:", err);
            setErrorMsg(
                err.response?.data?.message || "Failed to place order. Please try again."
            );
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                    <ShoppingBag size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Cart is empty</h2>
                <p className="text-slate-500 mb-6 max-w-sm">
                    Add items to your cart before proceeding to checkout.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
                >
                    <ArrowLeft size={18} />
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Checkout</h1>

            {errorMsg && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                    {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <MapPin className="text-emerald-600" size={20} />
                                Delivery Address
                            </h2>
                            <button
                                onClick={() => setShowAddressForm(!showAddressForm)}
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                            >
                                <Plus size={16} />
                                {showAddressForm ? "Cancel" : "Add New"}
                            </button>
                        </div>

                        {showAddressForm && (
                            <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                <h3 className="font-semibold text-slate-800 text-sm mb-2">Add New Address</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={newAddress.name}
                                        onChange={handleAddressInputChange}
                                        required
                                        className="p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={newAddress.phone}
                                        onChange={handleAddressInputChange}
                                        required
                                        className="p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <input
                                        type="text"
                                        name="houseNo"
                                        placeholder="Flat / House No. / Building"
                                        value={newAddress.houseNo}
                                        onChange={handleAddressInputChange}
                                        required
                                        className="p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <input
                                        type="text"
                                        name="street"
                                        placeholder="Street / Area"
                                        value={newAddress.street}
                                        onChange={handleAddressInputChange}
                                        required
                                        className="p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <input
                                        type="text"
                                        name="landmark"
                                        placeholder="Landmark (Optional)"
                                        value={newAddress.landmark}
                                        onChange={handleAddressInputChange}
                                        className="p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={newAddress.city}
                                        onChange={handleAddressInputChange}
                                        required
                                        className="p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={newAddress.state}
                                        onChange={handleAddressInputChange}
                                        required
                                        className="p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <input
                                        type="text"
                                        name="pincode"
                                        placeholder="Pincode"
                                        value={newAddress.pincode}
                                        onChange={handleAddressInputChange}
                                        required
                                        className="p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mt-2 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                                >
                                    Save Address
                                </button>
                            </form>
                        )}

                        {loadingAddresses ? (
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <Loader2 className="animate-spin" size={16} /> Loading saved addresses...
                            </div>
                        ) : addresses.length === 0 ? (
                            <p className="text-sm text-slate-500">No saved addresses found. Please add one above.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {addresses.map((addr) => (
                                    <label
                                        key={addr._id}
                                        className={`relative cursor-pointer border rounded-xl p-4 flex flex-col justify-between transition ${selectedAddressId === addr._id
                                            ? "border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600"
                                            : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{addr.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{addr.phone}</p>
                                            </div>
                                            <input
                                                type="radio"
                                                name="address"
                                                checked={selectedAddressId === addr._id}
                                                onChange={() => setSelectedAddressId(addr._id)}
                                                className="accent-emerald-600"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                                            {addr.houseNo}, {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ""}
                                            {addr.city}, {addr.state} - {addr.pincode}
                                        </p>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                            <CreditCard className="text-emerald-600" size={20} />
                            Payment Method
                        </h2>

                        <div className="space-y-3">
                            <label
                                className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition ${paymentMethod === "COD"
                                    ? "border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600"
                                    : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Truck className="text-slate-600" size={20} />
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">Cash on Delivery (COD)</p>
                                        <p className="text-xs text-slate-500">Pay with cash when your order is delivered</p>
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="COD"
                                    checked={paymentMethod === "COD"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="accent-emerald-600"
                                />
                            </label>

                            <label
                                onClick={() => setPaymentMethod("ONLINE")}
                                className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition ${paymentMethod === "ONLINE"
                                        ? "border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600"
                                        : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <CreditCard className="text-emerald-600" size={20} />
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">Online Payment (Card/UPI/NetBanking)</p>
                                        <p className="text-xs text-slate-500">Pay securely via Razorpay</p>
                                    </div>
                                </div>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="ONLINE"
                                    checked={paymentMethod === "ONLINE"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="accent-emerald-600"
                                />
                            </label>

                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
                        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                            Order Overview
                        </h2>

                        <div className="max-h-56 overflow-y-auto space-y-3 pr-1 mb-4 border-b border-slate-100 pb-4">
                            {items.map((item) => (
                                <div key={item.variantId} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={item.img_url || "/placeholder.png"}
                                            alt={item.name}
                                            className="w-10 h-10 object-contain rounded bg-slate-50 p-1 border border-slate-100"
                                        />
                                        <div>
                                            <p className="font-medium text-slate-800 line-clamp-1">{item.name}</p>
                                            <p className="text-slate-400">Qty: {item.qty}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-slate-900">₹{item.sp * item.qty}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-slate-900">₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Delivery Fee</span>
                                <span className="text-emerald-600 font-medium">FREE</span>
                            </div>

                            <hr className="my-2 border-slate-100" />

                            <div className="flex justify-between text-base font-bold text-slate-900">
                                <span>Total Payable</span>
                                <span className="text-emerald-600 text-xl">₹{cartTotal}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder || !selectedAddressId}
                            className="w-full mt-6 bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
                        >
                            {isPlacingOrder ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Placing Order...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={18} />
                                    Place Order
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}