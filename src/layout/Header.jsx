import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 h-16 px-5 lg:px-8 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        {user && (
          <div className="text-right leading-tight">
            <p className="text-[13px] font-medium text-ink">{user.displayName}</p>
            <p className="text-[11.5px] text-ink-soft">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          title="Log out"
          aria-label="Log out"
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-line text-ink-soft hover:text-ink hover:border-line-strong"
        >
          <FiLogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
