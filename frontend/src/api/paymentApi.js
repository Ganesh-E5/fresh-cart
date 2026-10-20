import api from "./axios";

export const getRazorpayKey = async () => {
    const res = await api.get("/payment/get-key");
    return res.data;
}

export const createPaymentOrder = async (amount) => {
    const res = await api.post("/payment/create-order", { amount });
    return res.data;
}

export const verifyPayment = async (paymentData) => {
    const res = await api.post("/payment/verify", paymentData);
    return res.data;
};