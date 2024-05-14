import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useState } from 'react';
import Card from '~/components/Card';
import ResourceCard from '~/components/ResourceCard';
import Container from '~/components/Container';
import Welcome from '~/components/Welcome';
import { readToken } from '~/lib/sanity.api';
import { getClient } from '~/lib/sanity.client';
import { getPosts, type Post, postsQuery } from '~/lib/sanity.queries';
import { getResources, type Resource, resourcesQuery } from '~/lib/sanity.queries';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
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
  }
}

export default function IndexPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [posts, setPosts] = useState(props.posts);
  const [resources, setResources] = useState(props.resources);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (result.type === 'posts') {
      const reorderedPosts = Array.from(posts);
      const [movedPost] = reorderedPosts.splice(result.source.index, 1);
      reorderedPosts.splice(result.destination.index, 0, movedPost);
      setPosts(reorderedPosts);
    } else if (result.type === 'resources') {
      const reorderedResources = Array.from(resources);
      const [movedResource] = reorderedResources.splice(result.source.index, 1);
      reorderedResources.splice(result.destination.index, 0, movedResource);
      setResources(reorderedResources);
    }
  };

  return (
    <Container>
      <Welcome />
      <section>
        <div className='py-2 px-10 bg-orange-200 inline-block font-bold rounded-lg my-2'>
          <h2>Blog Posts</h2>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="posts" type="posts">
            {(provided) => (
              <div className="cardWrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2" {...provided.droppableProps} ref={provided.innerRef}>
                {posts.map((post, index) => (
                  <Card key={post._id} post={post} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>
      <section>
        <div className='py-2 px-10 bg-green-200 inline-block font-bold rounded-lg my-2'>
          <h2>Brand Resources</h2>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="resources" type="resources">
            {(provided) => (
              <div className="cardWrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2" {...provided.droppableProps} ref={provided.innerRef}>
                {resources.map((resource, index) => (
                  <ResourceCard key={resource._id} resource={resource} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </section>
    </Container>
  );
}
