import db from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function AddEventPage() {

    async function createEvent(formData: FormData) {
        'use server'
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const image = formData.get('image') as string
        const dateStr = formData.get('date') as string
        const link = formData.get('link') as string

        // Combine date and time if separated, but usually datetime-local input gives full ISO-like string
        // Format: YYYY-MM-DDTHH:MM
        const date = new Date(dateStr)

        await db.event.create({
            data: {
                title,
                description,
                image: image || null,
                date: date,
                link: link || null
            }
        })

        revalidatePath('/admin/events')
        revalidatePath('/events')
        revalidatePath('/')
        redirect('/admin/events')
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/events" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Event</h1>
            </div>

            <form action={createEvent} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-6">
                    {/* Event Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Title</label>
                        <input type="text" name="title" id="title" required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                            placeholder="e.g. TeknoFest 2024 Kickoff"
                        />
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
                        <input type="datetime-local" name="date" id="date" required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea name="description" id="description" rows={4} required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                            placeholder="Brief details about the event..."
                        ></textarea>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image URL</label>
                        <input type="url" name="image" id="image"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                            placeholder="https://..."
                        />
                    </div>

                    {/* Participation Link */}
                    <div>
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Participation/Registration Link</label>
                        <input type="url" name="link" id="link"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                            placeholder="https://forms.google.com/..."
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        <Save className="w-5 h-5 mr-2" />
                        Save Event
                    </button>
                </div>
            </form>
        </div>
    )
}
