import api from "./axios";

export const createProductVariant = async (data) => {
    const res = await api.post("/product-variant",data);
    return res.data;
}

export const getAllProductVariants = async (params = {}) => {
    const res = await api.get("/product-variant",{params});
    return res.data;
}

export const getProductVariantById = async (id) => {
    const res = await api.get(`/product-variant/${id}`);
    return res.data;
}

export const updateProductVariant = async (id,data) => {
    const res = await api.patch(`/product-variant/${id}`,data)
    return res.data;
}

export const deleteProductVariant = async (id) => {
    const res = await api.delete(`/product-variant/${id}`)
    return res.data;
}