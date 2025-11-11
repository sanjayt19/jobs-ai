import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted) setUser(user);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      {!user ? (
        <div className="text-sm text-slate-500">No user information available.</div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <div className="text-sm text-secondary-text">User ID</div>
            <div className="text-sm text-slate-700">{user.id}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-secondary-text">Email</div>
            <div className="text-sm text-slate-700">{user.email ?? '—'}</div>
          </div>

          <div>
            <div className="text-sm text-secondary-text">Metadata</div>
            <pre className="text-xs text-slate-600 mt-2 overflow-auto max-h-40">{JSON.stringify(user.user_metadata || {}, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
