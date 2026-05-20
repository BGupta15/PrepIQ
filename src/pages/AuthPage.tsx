import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface AuthPageProps {
  mode: "login" | "signup";
  onLogin: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  onSignup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function AuthPage({ mode, onLogin, onSignup }: AuthPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const nameRegex = /^[A-Za-z\s]+$/;

  const isFormInvalid =
    !email.trim() ||
    !password.trim() ||
    (mode === "signup" &&
      (!name.trim() ||
        !confirmPassword.trim() ||
        password !== confirmPassword));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (mode === "signup" && !nameRegex.test(name.trim())) {
      toast({
        title: "Invalid name",
        description: "Name can only contain alphabets and spaces.",
        variant: "destructive",
      });
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "login") {
        const res = await onLogin(email, password);
        if (res.success) {
          toast({
            title: "Welcome back!",
            description: "Logged in successfully.",
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "Error",
            description: res.error,
            variant: "destructive",
          });
        }
      } else {
        const res = await onSignup(name, email, password);
        if (res.success) {
          toast({
            title: "Account created!",
            description: "Let's set up your profile.",
          });
          navigate("/onboarding");
        } else {
          toast({
            title: "Error",
            description: res.error,
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-primary/10 blur-3xl rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-primary/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 min-h-screen px-4 py-4 lg:py-8">
        <div className="max-w-6xl mx-auto min-h-[calc(100vh-3rem)] flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:flex flex-col justify-center"
            >
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 text-sm text-muted-foreground mb-6 backdrop-blur">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Smart interview preparation platform
                </div>

                <h1 className="text-5xl font-bold leading-tight tracking-tight">
                  Prepare smarter with{" "}
                  <span className="gradient-text">PrepIQ</span>
                </h1>

                <p className="text-muted-foreground text-lg mt-5 leading-relaxed">
                  PrepIQ combines AI-powered interview preparation, career
                  profiling, mock interviews, application tracking, and progress
                  analytics.
                </p>
              </div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md mx-auto"
            >
              <div className="bg-card border border-border rounded-2xl p-6 shadow-card backdrop-blur">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="mt-1 bg-secondary/50"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="mt-1 bg-secondary/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>

                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-secondary/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {mode === "signup" && (
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="mt-1 bg-secondary/50"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || isFormInvalid}
                    className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {mode === "login"
                          ? "Signing In..."
                          : "Creating Account..."}
                      </>
                    ) : (
                      <>
                        {mode === "login" ? "Sign In" : "Create Account"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-5">
                  {mode === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-primary hover:underline"
                      >
                        Sign up
                      </Link>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-primary hover:underline"
                      >
                        Sign in
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
