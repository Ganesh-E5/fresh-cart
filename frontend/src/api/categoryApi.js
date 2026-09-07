import api from "./axios";

export const createCategory = async (data) => {
    const res = await api.post("/category", data);
    return res.data;
}

export const getAllCategories = async () => {
    const res = await api.get("/category");
    return res.data;
}

export const getCategoryById = async (id) => {
    const res = await api.get(`/category/${id}`);
    return res.data;
}

export const updateCategory = async (id, data) => {
    const res = await api.patch(`/category/${id}`, data);
    return res.data;
}

export const deleteCategory = async (id) => {
    const res = await api.delete(`/category/${id}`);
    return res.data;
}