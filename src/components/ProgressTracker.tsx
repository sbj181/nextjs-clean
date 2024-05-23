import { useState, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import { FiChevronRight, FiCheck } from "react-icons/fi";
import Link from 'next/link';

import { TrainingStep } from '~/lib/sanity.queries';
import ResourceCard from '~/components/ResourceCard'; // Import ResourceCard
import { type Resource } from '~/lib/sanity.queries'; // Import Resource type

interface ProgressTrackerProps {
  steps: TrainingStep[];
  trainingId: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps, trainingId }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

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

      {steps.map((step) => (
        <div key={step._id} className="mb-6 border-2 border-slate-500 border-opacity-50 px-4 py-8">
          <div className='w-full flex mb-4'>
            <span className='bg-slate-500 bg-opacity-20 px-8 py-4 flex flex-col uppercase text-lg font-bold items-center rounded-lg justify-center'>Step {step.stepNumber}</span>
          </div>
          <h2 className="text-2xl font-semibold pb-2 mb-4 border-solid border-slate-500 border-opacity-25 border-b">
             {step.title}
          </h2>
          
          <PortableText value={step.description} />
          {step.relatedResources && step.relatedResources.length > 0 && (
            <div className='border my-4 px-4 py-2 rounded-2xl bg-green-400 bg-opacity-10'>
              <h3 className="text-xl text-center font-semibold mb-2">Related Resources</h3>
              <div className="cardWrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
                {step.relatedResources.map((resource: Resource) => (
                  <ResourceCard key={resource._id} resource={resource} /> // Use ResourceCard component
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => handleCompleteStep(step.stepNumber)}
            className={`mt-4 py-4 px-8 flex justify-between items-center gap-2 rounded-full ${completedSteps.includes(step.stepNumber) ? 'bg-green-500 text-white' : 'bg-slate-500  bg-opacity-50 text-white'}`}
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
      ))}
    </div>
  );
};

export default ProgressTracker;
