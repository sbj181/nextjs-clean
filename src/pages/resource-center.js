import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Container from '~/components/Container';
import Welcome from '~/components/Welcome';
import { FiArchive, FiTrash2, FiHeart, FiEdit2 } from 'react-icons/fi';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import MediaCenter from '~/components/MediaCenter'; // Import the MediaCenter component
import Favorites from '~/components/Favorites'; // Import the Favorites component
import Modal from 'react-modal'; // Import react-modal
import { uploadImage, slugify } from '../utils'; // Import the uploadImage function

const ResourceCenter = () => {
  const [resources, setResources] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [isEditingResource, setIsEditingResource] = useState(false);
  const [editResourceId, setEditResourceId] = useState(null);
  const [isMediaCenterOpen, setIsMediaCenterOpen] = useState(false);
  const [categories, setCategories] = useState([]); // State to hold categories

  const fetchFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
  
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('resource_id')
      .eq('user_id', user.id);
  
    if (error) {
      console.error('Error fetching favorites:', error);
      return;
    }
  
    // Fetch the favorite resources based on the resource IDs
    if (favorites.length > 0) {
      const favoriteResourceIds = favorites.map(fav => fav.resource_id);
  
      const { data: favoriteResources } = await supabase
        .from('resources')
        .select('*, categories(name)')
        .in('id', favoriteResourceIds);
  
      setFavorites(favoriteResources);
    } else {
      setFavorites([]); // No favorites
    }
  };

  const fetchResources = useCallback(async () => {
    const { data, error } = await supabase
      .from('resources')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching resources:', error);
    else {
      setResources(data);
      fetchFavorites(); // Refresh favorites after fetching resources
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    if (error) console.error('Error fetching categories:', error);
    else setCategories(data);
  }, []);

  useEffect(() => {
    fetchResources();
    fetchCategories();

    const subscription = supabase
      .channel('resource-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'resources' }, (payload) => {
        setResources(prevResources => [payload.new, ...prevResources]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'resources' }, (payload) => {
        setResources(prevResources => prevResources.filter(resource => resource.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchResources, fetchCategories]);

  const handleAddResource = async () => {
    if (!title || !description || (!category && !newCategory)) return;

    let categoryId;
    if (newCategory) {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategory }])
        .select()
        .single();
      if (error) {
        console.error('Error adding new category:', error);
        alert('Error adding new category.');
        return;
      }
      categoryId = data.id;
    } else {
      categoryId = category;
    }

    let imageUrl = '';
    if (file) {
      imageUrl = await uploadImage(file);
      if (!imageUrl) return;
    }

    const slug = slugify(title);

    const { data, error } = await supabase
      .from('resources')
      .insert([{ title, description, category_id: categoryId, image_url: imageUrl, download_url: downloadUrl, slug }])
      .single();
    if (error) {
      console.error('Error adding resource:', error);
      alert('Error adding resource.');
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
      setNewCategory('');
      setDownloadUrl('');
      setFile(null);
      setIsAddingResource(false);
      alert('Resource added successfully!');
    }
  };

  const handleUpdateResource = async () => {
    if (!title || !description || (!category && !newCategory)) return;

    let categoryId;
    if (newCategory) {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategory }])
        .select()
        .single();
      if (error) {
        console.error('Error adding new category:', error);
        alert('Error adding new category.');
        return;
      }
      categoryId = data.id;
    } else {
      categoryId = category;
    }

    let imageUrl = '';
    if (file) {
      imageUrl = await uploadImage(file);
      if (!imageUrl) return;
    }

    const slug = slugify(title);

    const { error } = await supabase
      .from('resources')
      .update({ title, description, category_id: categoryId, image_url: imageUrl, download_url: downloadUrl, slug })
      .eq('id', editResourceId);
    if (error) {
      console.error('Error updating resource:', error);
      alert('Error updating resource.');
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
      setNewCategory('');
      setDownloadUrl('');
      setFile(null);
      setEditResourceId(null);
      setIsEditingResource(false);
      alert('Resource updated successfully!');
      fetchResources(); // Refresh the resources list
    }
  };

  const handleDeleteResource = async (id) => {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting resource:', error);
      alert('Error deleting resource.');
    } else {
      alert('Resource deleted successfully!');
    }
  };

  const handleFavoriteResource = async (resourceId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to favorite a resource.');
      return;
    }
  
    // Check if the resource is already favorited by this user
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('resource_id', resourceId)
      .single();
  
    if (existingFavorite) {
      // If already favorited, remove it
      await supabase
        .from('favorites')
        .delete()
        .eq('id', existingFavorite.id);
    } else {
      // Otherwise, add it
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, resource_id: resourceId });
    }
  
    // Refresh the favorites list
    fetchFavorites();
  };
  

  const handleImageSelect = (url) => {
    setFile(url);
    setIsMediaCenterOpen(false);
  };

  return (
    <Container>
      <Head>
        <title>Resource Center | CORE RMS by The Grovery</title>
        <meta name="description" content="Manage resources." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Welcome title="Resource Center" subtitle="Visit resources below. Admins may add new resources." />
      {message && <p className="mb-4 text-green-500">{message}</p>}
      {favorites.length > 0 && (
        <Favorites favorites={favorites} onRemoveFavorite={handleFavoriteResource} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {resources.map((resource) => (
          resource && (
            <div key={resource.id} className="card border-[4px] border-slate-50 flex w-full bg-slate-100 dark:bg-slate-950 h-full px-4 py-4 rounded-lg items-start min-h-[400px] overflow-auto flex-col relative">
              {resource.image_url ? (
                <div className='resourceImage h-20 w-full rounded-lg bg-slate-300 mb-4 overflow-hidden relative'>
                  <Image
                    src={resource.image_url}
                    alt={`Image for ${resource.title}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ) : (
                <div className='resourceImage h-20 text-slate-600 dark:text-slate-950 rounded-lg bg-slate-300 opacity-25 flex items-center justify-center mb-4 w-full'>
                  <FiArchive size={32} />
                </div>
              )}
              <div className="text-sm mb-2">
                <span className='bg-custom-teal px-3 bg-opacity-25 rounded-full inline-block'>{resource.categories ? resource.categories.name : 'Uncategorized'}</span>
              </div>
              <Link href={`/resource/${resource.slug}`}><h2 className="text-xl font-semibold">{resource.title}</h2></Link>
              <div className=''>
                <p className='opacity-65 min-h-32 text-sm'>{resource.description}</p>
              </div>
              <div className="flex gap-1 mt-8 absolute bottom-4">
                {resource.download_url && (
                  <a href={resource.download_url} target="_blank" rel="noopener noreferrer">
                    <button className="px-5 py-2 text-sm bg-custom-dark-blue text-white rounded-lg hover:bg-custom-blue-dark transition">
                      Download
                    </button>
                  </a>
                )}
                <button
                onClick={() => handleFavoriteResource(resource.id)}
                className={`px-3 py-2 bg-opacity-25 text-sm rounded-lg transition ${favorites.some(fav => fav.id === resource.id) ? 'bg-pink-200 text-pink-600 hover:bg-pink-100' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
                >
                <FiHeart size={18} className={favorites.some(fav => fav.id === resource.id) ? 'fill-current' : ''} />
                </button>

                
                <button
                  onClick={() => {
                    setTitle(resource.title);
                    setDescription(resource.description);
                    setCategory(resource.category_id || '');
                    setNewCategory('');
                    setDownloadUrl(resource.download_url);
                    setFile(resource.image_url);
                    setEditResourceId(resource.id);
                    setIsEditingResource(true);
                    setIsAddingResource(true);
                  }}
                  className="px-2 py-2 hover:bg-opacity-35 dark:text-slate-100 text-sm bg-opacity-25 bg-slate-100 text-custom-black rounded-lg hover:bg-slate-200 transition"
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteResource(resource.id)}
                  className="px-2 py-2 hover:bg-opacity-35 dark:text-slate-100 text-sm bg-slate-100 bg-opacity-25 text-custom-black rounded-lg hover:bg-slate-200 transition"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          )
        ))}
      </div>

      <section className='my-8 w-full flex items-center justify-center bg-slate-150 bg-opacity-25 rounded-xl'>
        {!isAddingResource ? (
          <button
            onClick={() => setIsAddingResource(true)}
            className="rounded-xl py-4 px-12 bg-custom-green dark:bg-slate-950 dark:hover:bg-slate-700 bg-opacity-50 hover:bg-opacity-100 transition"
          >
            Add New Resource
          </button>
        ) : (
          <Modal
            isOpen={isAddingResource}
            onRequestClose={() => setIsAddingResource(false)}
            style={{
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                
              },
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                zIndex: '99', // Ensure the modal is on top
              },
            }}
            contentLabel={isEditingResource ? 'Edit Resource' : 'Add New Resource'}
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-4 mt-4">{isEditingResource ? 'Edit Resource' : 'Add New Resource'}</h2>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full mb-2"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full mb-2"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full mb-2"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or Add New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full mb-2"
              />
              <input
                type="text"
                placeholder="Download URL"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                className="p-2 border border-gray-300 rounded w-full mb-2"
              />
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="p-2 border border-gray-300 rounded w-full"
                />
                <button
                  onClick={() => setIsMediaCenterOpen(true)}
                  className="px-4 py-2 text-sm leading-tight bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Media Center
                </button>
              </div>
              {file && (
                <Image
                  src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                  alt={title}
                  className="mb-2 md:w-1/4"
                  width={500}
                  height={300}
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={isEditingResource ? handleUpdateResource : handleAddResource}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  {isEditingResource ? 'Update Resource' : 'Add Resource'}
                </button>
                <button
                  onClick={() => {
                    setTitle('');
                    setDescription('');
                    setCategory('');
                    setNewCategory('');
                    setDownloadUrl('');
                    setFile(null);
                    setIsAddingResource(false);
                    setIsEditingResource(false);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
      </section>
      <MediaCenter
        isOpen={isMediaCenterOpen}
        onRequestClose={() => setIsMediaCenterOpen(false)}
        onSelectImage={handleImageSelect}
        bucketName="training-images" // Pass the bucket name as a prop
      />
    </Container>
  );
};

export default ResourceCenter;
