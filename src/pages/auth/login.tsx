import { useState, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loginUser, guestLogin } from "@/features/auth/authThunks";
import { clearError } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Please enter your password"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ForgotStep = "email" | "otp" | "password" | "success";

// ---------- Forgot Password Dialog Component ----------
function ForgotPasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState<ForgotStep>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpDisplay, setOtpDisplay] = useState("");

  const resetState = useCallback(() => {
    setStep("email");
    setEmail("");
    setError("");
    setLoading(false);
    setGeneratedOtp("");
    setOtpValue("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setOtpDisplay("");
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) resetState();
    onOpenChange(open);
  };

  // Step 1: Validate email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const registeredUsers = JSON.parse(
      localStorage.getItem("projex-registered-users") || "[]",
    );
    const userExists = registeredUsers.some(
      (u: { email: string }) => u.email === email,
    );

    setLoading(false);

    if (!userExists) {
      setError("No account found with this email address");
      return;
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpDisplay(otp);
    setStep("otp");
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    if (otpValue !== generatedOtp) {
      setError("Invalid verification code. Please try again.");
      return;
    }

    setStep("password");
  };

  // Step 3: Reset password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!confirmPassword) {
      setError("Please confirm your new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update password in localStorage
    const storedPasswords: Record<string, string> = JSON.parse(
      localStorage.getItem("projex-user-passwords") || "{}",
    );
    storedPasswords[email] = newPassword;
    localStorage.setItem(
      "projex-user-passwords",
      JSON.stringify(storedPasswords),
    );

    setLoading(false);
    setStep("success");
  };

  const stepIcons = {
    email: <Mail className="h-6 w-6 text-primary" />,
    otp: <ShieldCheck className="h-6 w-6 text-primary" />,
    password: <KeyRound className="h-6 w-6 text-primary" />,
    success: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
  };

  const stepTitles = {
    email: "Reset your password",
    otp: "Verify your identity",
    password: "Create new password",
    success: "Password updated!",
  };

  const stepDescriptions = {
    email: "Enter the email address associated with your account.",
    otp: "",
    password: "Choose a strong password for your account.",
    success: "Your password has been reset successfully. You can now sign in with your new password.",
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div
            className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
              step === "success" ? "bg-emerald-500/10" : "bg-primary/10"
            }`}
          >
            {stepIcons[step]}
          </div>
          <DialogTitle className="text-center">
            {stepTitles[step]}
          </DialogTitle>
          {stepDescriptions[step] && (
            <DialogDescription className="text-center">
              {stepDescriptions[step]}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Step 1: Email */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4 pt-1">
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email address</Label>
              <Input
                id="forgot-email"
                type="text"
                placeholder="jamshed@projex.io"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Continue"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
              >
                Back to sign in
              </button>
            </p>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4 pt-1">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                Your verification code is
              </p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-[0.3em] text-primary">
                {otpDisplay}
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-col items-center gap-2">
              <Label>Enter the 6-digit code</Label>
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={setOtpValue}
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading || otpValue.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Didn&apos;t receive a code?{" "}
              <button
                type="button"
                onClick={() => {
                  const otp = Math.floor(
                    100000 + Math.random() * 900000,
                  ).toString();
                  setGeneratedOtp(otp);
                  setOtpDisplay(otp);
                  setOtpValue("");
                  setError("");
                  toast.info("New code generated!");
                }}
                className="cursor-pointer font-medium text-primary underline-offset-4 hover:underline"
              >
                Resend code
              </button>
            </p>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-1">
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoFocus
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <div className="space-y-4 pt-1">
            <Button
              className="w-full cursor-pointer"
              onClick={() => {
                handleOpenChange(false);
                toast.success("Password reset complete!", {
                  description: "You can now sign in with your new password.",
                });
              }}
            >
              Back to Sign In
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth,
  );
  const [guestLoading, setGuestLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    dispatch(clearError());
    await dispatch(loginUser(data));
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    dispatch(clearError());
    await dispatch(guestLogin());
    setGuestLoading(false);
  };


  return (
    <div className="relative flex min-h-svh items-center justify-center bg-linear-to-br from-background via-background to-muted p-4">
      {/* Theme toggle */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Zap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">ProjeX</h1>
          <p className="text-sm text-muted-foreground">
            Project Management Dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="jamshed@projex.io"
                  autoComplete="email"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="cursor-pointer text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Separator + Guest Access */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="h-px flex-1"
              style={{
                backgroundImage:
                  "linear-gradient(to right, transparent, #667eea, #764ba2)",
              }}
            />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              or
            </span>
            <div
              className="h-px flex-1"
              style={{
                backgroundImage:
                  "linear-gradient(to left, transparent, #667eea, #764ba2)",
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading || guestLoading}
            className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-size-[300%_100%] bg-position-[0%_0%] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-500 ease-in-out hover:bg-position-[100%_0%] hover:shadow-lg disabled:opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(to right, #667eea, #764ba2, #6B8DD6, #8E37D7)",
            }}
          >
            {guestLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserRound className="h-4 w-4" />
            )}
            Continue as Guest
          </button>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} />
    </div>
  );
}
