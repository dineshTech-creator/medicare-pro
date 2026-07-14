import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle, 
  X, 
  Activity, 
  Sparkles, 
  Stethoscope, 
  Award, 
  Star,
  Plus,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import axios from "axios";
import { Doctor, Appointment, Patient } from "../types";

interface PatientDashboardProps {
  darkMode: boolean;
  patient: Patient;
  doctors: Doctor[];
  appointments: Appointment[];
  onBookAppointment: (appointment: Omit<Appointment, "id">) => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string, date: string, time: string) => void;
}

export default function PatientDashboard({
  darkMode,
  patient,
  doctors,
  appointments,
  onBookAppointment,
  onCancelAppointment,
  onRescheduleAppointment
}: PatientDashboardProps) {
  
  // States for search and booking
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedExperience, setSelectedExperience] = useState(0);

  // Booking process states
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingSymptoms, setBookingSymptoms] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<string | null>(null);

  // General Health tips state
  const [healthTips, setHealthTips] = useState<string | null>(null);
  const [tipsLoading, setTipsLoading] = useState(false);

  // Load health tips on component mount based on age
  useEffect(() => {
    async function fetchTips() {
      setTipsLoading(true);
      try {
        const response = await axios.post("/api/gemini/health-tips", {
          department: "General Medicine",
          patientAge: "24"
        });
        setHealthTips(response.data.tips);
      } catch (e) {
        console.error(e);
      } finally {
        setTipsLoading(false);
      }
    }
    fetchTips();
  }, []);

  // Filter approved doctors
  const filteredDoctors = doctors.filter(doc => {
    if (doc.status !== "APPROVED") return false;
    
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === "All" || doc.department === selectedDept;
    const matchesRating = doc.rating >= selectedRating;
    const matchesExp = doc.experience >= selectedExperience;

    return matchesSearch && matchesDept && matchesRating && matchesExp;
  });

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor || !bookingDate || !bookingTime) return;

    setBookingLoading(true);
    let aiSummary = undefined;

    try {
      // Get AI recommendations/summary pre-booking for that symptom
      if (bookingSymptoms.trim()) {
        const response = await axios.post("/api/gemini/symptom-check", {
          symptoms: bookingSymptoms,
          patientAge: "24",
          patientGender: "Male"
        });
        aiSummary = response.data.analysis;
      }

      onBookAppointment({
        patientId: patient.id,
        patientName: patient.name,
        doctorId: bookingDoctor.id,
        doctorName: bookingDoctor.name,
        department: bookingDoctor.department,
        date: bookingDate,
        time: bookingTime,
        status: "UPCOMING",
        symptoms: bookingSymptoms,
        aiSummary
      });

      // Show success
      setBookingSummary(aiSummary || "Appointment booked successfully.");
      setBookingDoctor(null);
      setBookingDate("");
      setBookingTime("");
      setBookingSymptoms("");
    } catch (err) {
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  const myAppointments = appointments.filter(a => a.patientId === patient.id);

  return (
    <div className="flex-grow p-8 overflow-y-auto max-w-7xl mx-auto font-sans">
      <div className="space-y-8">
        
        {/* Welcome Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Hello, {patient.name}!
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Welcome to your secure patient clinical portal.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-[10px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full font-bold">
              Blood Group: {patient.bloodGroup}
            </span>
            <span className="px-2.5 py-1 text-[10px] font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-full font-bold">
              ID: {patient.id}
            </span>
          </div>
        </div>

        {/* AI Health Tips Block */}
        <div className={`p-6 rounded-2xl border relative overflow-hidden
          ${darkMode 
            ? "bg-[#0F172A]/40 border-slate-800 shadow-xl" 
            : "bg-gradient-to-r from-sky-50/40 to-blue-50/10 border-slate-200 text-slate-800"}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4.5 h-4.5 text-sky-500 animate-pulse" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">Dr. Gemini AI Daily Preventative Health Tips</h3>
          </div>
          
          {tipsLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-slate-300 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-3 bg-slate-300 dark:bg-slate-800 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="text-xs leading-relaxed text-slate-400 whitespace-pre-line">
              {healthTips || "- Focus on dynamic stretching before aerobics.\n- Keep your clinical records updated."}
            </div>
          )}
        </div>

        {/* Booking Notification modal */}
        {bookingSummary && (
          <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3 relative">
            <button 
              onClick={() => setBookingSummary(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-emerald-500">
              <CheckCircle className="w-5 h-5" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Appointment Scheduled & Screened</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
              Our clinical resident screened your symptoms. Here is the doctor preparation guidance:<br />
              <span className="block mt-2 font-mono text-[11px] bg-[#0F172A] p-3 rounded-lg border border-slate-800 text-sky-400 whitespace-pre-line">
                {bookingSummary}
              </span>
            </p>
          </div>
        )}

        {/* Active Appointments */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">Your Scheduled Consultations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAppointments.length === 0 ? (
              <div className={`p-8 col-span-2 rounded-2xl border text-center text-xs text-slate-400 border-dashed
                ${darkMode ? "bg-slate-950/10 border-slate-800" : "bg-slate-50 border-slate-200"}`}
              >
                You have no upcoming or historical consultations scheduled. Choose a specialist below to book!
              </div>
            ) : (
              myAppointments.map((apt) => (
                <div 
                  key={apt.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all
                    ${darkMode ? "bg-[#0F172A]/40 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-sky-500/20"}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className={`px-2 py-0.5 text-[9px] font-mono rounded font-semibold
                        ${apt.status === "UPCOMING" 
                          ? "bg-sky-500/15 text-sky-500 border border-sky-500/20" 
                          : apt.status === "COMPLETED" 
                            ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                            : "bg-rose-500/15 text-rose-500 border border-rose-500/20"}`}
                      >
                        {apt.status}
                      </span>
                      <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-slate-100 mt-2">{apt.doctorName}</h4>
                      <p className="text-[10px] font-mono text-sky-500 uppercase tracking-wide">Dept: {apt.department}</p>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{apt.time}</span>
                      </div>
                    </div>
                  </div>

                  {apt.symptoms && (
                    <p className="text-[11px] bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 text-slate-400 font-sans italic truncate">
                      Symptoms: "{apt.symptoms}"
                    </p>
                  )}

                  {apt.status === "UPCOMING" && (
                    <div className="flex justify-end gap-2 border-t pt-3 border-inherit">
                      <button
                        onClick={() => onCancelAppointment(apt.id)}
                        className="px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-semibold transition-colors"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Search & Book a Doctor */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">Discover Clinic Specialists</h2>
            
            {/* Simple Search Input */}
            <div className="flex items-center gap-2 max-w-md w-full">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search specialist name or bio..."
                  className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                    ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                />
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2.5">
            {/* Department */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className={`px-3 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-700"}`}
            >
              <option value="All">All Specialties</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Dermatology">Dermatology</option>
            </select>

            {/* Experience */}
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(Number(e.target.value))}
              className={`px-3 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-700"}`}
            >
              <option value={0}>Any Experience</option>
              <option value={5}>5+ Years</option>
              <option value={10}>10+ Years</option>
              <option value={15}>15+ Years</option>
            </select>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div 
                key={doc.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between gap-5 transition-all
                  ${darkMode ? "bg-[#0F172A]/40 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-sky-500/30"}`}
              >
                <div className="space-y-3">
                  <div className="flex gap-3 items-center">
                    <img 
                      src={doc.photo} 
                      alt={doc.name} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200/40"
                    />
                    <div>
                      <h4 className="font-sans font-bold text-xs text-slate-900 dark:text-slate-100 leading-none">{doc.name}</h4>
                      <p className="text-[10px] text-sky-500 font-mono uppercase tracking-wide mt-1 font-semibold">{doc.department} chief</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <b>{doc.rating}</b>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          <b>{doc.experience} yrs exp</b>
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-400">{doc.bio}</p>
                </div>

                <div className="border-t pt-3 border-inherit flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Availability</span>
                    <span className="block text-[10px] font-bold text-slate-900 dark:text-slate-300">
                      {doc.availability.join(", ")}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setBookingDoctor(doc);
                      setBookingDate("");
                      setBookingTime("");
                      setBookingSymptoms("");
                    }}
                    className="px-3.5 py-1.5 ai-gradient hover:opacity-95 text-white rounded-lg text-[10px] font-bold transition-all shadow-md shadow-sky-500/10 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Book Specialist</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form Overlay Modal */}
        {bookingDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className={`p-6 rounded-2xl border w-full max-w-md space-y-4 shadow-2xl relative
              ${darkMode ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
            >
              <button 
                onClick={() => setBookingDoctor(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-sky-500 font-bold uppercase tracking-widest">Confirm Booking</span>
                <h3 className="text-base font-extrabold font-display text-slate-900 dark:text-white">
                  Schedule with {bookingDoctor.name}
                </h3>
                <p className="text-[11px] text-slate-400 uppercase font-mono">{bookingDoctor.department} Specialty</p>
              </div>

              <form onSubmit={handleBookSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Consultation Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                      ${darkMode ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Available Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                      ${darkMode ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                    required
                  >
                    <option value="">Select a slot</option>
                    {bookingDoctor.slots.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Tell us your symptoms (for Dr. Gemini Screening)</label>
                  <textarea
                    value={bookingSymptoms}
                    onChange={(e) => setBookingSymptoms(e.target.value)}
                    placeholder="e.g. Mild shortness of breath when running, onset 2 days..."
                    rows={3}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500 leading-normal
                      ${darkMode ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold ai-gradient hover:opacity-95 text-white shadow-md shadow-sky-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {bookingLoading ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      <span>Consulting Gemini Screening...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirm Appointment Slot</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
