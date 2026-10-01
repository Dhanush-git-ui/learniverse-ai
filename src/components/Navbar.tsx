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
  Award
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { HitamLoginModal } from './auth/HitamLoginModal';
import { HitamStudentDemographics } from '@/utils/hitamParser';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [student, setStudent] = useState<HitamStudentDemographics | null>(null);
  const [streakCount, setStreakCount] = useState<number | null>(null);
  const location = useLocation();

  // Synchronize student session and streak from localStorage
  const syncStudentState = () => {
    try {
      const saved = localStorage.getItem('learniverse_student');
      if (saved) {
        setStudent(JSON.parse(saved));
      } else {
        setStudent(null);
      }
    } catch {
      setStudent(null);
    }

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
    localStorage.removeItem('learniverse_roll_number');
    localStorage.removeItem('learniverse_streak');
    setStudent(null);
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

  // Safe helper to extract student demographics
  const getStudentInfo = () => {
    if (!student) return null;
    const s = student as any;
    const roll = s.rollNumber || s.roll_number || "Student";
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
      branch: displayBranch || "HITAM",
      fullBranch: branchName || "HITAM Student",
      year: currentYear,
      initial: (roll.charAt(0) || "S").toUpperCase()
    };
  };

  const studentInfo = getStudentInfo();

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-blue-100/50' : 'bg-transparent'
      } dark:bg-gray-900/90 dark:backdrop-blur-md`}
    >
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo: links to /dashboard if logged in, otherwise / */}
          <div className="flex items-center">
            <Link
              to={student ? "/dashboard" : "/"}
              className={`flex items-center space-x-2 text-blue-600 transition-transform hover:scale-105 ${
                isActive('/top-100-codes') ? '-ml-4' : ''
              }`}
            >
              <Lightbulb className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Learn<span className="text-blue-600">Iverse</span>
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
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isActive('/dashboard') 
                      ? 'text-blue-600 bg-blue-50/90 shadow-xs' 
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  <span>Dashboard</span>
                </Link>

                <Link 
                  to="/topics" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                    isActive('/topics') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                  }`}
                >
                  Topics
                </Link>

                <Link 
                  to="/top-100-codes" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                    isActive('/top-100-codes') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                  }`}
                >
                  Top 100 Codes
                </Link>

                <Link 
                  to="/assessment" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                    isActive('/assessment') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                  }`}
                >
                  Placement Test
                </Link>

                <a
                  href="https://cdc-hitam.onrender.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors text-slate-600 hover:text-blue-600 hover:bg-blue-50/70 inline-flex items-center gap-1.5"
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
                    isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                  }`}
                >
                  Home
                </Link>

                <Link 
                  to="/about" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                    isActive('/about') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                  }`}
                >
                  About
                </Link>

                <Link 
                  to="/how-it-works" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                    isActive('/how-it-works') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                  }`}
                >
                  How It Works
                </Link>

                <Link 
                  to="/topics" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                    isActive('/topics') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                  }`}
                >
                  Topics
                </Link>

                <Link 
                  to="/assessment" 
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isActive('/assessment') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50/70'
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

                {/* Student Profile Pill */}
                <div className="flex items-center gap-2 bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl px-3 py-1.5 shadow-xs">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
                    title={`Student Dashboard: ${studentInfo.roll}`}
                  >
                    <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {studentInfo.initial}
                    </div>
                    <div className="text-left leading-tight">
                      <div className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                        {studentInfo.roll}
                      </div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                        {studentInfo.branch} {studentInfo.year ? `• ${studentInfo.year}` : ""}
                      </div>
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
              // BEFORE LOGIN: HITAM Login Button + Take Placement Test CTA
              <>
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  variant="outline"
                  className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-semibold px-3.5 py-2 rounded-xl text-xs lg:text-sm flex items-center gap-1.5 shadow-xs"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>HITAM Login</span>
                </Button>

                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md shadow-blue-500/20 text-xs lg:text-sm flex items-center gap-1.5"
                  asChild
                >
                  <Link to="/assessment">
                    <Award className="w-4 h-4" />
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
              className="text-slate-600 hover:text-blue-600 focus:outline-none p-2 rounded-xl hover:bg-blue-50 transition-colors"
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
        <div className="md:hidden bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl border-b border-blue-100 dark:border-gray-800 px-5 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {student && studentInfo ? (
            // -------------------------------------------------------
            // AFTER LOGIN (Mobile Menu)
            // -------------------------------------------------------
            <>
              {/* Student Profile Card */}
              <div className="p-3.5 rounded-2xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-between shadow-xs">
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
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
                    isActive('/dashboard') ? 'text-blue-600 bg-blue-50 shadow-xs' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/topics"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all ${
                    isActive('/topics') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-5 h-5 text-slate-500" />
                  <span>Topics</span>
                </Link>

                <Link
                  to="/top-100-codes"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all ${
                    isActive('/top-100-codes') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Code2 className="w-5 h-5 text-slate-500" />
                  <span>Top 100 Codes</span>
                </Link>

                <Link
                  to="/assessment"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all ${
                    isActive('/assessment') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-5 h-5 text-slate-500" />
                  <span>Placement Test</span>
                </Link>

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
                    isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-5 h-5 text-slate-500" />
                  <span>Home</span>
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                    isActive('/about') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Info className="w-5 h-5 text-slate-500" />
                  <span>About</span>
                </Link>

                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                    isActive('/how-it-works') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <HelpCircle className="w-5 h-5 text-slate-500" />
                  <span>How It Works</span>
                </Link>

                <Link
                  to="/topics"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-semibold ${
                    isActive('/topics') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-5 h-5 text-slate-500" />
                  <span>Topics</span>
                </Link>

                <Link
                  to="/assessment"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-bold text-blue-600 ${
                    isActive('/assessment') ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Placement Test</span>
                </Link>
              </div>

              {/* Action Buttons for Guest */}
              <div className="pt-3 space-y-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                  asChild
                >
                  <Link to="/assessment" onClick={() => setMobileMenuOpen(false)}>
                    <Award className="w-4 h-4" />
                    <span>Take Placement Test</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>HITAM Student Login</span>
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* HITAM Roll Number Login Modal */}
      <HitamLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(st) => {
          setStudent(st);
          window.dispatchEvent(new Event('learniverse_auth_change'));
          window.location.href = "/dashboard";
        }}
      />

    </header>
  );
};

export default Navbar;
