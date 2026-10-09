import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { createSheet, deleteSheet, fetchSheets, updateSheet } from "../../api/admin.js";
import { Button, Modal, Spinner } from "../../components/ui/index.js";
import SheetForm from "./SheetForm.page.jsx";

export default function SheetListPage() {
  const [sheets, setSheets] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // null = closed, {} = create, {...sheet} = edit

  const load = () => fetchSheets().then(setSheets).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (form) => {
    if (editing.id) await updateSheet(editing.id, form);
    else await createSheet(form);
    setEditing(null);
    load();
  };

  const handleDelete = async (sheet) => {
    if (!window.confirm(`Delete sheet "${sheet.name}"? Every topic must be removed from it first.`)) return;
    try {
      await deleteSheet(sheet.id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p className="text-hard text-sm">{error}</p>;
  if (!sheets) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[18px] font-semibold text-ink">Sheets</h1>
        <Button variant="primary" icon={<FiPlus />} onClick={() => setEditing({})}>
          Add Sheet
        </Button>
      </div>

      <div className="border border-line rounded-xl overflow-hidden bg-paper-raised">
        <table className="w-full text-[13.5px]">
          <thead className="bg-ink/[0.03] text-ink-soft text-left">
            <tr>
              <th className="px-4 py-2.5 font-medium">Slug</th>
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Order</th>
              <th className="px-4 py-2.5 font-medium w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {sheets.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2.5 mono text-ink-soft">{s.slug}</td>
                <td className="px-4 py-2.5 text-ink">{s.name}</td>
                <td className="px-4 py-2.5 text-ink-soft">{s.orderIndex}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => setEditing(s)}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-ink-soft hover:text-ink hover:bg-ink/5"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(s)}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-ink-soft hover:text-hard hover:bg-hard-soft"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sheets.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink-soft">
                  No sheets yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? "Edit Sheet" : "Add Sheet"}>
        {editing !== null && <SheetForm initial={editing.id ? editing : null} onCancel={() => setEditing(null)} onSubmit={handleSubmit} />}
      </Modal>
    </div>
  );
}
