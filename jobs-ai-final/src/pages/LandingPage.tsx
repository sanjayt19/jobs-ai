import { Link } from 'react-router-dom';
import { Sparkles, FileText, Target, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-white">Jobs.AI</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="text-slate-300 hover:text-white">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-primary text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Land Your Dream Job with <span className="text-primary">AI</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
          Generate tailored cover letters, optimize your resume, and track applications—all powered by AI
        </p>
        <Link
          to="/signup"
          className="inline-block bg-primary text-slate-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-500"
        >
          Start Free Trial
        </Link>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800 p-8 rounded-xl">
            <FileText className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI Cover Letters</h3>
            <p className="text-slate-300">
              Generate personalized cover letters in seconds, tailored to each job
            </p>
          </div>
          <div className="bg-slate-800 p-8 rounded-xl">
            <Target className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Resume Analysis</h3>
            <p className="text-slate-300">
              Get instant feedback on your resume with AI-powered insights
            </p>
          </div>
          <div className="bg-slate-800 p-8 rounded-xl">
            <TrendingUp className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Track Applications</h3>
            <p className="text-slate-300">
              Manage all your job applications in one organized dashboard
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400">
          <p>&copy; 2024 Jobs.AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
