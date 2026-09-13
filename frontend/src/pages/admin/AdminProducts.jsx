import { useEffect, useState } from "react"
import AdminToolbar from "../../components/admin/AdminToolbar"
import { useForm } from "react-hook-form";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { X, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

function AdminProducts() {
    const [search, setSearch] = useState("");
    const [panelMode, setPanelMode] = useState(null);
    const [products, setProducts] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [categories, setCategories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loadingId, setLoadingId] = useState(null);
    const [loadingAction, setLoadingAction] = useState(null);
    const {
        register,
        reset,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm();
    const onSubmit = async (data) => {
        try {
            const {
                name,
                description,
                category_id,
                brand,
                key_words,
            } = data;
            const productData = {
                name,
                description,
                category_id,
            };
            if (brand && brand.trim() !== "") {
                productData.brand = brand;
            }
            if (key_words?.length > 0) {
                productData.key_words = key_words;
            }
            if (panelMode === "create") {
                await createProduct(productData);
            } else if (panelMode === "edit") {
                await updateProduct(editingId, productData);
            }
            toast.success(
                panelMode === "create"
                    ? "Product created successfully"
                    : "Product updated successfully"
                , {
                    id: panelMode === "create" ? "product-create" : "product-update"
                });
            await fetchProducts();
            setPanelMode(null);
            setEditingId(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong", {
                id: "product-curd-error"
            });
        }
    }
    const fetchProducts = async () => {
        setFetching(true);
        try {
            const res = await getAllProducts();
            setProducts(res.products);
            toast.success("Products fetched successfully", {
                id: "products-fetch-success"
            })
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong", {
                id: "products-fetch-error"
            })
        } finally {
            setFetching(false);
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await getAllCategories();
            setCategories(res.categories);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    useEffect(() => {
        fetchProducts();
    }, [])

    useEffect(() => {
        fetchCategories();
    }, [panelMode])

    const handleEdit = async (id) => {
        setLoadingId(id);
        setLoadingAction("edit");
        try {
            const res = await getProductById(id);
            const product = res.product;
            setEditingId(id);
            reset({
                name: product.name,
                description: product.description,
                category_id: product.category_id._id,
                brand: product.brand,
                key_words: product.key_words?.join(", "),
            });
            setPanelMode("edit");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong", {
                id: "product-fetch-error"
            });
        } finally {
            setLoadingId(null);
            setLoadingAction(null);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Product?",
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
            const res = await deleteProduct(id);

            toast.success(res.message || "Product deleted successfully", {
                id: "product-delete-success"
            });

            setProducts(prev =>
                prev.filter(product => product._id !== id)
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong",
                { id: "product-delete-error" }
            );
        } finally {
            setLoadingId(null);
            setLoadingAction(null);
        }
    };
    return (
        <div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-6">Products</h1>
            <AdminToolbar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search products..."
                createLabel="Create Product"
                onCreateClick={() => {
                    setPanelMode("create")
                    setEditingId(null);
                    reset()
                }}
            />
            {fetching ? (
                <Loader />
            ) : filteredProducts.length === 0 ? (
                <p className="text-slate-500 text-sm" >No products found</p>
            ) : (
                <div className="w-full rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="max-h-200 overflow-auto">
                        <table className="min-w-225 w-full border-collapse">
                            <thead className="bg-slate-100 sticky top-0 z-20">
                                <tr>
                                    <th className="sticky left-0 z-30 bg-slate-100 w-14 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        S.No
                                    </th>
                                    <th className="w-44 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Name
                                    </th>
                                    <th className="w-72 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Description
                                    </th>
                                    <th className="w-40 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Category
                                    </th>
                                    <th className="w-32 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Brand
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Keywords
                                    </th>
                                    <th className="sticky right-0 z-20 bg-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <tr
                                        key={product._id}
                                        className="group border-t border-slate-200 hover:bg-slate-50 transition"
                                    >
                                        <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-slate-800">
                                            {index + 1}
                                        </td>

                                        <td className="px-4 py-3 font-medium text-slate-800">
                                            {product.name}
                                        </td>

                                        <td
                                            className="px-4 py-3 text-slate-600 truncate max-w-xs"
                                            title={product.description}
                                        >
                                            {product.description}
                                        </td>

                                        <td className="px-4 py-3">
                                            {product.category_id?.name}
                                        </td>

                                        <td className="px-4 py-3">
                                            {product.brand || "-"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {product.key_words?.join(", ") || "-"}
                                        </td>
                                        <td className="sticky right-0 z-10 bg-white group-hover:bg-slate-50 px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(product._id)}
                                                    disabled={loadingId === product._id}
                                                    className="flex items-center justify-center h-9 w-9 rounded-lg border border-green-700 bg-green-100 hover:bg-green-200 transition hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loadingId === product._id && loadingAction === "edit" ? (
                                                        <span className="h-4 w-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Pencil size={16} className="text-green-700" />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    disabled={loadingId === product._id}
                                                    className="flex items-center justify-center h-9 w-9 rounded-lg border border-red-700 bg-red-100 hover:bg-red-200 transition hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loadingId === product._id && loadingAction === "delete" ? (
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
                </div>
            )}

            <div
                className={`
                    fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50
                    transform transition-transform duration-300
                    ${panelMode !== null ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">{panelMode === "create" ? "New Product" : panelMode === "edit" ? "Edit Product" : "Product info"}</h2>
                    <button
                        onClick={() => {
                            setPanelMode(null)
                            setEditingId(null)
                        }}
                        className="text-slate-400 hover:text-slate-700"
                    >
                        <X size={22} className="hover:cursor-pointer" />
                    </button>
                </div>

                <div className="p-5">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <Input
                            {...register("name", {
                                required: "Name is required"
                            })}
                            label="Name"
                            id="name"
                            error={errors.name?.message}
                        />
                        <Input
                            {...register("description", {
                                required: "Description is required"
                            })}
                            label="Description"
                            id="description"
                            error={errors.description?.message}
                        />
                        <Input
                            type="select"
                            {...register("category_id", {
                                required: "Category is required"
                            })}
                            label="Category"
                            id="category_id"
                            error={errors.category_id?.message}
                            options={categories}
                        />
                        <Input
                            {...register("brand")}
                            label="Brand"
                            id="brand"
                            error={errors.brand?.message}
                        />
                        <Input
                            {...register("key_words", {
                                setValueAs: (value) =>
                                    (value || "")
                                        .split(",")
                                        .map((word) => word.trim())
                                        .filter(Boolean)
                            })}
                            label="Key words"
                            id="key_words"
                            error={errors.key_words?.message}
                        />
                        {panelMode !== "view" &&
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-10"
                            >
                                {isSubmitting
                                    ? (panelMode === "edit" ? "Updating..." : "Creating...")
                                    : (panelMode === "edit" ? "Update Product" : "Create Product")}
                            </Button>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminProducts