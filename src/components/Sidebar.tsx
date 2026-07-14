import React from "react";
import { 
  LayoutDashboard, 
  Stethoscope, 
  Calendar, 
  Users, 
  Settings, 
  Sparkles, 
  FileText, 
  Database, 
  Moon, 
  Sun, 
  LogOut, 
  Activity,
  Heart
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUser: { name: string; role: string; department?: string } | null;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Sidebar({
  currentView,
  setCurrentView,
  currentUser,
  onLogout,
  darkMode,
  setDarkMode
}: SidebarProps) {
  
  // Base navigation based on roles
  const getNavItems = () => {
    if (!currentUser) return [];

    const role = currentUser.role;

    if (role === "PATIENT") {
      return [
        { id: "patient-dashboard", label: "Patient Dashboard", icon: LayoutDashboard },
        { id: "patient-appointments", label: "Book Appointment", icon: Calendar },
        { id: "patient-reports", label: "Medical Records", icon: FileText },
        { id: "symptom-checker", label: "AI Symptom Checker", icon: Sparkles },
        { id: "ai-chatbot", label: "Dr. Gemini AI Chat", icon: Activity },
      ];
    } else if (role === "DOCTOR") {
      return [
        { id: "doctor-dashboard", label: "Doctor Dashboard", icon: LayoutDashboard },
        { id: "doctor-appointments", label: "My Appointments", icon: Calendar },
        { id: "doctor-slots", label: "Manage Availability", icon: Settings },
      ];
    } else if (role === "ADMIN") {
      return [
        { id: "admin-dashboard", label: "Admin Control Room", icon: LayoutDashboard },
        { id: "admin-doctors", label: "Manage Doctors", icon: Stethoscope },
        { id: "admin-patients", label: "Manage Patients", icon: Users },
        { id: "admin-settings", label: "System Configs", icon: Settings },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  return (
    <aside className={`w-64 h-screen flex flex-col justify-between border-r shrink-0 transition-all duration-300
      ${darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"}`}
    >
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-850 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center ai-gradient text-white shadow-lg shadow-sky-500/20">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-base leading-none tracking-tight text-slate-900 dark:text-white uppercase">MediSmart AI</h1>
            <span className="text-[9px] uppercase font-mono text-sky-500 font-semibold tracking-widest block mt-0.5">St. Jude Portal</span>
          </div>
        </div>

        {/* User profile brief */}
        {currentUser && (
          <div className={`p-3.5 mx-4 mt-4 rounded-xl border flex items-center gap-3
            ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}
          >
            <div className="w-8 h-8 rounded-full ai-gradient text-white flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="font-sans font-bold text-xs leading-tight text-slate-900 dark:text-white">{currentUser.name}</p>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                {currentUser.role === "DOCTOR" ? `${currentUser.department} Chief` : currentUser.role}
              </span>
            </div>
          </div>
        )}

        {/* Nav list */}
        <nav className="p-4 space-y-1">
          <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400 pl-2 mb-2 font-bold">Core Modules</p>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200
                  ${isActive 
                    ? "bg-slate-900 text-white dark:bg-slate-800 shadow-md" 
                    : darkMode 
                      ? "text-slate-400 hover:bg-slate-800 hover:text-slate-100" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-inherit space-y-2">
        {/* Dark Mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-medium transition-colors
            ${darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"}`}
        >
          <div className="flex items-center gap-3">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{darkMode ? "Light Theme" : "Dark Theme"}</span>
          </div>
          <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded uppercase
            ${darkMode ? "bg-slate-800 text-amber-500" : "bg-slate-200 text-slate-800"}`}
          >
            {darkMode ? "Dark" : "Light"}
          </span>
        </button>

        {/* Logout action */}
        {currentUser && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Portal</span>
          </button>
        )}
      </div>
    </aside>
  );
}
