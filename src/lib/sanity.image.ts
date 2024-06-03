import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';

import { dataset, projectId } from '~/lib/sanity.api';

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

export const urlForImage = (source: Image | undefined) => {
  if (!source?.asset?._ref) {
    return null;  // Return null if the reference is invalid
  }

  return imageBuilder.image(source).auto('format').url();
};