import { forwardRef } from "react";
import ErrorMessage from "./ErrorMessage";
const Input = forwardRef(({
    className = "",
    options = [],
    type = "text",
    id,
    error,
    label,
    preview,
    ...props
}, ref) => {
    return (
        <>
            {type === "image" ?
                <div>
                    <label
                        htmlFor={id}
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-sm cursor-pointer hover:bg-gray-50"
                    >
                        {preview ? (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-full h-full object-cover"
                            />
                        ) :
                            (<span className="text-gary-500">
                                Click to upload an image
                            </span>
                            )}
                    </label>

                    <input
                        ref={ref}
                        id={id}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...props}
                    />
                    <ErrorMessage error={error} />
                </div>
                : type === "select" ?
                    <div className="relative">
                        <select
                            ref={ref}
                            id={id}
                            className={`peer p-2 border w-full rounded-sm outline-none ${className}`}
                            {...props}
                        >
                            <option value="" disabled hidden>Select category</option>
                            {options.map((opt) => (
                                <option key={opt._id} value={opt._id}>{opt.name}</option>
                            ))}
                        </select>
                        <label
                            htmlFor={id}
                            className="
            absolute left-2 top-2 bg-white px-1 text-gray-500
            transition-all duration-150
            peer-valid:-top-2 peer-valid:text-sm
            peer-focus:-top-2 peer-focus:text-sm
        "
                        >
                            {label}
                        </label>
                        <ErrorMessage error={error} />
                    </div> :
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
            }
        </>
    )
});

export default Input;