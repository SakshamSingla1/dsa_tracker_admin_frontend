import { Outlet } from "react-router-dom";
import { usePermissions } from "./usePermissions.js";

/** Gates one route behind a permission code. Renders inline (not a redirect) when the
 *  logged-in user lacks it -- simpler than juggling redirect targets at this app's small
 *  route count, and makes it obvious to the admin exactly what's missing. */
export default function RequirePermission({ permission }) {
  const { has } = usePermissions();

  if (!has(permission)) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
        <h2 className="text-lg font-semibold text-ink">Access denied</h2>
        <p className="text-sm text-ink-soft max-w-sm">
          Your role doesn't include the <code className="mono text-[12.5px]">{permission}</code> permission. Ask a
          Super Admin to grant it if you need this screen.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
