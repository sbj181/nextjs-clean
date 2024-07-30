import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FiX, FiCheck } from 'react-icons/fi';
import Image from 'next/image';

const MediaCenter = ({ isOpen, onRequestClose, onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchImages = async () => {
        const { data, error } = await supabase.storage
          .from('training-images')
          .list();

        if (error) {
          console.error('Error fetching images:', error);
        } else {
          setImages(data);
        }
      };

      fetchImages();
    }
  }, [isOpen]);

  const handleImageClick = (url) => {
    setSelectedImage(url);
    onSelectImage(url);
  };

  const imageLoader = ({ src }) => {
    return src;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed max-h-screen w-screen inset-0 bg-slate-900 bg-opacity-75 z-[9999] flex justify-center items-start" onClick={onRequestClose}>
      <div className="bg-white dark:bg-slate-800 p-4 mt-4 rounded-lg w-3/4 h-screen overflow-auto mx-4 max-w-screen" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Media Center</h2>
          <button onClick={onRequestClose} className="text-slate-500">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 overflow-auto">
          {images.map((image) => (
            <div key={image.name} className="relative cursor-pointer bg-slate-100 dark:bg-slate-800" onClick={() => handleImageClick(`https://nimjgfnsewiwhahvelsw.supabase.co/storage/v1/object/public/training-images/${image.name}`)}>
              <Image
                loader={imageLoader}
                src={`https://nimjgfnsewiwhahvelsw.supabase.co/storage/v1/object/public/training-images/${image.name}`}
                alt={image.name}
                width={300}
                height={300}
                className="object-cover"
              />
              {selectedImage === `https://nimjgfnsewiwhahvelsw.supabase.co/storage/v1/object/public/training-images/${image.name}` && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <FiCheck className="text-white h-8 w-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaCenter;
