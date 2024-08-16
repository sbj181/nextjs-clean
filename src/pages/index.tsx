import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '~/lib/supabaseClient';
import Container from '~/components/Container';
import Welcome from '~/components/Welcome';
import Favorites from '~/components/Favorites';
import RecentResourcesCarousel from '~/components/RecentResourcesCarousel'; // Import the new carousel component

import { useAuth } from '~/lib/useAuth';

import Loading from '~/components/Loading';
import { getButtonText } from '~/utils';
import TrainingProgressCarousel from '~/components/TrainingProgressCarousel';

export const getStaticProps: GetStaticProps = async () => {
  // Fetch recent resources
  let { data: resources, error: resourcesError } = await supabase
    .from('resources')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })
    .limit(12);

  if (resourcesError) {
    console.error('Error fetching resources:', resourcesError);
  }

  // Fetch recent trainings
  let { data: trainings, error: trainingsError } = await supabase
    .from('trainings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  if (trainingsError) {
    console.error('Error fetching trainings:', trainingsError);
  } else {
    // Fetch the steps and first step image for each training
    const updatedTrainings = await Promise.all(trainings.map(async (training) => {
      const { data: steps, error: stepsError } = await supabase
        .from('training_steps')
        .select('*')
        .eq('training_id', training.id)
        .order('step_number', { ascending: true });

      if (stepsError) {
        console.error('Error fetching steps:', stepsError);
        training.steps = [];
        training.firstStepImage = null;
      } else {
        training.steps = steps;
        training.firstStepImage = steps.length > 0 ? steps[0].image_url : null;
      }

      // Fetch completion data for the training
      const { data: completionData, error: completionError } = await supabase
        .from('training_step_completion')
        .select('is_completed')
        .eq('training_id', training.id);

      if (completionError) {
        console.error('Error fetching completion data:', completionError);
        training.completedSteps = 0;
      } else {
        training.completedSteps = completionData.filter(step => step.is_completed).length;
      }

      return training;
    }));
    trainings = updatedTrainings;
  }

  return {
    props: {
      resources: resources || [],
      trainings: trainings || [],
    },
    revalidate: 60,
  };
};

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const session = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [resources, setResources] = useState(props.resources);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [initials, setInitials] = useState<string | null>(null);
  const [loadingFavoriteId, setLoadingFavoriteId] = useState<number | null>(null); // Track loading state per resource

  const slugify = (text) => {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

  const fetchFavorites = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Fetch user's favorite resource IDs from the 'favorites' table
      const { data: favoriteResources, error: favoritesError } = await supabase
        .from('favorites')
        .select('resource_id')
        .eq('user_id', user.id);
  
      if (favoritesError) {
        console.error('Error fetching favorite resources:', favoritesError);
      } else if (favoriteResources.length > 0) {
        const resourceIds = favoriteResources.map(fav => fav.resource_id);
        
        // Fetch the resource details based on the resource IDs
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select('*, categories(name)')
          .in('id', resourceIds);
  
        if (resourcesError) {
          console.error('Error fetching resources:', resourcesError);
        } else {
          setFavorites(resourcesData || []);
        }
      } else {
        setFavorites([]); // No favorites
      }
    }
  }, []);
  
  const fetchTopTrainingProgress = useCallback(async (userId) => {
    const { data: trainingProgressData, error: trainingProgressError } = await supabase
      .from('training_step_completion')
      .select('training_id, step_id, is_completed')
      .eq('user_id', userId)
      .eq('is_completed', true);
  
    if (trainingProgressError) {
      console.error('Error fetching training progress:', trainingProgressError);
      return [];
    }
  
    const progress = trainingProgressData.reduce((acc, item) => {
      if (!acc[item.training_id]) {
        acc[item.training_id] = [];
      }
      acc[item.training_id].push(item.step_id);
      return acc;
    }, {});
  
    const { data: trainingsData, error: trainingsError } = await supabase
      .from('trainings')
      .select('id, title, training_steps(*)');
  
    if (trainingsError) {
      console.error('Error fetching trainings:', trainingsError);
      return [];
    }
  
    const trainingProgressList = trainingsData.map((training) => {
      const completedSteps = progress[training.id] || [];
      const totalSteps = training.training_steps.length;
      const progressPercentage = (completedSteps.length / totalSteps) * 100;
      return { ...training, progressPercentage, completedSteps: completedSteps.length, totalSteps };
    });
    // Trainings that have the most progress 
    return trainingProgressList.sort((a, b) => b.progressPercentage - a.progressPercentage).slice(0, 12);
    // Date training was created
    // return trainingProgressList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);

  }, []);
  

  useEffect(() => {
    const fetchProfileAndFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('display_name')
          .eq('id', user.id)
          .single();
  
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setDisplayName(data.display_name || null);
          setFirstName(extractFirstName(data.display_name));
          setInitials(extractInitials(data.display_name));
        }
  
        // Fetch user favorites
        fetchFavorites();
      }
    };
  
    fetchProfileAndFavorites();
  }, [fetchFavorites]);

  const [topTrainingProgress, setTopTrainingProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state


  useEffect(() => {
    const fetchTopProgress = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const progress = await fetchTopTrainingProgress(user.id);
            setTopTrainingProgress(progress);
        }
        setIsLoading(false); // Set loading to false once data is fetched
    };

    fetchTopProgress();
}, [fetchTopTrainingProgress]);
  

  const extractFirstName = (name: string | null) => {
    if (!name) return null;
    return name.split(' ')[0];
  };

  const extractInitials = (name: string | null) => {
    if (!name) return null;
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
  };

  const handleFavoriteResource = async (resourceId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to favorite a resource.');
      return;
    }
  
    setLoadingFavoriteId(resourceId); // Start loading animation
  
    // Check if the resource is already favorited by this user
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('resource_id', resourceId)
      .single();
  
    if (existingFavorite) {
      // If already favorited, remove it
      await supabase
        .from('favorites')
        .delete()
        .eq('id', existingFavorite.id);
    } else {
      // Otherwise, add it
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, resource_id: resourceId });
    }
  
    setLoadingFavoriteId(null); // End loading animation
    fetchFavorites();
  };
  

  if (!session) return <Loading />;

  return (
    <Container>
      <Head>
        <title>CORE RMS by The Grovery</title>
        <meta name="description" content="Welcome to CORE RMS, your source for the latest resources and trainings." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-col md:flex-row justify-center md:justify-normal items-center md:gap-4'>
        {initials && (
          <div className='w-20 h-20 min-w-20 text-3xl flex items-center justify-center rounded-full bg-custom-teal-dark bg-opacity-25 border-4 border-custom-teal text-custom-teal-dark font-bold'>
            {initials}
          </div>
        )}
        <Welcome 
          title={`Welcome to Core${firstName ? `, ${firstName}` : ''}!`}       
          subtitle={<span>Admins may add trainings and resources by visiting those pages. Visit the <Link href="/profile"><span className="text-custom-teal hover:text-custom-teal-dark underline">Profile</span></Link> page to access user details and track your progress!</span>}
        />
      </div>
      
      {favorites.length > 0 ? (
        <Favorites 
          favorites={favorites} 
          onRemoveFavorite={handleFavoriteResource} 
          handleDeleteResource={handleFavoriteResource} 
          firstName={firstName}  
          getButtonText={getButtonText}
        />
      ) : (
        <div className='hidden'>No resources currently favorited.</div>
      )}

      
      {topTrainingProgress.length > 0 && (
        <section className='mt-10 mb-6'>
          <div className='mb-6 text-center'>
            <h2 className='text-3xl font-bold'>Your Training Progress</h2>
            <p>Pick up where you left off by selecting continue training below.</p>
          </div>
            {/* Training Carousel */}
            <TrainingProgressCarousel trainings={topTrainingProgress} isLoading={isLoading} />
            {/* View All Trainings Button */}
            <div className='w-full mt-4 p-4 bg-opacity-20 rounded-xl flex items-center justify-center'>
              <Link className='rounded-xl py-4 px-12 bg-slate-300 dark:bg-slate-950 dark:hover:bg-slate-700 bg-opacity-50 hover:bg-opacity-100 transition' href={'/training-center'}>
                View All Training Modules
              </Link>
            </div>
        </section>
      )}
      
      <section className='mt-10 mb-6'>
        <div className='mb-6 text-center'>
          <h2 className='text-3xl font-bold'>Recently Added Resources</h2>
          <p>Use the heart button to save your most used resources!</p>
        </div>
        {/* Resources Carousel */}
        <RecentResourcesCarousel 
          resources={resources} 
          favorites={favorites} 
          handleFavoriteResource={handleFavoriteResource} 
          loadingFavoriteId={loadingFavoriteId}
        />
        {/* View All Resources Button */}
        <div className='w-full mt-4 p-4 bg-opacity-20 rounded-xl flex items-center justify-center'>
          <Link className='rounded-xl py-4 px-12 bg-slate-300 dark:bg-slate-950 dark:hover:bg-slate-700 bg-opacity-50 hover:bg-opacity-100 transition' href={'/resource-center'}>
            View All Resources
          </Link>
        </div>
      </section>
      
      
    </Container>
  );
}
