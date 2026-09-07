export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
    );

    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error("Cloudinary error response:", errorData);
        throw new Error(errorData?.error?.message || "Image upload failed");
    }

    const data = await res.json();
    return data.secure_url;
};