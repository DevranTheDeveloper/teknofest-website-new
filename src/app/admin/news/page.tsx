import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { Trash2, PlusCircle, Pencil } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export default async function AdminNewsPage() {
    const news = await prisma.news.findMany({
        orderBy: { date: 'desc' },
    })

    async function deleteNews(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        await prisma.news.delete({ where: { id } })
        revalidatePath('/admin/news')
        revalidatePath('/') // Home page uses it
    }

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">News</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Publish and manage news articles.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Link
                            href="/admin/news/add"
                            className="block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                        >
                            <PlusCircle className="inline-block w-4 h-4 mr-1" />
                            Add News
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Title</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Description</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                    {news.map((item) => (
                                        <tr key={item.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">{item.title}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                {new Date(item.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">{item.description}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/news/edit/${item.id}`} className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400">
                                                        <Pencil className="w-5 h-5" />
                                                        <span className="sr-only">Edit, {item.title}</span>
                                                    </Link>
                                                    <form action={deleteNews}>
                                                        <input type="hidden" name="id" value={item.id} />
                                                        <button type="submit" className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                                                            <Trash2 className="w-5 h-5" />
                                                            <span className="sr-only">Delete, {item.title}</span>
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
