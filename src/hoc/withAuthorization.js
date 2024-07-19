// src/hoc/withAuthorization.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

const withAuthorization = (Component, requiredRole) => {
  return (props) => {
    const [role, setRole] = useState(null);
    const router = useRouter();

    useEffect(() => {
      const fetchRole = async () => {
        const user = supabase.auth.user();
        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching role:', error);
          } else {
            setRole(data.role);
            if (data.role !== requiredRole) {
              router.push('/'); // redirect if the user doesn't have the required role
            }
          }
        } else {
          router.push('/sign-in'); // redirect to sign-in if not authenticated
        }
      };

      fetchRole();
    }, [router]);

    if (role !== requiredRole) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
};

export default withAuthorization;
