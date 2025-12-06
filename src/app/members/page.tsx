import db from '@/lib/db'
import { User, Shield, Instagram, Linkedin, Twitter } from 'lucide-react'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import HeroBackground from '@/components/HeroBackground'


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
                                        <div key={member.id} className="w-full sm:w-80 group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-[400px]">
                                            {/* Image & Overlay Container */}
                                            <div className="relative h-full w-full overflow-hidden">
                                                {member.image ? (
                                                    <Image
                                                        src={member.image}
                                                        alt={member.name}
                                                        fill
                                                        className={`object-cover transition-transform duration-500 group-hover:scale-110 ${member.imagePosition || 'object-center'}`}
                                                        referrerPolicy="no-referrer"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                        <User className="h-20 w-20 text-gray-400" />
                                                    </div>
                                                )}

                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-800 from-20% via-gray-800/80 to-transparent transition-opacity duration-300" />

                                                {/* Name and Role - Slides to Top on Hover */}
                                                <div className="absolute bottom-0 left-0 w-full p-6 z-40 transform transition-transform duration-500 group-hover:-translate-y-[280px]">
                                                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{member.name}</h3>
                                                    <p className="text-red-400 font-medium text-sm flex items-center drop-shadow-md">
                                                        <Shield className="w-3 h-3 mr-1" /> {member.role.name}
                                                    </p>
                                                </div>

                                                {/* Hover Overlay - Bio (Center) & Socials (Bottom) */}
                                                <div className="absolute inset-0 flex flex-col justify-center p-6 z-30 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm pointer-events-none group-hover:pointer-events-auto">

                                                    {/* Middle: Bio */}
                                                    <div className="flex-grow flex items-center justify-center pt-10">
                                                        {member.bio && (
                                                            <p className="text-gray-200 text-sm leading-relaxed text-center line-clamp-6">
                                                                {member.bio}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Bottom: Socials */}
                                                    <div className="flex justify-center space-x-6 shrink-0 pt-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                                        {member.instagram && (
                                                            <Link href={member.instagram} target="_blank" className="text-white hover:text-red-500 transition-colors transform hover:scale-110">
                                                                <Instagram className="w-6 h-6" />
                                                            </Link>
                                                        )}
                                                        {member.linkedin && (
                                                            <Link href={member.linkedin} target="_blank" className="text-white hover:text-blue-500 transition-colors transform hover:scale-110">
                                                                <Linkedin className="w-6 h-6" />
                                                            </Link>
                                                        )}
                                                        {member.twitter && (
                                                            <Link href={member.twitter} target="_blank" className="text-white hover:text-blue-400 transition-colors transform hover:scale-110">
                                                                <Twitter className="w-6 h-6" />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
