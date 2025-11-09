import React from 'react';
import { supabase } from '../lib/supabase';

type OAuthButtonProps = {
  provider?: 'google';
  className?: string;
};

export default function OAuthButton({ provider = 'google', className = '' }: OAuthButtonProps) {
  const handleOAuth = async () => {
    try {
      // Redirect back to the app origin after OAuth flow. Supabase will complete the flow.
      const redirectTo = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });

      if (error) {
        // show a simple error for now; app-level UI may display this better later
        alert(error.message);
      }
    } catch (err: any) {
      console.error('OAuth error', err);
      alert(err?.message ?? 'OAuth failed');
    }
  };

  return (
    <button
      type="button"
      onClick={handleOAuth}
      className={`w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg border border-slate-600 bg-white/5 hover:bg-white/10 text-white font-semibold ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
        <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3C34.3 33.6 29.5 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l6.2-6.2C33.7 4.6 29 3 24 3 12.8 3 4 11.8 4 23s8.8 20 20 20c11.1 0 20-8 20-20 0-1.3-.1-2.6-.4-3.9z"/>
        <path fill="#e53935" d="M6.3 14.7l6.6 4.8C15.2 15 19.2 12 24 12c3.3 0 6.3 1.2 8.6 3.2l6.2-6.2C33.7 4.6 29 3 24 3c-6.8 0-12.8 3.6-17 9.7z"/>
        <path fill="#4caf50" d="M24 45c5 0 9.6-1.6 13.5-4.4l-6.4-5.3C29.9 35.8 27.1 37 24 37c-5.5 0-10.3-3.4-12-8.3L5.3 33.6C8.3 39.9 15.3 45 24 45z"/>
        <path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3c-1.2 3.5-3.6 6.4-6.6 8.3l.1-.1 6.1 5.1C39.9 39 44 32 44 24c0-1.3-.1-2.6-.4-3.9z"/>
      </svg>
      Continue with Google
    </button>
  );
}
