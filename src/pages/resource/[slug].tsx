import { PortableText } from '@portabletext/react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import { HiOutlineDownload, HiOutlineShare, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useLiveQuery } from 'next-sanity/preview';

import Container from '~/components/Container';
import ShareModal from '~/components/ShareModal';
import { readToken } from '~/lib/sanity.api';
import { getClient } from '~/lib/sanity.client';
import { urlForImage } from '~/lib/sanity.image';
import {
  getResource,
  type Resource,
  resourceBySlugQuery,
  resourceSlugsQuery,
} from '~/lib/sanity.queries';
import type { SharedPageProps } from '~/pages/_app';
import { formatDate } from '~/utils';
import { useFavorites } from '~/contexts/FavoritesContext'; // Import the useFavorites hook

interface Query {
  [key: string]: string;
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    resource: Resource;
  },
  Query
> = async ({ draftMode = false, params = {} }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined);
  const resource = await getResource(client, params.slug);

  if (!resource) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      resource,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};

export default function ResourceSlugRoute(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const [resource] = useLiveQuery(props.resource, resourceBySlugQuery, {
    slug: props.resource.slug.current,
  });

  const imageUrl = resource.mainImage ? urlForImage(resource.mainImage) : null;

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites(); // Get favorites and methods from context
  const [isShareOpen, setShareOpen] = useState(false);

  const handleFavoriteClick = () => {
    if (isFavorite(resource._id)) {
      removeFavorite(resource._id);
    } else {
      addFavorite(resource._id);
    }
  };

  const handleShareClick = () => {
    setShareOpen(true);
  };

  const closeShareModal = () => {
    setShareOpen(false);
  };

  return (
    <Container>
      <section className="resource min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-8">
        {resource.mainImage && (
          <div className='rounded-lg overflow-hidden'>
            <Image
              className="w-full h-auto object-cover"
              src={imageUrl}
              height={600}
              width={1000}
              alt=""
            />
          </div>
        )}
        <div className="flex flex-col justify-start">
          <h1 className="resource__title text-2xl font-bold mb-4">{resource.title}</h1>

          <div className="flex gap-4 mb-4">
            {resource.BMSResourceLink && (
              <a
                href={resource.BMSResourceLink}
                className="cardDownloadBtn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HiOutlineDownload size={20} />
              </a>
            )}
            <button onClick={handleShareClick} className="cardShareBtn">
              <HiOutlineShare size={20} />
            </button>
            <button onClick={handleFavoriteClick} className="cardFavoriteBtn">
              {isFavorite(resource._id) ? <HiHeart className='fill-red-600' size={20} /> : <HiOutlineHeart size={20} />}
            </button>
          </div>

          <p className="resource__date text-gray-600 dark:text-gray-300 mb-4">{formatDate(resource._createdAt)}</p>
          {resource.longDescription && (
            <div className="resource__content">
              <PortableText value={resource.longDescription} />
            </div>
          )}
        </div>
      </section>

      {isShareOpen && (
        <ShareModal
          resource={resource}
          onClose={closeShareModal}
        />
      )}
    </Container>
  );
}

export const getStaticPaths = async () => {
  const client = getClient();
  const slugs = await client.fetch(resourceSlugsQuery);

  return {
    paths: slugs?.map(({ slug }) => `/resource/${slug}`) || [],
    fallback: 'blocking',
  };
};
