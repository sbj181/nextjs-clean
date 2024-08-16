import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from 'next/link';
import ProgressBar from '~/components/ProgressBar';
import SkeletonLoader from '~/components/SkeletonLoader'; // Import SkeletonLoader

const TrainingProgressCarousel = ({ trainings = [], isLoading }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        slidesToScroll: 1,
        align: 'start',
        skipSnaps: true,
        loop: false,
        containScroll: 'trimSnaps',
    });

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

    const slugify = (text) => {
        return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    };

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
            <div className={`h-full  z-20 -left-3 bg-gradient-to-r from-25% from-slate-50 dark:from-slate-900 to-transparent flex items-center absolute transition-opacity ${prevBtnEnabled ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <button onClick={scrollPrev} className="embla__prev transition text-custom-teal hover:text-custom-teal-dark p-2 bg-custom-teal bg-opacity-0 hover:bg-opacity-35 h-8 w-8 flex rounded-full">
                    <FiChevronLeft />
                </button>
            </div>
            <div className={`h-full  z-20 -right-3 bg-gradient-to-l from-25% from-slate-50 dark:from-slate-900 to-transparent flex items-center absolute transition-opacity ${nextBtnEnabled ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <button onClick={scrollNext} className="embla__next transition text-custom-teal hover:text-custom-teal-dark p-2 bg-custom-teal bg-opacity-0 hover:bg-opacity-35 h-8 w-8 flex rounded-full">
                    <FiChevronRight />
                </button>
            </div>
            <div className="embla__viewport overflow-x-clip" ref={emblaRef}>
                <div className="embla__container">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, index) => <SkeletonLoader key={index} />)
                        : trainings.map((training) => (
                            <div className="embla__slide px-2 first:pl-0 last:pr-0 flex-[0_0_90%] sm:flex-[0_0_50%] md:flex-[0_0_22%]" key={training.id}>
                                <div className="card border-[4px] border-slate-50 flex w-full bg-slate-100 dark:bg-slate-950 h-full px-4 py-4 rounded-lg items-start min-h-[150px] min-w-[14em] overflow-auto flex-col relative">
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
