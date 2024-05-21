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
  if (!source) {
    return null;  // Return null if the source is invalid
  }

  // Check if source has the asset property and asset has _ref property
  if ((source as FileAsset).asset && '_ref' in (source as FileAsset).asset) {
    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${(source as FileAsset).asset._ref}`;
  }

  return null;
};
