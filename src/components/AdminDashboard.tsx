import React, { useState } from "react";
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Settings, 
  Check, 
  X, 
  Plus, 
  Activity, 
  Trash2, 
  AlertTriangle,
  Heart
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { Doctor, Patient, Appointment, SystemSettings } from "../types";

interface AdminDashboardProps {
  darkMode: boolean;
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  settings: SystemSettings;
  onApproveDoctor: (id: string) => void;
  onRejectDoctor: (id: string) => void;
  onAddDoctor: (doc: Omit<Doctor, "id">) => void;
  onRemoveDoctor: (id: string) => void;
  onUpdateSettings: (settings: Partial<SystemSettings>) => void;
  currentView?: string;
}

export default function AdminDashboard({
  darkMode,
  doctors,
  patients,
  appointments,
  settings,
  onApproveDoctor,
  onRejectDoctor,
  onAddDoctor,
  onRemoveDoctor,
  onUpdateSettings,
  currentView = "admin-dashboard"
}: AdminDashboardProps) {
  
  // Settings edit states
  const [hospName, setHospName] = useState(settings.hospitalName);
  const [emergencyPhone, setEmergencyPhone] = useState(settings.emergencyContact);
  const [autoApprove, setAutoApprove] = useState(settings.allowAutoApproveDoctors);

  // Add Specialist states
  const [showAddForm, setShowAddForm] = useState(false);
  const [docName, setDocName] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [docDept, setDocDept] = useState("Cardiology");
  const [docExp, setDocExp] = useState(5);
  const [docBio, setDocBio] = useState("");

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      hospitalName: hospName,
      emergencyContact: emergencyPhone,
      allowAutoApproveDoctors: autoApprove
    });
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docEmail.trim()) return;

    onAddDoctor({
      name: docName,
      email: docEmail,
      role: "DOCTOR",
      department: docDept,
      experience: Number(docExp),
      rating: 5.0,
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
      bio: docBio,
      status: "APPROVED"
    });

    // Reset Form
    setDocName("");
    setDocEmail("");
    setDocDept("Cardiology");
    setDocExp(5);
    setDocBio("");
    setShowAddForm(false);
  };

  // Pending doctors list
  const pendingDoctors = doctors.filter(d => d.status === "PENDING");
  const approvedDoctors = doctors.filter(d => d.status === "APPROVED");

  // Charts data preparation
  // Bar Chart data: Appointments count per Department
  const deptAptCounts: Record<string, number> = {};
  appointments.forEach(apt => {
    deptAptCounts[apt.department] = (deptAptCounts[apt.department] || 0) + 1;
  });
  const barChartData = Object.keys(deptAptCounts).map(dept => ({
    name: dept,
    Consultations: deptAptCounts[dept]
  }));

  // Pie Chart data: Doctors per Department
  const docDeptCounts: Record<string, number> = {};
  approvedDoctors.forEach(doc => {
    docDeptCounts[doc.department] = (docDeptCounts[doc.department] || 0) + 1;
  });
  const pieChartData = Object.keys(docDeptCounts).map(dept => ({
    name: dept,
    value: docDeptCounts[dept]
  }));

  const COLORS = ["#38bdf8", "#2563eb", "#ec4899", "#f59e0b", "#3b82f6", "#10b981"];

  return (
    <div className="flex-grow p-8 overflow-y-auto max-w-7xl mx-auto font-sans">
      <div className="space-y-8">
        
        {/* Header Title */}
        <div className="flex justify-between items-center border-b pb-4 border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-sky-500 font-bold uppercase tracking-widest">Administrator Operations</span>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              {currentView === "admin-dashboard" && "Clinical Hub Analytics"}
              {currentView === "admin-doctors" && "Specialist Registry Control"}
              {currentView === "admin-patients" && "Patient Records Registry"}
              {currentView === "admin-settings" && "System Configuration Core"}
            </h1>
          </div>
        </div>

        {/* View 1: Analytics Dashboard */}
        {currentView === "admin-dashboard" && (
          <div className="space-y-8">
            {/* Analytics Numeric Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-5 rounded-2xl border flex items-center justify-between shadow-sm
                ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Total Specialists</span>
                  <p className="text-xl font-bold dark:text-white mt-1">{approvedDoctors.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
              </div>

              <div className={`p-5 rounded-2xl border flex items-center justify-between shadow-sm
                ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Registered Patients</span>
                  <p className="text-xl font-bold dark:text-white mt-1">{patients.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className={`p-5 rounded-2xl border flex items-center justify-between shadow-sm
                ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Total Booked</span>
                  <p className="text-xl font-bold dark:text-white mt-1">{appointments.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-pink-600/10 text-pink-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              <div className={`p-5 rounded-2xl border flex items-center justify-between shadow-sm
                ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Pending Registries</span>
                  <p className="text-xl font-bold dark:text-white mt-1">{pendingDoctors.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 pl-1">Clinic Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Bar Chart */}
                <div className={`p-5 rounded-2xl border space-y-3
                  ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
                >
                  <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Consultations per Specialty</h3>
                  <div className="h-56">
                    {barChartData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400">No appointments recorded.</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                          <Bar dataKey="Consultations" fill="#0284c7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Pie Chart */}
                <div className={`p-5 rounded-2xl border space-y-3
                  ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
                >
                  <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Specialist Department Ratios</h3>
                  <div className="h-56">
                    {pieChartData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400">No active doctors.</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* View 2: Manage Doctors */}
        {currentView === "admin-doctors" && (
          <div className="space-y-8">
            {/* Moderation Queue */}
            <div className="space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 pl-1">Credentials Moderation Queue</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingDoctors.length === 0 ? (
                  <div className={`p-8 col-span-2 rounded-2xl border text-center text-xs text-slate-400 border-dashed
                    ${darkMode ? "bg-[#0F172A]/10 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                  >
                    No pending doctor credential applications. All active specialists are validated.
                  </div>
                ) : (
                  pendingDoctors.map((doc) => (
                    <div 
                      key={doc.id}
                      className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all
                        ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
                    >
                      <div className="flex gap-3 items-center truncate">
                        <img 
                          src={doc.photo} 
                          alt={doc.name} 
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="truncate">
                          <p className="font-sans font-bold text-xs text-slate-900 dark:text-slate-100">{doc.name}</p>
                          <span className="text-[10px] text-sky-500 font-mono block uppercase">Dept: {doc.department} • {doc.experience} yrs exp</span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => onApproveDoctor(doc.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Registry</span>
                        </button>
                        <button
                          onClick={() => onRejectDoctor(doc.id)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Approved Active Doctors */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pl-1">
                <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">Active Certified Specialists</h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddForm ? "Cancel" : "Add Specialist"}</span>
                </button>
              </div>

              {showAddForm && (
                <form 
                  onSubmit={handleAddDoctorSubmit}
                  className={`p-6 rounded-2xl border space-y-4 transition-all ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}
                >
                  <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 border-b pb-2 border-slate-100 dark:border-slate-800">
                    Register New Doctor Profile
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Doctor's Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Arthur Conan"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                          ${darkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Official Email</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. arthur.c@stjude.org"
                        value={docEmail}
                        onChange={(e) => setDocEmail(e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                          ${darkMode ? "bg-slate-955 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Department Specialty</label>
                      <select
                        value={docDept}
                        onChange={(e) => setDocDept(e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                          ${darkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                      >
                        <option value="Cardiology">Cardiology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="General Medicine">General Medicine</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Years of Experience</label>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        required
                        value={docExp}
                        onChange={(e) => setDocExp(Number(e.target.value))}
                        className={`w-full px-3 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                          ${darkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Brief Medical Bio</label>
                    <textarea
                      rows={2}
                      placeholder="Provide a brief clinical background and certifications..."
                      value={docBio}
                      onChange={(e) => setDocBio(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                        ${darkMode ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Create & Approve Specialist Profile
                  </button>
                </form>
              )}

              <div className={`overflow-hidden rounded-2xl border ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-inherit text-[10px] font-mono text-slate-400 uppercase bg-slate-955/20">
                        <th className="p-4">Physician Details</th>
                        <th className="p-4">Medical Specialty</th>
                        <th className="p-4">Professional Rating</th>
                        <th className="p-4">Registry ID</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit text-xs">
                      {approvedDoctors.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                            No active certified specialists registered.
                          </td>
                        </tr>
                      ) : (
                        approvedDoctors.map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-500/5 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <img src={doc.photo} alt={doc.name} className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                              <div>
                                <p className="font-bold text-slate-900 dark:text-slate-100">{doc.name}</p>
                                <span className="text-[10px] text-slate-400 font-mono">Experience: {doc.experience} Years</span>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-[11px] text-sky-500 uppercase">{doc.department}</td>
                            <td className="p-4 font-semibold text-amber-500">★ {doc.rating}</td>
                            <td className="p-4 font-mono text-[10px] text-slate-400">{doc.id}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to remove ${doc.name} from the medical registry?`)) {
                                    onRemoveDoctor(doc.id);
                                  }
                                }}
                                className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                                title="Remove Doctor"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 3: Manage Patients */}
        {currentView === "admin-patients" && (
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 pl-1">Registered Clinical Patients</h2>
            <div className={`overflow-hidden rounded-2xl border ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-inherit text-[10px] font-mono text-slate-400 uppercase bg-slate-950/20">
                      <th className="p-4">Patient Name</th>
                      <th className="p-4">Contact Information</th>
                      <th className="p-4">Clinical Blood Group</th>
                      <th className="p-4">Secure Identifier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-inherit text-xs">
                    {patients.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                          No patient profiles registered in system memory.
                        </td>
                      </tr>
                    ) : (
                      patients.map((pat) => (
                        <tr key={pat.id} className="hover:bg-slate-500/5 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-slate-900 dark:text-slate-100">{pat.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">Patient Registry Record</span>
                          </td>
                          <td className="p-4 font-mono text-[11px] text-slate-300">
                            <div>Email: {pat.email}</div>
                            <div className="text-[10px] text-slate-500">Secure Vault Account</div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 font-mono text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full font-bold">
                              {pat.bloodGroup}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[10px] text-slate-400">{pat.id}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* View 4: System Settings */}
        {currentView === "admin-settings" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 pl-1">Configuration Panel</h2>
            
            <form 
              onSubmit={handleSettingsSave}
              className={`p-6 rounded-2xl border space-y-6
                ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5 border-b pb-2 border-slate-800">
                <Settings className="w-4 h-4 text-sky-500" /> System Variables
              </h3>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Clinical Name</label>
                <input
                  type="text"
                  value={hospName}
                  onChange={(e) => setHospName(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                    ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Emergency Line</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                    ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                />
              </div>

              <div className="flex items-center justify-between py-2 text-xs text-slate-400">
                <span>Auto-Approve Doctor Registries</span>
                <input
                  type="checkbox"
                  checked={autoApprove}
                  onChange={(e) => setAutoApprove(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-sky-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Apply Configurations
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
