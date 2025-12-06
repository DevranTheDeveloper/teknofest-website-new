import Link from 'next/link'
import { Mail, Instagram, Linkedin, Rocket } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Rocket className="h-6 w-6 text-red-600 dark:text-red-500" />
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                            TeknoFest<span className="text-red-600 dark:text-red-500">Club</span>
                        </span>
                    </div>

                    <div className="flex space-x-6">
                        <a href="mailto:contact@teknofest.halic.edu.tr" className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                            <span className="sr-only">Email</span>
                            <Mail className="h-6 w-6" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                            <span className="sr-only">Instagram</span>
                            <Instagram className="h-6 w-6" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin className="h-6 w-6" />
                        </a>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8">
                    <p className="text-center text-base text-gray-400">
                        &copy; {new Date().getFullYear()} Haliç University TeknoFest Club. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
