import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { fetchProblem, fetchTopics } from "../../api/admin.js";
import { Button, Input, Label, Select, Spinner, Textarea } from "../../components/ui/index.js";

const EMPTY = {
  topicId: "",
  title: "",
  difficulty: "EASY",
  statement: "",
  timeComplexity: "",
  spaceComplexity: "",
  editorialUrl: "",
  videoUrl: "",
  externalUrl: "",
  orderIndex: 0,
  examples: [],
  constraints: [],
  hints: [],
  tags: [],
  testCases: [],
};

/** Lines-in-a-textarea editor for a plain string list (constraints/hints/tags) -- simpler
 *  than per-row add/remove UI for fields that are just "one item per line". */
function LinesField({ label, value, onChange }) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea
        rows={3}
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))}
        placeholder="One per line"
      />
    </div>
  );
}

function ExamplesField({ value, onChange }) {
  const update = (i, patch) => onChange(value.map((ex, idx) => (idx === i ? { ...ex, ...patch } : ex)));
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { input: "", output: "", explanation: "" }]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <Label className="mb-0">Examples</Label>
        <button type="button" onClick={add} className="text-[12px] text-accent flex items-center gap-1">
          <FiPlus className="h-3 w-3" /> Add example
        </button>
      </div>
      <div className="space-y-2">
        {value.map((ex, i) => (
          <div key={i} className="border border-line rounded-lg p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-ink-soft">Example {i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="text-ink-soft hover:text-hard">
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <Input placeholder="Input" value={ex.input} onChange={(e) => update(i, { input: e.target.value })} />
            <Input placeholder="Output" value={ex.output} onChange={(e) => update(i, { output: e.target.value })} />
            <Input placeholder="Explanation" value={ex.explanation ?? ""} onChange={(e) => update(i, { explanation: e.target.value })} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TestCasesField({ value, onChange }) {
  const update = (i, patch) => onChange(value.map((tc, idx) => (idx === i ? { ...tc, ...patch } : tc)));
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { id: null, input: "", expectedOutput: "", sample: false }]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <Label className="mb-0">Test Cases</Label>
        <button type="button" onClick={add} className="text-[12px] text-accent flex items-center gap-1">
          <FiPlus className="h-3 w-3" /> Add test case
        </button>
      </div>
      <div className="space-y-2">
        {value.map((tc, i) => (
          <div key={i} className="border border-line rounded-lg p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[12px] text-ink-soft">
                <input type="checkbox" checked={tc.sample} onChange={(e) => update(i, { sample: e.target.checked })} />
                Sample (visible to users / checked by "Run")
              </label>
              <button type="button" onClick={() => remove(i)} className="text-ink-soft hover:text-hard">
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <Input placeholder="Input" value={tc.input} onChange={(e) => update(i, { input: e.target.value })} />
            <Input
              placeholder="Expected output"
              value={tc.expectedOutput}
              onChange={(e) => update(i, { expectedOutput: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProblemForm({ problemId, onCancel, onSubmit }) {
  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!!problemId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopics().then(setTopics);
    if (problemId) {
      fetchProblem(problemId)
        .then((p) => setForm({ ...p, editorialUrl: p.editorialUrl ?? "", videoUrl: p.videoUrl ?? "", externalUrl: p.externalUrl ?? "" }))
        .finally(() => setLoading(false));
    }
  }, [problemId]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ ...form, topicId: Number(form.topicId), orderIndex: Number(form.orderIndex) || 0 });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-[12.5px] text-hard bg-hard-soft rounded-lg px-3 py-2">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="topicId">Topic</Label>
          <Select id="topicId" required value={form.topicId} onChange={set("topicId")}>
            <option value="" disabled>
              Choose a topic…
            </option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.sheetName} / {t.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select id="difficulty" value={form.difficulty} onChange={set("difficulty")}>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" required value={form.title} onChange={set("title")} />
      </div>

      <div>
        <Label htmlFor="statement">Statement</Label>
        <Textarea id="statement" rows={4} value={form.statement ?? ""} onChange={set("statement")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="timeComplexity">Time Complexity</Label>
          <Input id="timeComplexity" value={form.timeComplexity ?? ""} onChange={set("timeComplexity")} placeholder="O(n log n)" />
        </div>
        <div>
          <Label htmlFor="spaceComplexity">Space Complexity</Label>
          <Input id="spaceComplexity" value={form.spaceComplexity ?? ""} onChange={set("spaceComplexity")} placeholder="O(n)" />
        </div>
      </div>

      <ExamplesField value={form.examples} onChange={setField("examples")} />
      <LinesField label="Constraints" value={form.constraints} onChange={setField("constraints")} />
      <LinesField label="Hints" value={form.hints} onChange={setField("hints")} />
      <LinesField label="Tags" value={form.tags} onChange={setField("tags")} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="editorialUrl">Editorial URL</Label>
          <Input id="editorialUrl" value={form.editorialUrl} onChange={set("editorialUrl")} />
        </div>
        <div>
          <Label htmlFor="videoUrl">Video URL</Label>
          <Input id="videoUrl" value={form.videoUrl} onChange={set("videoUrl")} />
        </div>
        <div>
          <Label htmlFor="externalUrl">External URL (solve on)</Label>
          <Input id="externalUrl" value={form.externalUrl} onChange={set("externalUrl")} />
        </div>
        <div>
          <Label htmlFor="orderIndex">Order</Label>
          <Input id="orderIndex" type="number" value={form.orderIndex} onChange={set("orderIndex")} />
        </div>
      </div>

      <TestCasesField value={form.testCases} onChange={setField("testCases")} />

      <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-paper-raised">
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
