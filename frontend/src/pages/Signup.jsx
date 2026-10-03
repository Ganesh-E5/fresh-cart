import { useForm } from "react-hook-form";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { signup } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import toast from "react-hot-toast"
import { Link } from 'react-router-dom'
import { useFormSubmit } from "../hooks/useFormSubmit";

function Signup() {
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        setFocus,
        watch,
        formState: { isSubmitting, errors }
    } = useForm();

    const navigate = useNavigate();

    const password = watch("password");
    const onSubmit = async (data) => {
        try {
            await signup(data);
            toast.success("Account created successfully!", { id: "signup-success" });
            navigate("/login")
        } catch (error) {
            if (!error.response) {
                setError("server", {
                    type: "server",
                    message: "Something went wrong. Please try again."
                });
                toast.error("Something went wrong. Please try again.", { id: "signup-error" });
                return;
            }


            const { field, message } = error.response?.data || {};

            if (field) {
                setError(field, {
                    type: "server",
                    message
                })
                setFocus(field)
                return;
            }
            setError("server", {
                type: "server",
                message
            })
            toast.error(message, { id: "signup-error" });
        }
    }
    const onFormSubmit = useFormSubmit(handleSubmit, clearErrors, onSubmit)
    return (
        <><div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-gray-200">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-10">
                <h1 className="text-3xl font-bold text-center">Create Account</h1>
                <p className="text-center text-gray-500 mt-2 mb-8">
                    Create your Fresh Cart account and start shopping.
                </p>

                <form onSubmit={onFormSubmit} className="mt-10 space-y-5">
                    <Input
                        {...register("username", {
                            required: "Username is required",
                            minLength: {
                                value: 3,
                                message: "Username must be at least 3 characters"
                            }
                        })}
                        type="text"
                        id="username"
                        error={errors.username?.message}
                        label="Enter username"
                    />
                    <Input
                        {...register("phone", {
                            required: "Phone number is required",
                            pattern: {
                                value: /^\d{10}$/,
                                message: "Invalid phone number"
                            }
                        })}
                        type="text"
                        id="phone"
                        error={errors.phone?.message}
                        label="Enter phone number"
                    />
                    <Input
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address"
                            }
                        })}
                        type="email"
                        id="email"
                        error={errors.email?.message}
                        label="Enter email"
                    />
                    <Input
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password minimum length is 6"
                            }
                        })}
                        type="password"
                        id="password"
                        error={errors.password?.message}
                        label="Enter password"
                    />
                    <Input
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                                value === password || "Passwords do not match"
                        })}
                        type="password"
                        id="confirmPassword"
                        error={errors.confirmPassword?.message}
                        label="Confirm password"
                    />

                    <ErrorMessage error={errors.server?.message} />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-10"
                    >
                        {isSubmitting ? "Signing up..." : "Create Account"}
                    </Button>
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default Signup