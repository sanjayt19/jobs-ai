# Jobs.AI - AI-Powered Job Application Platform

A modern web application that helps job seekers with AI-powered resume analysis, cover letter generation, and application tracking.

## Features

- 🔐 **User Authentication** - Secure login and signup with Supabase
- 📄 **Resume Analyzer** - AI-powered resume analysis and feedback
- ✍️ **Cover Letter Generator** - Generate customized cover letters
- 📊 **Application Tracker** - Track your job applications in one place
- 🎨 **Modern UI** - Built with React, TypeScript, and Tailwind CSS

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account ([Sign up here](https://supabase.com))
- (Optional) An OpenAI API key for AI features

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd jobs-ai/jobs-ai-final
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [Supabase](https://app.supabase.com)
2. Go to your project settings → API settings
3. Copy your **Project URL** and **anon/public key**

### 4. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Set Up Database Tables (Optional)

If you plan to use the application tracker feature, you'll need to create the following tables in your Supabase database:

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read/update their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

#### Applications Table (Optional)
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  status TEXT DEFAULT 'applied',
  applied_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only manage their own applications
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON applications
  FOR DELETE USING (auth.uid() = user_id);
```

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 7. Build for Production

```bash
npm run build
```

## Authentication Flow

The application uses Supabase Authentication with the following flow:

1. **Signup** - New users can create an account with email and password
2. **Login** - Existing users can sign in with their credentials
3. **Protected Routes** - The dashboard is protected and requires authentication
4. **Session Management** - User sessions are automatically managed by Supabase
5. **Logout** - Users can sign out from the dashboard

## Project Structure

```
jobs-ai-final/
├── src/
│   ├── components/         # React components
│   │   ├── ApplicationTracker.tsx
│   │   ├── CoverLetterGenerator.tsx
│   │   ├── DashboardHome.tsx
│   │   └── ResumeAnalyzer.tsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx  # Protected dashboard
│   │   ├── LandingPage.tsx
│   │   ├── Login.tsx      # Login page
│   │   └── Signup.tsx     # Signup page
│   ├── lib/               # Utility libraries
│   │   ├── supabase.ts    # Supabase client config
│   │   └── openai.ts      # OpenAI client (optional)
│   ├── App.tsx            # Main app with routing
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables (create from .env.example)
├── .env.example           # Example environment variables
├── package.json           # Dependencies
└── vite.config.ts         # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Supabase** - Authentication and database
- **Lucide React** - Icon library
- **OpenAI** - AI features (optional)

## Security Notes

- Never commit your `.env` file to version control
- Keep your Supabase anon key secure (it's safe to use in frontend as it's protected by RLS)
- Use Row Level Security (RLS) policies in Supabase to protect your data
- Consider enabling email confirmation in Supabase auth settings for production

## Troubleshooting

### Environment Variables Not Loading
- Make sure your `.env` file is in the `jobs-ai-final` directory
- Environment variables must start with `VITE_` to be accessible in the app
- Restart the dev server after changing environment variables

### Supabase Connection Issues
- Verify your Supabase URL and anon key are correct
- Check that your Supabase project is active
- Ensure you're using the correct project URL (not the old/demo project)

### Authentication Errors
- Make sure email confirmation is disabled in Supabase (or handle confirmation emails)
- Check Supabase Auth settings for allowed redirect URLs
- Verify Row Level Security policies allow the operations you're trying to perform

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
