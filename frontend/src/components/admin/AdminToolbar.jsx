import { Search, Plus } from 'lucide-react'
function AdminToolbar({ search, onSearchChange, onCreateClick, searchPlaceholder = "Search...", createLabel = "Create" }) {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
            <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-shadow focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
            </div>

            <button
                onClick={onCreateClick}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 active:bg-emerald-800 transition-colors shrink-0 cursor-pointer"
            >
                <Plus size={18} />
                <span>{createLabel}</span>
            </button>
        </div>
    );
}
export default AdminToolbar;