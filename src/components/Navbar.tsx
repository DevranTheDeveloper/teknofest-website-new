'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <img src="/teknofest-logo.png" alt="Teknofest Logo" className="h-16 w-auto" />
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink href="/members">Üyeler</NavLink>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 dark:text-gray-200">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={clsx("md:hidden", isOpen ? "block" : "hidden")}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg">
                    <MobileNavLink href="/members" onClick={toggleMenu}>Üyeler</MobileNavLink>
                </div>
            </div>
        </nav>
    )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 font-medium transition-colors"
        >
            {children}
        </Link>
    )
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
            {children}
        </Link>
    )
}
