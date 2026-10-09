import { useEffect, useState } from "react";
import { FiBook, FiCheckSquare, FiLayers, FiList, FiShield, FiUsers } from "react-icons/fi";
import { fetchDashboardStats } from "../api/admin.js";
import { Card, Spinner } from "../components/ui/index.js";

const CARDS = [
  { key: "totalUsers", label: "Total Users", icon: FiUsers },
  { key: "totalSheets", label: "Sheets", icon: FiBook },
  { key: "totalTopics", label: "Topics", icon: FiLayers },
  { key: "totalProblems", label: "Problems", icon: FiList },
  { key: "submissionsLast7Days", label: "Submissions (7d)", icon: FiCheckSquare },
  { key: "activeAdmins", label: "Active Admins", icon: FiShield },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-hard text-sm">{error}</p>;
  if (!stats) return <Spinner />;

  return (
    <div>
      <h1 className="text-[18px] font-semibold text-ink mb-5">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CARDS.map((c) => (
          <Card key={c.key} padding="lg" className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0">
              <c.icon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <div>
              <div className="mono text-xl font-bold text-ink leading-tight">{stats[c.key]}</div>
              <div className="text-[12.5px] text-ink-soft">{c.label}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
