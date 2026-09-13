import { useEffect, useState, useCallback } from "react";
import * as adminService from "../../services/adminService";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Skeleton from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

export default function AdminUsers() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.listUsers();
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Skeleton className="h-72" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!users?.length) return <EmptyState title="No users yet" description="Users will appear here once they register." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Users</h1>
        <p className="text-sm text-muted mt-1">{users.length} registered user(s).</p>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted border-b border-gray-100">
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Profile Completed</th>
              <th className="pb-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-50 last:border-0">
                <td className="py-2.5">{u.name}</td>
                <td className="py-2.5 text-muted">{u.email}</td>
                <td className="py-2.5">
                  <Badge tone={u.role === "admin" ? "success" : "neutral"}>{u.role}</Badge>
                </td>
                <td className="py-2.5">{u.profileCompleted ? "Yes" : "No"}</td>
                <td className="py-2.5 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
