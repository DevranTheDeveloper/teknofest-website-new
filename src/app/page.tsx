import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { ArrowRight, Calendar, Rocket, Newspaper, Clock, Users, Cpu } from "lucide-react";
import Footer from "@/components/Footer";
import HeroBackground from "@/components/HeroBackground";
import HeroScrollOverlay from "@/components/HeroScrollOverlay";
import EventCard from "@/components/EventCard";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch data
  const news = await prisma.news.findMany({ orderBy: { date: 'desc' }, take: 5 });
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });

  const now = new Date();
  const activeEvents = await prisma.event.findMany({
    where: { date: { gte: now } },
    orderBy: { date: 'asc' }
  });
  const pastEvents = await prisma.event.findMany({
    where: { date: { lt: now } },
    orderBy: { date: 'desc' },
    take: 5
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Hero Section */}
      <section className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-0 overflow-hidden bg-gray-50 dark:bg-gray-900">

        {/* Animated Background Elements */}
        <HeroBackground />

        {/* Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] dark:opacity-[0.12] pointer-events-none z-0 scale-150 sm:scale-100">
          <img src="/teknofest-logo.png" alt="" className="w-full max-w-4xl object-contain h-auto blur-[3px]" />
        </div>

        <HeroScrollOverlay />
        {/* Subtle Overlay Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 via-transparent to-gray-50/50 dark:from-gray-900/50 dark:to-gray-900/50 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="flex justify-center mb-6">
            <img
              src="/halic-logo.png"
              alt="Haliç Üniversitesi"
              className="h-24 w-auto drop-shadow-lg filter hover:brightness-110 transition-all duration-300 hover:scale-105"
            />
          </div>
          <h1 className="text-6xl sm:text-8xl font-black text-gray-900 dark:text-white tracking-tighter mb-6 drop-shadow-sm">
            TEKNO<span className="text-red-600 dark:text-red-500">FEST</span>
          </h1>
          <p className="mt-4 text-2xl sm:text-4xl text-gray-600 dark:text-gray-300 font-light max-w-2xl mx-auto">
            Sınırları aşan fikirler, geleceğe yön veren projeler.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
            <Link href="#projects" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-red-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 hover:bg-red-700 hover:shadow-xl hover:-translate-y-1">
              Projelerimiz <Rocket className="ml-2 h-5 w-5 group-hover:animate-bounce" />
            </Link>
            <Link href="#events" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 dark:text-white transition-all duration-200 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-xl hover:-translate-y-1">
              Etkinliklerimiz <Calendar className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/members" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 dark:text-white transition-all duration-200 bg-transparent border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 font-pj rounded-xl">
              Üyeler <Users className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Scrolling Content Section */}
      <div className="relative z-10 mt-[100vh] bg-gray-50 dark:bg-gray-900 shadow-[0_-10px_40px_rgba(0,0,0,0.05),inset_0_25px_50px_rgba(0,0,0,0.1)] min-h-screen flex flex-col overflow-hidden">

        {/* Animated Background for Content Section */}
        <HeroBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-24 py-24 flex-grow">

          {/* News Section (Haberler) */}
          <section id="news" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-8">
              <Newspaper className="h-8 w-8 text-red-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Haberler</h2>
            </div>
            {news.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">Henüz haber eklenmemiş.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-red-600 dark:hover:border-red-600 transition-all duration-300 h-full"
                  >

                    {/* Image Section */}
                    <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Newspaper className="h-12 w-12 opacity-50" />
                        </div>
                      )}

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                      {/* Date Badge (Top Right) */}
                      <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg flex flex-col items-center border border-gray-200 dark:border-gray-700">
                        <span className="text-xl font-bold text-red-600 leading-none">
                          {new Date(item.date).getDate()}
                        </span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {new Date(item.date).toLocaleDateString('tr-TR', { month: 'short' })}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 text-sm flex-grow">
                        {item.description}
                      </p>

                      <div className="flex items-center text-red-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                        Devamını Oku <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Projects Section (Projeler) */}
          <section id="projects" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-8">
              <Rocket className="h-8 w-8 text-red-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Projeler</h2>
            </div>
            {projects.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">Henüz proje eklenmemiş.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="group relative block h-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                    {/* Watermark Icon */}
                    <div className="absolute -bottom-6 -right-6 text-gray-50 dark:text-gray-800/50 group-hover:text-red-50 dark:group-hover:text-red-900/10 transition-colors duration-500 z-0">
                      <Rocket strokeWidth={1} className="w-40 h-40 transform -rotate-90 group-hover:rotate-[-65deg] transition-transform duration-700" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-red-600 uppercase bg-red-50 dark:bg-red-900/20 rounded-full mb-3">
                          Proje
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
                          {project.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed flex-grow">
                        {project.description}
                      </p>

                      <div className="mt-6 flex items-center text-red-600 font-semibold text-sm group-hover:underline decoration-2 underline-offset-4">
                        Detayları İncele <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Events Section (Etkinlikler) */}
          <section id="events" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="h-8 w-8 text-red-600" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Etkinlikler</h2>
            </div>

            <div className="space-y-12">
              {/* Active Events */}
              <div>
                <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Yaklaşan Etkinlikler</h3>
                {activeEvents.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-500">Şu an planlanmış yaklaşan etkinlik yok.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </div>

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Geçmiş Etkinlikler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-75">
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} isPast />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>
        <Footer />
      </div>
    </div>
  );
}


