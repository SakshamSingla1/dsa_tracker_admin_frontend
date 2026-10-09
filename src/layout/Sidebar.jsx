import { NavLink } from "react-router-dom";
import {
  FiBarChart2,
  FiBookOpen,
  FiLayers,
  FiList,
  FiSettings,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { usePermissions } from "../auth/usePermissions.js";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: FiBarChart2, permission: "DASHBOARD_VIEW" },
  { label: "Sheets", path: "/sheets", icon: FiBookOpen, permission: "SHEET_MANAGE" },
  { label: "Topics", path: "/topics", icon: FiLayers, permission: "TOPIC_MANAGE" },
  { label: "Problems", path: "/problems", icon: FiList, permission: "PROBLEM_MANAGE" },
  { label: "Users", path: "/users", icon: FiUsers, permission: "USER_MANAGE" },
  { label: "Roles", path: "/roles", icon: FiShield, permission: "ROLE_MANAGE" },
  { label: "Config", path: "/config", icon: FiSettings, permission: "CONFIG_MANAGE" },
];

export default function Sidebar() {
  const { has } = usePermissions();
  const visibleItems = NAV_ITEMS.filter((item) => has(item.permission));

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-line bg-paper-raised/60">
      <div className="flex items-center gap-2.5 px-4 h-16 shrink-0 border-b border-line">
        <span className="h-8 w-8 rounded-lg bg-accent text-accent-ink flex items-center justify-center text-[13px] font-bold shrink-0">
          {"</>"}
        </span>
        <div className="min-w-0">
          <h1 className="text-[14px] font-semibold text-ink leading-tight truncate">DSA Tracker</h1>
          <p className="text-[11px] text-ink-soft leading-tight truncate">Admin Portal</p>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 px-3 py-3" aria-label="Admin navigation">
        {visibleItems.length === 0 && (
          <p className="px-3 py-2 text-[12.5px] text-ink-soft">No admin screens are available to your role yet.</p>
        )}
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13.5px] font-medium transition-colors
              ${isActive ? "bg-accent text-accent-ink" : "text-ink-soft hover:text-ink hover:bg-ink/5"}`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
