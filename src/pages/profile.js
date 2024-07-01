import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Container from '~/components/Container';
import { useSidebar } from '~/contexts/SidebarContext';

const Profile = () => {
  const [profile, setProfile] = useState({ email: '', display_name: '', phone_number: '' });
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const { isSidebarOpen } = useSidebar();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
      } else {
        const { data, error } = await supabase
          .from('users')
          .select('email, display_name, phone_number')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      }
    };
    getProfile();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
  };

  const handleUpdate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('users')
      .update({ display_name: profile.display_name, phone_number: profile.phone_number })
      .eq('id', user.id);
    if (error) {
      console.error('Error updating profile:', error);
    } else {
      setEditing(false);
      alert('Profile updated successfully!');
    }
  };

  return (
    <Container>
      <Head>
        <title>Profile | CORE RMS by The Grovery</title>
        <meta name="description" content="Manage your profile information." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center justify-center h-[calc(100vh-13em)]">
        <div className="min-w-xl w-[400px] p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <p>{profile.email}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Display Name</label>
            {editing ? (
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                className="p-2 border border-gray-300 rounded w-full"
              />
            ) : (
              <p>{profile.display_name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            {editing ? (
              <input
                type="text"
                value={profile.phone_number}
                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                className="p-2 border border-gray-300 rounded w-full"
              />
            ) : (
              <p>{profile.phone_number}</p>
            )}
          </div>
          {editing ? (
            <button
              onClick={handleUpdate}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
