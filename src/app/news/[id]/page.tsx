
import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import Image from 'next/image'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const news = await prisma.news.findUnique({
        where: { id }
    })

    if (!news) {
        notFound()
    }

    // Custom Parser for mixing text and images (Same as Projects)
    const parseContent = (text: string) => {
        const parts = text.split(/(!\[.*?\]\(.*?\))/g);
        return parts.map((part, index) => {
            const imageMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
            if (imageMatch) {
                const alt = imageMatch[1];
                const src = imageMatch[2];
                return (
                    <div key={index} className="my-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
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
            return part.split('\n').map((line, lineIndex) => {
                if (line.trim() === '') return <br key={`${index}-${lineIndex}`} />;
                return <p key={`${index}-${lineIndex}`} className="mb-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">{line}</p>;
            });
        });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-32 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">

                {/* Back Button */}
                <Link href="/#news" className="inline-flex items-center text-gray-500 hover:text-red-600 transition-colors mb-8">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to News
                </Link>

                <article>
                    {/* Header */}
                    <header className="mb-10 text-center">
                        <div className="flex items-center justify-center space-x-2 text-red-600 font-semibold uppercase tracking-wider text-sm mb-4">
                            <span>News Update</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                            {news.title}
                        </h1>
                        <div className="flex items-center justify-center space-x-6 text-gray-500 text-sm">
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(news.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                    </header>

                    {/* Hero Image */}
                    {news.thumbnail && (
                        <div className="relative w-full h-64 sm:h-80 mb-12 rounded-2xl overflow-hidden shadow-lg">
                            <Image
                                src={news.thumbnail}
                                alt={news.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Summary Box */}
                    <div className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-10 leading-relaxed">
                        {news.description}
                    </div>

                    <hr className="border-gray-200 dark:border-gray-800 mb-10" />

                    {/* Content */}
                    <div className="prose prose-lg prose-red dark:prose-invert max-w-none">
                        {parseContent(news.content)}
                    </div>
                </article>
            </div>
        </div>
    )
}
