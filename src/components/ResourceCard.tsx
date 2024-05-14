import Image from 'next/image';
import { motion } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';

import { urlForImage } from '~/lib/sanity.image';
import { type Resource } from '~/lib/sanity.queries';
import { formatDate } from '~/utils';

export default function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const imageUrl = resource.mainImage ? urlForImage(resource.mainImage) : null;

  return (
    <Draggable draggableId={resource._id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`card w-full bg-slate-100 dark:bg-slate-950 ${snapshot.isDragging ? 'dragging' : ''}`}
          style={provided.draggableProps.style}
        >
          <div className='px-2 py-2 rounded-t-lg bg-green-400 dark:bg-green-800 text-slate-50 text-sm text-center uppercase font-bold'>Resource</div>
          {resource.mainImage ? (
            <Image
              className="card__cover"
              src={imageUrl}
              height={300}
              width={500}
              alt=""
            />
          ) : (
            <div className="cardEmpty h-[220px] bg-slate-300 dark:bg-slate-950 block" />
          )}
          <div className="card__container">
            <h3 className="">
              <a className="" href={`/resource/${resource.slug.current}`}>
                {resource.title}
              </a>
            </h3>
            <p className="resource__excerpt py-2">{resource.description}</p>
            <div className="flex justify-start gap-4 my-2">
              <a
                href={`/resource/${resource.slug.current}`}
                className="bg-blue-500 hover:bg-blue-700 text-sm text-white font-bold py-3 px-8 rounded-lg"
              >
                View Details
              </a>
              {resource.BMSResourceLink && (
                <a
                  href={resource.BMSResourceLink}
                  className="bg-red-500 hover:bg-red-700 text-sm text-white font-bold py-3 px-8 rounded-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Direct Download
                </a>
              )}
            </div>
            <p className="card__date">{formatDate(resource._createdAt)}</p>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}
