# Native Learning App

A cross-platform mobile and web learning application built with React Native + Expo, enabling teachers to offer multilingual learning experiences to students worldwide in their native language.

## 🚀 Features

### Core Features
- **Cross-Platform**: React Native + Expo with web compatibility
- **Multilingual Support**: 35+ languages supported with native speaker matching
- **Three Learning Modes**:
  - Live hourly 1:1 mentoring sessions
  - Self-paced downloadable courses
  - Structured career learning paths
- **Payment Integration**: Stripe Connect with 20% platform fee split
- **AI Chatbot**: Intelligent learning assistant for course guidance
- **Admin Panel**: Web-only CMS for platform management

### User Roles

#### 👨‍🏫 Teachers
- Create and manage courses in their native language
- Set custom pricing for sessions and courses
- Upload educational resources (PDFs, videos, presentations)
- Schedule availability for live sessions
- Track earnings and student bookings
- Stripe Connect integration for payouts

#### 👩‍🎓 Students
- Discover content by skill level, language, and goals
- Book live sessions or purchase self-paced courses
- Download course materials and session recordings
- Access AI chatbot for learning guidance
- Multilingual UI and content delivery
- Track learning progress

#### 🛠️ Admins
- Approve/reject teacher applications
- Manage featured content and teachers
- Create and curate career learning paths
- View platform analytics and revenue
- Moderate content and user reports

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native + Expo, TypeScript, NativeWind (TailwindCSS)
- **Backend**: Supabase (Auth, Database, Storage, Row-Level Security)
- **Payments**: Stripe Connect with platform fee handling
- **Navigation**: Expo Router with TypeScript support
- **State Management**: React Query + Zustand
- **Notifications**: Expo Notifications + Email (Resend/Postmark)
- **AI Integration**: OpenAI GPT API for chatbot features

### Database Schema (Supabase)

```sql
-- Core tables
users (id, name, email, role, stripe_id, languages[], is_featured, ...)
courses (id, title, teacher_id, type, price, language, tags[], ...)
career_paths (id, title, description, skill_goal, course_ids[], ...)
sessions (id, course_id, date_time, duration, status, student_id, ...)
payments (id, amount, base_amount, fee_amount, stripe_payment_id, ...)
bookings (id, session_id, student_id, status, payment_id, ...)
reviews (id, rating, comments, teacher_id, student_id, ...)
resources (id, title, file_url, course_id, ...)
admin_users (id, email, ...)
teacher_verification (id, teacher_id, status, documents[], ...)
```

## 📱 Screens & Navigation

### Public Routes
- `/` - Landing page with hero section and features
- `/(auth)/sign-in` - User authentication
- `/(auth)/sign-up` - Student registration
- `/(auth)/teacher-signup` - Teacher onboarding

### Authenticated Routes (Tabs)
- `/(tabs)/home` - Dashboard with quick actions
- `/(tabs)/explore` - Course discovery and search
- `/(tabs)/my-learning` - Student's enrolled courses
- `/(tabs)/chat` - AI learning assistant
- `/(tabs)/profile` - User profile and settings

### Admin Routes
- `/(admin)/dashboard` - Admin control panel
- `/(admin)/teachers` - Teacher verification management
- `/(admin)/courses` - Content moderation
- `/(admin)/analytics` - Platform statistics

## 🔐 Authentication & Security

### Supabase Auth Integration
- Email/password authentication
- Row-Level Security (RLS) policies
- Role-based access control (student/teacher/admin)
- Secure session management with AsyncStorage

### Stripe Connect Integration
- Teacher verification and onboarding
- Automatic fee splitting (20% platform fee)
- Secure payment processing
- Payout management for teachers

## 📧 Email Notifications

### Student Notifications
- Booking confirmation with session details
- Session reminders (24h and 1h before)
- Course purchase receipts
- Progress milestone notifications

### Teacher Notifications
- New booking alerts
- Payment confirmations
- Review notifications
- Verification status updates

## 🤖 AI Chatbot Features

### Learning Guidance
- "What should I learn next for backend development?"
- "Find Tamil-speaking Python teachers"
- "Suggest a career path for data science"

### Fallback Responses
- Graceful handling of unsupported queries
- Human teacher recommendations as alternatives
- Learning resource suggestions

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- Supabase account
- Stripe account

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd NativeLearningApp-v2
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Update with your Supabase and Stripe credentials
```

3. **Supabase Setup**
- Create a new Supabase project
- Run the database migrations (SQL schema)
- Configure Row-Level Security policies
- Set up storage buckets for file uploads

4. **Start Development Server**
```bash
npm start
# Choose platform: web, iOS, Android
```

### Available Scripts
- `npm start` - Start Expo development server
- `npm run android` - Start Android emulator
- `npm run ios` - Start iOS simulator (macOS only)
- `npm run web` - Start web development server

## 🌐 Web Compatibility

The app is built with Expo's web support, providing:
- Responsive design for desktop and mobile browsers
- Admin panel accessible via web interface
- SEO-optimized landing pages
- Progressive Web App (PWA) capabilities

## 🔄 Payment Flow

### Course Purchase Flow
1. Student selects course/session
2. Platform calculates total (base price + 20% fee)
3. Stripe Checkout handles payment
4. Stripe Connect automatically splits payment
5. Teacher receives 80%, platform retains 20%
6. Email notifications sent to both parties

### Teacher Onboarding
1. Teacher completes profile and verification
2. Stripe Connect Express account creation
3. Admin approval for teaching privileges
4. Course creation and pricing setup

## 📊 Analytics & Monitoring

### Admin Dashboard Metrics
- Total users (students/teachers)
- Revenue and payment analytics
- Course completion rates
- Top-performing teachers and courses
- Geographic distribution of users

## 🚀 Deployment

### Mobile App Deployment
```bash
# Build for production
eas build --platform all

# Submit to app stores
eas submit --platform all
```

### Web Deployment
```bash
# Build web version
npm run build:web

# Deploy to hosting provider
# (Vercel, Netlify, or custom hosting)
```

## 🔧 Configuration

### Environment Variables
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `EXPO_PUBLIC_OPENAI_API_KEY` - OpenAI API key for chatbot

### Feature Flags
- AI chatbot enabled/disabled
- Payment processing enabled/disabled
- Email notifications enabled/disabled
- Admin panel access restrictions

## 📄 Legal & Compliance

### GDPR Compliance
- Cookie consent banner implementation
- User data export/deletion capabilities
- Privacy policy and terms of service
- Opt-in/opt-out email preferences

### Content Moderation
- Teacher verification process
- Course content review system
- User reporting and flagging
- Automated content filtering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with proper testing
4. Submit a pull request with detailed description

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or feature requests:
- Create an issue in the repository
- Contact: support@nativelearningapp.com
- Documentation: [Link to detailed docs]

---

Built with ❤️ for global education accessibility