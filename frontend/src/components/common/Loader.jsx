function Loader({ size = 32, className = "" }) {
    return (
        <>
            <div className={`flex justify-center items-center ${className}`}>
                <div
                    className="animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"
                    style={{ width: size, height: size }}
                >
                </div>
            </div>
        </>
    )
}

export default Loader