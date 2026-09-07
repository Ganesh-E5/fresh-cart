import { useState } from "react";
import { uploadImage } from "../../utils/uploadImage";
import toast from "react-hot-toast";

const MAX_SIZE = 10 * 1024 * 1024;

function ImageUpload({ value, onChange, label = "Image" }) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > MAX_SIZE) {
            toast.error("Image must be under 10MB", { id: "file-size-error" });
            return;
        }

        setUploading(true);
        try {
            const url = await uploadImage(file);
            onChange(url);
            toast.success("Image uploaded", { id: "image-upload" });
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Image upload failed", { id: "image-upload-error" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>

            {value && (
                <img
                    src={value}
                    alt="Preview"
                    className="w-64 h-64 object-cover rounded-md border"
                />
            )}

            <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            <label
                htmlFor="image"
                className="w-64 px-4 py-2 bg-emerald-600 text-white rounded cursor-pointer"
            >
                Upload image
            </label>

            {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
        </div>
    );
}

export default ImageUpload;