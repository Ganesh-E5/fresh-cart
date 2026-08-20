function Button({
    type = "button",
    children,
    className = "",
    disabled = false,
    fullWidth = true,
    ...props
}) {
    return (
        <>
            <button
                type={type}
                disabled={disabled}
                className={`${fullWidth ? "w-full" : "w-auto"} py-3 rounded-lg transition cursor-pointer bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed ${className}`}
                {...props}
            >
                {children}
            </button>
        </>
    )
}

export default Button