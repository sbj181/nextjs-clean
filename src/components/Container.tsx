
import Header from './Header'
import Sidebar from './Sidebar';
import { useState } from 'react';

export default function Container({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);  // Toggle the current state of the sidebar
  };

  return (
    <div className="bg-custom">
      <Header setSidebarOpen={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`container-full h-screen px-10 relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden ${sidebarOpen ? 'ml-64' : ''}`} style={{ transition: 'margin-left 300ms ease' }}>
        <main className='pt-28'>{children}</main>
      </div>
      
      <footer className="footer_ bg-slate-500 dark:bg-slate-950 px-10">
        <p className="footer__text_ py-10 text-sm text-right text-slate-50">
         Made by <a href="https://thegrovery.com" target='_blank' className=' underline'>The Grovery</a>
        </p>
      </footer>
    </div>
  )
}
