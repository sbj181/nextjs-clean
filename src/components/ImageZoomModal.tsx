import Image from 'next/image';
import React from 'react';
import { HiOutlineX } from 'react-icons/hi';

interface ImageZoomModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-75 z-50 flex justify-center items-center" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 p-4 rounded-lg w-full mx-4 max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <button onClick={onClose} className="text-slate-500">
            <HiOutlineX className="h-6 w-6" />
          </button>
        </div>
        <div className="flex justify-center">
          <Image
            src={imageUrl}
            alt="Zoomed Image"
            width={1000}
            height={600}
            className="object-cover w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageZoomModal;
