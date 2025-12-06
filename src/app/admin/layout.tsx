import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="hidden lg:fixed lg:top-20 lg:bottom-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
                <AdminSidebar />
            </div>
            <div className="lg:pl-72 w-full">
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
