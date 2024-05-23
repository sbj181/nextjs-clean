import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSidebar } from '../contexts/SidebarContext';
import { FiChevronDown, FiChevronUp, FiHome, FiBook, FiLayers, FiEdit } from 'react-icons/fi';
import { getResources, type Resource } from '~/lib/sanity.queries';
import { getClient } from '~/lib/sanity.client';
import CallToAction from './CallToAction';

export default function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useSidebar();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      const client = getClient();
      const resources = await getResources(client);
      setResources(resources);
    };
    fetchResources();
  }, []);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside className={`fixed rounded-br-xl overflow-scroll inset-y-0 left-0 z-40 pt-36 flex flex-col bg-slate-200 dark:bg-slate-700 w-96 p-5 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <ul className="w-full">
        <div className="bg-slate-300 dark:bg-slate-800 mb-4 rounded-lg">
          <li className="sidebar-link flex items-center justify-between cursor-pointer">
            <Link href="/" className="flex items-center w-full font- font-normal" onClick={closeSidebarOnMobile}>
              <span className='bg-slate-50 w-8 h-8 flex items-center justify-center mr-2 rounded-xl bg-opacity-30 border-1 border-slate-50'><FiHome /></span> Dashboard
            </Link>
          </li>
        </div>
        <div className="bg-slate-300 dark:bg-slate-800 mb-4 rounded-lg">
          <li className="sidebar-link flex items-center justify-between">
            <Link href="/resources" className="flex items-center w-full font-normal" onClick={closeSidebarOnMobile}>
              <span className='bg-slate-50 w-8 h-8 flex items-center justify-center mr-2 rounded-xl bg-opacity-30 border-1 border-slate-50'><FiLayers /></span> Resources
            </Link>
            <button onClick={() => toggleSection('resources')} className="bg-slate-900 bg-opacity-20 p-2 rounded-xl hover:bg-opacity-50 focus:outline-none">
              {openSection === 'resources' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </li>
          {openSection === 'resources' && (
            <ul>
              {resources.map((resource) => (
                <li key={resource._id}>
                  <Link className='sidebar-link sub !text-left' href={`/resource/${resource.slug.current}`} onClick={closeSidebarOnMobile}>
                    {resource.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-slate-300 dark:bg-slate-800 mb-4 rounded-lg">
          <li className="sidebar-link flex items-center justify-between">
            <Link href="/training" className="flex items-center w-full font-normal" onClick={closeSidebarOnMobile}>
              <span className='bg-slate-50 w-8 h-8 flex items-center justify-center mr-2 rounded-xl bg-opacity-30 border-1 border-slate-50'><FiBook /></span> Training
            </Link>
          </li>
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
