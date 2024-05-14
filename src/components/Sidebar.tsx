// Sidebar.tsx
import Link from 'next/link';

export default function Sidebar({ isOpen, setSidebarOpen }) {
    return (
        <aside className={`fixed inset-y-0 left-0 z-10 items-center flex bg-slate-200 dark:bg-slate-700 w-64 p-5 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-5 right-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <ul className="space-y-4 w-full">
                <li className='sidebar-link'><Link href="/">Home</Link></li>
                <li className='sidebar-link'><Link href="/learn">Learn</Link></li>
                <li className='sidebar-link'><Link href="/resources">Resources</Link></li>
            </ul>
        </aside>
    );
}
