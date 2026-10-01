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
  AlertCircle 
} from "lucide-react";

const GOOGLE_CLIENT_ID = 
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 
  "162984921146-mh8jja4encmb5uaoen51v8bugbv1iegh.apps.googleusercontent.com";

interface HitamLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (studentData: HitamStudentDemographics) => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

export const HitamLoginModal: React.FC<HitamLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"google" | "manual">("google");
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
    if (!isOpen) return;

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

  // Process Manual Roll Number Login Fallback
  const handleManualLogin = async () => {
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
    localStorage.setItem("learniverse_student", JSON.stringify(data.student));
    localStorage.setItem("learniverse_roll_number", data.student.roll_number);
    window.dispatchEvent(new Event("learniverse_auth_change"));

    if (onLoginSuccess) {
      onLoginSuccess(data.student);
    }
    onClose();
    window.location.href = "/dashboard";
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
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-1">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            HITAM Student Login
          </h2>
          <p className="text-slate-400 text-xs">
            Personal learning hub & placement assessment dashboard
          </p>
        </div>

        {/* Restriction Banner */}
        <div className="flex items-center gap-2 text-left text-xs text-blue-300/90 bg-blue-950/40 border border-blue-800/40 p-2.5 rounded-xl">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-blue-400" />
          <span>Restricted to registered <strong>@hitam.org</strong> student Google accounts.</span>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab("google"); setErrorMsg(""); }}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === "google" 
                ? "bg-blue-600 text-white shadow-sm" 
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
                ? "bg-blue-600 text-white shadow-sm" 
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

        {/* TAB 1: GOOGLE SIGN-IN */}
        {activeTab === "google" && (
          <div className="py-3 flex flex-col items-center justify-center min-h-[70px] space-y-2">
            {isLoading ? (
              <div className="text-sm text-slate-300 animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                Verifying student credentials with HITAM...
              </div>
            ) : (
              <div ref={googleBtnRef} className="w-full flex justify-center" />
            )}
            <p className="text-[11px] text-slate-500 text-center">
              Requires active login to your college Google Workspace account.
            </p>
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
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-700/50 space-y-2 animate-fade-in text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Identity
                  </span>
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/40 font-mono text-[11px] px-2 py-0.5">
                    {decoded.rollNumber}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[9px] uppercase">Department</span>
                    <span className="font-semibold text-slate-200 truncate block" title={decoded.branchName}>
                      {decoded.branchName}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
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
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
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
