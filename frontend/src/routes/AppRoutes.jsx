import { createBrowserRouter } from "react-router-dom";
import { AdminLayout, AuthLayout, MainLayout } from "../components/layout/Layout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminRoute from "../components/common/AdminRoute";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminProductVariants from "../pages/admin/AdminProductVariants";
import AdminUsers from "../pages/admin/AdminUsers";
import ProductListing from "../pages/ProductListing";
import ProductDetailPage from "../pages/ProductDetailPage";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderDetails from "../pages/OrderDetails";
import Orders from "../pages/Orders";
import Profile from "../pages/Profile";
import Addresses from "../pages/Addresses";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />
            },
            {
                path:"/reset-password/:token",
                element:<ResetPassword />
            }
        ],
    },
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/products",
                element: <ProductListing />,
            },
            {
                path: "/products/info",
                element: <ProductDetailPage />,
            },
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                element:<ProtectedRoute/>,
                children: [
                    {
                        path: "/checkout",
                        element:<Checkout/>
                    },
                    {
                        path:"/orders",
                        element:<Orders/>
                    },
                    {
                        path:"/orders/:id",
                        element:<OrderDetails/>
                    },
                    {
                        path:"/profile",
                        element:<Profile/>
                    },
                    {
                        path:"/profile/addresses",
                        element:<Addresses/>
                    }
                ]
            }
        ],
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
                        element: <AdminCategories />,
                    },
                    {
                        path: "/admin/orders",
                        element: <AdminOrders />,
                    },
                    {
                        path: "/admin/products",
                        element: <AdminProducts />,
                    },
                    {
                        path: "/admin/product-variants",
                        element: <AdminProductVariants />,
                    },
                    {
                        path: "/admin/users",
                        element: <AdminUsers />,
                    },
                ],
            },
        ],
    },
]);

export default router;