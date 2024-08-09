import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { supabase } from '~/lib/supabaseClient';
import { uploadImage, slugify } from '~/utils';
import Image from 'next/image';

const EditResourceModal = ({ isOpen, onRequestClose, resource, categories, fetchResources }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [file, setFile] = useState(null);
  const [isEditingResource, setIsEditingResource] = useState(false);
  const [editResourceId, setEditResourceId] = useState(null);
  const [isMediaCenterOpen, setIsMediaCenterOpen] = useState(false);

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setDescription(resource.description);
      setCategory(resource.category_id || '');
      setNewCategory('');
      setDownloadUrl(resource.download_url);
      setFile(resource.image_url);
      setEditResourceId(resource.id);
      setIsEditingResource(true);
    }
  }, [resource]);

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
  
    const newSlug = slugify(title);
    const { data, error } = await supabase
      .from('resources')
      .update({ title, description, category_id: categoryId, image_url: imageUrl, download_url: downloadUrl, slug: newSlug })
      .eq('id', editResourceId)
      .select()
      .single();
  
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
      
      // Redirect if the slug has changed
      if (newSlug !== resource.slug) {
        window.location.href = `/resource/${newSlug}`;
      } else {
        fetchResources(); // Refresh the resources list
        onRequestClose();
      }
    }
  };
  

  const handleImageSelect = (url) => {
    setFile(url);
    setIsMediaCenterOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
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
          zIndex: '99',
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
            onClick={handleUpdateResource}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Update Resource
          </button>
          <button
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditResourceModal;
