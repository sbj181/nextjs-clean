import Link from 'next/link';
import CoreLogo from './CoreLogo';
import { useSidebar } from '../contexts/SidebarContext';
import ThemeToggle from './ThemeToggler';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <header className="bg-slate-100 dark:bg-slate-600 py-2 px-4 flex justify-between items-center fixed w-full z-50">
      <Link href="/" passHref>
        <div className="w-[150px] py-2 cursor-pointer">
          <CoreLogo />
        </div>
      </Link>
      <div className="flex items-center">
        <input type="text" placeholder="Search..." className="py-2 xs:px-4 px-2 mx-2 md:px-6 border rounded-full" />
        <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <ThemeToggle />
        </div>
        <button onClick={toggleSidebar} className="p-2 ml-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          {isSidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>
    </header>
  );
}
