// pages/resource/[slug].tsx

import { GetServerSideProps } from 'next';
import { supabase } from '~/lib/supabaseClient';
import Container from '~/components/Container';
import { useRouter } from 'next/router';
import { FiHeart, FiTrash2, FiEdit2 } from 'react-icons/fi';
import Image from 'next/image';

const ResourcePage = ({ resource }) => {
  const router = useRouter();
  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-3xl font-bold mb-4">{resource.title}</h1>
        {resource.image_url && (
          <div className='resourceImage w-full max-w-md rounded-lg mb-4 overflow-hidden relative'>
            <Image
              src={resource.image_url}
              alt={`Image for ${resource.title}`}
              layout="responsive"
              width={800}
              height={450}
            />
          </div>
        )}
        <p className="text-lg mb-4">{resource.description}</p>
        <div className="text-sm mb-4">
          Category: <span className='bg-custom-teal px-3 bg-opacity-25 rounded-full inline-block'>{resource.category ? resource.category.name : 'Uncategorized'}</span>
        </div>
        {resource.download_url && (
          <a href={resource.download_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-custom-blue text-white rounded-lg hover:bg-custom-blue-dark transition">
            Download
          </a>
        )}
      </div>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params;
  const { data, error } = await supabase
    .from('resources')
    .select('*, categories(name)')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching resource:', error);
    return {
      notFound: true,
    };
  }

  return {
    props: {
      resource: data,
    },
  };
};

export default ResourcePage;
