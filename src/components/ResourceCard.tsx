import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineDownload, HiOutlineShare, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { useState } from 'react';

import { urlForImage } from '~/lib/sanity.image';
import { type Resource } from '~/lib/sanity.queries';
import { formatDate } from '~/utils';

import ShareModal from './ShareModal';
import { useFavorites } from '~/contexts/FavoritesContext'; // Import the useFavorites hook

export default function ResourceCard({ resource }: { resource: Resource }) {
  const [isShareOpen, setShareOpen] = useState(false);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const imageUrl = resource.mainImage ? urlForImage(resource.mainImage) : null;

  const handleShareClick = () => {
    setShareOpen(true);
  };

  const closeShareModal = () => {
    setShareOpen(false);
  };

  const handleFavoriteClick = () => {
    if (isFavorite(resource._id)) {
      removeFavorite(resource._id);
    } else {
      addFavorite(resource._id);
    }
  };

  return (
    <>
      <div className="card border-[4px] border-slate-50 flex-col w-full bg-slate-100 dark:bg-slate-950">
        <div className='absolute right-8 top-5 z-20 text-xs text-white uppercase bg-black bg-opacity-50 px-5 py-2 rounded-xl'>{formatDate(resource._createdAt)}</div>
        {resource.mainImage ? (
          <div className="cardImg">
            <Image
              className="card__cover"
              src={imageUrl}
              height={300}
              width={500}
              alt=""
            />
          </div>
        ) : (
          <div className="cardEmpty h-[220px] bg-slate-300 dark:bg-slate-950 block" />
        )}
        <div className='typeBadgeContainer'>
          <div className='typeBadge resource'>Resource</div>
        </div>
        <div className="card__container">
          <div className="flex flex-wrap gap-2 mb-2">
            {resource.tags && resource.tags.length > 0 && resource.tags.map((tag) => (
              <span key={tag._id} className="bg-slate-200 bg-opacity-30 text-xs px-2 py-1 rounded-md">
                {tag.title}
              </span>
            ))}
          </div>
          <h3 className="">
            <Link href={`/resource/${resource.slug.current}`}>
              {resource.title}
            </Link>
          </h3>
          <p className="resource__excerpt py-2">{resource.description}</p>
        </div>
        <div className="flex justify-around items-center mt-auto px-6 w-full gap-2 my-4">
          <Link href={`/resource/${resource.slug.current}`}>
            <div className="cardDetailsBtn">
              Details
            </div>
          </Link>
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
          <button onClick={handleFavoriteClick} className="cardFavoriteBtn ml-auto">
            {isFavorite(resource._id) ? <HiHeart size={20} /> : <HiOutlineHeart size={20} />}
          </button>
        </div>
      </div>

      {isShareOpen && (
        <ShareModal
          resource={resource}
          onClose={closeShareModal}
        />
      )}
    </>
  );
}
