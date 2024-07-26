import Modal from 'react-modal';
import Image from 'next/image';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
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
      <div className="flex flex-col items-center">
        <Image src={src} alt={alt} width={800} height={600} />
        <button onClick={onRequestClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ImageModal;
