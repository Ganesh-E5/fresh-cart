import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import AdminToolbar from "../../components/admin/AdminToolbar";
import ImageUpload from "../../components/common/ImageUpload";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../api/categoryApi";
import Loader from "../../components/common/Loader";
import CategoryCard from "../../components/category/CategoryCard";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/common/Input"
import Button from "../../components/common/Button"
import { useForm, Controller } from "react-hook-form";
import ErrorMessage from "../../components/common/ErrorMessage";
import Swal from "sweetalert2";

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [search, setSearch] = useState("");
    const { user } = useAuth();
    const [panelOpen, setPanelOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const isEditing = editingCategory !== null;
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Category?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await deleteCategory(id);

            toast.success(res.message);

            setCategories(prev =>
                prev.filter(category => category._id !== id)
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const fetchCategories = async () => {
        try {
            const res = await getAllCategories();
            setCategories(res.categories);
            toast.success("Categories fetched successfully", { id: "categories-fetched" })
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message || "Something went wrong",
                { id: "categories-fetch-error" }
            );
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
    const onSubmit = async (data) => {
        try {
            if (isEditing) {
                const res = await updateCategory(editingCategory._id, data);

                toast.success(res.message);

                setCategories(prev =>
                    prev.map(cat =>
                        cat._id === editingCategory._id ? res.category : cat
                    )
                );
            } else {
                const res = await createCategory(data);

                toast.success(res.message,{
                    id:"category-created"
                });

                setCategories(prev => [res.category, ...prev]);
            }

            setPanelOpen(false);
            setEditingCategory(null);
            reset();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong",{
                    id:"category-crud-error"
                }
            );
        }
    };
    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-6">Categories</h1>

            <AdminToolbar
                search={search}
                onSearchChange={setSearch}
                onCreateClick={() => {
                    setEditingCategory(null);
                    reset();
                    setPanelOpen(true);
                }}
                searchPlaceholder="Search categories..."
                createLabel="Create Category"
            />

            {fetching ? (
                <Loader />
            ) : filteredCategories.length === 0 ? (
                <p className="text-slate-500 text-sm">No categories found.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredCategories.map((category) => (
                        <CategoryCard
                            key={category._id}
                            id={category._id}
                            name={category.name}
                            url={category.img_url}
                            isAdmin={user?.role === "admin"}
                            onEdit={(id) => {
                                setEditingCategory(category);
                                setValue("name", category.name);
                                setValue("img_url", category.img_url)
                                setPanelOpen(true);
                            }}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {panelOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setPanelOpen(false)}
                />
            )}
            <div
                className={`
                    fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50
                    transform transition-transform duration-300
                    ${panelOpen ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">{isEditing ? "Edit Category" : "New Category"}</h2>
                    <button
                        onClick={() => setPanelOpen(false)}
                        className="text-slate-400 hover:text-slate-700"
                    >
                        <X size={22} className="hover:cursor-pointer" />
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-5">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            {...register("name", {
                                required: "Name is required"
                            })}
                            label="Name"
                            id="name"
                            error={errors.name?.message}
                        />
                        <Controller
                            name="img_url"
                            control={control}
                            rules={{
                                required: "Image is required"
                            }}
                            render={({ field }) => (
                                <ImageUpload
                                    label="Catgeory Image"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <ErrorMessage error={errors.img_url?.message} />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? (isEditing ? "Updating..." : "Creating...")
                                : (isEditing ? "Update Category" : "Create Category")}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminCategories;