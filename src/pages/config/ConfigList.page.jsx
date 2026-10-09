import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { deleteConfig, fetchConfigs, upsertConfig } from "../../api/admin.js";
import { Button, Modal, Spinner } from "../../components/ui/index.js";
import ConfigForm from "./ConfigForm.page.jsx";

export default function ConfigListPage() {
  const [configs, setConfigs] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () => fetchConfigs().then(setConfigs).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (form) => {
    await upsertConfig(form.context, form.data);
    setEditing(null);
    load();
  };

  const handleDelete = async (config) => {
    if (!window.confirm(`Delete config "${config.context}"?`)) return;
    try {
      await deleteConfig(config.context);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p className="text-hard text-sm">{error}</p>;
  if (!configs) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[18px] font-semibold text-ink">Meta Config</h1>
        <Button variant="primary" icon={<FiPlus />} onClick={() => setEditing({})}>
          Add Config
        </Button>
      </div>

      <div className="border border-line rounded-xl overflow-hidden bg-paper-raised">
        <table className="w-full text-[13.5px]">
          <thead className="bg-ink/[0.03] text-ink-soft text-left">
            <tr>
              <th className="px-4 py-2.5 font-medium">Context</th>
              <th className="px-4 py-2.5 font-medium">Data</th>
              <th className="px-4 py-2.5 font-medium">Updated</th>
              <th className="px-4 py-2.5 font-medium w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {configs.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2.5 mono text-ink">{c.context}</td>
                <td className="px-4 py-2.5 text-ink-soft mono text-[12px] max-w-xs truncate">{c.data}</td>
                <td className="px-4 py-2.5 text-ink-soft">{new Date(c.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => setEditing({ context: c.context, data: c.data })}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-ink-soft hover:text-ink hover:bg-ink/5"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-ink-soft hover:text-hard hover:bg-hard-soft"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {configs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink-soft">
                  No config entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.context ? "Edit Config" : "Add Config"}>
        {editing !== null && <ConfigForm initial={editing.context ? editing : null} onCancel={() => setEditing(null)} onSubmit={handleSubmit} />}
      </Modal>
    </div>
  );
}
