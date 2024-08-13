// src/components/ProgressTrackerNew.js
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FiCheck } from 'react-icons/fi';

const ProgressTrackerNew = ({ trainingId, steps }) => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error);
      } else {
        setUserId(data.user.id);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchCompletedSteps = async () => {
      const { data, error } = await supabase
        .from('training_step_completion')
        .select('step_id')
        .eq('user_id', userId)
        .eq('training_id', trainingId)
        .eq('is_completed', true);

      if (error) {
        console.error('Error fetching completed steps:', error);
      } else {
        setCompletedSteps(data.map(item => item.step_id));
      }
    };

    fetchCompletedSteps();

    const subscription = supabase
      .channel('public:training_step_completion')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'training_step_completion' }, (payload) => {
        fetchCompletedSteps();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId, trainingId]);

  const toggleStepCompletion = async (stepId) => {
    const isCompleted = completedSteps.includes(stepId);
    const newCompletedSteps = isCompleted
      ? completedSteps.filter(id => id !== stepId)
      : [...completedSteps, stepId];

    setCompletedSteps(newCompletedSteps);

    const { error } = await supabase
      .from('training_step_completion')
      .upsert({
        user_id: userId,
        training_id: trainingId,
        step_id: stepId,
        is_completed: !isCompleted,
      }, {
        onConflict: ['user_id', 'training_id', 'step_id']
      });

    if (error) {
      console.error('Error updating step completion:', error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Progress</h2>
      <div className="flex items-center justify-start mb-4 bg-slate-200 bg-opacity-10 w-full p-4 border rounded-xl border-slate-400 border-opacity-25">
        {steps.sort((a, b) => a.step_number - b.step_number).map(step => (
          <div key={step.id} className="flex items-center">
            <div className={` bg-slate-400 bg-opacity-25 w-20 h-20 mx-4 first:ml-0 flex font-bold text-xl justify-center items-center rounded-full ${completedSteps.includes(step.id) ? 'text-custom-green !border-0' : 'text-slate-500'}`}>
              {completedSteps.includes(step.id) ? <span className='bg-custom-green w-full h-full flex justify-center items-center rounded-full'><FiCheck size={38} className='stroke-white' /></span> : <span className='text-slate-500 text-2xl'>{step.step_number}</span>}
            </div>
            {/* Step Line */}
            {/* {step.step_number < steps.length && <div className="h-1 w-8 bg-gray-300 mx-2"></div>} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTrackerNew;
