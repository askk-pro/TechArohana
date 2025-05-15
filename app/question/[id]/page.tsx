import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Github,
    Plus,
    Star,
    Trash2,
    X,
} from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

type PageProps = {
    params: {
        id: string
    }
}

export default function QuestionPage({ params }: PageProps) {
    // Mock data for a question
    const question = {
        id: params.id,
        title: "Explain closures in JavaScript and provide a practical example",
        difficulty: "Medium",
        tags: ["JavaScript", "Functions", "Scope", "Interview"],
        isTopQuestion: true,
        gistId: "abc123def456",
        questionFile: "question.md",
        answerFile: "answer.md",
        codeFiles: ["example.js"],
        isRead: true,
        isUnderstood: true,
        knowsAnswer: false,
        isConfident: false,
        isImportant: true,
        priority: 8,
        questionType: "Conceptual",
        comments: [
            {
                id: "1",
                text: "Remember to mention lexical environment and variable access after function execution.",
                isAdditionalAnswer: false,
                createdAt: "2023-05-15T10:30:00Z",
            },
        ],
        sandboxUrls: [
            {
                id: "1",
                url: "https://replit.com/@username/closure-example",
                description: "Basic closure example",
            },
        ],
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="mb-6 flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous</span>
                    </Button>
                    <Button variant="outline" size="sm">
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next</span>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                                            {question.difficulty}
                                        </Badge>
                                        {question.isTopQuestion && (
                                            <Badge variant="outline" className="bg-primary/10 text-primary">
                                                Top Question
                                            </Badge>
                                        )}
                                        <Badge variant="outline">{question.questionType}</Badge>
                                    </div>
                                    <CardTitle className="text-2xl">{question.title}</CardTitle>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {question.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={question.isImportant ? "text-yellow-400" : "text-muted-foreground"}
                                >
                                    <Star className={question.isImportant ? "fill-yellow-400" : ""} />
                                    <span className="sr-only">Mark as important</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="question">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="question">Question</TabsTrigger>
                                    <TabsTrigger value="answer">Answer</TabsTrigger>
                                    <TabsTrigger value="code">Code</TabsTrigger>
                                </TabsList>
                                <TabsContent value="question" className="mt-4">
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p>Explain what closures are in JavaScript and how they work. Include:</p>
                                        <ul>
                                            <li>Definition of a closure</li>
                                            <li>How lexical scoping relates to closures</li>
                                            <li>Common use cases for closures</li>
                                            <li>Potential memory implications</li>
                                        </ul>
                                        <p>Provide a practical example that demonstrates the concept clearly.</p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="gap-1.5">
                                            <Github className="h-4 w-4" />
                                            View on GitHub
                                        </Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="answer" className="mt-4">
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p>
                                            A closure is the combination of a function bundled together with references to its surrounding
                                            state (the lexical environment). In JavaScript, closures are created every time a function is
                                            created, at function creation time.
                                        </p>

                                        <p>
                                            A closure allows a function to access variables from an outer function even after the outer
                                            function has returned. This is possible because:
                                        </p>

                                        <ul>
                                            <li>
                                                JavaScript uses lexical scoping, which means that functions are executed using the variable
                                                scope that was in effect when they were defined, not the variable scope that is in effect when
                                                they are executed.
                                            </li>
                                            <li>
                                                When a function is defined inside another function, it has access to the variable scope of the
                                                outer function.
                                            </li>
                                        </ul>

                                        <p>Common use cases include:</p>
                                        <ul>
                                            <li>Data privacy / creating private variables</li>
                                            <li>Function factories</li>
                                            <li>Implementing modules</li>
                                            <li>Event handlers and callbacks</li>
                                        </ul>

                                        <p>
                                            Regarding memory, closures can lead to memory leaks if not handled properly, as they prevent
                                            variables from being garbage collected as long as the function that forms the closure exists.
                                        </p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="code" className="mt-4">
                                    <pre className="rounded-md bg-muted p-4 overflow-x-auto">
                                        <code className="text-sm">
                                            {`// Basic closure example
function createCounter() {
  let count = 0;
  
  return function() {
    count += 1;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// The inner function has access to the count variable
// even after createCounter() has finished execution`}
                                        </code>
                                    </pre>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Comments & Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {question.comments.map((comment) => (
                                    <div key={comment.id} className="rounded-md border p-3">
                                        <div className="flex items-start justify-between">
                                            <p className="text-sm">{comment.text}</p>
                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {comment.isAdditionalAnswer ? "Additional Answer" : "Note"}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <Textarea placeholder="Add a comment or note..." className="min-h-[100px]" />
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="additional-answer" />
                                        <Label htmlFor="additional-answer" className="text-sm">
                                            Mark as additional answer
                                        </Label>
                                    </div>
                                    <Button>Add Comment</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Sandbox URLs</CardTitle>
                            <CardDescription>Add links to your code implementations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {question.sandboxUrls.map((sandbox) => (
                                    <div key={sandbox.id} className="flex items-center justify-between rounded-md border p-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={sandbox.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium hover:underline flex items-center gap-1"
                                                >
                                                    {sandbox.url.split("/").pop()}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{sandbox.description}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 grid gap-2">
                                <div className="grid grid-cols-3 gap-2">
                                    <Input placeholder="URL" className="col-span-2" />
                                    <Input placeholder="Description" />
                                </div>
                                <Button className="w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Sandbox URL
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Learning Tracker</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="read" checked={question.isRead} />
                                        <Label htmlFor="read">Mark as Read</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="understood" checked={question.isUnderstood} />
                                        <Label htmlFor="understood">Understood</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="knows-answer" checked={question.knowsAnswer} />
                                        <Label htmlFor="knows-answer">I Know the Answer</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="confident" checked={question.isConfident} />
                                        <Label htmlFor="confident">I'm Confident</Label>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority (0-10)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input id="priority" type="number" min="0" max="10" value={question.priority} className="w-20" />
                                        <Badge variant={question.priority >= 7 ? "default" : "secondary"}>
                                            {question.priority >= 8 ? "High" : question.priority >= 5 ? "Medium" : "Low"}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label>Snooze Until</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                <span>Pick a date</span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label htmlFor="question-type">Question Type</Label>
                                    <Select defaultValue={question.questionType}>
                                        <SelectTrigger id="question-type">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Conceptual">Conceptual</SelectItem>
                                            <SelectItem value="Theory">Theory</SelectItem>
                                            <SelectItem value="Practical">Practical</SelectItem>
                                            <SelectItem value="Coding">Coding</SelectItem>
                                            <SelectItem value="Scenario">Scenario</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label>Tags</Label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {question.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                                {tag}
                                                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent">
                                                    <X className="h-3 w-3" />
                                                    <span className="sr-only">Remove {tag}</span>
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Input placeholder="Add tag..." className="flex-1" />
                                        <Button size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Reset</Button>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: `Question: ${params.id}`,
        description: "View and manage this interview question",
    }
}
