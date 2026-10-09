import { useEffect, useState } from "react";
import { fetchPermissions } from "../../api/admin.js";
import { Button, Input, Label } from "../../components/ui/index.js";

const EMPTY = { name: "", description: "", permissionIds: [] };

export default function RoleForm({ initial, onCancel, onSubmit }) {
  const [permissions, setPermissions] = useState([]);
  const [form, setForm] = useState(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPermissions().then(setPermissions);
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const togglePermission = (id) => {
    setForm((f) => ({
      ...f,
      permissionIds: f.permissionIds.includes(id) ? f.permissionIds.filter((p) => p !== id) : [...f.permissionIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-[12.5px] text-hard bg-hard-soft rounded-lg px-3 py-2">{error}</p>}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" required value={form.name} onChange={set("name")} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" value={form.description ?? ""} onChange={set("description")} />
      </div>
      <div>
        <Label>Permissions</Label>
        <div className="space-y-1.5 border border-line rounded-lg p-2.5">
          {permissions.map((p) => (
            <label key={p.id} className="flex items-start gap-2 text-[12.5px]">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={form.permissionIds.includes(p.id)}
                onChange={() => togglePermission(p.id)}
              />
              <span>
                <span className="mono text-ink">{p.code}</span>
                {p.description && <span className="text-ink-soft"> — {p.description}</span>}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={saving}>
          Save
        </Button>
      </div>
    </form>
  );
}
