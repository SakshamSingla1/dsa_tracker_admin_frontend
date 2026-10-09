import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { createRole, deleteRole, fetchPermissions, fetchRoles, updateRole } from "../../api/admin.js";
import { Badge, Button, Modal, Spinner } from "../../components/ui/index.js";
import RoleForm from "./RoleForm.page.jsx";

export default function RoleListPage() {
  const [roles, setRoles] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () =>
    Promise.all([fetchRoles(), fetchPermissions()])
      .then(([r, p]) => {
        setRoles(r);
        setPermissions(p);
      })
      .catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const codeToId = Object.fromEntries(permissions.map((p) => [p.code, p.id]));

  const openEdit = (role) =>
    setEditing({
      id: role.id,
      name: role.name,
      description: role.description,
      permissionIds: role.permissionCodes.map((c) => codeToId[c]).filter(Boolean),
    });

  const handleSubmit = async (form) => {
    if (editing.id) await updateRole(editing.id, form);
    else await createRole(form);
    setEditing(null);
    load();
  };

  const handleDelete = async (role) => {
    if (!window.confirm(`Delete role "${role.name}"? Unassign it from every user first.`)) return;
    try {
      await deleteRole(role.id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p className="text-hard text-sm">{error}</p>;
  if (!roles) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[18px] font-semibold text-ink">Roles</h1>
        <Button variant="primary" icon={<FiPlus />} onClick={() => setEditing({})}>
          Add Role
        </Button>
      </div>

      <div className="space-y-3">
        {roles.map((r) => (
          <div key={r.id} className="border border-line rounded-xl bg-paper-raised p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[14px] font-semibold text-ink">{r.name}</h3>
                {r.description && <p className="text-[12.5px] text-ink-soft mt-0.5">{r.description}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {r.permissionCodes.map((c) => (
                    <Badge key={c} tone="accent" size="sm">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(r)}
                  className="h-7 w-7 flex items-center justify-center rounded-md text-ink-soft hover:text-ink hover:bg-ink/5"
                >
                  <FiEdit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(r)}
                  className="h-7 w-7 flex items-center justify-center rounded-md text-ink-soft hover:text-hard hover:bg-hard-soft"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? "Edit Role" : "Add Role"}>
        {editing !== null && <RoleForm initial={editing.id ? editing : null} onCancel={() => setEditing(null)} onSubmit={handleSubmit} />}
      </Modal>
    </div>
  );
}
