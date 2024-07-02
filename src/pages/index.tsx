import Link from 'next/link';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useLiveQuery } from 'next-sanity/preview';
import Head from 'next/head';
import { useState, useEffect } from 'react';

import Card from '~/components/Card';
import ResourceCard from '~/components/ResourceCard';
import Container from '~/components/Container';
import Welcome from '~/components/Welcome';
import { readToken } from '~/lib/sanity.api';
import { getClient } from '~/lib/sanity.client';
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries';
import { getResources, type Resource, resourcesQuery } from '~/lib/sanity.queries';
import { useFavorites } from '~/contexts/FavoritesContext';
import { useSidebar } from '~/contexts/SidebarContext';
import TagFilter from '~/components/TagFilter'; // Import the TagFilter component
import Loading from '~/components/Loading'; // Import the Loading component

import { useAuth } from '~/lib/useAuth'; // Import the useAuth hook
import { supabase } from '~/lib/supabaseClient'; // Import supabase client

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
  const session = useAuth(); // Check if the user is authenticated
  const [posts] = useLiveQuery<Post[]>(props.posts, postsQuery);
  const [resources] = useLiveQuery<Resource[]>(props.resources, resourcesQuery);
  const { favorites, clearFavorites } = useFavorites();
  const { isSidebarOpen } = useSidebar();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('display_name')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setDisplayName(data.display_name);
        }
      }
    };
    fetchProfile();
  }, []);

  const favoriteResources = resources.filter((resource) => favorites.includes(resource._id));

  const allTags = Array.from(new Set(resources.flatMap((resource) => resource.tags?.map(tag => tag.title) || [])));

  const filteredResources = selectedTags.length
    ? resources.filter(resource =>
        resource.tags?.some(tag => selectedTags.includes(tag.title))
      )
    : resources;

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  if (!session) return <Loading />;

  return (
    <Container>
      <Head>
        <title>CORE RMS by The Grovery</title>
        <meta name="description" content="Welcome to CORE RMS, your source for the latest blog posts and resources." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Welcome 
        title={`🤙 Hey ${displayName}, Welcome to CORE CMS!`}       
        subtitle={<span>Visit the <Link href="/studio"><span className="text-blue-500 underline">CMS Studio</span></Link> to manage content and add your own resources. Visit the <Link href="/profile"><span className="text-blue-500 underline">Profile</span></Link> page to access user details.</span>}
      />
      
      {favoriteResources.length > 0 ? (
        <section className='border-2 border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 bg-opacity-50 p-6 rounded-2xl mb-6'>
          <div className='mb-6 flex justify-between items-center'>
            <div>
            <h2 className='text-3xl font-bold'>{displayName}s Favorites</h2>
            <p>Resources you have favorited will appear here!</p>
            </div>
            <button
              onClick={clearFavorites}
              className="mt-2 px-4 py-2 text-sm bg-red-500 text-white rounded-lg transition hover:bg-red-600"
            >
              Clear All Favorites
            </button>
          </div>
            <div className={`cardWrap gap-4 xl:gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${isSidebarOpen ? '3' : '4'} 2xl:grid-cols-${isSidebarOpen ? '4' : '5'}`}>
              {favoriteResources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
        </section>
      ) : (
        <div></div>
      )}
      <section className='border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 bg-opacity-100 p-6 rounded-2xl mb-6'>
        <div className='mb-6'>
          <h2 className='text-3xl font-bold'>Brand Resources</h2>
          <p>Use the heart button to save your most used resources!</p>
        </div>
        
        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onTagClick={handleTagClick}
        />
        
        <div className={`cardWrap grid gap-4 xl:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-${isSidebarOpen ? '3' : '4'} 2xl:grid-cols-${isSidebarOpen ? '4' : '5'}` }>
          
            {filteredResources.length ? (
              filteredResources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)
            ) : (
              <p>No resources available.</p>
            )}
          
        </div>
      </section>
      <section className='border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 bg-opacity-50 p-6 rounded-2xl mb-6'>
        <div className='mb-6'>
          <h2 className='text-3xl font-bold'>Blog Posts</h2>
          <p>Blog posts are articles that can be posted and shared core!</p>
        </div>
        <div className={`cardWrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${isSidebarOpen ? '3' : '4'}  2xl:grid-cols-${isSidebarOpen ? '4' : '5'} gap-4 xl:gap-6 my-2`}>
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
