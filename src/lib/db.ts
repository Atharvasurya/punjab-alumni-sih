import fs from 'fs';
import path from 'path';
import { DatabaseData, Alumni, Student, Opportunity, Event, Message, AuditLog } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Initialize database from seed data if it doesn't exist
function initializeDatabase(): DatabaseData {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(data);
    } else {
      // Create data directory if it doesn't exist
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // Load seed data
      const seedPath = path.join(process.cwd(), 'seed', 'alumni.json');
      const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      
      // Transform seed data to match our database structure
      const dbData: DatabaseData = {
        users: [...seedData.users],
        opportunities: seedData.opportunities || [],
        events: seedData.events || [],
        messages: seedData.messages || [],
        auditLogs: seedData.auditLogs || []
      };
      
      // Save to database
      fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2));
      return dbData;
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    return {
      users: [],
      opportunities: [],
      events: [],
      messages: [],
      auditLogs: []
    };
  }
}

function saveDatabase(data: DatabaseData): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

export class Database {
  private static instance: Database;
  private data: DatabaseData;

  private constructor() {
    this.data = initializeDatabase();
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Users
  getAllUsers(): (Alumni | Student)[] {
    return this.data.users;
  }

  getUserById(id: string): Alumni | Student | undefined {
    return this.data.users.find(user => user.id === id);
  }

  getUserByUsername(username: string): Alumni | Student | undefined {
    return this.data.users.find(user => user.username === username);
  }

  getAlumni(filters?: { year?: number; branch?: string; company?: string; skill?: string; q?: string }): Alumni[] {
    let alumni = this.data.users.filter(user => user.role === 'alumni') as Alumni[];
    
    if (filters) {
      if (filters.year) {
        alumni = alumni.filter(a => a.year === filters.year);
      }
      if (filters.branch) {
        alumni = alumni.filter(a => a.branch.toLowerCase().includes(filters.branch!.toLowerCase()));
      }
      if (filters.company) {
        alumni = alumni.filter(a => a.current_job.company.toLowerCase().includes(filters.company!.toLowerCase()));
      }
      if (filters.skill) {
        alumni = alumni.filter(a => a.skills.some(skill => skill.toLowerCase().includes(filters.skill!.toLowerCase())));
      }
      if (filters.q) {
        const query = filters.q.toLowerCase();
        alumni = alumni.filter(a => 
          a.name.toLowerCase().includes(query) ||
          a.current_job.company.toLowerCase().includes(query) ||
          a.skills.some(skill => skill.toLowerCase().includes(query))
        );
      }
    }
    
    return alumni;
  }

  createUser(user: Alumni | Student): void {
    this.data.users.push(user);
    saveDatabase(this.data);
  }

  updateUser(id: string, updates: Partial<Alumni | Student>): boolean {
    const index = this.data.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.data.users[index] = { 
        ...this.data.users[index], 
        ...updates, 
        updated_at: new Date().toISOString() 
      } as Alumni | Student;
      saveDatabase(this.data);
      return true;
    }
    return false;
  }

  deleteUser(id: string): boolean {
    const index = this.data.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.data.users.splice(index, 1);
      saveDatabase(this.data);
      return true;
    }
    return false;
  }

  // Opportunities
  getAllOpportunities(): Opportunity[] {
    return this.data.opportunities;
  }

  getOpportunityById(id: string): Opportunity | undefined {
    return this.data.opportunities.find(opp => opp.id === id);
  }

  createOpportunity(opportunity: Opportunity): void {
    this.data.opportunities.push(opportunity);
    saveDatabase(this.data);
  }

  updateOpportunity(id: string, updates: Partial<Opportunity>): boolean {
    const index = this.data.opportunities.findIndex(opp => opp.id === id);
    if (index !== -1) {
      this.data.opportunities[index] = { ...this.data.opportunities[index], ...updates };
      saveDatabase(this.data);
      return true;
    }
    return false;
  }

  deleteOpportunity(id: string): boolean {
    const index = this.data.opportunities.findIndex(opp => opp.id === id);
    if (index !== -1) {
      this.data.opportunities.splice(index, 1);
      saveDatabase(this.data);
      return true;
    }
    return false;
  }

  applyToOpportunity(opportunityId: string, userId: string): boolean {
    const opportunity = this.getOpportunityById(opportunityId);
    if (opportunity) {
      const existingApplication = opportunity.applications.find(app => app.userId === userId);
      if (!existingApplication) {
        opportunity.applications.push({
          userId,
          applied_at: new Date().toISOString(),
          status: 'pending'
        });
        this.updateOpportunity(opportunityId, opportunity);
        return true;
      }
    }
    return false;
  }

  // Events
  getAllEvents(): Event[] {
    return this.data.events;
  }

  getEventById(id: string): Event | undefined {
    return this.data.events.find(event => event.id === id);
  }

  createEvent(event: Event): void {
    this.data.events.push(event);
    saveDatabase(this.data);
  }

  updateEvent(id: string, updates: Partial<Event>): boolean {
    const index = this.data.events.findIndex(event => event.id === id);
    if (index !== -1) {
      this.data.events[index] = { ...this.data.events[index], ...updates };
      saveDatabase(this.data);
      return true;
    }
    return false;
  }

  deleteEvent(id: string): boolean {
    const index = this.data.events.findIndex(event => event.id === id);
    if (index !== -1) {
      this.data.events.splice(index, 1);
      saveDatabase(this.data);
      return true;
    }
    return false;
  }

  rsvpToEvent(eventId: string, userId: string): boolean {
    const event = this.getEventById(eventId);
    if (event && !event.attendees.includes(userId)) {
      event.attendees.push(userId);
      this.updateEvent(eventId, event);
      return true;
    }
    return false;
  }

  // Messages
  getMessages(userId1: string, userId2?: string): Message[] {
    if (userId2) {
      return this.data.messages.filter(msg => 
        (msg.from === userId1 && msg.to === userId2) || 
        (msg.from === userId2 && msg.to === userId1)
      );
    }
    return this.data.messages.filter(msg => msg.from === userId1 || msg.to === userId1);
  }

  createMessage(message: Message): void {
    this.data.messages.push(message);
    saveDatabase(this.data);
  }

  // Audit Logs
  getAllAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  createAuditLog(log: AuditLog): void {
    this.data.auditLogs.push(log);
    saveDatabase(this.data);
  }

  // Analytics
  getAnalytics() {
    const totalAlumni = this.data.users.filter(u => u.role === 'alumni').length;
    const totalStudents = this.data.users.filter(u => u.role === 'students').length;
    const totalDonations = (this.data.users.filter(u => u.role === 'alumni') as Alumni[])
      .reduce((sum, alumni) => sum + alumni.donations.reduce((donSum, don) => donSum + don.amount, 0), 0);
    const activeMentors = (this.data.users.filter(u => u.role === 'alumni') as Alumni[])
      .filter(alumni => alumni.mentorship.isMentor).length;
    const totalOpportunities = this.data.opportunities.length;
    const totalEvents = this.data.events.length;

    return {
      totalAlumni,
      totalStudents,
      totalDonations,
      activeMentors,
      totalOpportunities,
      totalEvents,
      totalUsers: totalAlumni + totalStudents
    };
  }
}
