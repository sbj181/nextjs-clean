import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { uploadImage } from '../../utils';
import Head from 'next/head';
import Link from 'next/link';
import Welcome from '~/components/Welcome';
import Container from '~/components/Container';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiEdit2, FiTrash2, FiArrowLeft, FiPlus, FiCheck, FiZoomIn } from 'react-icons/fi';
import Image from 'next/image';
import MediaCenter from '~/components/MediaCenter';
import ProgressTrackerNew from '~/components/ProgressTrackerNew';
import { useAuth } from '../../lib/useAuth';
import ImageModal from '~/components/ImageModal';

const TrainingDetail = () => {
  const session = useAuth();
  const [training, setTraining] = useState(null);
  const [steps, setSteps] = useState([]);
  const [stepTitle, setStepTitle] = useState('');
  const [stepDescription, setStepDescription] = useState('');
  const [stepImage, setStepImage] = useState(null);
  const [stepVideoUrl, setStepVideoUrl] = useState(''); // Add state for step video URL
  const [editStepId, setEditStepId] = useState(null);
  const [editStepTitle, setEditStepTitle] = useState('');
  const [editStepDescription, setEditStepDescription] = useState('');
  const [editStepImage, setEditStepImage] = useState(null);
  const [editStepVideoUrl, setEditStepVideoUrl] = useState(''); // Add state for editing step video URL
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [isMediaCenterOpen, setIsMediaCenterOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [role, setRole] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [modalImageAlt, setModalImageAlt] = useState('');
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
        } else {
          console.log('User role:', data.role); // Debug log
          setRole(data.role);
        }
      }
    };

    if (session) {
      fetchUserRole();
    }
  }, [session]);

  const fetchTraining = useCallback(async () => {
    if (!slug || !role) return;
    const { data, error } = await supabase.from('trainings').select('*').eq('slug', slug).single();
    if (error) {
      console.error('Error fetching training:', error);
    } else {
      console.log('Training data:', data); // Debug log
      setTraining(data);
      setEditTitle(data.title);
      setEditDescription(data.description);
    }
  }, [slug, role]);

  const fetchSteps = useCallback(async () => {
    if (!training || !role) return;
    const { data, error } = await supabase
      .from('training_steps')
      .select('*')
      .eq('training_id', training.id)
      .order('step_number', { ascending: true });
    if (error) {
      console.error('Error fetching steps:', error);
    } else {
      console.log('Steps data:', data); // Debug log
      setSteps(data);
    }
  }, [training, role]);

  const fetchCompletedSteps = useCallback(async () => {
    if (!training || !role) return;
    if (!session?.user) return;
    const { data, error } = await supabase
      .from('training_step_completion')
      .select('step_id')
      .eq('training_id', training.id)
      .eq('user_id', session.user.id)
      .eq('is_completed', true);

    if (error) {
      console.error('Error fetching completed steps:', error);
    } else {
      console.log('Completed steps data:', data); // Debug log
      setCompletedSteps(data.map(item => item.step_id));
    }
  }, [training, role, session]);

  useEffect(() => {
    fetchTraining();
  }, [fetchTraining]);

  useEffect(() => {
    if (training) {
      fetchSteps();
      fetchCompletedSteps();
    }
  }, [fetchSteps, fetchCompletedSteps, training]);

  const handleAddStep = async () => {
    if (!stepTitle || !stepDescription) return;
    const stepNumber = steps.length + 1;
    let imageUrl = stepImage;

    if (stepImage && typeof stepImage !== 'string') {
      imageUrl = await uploadImage(stepImage);
      if (!imageUrl) return;
    }

    const { data, error } = await supabase
      .from('training_steps')
      .insert([{ training_id: training.id, step_number: stepNumber, title: stepTitle, description: stepDescription, image_url: imageUrl || null, video_url: stepVideoUrl || null }])
      .select()
      .single();

    if (error) {
      console.error('Error adding step:', error);
      alert('Error adding step.');
    } else {
      console.log('Added step:', data); // Debug log
      setSteps([...steps, data]);
      setStepTitle('');
      setStepDescription('');
      setStepImage(null);
      setStepVideoUrl('');
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
      .update({ title: editStepTitle, description: editStepDescription, image_url: imageUrl || null, video_url: editStepVideoUrl || null })
      .eq('id', stepId)
      .select();

    if (error) {
      console.error('Error updating step:', error);
      alert('Error updating step.');
    } else {
      console.log('Updated step:', data); // Debug log
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
      console.log('Updated training:', data); // Debug log
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
      console.log('Deleted step:', stepId); // Debug log
      setSteps(steps.filter(step => step.id !== stepId));
      alert('Step deleted successfully!');
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedSteps = Array.from(steps);
    const [movedStep] = reorderedSteps.splice(result.source.index, 1);
    reorderedSteps.splice(result.destination.index, 0, movedStep);

    const updatedSteps = reorderedSteps.map((step, index) => ({
      ...step,
      step_number: index + 1,
    }));

    setSteps(updatedSteps);

    updatedSteps.forEach(async (step) => {
      await supabase
        .from('training_steps')
        .update({ step_number: step.step_number })
        .eq('id', step.id);
    });
  };

  const handleImageSelect = (url) => {
    if (editStepId !== null) {
      setEditStepImage(url);
    } else {
      setStepImage(url);
    }
    setIsMediaCenterOpen(false);
  };

  const toggleStepCompletion = async (stepId) => {
    if (!session?.user) return;

    const isCompleted = completedSteps.includes(stepId);

    const { error } = await supabase
      .from('training_step_completion')
      .upsert({
        training_id: training.id,
        user_id: session.user.id,
        step_id: stepId,
        is_completed: !isCompleted,
      }, {
        onConflict: ['user_id', 'training_id', 'step_id']
      });

    if (error) {
      console.error('Error updating step completion:', error);
      alert('Error updating step completion.');
    } else {
      console.log('Toggled step completion:', stepId); // Debug log
      if (isCompleted) {
        setCompletedSteps(completedSteps.filter(step => step !== stepId));
      } else {
        setCompletedSteps([...completedSteps, stepId]);
      }
    }
  };

  const openImageModal = (src, alt) => {
    setModalImageSrc(src);
    setModalImageAlt(alt);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setModalImageSrc('');
    setModalImageAlt('');
  };

  const myLoader = ({ src }) => {
    return src;
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
        <Welcome title={isEditing ? 'Edit Training' : training.title} subtitle={isEditing ? '' : training.description} />
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {isEditing ? 'Cancel' : 'Edit Training'}
          </button>
        </div>
        {isEditing && (
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
        )}

        <ProgressTrackerNew trainingId={training.id} steps={steps} />

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
                        className="block mb-4 p-4 border border-slate-300 border-opacity-50 rounded-lg items-start bg-slate-50 dark:bg-slate-800"
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
                              className="p-2 border border-opacity-25 border-gray-300 rounded w-full mb-2"
                            />
                            <textarea
                              placeholder="Step Description"
                              value={editStepDescription}
                              onChange={(e) => setEditStepDescription(e.target.value)}
                              className="p-2 border border-gray-300 rounded w-full mb-2"
                            />
                            <input
                              type="text"
                              placeholder="Video URL"
                              value={editStepVideoUrl}
                              onChange={(e) => setEditStepVideoUrl(e.target.value)}
                              className="p-2 border border-gray-300 rounded w-full mb-2"
                            />
                            <div className="flex items-center mb-2 gap-2">
                              <input
                                type="file"
                                onChange={(e) => setEditStepImage(e.target.files[0])}
                                className="p-2 border border-gray-300 rounded w-full"
                              />
                              <button onClick={() => setIsMediaCenterOpen(true)} className="px-4 py-2 bg-green-500 text-white text-sm leading-tight rounded-lg hover:bg-green-600 transition">
                                Media Center
                              </button>
                            </div>
                            {editStepImage && (
                              <Image
                                loader={myLoader}
                                src={typeof editStepImage === 'string' ? editStepImage : URL.createObjectURL(editStepImage)}
                                alt={editStepTitle}
                                className="mb-2 md:w-1/4"
                                width={500}
                                height={300}
                              />
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
                              <div className='flex items-center gap-4 pb-4 border-b border-slate-300 border-opacity-25 mb-6'>
                                <div className={`h-10 w-10 flex items-center justify-center font-bold text-sm rounded-full p-1 ${completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-950'}`}>
                                  {completedSteps.includes(step.id) ? <FiCheck className='stroke-slate-50' size={24} /> : step.step_number}
                                </div>
                                <h3 className="font-bold text-xl">{step.title}</h3>
                                <div className='ml-auto flex gap-2'>
                                  <button
                                    onClick={() => {
                                      setEditStepId(step.id);
                                      setEditStepTitle(step.title);
                                      setEditStepDescription(step.description);
                                      setEditStepImage(step.image_url);
                                      setEditStepVideoUrl(step.video_url || '');
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
                                <div className="relative group w-full md:w-1/4" onClick={() => openImageModal(step.image_url, step.title)}>
                                  <Image
                                    loader={myLoader}
                                    src={step.image_url}
                                    alt={step.title}
                                    className="mb-2 transition cursor-pointer"
                                    width={500}
                                    height={300}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <FiZoomIn className="text-white text-3xl" />
                                  </div>
                                </div>
                              )}
                              {step.video_url && (
                                <div className='my-4'>
                                  <iframe
                                    width="560"
                                    height="315"
                                    src={step.video_url.replace("watch?v=", "embed/")}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={step.title}
                                  ></iframe>
                                </div>
                              )}
                              <button
                                onClick={() => toggleStepCompletion(step.id)}
                                className={`mt-2 px-4 py-2 ${completedSteps.includes(step.id) ? 'bg-green-500' : 'bg-gray-500'} text-white rounded-lg`}
                              >
                                {completedSteps.includes(step.id) ? 'Completed' : 'Mark as Complete'}
                              </button>
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
        <section className='addnewstep -scroll-mt-8 mb-8 block justify-between p-2'>
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
                  type="text"
                  placeholder="Video URL"
                  value={stepVideoUrl}
                  onChange={(e) => setStepVideoUrl(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full mb-2"
                />
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    onChange={(e) => setStepImage(e.target.files[0])}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                  <button onClick={() => setIsMediaCenterOpen(true)} className="px-4 py-2 text-sm leading-tight bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                    Media Center
                  </button>
                </div>
                {stepImage && (
                  <Image
                    loader={myLoader}
                    src={typeof stepImage === 'string' ? stepImage : URL.createObjectURL(stepImage)}
                    alt={stepTitle}
                    className="mb-2 md:w-1/4"
                    width={500}
                    height={300}
                  />
                )}
                <div className="block my-4">
                  <div className='gap-2 justify-start flex'>
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
                      setStepVideoUrl('');
                      setIsAddingStep(false);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
        <MediaCenter
          isOpen={isMediaCenterOpen}
          onRequestClose={() => setIsMediaCenterOpen(false)}
          onSelectImage={handleImageSelect}
        />
      </>
    )}
    <ImageModal
      isOpen={isImageModalOpen}
      onRequestClose={closeImageModal}
      src={modalImageSrc}
      alt={modalImageAlt}
    />
  </Container>
);
};

export default TrainingDetail;
