import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminToolbar from "../../components/admin/AdminToolbar";
import Loader from "../../components/common/Loader";
import { getAllUsers } from "../../api/userApi";

function AdminUsers() {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(false);

    const fetchUsers = async () => {
        setFetching(true);
        try {
            const res = await getAllUsers({ role: "admin" });
            setUsers(res.users);
            toast.success("Admins fetched successfully", {
                id: "admins-fetch-success",
            });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong", {
                id: "admins-fetch-error",
            });
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search)
    );

    return (
        <div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-6">Admins</h1>

            <AdminToolbar
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search by username, email or phone..."
            />

            {fetching ? (
                <Loader />
            ) : filteredUsers.length === 0 ? (
                <p className="text-slate-500 text-sm">No admins found</p>
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
                                        Username
                                    </th>
                                    <th className="w-64 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Email
                                    </th>
                                    <th className="w-36 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Phone
                                    </th>
                                    <th className="w-28 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                                        Joined
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className="border-t border-slate-200 hover:bg-slate-50 transition"
                                    >
                                        <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-slate-800">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-slate-800">
                                            {user.username}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-3">{user.phone}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 border border-blue-700 px-2.5 py-0.5 text-xs font-medium capitalize">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;