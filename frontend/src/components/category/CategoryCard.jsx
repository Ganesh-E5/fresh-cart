import { Pencil, Trash2 } from "lucide-react";
function CategoryCard({ name, url, id, isAdmin, onEdit, onDelete }) {
    return (
        <div className="relative aspect-square rounded-xl overflow-hidden shadow-md group cursor-pointer">
            <img
                src={url}
                alt={`${name} category`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
                <p className="text-white font-semibold text-lg">{name}</p>
            </div>
            {isAdmin &&
                <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(id)}
                            className="flex border border-green-700 items-center justify-center h-9 w-9 rounded-lg bg-green-100 hover:bg-green-200 transition hover:cursor-pointer"
                        >
                            <Pencil size={18} className="text-green-700" />
                        </button>

                        <button
                            onClick={() => onDelete(id)}
                            className="flex items-center border border-red-700  justify-center h-9 w-9 rounded-lg bg-red-100 hover:bg-red-200 transition hover:cursor-pointer"
                        >
                            <Trash2 size={18} className="text-red-700" />
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}

export default CategoryCard;