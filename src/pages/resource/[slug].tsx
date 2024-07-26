import { PortableText } from '@portabletext/react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useLiveQuery } from 'next-sanity/preview';
import { useState } from 'react';
import { HiHeart, HiOutlineDownload, HiOutlineExternalLink, HiOutlineHeart,HiOutlineShare } from 'react-icons/hi';

import Container from '~/components/Container';
import ShareModal from '~/components/ShareModal';
import { useFavorites } from '~/contexts/FavoritesContext'; // Import the useFavorites hook
import { readToken } from '~/lib/sanity.api';
import { getClient } from '~/lib/sanity.client';
import { urlForFile } from '~/lib/sanity.file';
import { urlForImage } from '~/lib/sanity.image';
import {
  getResource,
  type Resource,
  resourceBySlugQuery,
  resourceSlugsQuery,
} from '~/lib/sanity.queries';
import type { SharedPageProps } from '~/pages/_app';
import { formatDate } from '~/utils';

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

  const getResourceLink = () => {
    if (resource.resourceKind === 'file') {
      return urlForFile(resource.fileUpload) || resource.fileShareURL;
    }
    return resource.BMSResourceLink;
  };

  const getLinkIcon = () => {
    if (resource.resourceKind === 'file' || !resource.resourceKind) {
      return <HiOutlineDownload size={20} />;
    }
    return <HiOutlineExternalLink size={20} />;
  };

  const getLinkText = () => {
    if (resource.resourceKind === 'file' || !resource.resourceKind) {
      return 'Download';
    }
    return 'Visit';
  };

  const resourceLink = getResourceLink();

  return (
    <Container>
       <Head>
        <title>{resource.title}{` | Resources | CORE RMS`}</title>
        <meta name="description" content={`Resource ${resource.description}`} />
      </Head>
      <section className="resource min-h-screen gap-6">
        <div className="flex flex-col justify-start">
          <h1 className="resource__title text-2xl font-bold mb-4">{resource.title}</h1>
          
          <div className="flex gap-4 mb-4">
            {resourceLink && (
              <a
                href={resourceLink}
                className="cardDownloadBtn transition !bg-custom-blue hover:!bg-custom-blue-dark !text-white !rounded-xl !px-8 !w-auto !flex gap-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {getLinkIcon()}
                {getLinkText()}
              </a>
            )}
            <button onClick={handleShareClick} className="cardShareBtn">
              <HiOutlineShare size={20} />
            </button>
            <button onClick={handleFavoriteClick} className="cardFavoriteBtn !px-[0.7em] !py-[0.7em]  !bg-red-400 !bg-opacity-25  order-last flex-grow-0">
            {isFavorite(resource._id) ? <HiHeart className='fill-red-600' size={24} /> : <HiOutlineHeart className='stroke-red-600' size={24} />}
            </button>
          </div>
          <div className='border-2 border-opacity-25 border-slate-500 text-sm pt-3 pb-2 px-4 rounded-xl inline-block mb-4'>
            <span className='uppercase mb-3 font-bold opacity-50 block'>File Details</span>
            <p className="resource__date text-gray-600 mb-2 dark:text-gray-300"><span className='font-bold'>Last Updated: </span>{formatDate(resource._createdAt)}</p>
            {resource.author && (
              <p className="resource__date text-gray-600 dark:text-gray-300 mb-2"><span className='font-bold'>Created by: </span>{resource.author}</p>
            )}
            {/* Tags Section */}
          {resource.tags && (
            <p className="resource__date text-gray-600 mb-2 dark:text-gray-300">
              <span className='font-bold'>Tags: </span>
              {resource.tags.map((tag) => (
                <span key={tag._id} className="bg-gray-200 dark:bg-gray-700 mr-1 text-sm rounded-full px-3 py-1">
                  {tag.title}
                </span>
              ))}
            </p>
          )}
          </div>
          {resource.mainImage && (
            <div className='rounded-lg overflow-hidden p-2 bg-slate-500 bg-opacity-20 w-full'>
              <Image
                className="max-w-[60%] mx-auto h-auto object-cover"
                src={imageUrl}
                height={600}
                width={1000}
                alt=""
              />
            </div>
          )}
          {resource.longDescription && (
            <div className="resource__content !my-6">
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
