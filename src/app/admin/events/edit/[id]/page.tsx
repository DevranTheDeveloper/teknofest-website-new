
import db from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const event = await db.event.findUnique({
        where: { id }
    })

    if (!event) {
        redirect('/admin/events')
    }

    async function updateEvent(formData: FormData) {
        'use server'
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const image = formData.get('image') as string
        const dateStr = formData.get('date') as string
        const link = formData.get('link') as string

        const date = new Date(dateStr)

        await db.event.update({
            where: { id },
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

    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    const formattedDate = new Date(event.date.getTime() - (event.date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/events" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Event</h1>
            </div>

            <form action={updateEvent} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-6">
                    {/* Event Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Title</label>
                        <input type="text" name="title" id="title" required defaultValue={event.title}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        />
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
                        <input type="datetime-local" name="date" id="date" required defaultValue={formattedDate}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea name="description" id="description" rows={4} required defaultValue={event.description}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        ></textarea>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image URL</label>
                        <input type="url" name="image" id="image" defaultValue={event.image || ''}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        />
                    </div>

                    {/* Participation Link */}
                    <div>
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Participation/Registration Link</label>
                        <input type="url" name="link" id="link" defaultValue={event.link || ''}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}
