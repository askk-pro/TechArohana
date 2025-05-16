import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="space-y-4">
            <div>
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-4 w-[350px] mt-2" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-[120px]" />
                </div>

                <div className="rounded-md border">
                    <div className="p-4">
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-[200px]" />
                                        <Skeleton className="h-4 w-[300px]" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-[100px]" />
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    )
}
