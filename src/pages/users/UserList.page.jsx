import { useEffect, useState } from "react";
import { assignUserRole, fetchRoles, fetchUsers, setUserEnabled } from "../../api/admin.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import { Badge, Spinner } from "../../components/ui/index.js";

export default function UserListPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState(null);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);

  const load = () => Promise.all([fetchUsers(), fetchRoles()]).then(([u, r]) => {
    setUsers(u);
    setRoles(r);
  }).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (user, roleId) => {
    try {
      await assignUserRole(user.id, roleId ? Number(roleId) : null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleEnabled = async (user) => {
    if (!window.confirm(`${user.enabled ? "Disable" : "Enable"} ${user.email}?`)) return;
    try {
      await setUserEnabled(user.id, !user.enabled);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p className="text-hard text-sm">{error}</p>;
  if (!users) return <Spinner />;

  return (
    <div>
      <h1 className="text-[18px] font-semibold text-ink mb-5">Users</h1>

      <div className="border border-line rounded-xl overflow-hidden bg-paper-raised">
        <table className="w-full text-[13.5px]">
          <thead className="bg-ink/[0.03] text-ink-soft text-left">
            <tr>
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2.5 text-ink">{u.displayName}</td>
                <td className="px-4 py-2.5 text-ink-soft">{u.email}</td>
                <td className="px-4 py-2.5">
                  <select
                    value={u.roleId ?? ""}
                    onChange={(e) => handleRoleChange(u, e.target.value)}
                    className="h-8 text-[12.5px] rounded-lg border border-line bg-paper-raised px-2"
                  >
                    <option value="">No role (student)</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2.5">
                  <Badge tone={u.enabled ? "done" : "hard"}>{u.enabled ? "Enabled" : "Disabled"}</Badge>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    onClick={() => handleToggleEnabled(u)}
                    disabled={u.id === currentAdmin?.id}
                    title={u.id === currentAdmin?.id ? "You can't disable your own account" : undefined}
                    className="text-[12.5px] text-accent hover:underline disabled:text-ink-soft/50 disabled:no-underline disabled:cursor-not-allowed"
                  >
                    {u.enabled ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
