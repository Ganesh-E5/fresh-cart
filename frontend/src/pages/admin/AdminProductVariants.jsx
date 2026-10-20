import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AdminToolbar from "../../components/admin/AdminToolbar";
import ImageUpload from "../../components/common/ImageUpload";
import {
    createProductVariant,
    getAllProductVariants,
    getProductVariantById,
    updateProductVariant,
    deleteProductVariant,
} from "../../api/productVariantApi";
import { getAllCategories } from "../../api/categoryApi";
import { getAllProducts } from "../../api/productApi";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import { X, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Pagination from "../../components/common/Pagination";

function AdminProductVariants() {
    const [search, setSearch] = useState("");
    const [panelMode, setPanelMode] = useState(null);
    const [variants, setVariants] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loadingId, setLoadingId] = useState(null);
    const [loadingAction, setLoadingAction] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const limit = 10; 

    const {
        register,
        control,
        reset,
        setValue,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm();

    const closePanel = () => {
        setPanelMode(null);
        setEditingId(null);
        setSelectedCategory("");
        setProducts([]);
        reset({});
    };

    const fetchVariants = async (page = currentPage, searchText = search) => {
        setFetching(true);
        try {
            const res = await getAllProductVariants({
                page,
                limit,
                search: searchText,
            });
            setVariants(res.products || res.variants || []);
            setPagination(res.pagination || null);
            setCurrentPage(page);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to fetch variants", {
                id: "variants-fetch-error",
            });
        } finally {
            setFetching(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await getAllCategories();
            setCategories(res.categories || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProducts = async (categoryId) => {
        if (!categoryId) {
            setProducts([]);
            return [];
        }
        try {
            const res = await getAllProducts({
                category_id: categoryId,
                limit: 1000,
            });
            const fetchedProducts = res.products || [];
            setProducts(fetchedProducts);
            return fetchedProducts;
        } catch (error) {
            console.error(error);
            setProducts([]);
            return [];
        }
    };

    const handleSearch = async () => {
        await fetchVariants(1, search);
    };

    const handlePageChange = (page) => {
        fetchVariants(page, search);
    };

    useEffect(() => {
        fetchVariants();
    }, []);

    useEffect(() => {
        if (panelMode) {
            fetchCategories();
        }
    }, [panelMode]);

    const onSubmit = async (data) => {
        try {
            const { product_id, img_url, size, unit, sku, mrp, sp, qty, rating } = data;

            const variantData = {
                product_id,
                img_url,
                sku,
                mrp: Number(mrp),
                sp: Number(sp),
            };

            if (size && size.trim() !== "") variantData.size = size.trim();
            if (unit && unit.trim() !== "") variantData.unit = unit.trim();
            if (qty !== "" && !isNaN(Number(qty))) variantData.qty = Number(qty);
            if (rating !== "" && !isNaN(Number(rating))) variantData.rating = Number(rating);

            if (panelMode === "create") {
                await createProductVariant(variantData);
            } else if (panelMode === "edit") {
                await updateProductVariant(editingId, variantData);
            }

            toast.success(
                panelMode === "create"
                    ? "Variant created successfully"
                    : "Variant updated successfully",
                { id: "variant-submit-success" }
            );

            await fetchVariants(currentPage, search);
            closePanel();
        } catch (error) {
            const validationErrors = error.response?.data?.errors;
            if (validationErrors?.length > 0) {
                toast.error(validationErrors.map((e) => e.msg).join(", "), {
                    id: "variant-crud-error",
                });
            } else {
                toast.error(error.response?.data?.message || "Something went wrong", {
                    id: "variant-crud-error",
                });
            }
        }
    };

    const handleEdit = async (id) => {
        setLoadingId(id);
        setLoadingAction("edit");
        try {
            const res = await getProductVariantById(id);
            const variant = res.product || res.variant;

            const categoryId = variant.product_id?.category_id?._id || variant.product_id?.category_id;
            const productId = variant.product_id?._id || variant.product_id;

            setEditingId(id);
            setSelectedCategory(categoryId || "");

            if (categoryId) {
                await fetchProducts(categoryId);
            }

            reset({
                product_id: productId,
                img_url: variant.img_url,
                size: variant.size || "",
                unit: variant.unit || "",
                sku: variant.sku,
                mrp: variant.mrp,
                sp: variant.sp,
                qty: variant.qty ?? "",
                rating: variant.rating ?? "",
            });

            setPanelMode("edit");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to load variant details", {
                id: "variant-fetch-error",
            });
        } finally {
            setLoadingId(null);
            setLoadingAction(null);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Variant?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;

        setLoadingId(id);
        setLoadingAction("delete");
        try {
            const res = await deleteProductVariant(id);

            toast.success(res.message || "Variant deleted successfully", {
                id: "variant-delete-success",
            });

            if (variants.length === 1 && currentPage > 1) {
                await fetchVariants(currentPage - 1, search);
            } else {
                await fetchVariants(currentPage, search);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete variant", {
                id: "variant-delete-error",
            });
        } finally {
            setLoadingId(null);
            setLoadingAction(null);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-6">Product Variants</h1>

            <AdminToolbar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search by SKU or product..."
                onSearch={handleSearch}
                createLabel="Create Variant"
                onCreateClick={() => {
                    closePanel();
                    setPanelMode("create");
                }}
            />

            {fetching ? (
                <div className="min-h-100 flex justify-center items-center">
                    <Loader />
                </div>
            ) : variants.length === 0 ? (
                <p className="text-slate-500 text-sm mt-4">No variants found</p>
            ) : (
                <div className="w-full rounded-lg border border-slate-200 bg-white shadow-sm mt-4">
                    <div className="max-h-175 overflow-auto">
                        <table className="min-w-225 w-full border-collapse">
                            <thead className="bg-slate-100 sticky top-0 z-20">
                                <tr>
                                    <th className="sticky left-0 z-30 bg-slate-100 w-14 px-4 py-3 text-left text-sm font-semibold text-slate-700">S.No</th>
                                    <th className="w-16 px-4 py-3 text-left text-sm font-semibold text-slate-700">Image</th>
                                    <th className="w-44 px-4 py-3 text-left text-sm font-semibold text-slate-700">Product</th>
                                    <th className="w-32 px-4 py-3 text-left text-sm font-semibold text-slate-700">SKU</th>
                                    <th className="w-28 px-4 py-3 text-left text-sm font-semibold text-slate-700">Size/Unit</th>
                                    <th className="w-24 px-4 py-3 text-left text-sm font-semibold text-slate-700">MRP</th>
                                    <th className="w-24 px-4 py-3 text-left text-sm font-semibold text-slate-700">SP</th>
                                    <th className="w-20 px-4 py-3 text-left text-sm font-semibold text-slate-700">Qty</th>
                                    <th className="w-20 px-4 py-3 text-left text-sm font-semibold text-slate-700">Rating</th>
                                    <th className="sticky right-0 z-20 bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map((variant, index) => (
                                    <tr key={variant._id} className="group border-t border-slate-200 hover:bg-slate-50 transition">
                                        <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-slate-800">
                                            {(currentPage - 1) * limit + index + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            {variant.img_url ? (
                                                <img 
                                                    src={variant.img_url} 
                                                    alt={variant.sku} 
                                                    loading="lazy" 
                                                    decoding="async" 
                                                    className="h-10 w-10 rounded object-cover border border-slate-200" 
                                                />
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-800">{variant.product_id?.name || "-"}</td>
                                        <td className="px-4 py-3 text-slate-600">{variant.sku}</td>
                                        <td className="px-4 py-3">{[variant.size, variant.unit].filter(Boolean).join(" ") || "-"}</td>
                                        <td className="px-4 py-3">{variant.mrp}</td>
                                        <td className="px-4 py-3">{variant.sp}</td>
                                        <td className="px-4 py-3">{variant.qty ?? "-"}</td>
                                        <td className="px-4 py-3">{variant.rating ?? "-"}</td>
                                        <td className="sticky right-0 z-10 bg-white group-hover:bg-slate-50 px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(variant._id)}
                                                    disabled={loadingId === variant._id}
                                                    className="flex items-center justify-center h-9 w-9 rounded-lg border border-green-700 bg-green-100 hover:bg-green-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loadingId === variant._id && loadingAction === "edit" ? (
                                                        <span className="h-4 w-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Pencil size={16} className="text-green-700" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(variant._id)}
                                                    disabled={loadingId === variant._id}
                                                    className="flex items-center justify-center h-9 w-9 rounded-lg border border-red-700 bg-red-100 hover:bg-red-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loadingId === variant._id && loadingAction === "delete" ? (
                                                        <span className="h-4 w-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} className="text-red-700" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination && pagination.totalPages > 1 && (
                        <div className="border-t border-slate-200 p-4 flex justify-between items-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            )}

            {panelMode !== null && (
                <div className="fixed inset-0 bg-black/30 z-40" onClick={closePanel} />
            )}

            <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ${panelMode !== null ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {panelMode === "create" ? "New Variant" : "Edit Variant"}
                    </h2>
                    <button onClick={closePanel} className="text-slate-400 hover:text-slate-700">
                        <X size={22} className="cursor-pointer" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto flex-1">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <Input
                            type="select"
                            label="Category"
                            id="category"
                            options={categories}
                            value={selectedCategory}
                            placeholder="Select category"
                            optionValue="_id"
                            optionLabel="name"
                            onChange={(e) => {
                                const categoryId = e.target.value;
                                setSelectedCategory(categoryId);
                                setValue("product_id", "");
                                fetchProducts(categoryId);
                            }}
                        />

                        <Input
                            type="select"
                            {...register("product_id", { required: "Product is required" })}
                            optionValue="_id"
                            optionLabel="name"
                            placeholder="Select product"
                            label="Product"
                            id="product_id"
                            error={errors.product_id?.message}
                            options={products}
                        />

                        <Controller
                            name="img_url"
                            control={control}
                            rules={{ required: "Image is required" }}
                            render={({ field }) => (
                                <ImageUpload
                                    label="Variant Image"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <ErrorMessage error={errors.img_url?.message} />

                        <Input
                            {...register("sku", { required: "SKU is required" })}
                            label="SKU"
                            id="sku"
                            error={errors.sku?.message}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input {...register("size")} label="Size" id="size" />
                            <Input {...register("unit")} label="Unit" id="unit" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="number"
                                step="0.01"
                                {...register("mrp", {
                                    required: "MRP is required",
                                    valueAsNumber: true,
                                    min: { value: 0, message: "MRP must be positive" },
                                })}
                                label="MRP"
                                id="mrp"
                                error={errors.mrp?.message}
                            />
                            <Input
                                type="number"
                                step="0.01"
                                {...register("sp", {
                                    required: "Selling price is required",
                                    valueAsNumber: true,
                                    min: { value: 0, message: "SP must be positive" },
                                })}
                                label="Selling Price"
                                id="sp"
                                error={errors.sp?.message}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="number"
                                {...register("qty", {
                                    valueAsNumber: true,
                                    min: { value: 0, message: "Qty cannot be negative" },
                                })}
                                label="Quantity"
                                id="qty"
                                error={errors.qty?.message}
                            />
                            <Input
                                type="number"
                                step="0.1"
                                {...register("rating", {
                                    valueAsNumber: true,
                                    min: { value: 0, message: "Rating must be between 0 and 5" },
                                    max: { value: 5, message: "Rating must be between 0 and 5" },
                                })}
                                label="Rating"
                                id="rating"
                                error={errors.rating?.message}
                            />
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="mt-6">
                            {isSubmitting
                                ? panelMode === "edit"
                                    ? "Updating..."
                                    : "Creating..."
                                : panelMode === "edit"
                                ? "Update Variant"
                                : "Create Variant"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminProductVariants;