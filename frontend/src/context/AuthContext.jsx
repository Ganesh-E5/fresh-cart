import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const savedUser = localStorage.getItem("freshcart-user");

    const [user, setUser] = useState(
        savedUser ? JSON.parse(savedUser) : null
    );
    const loginUser = (userData, token) => {
        localStorage.setItem("freshcart-token", token);
        localStorage.setItem("freshcart-user", JSON.stringify(userData));
        setUser(userData);
    }

    const logoutUser = () => {
        localStorage.removeItem("freshcart-token");
        localStorage.removeItem("freshcart-user");
        setUser(null);
    }
    return (
        <AuthContext.Provider
            value={{
                user,
                loginUser,
                logoutUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}