
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import Image from 'next/image'

const prisma = new PrismaClient()

// Force dynamic since we're fetching individual project
export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const project = await prisma.project.findUnique({
        where: { id }
    })

    if (!project) {
        notFound()
    }

    // Custom Parser for mixing text and images
    // Matches ![alt text](url) pattern
    const parseContent = (text: string) => {
        const parts = text.split(/(!\[.*?\]\(.*?\))/g);

        return parts.map((part, index) => {
            const imageMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
            if (imageMatch) {
                const alt = imageMatch[1];
                const src = imageMatch[2];
                return (
                    <div key={index} className="my-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
                        {/* We use a standard img tag here for simplicity with external URLs, 
                             or Next Image if we could guarantee domains. Standard img is safer for arbitrary user input. */}
                        <img
                            src={src}
                            alt={alt}
                            className="w-full h-auto object-cover max-h-[600px]"
                            loading="lazy"
                        />
                        {alt && <p className="text-center text-sm text-gray-500 mt-2 italic">{alt}</p>}
                    </div>
                );
            }
            // For text parts, we handle paragraphs
            return part.split('\n').map((line, lineIndex) => {
                if (line.trim() === '') return <br key={`${index}-${lineIndex}`} />;
                return <p key={`${index}-${lineIndex}`} className="mb-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">{line}</p>;
            });
        });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">

                {/* Back Button */}
                <Link href="/#projects" className="inline-flex items-center text-gray-500 hover:text-red-600 transition-colors mb-8">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Projects
                </Link>

                <article>
                    {/* Header */}
                    <header className="mb-12 text-center">
                        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                            {project.title}
                        </h1>
                        <div className="flex items-center justify-center space-x-4 text-gray-500">
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </header>

                    {/* Hero Image (Thumbnail) */}
                    {project.thumbnail && (
                        <div className="relative w-full h-64 sm:h-96 mb-12 rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10 group">
                            <Image
                                src={project.thumbnail}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                priority
                            />
                            {/* Subtle gradient overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
                        </div>
                    )}

                    {/* Summary Box */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border-l-4 border-red-600 mb-12 italic text-xl text-gray-700 dark:text-gray-300">
                        "{project.description}"
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg prose-red dark:prose-invert max-w-none">
                        {parseContent(project.content)}
                    </div>

                </article>
            </div>
        </div>
    )
}
