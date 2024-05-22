import { useState } from 'react';
import { PortableText } from '@portabletext/react';
import { HiCheck } from 'react-icons/hi';
import { TrainingStep } from '~/lib/sanity.queries';

interface ProgressTrackerProps {
  steps: TrainingStep[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleCompleteStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter(step => step !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  return (
    <div>
      <div className="flex justify-center bg-slate-500 bg-opacity-10 border-2 p-2 rounded-xl space-x-4 mb-6">
        {steps.map((step) => (
          <div
            key={step._id}
            className={`w-20 h-20 flex items-center justify-center rounded-full ${completedSteps.includes(step.stepNumber) ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
          >
            {completedSteps.includes(step.stepNumber) ? <HiCheck size={24} /> : step.stepNumber}
          </div>
        ))}
      </div>

      {steps.map((step) => (
        <div key={step._id} className="mb-6 border-2 px-4 py-8">
          <h2 className="text-2xl text-center font-semibold mb-2">
            Step {step.stepNumber}: {step.title}
          </h2>
          <PortableText value={step.description} />
          {step.relatedResource && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Related Resource:</h3>
              <p>
                <a href={`/resource/${step.relatedResource.slug.current}`} className="text-blue-500 underline">
                  {step.relatedResource.title}
                </a>
              </p>
            </div>
          )}
          <button
            onClick={() => handleCompleteStep(step.stepNumber)}
            className={`mt-4 py-2 px-4 rounded-lg ${completedSteps.includes(step.stepNumber) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          >
            {completedSteps.includes(step.stepNumber) ? 'Unmark as Complete' : 'Mark as Complete'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;
