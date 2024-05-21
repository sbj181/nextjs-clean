import { SanityDocument } from '@sanity/types';
import { dataset, projectId } from '~/lib/sanity.api';

// Define the type for the file asset
interface FileAsset {
  asset: {
    _ref: string;
  };
}

// Utility to generate URLs for files
export const urlForFile = (source: SanityDocument | FileAsset | null | undefined): string | null => {
  if (!source || !('asset' in source) || !source.asset || !('_ref' in source.asset)) {
    return null;  // Return null if the reference is invalid
  }

  const ref = source.asset._ref;
  const [prefix, id, extension] = ref.split('-');

  if (prefix !== 'file') {
    return null;  // Return null if the reference does not have the correct prefix
  }

  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${extension}`;
};
