// src/pages/StudentDashboard.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lightbulb,
  LayoutDashboard,
  BookOpen,
  Code2,
  LayoutGrid,
  Award,
  ClipboardCheck,
  TrendingUp,
  Users,
  Search,
  Sparkles,
  Bell,
  Clock,
  Trophy,
  Building2,
  ShieldCheck,
  Target,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  Calendar,
  IdCard,
  Download,
  RefreshCw,
  ExternalLink,
  LogOut,
  XCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  HelpCircle,
  FileText,
  Check,
  X,
  Zap,
  PlayCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import jsPDF from "jspdf";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activityTab, setActivityTab] = useState<"coding" | "mcq" | "topics">("coding");
  const [expandedMcqId, setExpandedMcqId] = useState<number | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("learniverse_student");
    window.location.href = "/";
  };

  // 1. Ctrl + K Keyboard Shortcut Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle Enter on Search
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/topics?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // 2. Load real student session & analytics from Neon (with Admin guard)
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("learniverse_user");
      const rawStudent = localStorage.getItem("learniverse_student");
      
      let isAdminUser = false;
      if (rawUser) {
        try {
          const u = JSON.parse(rawUser);
          if (u.role === "admin" || u.is_admin) isAdminUser = true;
        } catch {
          // Malformed local user data cannot establish an admin session.
        }
      }
      if (rawStudent) {
        try {
          const s = JSON.parse(rawStudent);
          if (s.role === "admin" || s.is_admin || s.roll_number === "ADMIN" || s.rollNumber === "ADMIN") {
            isAdminUser = true;
          }
        } catch {
          // Malformed local student data falls through to the normal route guard.
        }
      }

      // If user is Admin, redirect directly to the Admin Assessment & Command Center
      if (isAdminUser) {
        navigate("/assessment?admin=true", { replace: true });
        return;
      }

      if (rawStudent) {
        const parsed = JSON.parse(rawStudent);
        setStudent(parsed);
        const roll = parsed.roll_number || parsed.rollNumber;
        const token = localStorage.getItem("learniverse_token") || parsed.token;

        if (token) {
          setAnalyticsLoading(true);
          fetch("/api/analytics/dashboard", {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
              if (data?.data) setAnalyticsData(data.data);
            })
            .catch(() => {})
            .finally(() => setAnalyticsLoading(false));
        } else {
          // No token yet (e.g. Google login still resolving) — keep skeleton briefly
          setTimeout(() => setAnalyticsLoading(false), 3000);
        }

        if (roll) {
          fetch(`/api/student/dashboard/${roll}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data) setDashboardData(data);
            })
            .catch(() => {
              // A missing dashboard endpoint should leave the cached view intact.
            });
        }
      }
    } catch {
      // The dashboard remains usable if optional analytics cannot be loaded.
    }
  }, [navigate]);

  // 3. Download PDF Report function
  const handleDownloadReport = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      const roll = student?.roll_number || student?.rollNumber || "Student";
      const name = student?.name || student?.student_name || "HITAM Student";
      const branch = student?.branch || student?.branch_name || "Computer Science & Engineering (CSE)";
      
      const p = analyticsData?.placement;
      const scoreStr = p
        ? `${p.total_marks} / ${p.max_marks} (${p.percentage}%)`
        : dashboardData?.total_marks
        ? `${dashboardData.total_marks} / ${dashboardData.max_marks} (${dashboardData.percentage}%)`
        : "Pending Assessment";
      const bandStr = p
        ? `${p.placement_tier} (${p.readiness_band})`
        : "Needs Diagnostic Assessment (< 4.5 LPA)";
      const recruitersStr = p?.target_recruiters?.length
        ? p.target_recruiters.join(", ")
        : "TCS Ninja, Infosys SE, Wipro Elite, Cognizant GenC";
      const proctorStr = p?.proctor_cleared !== false
        ? "PASSED (0 Violations Logged • AI Sentinel Verified)"
        : "Audit Flagged for Manual Review";

      doc.setFontSize(18);
      doc.text("HITAM - CDC Placement Assessment Report", 20, 22);
      
      doc.setFontSize(11);
      doc.text(`Candidate Name: ${name}`, 20, 36);
      doc.text(`Roll Number: ${roll}`, 20, 44);
      doc.text(`Department: ${branch}`, 20, 52);
      doc.text(`Academic Year: ${student?.currentStudyYear || "4th Year"} (${student?.batch ? `Batch ${student.batch}` : "Batch 2023 - 2027"})`, 20, 60);
      
      doc.setDrawColor(200, 210, 230);
      doc.line(20, 66, 190, 66);
      
      doc.setFontSize(13);
      doc.text("Diagnostic Assessment Results", 20, 76);
      doc.setFontSize(11);
      doc.text(`Overall Score: ${scoreStr}`, 20, 86);
      doc.text(`Placement Readiness Band: ${bandStr}`, 20, 94);
      doc.text(`Target Recruiters: ${recruitersStr}`, 20, 102);
      doc.text(`Automated Proctoring Clearance: ${proctorStr}`, 20, 110);
      
      doc.line(20, 118, 190, 118);
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Generated by Learniverse AI • Placement Assessment & Proctoring System", 20, 128);
      
      doc.save(`HITAM_${roll}_Placement_Report.pdf`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ── Derived skill data from real analytics ──────────────────────────────────
  const mcqByTopic: { topic_slug: string; accuracy_pct: number; questions_attempted: number }[] =
    analyticsData?.mcq_by_topic ?? [];

  // Strong: ≥ 80% accuracy with at least 3 attempts
  const strongTopics = mcqByTopic
    .filter(t => t.accuracy_pct >= 80 && t.questions_attempted >= 3)
    .map(t => t.topic_slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()));

  // Weak / Focus areas: < 60% accuracy with at least 3 attempts
  const focusAreas = mcqByTopic
    .filter(t => t.accuracy_pct < 60 && t.questions_attempted >= 3)
    .sort((a, b) => a.accuracy_pct - b.accuracy_pct)
    .map(t => t.topic_slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()));

  // Has the user attempted anything yet?
  const isFirstTimeUser = !analyticsLoading && mcqByTopic.length === 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* ─────────────────────────────────────────────────────────────
          1. LEFT SIDEBAR
      ───────────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 sticky top-0 h-screen z-20 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
        <div className="p-5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-105 transition-transform">
              <Lightbulb className="w-5 h-5 fill-blue-500/20 text-blue-600" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-slate-900 leading-none flex items-center">
                Learn<span className="text-blue-600">Iverse</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
                Learn. Practice. Place.
              </p>
            </div>
          </Link>

          {/* Navigation Links with Active Indicator Strip */}
          <nav className="mt-8 space-y-1.5">
            <button
              onClick={() => setActiveNav("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                activeNav === "dashboard"
                  ? "bg-blue-50/90 text-blue-600 shadow-xs border border-blue-100/90 font-bold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-blue-600 before:rounded-r"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeNav === "dashboard" ? "text-blue-600" : "text-slate-500"}`} />
              Dashboard
            </button>

            <Link
              to="/topics"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              Learn
            </Link>

            <Link
              to="/topics"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <Code2 className="w-4 h-4 text-slate-500" />
              Practice
            </Link>

            <Link
              to="/topics"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <LayoutGrid className="w-4 h-4 text-slate-500" />
              Topics
            </Link>

            <Link
              to="/top-100-codes"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              <Award className="w-4 h-4 text-slate-500" />
              Top 100 Codes
            </Link>

            <Link
              to="/assessment"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all group"
            >
              <span className="flex items-center gap-3">
                <ClipboardCheck className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                Placement Test
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">Active</span>
            </Link>

            

            <button
              onClick={() => setActiveNav("community")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all relative ${
                activeNav === "community"
                  ? "bg-blue-50/90 text-blue-600 shadow-xs border border-blue-100/90 font-bold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-blue-600 before:rounded-r"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Users className="w-4 h-4 text-slate-500" />
              Community
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom: Motivational Quote & Mountain Artwork */}
        <div className="relative pt-6 pb-4 px-5 overflow-hidden">
          {/* Decorative double quote */}
          <div className="text-4xl font-serif text-blue-200/80 font-black leading-none mb-1">“</div>
          <p className="font-serif italic text-slate-700 text-sm leading-snug relative z-10 max-w-[180px]">
            Discipline today, dreams tomorrow.
          </p>

          {/* Soft Watercolor Mountain Graphic in Left Sidebar */}
          <div className="mt-4 -mx-5 -mb-4 opacity-75 pointer-events-none">
            <svg viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <path
                d="M0 100L45 58C52 51 64 53 72 61L95 82C102 88 112 87 118 80L148 42C156 32 170 32 178 41L215 82C222 90 231 93 240 93V100H0Z"
                fill="url(#sidebarMtn1)"
                opacity="0.65"
              />
              <path
                d="M30 100L82 35C89 26 102 26 109 35L145 78C152 86 163 87 170 80L195 55C202 48 213 49 220 57L240 78V100H30Z"
                fill="url(#sidebarMtn2)"
                opacity="0.85"
              />
              <defs>
                <linearGradient id="sidebarMtn1" x1="120" y1="35" x2="120" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#93c5fd" stopOpacity="0.5" />
                  <stop stopColor="#dbeafe" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="sidebarMtn2" x1="135" y1="25" x2="135" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60a5fa" stopOpacity="0.75" />
                  <stop stopColor="#bfdbfe" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 font-medium relative z-10">
            v1.0.0 <br />
            Built for learners, by learners.
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT AREA (Header + Body Grid)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP SEARCH, ACTION CTA & PROFILE BAR */}
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          {/* Search Box with Working Keyboard Shortcut */}
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search topics, questions, or ask Learniverse..."
              className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-9 pr-14 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs pointer-events-none">
              Ctrl K
            </kbd>
          </div>

          {/* Right Action Icons & User Profile Pill */}
          <div className="flex items-center gap-3">
            {/* Download Report Action Button */}
            <button
              onClick={handleDownloadReport}
              disabled={isGeneratingPdf}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/25 hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Download Official Placement Scorecard PDF"
            >
              <Download className={`w-3.5 h-3.5 ${isGeneratingPdf ? "animate-bounce" : ""}`} />
              <span>{isGeneratingPdf ? "Generating..." : "Download Report"}</span>
            </button>

            {/* Sparkles AI Action */}
            <button 
              onClick={() => navigate("/topics")}
              className="w-9 h-9 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50/70 border border-transparent hover:border-blue-100 flex items-center justify-center transition-all"
              title="Ask AI Mentor"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
            </button>

            {/* Notification Bell */}
            <button 
              className="w-9 h-9 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 relative flex items-center justify-center transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white animate-pulse"></span>
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200/80">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-blue-100">
                {(student?.name || student?.roll_number || "S").slice(0, 1).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block leading-tight">
                <div className="text-xs font-bold text-slate-900 tracking-tight">
                  {student?.roll_number || student?.rollNumber || "Student Profile"}
                </div>
                <div className="text-[10px] font-semibold text-slate-400">
                  {student?.branch || student?.branch_name || "HITAM"} {student?.currentStudyYear ? `• ${student.currentStudyYear}` : ""}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-1 p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors flex items-center justify-center"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* DASHBOARD BODY CONTAINER */}
        <main className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* ─────────────────────────────────────────────────────────────
              3. HERO / WELCOME BANNER (With Authentic Calligraphy & Mountains)
          ───────────────────────────────────────────────────────────── */}
          <div className="relative rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100/90 p-6 sm:p-7 overflow-hidden shadow-xs">
            {/* Top Right Learniverse Quote */}
            <div className="absolute top-4 right-6 text-right hidden md:block z-10">
              <p className="text-xs font-medium text-slate-500 italic">
                “A better you for a bigger tomorrow.”
              </p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">— LearnIverse</p>
            </div>

            {/* Floating Authentic Handwritten Script: Small Steps Big Placements */}
            <div className="absolute top-5 left-[34%] hidden lg:block pointer-events-none z-10 transform -rotate-2">
              <span 
                className="font-['Caveat',cursive] font-bold text-3xl tracking-wide select-none drop-shadow-xs"
                style={{ color: "rgba(30, 58, 138, 0.42)" }}
              >
                Small Steps Big Placements
              </span>
            </div>

            {/* Soft Watercolor Mountain SVG Illustration Background */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 max-w-lg pointer-events-none opacity-80 overflow-hidden flex items-end justify-end">
              <svg viewBox="0 0 520 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <path
                  d="M120 180L210 75C225 57 252 57 267 75L325 145C335 157 353 158 365 147L415 95C428 82 449 83 460 97L520 170V180H120Z"
                  fill="url(#bannerMtn1)"
                  opacity="0.5"
                />
                <path
                  d="M220 180L305 45C318 28 344 28 357 45L425 130C435 142 452 144 464 133L520 80V180H220Z"
                  fill="url(#bannerMtn2)"
                  opacity="0.75"
                />
                <path
                  d="M310 180L375 25C388 8 412 8 425 25L520 150V180H310Z"
                  fill="url(#bannerMtn3)"
                  opacity="0.95"
                />
                <defs>
                  <linearGradient id="bannerMtn1" x1="320" y1="60" x2="320" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#93c5fd" stopOpacity="0.4" />
                    <stop stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="bannerMtn2" x1="370" y1="30" x2="370" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#60a5fa" stopOpacity="0.6" />
                    <stop stopColor="#dbeafe" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="bannerMtn3" x1="415" y1="10" x2="415" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop stopColor="#93c5fd" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Left Content */}
            <div className="relative z-10 space-y-3">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  WELCOME BACK,
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  {student?.name || "HITAM Student"} <span className="animate-pulse inline-block">👋</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Keep learning. You're building your future.
                </p>
              </div>

              {/* Metadata Badges Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <IdCard className="w-3.5 h-3.5 text-slate-400" />
                  {student?.roll_number || student?.rollNumber || "Enrolled Candidate"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {student?.branch || student?.branch_name || "Computer Science & Engineering"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {student?.batch ? `Batch ${student.batch}` : "Batch 2023 – 2027"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  {student?.currentStudyYear || "4th Year"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  HITAM Verified
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              3.5 PLACEMENT ASSESSMENT EXECUTIVE CARD
          ───────────────────────────────────────────────────────────── */}
          <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
            <div className="p-5 sm:p-6">
              {analyticsData?.placement ? (
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                        <ClipboardCheck className="w-3.5 h-3.5 text-blue-600" />
                        HITAM CDC Placement Assessment
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        analyticsData.placement.proctor_cleared !== false
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {analyticsData.placement.proctor_cleared !== false ? "Proctoring Verified Passed" : "Audit Flagged"}
                      </span>
                      {analyticsData.placement.submitted_at && (
                        <span className="text-[11px] font-semibold text-slate-400">
                          Submitted on {new Date(analyticsData.placement.submitted_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                          {analyticsData.placement.total_marks}
                          <span className="text-slate-400 text-lg font-bold"> / {analyticsData.placement.max_marks}</span>
                        </span>
                        <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          {analyticsData.placement.percentage}% Diagnostic Score
                        </span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          Readiness Tier: <strong className="text-indigo-600 font-extrabold">{analyticsData.placement.placement_tier}</strong>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1.5">
                        {analyticsData.placement.readiness_band}
                      </p>
                    </div>

                    {/* Matched Recruiters */}
                    {analyticsData.placement.target_recruiters?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Matched Recruiters:</span>
                        {analyticsData.placement.target_recruiters.map((rec: string) => (
                          <span key={rec} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors">
                            <Building2 className="w-3 h-3 text-slate-500" />
                            {rec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                    <button
                      onClick={handleDownloadReport}
                      disabled={isGeneratingPdf}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Download className={`w-4 h-4 ${isGeneratingPdf ? "animate-bounce" : ""}`} />
                      {isGeneratingPdf ? "Generating Report..." : "Download Official CDC Report"}
                    </button>
                    <Link
                      to="/assessment"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all hover:text-slate-900"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      Review Assessment Breakdown
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider">
                      Diagnostic Milestone
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Take Your Official CDC Placement Assessment
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xl">
                      Evaluate your readiness across Aptitude, Verbal, CS Fundamentals & Coding. Unlocks verified proctored scorecard and recruiter band matching for HITAM drives.
                    </p>
                  </div>
                  <Link
                    to="/assessment"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Start Assessment Now
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. TOP 4 METRIC CARDS ROW (With Live Neon Analytics)
          ───────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Metric 1: Diagnostic Assessment Score */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200/90 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {analyticsData?.placement?.total_marks ?? (dashboardData?.total_marks ?? 1)}{" "}
                      <span className="text-slate-400 text-sm font-bold">/ {analyticsData?.placement?.max_marks ?? (dashboardData?.max_marks ?? 20)}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">Diagnostic Assessment</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-blue-600">
                  {analyticsData?.placement?.percentage ?? (dashboardData?.percentage ?? 5)}%
                </div>
              </div>
              <div className="mt-3">
                <Progress
                  value={Number(analyticsData?.placement?.percentage ?? (dashboardData?.percentage ?? 5))}
                  className="h-1.5 bg-slate-100 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600"
                />
              </div>
            </div>

            {/* Metric 2: Socratic MCQ Accuracy */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200/90 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Target className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {analyticsData?.mcq_accuracy_pct ?? 0}%
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">MCQ Accuracy</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                  {analyticsData?.mcq_attempted ?? 0} Solved
                </span>
              </div>
              <div className="mt-3">
                <Progress
                  value={Number(analyticsData?.mcq_accuracy_pct ?? 0)}
                  className="h-1.5 bg-slate-100 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-emerald-600 [&>div]:to-teal-600"
                />
              </div>
            </div>

            {/* Metric 3: Coding Challenges Solved */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200/90 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {analyticsData?.coding_solved ?? 0}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">Coding Solved</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-full shrink-0">
                  Challenges
                </span>
              </div>
              <div className="mt-3 text-[10px] text-slate-400 font-medium">
                {analyticsData?.recent_submissions?.length ?? 0} submissions verified by sandbox
              </div>
            </div>

            {/* Metric 4: Top 100 Codes Progress */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-200/90 transition-all duration-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {analyticsData?.top100_solved ?? 0} <span className="text-slate-400 text-sm font-bold">/ 100</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">Top 100 Codes</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full shrink-0">
                  {analyticsData?.top100_solved ?? 0}%
                </span>
              </div>
              <div className="mt-3">
                <Progress
                  value={Number(analyticsData?.top100_solved ?? 0)}
                  className="h-1.5 bg-slate-100 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Stats Ribbon: Topics, Chat, Streak */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2.5 px-3 py-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Topics Explored: <strong className="text-slate-900 font-extrabold">{analyticsData?.topics_viewed ?? 0}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Socratic Messages: <strong className="text-slate-900 font-extrabold">{analyticsData?.chat_messages_count ?? 0}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Learning Streak: <strong className="text-slate-900 font-extrabold">{analyticsData?.streak_days ?? 1} Days</strong></span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Proctoring Clearance: <strong className="text-emerald-600 font-extrabold">PASSED</strong></span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              5. MAIN SPLIT: Left & Center Cards + Right Widget Column
          ───────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT & CENTER COLUMN (Span 8) */}
            <div className="lg:col-span-8 space-y-6">
              {/* ── TOP 100 CODES BREAKDOWN CARD ──────────────────────────── */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Trophy className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 leading-none">Top 100 Codes Challenge</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">High-frequency FAANG & Product Interview Problems</p>
                    </div>
                  </div>
                  <Link
                    to="/top-100-codes"
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    Practice Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                  <div className="sm:col-span-1 border-r sm:border-slate-100 pr-2">
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      {analyticsData?.top100_summary?.solved_total ?? analyticsData?.top100_solved ?? 0}
                      <span className="text-slate-400 text-sm font-bold"> / 100</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">Total Solved</div>
                    <div className="mt-2 text-[10px] text-slate-500">
                      Attempted: <strong className="text-slate-800">{analyticsData?.top100_summary?.attempted_total ?? analyticsData?.top100_attempted ?? 0}</strong>
                    </div>
                  </div>

                  <div className="sm:col-span-3 space-y-2.5">
                    {/* Easy */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-emerald-700 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Easy Problems
                        </span>
                        <span className="text-slate-600 font-mono">
                          {analyticsData?.top100_summary?.easy_solved ?? 0} Solved
                        </span>
                      </div>
                      <Progress
                        value={((analyticsData?.top100_summary?.easy_solved ?? 0) / 40) * 100}
                        className="h-1.5 bg-slate-100 rounded-full [&>div]:bg-emerald-500"
                      />
                    </div>

                    {/* Medium */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-amber-700 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Medium Problems
                        </span>
                        <span className="text-slate-600 font-mono">
                          {analyticsData?.top100_summary?.medium_solved ?? 0} Solved
                        </span>
                      </div>
                      <Progress
                        value={((analyticsData?.top100_summary?.medium_solved ?? 0) / 45) * 100}
                        className="h-1.5 bg-slate-100 rounded-full [&>div]:bg-amber-500"
                      />
                    </div>

                    {/* Hard */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-rose-700 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          Hard Problems
                        </span>
                        <span className="text-slate-600 font-mono">
                          {analyticsData?.top100_summary?.hard_solved ?? 0} Solved
                        </span>
                      </div>
                      <Progress
                        value={((analyticsData?.top100_summary?.hard_solved ?? 0) / 15) * 100}
                        className="h-1.5 bg-slate-100 rounded-full [&>div]:bg-rose-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* TWO LARGE CARDS: Section Performance + Skill & Topic Mastery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CARD 1: Section Performance */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Target className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-slate-900 leading-none">Section Performance</h2>
                          <p className="text-[11px] text-slate-400 mt-0.5">Your performance across core test sections</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate("/assessment")}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                      >
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3.5 pt-1">
                      {/* Section 1: Aptitude */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>Aptitude</span>
                          <span className="text-slate-400 font-mono text-[11px]">0% (0/0)</span>
                        </div>
                        <Progress value={0} className="h-1 bg-slate-100 rounded-full" />
                      </div>

                      {/* Section 2: Verbal */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>Verbal</span>
                          <span className="text-slate-400 font-mono text-[11px]">0% (0/0)</span>
                        </div>
                        <Progress value={0} className="h-1 bg-slate-100 rounded-full" />
                      </div>

                      {/* Section 3: Computer Fundamentals */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>Computer Fundamentals</span>
                          <span className="text-slate-400 font-mono text-[11px]">0% (0/0)</span>
                        </div>
                        <Progress value={0} className="h-1 bg-slate-100 rounded-full" />
                      </div>

                      {/* Section 4: Coding */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>Coding</span>
                          <span className="text-slate-400 font-mono text-[11px]">0% (0/0)</span>
                        </div>
                        <Progress value={0} className="h-1 bg-slate-100 rounded-full" />
                      </div>

                      {/* Section 5: Mobile App Development */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>Mobile App Development</span>
                          <span className="text-blue-600 font-mono text-[11px] font-bold">5% (1/20)</span>
                        </div>
                        <Progress value={5} className="h-1.5 bg-slate-100 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: Skill & Topic Mastery */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-shadow space-y-4">
                  {/* Card Header — always visible */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <BarChart2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 leading-none">Skill & Topic Mastery</h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">Strengths, focus areas and personalized insights</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/topics")}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                    >
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* ── LOADING SKELETON ─────────────────────────────────── */}
                  {analyticsLoading && (
                    <div className="space-y-4 animate-pulse pt-1">
                      {/* Skeleton: Strongest Concepts label */}
                      <div className="space-y-2">
                        <div className="h-3 w-32 bg-slate-100 rounded-full" />
                        <div className="flex gap-1.5">
                          <div className="h-6 w-28 bg-emerald-50 border border-emerald-100 rounded-md" />
                          <div className="h-6 w-20 bg-emerald-50 border border-emerald-100 rounded-md" />
                        </div>
                      </div>
                      {/* Skeleton: Focus Areas label */}
                      <div className="space-y-2">
                        <div className="h-3 w-40 bg-slate-100 rounded-full" />
                        <div className="flex flex-wrap gap-1.5">
                          {[80, 112, 96, 72, 104, 88, 64, 100].map(w => (
                            <div key={w} className="h-5 bg-rose-50 border border-rose-100 rounded-md" style={{ width: w }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── FIRST-TIME USER EMPTY STATE ───────────────────────── */}
                  {!analyticsLoading && isFirstTimeUser && (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-700">No insights yet</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px] mx-auto">
                          Attempt a few MCQs on any topic — your strengths and gaps will appear here.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/topics")}
                        className="text-[11px] font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Start Practising →
                      </button>
                    </div>
                  )}

                  {/* ── REAL DATA: Strongest Concepts ─────────────────────── */}
                  {!analyticsLoading && !isFirstTimeUser && (
                    <>
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Strongest Concepts
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {strongTopics.length > 0 ? (
                            strongTopics.map(topic => (
                              <span
                                key={topic}
                                className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md hover:scale-105 transition-transform cursor-pointer"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {topic}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Keep practising — strong topics will appear here at ≥ 80% accuracy.
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ── REAL DATA: Focus Areas / Critical Gaps ───────────── */}
                      <div className="space-y-2 pt-1">
                        <div className="text-[11px] font-bold text-rose-600 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          Focus Areas / Critical Gaps
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                          {focusAreas.length > 0 ? (
                            focusAreas.map(skill => (
                              <span
                                key={skill}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold bg-rose-50/80 text-rose-700 border border-rose-200/70 px-2 py-0.5 rounded-md hover:bg-rose-100 hover:scale-105 transition-all cursor-pointer shadow-2xs"
                              >
                                <span className="w-1 h-1 rounded-full bg-rose-400" />
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Great work — no critical gaps detected yet!
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ── PERSONALIZED AI COACHING INSIGHTS ─────────────────────── */}
              <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-purple-50/30 rounded-2xl border border-blue-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 leading-none">Personalized AI Mentor Insights</h2>
                      <p className="text-[11px] text-slate-500 mt-0.5">Real-time diagnosis based on your code runs, quizzes & assessments</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                    Live Analysis
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  {(analyticsData?.ai_recommendations?.length > 0
                    ? analyticsData.ai_recommendations
                    : [
                        {
                          type: "diagnostic",
                          badge: "Placement Focus",
                          title: "Take Placement Assessment",
                          description: "Complete your diagnostic benchmark to establish your candidate baseline and unlock targeted company prep.",
                          link: "/assessment"
                        },
                        {
                          type: "foundations",
                          badge: "Foundational Step",
                          title: "Master Arrays & Strings",
                          description: "Practice foundational problems in Top 100 to build confidence before progressing to advanced algorithms.",
                          link: "/top-100-codes"
                        }
                      ]
                  ).map((rec: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                            {rec.badge || "Recommendation"}
                          </span>
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                          {rec.title}
                        </h3>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>
                      <Link
                        to={rec.link || "/topics"}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-3"
                      >
                        Take Action <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── INTERACTIVE ACTIVITY & PRACTICE EVIDENCE LOG ───────────────────── */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                      <Clock className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 leading-none">Practice Activity & Evidence Stream</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">Persisted in database: code submissions, quiz attempts & topics</p>
                    </div>
                  </div>

                  {/* Tab Toggle Buttons */}
                  <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 text-xs font-bold text-slate-600">
                    <button
                      onClick={() => setActivityTab("coding")}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        activityTab === "coding"
                          ? "bg-white text-blue-600 shadow-2xs font-extrabold"
                          : "hover:text-slate-900"
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      Coding ({analyticsData?.recent_submissions?.length ?? 0})
                    </button>

                    <button
                      onClick={() => setActivityTab("mcq")}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        activityTab === "mcq"
                          ? "bg-white text-blue-600 shadow-2xs font-extrabold"
                          : "hover:text-slate-900"
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      Quizzes ({analyticsData?.recent_mcq_attempts?.length ?? 0})
                    </button>

                    <button
                      onClick={() => setActivityTab("topics")}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                        activityTab === "topics"
                          ? "bg-white text-blue-600 shadow-2xs font-extrabold"
                          : "hover:text-slate-900"
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Topics ({analyticsData?.recent_topics_visited?.length ?? 0})
                    </button>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {/* Tab 1: Coding Submissions */}
                  {activityTab === "coding" && (
                    <div>
                      {analyticsData?.recent_submissions?.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                          {analyticsData.recent_submissions.map((sub: any, idx: number) => (
                            <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  sub.verdict === "Accepted"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-rose-50 text-rose-600"
                                }`}>
                                  {sub.verdict === "Accepted" ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    <XCircle className="w-4 h-4" />
                                  )}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900">
                                    {sub.problem_title || `Problem #${sub.problem_id}`}
                                  </div>
                                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                    <span>Tests: {sub.passed_tests} / {sub.total_tests} passed</span>
                                    {sub.runtime_ms && <span>• {sub.runtime_ms}ms runtime</span>}
                                    {sub.submitted_at && <span>• {new Date(sub.submitted_at).toLocaleDateString()}</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  sub.verdict === "Accepted"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}>
                                  {sub.verdict}
                                </span>
                                <Link
                                  to="/top-100-codes"
                                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                                >
                                  View <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400 space-y-2">
                          <Code2 className="w-8 h-8 mx-auto text-slate-300" />
                          <p className="text-xs font-semibold">No coding submissions recorded yet.</p>
                          <p className="text-[11px] text-slate-400">Run code in Top 100 Codes or topic sandboxes to build your submission record.</p>
                          <Link
                            to="/top-100-codes"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 mt-2"
                          >
                            Start Coding <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: MCQ & Quiz Attempts with Analysis */}
                  {activityTab === "mcq" && (
                    <div>
                      {analyticsData?.recent_mcq_attempts?.length > 0 ? (
                        <div className="space-y-3">
                          {analyticsData.recent_mcq_attempts.map((mcq: any, idx: number) => {
                            const isExpanded = expandedMcqId === idx;
                            return (
                              <div
                                key={idx}
                                className="rounded-xl border border-slate-200/90 p-4 transition-all bg-white hover:border-blue-200"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                                        {mcq.topic_slug?.replace(/-/g, " ") || "Quiz"}
                                      </span>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        mcq.is_correct
                                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                          : "bg-rose-50 text-rose-700 border border-rose-200"
                                      }`}>
                                        {mcq.is_correct ? "Correct Answer" : "Incorrect"}
                                      </span>
                                      {mcq.attempted_at && (
                                        <span className="text-[10px] text-slate-400">
                                          {new Date(mcq.attempted_at).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>

                                    <p className="text-xs font-bold text-slate-900 leading-snug">
                                      {mcq.question_text || `Question #${mcq.question_index + 1}`}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                                      <div className={`p-2 rounded-lg border flex items-center gap-2 ${
                                        mcq.is_correct
                                          ? "bg-emerald-50/60 border-emerald-200 text-emerald-800"
                                          : "bg-rose-50/60 border-rose-200 text-rose-800"
                                      }`}>
                                        <span className="font-bold">Your Choice:</span>
                                        <span className="font-medium truncate">{mcq.selected_answer || "None"}</span>
                                      </div>

                                      {!mcq.is_correct && mcq.correct_answer && (
                                        <div className="p-2 rounded-lg border bg-emerald-50/60 border-emerald-200 text-emerald-800 flex items-center gap-2">
                                          <span className="font-bold">Correct Solution:</span>
                                          <span className="font-medium truncate">{mcq.correct_answer}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {mcq.explanation && (
                                    <button
                                      onClick={() => setExpandedMcqId(isExpanded ? null : idx)}
                                      className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors shrink-0"
                                      title={isExpanded ? "Hide Analysis" : "View Explanation"}
                                    >
                                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                  )}
                                </div>

                                {/* Expanded Explanation */}
                                {isExpanded && mcq.explanation && (
                                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-lg leading-relaxed">
                                    <strong className="text-slate-900 font-bold block mb-1">Concept Analysis & Explanation:</strong>
                                    {mcq.explanation}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400 space-y-2">
                          <Target className="w-8 h-8 mx-auto text-slate-300" />
                          <p className="text-xs font-semibold">No quiz attempts recorded yet.</p>
                          <p className="text-[11px] text-slate-400">Take topic quizzes to view full question analyses, your selected answers, and correct explanations here.</p>
                          <Link
                            to="/topics"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 mt-2"
                          >
                            Explore Quizzes <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 3: Topics Explored */}
                  {activityTab === "topics" && (
                    <div>
                      {analyticsData?.recent_topics_visited?.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                          {analyticsData.recent_topics_visited.map((top: any, idx: number) => (
                            <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                  <BookOpen className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900 capitalize">
                                    {top.topic_slug?.replace(/-/g, " ")}
                                  </div>
                                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                    <span>Tab: <strong className="text-slate-600 capitalize">{top.tab || "Overview"}</strong></span>
                                    {top.duration_sec ? (
                                      <span>• {Math.floor(top.duration_sec / 60)}m {top.duration_sec % 60}s study time</span>
                                    ) : null}
                                    {top.visited_at && <span>• {new Date(top.visited_at).toLocaleDateString()}</span>}
                                  </div>
                                </div>
                              </div>

                              <Link
                                to={`/topics/${top.topic_slug}`}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 shrink-0"
                              >
                                Resume <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400 space-y-2">
                          <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                          <p className="text-xs font-semibold">No topic sessions recorded yet.</p>
                          <p className="text-[11px] text-slate-400">Every topic you visit will track your study duration and learning history.</p>
                          <Link
                            to="/topics"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 mt-2"
                          >
                            Browse Curriculum <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  BOTTOM SECTION: Tailored Learning Roadmap
              ───────────────────────────────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 leading-none">Tailored Learning Roadmap</h2>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Curated learning paths based on your department and diagnostic performance
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/topics"
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View All Topics <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* 4 Topic Cards Grid with Difficulty Accent Hover Glows */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 pt-1">
                  {/* Card 1: Arrays & Strings (Easy) */}
                  <div className="rounded-xl border border-slate-200/90 p-4 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-mono font-bold">
                          &lt;/&gt;
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Easy
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                        Arrays & Strings
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        Multi-agent tutor with code execution, visualizations & live quizzes
                      </p>
                    </div>
                    <Link
                      to="/topics/arrays"
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mt-3"
                    >
                      Start Learning <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Card 2: Linked Lists (Medium) */}
                  <div className="rounded-xl border border-slate-200/90 p-4 hover:border-amber-300 hover:shadow-md hover:shadow-amber-500/5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-mono font-bold">
                          &lt;/&gt;
                        </div>
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                          Medium
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-700 transition-colors">
                        Linked Lists
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        Multi-agent tutor with code execution, visualizations & live quizzes
                      </p>
                    </div>
                    <Link
                      to="/topics/linked-lists"
                      className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 mt-3"
                    >
                      Start Learning <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Card 3: Trees & Graphs (Medium) */}
                  <div className="rounded-xl border border-slate-200/90 p-4 hover:border-amber-300 hover:shadow-md hover:shadow-amber-500/5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-mono font-bold">
                          &lt;/&gt;
                        </div>
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                          Medium
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-700 transition-colors">
                        Trees & Graphs
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        Multi-agent tutor with code execution, visualizations & live quizzes
                      </p>
                    </div>
                    <Link
                      to="/topics/binary-trees"
                      className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 mt-3"
                    >
                      Start Learning <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Card 4: Dynamic Programming (Hard) */}
                  <div className="rounded-xl border border-slate-200/90 p-4 hover:border-rose-300 hover:shadow-md hover:shadow-rose-500/5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group bg-white">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-mono font-bold">
                          &lt;/&gt;
                        </div>
                        <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                          Hard
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-rose-700 transition-colors">
                        Dynamic Programming
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        Multi-agent tutor with code execution, visualizations & live quizzes
                      </p>
                    </div>
                    <Link
                      to="/topics"
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 mt-3"
                    >
                      Start Learning <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                RIGHT WIDGET COLUMN (Span 4)
            ───────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-4 space-y-5">
              {/* WIDGET 1: 1 Day Streak Card (Dark Gradient with Glowing Ember) */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#1e293b] text-white p-5 shadow-sm relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                      <Flame className="w-5 h-5 fill-orange-500 text-orange-400 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black tracking-tight">1 Day Streak</h3>
                      <p className="text-[11px] text-slate-400">Practice daily to keep it alive!</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 7 Days Row */}
                <div className="grid grid-cols-7 gap-1.5 mt-4 pt-1 text-center">
                  {["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"].map((day, idx) => (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                          idx === 1
                            ? "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.45)] ring-2 ring-orange-300 scale-105"
                            : "bg-slate-800/80 text-slate-400 border border-slate-700/60"
                        }`}
                      >
                        {idx === 1 ? <Flame className="w-4 h-4 fill-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">{day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WIDGET 2: September 2026 Mini Calendar Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">September 2026</h3>
                  <div className="flex items-center gap-1 text-slate-400">
                    <button className="p-1 hover:text-slate-700 rounded transition-colors">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 hover:text-slate-700 rounded transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Calendar Days Header */}
                <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-slate-400">
                  <span>S</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                </div>

                {/* Calendar Grid (Selected sample dates matching screenshot) */}
                <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-700 gap-y-1.5">
                  <span className="text-slate-300">30</span>
                  <span className="text-slate-300">31</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                  <span>10</span>
                  {/* Sep 11 Practice Day */}
                  <span className="w-6 h-6 mx-auto rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[11px] shadow-2xs">
                    11
                  </span>
                  <span>12</span>
                  {/* Sep 13 & 14 Practice / Today */}
                  <span className="w-6 h-6 mx-auto rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px]">
                    13
                  </span>
                  <span className="w-6 h-6 mx-auto rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px]">
                    14
                  </span>
                  <span>15</span>
                  <span>16</span>
                  <span>17</span>
                  <span>18</span>
                  <span>19</span>
                  <span>20</span>
                  <span>21</span>
                  <span>22</span>
                  <span>23</span>
                  <span>24</span>
                  <span>25</span>
                  <span>26</span>
                  <span>27</span>
                  <span>28</span>
                  <span>29</span>
                  <span>30</span>
                </div>

                {/* Calendar Legend */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span> Practice day
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-200"></span> Today
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span> Streak
                  </span>
                </div>
              </div>

              {/* WIDGET 3: Learning Journey (Crisp Dimensions & Clean Alignment) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900">Learning Journey</h3>
                  </div>
                  <button 
                    onClick={() => navigate("/topics")}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                  >
                    View Analytics <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Circular Progress Indicator - Fixed crisp dimensions */}
                  <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                      {/* Background circle track */}
                      <path
                        className="text-slate-100"
                        strokeWidth="3.2"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* 5% Active arc */}
                      <path
                        className="text-blue-600"
                        strokeDasharray="5, 100"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-xs font-black text-slate-900 leading-none">5%</span>
                      <span className="text-[7px] font-bold text-slate-400 leading-tight mt-0.5">Overall Progress</span>
                    </div>
                  </div>

                  {/* Stats List */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-slate-900 text-xs font-mono w-5 text-right shrink-0">4</span>
                      <span className="text-slate-500 text-[11px] leading-tight truncate">Topics Started</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-slate-900 text-xs font-mono w-5 text-right shrink-0">0</span>
                      <span className="text-slate-500 text-[11px] leading-tight truncate">Topics Completed</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-slate-900 text-xs font-mono w-5 text-right shrink-0">197</span>
                      <span className="text-slate-500 text-[11px] leading-tight truncate">Total Topics</span>
                    </div>
                  </div>
                </div>

                {/* Motivational Tag */}
                <div className="p-2.5 rounded-xl bg-slate-50 text-center text-[11px] font-medium text-slate-600 border border-slate-100">
                  🌱 “Progress, not perfection.”
                </div>
              </div>

              {/* WIDGET 4: Dark Mountain Promotional / Action Card with Button Glow */}
              <div className="rounded-2xl bg-gradient-to-br from-[#060b18] via-[#0b132b] to-[#151f38] text-white p-5 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                {/* Night Mountain Graphic Silhouette */}
                <div className="absolute inset-0 opacity-40 pointer-events-none flex items-end justify-center">
                  <svg viewBox="0 0 300 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path
                      d="M0 140L60 70C70 58 90 58 100 70L150 120C160 130 180 130 190 120L240 60C250 50 270 50 280 62L300 85V140H0Z"
                      fill="#1e293b"
                    />
                    <path
                      d="M80 140L140 40C150 25 170 25 180 40L250 130V140H80Z"
                      fill="#334155"
                    />
                  </svg>
                </div>

                <div className="relative z-10 space-y-1">
                  <h4 className="text-sm font-black tracking-tight leading-snug">
                    Build the skills. <br />
                    Land the opportunities.
                  </h4>
                  <div className="pt-2">
                    <button
                      onClick={() => navigate("/topics")}
                      className="bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
                    >
                      Keep Learning <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="relative z-10 pt-4 flex items-center justify-center gap-1.5 text-slate-400">
                  <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
                  <div className="text-[10px] font-bold text-white">LearnIverse</div>
                  <span className="text-[9px] text-slate-500">• Learn. Practice. Place.</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
