import api from "./axios"

export const getAllUsers = async (params = {}) => {
    const res = await api.get("/users",{ params });
    return res.data;
}