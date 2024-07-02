// components/TagFilter.tsx

import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagClick }) => {
  return (
    <div className="flex items-center flex-wrap gap-2 mb-6">
      <div>Filters:</div>
      {tags.map((tag) => (
        <button
          key={tag}
          className={`py-1 px-3 rounded-md flex text-sm items-center gap-2 ${
            selectedTags.includes(tag) ? 'bg-slate-700 text-white' : 'bg-slate-500 text-white'
          }`}
          onClick={() => onTagClick(tag)}
        >
          
          {tag}
          {selectedTags.includes(tag) ? <FiCheck className="text-white" /> : null}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;