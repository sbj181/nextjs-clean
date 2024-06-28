import { useState, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import { FiChevronRight, FiCheck } from "react-icons/fi";
import Link from 'next/link';
import Image from 'next/image';

import { TrainingStep } from '~/lib/sanity.queries';
import ResourceCard from '~/components/ResourceCard'; // Import ResourceCard
import { type Resource } from '~/lib/sanity.queries'; // Import Resource type
import { urlForImage } from '~/lib/sanity.image'; // Import the urlForImage function
import { urlForFile } from '~/lib/sanity.file'; // Import the urlForFile function
import ImageZoomModal from '~/components/ImageZoomModal'; // Import the new ImageZoomModal
import trainingStep from '~/schemas/trainingStep';

interface ProgressTrackerProps {
  steps: TrainingStep[];
  trainingId: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps, trainingId }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    const storedCompletedSteps = localStorage.getItem(`completedSteps_${trainingId}`);
    if (storedCompletedSteps) {
      setCompletedSteps(JSON.parse(storedCompletedSteps));
    }
  }, [trainingId]);

  const handleCompleteStep = (stepNumber: number) => {
    let updatedSteps: number[];
    if (completedSteps.includes(stepNumber)) {
      updatedSteps = completedSteps.filter(step => step !== stepNumber);
    } else {
      updatedSteps = [...completedSteps, stepNumber];
    }
    setCompletedSteps(updatedSteps);
    localStorage.setItem(`completedSteps_${trainingId}`, JSON.stringify(updatedSteps));
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizCompleted(true);
  };

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const questions = [
    {
      id: 'q1',
      question: 'What is the correct answer?',
      options: [
        { id: 'a', text: 'Answer 1' },
        { id: 'b', text: 'Answer 2' },
        { id: 'c', text: 'Answer 3' }
      ],
      correctAnswer: 'b',
    },
  ];

  return (
    <div>
      <div className="flex items-center sticky top-24 z-30 justify-center bg-slate-50 dark:bg-slate-900 bg-opacity-95 dark:bg-opacity-95 border-2 border-opacity-50 py-2 px-4 rounded-xl space-x-4 mb-6">
        <div className='mr-auto'>Progress:</div>
        {steps.map((step) => (
          <div
            key={step._id}
            className={`w-12 h-12 md:w-20 md:h-20 flex items-center justify-center rounded-full ${completedSteps.includes(step.stepNumber) ? 'bg-green-500 text-white' : 'bg-slate-500 border-2 bg-opacity-25'}`}
          >
            {completedSteps.includes(step.stepNumber) ? <FiCheck size={24} /> : step.stepNumber}
          </div>
        ))}
      </div>

      {steps.map((step) => {
        const imageUrl = step.mediaType === 'image' && step.TrainingImageUrl ? urlForImage(step.TrainingImageUrl) : null;
        const videoUrl = step.mediaType === 'video' && step.TrainingVideoFile ? urlForFile(step.TrainingVideoFile) : null;

        return (
          <div key={step._id} className="mb-6 rounded-md border-2 border-blue-500 bg-blue-50 bg-opacity-5 border-opacity-50 px-6 py-8">
            {/* <div className='w-full flex mb-4'>
              <span className='bg-slate-500 bg-opacity-20 px-8 py-4 flex flex-col uppercase text-lg font-bold items-center rounded-lg justify-center'>Step {step.stepNumber}</span>
            </div> */}
            <div className='mb-2 text-blue-500'><span className='font-semibold'>Training </span>- Step {step.stepNumber}</div>
            <Link href={`/training/${step.slug.current}`} passHref>
              <div className="cursor-pointer transition hover:underline text-2xl font-semibold pb-2 mb-2 block">
                {step.title}
              </div>
            </Link>
            <PortableText value={step.description} />

            <div className="media-container mt-4">
              {videoUrl && (
                <div className='w-1/2 h-auto mb-4 border border-slate-300 border-opacity-50 rounded-lg p-4 bg-slate-300 bg-opacity-10'>
                  {step.mediaTitle && <h3 className='font-semibold text-lg mb-2'>{step.mediaTitle}</h3>}
                  <video controls className="w-full h-auto rounded-lg">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {step.mediaCaption && <p className='text-sm mt-4 opacity-65'>{step.mediaCaption}</p>}
                </div>
              )}
              {imageUrl && (
                <div className='w-1/2 h-auto mb-4 border border-slate-300 border-opacity-50 rounded-lg p-4 bg-slate-300 bg-opacity-10'>
                  {step.mediaTitle && <h3 className='font-semibold text-lg mb-2'>{step.mediaTitle}</h3>}
                  <Image
                    src={imageUrl}
                    alt={step.title}
                    width={500}
                    height={300}
                    className="object-cover w-full h-auto rounded-lg cursor-pointer"
                    onClick={() => openModal(imageUrl)}
                  />
                  {step.mediaCaption && <p className='text-sm mt-4 opacity-65'>{step.mediaCaption}</p>}
                </div>
              )}
            </div>

            {step.relatedResources && step.relatedResources.length > 0 && (
              <div className='mt-12'>
                <h3 className="text-xl font-semibold mb-4">Related Resources</h3>
                <div className="cardWrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
                  {step.relatedResources.map((resource: Resource) => (
                    <ResourceCard key={resource._id} resource={resource} /> // Use ResourceCard component
                  ))}
                </div>
              </div>
            )}
            <div className='bg-blue-500 bg-opacity-10 p-4 rounded-xl text-center'>
              <div className='mt-2'><p>Once you've reviewed the information above mark the button below to complete!</p></div>
              <button
                onClick={() => handleCompleteStep(step.stepNumber)}
                className={`mt-4 py-4 px-8 m-auto flex justify-between items-center gap-2 rounded-full ${completedSteps.includes(step.stepNumber) ? 'bg-green-500 text-white' : 'bg-slate-500  bg-opacity-50 text-white'}`}
              >
                {completedSteps.includes(step.stepNumber) ? (
                  <>
                    Completed <span className='bg-slate-500 bg-opacity-25 p-1 rounded-full'><FiCheck /></span>
                  </>
                ) : (
                    <>
                    Mark Complete 
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}

      {!showQuiz && completedSteps.length === steps.length && (
        <button
          onClick={() => setShowQuiz(true)}
          className="mt-6 py-4 px-8 bg-blue-500 text-white rounded-full"
        >
          Take the Quiz
        </button>
      )}

      {showQuiz && (
        <div className="quiz-section mt-8 border-2 rounded-xl text-center border-blue-300 p-5 bg-blue-500 bg-opacity-20">
          <h3 className="text-4xl font-semibold mb-4">Quiz</h3>
          {questions.map((question) => (
            <div key={question.id} className="mb-4">
              <p className="text-lg mb-4 font-medium">{question.question}</p>
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center my-2 border border-blue-500 border-opacity-50 p-4 rounded-2xl">
                  <input
                    type="radio"
                    id={`${question.id}-${option.id}`}
                    name={question.id}
                    value={option.id}
                    onChange={() => handleQuizAnswer(question.id, option.id)}
                    checked={selectedAnswers[question.id] === option.id}
                    className="mr-2 inline"
                  />
                  <label htmlFor={`${question.id}-${option.id}`} className="text-base">{option.text}</label>
                </div>
              ))}
            </div>
          ))}
          <button
            onClick={handleSubmitQuiz}
            className="mt-4 py-4 px-8 bg-blue-500 text-white rounded-full"
          >
            Submit Quiz
          </button>
          {quizCompleted && (
            <div className="mt-4">
              <p className="text-lg font-semibold">Your Score: {quizScore}/{questions.length}</p>
            </div>
          )}
        </div>
      )}
      {isModalOpen && modalImage && (
        <ImageZoomModal imageUrl={modalImage} onClose={closeModal} />
      )}
    </div>
  );
};

export default ProgressTracker;
