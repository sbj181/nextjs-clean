import Link from 'next/link';
import { FiMenu, FiUser, FiX } from 'react-icons/fi';

import { useSidebar } from '../contexts/SidebarContext';
import CoreLogo from './CoreLogo';
import SearchButton from './SearchButton';
import SearchDropdown from './SearchDropdown';
import ThemeToggle from './ThemeToggler';

export default function Header() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <header className="bg-slate-100 dark:bg-gradient-to-r dark:from-slate-950 dark:to-slate-900 py-2 px-4 flex justify-between items-center fixed w-full z-50">
        <Link href="/" passHref>
          <div className="w-[150px] md:w-[200px] transition ease-in py-2 cursor-pointer">
            <CoreLogo />
          </div>
        </Link>
        <div className="flex items-center w-full justify-between">
          <div className="hidden md:block mx-auto">
            <SearchDropdown />
          </div>
          <div className="md:hidden mr-2 ml-auto">
            <SearchButton />
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <ThemeToggle />
          </div>
          
          <Link href="/profile" passHref
            
            className="hidden p-2 ml-2 bg-slate-50 dark:bg-slate-700 rounded-lg sm:flex items-center"
          >
            <span className="inline-block"><FiUser className="h-6 w-6" /></span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 ml-2 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center"
          >
            {isSidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            <span className="hidden md:inline-block ml-2">Menu</span>
          </button>
        </div>
      </header>
    </>
  );
}
