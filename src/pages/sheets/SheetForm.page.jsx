import { useState } from "react";
import { Button, Input, Label } from "../../components/ui/index.js";

const EMPTY = { slug: "", name: "", description: "", orderIndex: 0 };

export default function SheetForm({ initial, onCancel, onSubmit }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ ...form, orderIndex: Number(form.orderIndex) || 0 });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-[12.5px] text-hard bg-hard-soft rounded-lg px-3 py-2">{error}</p>}
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" required value={form.slug} onChange={set("slug")} placeholder="e.g. a2z" />
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" required value={form.name} onChange={set("name")} placeholder="e.g. Striver's A2Z Sheet" />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" value={form.description ?? ""} onChange={set("description")} />
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
