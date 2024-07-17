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
        <FiSearch className="h-6 w-6" />
      </button>
      {isModalOpen && <SearchModal initialQuery="" onClose={handleCloseModal} />}
    </>
  );
};

export default SearchButton;
