import Link from 'next/link';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useLiveQuery } from 'next-sanity/preview';
import Head from 'next/head';
import { useState } from 'react';

import Card from '~/components/Card';
import ResourceCard from '~/components/ResourceCard';
import Container from '~/components/Container';
import Welcome from '~/components/Welcome';
import { readToken } from '~/lib/sanity.api';
import { getClient } from '~/lib/sanity.client';
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries';
import { getResources, type Resource, resourcesQuery } from '~/lib/sanity.queries';
import { useFavorites } from '~/contexts/FavoritesContext';
import { useSidebar } from '~/contexts/SidebarContext'; // Import the Sidebar context

import type { SharedPageProps } from '~/pages/_app';

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    posts: Post[];
    resources: Resource[];
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined);
  const posts = await getPosts(client);
  const resources = await getResources(client);

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      posts,
      resources,
    },
    revalidate: 60,
  };
};

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [posts] = useLiveQuery<Post[]>(props.posts, postsQuery);
  const [resources] = useLiveQuery<Resource[]>(props.resources, resourcesQuery);
  const { favorites } = useFavorites();
  const { isSidebarOpen } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');

  const favoriteResources = resources.filter((resource) => favorites.includes(resource._id));

  const filteredResources = resources.filter((resource) =>
    (resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="py-2 px-4 w-full dark:text-slate-600 md:w-1/2 border rounded-full"
        />
      </div>
      {favoriteResources.length > 0 ? (
        <section>
          <div className='border my-4 px-4 py-2 rounded-2xl bg-red-400 bg-opacity-10'>
            <div className='flex-col text-center mb-4 items-center justify-center w-full'>
              <div className='py-2 px-10 bg-red-200 dark:bg-red-900 inline-block font-bold rounded-2xl uppercase my-2'><h2>Favorite Resources</h2></div>
              <p>Favorited resources will appear below. Click the heart to remove.</p>
            </div>
            <div className={`cardWrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${isSidebarOpen ? '3' : '4'}  gap-4 my-2`}>
              {favoriteResources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="cardEmpty h-[120px] border px-4 py-2 rounded-2xl bg-red-400 bg-opacity-10 items-center justify-center flex my-4">Click the heart on a resource below to add it to your favorites</div>
      )}
      <section>
        <div className='flex-col text-center mb-4 items-center justify-center w-full'>
          <div className='py-2 px-10 bg-green-200 dark:bg-green-900 inline-block font-bold rounded-2xl uppercase my-2'><h2>Brand Resources</h2></div>
          <p>Use the heart button to save your most used resources!</p>
        </div>
        <div className={`cardWrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${isSidebarOpen ? '3' : '4'} gap-4 my-2`}>
          {filteredResources.length ? (
            filteredResources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)
          ) : (
            <p>No resources available.</p>
          )}
        </div>
      </section>
      <section>
      <div className='flex-col text-center mb-4 items-center justify-center w-full'>
        <div className='py-2 px-10 bg-orange-200 dark:bg-orange-900 inline-block font-bold rounded-2xl uppercase my-2'><h2>Blog Posts</h2></div>
      </div>
        <div className={`cardWrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-${isSidebarOpen ? '3' : '4'} gap-4 my-2`}>
          {posts.length ? (
            posts.map((post) => <Card key={post._id} post={post} />)
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </section>
    </Container>
  );
}
