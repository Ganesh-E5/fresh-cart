import { useState } from "react"
import ImageUpload from "../common/ImageUpload";

function CategoryForm() {
    const [imgUrl, setImgUrl] = useState("");
    return (
        <>
            <ImageUpload value={imgUrl} onChange={setImgUrl} label="Category Image" />
        </>
    )
}

export default CategoryForm