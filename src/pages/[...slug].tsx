import { PortableText } from '@portabletext/react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import Container from '~/components/Container';
import { getClient } from '~/lib/sanity.client';
import { getResource, getTrainingStep, resourceSlugsQuery, trainingStepBySlugQuery } from '~/lib/sanity.queries';

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getClient();
  const resourceSlugs = await client.fetch(resourceSlugsQuery);
  const trainingStepSlugs = await client.fetch(`*[_type == "trainingStep" && defined(slug.current)][].slug.current`);

  const paths = [
    ...resourceSlugs.map((slug: string) => ({ params: { slug: ['resource', slug] } })),
    ...trainingStepSlugs.map((slug: string) => ({ params: { slug: ['trainingStep', slug] } })),
  ];

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = getClient();
  const [type, slug] = params?.slug as string[];

  let data = null;

  if (type === 'resource') {
    data = await getResource(client, slug);
  } else if (type === 'trainingStep') {
    data = await getTrainingStep(client, slug);
  }

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      data,
      type,
    },
    revalidate: 60,
  };
};

const DynamicPage = ({ data, type }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Container>
      <Head>
        <title>{data.title} | CORE RMS by The Grovery</title>
        <meta name="description" content={data.description || data.title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <article className="prose dark:prose-dark">
        <section>
        <h1 className="resource__title text-2xl font-bold mb-4">{data.title}</h1>
        {data.description && <PortableText value={data.description} />}
        {type === 'resource' && data.longDescription && <PortableText value={data.longDescription} />}
        </section>
      </article>
    </Container>
  );
};

export default DynamicPage;
