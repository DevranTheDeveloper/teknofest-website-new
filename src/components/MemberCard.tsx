'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { User, Shield, Instagram, Linkedin, Twitter } from 'lucide-react'
import { Member, Role } from '@prisma/client'
import clsx from 'clsx'

type MemberWithRole = Member & { role: Role }

interface MemberCardProps {
    member: MemberWithRole
}

export default function MemberCard({ member }: MemberCardProps) {
    const [isClicked, setIsClicked] = useState(false)

    return (
        <div
            className="w-full sm:w-80 group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-[400px] cursor-pointer"
            onClick={() => setIsClicked(!isClicked)}
        >
            {/* Image & Overlay Container */}
            <div className="relative h-full w-full overflow-hidden">
                {member.image ? (
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className={clsx(
                            "object-cover transition-transform duration-500",
                            member.imagePosition || 'object-center',
                            isClicked ? "scale-110" : "group-hover:scale-110"
                        )}
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="h-20 w-20 text-gray-400" />
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800 from-20% via-gray-800/80 to-transparent transition-opacity duration-300" />

                {/* Name and Role - Slides to Top on Hover/Click */}
                <div className={clsx(
                    "absolute bottom-0 left-0 w-full p-6 z-40 transform transition-transform duration-500",
                    isClicked ? "-translate-y-[280px]" : "group-hover:-translate-y-[280px]"
                )}>
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{member.name}</h3>
                    <p className="text-red-400 font-medium text-sm flex items-center drop-shadow-md">
                        <Shield className="w-3 h-3 mr-1" /> {member.role.name}
                    </p>
                </div>

                {/* Hover/Click Overlay - Bio (Center) & Socials (Bottom) */}
                <div className={clsx(
                    "absolute inset-0 flex flex-col justify-center p-6 z-30 bg-black/60 transition-opacity duration-300 backdrop-blur-sm pointer-events-none",
                    isClicked ? "opacity-100 pointer-events-auto" : "opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto"
                )}>

                    {/* Middle: Bio */}
                    <div className="flex-grow flex items-center justify-center pt-10">
                        {member.bio && (
                            <p className="text-gray-200 text-sm leading-relaxed text-center line-clamp-6">
                                {member.bio}
                            </p>
                        )}
                    </div>

                    {/* Bottom: Socials */}
                    <div className={clsx(
                        "flex justify-center space-x-6 shrink-0 pt-4 transform transition-transform duration-300 delay-75",
                        isClicked ? "translate-y-0" : "translate-y-4 group-hover:translate-y-0"
                    )}>
                        {member.instagram && (
                            <Link href={member.instagram} target="_blank" className="text-white hover:text-red-500 transition-colors transform hover:scale-110" onClick={(e) => e.stopPropagation()}>
                                <Instagram className="w-6 h-6" />
                            </Link>
                        )}
                        {member.linkedin && (
                            <Link href={member.linkedin} target="_blank" className="text-white hover:text-blue-500 transition-colors transform hover:scale-110" onClick={(e) => e.stopPropagation()}>
                                <Linkedin className="w-6 h-6" />
                            </Link>
                        )}
                        {member.twitter && (
                            <Link href={member.twitter} target="_blank" className="text-white hover:text-blue-400 transition-colors transform hover:scale-110" onClick={(e) => e.stopPropagation()}>
                                <Twitter className="w-6 h-6" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
