import Head from 'next/head';
import Link from 'next/link';
import { useEffect,useState } from 'react';

import Container from '~/components/Container';

import { supabase } from '../lib/supabaseClient';

const TrainingManager = () => {
  const [trainings, setTrainings] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isAddingTraining, setIsAddingTraining] = useState(false);

  const fetchTrainings = async () => {
    const { data, error } = await supabase.from('trainings').select('*');
    if (error) console.error('Error fetching trainings:', error);
    else setTrainings(data.filter(training => training !== null));
  };

  useEffect(() => {
    fetchTrainings();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('training-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trainings' }, (payload) => {
        setTrainings(prevTrainings => [...prevTrainings, payload.new]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'trainings' }, (payload) => {
        setTrainings(prevTrainings => prevTrainings.filter(training => training.id !== payload.old.id));
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleAddTraining = async () => {
    if (!title || !description) return;
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const { data, error } = await supabase
      .from('trainings')
      .insert([{ title, description, slug }])
      .single();
    if (error) {
      console.error('Error adding training:', error);
      alert('Error adding training.');
    } else {
      // No need to update state here as real-time subscription will handle it
      setTitle('');
      setDescription('');
      setIsAddingTraining(false);
      alert('Training added successfully!');
    }
  };

  const handleDeleteTraining = async (id) => {
    const { error } = await supabase
      .from('trainings')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting training:', error);
      alert('Error deleting training.');
    } else {
      // No need to update state here as real-time subscription will handle it
      alert('Training deleted successfully!');
    }
  };

  return (
    <Container>
      <Head>
        <title>Training Manager | CORE RMS by The Grovery</title>
        <meta name="description" content="Manage training modules." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-2xl font-bold mb-4">Training Manager</h1>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {trainings.map((training) => (
          training && (
            <div key={training.id} className="bg-slate-50 dark:bg-slate-700 px-4 py-8 rounded-lg shadow-md items-start min-h-[320px] overflow-auto justify-between flex-col relative">
              <div className='overflow-auto'>
                <h2 className="text-xl capitalize font-semibold">{training.title}</h2>
                <p className='opacity-65'>{training.description}</p>
              </div>
              <div className="flex gap-2 mt-8 absolute bottom-4">
                <Link href={`/training/${training.slug}`} passHref>
                  <button className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                    View Details
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteTraining(training.id)}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        ))}
      </div>
      <section className='my-8'>
      {!isAddingTraining ? (
        <button
          onClick={() => setIsAddingTraining(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Add New Training
        </button>
      ) : (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4 mt-4">Add New Training</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full mb-2"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddTraining}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Add Training
            </button>
            <button
              onClick={() => {
                setTitle('');
                setDescription('');
                setIsAddingTraining(false);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            
          </div>
        
        </div>
        
      )}
      </section>
    </Container>
  );
};

export default TrainingManager;
