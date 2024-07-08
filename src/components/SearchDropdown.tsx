import { useState } from 'react';
import SearchModal from './SearchModal';

const SearchDropdown = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInitialQuery(query);
    if (query.trim() !== '') {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInitialQuery(''); // Clear the initial input when the modal is closed
  };

  return (
    <div className='hidden md:block mr-2'>
      <input
        type="text"
        placeholder="Start typing to search..."
        value={initialQuery}
        onChange={handleInputChange}
        className="w-full py-2 px-4 min-w-[320px] border border-slate-50 rounded-lg dark:bg-slate-900 dark:border-opacity-50"
      />
      {isModalOpen && <SearchModal initialQuery={initialQuery} onClose={handleCloseModal} />}
    </div>
  );
};

export default SearchDropdown;
