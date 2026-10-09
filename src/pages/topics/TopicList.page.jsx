import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { createTopic, deleteTopic, fetchTopics, updateTopic } from "../../api/admin.js";
import { Button, Modal, Spinner } from "../../components/ui/index.js";
import TopicForm from "./TopicForm.page.jsx";

export default function TopicListPage() {
  const [topics, setTopics] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () => fetchTopics().then(setTopics).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (form) => {
    if (editing.id) await updateTopic(editing.id, form);
    else await createTopic(form);
    setEditing(null);
    load();
  };

  const handleDelete = async (topic) => {
    if (!window.confirm(`Delete topic "${topic.name}"? Every problem must be removed from it first.`)) return;
    try {
      await deleteTopic(topic.id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p className="text-hard text-sm">{error}</p>;
  if (!topics) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[18px] font-semibold text-ink">Topics</h1>
        <Button variant="primary" icon={<FiPlus />} onClick={() => setEditing({})}>
          Add Topic
        </Button>
      </div>

      <div className="border border-line rounded-xl overflow-hidden bg-paper-raised">
        <table className="w-full text-[13.5px]">
          <thead className="bg-ink/[0.03] text-ink-soft text-left">
            <tr>
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Sheet</th>
              <th className="px-4 py-2.5 font-medium">Problems</th>
              <th className="px-4 py-2.5 font-medium">Order</th>
              <th className="px-4 py-2.5 font-medium w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {topics.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-2.5 text-ink">{t.name}</td>
                <td className="px-4 py-2.5 text-ink-soft">{t.sheetName}</td>
                <td className="px-4 py-2.5 text-ink-soft">{t.problemCount}</td>
                <td className="px-4 py-2.5 text-ink-soft">{t.orderIndex}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => setEditing({ id: t.id, sheetId: t.sheetId, name: t.name, orderIndex: t.orderIndex })}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-ink-soft hover:text-ink hover:bg-ink/5"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t)}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-ink-soft hover:text-hard hover:bg-hard-soft"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {topics.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink-soft">
                  No topics yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? "Edit Topic" : "Add Topic"}>
        {editing !== null && <TopicForm initial={editing.id ? editing : null} onCancel={() => setEditing(null)} onSubmit={handleSubmit} />}
      </Modal>
    </div>
  );
}
