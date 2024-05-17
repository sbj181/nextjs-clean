import type { PortableTextBlock } from '@portabletext/types';
import type { ImageAsset, Slug } from '@sanity/types';
import groq from 'groq';
import { type SanityClient } from 'next-sanity';

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`;

export async function getPosts(client: SanityClient): Promise<Post[]> {
  return await client.fetch(postsQuery);
}

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]`;

export async function getPost(client: SanityClient, slug: string): Promise<Post> {
  return await client.fetch(postBySlugQuery, { slug });
}

export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)][].slug.current`;

export interface Post {
  _type: 'post';
  _id: string;
  _createdAt: string;
  title?: string;
  slug: Slug;
  excerpt?: string;
  mainImage?: ImageAsset;
  body: PortableTextBlock[];
}

export const resourcesQuery = groq`
*[_type == "resource" && defined(slug.current)] | order(_createdAt desc) [0...20] {
  _id,
  _createdAt,
  title,
  slug,
  description,
  longDescription,
  mainImage,
  resourceType,
  "tags": tags[]->{
    _id,
    title
  },
  viewDetailsButtonText,
  shareButtonText,
  resourceDetailsLink,
  author,
  lastModified,
  BMSResourceLink,
  PfizerResourceLink,
  "RelatedResources": {
    "tags": tags[]->{
      _id,
      title
    },
    titles
  }
}`;

export async function getResources(client: SanityClient): Promise<Resource[]> {
  return await client.fetch(resourcesQuery);
}

export const resourceBySlugQuery = groq`*[_type == "resource" && slug.current == $slug][0]`;

export async function getResource(client: SanityClient, slug: string): Promise<Resource> {
  return await client.fetch(resourceBySlugQuery, { slug });
}

export const resourceSlugsQuery = groq`*[_type == "resource" && defined(slug.current)][].slug.current`;

export interface Resource {
  _type: 'resource';
  _id: string;
  _createdAt: string;
  title: string;
  slug: Slug;
  description?: string;
  longDescription?: PortableTextBlock[];
  mainImage?: ImageAsset;
  resourceType?: string;
  tags?: { _id: string; title: string }[];
  viewDetailsButtonText?: string;
  shareButtonText?: string;
  resourceDetailsLink?: string;
  author?: string;
  lastModified?: string;
  BMSResourceLink?: string;
  PfizerResourceLink?: string;
  RelatedResources?: {
    tags?: { _id: string; title: string }[];
    titles?: string[];
  };
}
