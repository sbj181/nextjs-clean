import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import Head from 'next/head';
import Container from '~/components/Container';

const TrainingDetail = () => {
  const [training, setTraining] = useState(null);
  const [steps, setSteps] = useState([]);
  const [stepTitle, setStepTitle] = useState('');
  const [stepDescription, setStepDescription] = useState('');
  const [editStepId, setEditStepId] = useState(null);
  const [editStepTitle, setEditStepTitle] = useState('');
  const [editStepDescription, setEditStepDescription] = useState('');
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [message, setMessage] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { slug } = router.query;

  const fetchTraining = async () => {
    if (!slug) return;
    const { data, error } = await supabase.from('trainings').select('*').eq('slug', slug).single();
    if (error) console.error('Error fetching training:', error);
    else {
      setTraining(data);
      setEditTitle(data.title);
      setEditDescription(data.description);
    }
  };

  const fetchSteps = async () => {
    if (!training) return;
    const { data, error } = await supabase.from('training_steps').select('*').eq('training_id', training.id);
    if (error) console.error('Error fetching steps:', error);
    else setSteps(data);
  };

  useEffect(() => {
    fetchTraining();
  }, [slug]);

  useEffect(() => {
    if (training) {
      fetchSteps();
    }
  }, [training]);

  const handleAddStep = async () => {
    if (!stepTitle || !stepDescription) return;
    const stepNumber = steps.length + 1;
    const { data, error } = await supabase
      .from('training_steps')
      .insert([{ training_id: training.id, step_number: stepNumber, title: stepTitle, description: stepDescription }])
      .select() // Ensure complete data is returned
      .single();

    console.log('Add step response:', data, error); // Log response

    if (error) {
      console.error('Error adding step:', error);
      alert('Error adding step.');
    } else {
      if (data) {
        setSteps([...steps, data]);
        setStepTitle('');
        setStepDescription('');
        setIsAddingStep(false);
        alert('Step added successfully!');
      } else {
        console.error('No data returned from add step, fetching manually');
        // Fetch the steps manually
        const { data: fetchData, error: fetchError } = await supabase
          .from('training_steps')
          .select('*')
          .eq('training_id', training.id);

        if (fetchError) {
          console.error('Error fetching steps:', fetchError);
          alert('Error fetching steps.');
        } else {
          setSteps(fetchData);
          setStepTitle('');
          setStepDescription('');
          setIsAddingStep(false);
          alert('Step added successfully!');
        }
      }
    }
  };

  const handleUpdateStep = async (stepId) => {
    if (!editStepTitle || !editStepDescription) return;
    const { data, error } = await supabase
      .from('training_steps')
      .update({ title: editStepTitle, description: editStepDescription }, { returning: 'representation' }) // Ensure returning option
      .eq('id', stepId)
      .select(); // Explicitly select the columns to return

    console.log('Update step response:', data, error); // Log response

    if (error) {
      console.error('Error updating step:', error);
      alert('Error updating step.');
    } else {
      if (data) {
        const updatedSteps = steps.map(step => step.id === stepId ? data[0] : step);
        setSteps(updatedSteps);
        setEditStepId(null);
        alert('Step updated successfully!');
      } else {
        console.error('No data returned from update, fetching manually');
        // Fetch the steps manually
        const { data: fetchData, error: fetchError } = await supabase
          .from('training_steps')
          .select('*')
          .eq('training_id', training.id);

        if (fetchError) {
          console.error('Error fetching steps:', fetchError);
          alert('Error fetching steps.');
        } else {
          setSteps(fetchData);
          setEditStepId(null);
          alert('Step updated successfully!');
        }
      }
    }
  };

  const handleUpdateTraining = async () => {
    if (!editTitle || !editDescription) return;
    const { data, error } = await supabase
      .from('trainings')
      .update({ title: editTitle, description: editDescription }, { returning: 'representation' }) // Ensure returning option
      .eq('id', training.id)
      .select(); // Explicitly select the columns to return

    console.log('Update response:', data, error); // Log response

    if (error) {
      console.error('Error updating training:', error);
      alert('Error updating training.');
    } else {
      if (data) {
        setTraining(data[0]);
        setIsEditing(false);
        alert('Training updated successfully!');
      } else {
        console.error('No data returned from update, fetching manually');
        // Fetch the updated data manually
        const { data: fetchData, error: fetchError } = await supabase
          .from('trainings')
          .select('*')
          .eq('id', training.id)
          .single();

        if (fetchError) {
          console.error('Error fetching updated training:', fetchError);
          alert('Error fetching updated training.');
        } else {
          setTraining(fetchData);
          setIsEditing(false);
          alert('Training updated successfully!');
        }
      }
    }
  };

  return (
    <Container>
      <Head>
        <title>{training ? training.title : 'Training Detail'} | CORE RMS by The Grovery</title>
        <meta name="description" content="Manage training steps." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {training && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{isEditing ? 'Edit Training' : training.title}</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {isEditing ? (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <textarea
                  placeholder="Description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateTraining}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Update Training
                  </button>
                  <button
                    onClick={() => {
                      setEditTitle(training.title);
                      setEditDescription(training.description);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="mb-4">{training.description}</p>
            </>
          )}
          
          <h2 className="text-xl font-bold mb-4">Steps</h2>
          <ul className="list-none">
            {steps.map((step) => (
              <li key={step.id} className="flex justify-between items-center mb-4 p-4 border rounded-lg">
                {editStepId === step.id ? (
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Step Title"
                      value={editStepTitle}
                      onChange={(e) => setEditStepTitle(e.target.value)}
                      className="p-2 border border-gray-300 rounded w-full mb-2"
                    />
                    <textarea
                      placeholder="Step Description"
                      value={editStepDescription}
                      onChange={(e) => setEditStepDescription(e.target.value)}
                      className="p-2 border border-gray-300 rounded w-full mb-2"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleUpdateStep(step.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Update Step
                      </button>
                      <button
                        onClick={() => setEditStepId(null)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-bold">{step.step_number} . {step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditStepId(step.id);
                        setEditStepTitle(step.title);
                        setEditStepDescription(step.description);
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <section className='addnewstep mb-8'>
          {!isAddingStep ? (
            <button
              onClick={() => setIsAddingStep(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition mt-4"
            >
              Add New Step
            </button>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4 mt-4">Add New Step</h2>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Step Title"
                  value={stepTitle}
                  onChange={(e) => setStepTitle(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <textarea
                  placeholder="Step Description"
                  value={stepDescription}
                  onChange={(e) => setStepDescription(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleAddStep}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                  >
                    Add Step
                  </button>
                  <button
                    onClick={() => {
                      setStepTitle('');
                      setStepDescription('');
                      setIsAddingStep(false);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
          </section>
        </>
      )}
    </Container>
  );
};

export default TrainingDetail;
