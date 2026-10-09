import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../api/client.js";
import { useAuth } from "../auth/AuthContext.jsx";
import AuthLayout from "../auth/AuthLayout.jsx";
import { DarkLabel, PasswordField, DarkInput } from "../auth/AuthFormFields.jsx";
import { Button } from "../components/ui/index.js";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.justRegistered ? location.state.email : "");
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
        setError("This account has no admin permissions yet. Ask a Super Admin to grant you a role.");
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
    <AuthLayout>
      <h1 className="text-white text-[20px] font-semibold">Welcome back</h1>
      <p className="text-white/50 text-[13px] mt-1 mb-6">Sign in to continue to the admin portal</p>

      {location.state?.justRegistered && !error && (
        <p className="text-[12.5px] text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 rounded-lg px-3 py-2 mb-4">
          Account created. Sign in below -- you'll see admin screens once a Super Admin grants you a role.
        </p>
      )}
      {error && (
        <p className="text-[12.5px] text-[#fb7185] bg-[#fb7185]/10 border border-[#fb7185]/20 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <DarkLabel htmlFor="email">Email</DarkLabel>
          <DarkInput id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus autoComplete="email" />
        </div>
        <div>
          <DarkLabel htmlFor="password">Password</DarkLabel>
          <PasswordField id="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full !bg-[#8b5cf6] !border-transparent hover:!brightness-110"
          loading={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-[12.5px] text-white/50 mt-5">
        Don't have an account?{" "}
        <Link to="/register" className="text-[#c4b5fd] hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
