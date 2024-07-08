import Link from 'next/link';
import CoreLogo from './CoreLogo';
import { useSidebar } from '../contexts/SidebarContext';
import ThemeToggle from './ThemeToggler';
import { FiMenu, FiUser, FiX } from 'react-icons/fi';
import SearchDropdown from './SearchDropdown';
import SearchButton from './SearchButton';

export default function Header() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <header className="bg-slate-100 dark:bg-slate-600 py-2 px-4 flex justify-between items-center fixed w-full z-50">
        <Link href="/" passHref>
          <div className="w-[150px] py-2 cursor-pointer">
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
            
            className="p-2 ml-2 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center"
          >
            <span className="hidden md:inline-block"><FiUser className="h-6 w-6" /></span>
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
