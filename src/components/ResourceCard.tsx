import Link from 'next/link';
import Image from 'next/image';
import { FiArchive } from 'react-icons/fi';

const ResourceCard = ({ resource }) => {
  return (
    <div className="card border-[4px] border-slate-50 flex w-full bg-slate-100 dark:bg-slate-950 h-full px-4 py-4 rounded-lg items-start min-h-[400px] overflow-auto flex-col relative">
      {resource.image_url ? (
        <div className='resourceImage h-20 w-full rounded-lg bg-slate-300 mb-4 overflow-hidden relative'>
          <Image
            src={resource.image_url}
            alt={`Image for ${resource.title}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
      ) : (
        <div className='resourceImage h-20 text-slate-600 dark:text-slate-950 rounded-lg bg-slate-300 opacity-25 flex items-center justify-center mb-4 w-full'>
          <FiArchive size={32} />
        </div>
      )}
      <div className="text-sm mb-2">
        <span className='bg-custom-teal px-3 bg-opacity-25 rounded-full inline-block'>{resource.categories ? resource.categories.name : 'Uncategorized'}</span>
      </div>
      <Link href={`/resource/${resource.slug}`}>
        <h2 className="text-xl font-semibold">{resource.title}</h2>
      </Link>
      <div className=''>
        <p className='opacity-65 min-h-32 text-sm'>{resource.description}</p>
      </div>
      {resource.download_url && (
        <div className="mt-8">
          <a href={resource.download_url} target="_blank" rel="noopener noreferrer">
            <button className="px-5 py-2 text-sm bg-custom-dark-blue text-white rounded-lg hover:bg-custom-blue-dark transition">
              Download
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
