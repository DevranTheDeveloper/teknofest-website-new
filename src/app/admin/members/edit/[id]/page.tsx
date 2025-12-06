import db from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

// Correctly typing params for Next.js App Router dynamic routes
export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // Fetch member and roles in parallel
    const [member, roles] = await Promise.all([
        db.member.findUnique({ where: { id } }),
        db.role.findMany({ orderBy: { weight: 'desc' } })
    ])

    if (!member) {
        redirect('/admin/members')
    }

    async function updateMember(formData: FormData) {
        'use server'
        const name = formData.get('name') as string
        const roleId = formData.get('roleId') as string
        const image = formData.get('image') as string
        const imagePosition = formData.get('imagePosition') as string
        const bio = formData.get('bio') as string
        const instagram = formData.get('instagram') as string
        const linkedin = formData.get('linkedin') as string
        const twitter = formData.get('twitter') as string

        await db.member.update({
            where: { id },
            data: {
                name,
                roleId,
                image: image || null,
                imagePosition: imagePosition || 'object-center',
                bio: bio || null,
                instagram: instagram || null,
                linkedin: linkedin || null,
                twitter: twitter || null,
            }
        })

        revalidatePath('/admin/members')
        revalidatePath('/members')
        redirect('/admin/members')
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/members" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Member</h1>
            </div>

            <form action={updateMember} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input type="text" name="name" id="name" required defaultValue={member.name}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="roleId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <select name="roleId" id="roleId" required defaultValue={member.roleId}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        >
                            <option value="">Select a Role</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                        <input type="url" name="image" id="image" placeholder="https://..." defaultValue={member.image || ''}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="imagePosition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image Focal Point</label>
                        <select name="imagePosition" id="imagePosition" defaultValue={member.imagePosition || 'object-center'}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        >
                            <option value="object-center">Center (Default)</option>
                            <option value="object-top">Top</option>
                            <option value="object-bottom">Bottom</option>
                            <option value="object-left">Left</option>
                            <option value="object-right">Right</option>
                            <option value="object-left-top">Top Left</option>
                            <option value="object-right-top">Top Right</option>
                            <option value="object-left-bottom">Bottom Left</option>
                            <option value="object-right-bottom">Bottom Right</option>
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Short Bio</label>
                        <textarea name="bio" id="bio" rows={3} defaultValue={member.bio || ''}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                        ></textarea>
                    </div>

                    <div className="col-span-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Social Links</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="instagram" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Instagram URL</label>
                                <input type="url" name="instagram" id="instagram" defaultValue={member.instagram || ''}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="linkedin" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">LinkedIn URL</label>
                                <input type="url" name="linkedin" id="linkedin" defaultValue={member.linkedin || ''}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="twitter" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">X (Twitter) URL</label>
                                <input type="url" name="twitter" id="twitter" defaultValue={member.twitter || ''}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        <Save className="w-5 h-5 mr-2" />
                        Update Member
                    </button>
                </div>
            </form>
        </div>
    )
}
