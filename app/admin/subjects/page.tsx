import { getSubjects } from "@/app/actions/subjects"
import { SubjectsTable } from "@/components/subjects/subjects-table"

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
