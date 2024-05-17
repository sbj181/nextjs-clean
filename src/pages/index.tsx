import Link from 'next/link'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import Card from '~/components/Card'
import ResourceCard from '~/components/ResourceCard'
import Container from '~/components/Container'
import Welcome from '~/components/Welcome'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries'
import { getResources, type Resource, resourcesQuery } from '~/lib/sanity.queries'
import { useFavorites } from '~/contexts/FavoritesContext'; // Import the useFavorites hook

import type { SharedPageProps } from '~/pages/_app'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    posts: Post[];
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
      posts,
      resources,
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [posts] = useLiveQuery<Post[]>(props.posts, postsQuery);
  const [resources] = useLiveQuery<Resource[]>(props.resources, resourcesQuery);
  const { favorites } = useFavorites();

  const favoriteResources = resources.filter((resource) => favorites.includes(resource._id));

  return (
    <Container>
      <Head>
        <title>CORE RMS by The Grovery</title>
        <meta name="description" content="Welcome to CORE RMS, your source for the latest blog posts and resources." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Welcome 
      title='Welcome to CORE RMS + CMS'       
      subtitle={<span>Visit the <Link href="/studio"><span className="text-blue-500 underline">CMS Studio</span></Link> to manage content and add your own resources.</span>}
      />
      {favoriteResources.length > 0 && (
        <section>
          <div className='py-2 px-10 bg-red-200 dark:bg-red-900 inline-block font-bold rounded-2xl uppercase my-2'><h2>Favorite Resources</h2></div>
          <div className="cardWrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
            {favoriteResources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        </section>
      )}
      <section>
        <div className='py-2 px-10 bg-green-200 dark:bg-green-900 inline-block font-bold rounded-2xl uppercase my-2'><h2>Brand Resources</h2></div>
        <div className="cardWrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
          {resources.length ? (
            resources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)
          ) : (
            <p>No resources available.</p>
          )}
        </div>
      </section>
      <section>
        <div className='py-2 px-10 bg-orange-200 dark:bg-orange-900 inline-block font-bold rounded-2xl uppercase my-2'><h2>Learn</h2></div>
        <div className="cardWrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
          {posts.length ? (
            posts.map((post) => <Card key={post._id} post={post} />)
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </section>
    </Container>
  )
}
