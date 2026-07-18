import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminAuthGuard({ children }) {
  const [status, setStatus] = useState('loading'); // loading | authorized | unauthorized

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus('unauthorized');
        return;
      }
      try {
        // Fetch user profile from public.users
        const { data: userProfile } = await supabase
          .from('users')
          .select('role')
          .eq('auth_user_id', user.id)
          .single();
        
        if (userProfile && (userProfile.role === 'admin' || userProfile.role === 'super_admin')) {
          setStatus('authorized');
        } else {
          setStatus('unauthorized');
        }
      } catch {
        setStatus('unauthorized');
      }
    };

    checkAuth();
  }, []);

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground font-medium tracking-wide">VEGA BALI TOURS</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background p-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <img
            src="/images/logo.png"
            alt="Vega Bali Tours"
            className="h-16 w-auto object-contain mx-auto"
          />
          <div>
            <h1 className="text-xl font-semibold text-foreground">Admin Access Required</h1>
            <p className="text-muted-foreground mt-2 text-sm">You need to be logged in as an admin to access this area.</p>
          </div>
          <button
            onClick={() => supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin + '/admin' }
            })}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-3 font-medium text-sm transition-colors"
          >
            Login to Admin
          </button>
          <a href="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Website
          </a>
        </div>
      </div>
    );
  }

  return children;
}