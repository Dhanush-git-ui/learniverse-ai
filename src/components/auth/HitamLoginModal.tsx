import React, { useState, useEffect, useMemo, useRef } from "react";
import { parseHitamCredentials, HitamStudentDemographics } from "@/utils/hitamParser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

import { 
  CheckCircle2, 
  ShieldAlert, 
  GraduationCap, 
  ArrowRight, 
  Building2, 
  Calendar, 
  BookOpen, 
  X,
  AlertCircle,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  KeyRound
} from "lucide-react";

const GOOGLE_CLIENT_ID = 
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 
  "162984921146-mh8jja4encmb5uaoen51v8bugbv1iegh.apps.googleusercontent.com";

interface HitamLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (studentData: HitamStudentDemographics) => void;
  initialTab?: "google" | "manual" | "admin";
}

declare global {
  interface Window {
    google?: any;
  }
}

export const HitamLoginModal: React.FC<HitamLoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess 
}) => {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"google" | "manual">("google");
  
  // Direct credential login fields inside the Google tab
  const [credUsername, setCredUsername] = useState("");
  const [credPassword, setCredPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Live decoding for manual fallback entry
  const decoded = useMemo(() => parseHitamCredentials(inputVal), [inputVal]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Initialize Google Identity Services
  useEffect(() => {
    if (!isOpen || activeTab !== "google") return;

    const initGoogle = () => {
      if (!window.google) return;

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          hosted_domain: "hitam.org",
          auto_select: false,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "filled_blue",
            size: "large",
            shape: "pill",
            text: "continue_with",
            width: 300,
          });
        }
      } catch (err) {
        console.error("Google init error:", err);
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogle();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isOpen, activeTab]);

  // Process Google OAuth Response
  const handleGoogleCallback = async (response: any) => {
    try {
      setIsLoading(true);
      setErrorMsg("");

      const idToken = response.credential;
      if (!idToken) throw new Error("No credential received from Google.");

      // Parse payload to get email
      const payloadBase64 = idToken.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      const email = (payload.email || "").toLowerCase().trim();

      // Client-side domain check
      if (!email.endsWith("@hitam.org")) {
        setErrorMsg(`Access Denied: ${email} is not an authorized @hitam.org college email.`);
        setIsLoading(false);
        return;
      }

      // Backend verification
      const res = await fetch("/api/auth/google-hitam-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken, email: email }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Authentication with college server failed.");
      }

      const data = await res.json();
      saveSessionAndClose(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Google authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Process Username & Password Login inside the Google tab
  const handleCredentialLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const u = credUsername.trim();
    const p = credPassword.trim();
    if (!u || !p) {
      setErrorMsg("Please enter both username/email and password.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      const isAdminAttempt = u.toLowerCase().startsWith("admin") || u.toLowerCase().includes("dhanush");
      const endpoint = isAdminAttempt ? "/api/auth/admin-login" : "/api/auth/hitam-login";
      const payload = isAdminAttempt
        ? { username: u, password: p }
        : { identifier: u, password: p };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Invalid login credentials. Please verify your details.");
      }

      const data = await res.json();
      saveSessionAndClose(data);
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to authenticate.");
    } finally {
      setIsLoading(false);
    }
  };

  // Process Manual Roll Number Login Fallback
  const handleManualLogin = async () => {
    const rawInput = inputVal.trim();
    if (!rawInput) {
      setErrorMsg("Please enter a valid @hitam.org email or 10-digit roll number.");
      return;
    }

    if (!decoded) {
      setErrorMsg("Please enter a valid @hitam.org email or 10-digit roll number.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/hitam-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: inputVal }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Authentication failed.");
      }

      const data = await res.json();
      saveSessionAndClose(data);
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to authenticate with server.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSessionAndClose = (data: any) => {
    localStorage.setItem("learniverse_token", data.token);
    const isAdmin = Boolean(
      data.student?.is_admin || 
      data.user?.role === "admin" || 
      data.student?.role === "admin" ||
      data.redirect_url?.includes("admin=true")
    );

    if (isAdmin) {
      localStorage.setItem("learniverse_admin_authed", "true");
    }
    if (data.user) {
      localStorage.setItem("learniverse_user", JSON.stringify(data.user));
    }
    localStorage.setItem("learniverse_student", JSON.stringify(data.student));
    localStorage.setItem("learniverse_roll_number", data.student.roll_number);
    window.dispatchEvent(new Event("learniverse_auth_change"));

    if (onLoginSuccess) {
      onLoginSuccess(data.student);
    }
    onClose();

    if (isAdmin) {
      window.location.href = data.redirect_url || "/assessment?admin=true";
    } else {
      window.location.href = "/dashboard";
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-950 border border-slate-800 text-white p-6 rounded-2xl shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-black border border-slate-800 text-blue-500 mb-1">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200 bg-clip-text text-transparent">
            HITAM Portal Login
          </h2>
          <p className="text-slate-400 text-xs">
            Personal learning hub & placement assessment dashboard
          </p>
        </div>

        {/* Restriction Banner */}
        <div className="flex items-center gap-2 text-left text-xs p-2.5 rounded-xl border text-slate-300 bg-slate-900 border-slate-800">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-blue-400" />
          <span>Restricted to registered <strong>@hitam.org</strong> accounts or authorized credentials.</span>
        </div>

        {/* Auth Mode Toggle: Only Google and Roll Number (No visible admin badge) */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab("google"); setErrorMsg(""); }}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === "google" 
                ? "bg-white text-black font-bold shadow-sm" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Google Sign-In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("manual"); setErrorMsg(""); }}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === "manual" 
                ? "bg-white text-black font-bold shadow-sm" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Roll Number Fallback
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-left text-xs text-rose-300 bg-rose-950/50 border border-rose-800/60 p-3 rounded-xl animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: GOOGLE SIGN-IN + USERNAME & PASSWORD SECTION */}
        {activeTab === "google" && (
          <div className="space-y-3.5">
            {/* Google OAuth Button */}
            <div className="py-1 flex flex-col items-center justify-center min-h-[50px] space-y-1">
              {isLoading && !credUsername ? (
                <div className="text-sm text-slate-300 animate-pulse flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  Verifying Google account...
                </div>
              ) : (
                <div ref={googleBtnRef} className="w-full flex justify-center" />
              )}
            </div>

            {/* Divider */}
            <div className="relative my-2 w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-slate-950 px-2.5 text-slate-400 font-semibold tracking-wider">
                  Or sign in with username & password
                </span>
              </div>
            </div>

            {/* Username & Password Form */}
            <form onSubmit={handleCredentialLogin} className="space-y-3 text-left">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Username / Email
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g. admin@2026 or college email"
                    value={credUsername}
                    onChange={(e) => {
                      setCredUsername(e.target.value);
                      setErrorMsg("");
                    }}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 text-xs pl-8 font-sans"
                    required
                  />
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={credPassword}
                    onChange={(e) => {
                      setCredPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 text-xs pl-8 pr-8 font-sans"
                    required
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !credUsername.trim() || !credPassword.trim()}
                className="w-full bg-white hover:bg-slate-200 text-black font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                {isLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* TAB 2: MANUAL ROLL NUMBER ENTRY */}
        {activeTab === "manual" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block text-left">
                College Roll Number
              </label>
              <Input
                placeholder="e.g. 24E51A66G7 or 24e51a66g7@hitam.org"
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setErrorMsg("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && decoded && !isLoading) {
                    handleManualLogin();
                  }
                }}
                className="bg-slate-900 border-slate-700 text-white font-mono uppercase placeholder:text-slate-500 focus:border-blue-500 text-xs"
              />
            </div>

            {/* LIVE DECODING PREVIEW CARD */}
            {decoded ? (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 animate-fade-in text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Identity
                  </span>
                  <Badge variant="outline" className="bg-transparent text-blue-400 border border-blue-500/60 font-mono text-[11px] px-2 py-0.5">
                    {decoded.rollNumber}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase">Department</span>
                    <span className="font-semibold text-slate-200 truncate block" title={decoded.branchName}>
                      {decoded.branchName}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase">Batch</span>
                    <span className="font-semibold text-slate-200">
                      {decoded.joiningYear} – {decoded.graduationYear}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <Button
              onClick={handleManualLogin}
              disabled={!decoded || isLoading}
              className="w-full bg-white hover:bg-slate-200 text-black font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              {isLoading ? "Signing in..." : "Access My Dashboard"}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        <div className="text-[11px] text-slate-500 text-center border-t border-slate-900 pt-3 flex items-center justify-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-slate-600" />
          <span>Hyderabad Institute of Technology and Management</span>
        </div>
      </div>
    </div>
  );
};

export default HitamLoginModal;
