import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import OAuthButton from '../components/OAuthButton';
import { Sparkles } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: email,
            full_name: fullName,
            subscription_tier: 'free',
          },
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 text-slate-900">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Sparkles className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold">Shvii</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold">Create your account</h2>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4">
            <OAuthButton />
          </div>
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-[1px] bg-gray-200" />
            <div className="text-sm text-gray-400">or</div>
            <div className="flex-1 h-[1px] bg-gray-200" />
          </div>
          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-slate-900 focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-slate-900 focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-slate-900 focus:outline-none focus:border-primary"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
