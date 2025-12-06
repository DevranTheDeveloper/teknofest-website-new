'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Calendar, Folder, Newspaper, LogOut, LayoutDashboard, Shield } from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Roles', href: '/admin/roles', icon: Shield },
    { name: 'Members', href: '/admin/members', icon: Users },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Projects', href: '/admin/projects', icon: Folder },
    { name: 'News', href: '/admin/news', icon: Newspaper },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
                <span className="text-xl font-bold text-white">Admin Panel</span>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`
                        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                        ${isActive ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                      `}
                                        >
                                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                            {item.name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </li>
                    <li className="mt-auto">
                        <Link
                            href="/"
                            className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                        >
                            <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                            Back to Site
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
