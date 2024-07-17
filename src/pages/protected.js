import { useRouter } from 'next/router';
import { useEffect, useRef,useState } from 'react';

import Loading from '~/components/Loading';

import { supabase } from '../lib/supabaseClient';

const ProtectedPage = () => {
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

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [router]);

  if (!session) return <Loading />;

  return <div>Protected content</div>;
};

export default ProtectedPage;
