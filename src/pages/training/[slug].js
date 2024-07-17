import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { uploadImage } from '../../utils';
import Head from 'next/head';
import Link from 'next/link';
import Container from '~/components/Container';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiEdit2, FiTrash2, FiArrowLeft, FiPlus } from 'react-icons/fi';  // Import the Feather icons

const TrainingDetail = () => {
  const [training, setTraining] = useState(null);
  const [steps, setSteps] = useState([]);
  const [stepTitle, setStepTitle] = useState('');
  const [stepDescription, setStepDescription] = useState('');
  const [stepImage, setStepImage] = useState(null);
  const [editStepId, setEditStepId] = useState(null);
  const [editStepTitle, setEditStepTitle] = useState('');
  const [editStepDescription, setEditStepDescription] = useState('');
  const [editStepImage, setEditStepImage] = useState(null);
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
    if (!stepTitle || !stepDescription || !stepImage) return;
    const stepNumber = steps.length + 1;
    const imageUrl = await uploadImage(stepImage);
    if (!imageUrl) return;

    const { data, error } = await supabase
      .from('training_steps')
      .insert([{ training_id: training.id, step_number: stepNumber, title: stepTitle, description: stepDescription, image_url: imageUrl }])
      .select()
      .single();

    if (error) {
      console.error('Error adding step:', error);
      alert('Error adding step.');
    } else {
      setSteps([...steps, data]);
      setStepTitle('');
      setStepDescription('');
      setStepImage(null);
      setIsAddingStep(false);
      alert('Step added successfully!');
    }
  };

  const handleUpdateStep = async (stepId) => {
    if (!editStepTitle || !editStepDescription) return;
    let imageUrl = editStepImage;
    if (editStepImage && typeof editStepImage !== 'string') {
      imageUrl = await uploadImage(editStepImage);
      if (!imageUrl) return;
    }
    const { data, error } = await supabase
      .from('training_steps')
      .update({ title: editStepTitle, description: editStepDescription, image_url: imageUrl })
      .eq('id', stepId)
      .select();

    if (error) {
      console.error('Error updating step:', error);
      alert('Error updating step.');
    } else {
      const updatedSteps = steps.map(step => step.id === stepId ? data[0] : step);
      setSteps(updatedSteps);
      setEditStepId(null);
      alert('Step updated successfully!');
    }
  };

  const handleUpdateTraining = async () => {
    if (!editTitle || !editDescription) return;
    const { data, error } = await supabase
      .from('trainings')
      .update({ title: editTitle, description: editDescription })
      .eq('id', training.id)
      .select();

    if (error) {
      console.error('Error updating training:', error);
      alert('Error updating training.');
    } else {
      setTraining(data[0]);
      setIsEditing(false);
      alert('Training updated successfully!');
    }
  };

  const handleDeleteStep = async (stepId) => {
    const { error } = await supabase
      .from('training_steps')
      .delete()
      .eq('id', stepId);

    if (error) {
      console.error('Error deleting step:', error);
      alert('Error deleting step.');
    } else {
      setSteps(steps.filter(step => step.id !== stepId));
      alert('Step deleted successfully!');
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedSteps = Array.from(steps);
    const [movedStep] = reorderedSteps.splice(result.source.index, 1);
    reorderedSteps.splice(result.destination.index, 0, movedStep);

    // Update the step numbers to reflect the new order
    const updatedSteps = reorderedSteps.map((step, index) => ({
      ...step,
      step_number: index + 1,
    }));

    setSteps(updatedSteps);

    // Optionally, update the steps order in the database
    updatedSteps.forEach(async (step) => {
      await supabase
        .from('training_steps')
        .update({ step_number: step.step_number })
        .eq('id', step.id);
    });
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
              {isEditing ? 'Cancel' : 'Edit Training'}
            </button>
          </div>
          {isEditing ? (
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
          ) : (
            <p className="mb-4">{training.description}</p>
          )}
          
          <h2 className="text-xl font-bold mb-4">Steps</h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="steps">
              {(provided) => (
                <ul
                  className="list-none"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {steps.map((step, index) => (
                    <Draggable key={step.id} draggableId={step.id.toString()} index={index}>
                      {(provided) => (
                        <li
                          className="block mb-4 p-4 border rounded-lg items-start"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
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
                              <input
                                type="file"
                                onChange={(e) => setEditStepImage(e.target.files[0])}
                                className="p-2 border border-gray-300 rounded w-full mb-2"
                              />
                              {step.image_url && (
                                <img src={step.image_url} alt={step.title} className="mb-2" />
                              )}
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
                                <div className='flex items-center gap-4 pb-4 border-b mb-6'>
                                  <div className='bg-slate-500 bg-opacity-50 h-10 w-10 flex items-center justify-center font-bold text-sm text-slate-50 rounded-full p-4'>{step.step_number}</div>
                                  <h3 className="font-bold text-xl">{step.title}</h3>
                                  <div className='ml-auto flex gap-2'>
                                    <button
                                      onClick={() => {
                                        setEditStepId(step.id);
                                        setEditStepTitle(step.title);
                                        setEditStepDescription(step.description);
                                        setEditStepImage(step.image_url);
                                      }}
                                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    >
                                      <FiEdit2 />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteStep(step.id)}
                                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                </div>
                                <div className='my-4'><p>{step.description}</p></div>
                                {step.image_url && (
                                  <img src={step.image_url} alt={step.title} className="mb-2 md:w-1/4" />
                                )}
                              </div>
                              
                            </>
                          )}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <section className='addnewstep mb-8'>
            <Link href="/training-center"><button className="px-4 py-2 flex items-center gap-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition mt-4 mr-2">
            <FiArrowLeft />  Back to Training Center</button></Link>
            {!isAddingStep ? (
              <button
                onClick={() => setIsAddingStep(true)}
                className="px-4 py-2 flex bg-green-500 items-center gap-2 text-white rounded-lg hover:bg-green-600 transition mt-4"
              >
                Add New Step <FiPlus />
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
                  <input
                    type="file"
                    onChange={(e) => setStepImage(e.target.files[0])}
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
                        setStepImage(null);
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
