import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
                { email }
            );

            alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit">
                Send Reset Link
            </button>
        </form>
    );
}