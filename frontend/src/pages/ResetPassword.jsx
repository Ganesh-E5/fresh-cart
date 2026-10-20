import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ErrorMessage from "../components/common/ErrorMessage";

import { resetPassword } from "../api/authApi";
import { useFormSubmit } from "../hooks/useFormSubmit";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors, isSubmitting }
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            await resetPassword(token, {
                password: data.password,
            });

            toast.success("Password reset successfully!", {
                id: "reset-password-success",
            });

            navigate("/login");
        } catch (error) {
            if (!error.response) {
                setError("server", {
                    type: "server",
                    message: "Something went wrong. Please try again.",
                });

                toast.error("Something went wrong.", {
                    id: "reset-password-error",
                });

                return;
            }

            const { message } = error.response.data;

            setError("server", {
                type: "server",
                message,
            });

            toast.error(message, {
                id: "reset-password-error",
            });
        }
    };

    const onFormSubmit = useFormSubmit(
        handleSubmit,
        clearErrors,
        onSubmit
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-gray-200">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-10">

                <h1 className="text-3xl font-bold text-center">
                    Reset Password
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    Enter your new password below.
                </p>

                <form
                    onSubmit={onFormSubmit}
                    className="mt-10 space-y-5"
                >
                    <Input
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        })}
                        type="password"
                        id="password"
                        label="New Password"
                        error={errors.password?.message}
                    />

                    <Input
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                                value === password ||
                                "Passwords do not match",
                        })}
                        type="password"
                        id="confirmPassword"
                        label="Confirm Password"
                        error={errors.confirmPassword?.message}
                    />

                    <ErrorMessage error={errors.server?.message} />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-10"
                    >
                        {isSubmitting
                            ? "Resetting..."
                            : "Reset Password"}
                    </Button>

                    <div className="text-center text-sm">
                        Back to{" "}
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
    );
}

export default ResetPassword;