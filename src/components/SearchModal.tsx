import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { FiBookOpen, FiFileText, FiX } from 'react-icons/fi';
import { supabase } from '~/lib/supabaseClient'; // Import Supabase client

interface SearchItem {
  id: string;
  title: string;
  slug: string;
  type: 'resource' | 'training'; // Indicate whether it's a resource or a training
  tags?: string[];
  image_url?: string;
}

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
      // Fetch resources
      let { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select('id, title, slug, image_url') // No 'tags' column
        .order('created_at', { ascending: false });
  
      if (resourcesError) {
        console.error('Error fetching resources:', resourcesError);
        resources = [];
      }
  
      // Fetch trainings
      let { data: trainings, error: trainingsError } = await supabase
        .from('trainings')
        .select('id, title, slug')
        .order('created_at', { ascending: false });
  
      if (trainingsError) {
        console.error('Error fetching trainings:', trainingsError);
        trainings = [];
      }
  
      // Combine resources and trainings into a single list
      const items: SearchItem[] = [
        ...resources.map(item => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          type: 'resource' as 'resource',  // Explicitly set the type to 'resource'
          image_url: item.image_url,
        })),
        ...trainings.map(item => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          type: 'training' as 'training',  // Explicitly set the type to 'training'
        })),
      ];
  
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
              <li key={item.id} className="border-b border-slate-400 border-opacity-25 last:border-b-0">
                <Link href={`/${item.type}/${item.slug}`}>
                  <div className="flex items-center px-4 py-2 hover:bg-gray-200 hover:bg-opacity-25">
                    {item.image_url ? (
                      <div className="w-12 h-12 mr-2 flex-shrink-0">
                        <Image
                          src={item.image_url || '/default-thumbnail.jpg'}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="object-cover h-full rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 mr-2 flex-shrink-0 flex items-center justify-center bg-slate-300 dark:bg-slate-700 text-white rounded">
                        {item.type === 'resource' ? <FiFileText size={24} /> : <FiBookOpen size={24} />}
                      </div>
                    )}
                    <div>
                      <div className={`text-xs font-semibold ${item.type === 'resource' ? 'text-blue-500' : 'text-green-500'}`}>
                        {item.type === 'resource' ? 'Resource' : 'Training'}
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
