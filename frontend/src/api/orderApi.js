import api from "./axios";

export const getMyOrders = async (params = {}) => {
    const res = await api.get("/order", { params });
    return res.data;
};

export const getOrderById = async (id) => {
    const res = await api.get(`/order/${id}`);
    return res.data;
};

export const getAllOrders = async (params = {}) => {
    const res = await api.get("/order/admin/all",{params});
    return res.data;
}

export const updateOrderStatus = async ({status,id}) => {
    const res = await api.patch(`/order/${id}`,{status});
    return res.data;
}