import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { ApiError } from "../api/client.js";
import { Button, Input, Label } from "../components/ui/index.js";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.permissions.length === 0) {
        setError("This account has no admin permissions. Ask a Super Admin to grant you a role.");
        return;
      }
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-paper-raised border border-line rounded-xl p-6 space-y-4">
        <div className="text-center mb-2">
          <span className="inline-flex h-10 w-10 rounded-lg bg-accent text-accent-ink items-center justify-center text-[14px] font-bold">
            {"</>"}
          </span>
          <h1 className="text-[16px] font-semibold text-ink mt-3">DSA Tracker Admin</h1>
          <p className="text-[12.5px] text-ink-soft mt-0.5">Sign in with your account</p>
        </div>

        {error && <p className="text-[12.5px] text-hard bg-hard-soft rounded-lg px-3 py-2">{error}</p>}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <Button type="submit" variant="primary" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>
    </div>
  );
}
