import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Application {
  id: string;
  company: string;
  position: string;
  status: string;
  applied_date: string;
}

export default function ApplicationTracker() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'applied',
  });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('applied_date', { ascending: false });

    if (data) {
      setApplications(data);
    }
  };

  const addApplication = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('applications').insert([
      {
        user_id: user.id,
        company: formData.company,
        position: formData.position,
        status: formData.status,
      },
    ]);

    if (!error) {
      setFormData({ company: '', position: '', status: 'applied' });
      setShowForm(false);
      loadApplications();
    }
  };

  const deleteApplication = async (id: string) => {
    await supabase.from('applications').delete().eq('id', id);
    loadApplications();
  };

  const getStatusColor = (status: string) => {
    if (status === 'applied') return 'bg-blue-500/20 text-blue-400';
    if (status === 'interview') return 'bg-yellow-500/20 text-yellow-400';
    if (status === 'offer') return 'bg-green-500/20 text-green-400';
    if (status === 'rejected') return 'bg-red-500/20 text-red-400';
    return 'bg-slate-500/20 text-slate-400';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Application Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600"
        >
          <Plus className="w-5 h-5" />
          <span>Add Application</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 p-6 rounded-xl mb-6">
          <h2 className="text-xl font-bold text-white mb-4">New Application</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Position
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={addApplication}
                className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-600"
              >
                Add
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-700 text-white py-2 rounded-lg font-semibold hover:bg-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-slate-800 p-12 rounded-xl text-center">
            <p className="text-slate-400">No applications yet. Add your first one!</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-slate-800 p-6 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">{app.position}</h3>
                <p className="text-slate-400">{app.company}</p>
                <p className="text-sm text-slate-500 mt-1">
                  Applied: {format(new Date(app.applied_date), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={getStatusColor(app.status) + ' px-3 py-1 rounded-full text-sm font-medium'}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
                <button
                  onClick={() => deleteApplication(app.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
