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
  X,
  AlertCircle,
  Lock,
  User,
  Eye,
  EyeOff
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

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

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
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "continue_with",
            width: 320,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[440px] bg-white border border-slate-200/90 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 my-auto max-h-[92vh] overflow-y-auto overscroll-contain animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 text-center pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mx-auto mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            HITAM Portal Login
          </h2>
          <p className="text-slate-500 text-xs font-medium">
            Personal learning hub & placement assessment dashboard
          </p>
        </div>

        {/* Restriction Banner */}
        <div className="flex items-center gap-2.5 text-left text-xs p-3 rounded-2xl border text-blue-900 bg-blue-50/70 border-blue-100 font-medium">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-blue-600" />
          <span>Restricted to registered <strong>@hitam.org</strong> accounts or authorized credentials.</span>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab("google"); setErrorMsg(""); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === "google" 
                ? "bg-white text-slate-900 font-bold shadow-xs" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Google Sign-In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("manual"); setErrorMsg(""); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === "manual" 
                ? "bg-white text-slate-900 font-bold shadow-xs" 
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Roll Number Fallback
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-left text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl animate-fade-in font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: GOOGLE SIGN-IN + USERNAME & PASSWORD SECTION */}
        {activeTab === "google" && (
          <div className="space-y-4 pt-1">
            {/* Google OAuth Button */}
            <div className="flex flex-col items-center justify-center min-h-[50px] w-full">
              {isLoading && !credUsername ? (
                <div className="text-xs font-semibold text-slate-600 animate-pulse flex items-center gap-2 py-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                  Verifying Google account...
                </div>
              ) : (
                <div ref={googleBtnRef} className="w-full flex justify-center py-0.5" />
              )}
            </div>

            {/* Divider */}
            <div className="relative my-2 w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">
                  Or sign in with username & password
                </span>
              </div>
            </div>

            {/* Username & Password Form */}
            <form onSubmit={handleCredentialLogin} className="space-y-3.5 text-left">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
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
                    className="bg-slate-50/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs pl-9 font-medium h-10 transition-all"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
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
                    className="bg-slate-50/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs pl-9 pr-9 font-medium h-10 transition-all"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !credUsername.trim() || !credPassword.trim()}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-2.5 h-11 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-950/10 active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          <div className="space-y-3.5 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block text-left">
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
                className="bg-slate-50/70 border-slate-200 text-slate-900 font-mono uppercase placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs h-10 transition-all"
              />
            </div>

            {/* LIVE DECODING PREVIEW CARD */}
            {decoded ? (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 animate-fade-in text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified Identity
                  </span>
                  <Badge variant="outline" className="bg-white text-blue-700 border-blue-200 font-mono text-[11px] px-2.5 py-0.5 shadow-2xs font-bold">
                    {decoded.rollNumber}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Department</span>
                    <span className="font-semibold text-slate-800 truncate block" title={decoded.branchName}>
                      {decoded.branchName}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Batch</span>
                    <span className="font-semibold text-slate-800">
                      {decoded.joiningYear} – {decoded.graduationYear}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <Button
              onClick={handleManualLogin}
              disabled={!decoded || isLoading}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-2.5 h-11 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-950/10 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Access My Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* College Accreditation / Footer */}
        <div className="text-[11px] font-medium text-slate-400 text-center border-t border-slate-100 pt-3 flex items-center justify-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Hyderabad Institute of Technology and Management</span>
        </div>
      </div>
    </div>
  );
};

export default HitamLoginModal;
