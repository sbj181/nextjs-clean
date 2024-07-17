import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useLiveQuery } from 'next-sanity/preview';
import { useMemo,useState } from 'react';

import Container from '~/components/Container';
import ResourceCard from '~/components/ResourceCard';
import TagFilter from '~/components/TagFilter';
import Welcome from '~/components/Welcome';
import { useSidebar } from '~/contexts/SidebarContext'; // Import the Sidebar context
import { readToken } from '~/lib/sanity.api';
import { getClient } from '~/lib/sanity.client';
import { getResources, type Resource, resourcesQuery } from '~/lib/sanity.queries';
import type { SharedPageProps } from '~/pages/_app';

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    resources: Resource[];
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined);
  const resources = await getResources(client);

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      resources,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};

export default function ResourcesPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [resources] = useLiveQuery<Resource[]>(props.resources, resourcesQuery);
  const { isSidebarOpen } = useSidebar();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    return Array.from(new Set(resources.flatMap((resource) => resource.tags?.map(tag => tag.title) || [])));
  }, [resources]);

  const filteredResources = useMemo(() => {
    return selectedTags.length
      ? resources.filter(resource =>
          resource.tags?.some(tag => selectedTags.includes(tag.title))
        )
      : resources;
  }, [selectedTags, resources]);

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  return (
    <Container>
      <Head>
        <title>Resources | CORE RMS by The Grovery</title>
        <meta name="description" content="Welcome to CORE RMS, your source for the latest blog posts and resources." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Welcome title="Resources" subtitle="Explore our collection of resources." />
      
      <section className='border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 bg-opacity-100 p-6 rounded-2xl mb-6'>
        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onTagClick={handleTagClick}
        />

        <div className={`cardWrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${isSidebarOpen ? '3' : '4'} gap-4 my-2`}>
          {filteredResources.length ? (
            filteredResources.map((resource) => <ResourceCard key={resource._id} resource={resource} />)
          ) : (
            <p>No resources available.</p>
          )}
        </div>
      </section>
    </Container>
  );
}