import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '~/lib/supabaseClient';
import Container from '~/components/Container';
import Welcome from '~/components/Welcome';
import Favorites from '~/components/Favorites';
import SkeletonLoader from '~/components/SkeletonLoader'; // Import SkeletonLoader
import { useAuth } from '~/lib/useAuth';
import { FiHeart, FiBook, FiArchive } from 'react-icons/fi';
import Image from 'next/image';
import Loading from '~/components/Loading';

export const getStaticProps: GetStaticProps = async () => {
  // Fetch recent resources
  let { data: resources, error: resourcesError } = await supabase
    .from('resources')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })
    .limit(4);

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
        />
      ) : (
        <div className='hidden'>No resources currently favorited.</div>
      )}
      
      <section className='mt-10 mb-6'>
        <div className='mb-6'>
          <h2 className='text-3xl font-bold'>Recent Resources</h2>
          <p>Use the heart button to save your most used resources!</p>
        </div>
        <div className={`cardWrap grid gap-4 xl:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`}>
          {resources.map((resource) => (
            resource && (
              <div key={resource.id} className="card border-[4px] border-slate-50 flex w-full bg-slate-100 dark:bg-slate-950 h-full px-4 py-4 rounded-lg items-start min-h-[400px] overflow-auto flex-col relative">
                {resource.image_url ? (
                  <div className='resourceImage h-20 w-full rounded-lg bg-slate-300 mb-4 overflow-hidden relative'>
                    <Image
                      src={resource.image_url}
                      alt={`Image for ${resource.title}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <div className='resourceImage h-20 text-slate-600 dark:text-slate-950 rounded-lg bg-slate-300 opacity-25 flex items-center justify-center mb-4 w-full'>
                    <FiArchive size={32} />
                  </div>
                )}
                <div className="text-sm mb-2">
                  <span className='bg-custom-teal px-3 bg-opacity-25 rounded-full inline-block'>{resource.categories ? resource.categories.name : 'Uncategorized'}</span>
                </div>
                <Link href={`/resource/${resource.slug}`}><h2 className="text-xl font-semibold">{resource.title}</h2></Link>
                <div className=''>
                  <p className='opacity-65 min-h-32 text-sm'>{resource.description}</p>
                </div>
                <div className="flex gap-1 mt-8 absolute bottom-4">
                  {resource.download_url && (
                    <a href={resource.download_url} target="_blank" rel="noopener noreferrer">
                      <button className="px-4 py-2 text-sm bg-custom-blue text-white rounded-lg hover:bg-custom-blue-dark transition">
                        Download
                      </button>
                    </a>
                  )}
                  <button
                    onClick={() => handleFavoriteResource(resource.id)}
                    className={`px-3 py-2 bg-opacity-25 text-sm rounded-lg transition ${favorites.some(fav => fav.id === resource.id) ? 'bg-pink-200 text-pink-600 hover:bg-pink-100' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
                    disabled={loadingFavoriteId === resource.id} // Disable button while loading
                  >
                    {loadingFavoriteId === resource.id ? (
                      <div className="w-5 h-5 rounded-full border-2 border-pink-600 border-t-transparent animate-spin"></div>
                    ) : (
                      <FiHeart size={18} className={favorites.some(fav => fav.id === resource.id) ? 'fill-current' : ''} />
                    )}
                  </button>

                </div>
              </div>
            )
          ))}
        </div>
        <div className='w-full p-4 bg-opacity-20 rounded-xl flex items-center justify-center'>
          <Link className='rounded-xl py-4 px-12 bg-slate-300 dark:bg-slate-950 dark:hover:bg-slate-700 bg-opacity-50 hover:bg-opacity-100 transition' href={'/resource-center'}>
            View All Resources
          </Link>
        </div>
      </section>
      
      <section className='mt-10 mb-6'>
        <div className='mb-6'>
          <h2 className='text-3xl font-bold'>Recent Trainings</h2>
          <p>Complete your trainings to gain more knowledge!</p>
        </div>
        <div className={`cardWrap grid gap-4 xl:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`}>
          {props.trainings.map((training) => (
            training && (
              <div key={training.id} className="card border-[4px] border-slate-50 flex w-full bg-slate-100 dark:bg-slate-950 h-full px-4 py-4 rounded-lg items-start min-h-[400px] overflow-auto flex-col relative">
                {training.firstStepImage ? (
                  <div className='trainingImage h-20 w-full rounded-lg bg-slate-300 mb-4 overflow-hidden relative'>
                    <Image
                      src={training.firstStepImage}
                      alt={`Image for ${training.title}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <div className='trainingImage h-20 text-slate-600 dark:text-slate-950 rounded-lg bg-slate-300 opacity-25 flex items-center justify-center mb-4 w-full'>
                    <FiBook size={32} />
                  </div>
                )}
                <div className="text-sm mb-2">
                  {training.steps?.length} {training.steps?.length === 1 ? 'Step' : 'Steps'}
                </div>
                <h2 className="text-xl font-semibold">{training.title}</h2>
                <div className=''>
                  <p className='opacity-65 min-h-32 text-sm'>{training.description}</p>
                </div>
                <div className="flex gap-2 mt-8 absolute bottom-4">
                  <Link href={`/training/${training.slug}`} passHref>
                    <button className="px-4 py-2 text-sm bg-custom-blue text-white rounded-lg hover:bg-custom-blue-dark transition">
                      View Training
                    </button>
                  </Link>
                </div>
              </div>
            )
          ))}
        </div>
        <div className='w-full p-4 bg-opacity-20 rounded-xl flex items-center justify-center'>
          <Link className='rounded-xl py-4 px-12 bg-slate-300 dark:bg-slate-950 dark:hover:bg-slate-700 bg-opacity-50 hover:bg-opacity-100 transition' href={'/training-center'}>
            View All Training Modules
          </Link>
        </div>
      </section>
    </Container>
  );
}
