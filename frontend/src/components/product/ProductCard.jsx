function ProductCard({
    product_id,
    name,
    description,
    category_id,
    category_name,
    brand,
    key_words = [],
}) {
    return (
        <div className=" p-2 relative rounded-xl overflow-hidden shadow-md group cursor-pointer border-t-4 border-t-gray-500">
            <h1 className="font-bold">
                {name}
            </h1>

        </div>
    );
}
export default ProductCard;