import Image from 'next/image';
import { motion } from 'framer-motion';
import { Draggable } from 'react-beautiful-dnd';

import { urlForImage } from '~/lib/sanity.image';
import { type Post } from '~/lib/sanity.queries';
import { formatDate } from '~/utils';

export default function Card({ post, index }: { post: Post; index: number }) {
  const imageUrl = post.mainImage ? urlForImage(post.mainImage) : null;

  return (
    <Draggable draggableId={post._id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`card w-full ${snapshot.isDragging ? 'dragging' : ''}`}
          style={provided.draggableProps.style}
        >
          <div className='px-2 py-2 bg-orange-400 rounded-t-lg dark:bg-orange-800 text-slate-50 text-sm text-center uppercase font-bold'>Blog Post</div>
          {post.mainImage ? (
            <Image
              className="card__cover"
              src={imageUrl}
              height={300}
              width={500}
              alt=""
            />
          ) : (
            <div className="card__cover--none" />
          )}
          <div className="card__container">
            <h3 className="font-sans">
              <a className="" href={`/post/${post.slug.current}`}>
                {post.title}
              </a>
            </h3>
            <p className="card__excerpt">{post.excerpt}</p>
            <p className="card__date">{formatDate(post._createdAt)}</p>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}
