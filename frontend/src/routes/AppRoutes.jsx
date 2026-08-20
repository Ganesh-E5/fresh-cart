import { createBrowserRouter } from "react-router-dom";
import { AuthLayout, MainLayout } from "../components/layout/Layout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
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
        children: [{
            path: "/",
            element: <Home />
        }
        ]
    }
]);

export default router;