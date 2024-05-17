import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'
import Head from 'next/head'

import Card from '~/components/Card'

import Container from '~/components/Container'
import Welcome from '~/components/Welcome'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries'
import { getResources, type Resource, resourcesQuery } from '~/lib/sanity.queries'

import type { SharedPageProps } from '~/pages/_app'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    posts: Post[];
   
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
      
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  // Using useLiveQuery for real-time updates if needed
  const [posts] = useLiveQuery<Post[]>(props.posts, postsQuery);
  
  return (
    <Container>
      <Head>
        <title>Learn | CORE RMS by The Grovery</title>
        <meta name="description" content="Welcome to CORE RMS, your source for the latest blog posts and resources." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Welcome title="Learn Blog Posts" subtitle="Discover our latest blog posts" />
      <section>
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

