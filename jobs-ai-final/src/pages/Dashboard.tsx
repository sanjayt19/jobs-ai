import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Sparkles, FileText, Briefcase, LogOut, Home, User } from 'lucide-react';
import ResumeAnalyzer from '../components/ResumeAnalyzer';
import CoverLetterGenerator from '../components/CoverLetterGenerator';
import ApplicationTracker from '../components/ApplicationTracker';
import DashboardHome from '../components/DashboardHome';
import Profile from '../components/Profile';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">Shvii</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r border-gray-100 min-h-screen p-6">
          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-gray-50 hover:text-slate-900"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/dashboard/resume-analyzer"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-gray-50 hover:text-slate-900"
            >
              <FileText className="w-5 h-5" />
              <span>Resume Analyzer</span>
            </Link>
            <Link
              to="/dashboard/cover-letter"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-gray-50 hover:text-slate-900"
            >
              <Sparkles className="w-5 h-5" />
              <span>Cover Letter</span>
            </Link>
            <Link
              to="/dashboard/applications"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-gray-50 hover:text-slate-900"
            >
              <Briefcase className="w-5 h-5" />
              <span>Applications</span>
            </Link>
            <Link
              to="/dashboard/profile"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-gray-50 hover:text-slate-900"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="cover-letter" element={<CoverLetterGenerator />} />
            <Route path="applications" element={<ApplicationTracker />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
