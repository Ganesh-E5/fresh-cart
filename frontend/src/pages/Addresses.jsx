import { ArrowLeft, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    addAddress, deleteAddress, getAddresses, setDefaultAddress, updateAddress,
} from "../api/userService";
import AddressForm from "../components/address/AddressForm.jsx";
import Loader from "../components/common/Loader";

function Addresses() {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAddresses();
                setAddresses(data?.addresses || []);
            } catch (err) {
                console.error(err);
                setError("Could not load your addresses.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleAdd = async (form) => {
        const data = await addAddress(form);
        setAddresses(data.addresses);
        setAdding(false);
    };

    const handleUpdate = async (form) => {
        const data = await updateAddress(editingId, form);
        setAddresses(data.addresses);
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            const data = await deleteAddress(id);
            setAddresses(data.addresses);
        } catch (err) {
            setError(err.response?.data?.message || "Could not delete address");
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const data = await setDefaultAddress(id);
            setAddresses(data.addresses);
        } catch (err) {
            setError(err.response?.data?.message || "Could not update default address");
        }
    };

    return (
        <div className="px-3 md:px-8 py-6 bg-[#FFFDF8] min-h-screen max-w-3xl mx-auto">
            <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-600 mb-4 px-1"
            >
                <ArrowLeft size={16} /> Back to account
            </button>

            <div className="flex items-center justify-between mb-5 px-1">
                <h1 className="text-xl font-bold text-slate-900">Saved Addresses</h1>
                {!adding && (
                    <button
                        onClick={() => { setAdding(true); setEditingId(null); }}
                        className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                        <Plus size={16} /> Add new
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {error}
                </div>
            )}

            {adding && (
                <div className="mb-4">
                    <AddressForm onSubmit={handleAdd} onCancel={() => setAdding(false)} />
                </div>
            )}

            {loading ? (
                <Loader />
            ) : addresses.length === 0 && !adding ? (
                <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
                    <MapPin size={48} className="text-slate-300" />
                    <p className="font-medium">No saved addresses yet</p>
                    <button
                        onClick={() => setAdding(true)}
                        className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
                    >
                        Add your first address
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {addresses.map((addr) =>
                        editingId === addr._id ? (
                            <AddressForm
                                key={addr._id}
                                initial={addr}
                                submitLabel="Update Address"
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <div
                                key={addr._id}
                                className={`rounded-2xl border bg-white p-4 ${
                                    addr.isDefault ? "border-emerald-500" : "border-slate-200"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-800 flex items-center gap-2">
                                            {addr.name}
                                            {addr.isDefault && (
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                    Default
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-sm text-slate-500">{addr.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            aria-label="Edit address"
                                            onClick={() => { setEditingId(addr._id); setAdding(false); }}
                                            className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            aria-label="Delete address"
                                            onClick={() => handleDelete(addr._id)}
                                            className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                                    {[addr.houseNo, addr.street, addr.landmark].filter(Boolean).join(", ")}
                                    <br />
                                    {addr.city}, {addr.state} - {addr.pincode}
                                </p>

                                {!addr.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(addr._id)}
                                        className="mt-3 text-xs font-semibold text-emerald-600 hover:underline"
                                    >
                                        Set as default
                                    </button>
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default Addresses;