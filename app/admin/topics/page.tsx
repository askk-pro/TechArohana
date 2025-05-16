import { getTopics } from "@/app/actions/topics"
import { TopicsTable } from "@/components/topics/topics-table"

export default async function TopicsPage({
    searchParams,
}: {
    searchParams: { page?: string; per_page?: string; search?: string; shelved?: string; subject_id?: string }
}) {
    // Get current page and items per page from query params
    const page = Number(searchParams.page) || 1
    const pageSize = Number(searchParams.per_page) || 10
    const search = searchParams.search || ""
    const showShelved = searchParams.shelved === "true"
    const subjectId = searchParams.subject_id || ""

    // Fetch topics using the server action
    const {
        data: topics,
        count,
        pageCount,
    } = await getTopics({
        page,
        pageSize,
        search,
        showShelved,
        subjectId,
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
                <p className="text-muted-foreground">Manage your interview preparation topics</p>
            </div>

            <TopicsTable
                data={topics || []}
                pageCount={pageCount}
                currentPage={page}
                pageSize={pageSize}
                searchQuery={search}
                subjectId={subjectId}
            />
        </div>
    )
}
