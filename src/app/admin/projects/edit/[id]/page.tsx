
import db from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft, Save, Info } from 'lucide-react'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const project = await db.project.findUnique({
        where: { id }
    })

    if (!project) {
        redirect('/admin/projects')
    }

    async function updateProject(formData: FormData) {
        'use server'
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const content = formData.get('content') as string
        const thumbnail = formData.get('thumbnail') as string

        await db.project.update({
            where: { id },
            data: {
                title,
                description,
                content,
                thumbnail: thumbnail || null
            }
        })

        revalidatePath('/admin/projects')
        revalidatePath('/projects')
        revalidatePath('/')
        redirect('/admin/projects')
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/projects" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
            </div>

            <form action={updateProject} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-6">
                    {/* Project Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Title</label>
                        <input type="text" name="title" id="title" required defaultValue={project.title}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        />
                    </div>

                    {/* Short Summary (Description) */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Short Summary</label>
                        <p className="text-xs text-gray-500 mb-2">This will be displayed on the Home Page card.</p>
                        <textarea name="description" id="description" rows={3} required defaultValue={project.description}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        ></textarea>
                    </div>

                    {/* Detailed Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detailed Content</label>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-3 my-2 text-sm text-blue-700 dark:text-blue-300">
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">How to add images:</p>
                                <p>Use this format to insert images anywhere in the text:</p>
                                <code className="bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">![Image Description](Image URL)</code>
                            </div>
                        </div>
                        <textarea name="content" id="content" rows={15} required defaultValue={project.content}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2 font-mono"
                        ></textarea>
                    </div>

                    {/* Thumbnail (Optional) */}
                    <div>
                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail URL (Optional)</label>
                        <input type="url" name="thumbnail" id="thumbnail" defaultValue={project.thumbnail || ''}
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
