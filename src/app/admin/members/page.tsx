import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Trash2, UserPlus, User, Pencil } from 'lucide-react'
import Link from 'next/link'


export default async function AdminMembersPage() {
    const members = await db.member.findMany({
        include: { role: true },
        orderBy: { role: { weight: 'desc' } },
    })

    async function deleteMember(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        await db.member.delete({ where: { id } })
        revalidatePath('/admin/members')
        revalidatePath('/members')
    }

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Members</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        A list of all club members including their name, role, and priority.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        href="/admin/members/add"
                        className="block rounded-md bg-red-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                    >
                        <UserPlus className="inline-block w-4 h-4 mr-1" />
                        Add Member
                    </Link>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                    {members.map((member) => (
                                        <tr key={member.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                                <div className="flex items-center">
                                                    {member.image && <img src={member.image} alt="" className="h-8 w-8 rounded-full mr-3 object-cover" />}
                                                    {member.name}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                {member.role?.name || 'No Role'}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/members/edit/${member.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                        <Pencil className="w-5 h-5" />
                                                        <span className="sr-only">Edit, {member.name}</span>
                                                    </Link>
                                                    <form action={deleteMember}>
                                                        <input type="hidden" name="id" value={member.id} />
                                                        <button type="submit" className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                                                            <Trash2 className="w-5 h-5" />
                                                            <span className="sr-only">Delete, {member.name}</span>
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
