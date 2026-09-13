import api from "./axios";

export const getAllProducts = async () => {
    const res = await api.get("/product");
    return res.data;
}

export const getProductById = async (id) => {
    const res = await api.get(`/product/${id}`);
    return res.data;
}

export const createProduct = async (data) => {
    const res = await api.post("/product", data);
    return res.data;
}

export const updateProduct = async (id, data) => {
    const res = await api.patch(`/product/${id}`, data)
    return res.data;
}

export const deleteProduct = async (id) => {
    const res = await api.delete(`/product/${id}`)
    return res.data;
}