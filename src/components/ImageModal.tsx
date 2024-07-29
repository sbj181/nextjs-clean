import Modal from 'react-modal';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    backgroundColor: 'transparent',
    transform: 'translate(-50%, -50%)',
    border: '0',
    padding:'0',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Custom background color for the overlay
    zIndex: 9999,
  },
};

Modal.setAppElement('#__next');

const ImageModal = ({ isOpen, onRequestClose, src, alt }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Enlarged Image"
    >
      <div className="flex flex-col items-center ">
        <div className='flex w-full justify-end'>
            <button onClick={onRequestClose} className="mt-4 mb-4 pl-2 pr-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-1 ">
            <FiX /> Close
            </button>
        </div>
        <Image src={src} alt={alt} width={800} height={600} />
        
      </div>
    </Modal>
  );
};

export default ImageModal;
