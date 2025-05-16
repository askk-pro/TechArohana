import { Skeleton } from "@/components/ui/skeleton"
import { Layers } from "lucide-react"

export default function Loading() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-4 w-[350px] mt-2" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-[120px]" />
                </div>

                <div className="rounded-2xl border shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <Layers className="h-12 w-12 mb-4 opacity-20" />
                            <div className="text-center space-y-2">
                                <Skeleton className="h-5 w-[180px] mx-auto" />
                                <Skeleton className="h-4 w-[240px] mx-auto" />
                            </div>
                        </div>
                    </div>
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
