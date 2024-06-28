import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useState } from 'react';
import { useLiveQuery } from 'next-sanity/preview';
import Container from '~/components/Container';
import { FiBookOpen } from "react-icons/fi";
import ProgressTracker from '~/components/ProgressTracker';
import { readToken } from '~/lib/sanity.api';
import { getClient } from '~/lib/sanity.client';
import { getTrainings, type Training, trainingsQuery } from '~/lib/sanity.queries';
import Head from 'next/head';
import Welcome from '~/components/Welcome';
import Link from 'next/link';

export const getStaticProps: GetStaticProps<{
  trainings: Training[];
  draftMode: boolean;
  token: string;
}> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined);
  const trainings = await getTrainings(client);

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      trainings,
    },
    revalidate: 60,
  };
};

export default function TrainingPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { trainings } = props;
  const [trainingData] = useLiveQuery<Training[]>(props.trainings, trainingsQuery);
  const [selectedTrainingIndex, setSelectedTrainingIndex] = useState<number>(0);
  const selectedTraining = trainingData ? trainingData[selectedTrainingIndex] : undefined;

  const handlePrevious = () => {
    if (selectedTrainingIndex > 0) {
      setSelectedTrainingIndex(selectedTrainingIndex - 1);
    }
  };

  const handleNext = () => {
    if (trainingData && selectedTrainingIndex < trainingData.length - 1) {
      setSelectedTrainingIndex(selectedTrainingIndex + 1);
    }
  };

  return (
    <Container>
      <Head>
        <title>Training | CORE RMS by The Grovery</title>
        <meta name="description" content="Welcome to CORE RMS, your source for the latest blog posts and resources." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Welcome title="Training" subtitle="Choose a training module from the dropdown below." />
      <section>
        <div className="py-5">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Select a Training Module:</h2>
            <div className="hidden md:block">
              {trainingData && (
                <ul className="flex space-x-4">
                  {trainingData.map((training, index) => (
                    <li key={training._id}>
                      <button
                        className={`py-4 pl-5 pr-7 bg-opacity-100 hover:bg-opacity-90 shadow-sm flex items-center rounded-xl ${selectedTraining?._id === training._id ? 'bg-blue-500 text-white' : 'bg-slate-300 dark:bg-slate-700 bg-opacity-50'}`}
                        onClick={() => setSelectedTrainingIndex(index)}
                      >
                        <span className='mr-3 bg-slate-50 w-8 h-8 flex items-center justify-center rounded-xl bg-opacity-30 border-1 border-slate-50'><FiBookOpen /></span>  {training.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="md:hidden">
              <select
                className="py-4 px-8 rounded-xl bg-slate-300 bg-opacity-50"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const trainingIndex = trainingData?.findIndex((training) => training._id === selectedId);
                  if (trainingIndex !== undefined && trainingIndex >= 0) {
                    setSelectedTrainingIndex(trainingIndex);
                  }
                }}
                value={selectedTraining?._id || ''}
              >
                <option value="" disabled>Select a training module</option>
                {trainingData?.map((training) => (
                  <option key={training._id} value={training._id}>
                    {training.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedTraining ? (
            <>
              <ProgressTracker steps={selectedTraining.steps} trainingId={selectedTraining._id} />
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={selectedTrainingIndex === 0}
                  className="py-2 px-4 rounded-xl bg-slate-300 dark:bg-slate-700 bg-opacity-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={trainingData && selectedTrainingIndex === trainingData.length - 1}
                  className="py-2 px-4 rounded-xl bg-slate-300 dark:bg-slate-700 bg-opacity-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10 rounded-xl bg-green-500 bg-opacity-15 px-8">
              <p className="text-xl">Welcome to the Training section. Please select a training module from the dropdown above to begin.</p>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
