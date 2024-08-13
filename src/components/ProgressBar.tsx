import React from 'react';
import { FiCheck } from 'react-icons/fi';

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className="w-full flex items-center">
      {percentage === 100 ? (
        
        <div className="flex items-center justify-center gap-2 bg-slate-300 bg-opacity-15 py-2 w-full rounded-xl">
          <span className='bg-custom-green p-2 rounded-full'><FiCheck className="text-white" size={24} /></span>
          <span className="text-custom-green font-bold">Completed</span>
        </div>

      ) : (
        <div className='w-full'>
          <div className="w-full bg-slate-200 rounded-full h-4 dark:bg-gray-700">
            <div
              className="bg-custom-dark-blue dark:bg-custom-orange h-4 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
