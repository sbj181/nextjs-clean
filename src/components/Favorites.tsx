// components/Favorites.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {  FiHeart } from 'react-icons/fi';

const Favorites = ({ favorites, onRemoveFavorite, handleDeleteResource }) => {
  return (
    <section className="mb-6 border-b border-dashed pb-6">
      <h2 className="text-2xl font-bold mb-4">Favorited Resources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((resource) => (
          <div key={resource.id} className="card border-[4px] border-slate-50 flex w-full bg-slate-100 dark:bg-slate-950 h-full px-4 py-4 rounded-lg items-start min-h-[400px] overflow-auto flex-col relative">
            {resource.image_url ? (
              <div className='resourceImage h-20 w-full rounded-lg bg-slate-300 mb-4 overflow-hidden relative'>
                <Image
                  src={resource.image_url}
                  alt={`Image for ${resource.title}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className='resourceImage h-20 text-slate-600 dark:text-slate-950 rounded-lg bg-slate-300 opacity-25 flex items-center justify-center mb-4 w-full'>
                <FiHeart size={32} />
              </div>
            )}
            <div className="text-sm mb-2">
              <span className='bg-custom-teal px-3 bg-opacity-25 rounded-full inline-block'>{resource.categories ? resource.categories.name : 'Uncategorized'}</span>
            </div>
            <Link href={`/resource/${resource.slug}`}><h2 className="text-xl font-semibold">{resource.title}</h2></Link>
            <div className=''>
              <p className='opacity-65 min-h-32 text-sm'>{resource.description}</p>
            </div>
            <div className="flex gap-1 mt-8 absolute bottom-4">
              {resource.download_url && (
                <a href={resource.download_url} target="_blank" rel="noopener noreferrer">
                  <button className="px-4 py-2 text-sm bg-custom-blue text-white rounded-lg hover:bg-custom-blue-dark transition">
                    Download
                  </button>
                </a>
              )}
              <button
                onClick={() => onRemoveFavorite(resource.id)}
                className="px-3 py-2 text-sm bg-pink-100 text-pink-600 dark:bg-slate-700 bg-opacity-25 rounded-lg hover:bg-pink-200 transition"
              >
                <FiHeart size={18} className="fill-current" />
              </button>
             
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Favorites;
