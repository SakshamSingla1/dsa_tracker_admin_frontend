import { useEffect, useState } from "react";
import { fetchSheets } from "../../api/admin.js";
import { Button, Input, Label, Select } from "../../components/ui/index.js";

const EMPTY = { sheetId: "", name: "", orderIndex: 0 };

export default function TopicForm({ initial, onCancel, onSubmit }) {
  const [sheets, setSheets] = useState([]);
  const [form, setForm] = useState(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSheets().then(setSheets);
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ sheetId: Number(form.sheetId), name: form.name, orderIndex: Number(form.orderIndex) || 0 });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-[12.5px] text-hard bg-hard-soft rounded-lg px-3 py-2">{error}</p>}
      <div>
        <Label htmlFor="sheetId">Sheet</Label>
        <Select id="sheetId" required value={form.sheetId} onChange={set("sheetId")}>
          <option value="" disabled>
            Choose a sheet…
          </option>
          {sheets.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" required value={form.name} onChange={set("name")} placeholder="e.g. Sorting Techniques" />
      </div>
      <div>
        <Label htmlFor="orderIndex">Order</Label>
        <Input id="orderIndex" type="number" value={form.orderIndex} onChange={set("orderIndex")} />
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
