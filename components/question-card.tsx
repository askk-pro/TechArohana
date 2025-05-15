import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Star, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionCardProps {
    title: string
    difficulty: "Easy" | "Medium" | "Hard"
    tags: string[]
    isTopQuestion: boolean
    isRead: boolean
    isUnderstood: boolean
    knowsAnswer: boolean
    isConfident: boolean
    isImportant: boolean
    priority: number
}

export function QuestionCard({
    title,
    difficulty,
    tags,
    isTopQuestion,
    isRead,
    isUnderstood,
    knowsAnswer,
    isConfident,
    isImportant,
    priority,
}: QuestionCardProps) {
    const difficultyColor = {
        Easy: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
        Medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
        Hard: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    }

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-4 pb-0">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold line-clamp-2">{title}</h3>
                    <Star
                        className={cn(
                            "h-5 w-5 flex-shrink-0 cursor-pointer",
                            isImportant ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                        )}
                    />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="outline" className={difficultyColor[difficulty]}>
                        {difficulty}
                    </Badge>
                    {isTopQuestion && (
                        <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                            Top Question
                        </Badge>
                    )}
                    {tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                            +{tags.length - 2}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id={`read-${title}`} checked={isRead} />
                        <Label htmlFor={`read-${title}`} className="text-sm">
                            Read
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id={`understood-${title}`} checked={isUnderstood} />
                        <Label htmlFor={`understood-${title}`} className="text-sm">
                            Understood
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id={`knows-${title}`} checked={knowsAnswer} />
                        <Label htmlFor={`knows-${title}`} className="text-sm">
                            Know Answer
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id={`confident-${title}`} checked={isConfident} />
                        <Label htmlFor={`confident-${title}`} className="text-sm">
                            Confident
                        </Label>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4 pt-3">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium">Priority:</span>
                    <Badge variant={priority >= 7 ? "default" : "secondary"} className="px-1.5 py-0">
                        {priority}/10
                    </Badge>
                </div>
                <a href="#" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <span>View</span>
                    <ExternalLink className="h-3 w-3" />
                </a>
            </CardFooter>
        </Card>
    )
}
