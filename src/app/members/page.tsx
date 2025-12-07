import db from '@/lib/db'
import { User } from 'lucide-react'
import Footer from '@/components/Footer'
import HeroBackground from '@/components/HeroBackground'
import MemberCard from '@/components/MemberCard'


export const dynamic = 'force-dynamic'

export default async function MembersPage() {
    const members = await db.member.findMany({
        include: {
            role: true
        },
        orderBy: {
            role: {
                weight: 'asc'
            }
        }
    })

    // Group members by role, preserving order (since members are already sorted by weight)
    const groupedMembers = new Map<string, { roleName: string, members: typeof members }>();

    members.forEach(member => {
        if (!groupedMembers.has(member.role.id)) {
            groupedMembers.set(member.role.id, {
                roleName: member.role.name,
                members: []
            });
        }
        groupedMembers.get(member.role.id)!.members.push(member);
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex flex-col relative overflow-hidden">
            {/* Background Animation Layer */}
            <div className="fixed inset-0 z-0">
                <HeroBackground />
                {/* Blur Overlay */}
                <div className="absolute inset-0 backdrop-blur-[2px] bg-white/30 dark:bg-gray-900/40 pointer-events-none" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Ekibimizle <span className="text-red-600 dark:text-red-500">Tanışın</span>
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
                        Birlikte öğrenen, üreten ve geleceği inşa eden tutkulu bir topluluğuz.
                    </p>
                </div>

                {members.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                        <User className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Henüz üye yok</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Yeni üyeler yakında eklenecek.</p>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {Array.from(groupedMembers.values()).map((group) => (
                            <section key={group.roleName} className="relative">
                                {/* Role Section Header */}
                                <div className="flex items-center mb-8">
                                    <div className="h-0.5 flex-grow bg-gradient-to-r from-transparent via-red-600/50 to-transparent dark:via-red-500/50"></div>
                                    <h2 className="px-6 text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-wider text-center">
                                        {group.roleName}
                                    </h2>
                                    <div className="h-0.5 flex-grow bg-gradient-to-r from-transparent via-red-600/50 to-transparent dark:via-red-500/50"></div>
                                </div>

                                {/* Members Grid for this Role */}
                                <div className="flex flex-wrap justify-center gap-8">
                                    {group.members.map((member) => (
                                        <MemberCard key={member.id} member={member} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    )
}
