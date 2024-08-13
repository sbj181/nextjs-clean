import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { supabase } from '~/lib/supabaseClient';
import Link from 'next/link';
import Container from '~/components/Container';
import { useRouter } from 'next/router';
import { FiEdit2, FiArrowLeft } from 'react-icons/fi';
import Image from 'next/image';
import EditResourceModal from '~/components/EditResourceModal';
import { isAdmin } from '~/utils';

const ResourcePage = ({ resource, categories }) => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
        } else if (profile && profile.role) {
          setUserRole(profile.role);
        }
      }
    };

    fetchUserRole();
  }, []);

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
          Category: <span className='bg-custom-teal px-3 bg-opacity-25 rounded-full inline-block'>{resource.categories ? resource.categories.name : 'Uncategorized'}</span>
        </div>
        <div className='flex gap-4 items-center mt-4'>
          {resource.download_url && (
            <a href={resource.download_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-custom-blue text-white rounded-lg hover:bg-custom-blue-dark transition">
              Download
            </a>
          )}
          {userRole && isAdmin(userRole) && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-gray-500 flex items-center gap-2 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <FiEdit2 size={18} /> Edit Resource
            </button>
          )}
        </div>
      </div>

      <div className='flex rounded-xl p-10 justify-center items-center mt-4'>
        <Link href="/resource-center">
          <button className="rounded-xl py-4 px-12 bg-slate-300 dark:bg-slate-950 dark:hover:bg-slate-700 bg-opacity-50 hover:bg-opacity-100 transition gap-2 flex items-center">
            <FiArrowLeft />  Back to Resource Center
          </button>
        </Link>
      </div>

      <EditResourceModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        resource={resource}
        categories={categories}
        fetchResources={() => router.replace(router.asPath)} // Reload the page after editing
      />
      
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

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching resource:', error);
    return {
      notFound: true,
    };
  }

  return {
    props: {
      resource: data,
      categories,
    },
  };
};

export default ResourcePage;
