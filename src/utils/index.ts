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
