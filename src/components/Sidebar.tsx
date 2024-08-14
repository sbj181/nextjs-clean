import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiBook, FiChevronDown, FiChevronUp, FiEdit, FiHome, FiLayers, FiUser } from 'react-icons/fi';
import { supabase } from '~/lib/supabaseClient'; // Import Supabase client

import { useSidebar } from '../contexts/SidebarContext';
import CallToAction from './CallToAction';

// Define the Resource type based on your Supabase table structure
interface Resource {
  id: string;
  title: string;
  slug: string;
  // Add other fields as necessary
}

interface Training {
  id: string;
  title: string;
  slug: string;
  // Add other fields as necessary
}

export default function Sidebar() {
  const { isSidebarOpen, setSidebarOpen } = useSidebar();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);

  useEffect(() => {
    const fetchResourcesAndTrainings = async () => {
      // Fetch resources from Supabase
      let { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
  
      if (resourcesError) {
        console.error('Error fetching resources:', resourcesError);
      } else {
        setResources(resources || []); // Add a fallback to an empty array
      }
  
      // Fetch trainings from Supabase
      let { data: trainings, error: trainingsError } = await supabase
        .from('trainings')
        .select('*')
        .order('created_at', { ascending: false });
  
      if (trainingsError) {
        console.error('Error fetching trainings:', trainingsError);
      } else {
        setTrainings(trainings || []); // Add a fallback to an empty array
      }
    };
  
    fetchResourcesAndTrainings();
  }, []);
  

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(true);
    }
  };

  return (
    <aside className={`fixed rounded-br-xl overflow-scroll no-scrollbar inset-y-0 left-0 z-40 pt-32 flex flex-col bg-slate-100 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-800 w-80 p-5 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <ul className="w-full">
        <div className="bg-slate-200 dark:bg-slate-800 mb-4 rounded-lg">
          <li className="sidebar-link flex items-center justify-between cursor-pointer">
            <Link href="/" className="flex items-center w-full font-normal" onClick={closeSidebarOnMobile}>
              <span className='bg-slate-50 w-8 h-8 flex items-center justify-center mr-2 rounded-xl bg-opacity-30 border-1 border-slate-50'><FiHome /></span> Dashboard
            </Link>
          </li>
        </div>
  
        <div className="bg-slate-200 dark:bg-slate-800 mb-4 rounded-lg">
          <li className="sidebar-link flex items-center justify-between">
            <Link href="/resource-center" className="flex items-center w-full font-normal" onClick={closeSidebarOnMobile}>
              <span className='bg-slate-50 w-8 h-8 flex items-center justify-center mr-2 rounded-xl bg-opacity-30 border-1 border-slate-50'><FiLayers /></span> Resources
            </Link>
            <button onClick={() => toggleSection('resources')} className="bg-slate-400 bg-opacity-20 p-2 rounded-xl hover:bg-opacity-50 focus:outline-none">
              {openSection === 'resources' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </li>
          {openSection === 'resources' && (
            <ul>
              {resources.map((resource) => (
                <li key={resource.id}>
                  <Link className='sidebar-link sub !text-left' href={`/resource/${resource.slug}`} onClick={closeSidebarOnMobile}>
                    {resource.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
  
        <div className="bg-slate-200 dark:bg-slate-800 mb-4 rounded-lg">
          <li className="sidebar-link flex items-center justify-between">
            <Link href="/training-center" className="flex items-center w-full font-normal" onClick={closeSidebarOnMobile}>
              <span className='bg-slate-50 w-8 h-8 flex items-center justify-center mr-2 rounded-xl bg-opacity-30 border-1 border-slate-50'><FiBook /></span> Training
            </Link>
            <button onClick={() => toggleSection('trainings')} className="bg-slate-400 bg-opacity-20 p-2 rounded-xl hover:bg-opacity-50 focus:outline-none">
              {openSection === 'trainings' ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </li>
          {openSection === 'trainings' && (
            <ul>
              {trainings.map((training) => (
                <li key={training.id}>
                  <Link className='sidebar-link sub !text-left' href={`/training/${training.slug}`} onClick={closeSidebarOnMobile}>
                    {training.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
  
        <div className="bg-slate-200 dark:bg-slate-800 mb-4 rounded-lg">
          <li className="sidebar-link flex items-center justify-between">
            <Link href="/profile" className="flex items-center w-full font-normal" onClick={closeSidebarOnMobile}>
              <span className='bg-slate-50 w-8 h-8 flex items-center justify-center mr-2 rounded-xl bg-opacity-30 border-1 border-slate-50'><FiUser /></span> Profile
            </Link>
          </li>
        </div>
      </ul>
      <div className='mt-auto'>
        <CallToAction title='Want your own CORE&trade; LMS?' subtitle='Get in touch with us' />
      </div>
    </aside>
  );
}
