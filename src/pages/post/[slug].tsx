import { PortableText } from '@portabletext/react'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import { useLiveQuery } from 'next-sanity/preview'

import Container from '~/components/Container'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { urlForImage } from '~/lib/sanity.image'
import {
  getPost,
  type Post,
  postBySlugQuery,
  postSlugsQuery,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'
import { formatDate } from '~/utils'

interface Query {
  [key: string]: string
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    post: Post
  },
  Query
> = async ({ draftMode = false, params = {} }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const post = await getPost(client, params.slug)

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      post,
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}

export default function ProjectSlugRoute(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [post] = useLiveQuery(props.post, postBySlugQuery, {
    slug: props.post.slug.current,
  })

  const imageUrl = post.mainImage ? urlForImage(post.mainImage) : null;

  return (
    <Container>
      <section className="post">
        {post.mainImage ? (
          <div className='rounded-lg block overflow-hidden'>
          <Image
            className="post__cover"
            src={imageUrl}
            height={600}
            width={1000}
            alt=""
          />
          </div>
        ) : (
          <div className="post__cover--none" />
        )}
        <div className="post__container">
        

          <h1 className="post__title">{post.title}</h1>
          {/* <p className="post__excerpt">{post.excerpt}</p> */}
          <p className="post__date">{formatDate(post._createdAt)}</p>
          <div className="post__content">
            <PortableText value={post.body} />
          </div>
        </div>
      </section>
    </Container>
  )
}

export const getStaticPaths = async () => {
  const client = getClient()
  const slugs = await client.fetch(postSlugsQuery)

  return {
    paths: slugs?.map(({ slug }) => `/post/${slug}`) || [],
    fallback: 'blocking',
  }
}
