import { createBrowserRouter } from "react-router-dom";
import { AdminLayout, AuthLayout, MainLayout } from "../components/layout/Layout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminRoute from "../components/common/AdminRoute"
import AdminCategories from "../pages/admin/AdminCategories";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProductVariants from "../pages/admin/AdminProductVariants";
import AdminUsers from "../pages/admin/AdminUsers";
import ProductListing from "../pages/ProductListing";

const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />
            },
        ]
    },
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path:"/products",
                element: <ProductListing/>
            }
        ]
    },
    {
        element: <AdminRoute />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        path: "/admin",
                        element: <AdminDashboard />,
                    },
                    {
                        path: "/admin/categories",
                        element: <AdminCategories />
                    },
                    {
                        path: "/admin/orders",
                        element: <AdminOrders />
                    },
                    {
                        path: "/admin/products",
                        element: <AdminProducts />
                    },
                    {
                        path: "/admin/product-variants",
                        element: <AdminProductVariants />
                    },
                    {
                        path: "/admin/users",
                        element: <AdminUsers />
                    }
                ]
            }
        ]
    }
]);

export default router;