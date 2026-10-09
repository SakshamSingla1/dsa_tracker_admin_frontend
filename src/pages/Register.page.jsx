import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api/client.js";
import { useAuth } from "../auth/AuthContext.jsx";
import AuthLayout from "../auth/AuthLayout.jsx";
import { DarkInput, DarkLabel, PasswordField } from "../auth/AuthFormFields.jsx";
import { Button } from "../components/ui/index.js";

export default function RegisterPage() {
  const { register, logout } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, displayName);
      // A fresh account has no role/permissions yet -- send them to sign in explicitly
      // rather than straight into a dashboard they can't see anything on.
      logout();
      navigate("/login", { replace: true, state: { justRegistered: true, email } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-white text-[20px] font-semibold">Create an account</h1>
      <p className="text-white/50 text-[13px] mt-1 mb-6">
        You'll need a Super Admin to grant you a role before you can use the admin portal.
      </p>

      {error && (
        <p className="text-[12.5px] text-[#fb7185] bg-[#fb7185]/10 border border-[#fb7185]/20 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <DarkLabel htmlFor="displayName">Name</DarkLabel>
          <DarkInput id="displayName" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} autoFocus autoComplete="name" />
        </div>
        <div>
          <DarkLabel htmlFor="email">Email</DarkLabel>
          <DarkInput id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div>
          <DarkLabel htmlFor="password">Password</DarkLabel>
          <PasswordField id="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </div>
        <div>
          <DarkLabel htmlFor="confirmPassword">Confirm password</DarkLabel>
          <PasswordField id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full !bg-[#8b5cf6] !border-transparent hover:!brightness-110"
          loading={loading}
        >
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="text-center text-[12.5px] text-white/50 mt-5">
        Already have an account?{" "}
        <Link to="/login" className="text-[#c4b5fd] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
