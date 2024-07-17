import { supabase } from '../lib/supabaseClient';

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export const uploadImage = async (file: File): Promise<string | null> => {
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

  const { data: urlData, error: urlError } = await supabase.storage
    .from('training-images')
    .createSignedUrl(filePath, 60 * 60); // 1-hour expiry

  if (urlError) {
    console.error('Error getting signed URL:', urlError);
    alert('Error getting signed URL.');
    return null;
  }

  console.log('Signed URL:', urlData.signedUrl); // Log the signed URL for debugging

  return urlData.signedUrl;
};