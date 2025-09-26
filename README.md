# Government Of Punjab Alumni Centralized System

A comprehensive web application built with Next.js for managing alumni networks across Punjab's educational institutions, connecting current students with graduates, and facilitating opportunities and events under the Government of Punjab's unified platform through role-based dashboards and features.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alumni-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Seed the database**
   ```bash
   npm run seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Demo Accounts

Use these credentials to test different user roles:

| Role | Username | Password |
|------|----------|----------|
| **Alumni** | `alumni` | `alumni@123` |
| **Students** | `students` | `students@123` |
| **Admin** | `admin` | `admin@123` |
| **College** | `collage` | `collage@123` |

*Note: The college username is intentionally spelled as "collage" as per requirements.*

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: JSON file-based storage (for prototype)
- **Authentication**: Cookie-based session management
- **Icons**: Lucide React

### Project Structure
```
/alumni-platform
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── alumni/        # Alumni CRUD operations
│   │   │   ├── opportunities/ # Job/internship opportunities
│   │   │   ├── events/        # Event management
│   │   │   ├── messages/      # Messaging system
│   │   │   └── admin/         # Admin-only endpoints
│   │   ├── dashboard/         # Role-based dashboards
│   │   │   ├── alumni/        # Alumni dashboard
│   │   │   ├── students/      # Student dashboard
│   │   │   ├── admin/         # Admin dashboard
│   │   │   └── collage/       # College dashboard
│   │   ├── login/             # Login page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable components
│   │   └── Navbar.tsx         # Navigation component
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts            # Authentication utilities
│   │   └── db.ts              # Database operations
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # Shared types
│   └── middleware.ts          # Route protection
├── seed/                      # Seed data
│   └── alumni.json           # Sample data
├── scripts/                   # Utility scripts
│   └── seed.js               # Database seeding script
├── data/                      # Generated database files
└── README.md
```

## 🎯 Features by Role

### 👨‍🎓 Alumni Dashboard
- **Profile Management**: Update contact info, career details, skills
- **Career Updates**: Track job history and current position
- **Mentorship**: Sign up as mentor, manage mentees
- **Opportunities**: Post job/internship opportunities
- **Events**: Create and RSVP to events
- **Donations**: View donation history, make new donations
- **Messaging**: Connect with students and other alumni

### 👨‍🎓 Students Dashboard
- **Alumni Directory**: Browse and search alumni profiles
- **Opportunities**: View and apply to jobs/internships
- **Mentorship**: Find and connect with mentors
- **Events**: RSVP to alumni events
- **Profile**: Manage academic information and skills
- **Messaging**: Contact alumni and mentors

### 👨‍💼 Admin Dashboard
- **User Management**: CRUD operations on all user accounts
- **Analytics**: Platform usage statistics and insights
- **Audit Logs**: Track all administrative actions
- **Data Export**: CSV export of user data
- **Content Moderation**: Approve opportunities and events
- **System Monitoring**: Platform health and activity

### 🏛️ College Dashboard
- **Institution Analytics**: Comprehensive platform statistics
- **Fundraising Campaigns**: Create and manage donation campaigns
- **Alumni Engagement**: Track alumni participation metrics
- **Official Announcements**: Broadcast college-wide updates
- **Donor Management**: View donation reports and donor lists
- **Strategic Planning**: Access to all admin features plus college-specific tools

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Alumni Management
- `GET /api/alumni` - List alumni (with filters)
- `GET /api/alumni/:id` - Get alumni profile
- `POST /api/alumni` - Create alumni (admin only)
- `PUT /api/alumni/:id` - Update alumni profile
- `DELETE /api/alumni/:id` - Delete alumni (admin only)

### Opportunities
- `GET /api/opportunities` - List opportunities
- `POST /api/opportunities` - Create opportunity
- `PUT /api/opportunities/:id` - Update opportunity
- `DELETE /api/opportunities/:id` - Delete opportunity
- `POST /api/opportunities/:id/apply` - Apply to opportunity

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/rsvp` - RSVP to event

### Messages
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message

### Admin
- `GET /api/admin/analytics` - Platform analytics
- `GET /api/admin/auditlogs` - Audit logs
- `GET /api/admin/export` - Export data as CSV

## 📊 Sample Data

The platform comes pre-seeded with:
- **3 Alumni profiles** with complete career information
- **3 Student profiles** with academic details
- **3 Job opportunities** (internships, full-time, collaborations)
- **2 Events** (meetups, tech talks)
- **Sample messages** between users
- **Audit logs** for administrative actions

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication**
   - [ ] Login with each demo account
   - [ ] Verify role-based redirects
   - [ ] Test logout functionality

2. **Alumni Features**
   - [ ] View and edit profile
   - [ ] Create job opportunity
   - [ ] RSVP to events
   - [ ] Send messages

3. **Student Features**
   - [ ] Browse alumni directory
   - [ ] Apply to opportunities
   - [ ] Search and filter functionality

4. **Admin Features**
   - [ ] View analytics dashboard
   - [ ] Export CSV data
   - [ ] View audit logs
   - [ ] User management operations

5. **College Features**
   - [ ] View institution analytics
   - [ ] Manage fundraising campaigns
   - [ ] Create announcements

## 🔒 Security Notes

**⚠️ PROTOTYPE ONLY**: This implementation uses hardcoded credentials and simplified authentication for demonstration purposes.

### For Production Deployment:
1. **Replace hardcoded authentication** with proper auth service (Auth0, Supabase Auth, etc.)
2. **Use secure database** (PostgreSQL, MongoDB) instead of JSON files
3. **Implement proper password hashing** with bcrypt
4. **Add input validation** and sanitization
5. **Enable HTTPS** in production
6. **Add rate limiting** for API endpoints
7. **Implement proper session management**
8. **Add CSRF protection**

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables (for production)
```env
NODE_ENV=production
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/app/globals.css` for global styles
- Component-specific styles are in individual files

### Database Schema
- Extend types in `src/types/index.ts`
- Update database operations in `src/lib/db.ts`
- Modify seed data in `seed/alumni.json`

### Adding New Features
1. Create API routes in `src/app/api/`
2. Add corresponding UI components
3. Update type definitions
4. Test with different user roles

## 📝 License

This is a prototype application for demonstration purposes.

## 🤝 Contributing

This is a prototype/demo application. For production use, please implement proper security measures and database solutions.

---

**Built with ❤️ for the Alumni Management Platform Prototype**
