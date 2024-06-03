import React, { useEffect, useState, useRef } from 'react';
import { FiX, FiBookOpen, FiFileText } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { SearchItem, searchItems } from '~/lib/sanity.queries';
import { getClient } from '~/lib/sanity.client';
import { urlForImage } from '~/lib/sanity.image';

interface SearchModalProps {
  initialQuery: string;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ initialQuery, onClose }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
  const [allItems, setAllItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      const client = getClient();
      const items = await searchItems(client);
      setAllItems(items);
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems([]);
      return;
    }

    const lowerCasedQuery = searchQuery.toLowerCase();
    const filtered = allItems.filter((item) =>
      item.title.toLowerCase().includes(lowerCasedQuery) ||
      item.tags?.some(tag => tag.toLowerCase().includes(lowerCasedQuery))
    );

    setFilteredItems(filtered);
  }, [searchQuery, allItems]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-75 z-50 flex justify-center items-center" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 p-4 rounded-lg w-full mx-4 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Search</h2>
          <button onClick={onClose} className="text-slate-500">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for resources or training steps..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-slate-50 rounded-lg dark:bg-slate-900 dark:border-opacity-50 mb-4"
        />
        {filteredItems.length > 0 && (
          <ul className="w-full bg-slate-50 dark:bg-slate-950 border border-opacity-25 rounded-lg max-h-[300px] overflow-y-auto">
            {filteredItems.map((item) => (
              <li key={item._id} className="border-b border-slate-400 border-opacity-25 last:border-b-0">
                <Link href={`/${item._type === 'resource' ? 'resource' : 'training'}/${item.slug}`}>
                  <div className="flex items-center px-4 py-2 hover:bg-gray-200 hover:bg-opacity-25">
                    {item.mainImage ? (
                      <div className="w-12 h-12 mr-2 flex-shrink-0">
                        <Image
                          src={urlForImage(item.mainImage) || '/default-thumbnail.jpg'}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="object-cover h-full rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 mr-2 flex-shrink-0 flex items-center justify-center bg-slate-300 dark:bg-slate-700 text-white rounded">
                        {item._type === 'resource' ? <FiFileText size={24} /> : <FiBookOpen size={24} />}
                      </div>
                    )}
                    <div>
                      <div className={`text-xs font-semibold ${item._type === 'resource' ? 'text-blue-500' : 'text-green-500'}`}>
                        {item._type === 'resource' ? 'Resource' : 'Training Step'}
                      </div>
                      {item.title}
                      {item.tags && (
                        <div className="mt-1 text-xs text-slate-400">
                          {item.tags.map((tag) => (
                            <span key={tag} className="inline-block mr-1 bg-slate-200 dark:bg-slate-700 rounded px-2 py-1">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchModal;