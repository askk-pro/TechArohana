import { getSubtopics } from "@/app/actions/subtopics"
import { SubtopicsTable } from "@/components/subtopics/subtopics-table"

export default async function SubtopicsPage({
    searchParams,
}: {
    searchParams: { page?: string; per_page?: string; search?: string; shelved?: string; topic_id?: string }
}) {
    // Get current page and items per page from query params
    const page = Number(searchParams.page) || 1
    const pageSize = Number(searchParams.per_page) || 10
    const search = searchParams.search || ""
    const showShelved = searchParams.shelved === "true"
    const topicId = searchParams.topic_id || ""

    // Fetch subtopics using the server action
    const {
        data: subtopics,
        count,
        pageCount,
    } = await getSubtopics({
        page,
        pageSize,
        search,
        showShelved,
        topicId,
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Subtopics</h1>
                <p className="text-muted-foreground">Manage your interview preparation subtopics</p>
            </div>

            <SubtopicsTable
                data={subtopics || []}
                pageCount={pageCount}
                currentPage={page}
                pageSize={pageSize}
                searchQuery={search}
                topicId={topicId}
            />
        </div>
    )
}
