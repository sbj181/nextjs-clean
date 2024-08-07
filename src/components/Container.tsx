import { useSidebar } from './../contexts/SidebarContext';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Container({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="bg-custom">
      <Header /> {/* Remove setSearchQuery prop */}
      <Sidebar />
      <div className={`container-full h-screen px-4 relative flex flex-1 flex-col scrollbar overflow-y-auto overflow-x-hidden ${isSidebarOpen ? 'lg:ml-80' : ''}`} style={{ transition: 'margin-left 300ms ease' }}>
        <main className='pt-20 md:pt-24 lg:pt-28'>{children}</main>
        <footer className="footer_  px-10 -mx-10">
          <p className="footer__text_ py-10 text-sm text-right">
            Made by <a href="https://thegrovery.com" target='_blank' className='underline'>The Grovery</a>
          </p>
        </footer>
      </div>
      
    </div>
  );
}
