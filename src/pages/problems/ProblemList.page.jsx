import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { createProblem, deleteProblem, fetchProblems, updateProblem } from "../../api/admin.js";
import { Badge, Button, Modal, Spinner } from "../../components/ui/index.js";
import ProblemForm from "./ProblemForm.page.jsx";

const DIFFICULTY_TONE = { EASY: "easy", MEDIUM: "medium", HARD: "hard" };

export default function ProblemListPage() {
  const [problems, setProblems] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(undefined); // undefined = closed, null = create, id = edit

  const load = () => fetchProblems().then(setProblems).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (form) => {
    if (editingId) await updateProblem(editingId, form);
    else await createProblem(form);
    setEditingId(undefined);
    load();
  };

  const handleDelete = async (problem) => {
    if (!window.confirm(`Delete "${problem.title}"? This fails if anyone has progress, submissions, or comments on it.`)) return;
    try {
      await deleteProblem(problem.id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <p className="text-hard text-sm">{error}</p>;
  if (!problems) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[18px] font-semibold text-ink">Problems</h1>
        <Button variant="primary" icon={<FiPlus />} onClick={() => setEditingId(null)}>
          Add Problem
        </Button>
      </div>

      <div className="border border-line rounded-xl overflow-hidden bg-paper-raised">
        <table className="w-full text-[13.5px]">
          <thead className="bg-ink/[0.03] text-ink-soft text-left">
            <tr>
              <th className="px-4 py-2.5 font-medium">Title</th>
              <th className="px-4 py-2.5 font-medium">Difficulty</th>
              <th className="px-4 py-2.5 font-medium">Topic</th>
              <th className="px-4 py-2.5 font-medium w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {problems.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2.5 text-ink">{p.title}</td>
                <td className="px-4 py-2.5">
                  <Badge tone={DIFFICULTY_TONE[p.difficulty] ?? "neutral"}>{p.difficulty}</Badge>
                </td>
                <td className="px-4 py-2.5 text-ink-soft">{p.topicName}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => setEditingId(p.id)}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-ink-soft hover:text-ink hover:bg-ink/5"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-ink-soft hover:text-hard hover:bg-hard-soft"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {problems.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink-soft">
                  No problems yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={editingId !== undefined}
        onClose={() => setEditingId(undefined)}
        title={editingId ? "Edit Problem" : "Add Problem"}
        size="xl"
      >
        {editingId !== undefined && (
          <ProblemForm problemId={editingId} onCancel={() => setEditingId(undefined)} onSubmit={handleSubmit} />
        )}
      </Modal>
    </div>
  );
}
