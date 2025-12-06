'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, X, ArrowRight, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Event = {
    id: string
    title: string
    description: string
    date: Date | string
    image?: string | null
    link?: string | null
}

export default function EventCard({ event, isPast }: { event: Event, isPast?: boolean }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    // Parse date safely
    const eventDate = new Date(event.date)

    const handleOpen = () => {
        setIsOpen(true)
        setIsClosing(false)
    }

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setIsOpen(false)
            setIsClosing(false)
        }, 200) // Match animation duration
    }

    return (
        <>
            {/* Card Trigger */}
            <div
                onClick={handleOpen}
                className={`group cursor-pointer flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-900/50 h-full min-h-[350px] ${isPast ? 'grayscale hover:grayscale-0 opacity-80 hover:opacity-100' : ''}`}
            >
                {/* Card Image / Header */}
                <div className="relative h-48 w-full shrink-0 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    {event.image ? (
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                            <Calendar className="w-16 h-16 text-white/20" />
                        </div>
                    )}

                    {/* Date Badge Overlay */}
                    <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg flex flex-col items-center border border-gray-100 dark:border-gray-700">
                        <span className="text-2xl font-black text-red-600 dark:text-red-500 leading-none">
                            {eventDate.getDate()}
                        </span>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                            {eventDate.toLocaleDateString("tr-TR", { month: 'short' })}
                        </span>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-xs font-medium text-red-600 dark:text-red-400 mb-3 space-x-2">
                        <span className="flex items-center bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            {eventDate.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>{eventDate.getFullYear()}</span>
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                        {event.title}
                    </h4>

                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-6">
                        {event.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            Detayları Görüntüle
                        </span>
                        <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <ArrowRight className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Popup */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop with Blur */}
                    <div
                        className={`absolute inset-0 bg-black/60 backdrop-blur-md ${isClosing ? 'animate-modal-fade-out' : 'animate-modal-fade-in'}`}
                        onClick={handleClose}
                    />

                    {/* Modal Content */}
                    <div className={`relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden ${isClosing ? 'animate-modal-zoom-out' : 'animate-modal-zoom-in'} border border-gray-200 dark:border-gray-700 max-h-[90vh] flex flex-col`}>

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Event Image (if exists) or Gradient Header */}
                        <div className="relative h-48 sm:h-64 shrink-0 bg-gray-200 dark:bg-gray-800">
                            {event.image ? (
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                                    <Calendar className="w-20 h-20 text-white/20" />
                                </div>
                            )}
                            {/* Date Overlay */}
                            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg flex flex-col items-center">
                                <span className="text-2xl font-bold text-red-600 dark:text-red-400 leading-none">
                                    {eventDate.getDate()}
                                </span>
                                <span className="text-xs font-bold uppercase text-gray-800 dark:text-gray-200">
                                    {eventDate.toLocaleDateString("tr-TR", { month: 'short' })}
                                </span>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 sm:p-8 overflow-y-auto">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {event.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                    <Clock className="w-4 h-4 mr-2 text-red-500" />
                                    {eventDate.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })} - {eventDate.toLocaleDateString("tr-TR", { weekday: 'long' })}
                                </div>
                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${isPast ? 'bg-gray-400' : 'bg-green-500 animate-pulse'}`} />
                                    {isPast ? 'Tamamlandı' : 'Kayıtlar Açık'}
                                </div>
                            </div>

                            <div className="prose prose-red dark:prose-invert max-w-none mb-8 text-gray-600 dark:text-gray-300">
                                <p className="whitespace-pre-wrap leading-relaxed">{event.description}</p>
                            </div>

                            {/* Action Button */}
                            {event.link && !isPast && (
                                <Link
                                    href={event.link}
                                    target="_blank"
                                    className="inline-flex w-full sm:w-auto items-center justify-center bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-red-500/30 hover:-translate-y-1"
                                >
                                    Katıl / Kayıt Ol
                                    <ExternalLink className="w-5 h-5 ml-2" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
