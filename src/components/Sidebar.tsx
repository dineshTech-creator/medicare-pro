import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Calendar, FileText, Sparkles, MessageSquare,
  Stethoscope, Users, Settings, Activity, LogOut, ChevronLeft,
  ChevronRight, PanelLeft, ClipboardList, Clock
} from "lucide-react";
import { UserSession } from "../types";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUser: UserSession | null;
  onLogout: () => void;
  darkMode: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

// ─── Nav definitions per role ─────────────────────────────────────────────────

const NAV_PATIENT = [
  { id: "patient-dashboard",    label: "Dashboard",        icon: LayoutDashboard, section: "Overview" },
  { id: "patient-appointments", label: "Book Appointment", icon: Calendar,        section: "Overview" },
  { id: "patient-reports",      label: "Medical Records",  icon: FileText,        section: "Health" },
  { id: "symptom-checker",      label: "Symptom Checker",  icon: Sparkles,        section: "Health", badge: "AI" },
  { id: "ai-chatbot",           label: "AI Doctor Chat",   icon: MessageSquare,   section: "Health", badge: "AI" },
];

const NAV_DOCTOR = [
  { id: "doctor-dashboard",    label: "Dashboard",        icon: LayoutDashboard, section: "Overview" },
  { id: "doctor-appointments", label: "Appointments",     icon: ClipboardList,   section: "Clinical" },
  { id: "doctor-slots",        label: "Availability",     icon: Clock,           section: "Clinical" },
];

const NAV_ADMIN = [
  { id: "admin-dashboard", label: "Analytics",       icon: LayoutDashboard, section: "Overview" },
  { id: "admin-doctors",   label: "Doctors",         icon: Stethoscope,     section: "Management" },
  { id: "admin-patients",  label: "Patients",        icon: Users,           section: "Management" },
  { id: "admin-settings",  label: "Configuration",   icon: Settings,        section: "System" },
];

const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
  PATIENT: { label: "Patient",       color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-900/30" },
  DOCTOR:  { label: "Physician",     color: "text-teal-600 dark:text-teal-400",   bg: "bg-teal-50 dark:bg-teal-900/30" },
  ADMIN:   { label: "Administrator", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/30" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({
  currentView, setCurrentView, currentUser, onLogout,
  darkMode, collapsed, onToggleCollapse,
}: SidebarProps) {
  if (!currentUser) return null;

  const navItems =
    currentUser.role === "PATIENT" ? NAV_PATIENT :
    currentUser.role === "DOCTOR"  ? NAV_DOCTOR  : NAV_ADMIN;

  const meta = ROLE_META[currentUser.role];

  // Group nav items by section
  const sections = navItems.reduce<Record<string, typeof navItems>>((acc, item) => {
    const s = item.section ?? "General";
    if (!acc[s]) acc[s] = [];
    acc[s].push(item);
    return acc;
  }, {});

  const initials = currentUser.name
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sidebarWidth = collapsed ? 68 : 240;

  return (
    <motion.aside
      animate={{ width: sidebarWidth }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className={`relative flex flex-col h-full shrink-0 overflow-hidden transition-colors z-20
        ${darkMode
          ? "bg-slate-900 border-r border-slate-800"
          : "bg-white border-r border-slate-200"}`}
    >
      {/* ── Brand ───────────────────────────────────────────────────────────── */}
      <div className={`flex items-center h-14 border-b shrink-0 transition-colors
        ${darkMode ? "border-slate-800" : "border-slate-200"}`}
        style={{ paddingLeft: collapsed ? 16 : 20, paddingRight: collapsed ? 16 : 12 }}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-brand shrink-0">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <span className={`text-sm font-bold tracking-tight whitespace-nowrap leading-none block ${darkMode ? "text-white" : "text-slate-900"}`}>
                  MediCare Pro
                </span>
                <span className="text-[10px] text-blue-500 font-semibold whitespace-nowrap block mt-0.5">
                  Healthcare Platform
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onToggleCollapse}
          className={`ml-auto p-1.5 rounded-lg transition-colors shrink-0
            ${darkMode
              ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <ChevronLeft  className="w-4 h-4" />}
        </button>
      </div>

      {/* ── User Profile Pill ────────────────────────────────────────────────── */}
      <div className={`mx-3 mt-3 rounded-xl transition-colors overflow-hidden
        ${darkMode ? "bg-slate-800/60" : "bg-slate-50"}`}
        style={{ padding: collapsed ? "10px 8px" : "12px" }}
      >
        <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden min-w-0"
              >
                <p className={`text-xs font-semibold truncate leading-none ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                  {currentUser.name}
                </p>
                <span className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${meta.bg} ${meta.color}`}>
                  {meta.label}
                  {currentUser.department && ` · ${currentUser.department}`}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4 px-2.5">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1.5 text-slate-400"
                >
                  {section}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="space-y-0.5">
              {items.map(item => {
                const isActive = currentView === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`nav-item w-full relative ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : "px-3"}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeBar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-blue-500"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}

                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-500" : ""}`} />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden whitespace-nowrap flex-1 text-left text-[13px]"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Badge */}
                    {!collapsed && item.badge && (
                      <span className="ml-auto shrink-0 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-500">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div className={`pb-4 pt-2 px-2.5 space-y-1 border-t transition-colors
        ${darkMode ? "border-slate-800" : "border-slate-100"}`}
      >
        {/* System status */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={`mx-0.5 mb-2 px-3 py-2 rounded-lg flex items-center gap-2
                ${darkMode ? "bg-slate-800/60" : "bg-emerald-50"}`}
            >
              <span className="pulse-dot" />
              <span className={`text-[11px] font-medium ${darkMode ? "text-slate-400" : "text-emerald-700"}`}>
                All systems operational
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onLogout}
          title={collapsed ? "Sign out" : undefined}
          className={`nav-item w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
            ${collapsed ? "justify-center px-2" : "px-3"}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden whitespace-nowrap text-[13px] font-medium"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
