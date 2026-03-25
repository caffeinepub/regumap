import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { signup } from "../services/authService";

function validatePassword(pw: string): string[] {
  const errors: string[] = [];
  if (pw.length < 8) errors.push("At least 8 characters");
  if (!/\d/.test(pw)) errors.push("At least one number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw))
    errors.push("At least one special character");
  return errors;
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!userId.trim()) newErrors.userId = "User ID is required";
    const pwErrors = validatePassword(password);
    if (pwErrors.length > 0) newErrors.password = pwErrors.join("; ");
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      const result = signup(userId.trim(), password);
      setIsLoading(false);
      if (result.success) {
        navigate({ to: "/login", search: { success: result.message } });
      } else {
        setApiError(result.message);
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
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Get started with ReguMap today
          </p>

          {apiError && (
            <div
              data-ocid="signup.error_state"
              className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive"
            >
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="userId" className="text-sm font-medium">
                User ID
              </Label>
              <Input
                id="userId"
                data-ocid="signup.input"
                type="text"
                placeholder="Choose a unique user ID or email"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setErrors((p) => ({ ...p, userId: "" }));
                }}
                className={`h-10 ${errors.userId ? "border-destructive" : ""}`}
              />
              {errors.userId && (
                <p
                  data-ocid="signup.userid_error"
                  className="text-xs text-destructive"
                >
                  {errors.userId}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                data-ocid="signup.password_input"
                type="password"
                placeholder="Min 8 chars, 1 number, 1 special char"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: "" }));
                }}
                className={`h-10 ${errors.password ? "border-destructive" : ""}`}
              />
              {errors.password && (
                <p
                  data-ocid="signup.password_error"
                  className="text-xs text-destructive"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                data-ocid="signup.confirm_input"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((p) => ({ ...p, confirmPassword: "" }));
                }}
                className={`h-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              {errors.confirmPassword && (
                <p
                  data-ocid="signup.confirm_error"
                  className="text-xs text-destructive"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              data-ocid="signup.submit_button"
              type="submit"
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <button
              type="button"
              data-ocid="signup.link"
              onClick={() => navigate({ to: "/login" })}
              className="text-primary font-medium hover:underline"
            >
              Sign in
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
