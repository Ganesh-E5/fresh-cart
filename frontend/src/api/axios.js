import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("freshcart-token");
        
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token.replace(/^"|"$/g, '')}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;