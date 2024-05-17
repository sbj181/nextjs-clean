import { useState } from 'react';
import Link from 'next/link';
import CoreLogo from './CoreLogo';
import { useSidebar } from '../contexts/SidebarContext';
import ThemeToggle from './ThemeToggler';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';

export default function Header() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isSearchOpen, setSearchOpen] = useState(false);

  const closeSearchModal = () => {
    setSearchOpen(false);
  };

  return (
    <>
      <header className="bg-slate-100 dark:bg-slate-600 py-2 px-4 flex justify-between items-center fixed w-full z-50">
        <Link href="/" passHref>
          <div className="w-[150px] py-2 cursor-pointer">
            <CoreLogo />
          </div>
        </Link>
        <div className="flex items-center">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg md:hidden"
          >
            <FiSearch className="h-6 w-6" />
          </button>
          <input
            type="text"
            placeholder="Search..."
            className="py-2 xs:px-4 px-2 mx-2 md:px-6 border rounded-full hidden md:block"
          />
          <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <ThemeToggle />
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 ml-4 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center"
          >
            {isSidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            <span className="hidden md:inline-block ml-2">Menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 z-50 flex justify-center items-center" onClick={closeSearchModal}>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Search</h2>
              <button onClick={closeSearchModal} className="text-slate-500">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="py-2 px-4 w-full border rounded-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
