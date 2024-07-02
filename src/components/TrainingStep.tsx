import React from 'react';
import { PortableText } from '@portabletext/react';
import { FiCheck } from "react-icons/fi";
import Image from 'next/image';
import Link from 'next/link';
import { urlForImage } from '~/lib/sanity.image'; // Import the urlForImage function
import { urlForFile } from '~/lib/sanity.file'; // Import the urlForFile function
import { FileAsset, ImageAsset } from '@sanity/types';


interface TrainingStepProps {
    step: {
      _id: string;
      title: string;
      description: any[];
      stepNumber: number;
      slug: { current: string };
      requiresMedia?: boolean;
      mediaType?: 'video' | 'image';
      TrainingVideoFile?: FileAsset;
      TrainingImageUrl?: ImageAsset;
      mediaTitle?: string;
      mediaCaption?: string;
      relatedResources?: {
        _id: string;
        title: string;
        slug: { current: string };
        mainImage?: ImageAsset;
      }[];
    };
    isCompleted: boolean;
    onComplete: () => void;
  }
  

const TrainingStep: React.FC<TrainingStepProps> = ({ step, isCompleted, onComplete }) => {
  const imageUrl = step.mediaType === 'image' && step.TrainingImageUrl ? urlForImage(step.TrainingImageUrl) : null;
  const videoUrl = step.mediaType === 'video' && step.TrainingVideoFile ? urlForFile(step.TrainingVideoFile) : null;

  return (
    <div key={step._id} className="mb-6 rounded-md border-2 border-blue-500 bg-blue-50 bg-opacity-5 border-opacity-50 px-6 py-8">
      <div className='mb-2 text-blue-500'><span className='font-semibold'>Training </span>- Step {step.stepNumber}</div>
      <Link href={`/training/${step.slug.current}`} passHref>
        <div className="cursor-pointer transition hover:underline text-2xl font-semibold pb-2 mb-2 block">
          {step.title}
        </div>
      </Link>
      <PortableText value={step.description} />

      <div className="media-container mt-4">
        {videoUrl && (
          <div className='w-1/2 h-auto mb-4 border border-slate-300 border-opacity-50 rounded-lg p-4 bg-slate-300 bg-opacity-10'>
            {step.mediaTitle && <h3 className='font-semibold text-lg mb-2'>{step.mediaTitle}</h3>}
            <video controls className="w-full h-auto rounded-lg">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {step.mediaCaption && <p className='text-sm mt-4 opacity-65'>{step.mediaCaption}</p>}
          </div>
        )}
        {imageUrl && (
          <div className='w-1/2 h-auto mb-4 border border-slate-300 border-opacity-50 rounded-lg p-4 bg-slate-300 bg-opacity-10'>
            {step.mediaTitle && <h3 className='font-semibold text-lg mb-2'>{step.mediaTitle}</h3>}
            <Image
              src={imageUrl}
              alt={step.title}
              width={500}
              height={300}
              className="object-cover w-full h-auto rounded-lg cursor-pointer"
            />
            {step.mediaCaption && <p className='text-sm mt-4 opacity-65'>{step.mediaCaption}</p>}
          </div>
        )}
      </div>

      {step.relatedResources && step.relatedResources.length > 0 && (
        <div className='mt-12'>
          <h3 className="text-xl font-semibold mb-4">Related Resources</h3>
          <div className="cardWrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
            {step.relatedResources.map((resource) => (
              <div key={resource._id} className="bg-slate-50 rounded-lg p-4 shadow-md">
                <Link href={`/resource/${resource.slug.current}`}>
                  <div className="cursor-pointer transition hover:underline text-lg font-semibold">{resource.title}</div>
                </Link>
                {resource.mainImage && (
                  <Image
                    src={urlForImage(resource.mainImage)}
                    alt={resource.title}
                    width={200}
                    height={120}
                    className="object-cover w-full h-auto rounded-lg mt-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className='bg-blue-500 bg-opacity-10 p-4 rounded-xl text-center'>
        <div className='mt-2'><p>Once you have reviewed the information above mark the button below to complete!</p></div>
        <button
          onClick={onComplete}
          className={`mt-4 py-4 px-8 m-auto flex justify-between items-center gap-2 rounded-full ${isCompleted ? 'bg-green-500 text-white' : 'bg-slate-500  bg-opacity-50 text-white'}`}
        >
          {isCompleted ? (
            <>
              Completed <span className='bg-slate-500 bg-opacity-25 p-1 rounded-full'><FiCheck /></span>
            </>
          ) : (
            <>
              Mark Complete 
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TrainingStep;
