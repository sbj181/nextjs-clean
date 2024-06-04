import { GetStaticPaths, GetStaticProps } from 'next';
import { useLiveQuery } from 'next-sanity/preview';
import { useRouter } from 'next/router';
import groq from 'groq';
import Container from '~/components/Container';
import { getClient } from '~/lib/sanity.client';
import { getTrainingStep, trainingStepBySlugQuery, type TrainingStep } from '~/lib/sanity.queries';
import { readToken } from '~/lib/sanity.api';
import { PortableText } from '@portabletext/react';
import Head from 'next/head';
import ProgressTracker from '~/components/ProgressTracker';
import ResourceCard from '~/components/ResourceCard';
import Link from 'next/link';

interface TrainingStepPageProps {
  trainingStep: TrainingStep;
  draftMode: boolean;
  token: string;
}

export const getStaticProps: GetStaticProps<TrainingStepPageProps> = async ({ params, draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined);
  const slug = params?.slug as string;
  const trainingStep = await getTrainingStep(client, slug);

  if (!trainingStep) {
    return { notFound: true };
  }

  return {
    props: {
      trainingStep,
      draftMode,
      token: draftMode ? readToken : '',
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient();
  const trainingSteps: { slug: string }[] = await client.fetch(groq`*[_type == "trainingStep" && defined(slug.current)]{ "slug": slug.current }`);

  const paths = trainingSteps.map((step) => ({
    params: { slug: step.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export default function TrainingStepPage({ trainingStep }: TrainingStepPageProps) {
  const router = useRouter();

  const [liveTrainingStep] = useLiveQuery(trainingStep, trainingStepBySlugQuery, {
    slug: trainingStep.slug.current,
  });

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Head>
        <title>{liveTrainingStep.title} | Training Step</title>
        <meta name="description" content={`Training step ${liveTrainingStep.title}`} />
      </Head>
      <section>
        <div className="py-5">
          <h1 className="text-3xl font-semibold mb-4">{liveTrainingStep.title}</h1>
          <PortableText value={liveTrainingStep.description} />
          {liveTrainingStep.relatedResources && (
            <div>
              <h2 className="text-2xl font-semibold mt-8 mb-4">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveTrainingStep.relatedResources.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            </div>
          )}
          <div className="mt-8">
            <Link href='/training'><span className='py-2 px-4 rounded-xl bg-slate-300 dark:bg-slate-700 bg-opacity-50 disabled:opacity-50'>Back to Training</span></Link>
          </div>
          {/* <div className="mt-8">
            <ProgressTracker steps={[liveTrainingStep]} trainingId={liveTrainingStep._id} />
          </div> */}
        </div>
      </section>
    </Container>
  );
}
