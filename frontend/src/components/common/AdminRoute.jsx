import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function AdminRoute() {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />
    }
    if (user.role !== 'admin') {
        return <Navigate to='/' replace />
    }
    return <Outlet />
}

export default AdminRoute