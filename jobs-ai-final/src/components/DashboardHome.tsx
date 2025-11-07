import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Briefcase } from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    resumes: 0,
    coverLetters: 0,
    applications: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [resumes, coverLetters, applications] = await Promise.all([
      supabase.from('resumes').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('cover_letters').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('applications').select('id', { count: 'exact' }).eq('user_id', user.id),
    ]);

    setStats({
      resumes: resumes.count || 0,
      coverLetters: coverLetters.count || 0,
      applications: applications.count || 0,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Resumes</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.resumes}</p>
            </div>
            <FileText className="w-12 h-12 text-primary" />
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Cover Letters</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.coverLetters}</p>
            </div>
            <FileText className="w-12 h-12 text-primary" />
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Applications</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.applications}</p>
            </div>
            <Briefcase className="w-12 h-12 text-primary" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-8 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/dashboard/resume"
            className="p-6 border-2 border-slate-700 rounded-lg hover:border-primary transition"
          >
            <FileText className="w-8 h-8 text-primary mb-2" />
            <h3 className="text-lg font-semibold text-white mb-1">Analyze Resume</h3>
            <p className="text-slate-400 text-sm">Get AI-powered feedback on your resume</p>
          </a>
          <a
            href="/dashboard/cover-letter"
            className="p-6 border-2 border-slate-700 rounded-lg hover:border-primary transition"
          >
            <FileText className="w-8 h-8 text-primary mb-2" />
            <h3 className="text-lg font-semibold text-white mb-1">Generate Cover Letter</h3>
            <p className="text-slate-400 text-sm">Create tailored cover letters instantly</p>
          </a>
        </div>
      </div>
    </div>
  );
}
