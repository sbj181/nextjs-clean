import { supabase } from '../lib/supabaseClient';

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export const uploadImage = async (file: File | string): Promise<string | null> => {
  if (typeof file === 'string') {
    return file; // If the file is already a URL, just return it.
  }

  if (!file) {
    console.error('No file provided for upload.');
    return null;
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('training-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    alert('Error uploading image.');
    return null;
  }

  // Get the public URL
  const { data } = supabase.storage
    .from('training-images')
    .getPublicUrl(filePath);

  if (!data) {
    console.error('Error getting public URL');
    alert('Error getting public URL.');
    return null;
  }

  console.log('Public URL:', data.publicUrl); // Log the public URL for debugging

  return data.publicUrl;
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

// Add role-based helper function
export const isAdmin = (role: string): boolean => {
  return role === 'admin';
};

export const isUser = (role: string): boolean => {
  return role === 'user';
};