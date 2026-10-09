import { useState } from "react";
import { Button, Input, Label, Textarea } from "../../components/ui/index.js";

const EMPTY = { context: "", data: "{}" };

export default function ConfigForm({ initial, onCancel, onSubmit }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      JSON.parse(form.data);
    } catch {
      setError("Data must be valid JSON.");
      return;
    }
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
        <Label htmlFor="context">Context key</Label>
        <Input
          id="context"
          required
          disabled={!!initial}
          value={form.context}
          onChange={(e) => setForm((f) => ({ ...f, context: e.target.value }))}
          placeholder="e.g. ANNOUNCEMENT_BANNER"
        />
        {initial && <p className="text-[11.5px] text-ink-soft mt-1">The context key can't be changed after creation.</p>}
      </div>
      <div>
        <Label htmlFor="data">Data (JSON)</Label>
        <Textarea
          id="data"
          rows={8}
          className="font-mono text-[12.5px]"
          value={form.data}
          onChange={(e) => setForm((f) => ({ ...f, data: e.target.value }))}
        />
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
