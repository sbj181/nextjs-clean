import Link from 'next/link'
import Image from 'next/image'

import { urlForImage } from '~/lib/sanity.image'
import { type Post } from '~/lib/sanity.queries'
import { formatDate } from '~/utils'

export default function Card({ post }: { post: Post }) {

  const imageUrl = post.mainImage ? urlForImage(post.mainImage) : null;

  return (
    <div className="card w-full">
      <div className='px-2 py-2 bg-orange-400 rounded-t-lg dark:bg-orange-800 text-slate-50 text-sm text-center uppercase font-bold'>Blog Post</div>
      {post.mainImage ? (
        <div className="cardImg"><Image
        className="card__cover"
        src={imageUrl}
        height={300}
        width={500}
        alt=""
      /></div>
      ) : (
        <div className="card__cover--none" />
      )}
      <div className="card__container">
        <h3 className="font-sans">
          <Link href={`/post/${post.slug.current}`}>
            {post.title}
          </Link>
        </h3>
        <p className="card__excerpt">{post.excerpt}</p>
        <p className="card__date">{formatDate(post._createdAt)}</p>
      </div>
    </div>
  )
}
