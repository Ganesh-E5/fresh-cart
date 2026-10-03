import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}) {

    if (!totalPages || totalPages <= 1) return null;

    const getPages = () => {
        const pages = [];

        pages.push(1);

        let start = Math.max(currentPage - 1, 2);
        let end = Math.min(currentPage + 1, totalPages - 1);

        if (currentPage <= 3) {
            end = Math.min(4, totalPages - 1);
        }

        if (currentPage >= totalPages - 2) {
            start = Math.max(2, totalPages - 3);
        }

        if (start > 2) {
            pages.push("left-ellipsis");
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages - 1) {
            pages.push("right-ellipsis");
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="mt-6 flex items-center justify-center">

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft size={18} />
                </button>

                {getPages().map((page) => {

                    if (typeof page !== "number") {
                        return (
                            <span
                                key={page}
                                className="px-2 text-slate-500"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            disabled={page === currentPage}
                            onClick={() => onPageChange(page)}
                            className={`h-10 min-w-10 rounded-lg px-3 text-sm font-medium transition
                                ${
                                    page === currentPage
                                        ? "bg-blue-600 text-white shadow"
                                        : "border border-slate-200 text-slate-700 hover:bg-slate-100"
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight size={18} />
                </button>

            </div>

        </div>
    );
}

export default Pagination;