import api from "./axios";

export const getAddresses = async () => {
    const res = await api.get("/users/me/addresses");
    return res.data;
};

export const addAddress = async (addressData) => {
    const res = await api.post("/users/me/addresses", addressData);
    return res.data;
};

export const updateAddress = async (addressId, addressData) => {
    const res = await api.patch(`/users/me/addresses/${addressId}`, addressData);
    return res.data;
};

export const deleteAddress = async (addressId) => {
    const res = await api.delete(`/users/me/addresses/${addressId}`);
    return res.data;
};

export const createOrder = async (orderPayload) => {
    const res = await api.post("/order", orderPayload);
    return res.data;
};

export const setDefaultAddress = (addressId) =>
    updateAddress(addressId, { isDefault: true });