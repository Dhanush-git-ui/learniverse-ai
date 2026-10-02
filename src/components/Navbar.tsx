import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Lightbulb, 
  ExternalLink, 
  Menu, 
  X, 
  GraduationCap, 
  LogOut, 
  Flame, 
  LayoutDashboard,
  Home,
  Info,
  HelpCircle,
  BookOpen,
  Code2,
  Award,
  Building2,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { HitamLoginModal } from './auth/HitamLoginModal';
import { HitamStudentDemographics } from '@/utils/hitamParser';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalInitialTab, setLoginModalInitialTab] = useState<"google" | "manual" | "admin">("google");
  const [student, setStudent] = useState<HitamStudentDemographics | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [streakCount, setStreakCount] = useState<number | null>(null);
  const location = useLocation();

  // Synchronize student and admin session and streak from localStorage
  const syncStudentState = () => {
    let currentAdmin = localStorage.getItem('learniverse_admin_authed') === 'true';

    try {
      const savedUser = localStorage.getItem('learniverse_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u.role === 'admin' || u.is_admin) currentAdmin = true;
      }
    } catch {}

    try {
      const saved = localStorage.getItem('learniverse_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        setStudent(parsed);
        if (parsed.is_admin || parsed.role === 'admin') currentAdmin = true;
      } else {
        setStudent(null);
      }
    } catch {
      setStudent(null);
    }

    setIsAdmin(currentAdmin);

    try {
      const rawStreak = localStorage.getItem('learniverse_streak');
      if (rawStreak) {
        const parsed = JSON.parse(rawStreak);
        setStreakCount(parsed.current_streak || 1);
      } else {
        setStreakCount(1); // default active streak on student login
      }
    } catch {
      setStreakCount(1);
    }
  };

  useEffect(() => {
    syncStudentState();

    const handleAuthChange = () => syncStudentState();
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('learniverse_auth_change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('learniverse_auth_change', handleAuthChange);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('learniverse_token');
    localStorage.removeItem('learniverse_student');
    localStorage.removeItem('learniverse_user');
    localStorage.removeItem('learniverse_roll_number');
    localStorage.removeItem('learniverse_streak');
    localStorage.removeItem('learniverse_admin_authed');
    setStudent(null);
    setIsAdmin(false);
    window.dispatchEvent(new Event('learniverse_auth_change'));
    window.location.href = "/";
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Safe helper to extract student or admin demographics
  const getStudentInfo = () => {
    if (!student && !isAdmin) return null;
    const s = (student || {}) as any;

    if (isAdmin || s.is_admin || s.role === 'admin') {
      return {
        roll: 'ADMIN',
        name: 'Admin',
        branch: 'Super Admin',
        fullBranch: 'Startup Hub Administrator',
        year: 'Admin Console',
        initial: 'A',
        isAdmin: true
      };
    }

    const roll = s.rollNumber || s.roll_number || "Student";
    const name = s.name || s.student_name || s.fullName || (roll !== "Student" ? roll : "Dhanush");
    const branchName = s.branchName || s.branch_name || "";
    const branchCode = s.branchCode || s.branch_code || "";
    const currentYear = s.currentStudyYear || s.current_study_year || "";

    let displayBranch = branchCode;
    if (branchCode === "66") displayBranch = "CSM";
    else if (branchCode === "67") displayBranch = "CSD";
    else if (branchCode === "05") displayBranch = "CSE";
    else if (branchCode === "04") displayBranch = "ECE";
    else if (branchCode === "03") displayBranch = "MECH";
    else if (branchCode === "02") displayBranch = "EEE";
    else if (branchName) {
      if (branchName.includes("AI")) displayBranch = "CSM";
      else if (branchName.includes("Data")) displayBranch = "CSD";
      else if (branchName.includes("Computer")) displayBranch = "CSE";
      else displayBranch = branchName.split(" ")[0];
    }

    return {
      roll,
      name,
      branch: displayBranch || "HITAM",
      fullBranch: branchName || "HITAM Student",
      year: currentYear,
      initial: (name.charAt(0) || "D").toUpperCase(),
      isAdmin: false
    };
  };

  const studentInfo = getStudentInfo();

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200' : 'bg-white/90 backdrop-blur-md border-b border-slate-100'
      } dark:bg-gray-900/90 dark:backdrop-blur-md`}
    >
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo: links to /dashboard if logged in, otherwise / */}
          <div className="flex items-center">
            <Link
              to={student ? "/dashboard" : "/"}
              className={`flex items-center transition-transform hover:scale-105 ${
                isActive('/top-100-codes') ? '-ml-4' : ''
              }`}
            >
              <Lightbulb className="w-7 h-7 text-[#2563eb] stroke-[2.3] mr-2 flex-shrink-0" />
              <span className="text-xl sm:text-[22px] font-black tracking-tight leading-none select-none">
                <span className="text-slate-950 dark:text-white">Learn</span>
                <span className="text-[#2563eb]">iverse</span>
              </span>
            </Link>
          </div>
          
          {/* ========================================================= */}
          {/* DESKTOP NAVIGATION: DISTINCT FOR BEFORE vs AFTER LOGIN     */}
          {/* ========================================================= */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {student ? (
              // -------------------------------------------------------
              // AFTER LOGIN (Student Portal Hub)
              // -------------------------------------------------------
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all ${
                    isActive('/dashboard') 
                      ? 'text-black bg-slate-100 border border-slate-200 shadow-xs' 
                      : 'text-slate-600 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  <span>Dashboard</span>
                </Link>

                <Link 
                  to="/topics" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors flex items-center gap-1 ${
                    isActive('/topics') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-600 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  <span>Learn</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <Link 
                  to="/top-100-codes" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                    isActive('/top-100-codes') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-600 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  Practice
                </Link>

                <Link 
                  to="/assessment" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                    isActive('/assessment') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-600 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  Placement
                </Link>

                <Link 
                  to="/dashboard" 
                  className="px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors text-slate-600 hover:text-black hover:bg-slate-50"
                >
                  Progress
                </Link>

                {isAdmin && (
                  <Link 
                    to="/assessment?admin=true" 
                    className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center gap-1.5 ${
                      location.search.includes('admin=true')
                        ? 'text-black bg-slate-100 shadow-xs border border-slate-300' 
                        : 'text-slate-700 hover:text-black hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Startup Admin Hub</span>
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  </Link>
                )}

                <a
                  href="https://cdc-hitam.onrender.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors text-slate-600 hover:text-black hover:bg-slate-50 inline-flex items-center gap-1.5"
                  title="Check Diagnostic Assessment on CDC HITAM"
                >
                  <span>Check Your Score</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </>
            ) : (
              // -------------------------------------------------------
              // BEFORE LOGIN (Guest / Visitor Hub)
              // -------------------------------------------------------
              <>
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                    isActive('/') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-600 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  Home
                </Link>

                <Link 
                  to="/about" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                    isActive('/about') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-600 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  About
                </Link>

                <Link 
                  to="/how-it-works" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                    isActive('/how-it-works') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-600 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  How It Works
                </Link>

                <Link 
                  to="/topics" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                    isActive('/topics') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-600 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  Topics
                </Link>

                <Link 
                  to="/assessment" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isActive('/assessment') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-700 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>Placement Test</span>
                </Link>
              </>
            )}
          </nav>
          
          {/* ========================================================= */}
          {/* DESKTOP ACTIONS: DISTINCT FOR BEFORE vs AFTER LOGIN       */}
          {/* ========================================================= */}
          <div className="hidden md:flex items-center gap-2.5">
            {student && studentInfo ? (
              // AFTER LOGIN: Streak Badge + Student Profile Pill + Logout
              <div className="flex items-center gap-2">
                
                {/* Daily Streak Indicator */}
                <Link
                  to="/dashboard"
                  title={`${streakCount || 1} Day Streak! Practice daily to stay sharp.`}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 transition-all font-bold text-xs shadow-xs"
                >
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{streakCount || 1}d</span>
                </Link>

                {/* Student / Admin Profile Pill */}
                <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-full pl-1.5 pr-3 py-1 shadow-xs">
                  <Link
                    to={isAdmin ? "/assessment?admin=true" : "/dashboard"}
                    className="flex items-center gap-2 hover:opacity-85 transition-opacity"
                    title={isAdmin ? "Startup Assessment Admin Console" : `Student Dashboard: ${studentInfo.name || studentInfo.roll}`}
                  >
                    <div className="w-7 h-7 rounded-full text-white bg-blue-600 flex items-center justify-center font-bold text-xs shadow-xs">
                      {isAdmin ? <ShieldCheck className="w-4 h-4 text-white" /> : studentInfo.initial}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        {studentInfo.name || studentInfo.roll}
                      </span>
                      {isAdmin && <span className="bg-black text-white text-[9px] px-1 py-0.2 rounded font-sans border border-slate-700">ADMIN</span>}
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Logout from LearnIverse"
                    className="ml-1 p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              // BEFORE LOGIN: Login Button + Admin Login Button + Take Placement Test CTA
              <>
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  variant="outline"
                  className="border-slate-300 text-slate-800 hover:bg-slate-100 font-bold px-3.5 py-2 rounded-xl text-xs lg:text-sm flex items-center gap-1.5 shadow-xs"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Login</span>
                </Button>

                <Button
                  className="bg-black hover:bg-slate-800 text-white font-bold px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm border border-black text-xs lg:text-sm flex items-center gap-1.5"
                  asChild
                >
                  <Link to="/assessment">
                    <Award className="w-4 h-4 text-blue-400" />
                    <span>Take Placement Test</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-black focus:outline-none p-2 rounded-xl hover:bg-slate-100 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-800" />
              ) : (
                <Menu className="h-6 w-6 text-slate-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE MENU DROPDOWN: DISTINCT FOR BEFORE vs AFTER LOGIN  */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-b border-slate-200 dark:border-gray-800 px-5 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {student && studentInfo ? (
            // -------------------------------------------------------
            // AFTER LOGIN (Mobile Menu)
            // -------------------------------------------------------
            <>
              {/* Student Profile Card */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {studentInfo.initial}
                  </div>
                  <div>
                    <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {studentInfo.roll}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {studentInfo.fullBranch}
                    </div>
                  </div>
                </Link>

                {streakCount !== null && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold shadow-xs">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{streakCount}d</span>
                  </div>
                )}
              </div>

              {/* Student Nav Links */}
              <div className="space-y-1 pt-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-bold transition-all ${
                    isActive('/dashboard') ? 'text-black bg-slate-100 border border-slate-200 shadow-xs' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/topics"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all ${
                    isActive('/topics') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-5 h-5 text-slate-500" />
                  <span>Topics</span>
                </Link>

                <Link
                  to="/top-100-codes"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all ${
                    isActive('/top-100-codes') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Code2 className="w-5 h-5 text-slate-500" />
                  <span>Top 100 Codes</span>
                </Link>

                <Link
                  to="/assessment"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all ${
                    isActive('/assessment') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Placement Test</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/assessment?admin=true"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-bold transition-all ${
                      location.search.includes('admin=true') ? 'text-black bg-slate-100 border border-slate-300 shadow-xs' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span>Startup Admin Hub</span>
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse ml-auto" />
                  </Link>
                )}

                <a
                  href="https://cdc-hitam.onrender.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-slate-500" />
                    <span>Check Your Score</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Logout Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout ({studentInfo.roll})</span>
                </Button>
              </div>
            </>
          ) : (
            // -------------------------------------------------------
            // BEFORE LOGIN (Mobile Menu)
            // -------------------------------------------------------
            <>
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                    isActive('/') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-5 h-5 text-slate-500" />
                  <span>Home</span>
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                    isActive('/about') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Info className="w-5 h-5 text-slate-500" />
                  <span>About</span>
                </Link>

                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                    isActive('/how-it-works') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <HelpCircle className="w-5 h-5 text-slate-500" />
                  <span>How It Works</span>
                </Link>

                <Link
                  to="/topics"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                    isActive('/topics') ? 'text-black bg-slate-100 border border-slate-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-5 h-5 text-slate-500" />
                  <span>Topics</span>
                </Link>

                <Link
                  to="/assessment"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-bold text-black ${
                    isActive('/assessment') ? 'bg-slate-100 border border-slate-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Placement Test</span>
                </Link>
              </div>

              {/* Action Buttons for Guest */}
              <div className="pt-3 space-y-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  className="w-full bg-black hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm border border-black flex items-center justify-center gap-2"
                  asChild
                >
                  <Link to="/assessment" onClick={() => setMobileMenuOpen(false)}>
                    <Award className="w-4 h-4 text-blue-400" />
                    <span>Take Placement Test</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full border-slate-300 text-slate-800 hover:bg-slate-100 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Login</span>
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* HITAM / Admin Login Modal */}
      <HitamLoginModal
        isOpen={isLoginModalOpen}
        initialTab={loginModalInitialTab}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(st: any) => {
          setStudent(st);
          window.dispatchEvent(new Event('learniverse_auth_change'));
          if (st?.is_admin || st?.role === 'admin' || localStorage.getItem('learniverse_admin_authed') === 'true') {
            window.location.href = "/assessment?admin=true";
          } else {
            window.location.href = "/dashboard";
          }
        }}
      />

    </header>
  );
};

export default Navbar;
