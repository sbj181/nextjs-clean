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
import ResourceCard from '~/components/ResourceCard';
import Link from 'next/link';
import { urlForImage } from '~/lib/sanity.image';
import { urlForFile } from '~/lib/sanity.file';
import Image from 'next/image';

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

  // const imageUrl = liveTrainingStep.mediaType === 'image' && liveTrainingStep.TrainingImageUrl ? urlForImage(liveTrainingStep.TrainingImageUrl).url() : null;
  const imageUrl = liveTrainingStep.mediaType === 'image' && liveTrainingStep.TrainingImageUrl ? urlForImage(liveTrainingStep.TrainingImageUrl) : null;
  return (
    <Container>
      <Head>
        <title>{liveTrainingStep.title}{` | Training Step | Training | CORE RMS`}</title>
        <meta name="description" content={`Training step ${liveTrainingStep.title}`} />
      </Head>
      <section>
        <div className="py-5">
          {liveTrainingStep.parentTraining && (
            <div className="text-sm text-gray-500 mb-2">
              Part of the training: <strong>{liveTrainingStep.parentTraining.title}</strong>
            </div>
          )}
          <h1 className="text-3xl font-semibold mb-4">{liveTrainingStep.title}</h1>
          <PortableText value={liveTrainingStep.description} />

          {liveTrainingStep.requiresMedia && liveTrainingStep.mediaType === 'video' && liveTrainingStep.TrainingVideoFile && (
            <div className='my-4 rounded-lg bg-slate-500 bg-opacity-20 w-full'>
              <video controls className="w-full h-auto rounded-lg">
                <source src={urlForFile(liveTrainingStep.TrainingVideoFile)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {imageUrl && (
            <div className='w-full h-auto mt-4 mb-4'>
              <Image
                src={imageUrl}
                alt={liveTrainingStep.title}
                width={800}
                height={450}
                className="object-cover rounded-lg overflow-hidden p-2 bg-slate-500 bg-opacity-20 w-full"
              />
            </div>
          )}

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
        </div>
      </section>
    </Container>
  );
}
