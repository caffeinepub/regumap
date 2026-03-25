import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Loader2, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import { changePassword, getUserId } from "../services/authService";

const PREF_KEY = "regumap_preferences";
const PROFILE_KEY = "regumap_profile";

interface Preferences {
  theme: "light" | "dark";
  emailNotifications: boolean;
  inAppNotifications: boolean;
}

function loadPreferences(): Preferences {
  try {
    return (
      JSON.parse(localStorage.getItem(PREF_KEY) || "null") || {
        theme: "light",
        emailNotifications: true,
        inAppNotifications: true,
      }
    );
  } catch {
    return {
      theme: "light",
      emailNotifications: true,
      inAppNotifications: true,
    };
  }
}

function loadDisplayName(): string {
  try {
    return (
      JSON.parse(localStorage.getItem(PROFILE_KEY) || "null")?.displayName || ""
    );
  } catch {
    return "";
  }
}

export default function SettingsPage() {
  const userId = getUserId() || "";

  const [displayName, setDisplayName] = useState(loadDisplayName);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [prefs, setPrefs] = useState<Preferences>(loadPreferences);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  function saveProfile() {
    setIsSavingProfile(true);
    setTimeout(() => {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ displayName }));
      setIsSavingProfile(false);
      toast.success("Profile saved successfully.");
    }, 400);
  }

  function validateNewPassword(pw: string): string | null {
    if (pw.length < 8) return "Password must be at least 8 characters.";
    if (!/\d/.test(pw)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(pw))
      return "Password must contain at least one special character.";
    return null;
  }

  function savePassword() {
    setPasswordError("");
    setPasswordSuccess(false);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    const validErr = validateNewPassword(newPassword);
    if (validErr) {
      setPasswordError(validErr);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setIsSavingPassword(true);
    setTimeout(() => {
      const result = changePassword(userId, currentPassword, newPassword);
      setIsSavingPassword(false);
      if (result.success) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password changed successfully.");
      } else {
        setPasswordError(result.message);
      }
    }, 500);
  }

  function savePreferences() {
    setIsSavingPrefs(true);
    setTimeout(() => {
      localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
      setIsSavingPrefs(false);
      toast.success("Preferences saved.");
    }, 300);
  }

  return (
    <AppLayout
      title="Settings"
      subtitle="Manage your profile, security, and preferences."
    >
      <div className="max-w-2xl">
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger data-ocid="settings.profile.tab" value="profile">
              Profile
            </TabsTrigger>
            <TabsTrigger data-ocid="settings.security.tab" value="security">
              Security
            </TabsTrigger>
            <TabsTrigger
              data-ocid="settings.preferences.tab"
              value="preferences"
            >
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="bg-card border border-border rounded-lg p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Profile Information
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Update your display name.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="userId" className="text-sm font-medium">
                  User ID
                </Label>
                <Input
                  id="userId"
                  data-ocid="settings.userid.input"
                  value={userId}
                  readOnly
                  className="h-9 text-sm bg-muted text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Your User ID cannot be changed.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="displayName" className="text-sm font-medium">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  data-ocid="settings.display_name.input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter a display name"
                  className="h-9 text-sm"
                />
              </div>
              <Button
                data-ocid="settings.profile.save_button"
                onClick={saveProfile}
                disabled={isSavingProfile}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm font-medium"
              >
                {isSavingProfile ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {isSavingProfile ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="bg-card border border-border rounded-lg p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Change Password
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Min 8 characters, at least one number and one special
                  character.
                </p>
              </div>
              {passwordError && (
                <div
                  data-ocid="settings.password.error_state"
                  className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div
                  data-ocid="settings.password.success_state"
                  className="flex items-center gap-2 p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Password changed successfully.
                </div>
              )}
              <div className="space-y-1.5">
                <Label
                  htmlFor="currentPassword"
                  className="text-sm font-medium"
                >
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  data-ocid="settings.current_password.input"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  data-ocid="settings.new_password.input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  data-ocid="settings.confirm_password.input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="h-9 text-sm"
                />
              </div>
              <Button
                data-ocid="settings.password.save_button"
                onClick={savePassword}
                disabled={isSavingPassword}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm font-medium"
              >
                {isSavingPassword ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {isSavingPassword ? "Saving..." : "Change Password"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Preferences
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Customise your experience.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Theme
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    data-ocid="settings.theme_light.toggle"
                    onClick={() => setPrefs((p) => ({ ...p, theme: "light" }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      prefs.theme === "light"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <Sun className="w-4 h-4" /> Light
                  </button>
                  <button
                    type="button"
                    data-ocid="settings.theme_dark.toggle"
                    onClick={() => setPrefs((p) => ({ ...p, theme: "dark" }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      prefs.theme === "dark"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <Moon className="w-4 h-4" /> Dark
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Notification Preferences
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="emailNotifications"
                      data-ocid="settings.email_notifications.checkbox"
                      checked={prefs.emailNotifications}
                      onCheckedChange={(checked) =>
                        setPrefs((p) => ({
                          ...p,
                          emailNotifications: !!checked,
                        }))
                      }
                    />
                    <Label
                      htmlFor="emailNotifications"
                      className="cursor-pointer"
                    >
                      <p className="text-sm font-medium text-foreground">
                        Email notifications
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Receive mapping results and project updates via email.
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="inAppNotifications"
                      data-ocid="settings.inapp_notifications.checkbox"
                      checked={prefs.inAppNotifications}
                      onCheckedChange={(checked) =>
                        setPrefs((p) => ({
                          ...p,
                          inAppNotifications: !!checked,
                        }))
                      }
                    />
                    <Label
                      htmlFor="inAppNotifications"
                      className="cursor-pointer"
                    >
                      <p className="text-sm font-medium text-foreground">
                        In-app notifications
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Show notification badges and alerts within the app.
                      </p>
                    </Label>
                  </div>
                </div>
              </div>
              <Button
                data-ocid="settings.preferences.save_button"
                onClick={savePreferences}
                disabled={isSavingPrefs}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm font-medium"
              >
                {isSavingPrefs ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {isSavingPrefs ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
