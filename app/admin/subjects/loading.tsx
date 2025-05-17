import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default function Loading() {
    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Skeleton className="h-4 w-20" />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Skeleton className="h-4 w-16" />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Skeleton className="h-4 w-24" />
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div>
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-4 w-[350px] mt-2" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-[140px]" />
                        <Skeleton className="h-10 w-[120px]" />
                    </div>
                </div>

                <div className="rounded-2xl border shadow-sm overflow-hidden">
                    <div className="p-4 bg-muted/30">
                        <div className="grid grid-cols-5 gap-4">
                            <Skeleton className="h-5 w-[80px]" />
                            <Skeleton className="h-5 w-[120px]" />
                            <Skeleton className="h-5 w-[60px]" />
                            <Skeleton className="h-5 w-[80px]" />
                            <Skeleton className="h-5 w-[60px]" />
                        </div>
                    </div>

                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 border-t">
                            <div className="grid grid-cols-5 gap-4">
                                <Skeleton className="h-5 w-[140px]" />
                                <Skeleton className="h-5 w-[200px]" />
                                <Skeleton className="h-5 w-[70px]" />
                                <Skeleton className="h-5 w-[100px]" />
                                <div className="flex justify-end gap-2">
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-[100px]" />
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-xl" />
                        <Skeleton className="h-8 w-8 rounded-xl" />
                        <Skeleton className="h-8 w-8 rounded-xl" />
                        <Skeleton className="h-8 w-8 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}
