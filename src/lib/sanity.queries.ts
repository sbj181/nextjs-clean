import type { PortableTextBlock } from '@portabletext/types';
import type { ImageAsset, Slug, FileAsset } from '@sanity/types';
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
  resourceKind,
  fileUpload,
  fileShareURL,
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

export const getResourceByIds = async (client, ids) => {
  const query = groq`*[_type == "resource" && _id in $ids]{
    _id,
    title,
    mainImage,
    slug,
    description,
    resourceKind,
    fileUpload,
    fileShareURL,
    BMSResourceLink,
    _createdAt,
    tags[]->{
      _id,
      title
    }
  }`;
  return await client.fetch(query, { ids });
};

export const resourceBySlugQuery = groq`*[_type == "resource" && slug.current == $slug][0]{
  _id,
  _createdAt,
  title,
  slug,
  description,
  longDescription,
  mainImage,
  resourceType,
  resourceKind,
  fileUpload,
  fileShareURL,
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
  resourceKind?: string;
  fileUpload?: FileAsset;
  fileShareURL?: string;
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

// Training queries
export const trainingsQuery = groq`
*[_type == "training"] | order(_createdAt desc) {
  _id,
  title,
  "steps": steps[]-> {
    _id,
    title,
    description,
    stepNumber,
    slug,
    requiresMedia,
    mediaType,
    TrainingVideoFile,
    TrainingImageUrl,
    mediaTitle,
    mediaCaption,
    "relatedResources": relatedResources[]->{
      _id,
      _createdAt,
      title,
      slug,
      description,
      mainImage,
      resourceKind,
      fileUpload,
      BMSResourceLink,
      fileShareURL,
      "tags": tags[]->{
        _id,
        title
      }
    }
  }
}`;

export async function getTrainings(client: SanityClient): Promise<Training[]> {
  return await client.fetch(trainingsQuery);
}

// Training Step queries
export const trainingStepBySlugQuery = groq`
  *[_type == "trainingStep" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    slug,
    stepNumber,
    description,
    requiresMedia,
    mediaType,
    TrainingVideoFile,
    TrainingImageUrl,
    mediaTitle,
    mediaCaption,
    "parentTraining": *[_type == "training" && references(^._id)]{title}[0],
    "relatedResources": relatedResources[]->{
      _id,
      _createdAt,
      title,
      slug,
      description,
      mainImage,
      resourceKind,
      fileUpload,
      BMSResourceLink,
      fileShareURL,
      "tags": tags[]->{
        _id,
        title
      }
    }
  }
`;

export async function getTrainingStep(client: SanityClient, slug: string): Promise<TrainingStep> {
  return await client.fetch(trainingStepBySlugQuery, { slug });
}

export interface Training {
  _type: 'training';
  _id: string;
  title: string;
  steps: TrainingStep[];
}

export interface TrainingStep {
  _type: 'trainingStep';
  _id: string;
  title: string;
  description: PortableTextBlock[];
  stepNumber: number;
  slug: Slug;
  requiresMedia?: boolean;
  mediaType?: 'video' | 'image';
  TrainingVideoFile?: FileAsset;
  TrainingImageUrl?: ImageAsset;
  mediaTitle?: string;
  mediaCaption?: string;
  parentTraining?: {
    title: string;
  };
  relatedResources?: Resource[];
}

// Combined search query
export const searchQuery = groq`
  *[
    _type == "resource" || _type == "trainingStep"
  ] {
    _id,
    title,
    _type,
    "slug": slug.current,
    "tags": tags[]->title,
    mainImage
  } | order(_type asc, title asc)
`;

export async function searchItems(client: SanityClient): Promise<SearchItem[]> {
  return await client.fetch(searchQuery);
}

export interface SearchItem {
  _id: string;
  title: string;
  _type: 'resource' | 'trainingStep';
  slug: string;
  tags?: string[];
  mainImage?: ImageAsset;  // Ensure this is included in the interface
}