import { PortableText } from '@portabletext/react'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import { useLiveQuery } from 'next-sanity/preview'

import Container from '~/components/Container'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { urlForImage } from '~/lib/sanity.image'
import {
  getResource,
  type Resource,
  resourceBySlugQuery,
  resourceSlugsQuery,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'
import { formatDate } from '~/utils'

interface Query {
  [key: string]: string
}

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    resource: Resource
  },
  Query
> = async ({ draftMode = false, params = {} }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const resource = await getResource(client, params.slug)

  if (!resource) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      resource,
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}

export default function ResourceSlugRoute(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [resource] = useLiveQuery(props.resource, resourceBySlugQuery, {
    slug: props.resource.slug.current,
  })

  const imageUrl = resource.mainImage ? urlForImage(resource.mainImage) : null;

  return (
    <Container>
      <section className="resource">
        {resource.mainImage ? (
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
          <div className="resource__cover--none" />
        )}
        <div className="resource__container">
          <h1 className="resource__title">{resource.title}</h1>
          <p className="resource__description">{resource.description}</p>
          <p className="resource__date">{formatDate(resource._createdAt)}</p>
          {resource.longDescription && (
            <div className="resource__content">
              <PortableText value={resource.longDescription} />
            </div>
          )}
        </div>
      </section>
    </Container>
  )
}


export const getStaticPaths = async () => {
  const client = getClient()
  const slugs = await client.fetch(resourceSlugsQuery)

  return {
    paths: slugs?.map(({ slug }) => `/resource/${slug}`) || [],
    fallback: 'blocking',
  }
}
