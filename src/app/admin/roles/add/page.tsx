import db from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function AddRolePage() {
    async function createRole(formData: FormData) {
        'use server'
        const name = formData.get('name') as string
        const weight = parseInt(formData.get('weight') as string) || 0

        await db.role.create({
            data: {
                name,
                weight,
            }
        })

        revalidatePath('/admin/roles')
        redirect('/admin/roles')
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/roles" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Role</h1>
            </div>

            <form action={createRole} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role Name</label>
                        <input type="text" name="name" id="name" required placeholder="e.g. President, Developer"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Weight</label>
                        <input type="number" name="weight" id="weight" defaultValue={0}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        />
                        <p className="mt-1 text-xs text-gray-500">Higher numbers appear higher in lists.</p>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        <Save className="w-5 h-5 mr-2" />
                        Save Role
                    </button>
                </div>
            </form>
        </div>
    )
}
