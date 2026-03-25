import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { login } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("success");
    if (msg) setSuccessMsg(decodeURIComponent(msg));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      const result = login(userId.trim(), password);
      setIsLoading(false);
      if (result.success) {
        navigate({ to: "/dashboard" });
      } else {
        setError(result.message);
      }
    }, 400);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight">
            ReguMap
          </span>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-card p-8">
          <h1 className="text-xl font-semibold text-foreground mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to your account to continue
          </p>

          {successMsg && (
            <div className="mb-4 p-3 rounded-md bg-success/10 border border-success/20 text-sm text-foreground">
              ✓ {successMsg}
            </div>
          )}

          {error && (
            <div
              data-ocid="login.error_state"
              className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="userId" className="text-sm font-medium">
                User ID
              </Label>
              <Input
                id="userId"
                data-ocid="login.input"
                type="text"
                placeholder="Enter your user ID or email"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                data-ocid="login.password_input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10"
              />
            </div>
            <Button
              data-ocid="login.submit_button"
              type="submit"
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Don't have an account?{" "}
            <button
              type="button"
              data-ocid="login.link"
              onClick={() => navigate({ to: "/signup" })}
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
