function ErrorMessage({
    error,
    variant = "field",
    className = "",
}) {
    if (!error) return null;

    const styles = {
        field: "mt-1 text-sm text-red-500",
        server:
            "mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700",
    };

    return (
        <div
            role="alert"
            className={`${styles[variant]} ${className}`}
        >
            {error}
        </div>
    );
}

export default ErrorMessage;