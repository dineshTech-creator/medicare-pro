// ─── Domain Models ────────────────────────────────────────────────────────────

export interface Doctor {
  id: string;
  name: string;
  email: string;
  role: "DOCTOR";
  department: string;
  experience: number;
  rating: number;
  availability: string[];
  slots: string[];
  photo: string;
  bio: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  consultationFee?: number;
  totalPatients?: number;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  role: "PATIENT";
  phone: string;
  dob: string;
  bloodGroup: string;
  photo: string;
  medicalHistory: string;
  joinedDate: string;
  weight?: string;
  height?: string;
  allergies?: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  symptoms: string;
  aiSummary?: string;
  type?: "In-Person" | "Video" | "Phone";
}

export interface MedicalReport {
  id: string;
  patientId: string;
  fileName: string;
  uploadDate: string;
  fileSize: string;
  summary?: string;
  category: string;
}

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface SystemSettings {
  hospitalName: string;
  allowAutoApproveDoctors: boolean;
  enableSmsNotifications: boolean;
  maxAppointmentsPerSlot: number;
  emergencyContact: string;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  section?: string;
}

export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

export interface UserSession {
  name: string;
  role: UserRole;
  id: string;
  department?: string;
  photo?: string;
  email?: string;
}

// ─── Developer Spec Types ─────────────────────────────────────────────────────

export interface SpringFile {
  path: string;
  language: string;
  code: string;
  explanation: string;
}

export interface PhaseInfo {
  number: number;
  title: string;
  status: "ACTIVE_EDITABLE" | "COMPLETED" | "PROPOSED";
  description: string;
  learningOutcomes: string[];
  springFiles?: SpringFile[];
  databaseDesign?: {
    diagram?: string;
    sqlSchema?: string;
    normalForms?: string;
  };
  commonErrors?: string[];
  bestPractices?: string[];
  testingSteps?: string[];
}
