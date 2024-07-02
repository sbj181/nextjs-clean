import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Container from '~/components/Container';
import { useSidebar } from '~/contexts/SidebarContext';
import { getClient } from '~/lib/sanity.client';
import { getResourceByIds, getTrainings } from '~/lib/sanity.queries';
import Link from 'next/link';
import ProgressBar from '~/components/ProgressBar';

const Profile = () => {
  const [profile, setProfile] = useState({ email: '', display_name: '', phone_number: '' });
  const [favorites, setFavorites] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const { isSidebarOpen } = useSidebar();

  const fetchProgress = useCallback(async (userId) => {
    const { data: trainingProgressData, error: trainingProgressError } = await supabase
      .from('training_progress')
      .select('training_id, completed_steps')
      .eq('user_id', userId);

    if (trainingProgressError) {
      console.error('Error fetching training progress:', trainingProgressError);
    } else {
      setTrainingProgress(trainingProgressData);
    }
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        router.push('/sign-in');
        return;
      }

      if (!user) {
        router.push('/sign-in');
        return;
      }

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

      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('resource_id')
        .eq('user_id', user.id);

      if (favoritesError) {
        console.error('Error fetching favorites:', favoritesError);
      } else {
        const resourceIds = favoritesData.map(fav => fav.resource_id);
        const client = getClient();
        const resources = await getResourceByIds(client, resourceIds);
        setFavorites(resources);
      }

      await fetchProgress(user.id);

      const client = getClient();
      const trainings = await getTrainings(client);
      setTrainings(trainings);
    };

    getProfile();
  }, [router, fetchProgress]);

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

  const handleRemoveFavorite = async (resourceId) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('resource_id', resourceId);

    if (error) {
      console.error('Error removing favorite:', error);
    } else {
      setFavorites(favorites.filter(resource => resource._id !== resourceId));
    }
  };

  const calculateProgress = (completedSteps, totalSteps) => {
    return (completedSteps.length / totalSteps) * 100;
  };

  return (
    <Container>
      <Head>
        <title>Profile | CORE RMS by The Grovery</title>
        <meta name="description" content="Manage your profile information." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center justify-center">
        <div className="min-w-xl mb-8 w-[400px] p-6 border-2 border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 bg-opacity-50 rounded-2xl">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <div className="mb-4">
            <label className="block opacity-50">Email</label>
            <p>{profile.email || 'None listed'}</p>
          </div>
          <div className="mb-4">
            <label className="block opacity-50">Display Name</label>
            {editing ? (
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                className="p-2 border dark:bg-slate-950 border-gray-300 rounded w-full"
              />
            ) : (
              <p>{profile.display_name || 'None listed'}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block opacity-50">Phone Number</label>
            {editing ? (
              <input
                type="text"
                value={profile.phone_number}
                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                className="p-2 border border-gray-300 dark:bg-slate-950 rounded w-full"
              />
            ) : (
              <p>{profile.phone_number || 'None listed'}</p>
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

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Favorite Resources</h2>
            {favorites.length > 0 ? (
              <ul className="list-disc">
                {favorites.map(favorite => (
                  <li key={favorite._id} className="mb-2 flex justify-between items-center">
                    <Link href={`/resource/${favorite.slug.current}`}>
                      <span className="text-blue-500 underline cursor-pointer">{favorite.title}</span>
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(favorite._id)}
                      className="ml-2 text-red-500"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No resources currently favorited.</p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Training Progress</h2>
            {trainingProgress.length > 0 ? (
              <div>
                {trainings.map(training => {
                  const progress = trainingProgress.find(progress => progress.training_id === training._id);
                  const completedSteps = progress ? progress.completed_steps : [];
                  const totalSteps = training.steps.length;
                  const progressPercentage = calculateProgress(completedSteps, totalSteps);

                  return (
                    <div key={training._id} className="mb-4">
                      <h3 className="text-lg font-semibold">{training.title}</h3>
                      <ProgressBar percentage={progressPercentage} />
                      <p>{completedSteps.length} out of {totalSteps} steps completed</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No training progress recorded.</p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
