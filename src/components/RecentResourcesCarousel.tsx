import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from 'next/link';
import Image from 'next/image';
import { FiArchive, FiHeart } from 'react-icons/fi';

const RecentResourcesCarousel = ({ resources = [], favorites = [], handleFavoriteResource, loadingFavoriteId }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 1,
    align: 'start',
    skipSnaps: true,
    loop: false,
    containScroll: 'trimSnaps',
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect(); // Run on mount to set initial state
  }, [emblaApi, onSelect]);

  return (
    <div className="embla relative">
      <div className={`h-full z-20 -left-3 bg-gradient-to-r from-25% from-slate-50 dark:from-slate-900 to-transparent flex items-center absolute transition-opacity ${prevBtnEnabled ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <button onClick={scrollPrev} className="embla__prev transition text-custom-teal hover:text-custom-teal-dark p-2 bg-custom-teal bg-opacity-0 hover:bg-opacity-35 h-8 w-8 flex rounded-full">
          <FiChevronLeft />
        </button>
      </div>
      <div className={`h-full z-20 -right-3 bg-gradient-to-l from-25% from-slate-50 dark:from-slate-900 to-transparent flex items-center absolute transition-opacity ${nextBtnEnabled ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <button onClick={scrollNext} className="embla__next transition text-custom-teal hover:text-custom-teal-dark p-2 bg-custom-teal bg-opacity-0 hover:bg-opacity-35 h-8 w-8 flex rounded-full">
          <FiChevronRight />
        </button>
      </div>
      <div className="embla__viewport overflow-x-clip" ref={emblaRef}>
        <div className="embla__container">
          {resources.map((resource) => (
            <div className="embla__slide px-2 first:pl-0 last:pr-0 flex-[0_0_90%] sm:flex-[0_0_44%] md:flex-[0_0_31%] lg:flex-[0_0_28%] 2xl:flex-[0_0_22%]" key={resource.id}>
              <div className="card border-[4px] border-slate-50 flex w-full bg-slate-100 dark:bg-slate-950 h-full px-4 py-4 rounded-lg items-start min-h-[400px] min-w-[14em] overflow-auto flex-col relative">
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
                    <FiArchive size={32} />
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
                    onClick={() => handleFavoriteResource(resource.id)}
                    className={`px-3 py-2 bg-opacity-25 text-sm rounded-lg transition ${favorites.some(fav => fav.id === resource.id) ? 'bg-pink-200 text-pink-600 hover:bg-pink-100' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
                    disabled={loadingFavoriteId === resource.id} // Disable button while loading
                  >
                    {loadingFavoriteId === resource.id ? (
                      <div className="w-5 h-5 rounded-full border-2 border-pink-600 border-t-transparent animate-spin"></div>
                    ) : (
                      <FiHeart size={18} className={favorites.some(fav => fav.id === resource.id) ? 'fill-current' : ''} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentResourcesCarousel;
