import { useState } from "react";
import { Loader2 } from "lucide-react";

const EMPTY = {
    name: "", phone: "", houseNo: "", street: "", landmark: "",
    city: "", state: "", pincode: "", country: "India",
};

const FIELDS = [
    { name: "name", placeholder: "Full Name", required: true },
    { name: "phone", placeholder: "Phone Number", required: true, pattern: "[0-9]{10}", title: "Enter a 10-digit phone number" },
    { name: "houseNo", placeholder: "Flat / House No. / Building", required: true },
    { name: "street", placeholder: "Street / Area", required: true },
    { name: "landmark", placeholder: "Landmark (Optional)" },
    { name: "city", placeholder: "City", required: true },
    { name: "state", placeholder: "State", required: true },
    { name: "pincode", placeholder: "Pincode", required: true, pattern: "[1-9][0-9]{5}", title: "Enter a 6-digit pincode" },
];

export default function AddressForm({ initial, onSubmit, onCancel, submitLabel = "Save Address" }) {
    const [form, setForm] = useState({ ...EMPTY, ...initial });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            await onSubmit(form);
        } catch (err) {
            setError(err.response?.data?.message || "Could not save address");
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FIELDS.map((f) => (
                    <input
                        key={f.name}
                        type="text"
                        name={f.name}
                        placeholder={f.placeholder}
                        value={form[f.name] || ""}
                        onChange={handleChange}
                        required={f.required}
                        pattern={f.pattern}
                        title={f.title}
                        className="p-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                ))}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                >
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    {submitLabel}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-sm font-medium px-4 py-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}