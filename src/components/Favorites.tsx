import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';


const Favorites = ({ favorites, onRemoveFavorite, handleDeleteResource, firstName, getButtonText }) => {
  const [loadingResourceId, setLoadingResourceId] = useState(null); // State to track loading

  const handleFavoriteClick = async (resourceId) => {
    setLoadingResourceId(resourceId); // Set loading state
    await onRemoveFavorite(resourceId); // Perform the action
    setLoadingResourceId(null); // Clear loading state
  };

  return (
    <section className="relative mb-6 pb-6">
      <div className="relative border border-opacity-15 dark:border-opacity-15 border-slate-300 z-10 bg-gradient-to-tl dark:bg-gradient-to-tl from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-lg p-4">
        <h2 className="text-2xl text-center font-bold mb-4">
          {firstName ? `${firstName}'s Favorite Resources` : 'Your Favorite Resources'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.length > 0 ? (
            favorites.map((resource) => (
              <div key={resource.id} className="card border-[4px] border-slate-50 flex w-full bg-slate-100 dark:bg-slate-950 h-full px-4 py-4 rounded-t-lg items-start min-h-[400px] overflow-auto flex-col relative">
                {loadingResourceId === resource.id ? (
                  <div className="animate-pulse w-full h-20 bg-slate-300 dark:bg-slate-800 rounded-lg mb-4"></div>
                ) : resource.image_url ? (
                  <div className="resourceImage h-20 w-full rounded-lg bg-slate-300 mb-4 overflow-hidden relative">
                    <Link className='hover:opacity-75 transition' href={`/resource/${resource.slug}`}>
                        <Image
                        src={resource.image_url}
                        alt={`Image for ${resource.title}`}
                        layout="fill"
                        objectFit="cover"
                        />
                    </Link>
                  </div>
                ) : (
                    <Link className='hover:opacity-75 transition w-full' href={`/resource/${resource.slug}`}> 
                        <div className="resourceImage h-20 text-pink-600 dark:text-slate-950 rounded-lg bg-pink-300 opacity-25 flex items-center justify-center mb-4 w-full">
                            <FiHeart size={32} />
                        </div>
                    </Link>
                )}
                <div className="text-sm mb-2">
                  <span className="bg-custom-teal px-3 bg-opacity-25 rounded-full inline-block">
                    {resource.categories ? resource.categories.name : 'Uncategorized'}
                  </span>
                </div>
                <Link className='hover:opacity-75 transition' href={`/resource/${resource.slug}`}>
                  <h2 className="text-xl font-semibold">{resource.title}</h2>
                </Link>
                <div className="">
                  <p className="opacity-65 min-h-32 text-sm">{resource.description}</p>
                </div>
                <div className="flex gap-1 mt-8 absolute bottom-4">
                  {resource.download_url && (
                    <a href={resource.download_url} target="_blank" rel="noopener noreferrer">
                      <button className="px-4 py-2 text-sm bg-custom-blue text-white rounded-lg hover:bg-custom-blue-dark transition">
                        {getButtonText(resource.categories ? resource.categories.name : '')}
                      </button>
                    </a>
                  )}
                  <button
                    onClick={() => handleFavoriteClick(resource.id)}
                    className="px-3 py-2 text-sm bg-pink-100 text-pink-600 dark:bg-slate-700 bg-opacity-25 rounded-lg hover:bg-pink-200 transition"
                    disabled={loadingResourceId === resource.id} // Disable button while loading
                  >
                    {loadingResourceId === resource.id ? (
                      <div className="w-5 h-5 rounded-full border-2 border-pink-600 border-t-transparent animate-spin"></div>
                    ) : (
                      <FiHeart size={18} className="fill-current" />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No favorites yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Favorites;
