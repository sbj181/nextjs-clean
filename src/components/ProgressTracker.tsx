import { FiCheck } from "react-icons/fi";

interface ProgressTrackerProps {
  steps: { _id: string, stepNumber: number }[];
  trainingId: string;
  completedSteps: number[];
  onComplete: (stepNumber: number) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps, completedSteps, onComplete }) => {
  return (
    <div>
      <div className="flex items-center sticky top-24 z-30 justify-center bg-slate-50 dark:bg-slate-900 bg-opacity-95 dark:bg-opacity-95 border-2 border-opacity-50 py-2 px-4 rounded-xl space-x-4 mb-6">
        <div className='mr-auto'>Progress:</div>
        {steps.map((step) => (
          <div
            key={step._id}
            className={`w-12 h-12 md:w-20 md:h-20 flex items-center justify-center rounded-full ${completedSteps.includes(step.stepNumber) ? 'bg-green-500 text-white' : 'bg-slate-500 border-2 bg-opacity-25'}`}
            onClick={() => onComplete(step.stepNumber)}
          >
            {completedSteps.includes(step.stepNumber) ? <FiCheck size={24} /> : step.stepNumber}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
