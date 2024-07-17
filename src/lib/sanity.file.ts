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
  if (!source || !('asset' in source) || typeof source.asset !== 'object' || !('_ref' in source.asset)) {
    return null;  // Return null if the reference is invalid
  }

  const assetRef = (source.asset as { _ref: string })._ref;
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetRef.split('-').slice(1).join('.')}`;
};
