import React from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { type Post, type Resource } from '~/lib/sanity.queries';

interface ShareModalProps {
  post?: Post;
  resource?: Resource;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ post, resource, onClose }) => {
  const item = post || resource; // Determine if it's a post or a resource
  const shareLink = resource?.BMSResourceLink || `${window.location.origin}/post/${post?.slug.current}`;

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      alert('Link copied to clipboard!');
    }
  };

  const sendEmail = () => {
    const subject = `Check out this ${resource ? 'resource' : 'post'}: ${item?.title}`;
    const body = `I thought you might be interested in this ${resource ? 'resource' : 'post'}: ${item?.title}\n\n${shareLink}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900 bg-opacity-75 z-50 flex justify-center items-center"
      onClick={onClose} // Close modal on backdrop click
    >
      <div
        className="bg-white dark:bg-slate-800 p-4 rounded-lg w-full mx-4 max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Share this {resource ? 'Resource' : 'Post'}</h2>
          <button onClick={onClose} className="text-slate-500">
            <HiOutlineX className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={copyToClipboard}
            className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg"
          >
            Copy Link to Clipboard
          </button>
          <button
            onClick={sendEmail}
            className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded-lg"
          >
            Share via Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
