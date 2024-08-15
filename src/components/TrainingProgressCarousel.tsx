import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import Link from 'next/link';
import ProgressBar from '~/components/ProgressBar';

const TrainingProgressCarousel = ({ trainings = [] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        slidesToScroll: 1, // Scroll one slide at a time
        align: 'start', // Align the first visible slide at the start
        loop: false, // Set to true if you want continuous scrolling
        containScroll: 'trimSnaps', // Prevent sliding past the first/last slide
    });

  const slugify = (text) => {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };

 // Handlers for next and previous buttons
 const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  return (
    <div className="embla relative">
        <div className='h-full -left-3 flex items-center absolute'>
            <button onClick={scrollPrev} className="embla__prev transition text-custom-teal hover:text-custom-teal-dark p-2 bg-custom-teal bg-opacity-0 h-8 w-8 flex rounded-full z-10"><FiChevronLeft /></button>
        </div>
        <div className='h-full flex -right-3 items-center absolute'>
            <button onClick={scrollNext} className="embla__prev transition text-custom-teal hover:text-custom-teal-dark p-2 bg-custom-teal bg-opacity-0 h-8 w-8 flex rounded-full z-10"><FiChevronRight /></button>
        </div>
        <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
            {trainings.map((training) => (
                <div className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_25%]" key={training.id}>
                <div className="card border-[4px] border-slate-50 flex w-full bg-slate-100 dark:bg-slate-950 h-full px-4 py-4 rounded-lg items-start min-h-[150px] overflow-auto flex-col relative">
                    <div className='flex flex-col flex-1 justify-between h-full w-full'>
                    <h3 className="!text-xl mb-2 !leading-snug min-h-12 font-semibold text-center">
                        {training.title}
                    </h3>
                    <div className="flex-1 min-h-12 flex flex-col justify-center text-center">
                        <ProgressBar percentage={training.progressPercentage} />
                        {training.progressPercentage < 100 && (
                        <div className='mt-2 text-sm text-center'>
                            <p>{training.completedSteps} out of {training.totalSteps} steps completed</p>
                        </div>
                        )}
                    </div>
                    <Link href={`/training/${slugify(training.title)}`} passHref>
                        <button className="mt-4 px-4 py-2 text-sm bg-custom-blue text-white rounded-lg hover:bg-custom-blue-dark transition">
                        Continue Training
                        </button>
                    </Link>
                    </div>
                </div>
                
    
                </div>
            ))}
            </div>
            
        </div>
        
    </div>
  );
};

export default TrainingProgressCarousel;
