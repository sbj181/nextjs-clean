import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from './supabaseClient';

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const router = useRouter();
  const redirectHandled = useRef(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (!session && !redirectHandled.current) {
        redirectHandled.current = true;
        router.push('/sign-in');
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && !redirectHandled.current) {
        redirectHandled.current = true;
        router.push('/sign-in');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return session;
};
