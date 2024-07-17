import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { HiOutlineShare } from 'react-icons/hi';

import { urlForImage } from '~/lib/sanity.image';
import { type Post } from '~/lib/sanity.queries';
import { formatDate } from '~/utils';

import ShareModal from './ShareModal'; // Import the ShareModal component

export default function Card({ post }: { post: Post }) {
  const [isShareOpen, setShareOpen] = useState(false);
  const imageUrl = post.mainImage ? urlForImage(post.mainImage) : null;

  const handleShareClick = () => {
    setShareOpen(true);
  };

  const closeShareModal = () => {
    setShareOpen(false);
  };

  return (
    <>
      <div className="card w-full">
        <div className='absolute right-8 top-5 z-20 text-xs text-white uppercase bg-black bg-opacity-50 px-5 py-2 rounded-xl'>{formatDate(post._createdAt)}</div>
        {post.mainImage ? (
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
          <div className="card__cover--none" />
        )}
        <div className='typeBadgeContainer'>
          <div className='typeBadge blog'>Blog Post</div>
        </div>
        <div className="card__container">
          <h3 className="font-sans">
            <Link href={`/post/${post.slug.current}`}>
              {post.title}
            </Link>
          </h3>
          <p className="card__excerpt">{post.excerpt}</p>
          <div className="flex justify-start gap-4 my-2">
            <Link href={`/post/${post.slug.current}`}>
              <div className="cardDetailsBtn">
                View Details
              </div>
            </Link>
            <button onClick={handleShareClick} className="cardShareBtn">
              <HiOutlineShare size={20} />
            </button>
          </div>
        </div>
      </div>
      {isShareOpen && (
        <ShareModal
          post={post}
          onClose={closeShareModal}
        />
      )}
    </>
  );
}
