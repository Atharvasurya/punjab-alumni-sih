export interface User {
  id: string;
  role: 'alumni' | 'students' | 'admin' | 'collage';
  username: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  college: string;
  degree: string;
  branch: string;
  year: number;
  gpa: string;
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface Alumni extends User {
  role: 'alumni';
  current_job: {
    title: string;
    company: string;
    start_date: string;
    description: string;
  };
  past_jobs: Array<{
    title: string;
    company: string;
    from: string;
    to: string;
  }>;
  mentorship: {
    isMentor: boolean;
    mentees: string[];
  };
  donations: Array<{
    id: string;
    amount: number;
    date: string;
    note: string;
  }>;
}

export interface Student extends User {
  role: 'students';
  mentor?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  posted_by: string;
  type: 'internship' | 'job' | 'collaboration' | 'funding';
  description: string;
  location: string;
  starts: string;
  deadline: string;
  requirements: string[];
  applications: Array<{
    userId: string;
    applied_at: string;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  attendees: string[];
  created_at: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: string;
  details: string;
}

export interface DatabaseData {
  users: (Alumni | Student)[];
  opportunities: Opportunity[];
  events: Event[];
  messages: Message[];
  auditLogs: AuditLog[];
}

export interface AuthResponse {
  ok: boolean;
  role?: string;
  message?: string;
}
