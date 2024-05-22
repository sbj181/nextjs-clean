import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useState } from 'react';
import { useLiveQuery } from 'next-sanity/preview';
import { PortableText } from '@portabletext/react';
import Container from '~/components/Container';
import ProgressTracker from '~/components/ProgressTracker';
import { readToken } from '~/lib/sanity.api';
import { getClient } from '~/lib/sanity.client';
import { getTrainings, type Training, trainingsQuery } from '~/lib/sanity.queries';
import Head from 'next/head';
import Welcome from '~/components/Welcome';

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
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(trainings[0] || null);

  return (
    <Container>
      <Head>
        <title>Training | CORE RMS by The Grovery</title>
        <meta name="description" content="Welcome to CORE RMS, your source for the latest blog posts and resources." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Welcome title="Training" subtitle="Follow our steps below to get onboarded." />
      <section>
        <div className="px-10 py-5">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Select a Training</h2>
            <ul className="flex space-x-4">
              {trainingData?.map((training) => (
                <li key={training._id}>
                  <button
                    className={`py-2 px-4 rounded-xl ${selectedTraining?._id === training._id ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    onClick={() => setSelectedTraining(training)}
                  >
                    {training.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {selectedTraining && (
            <>
              <ProgressTracker steps={selectedTraining.steps || []} />
              {/* <div className="mt-8">
                {selectedTraining.steps.map((step) => (
                  <div key={step._id} className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">
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
                  </div>
                ))}
              </div> */}
            </>
          )}
        </div>
      </section>
    </Container>
  );
}
