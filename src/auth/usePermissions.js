import { useAuth } from "./AuthContext.jsx";

/** A flat permission-code check -- this app has ~7 codes total, so no nested module tree
 *  (unlike a larger admin portal) is needed, just a direct membership test. */
export function usePermissions() {
  const { user } = useAuth();
  const permissions = user?.permissions ?? [];
  return {
    permissions,
    has: (code) => permissions.includes(code),
    hasAny: (codes) => codes.some((code) => permissions.includes(code)),
  };
}
