import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import SearchModal from './SearchModal';

const SearchButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={handleOpenModal} className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg md:hidden">
        <FiSearch className="xs:h-5 xs:h-5 sm:h-6 sm:w-6" />
      </button>
      {isModalOpen && <SearchModal initialQuery="" onClose={handleCloseModal} />}
    </>
  );
};

export default SearchButton;
