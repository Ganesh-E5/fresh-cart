import { forwardRef } from "react";
import ErrorMessage from "./ErrorMessage";
const Input = forwardRef(({
    className = "",
    options = [],
    type,
    id,
    error,
    label,
    ...props
}, ref) => {
    return (
        <>
            <div className="relative">
                <input
                    ref={ref}
                    id={id}
                    type={type}
                    placeholder=" "
                    className={`peer p-2 border w-full rounded-sm appearance-none outline-none focus:outline-none focus:ring-0 placeholder:text-transparent ${className}`}
                    {...props}
                />

                <label
                    htmlFor={id}
                    className="absolute left-0 ml-1 mt-2 -translate-y-4 px-1 bg-white text-gray-500 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:px-1 peer-focus:-translate-y-4 peer-focus:text-sm"
                >
                    {label}
                </label>

                <ErrorMessage error={error} />
            </div>
        </>
    )
});

export default Input;