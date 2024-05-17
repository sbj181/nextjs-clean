import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import Head from 'next/head'

import Card from '~/components/Card'
import ResourceCard from '~/components/ResourceCard'
import Container from '~/components/Container'
import Welcome from '~/components/Welcome'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries'
import { getResources, type Resource, resourcesQuery } from '~/lib/sanity.queries'

import type { SharedPageProps } from '~/pages/_app'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {

    resources: Resource[];
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined);
  const posts = await getPosts(client);
  const resources = await getResources(client);  // Fetch both resources and posts

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',

      resources,
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  // Using useLiveQuery for real-time updates if needed

  const [resources] = useLiveQuery<Resource[]>(props.resources, resourcesQuery);

  return (
    <Container>
      <Head>
        <title>Resources | CORE RMS by The Grovery</title>
        <meta name="description" content="Welcome to CORE RMS, your source for the latest blog posts and resources." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Welcome title="Resources" subtitle="Explore our collection of resources."  />
      
      <section>
        <div className="cardWrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
        {resources.length ? (
          resources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)
        ) : (
          <p>No resources available.</p>
        )}
        </div>
      </section>
    </Container>
  )
  
}

