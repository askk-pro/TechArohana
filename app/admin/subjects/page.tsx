import { getSubjects } from "@/app/actions/subjects"
import { SubjectsTable } from "@/components/subjects/subjects-table"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, Layers } from "lucide-react"

export default async function SubjectsPage({
    searchParams,
}: {
    searchParams: { page?: string; per_page?: string; search?: string; shelved?: string }
}) {
    // Get current page and items per page from query params
    const page = Number(searchParams.page) || 1
    const pageSize = Number(searchParams.per_page) || 10
    const search = searchParams.search || ""
    const showShelved = searchParams.shelved === "true"

    // Fetch subjects using the server action
    const {
        data: subjects,
        count,
        pageCount,
    } = await getSubjects({
        page,
        pageSize,
        search,
        showShelved,
    })

    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">
                            <Home className="h-3.5 w-3.5 mr-1" />
                            Dashboard
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/subjects" className="flex items-center">
                            <Layers className="h-3.5 w-3.5 mr-1" />
                            Subjects
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div>
                <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
                <p className="text-muted-foreground">Manage your interview preparation subjects</p>
            </div>

            <SubjectsTable
                data={subjects || []}
                pageCount={pageCount}
                currentPage={page}
                pageSize={pageSize}
                searchQuery={search}
            />
        </div>
    )
}
