import { useState } from 'react';
import Link from 'next/link';
import { useSidebar } from '../contexts/SidebarContext';
import { FiChevronDown, FiChevronUp, FiHome, FiBook, FiLayers, FiEdit } from 'react-icons/fi';
import CallToAction from './CallToAction';

export default function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useSidebar();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <aside className={`fixed rounded-br-xl overflow-scroll inset-y-0 left-0 z-10 pt-36 flex flex-col bg-slate-200 dark:bg-slate-700 w-96 p-5 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* <button onClick={() => setSidebarOpen(false)} className="absolute top-5 right-5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button> */}
      <ul className="w-full">
        <div className="bg-slate-300 dark:bg-slate-800 mb-4 rounded-lg">
            <li className="sidebar-link flex items-center justify-between cursor-pointer">
            <Link href="/" className="flex items-center w-full font- font-normal">
                <span className='bg-slate-50 w-8 h-8 flex items-center justify-center mr-2 rounded-xl bg-opacity-30 border-1 border-slate-50'><FiHome /></span> Dashboard
            </Link>
            </li>
        </div>
        <div className="bg-slate-300 dark:bg-slate-800 mb-4 rounded-lg">
          <li className="sidebar-link flex items-center justify-between">
            <Link href="/resources" className="flex items-center w-full font-normal">
              <span className='bg-slate-50 w-8 h-8 flex items-center justify-center mr-2 rounded-xl bg-opacity-30 border-1 border-slate-50'><FiLayers /></span> Resources
            </Link>
            <button onClick={() => toggleSection('resources')} className="bg-slate-900 bg-opacity-20 p-2 rounded-xl hover:bg-opacity-50 focus:outline-none">
              {openSection === 'resources' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </li>
          {openSection === 'resources' && (
            <ul>
              <li><Link className='sidebar-link sub' href="/resources/resource1">Resource 1</Link></li>
              <li><Link className='sidebar-link sub' href="/resources/resource2">Resource 2</Link></li>
              <li><Link className='sidebar-link sub' href="/resources/resource3">Resource 3</Link></li>
              <li><Link className='sidebar-link sub' href="/resources/resource4">Resource 4</Link></li>
              <li><Link className='sidebar-link sub' href="/resources/resource5">Resource 5</Link></li>
            </ul>
          )}
        </div>

        <div className="bg-slate-300 dark:bg-slate-800 mb-4 rounded-lg">
          <li className="sidebar-link flex items-center justify-between">
            <Link href="/blog" className="flex items-center w-full font-normal">
              <span className='bg-slate-50 w-8 h-8 flex items-center justify-center mr-2 rounded-xl bg-opacity-30 border-1 border-slate-50'><FiBook /></span> Training
            </Link>
            <button onClick={() => toggleSection('training')} className="bg-slate-900 bg-opacity-20 p-2 rounded-xl hover:bg-opacity-50 focus:outline-none">
              {openSection === 'training' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </li>
          {openSection === 'training' && (
            <ul>
              <li><Link className='sidebar-link sub' href="/training/training1">Training 1</Link></li>
              <li><Link className='sidebar-link sub' href="/training/training2">Training 2</Link></li>
              <li><Link className='sidebar-link sub' href="/training/training3">Training 3</Link></li>
            </ul>
          )}
        </div>
      </ul>
      <div className='mt-auto'> 
          <div className="mb-4">
            <a target='_blank' href="/studio/structure/resource" className="flex !bg-green-500 !bg-opacity-50 sidebar-link items-center w-full font- font-normal">
                <span className='bg-slate-50 w-8 h-8 flex items-center justify-center mr-2 rounded-xl bg-opacity-30 border-1 border-slate-50'><FiEdit /></span> Add & Edit Resources
            </a>
          </div>
        <CallToAction title='Want to a CORE for your Project?' subtitle='Use the link below to get in touch with us' />
      </div>
    </aside>
  );
}
