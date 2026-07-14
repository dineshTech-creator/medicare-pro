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
