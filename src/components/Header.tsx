// Header.tsx
import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggler';
import { FiMenu, FiX } from 'react-icons/fi';  // Importing icons from React Icons

export default function Header({ setSidebarOpen, isSidebarOpen }) {
    return (
        <header className="bg-slate-100 dark:bg-slate-600 py-2 px-4 flex justify-between items-center fixed w-full z-50">
            <Link href="/" passHref>
                <div className="text-xl font-bold cursor-pointer">CORE RMS</div>
            </Link>
            <div className="flex items-center">
                <input type="text" placeholder="Search..." className="mr-4 p-2 border rounded" />
                <div className=" p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <ThemeToggle />
                </div>
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className=" p-2 ml-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    {isSidebarOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                </button>
               
            </div>
        </header>
    );
}
