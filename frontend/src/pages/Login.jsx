import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth.js";
function Login() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm();

    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const onSubmit = async (data) => {
        try {
            const response = await login(data);
            toast.success("Login successfull");
            loginUser(
                response.user,
                response.token
            )
            navigate("/");
        } catch (error) {
            if (!error.response) {
                const message = "Something went wrong. Please try again.";

                setError("server", {
                    type: "server",
                    message
                });

                toast.error(message);
                return;
            }

            const { field, message } = error.response.data;

            if (field) {
                setError(field, {
                    type: "server",
                    message
                });

                return;
            }

            setError("server", {
                type: "server",
                message
            });

            toast.error(message);
        }
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-gray-200">
                <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-10">
                    <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
                    <p className="text-center text-gray-500 mt-2 mb-8">
                        Sign in to continue
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
                        <Input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address",
                                },
                            })}
                            type="email"
                            id="email"
                            error={errors.email?.message}
                            label="Enter your email"
                        />
                        <Input
                            {...register("password", {
                                required: "Password is required",
                            })}
                            type="password"
                            id="password"
                            error={errors.password?.message}
                            label="Enter your password"
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-10"
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>

                        <ErrorMessage error={errors.server?.message} />

                        <div className="flex justify-between items-center text-sm">
                            <Link
                                to="/forgot-password"
                                className="text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Forgot password?
                            </Link>

                            <Link
                                to="/signup"
                                className="text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Create account
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default Login