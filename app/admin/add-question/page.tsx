import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"

export default function AddQuestionPage() {
    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="mb-6 flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/questions">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Add New Question</h1>
                    <p className="text-muted-foreground">Create a new interview question</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Question Details</CardTitle>
                            <CardDescription>Basic information about the question</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Question Title</Label>
                                <Input id="title" placeholder="Enter question title" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="difficulty">Difficulty</Label>
                                    <Select>
                                        <SelectTrigger id="difficulty">
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Easy">Easy</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="question-type">Question Type</Label>
                                    <Select>
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority (0-10)</Label>
                                <Input id="priority" type="number" min="0" max="10" defaultValue="5" />
                            </div>

                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <div className="flex flex-wrap gap-1.5">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        JavaScript
                                        <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent">
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove JavaScript</span>
                                        </Button>
                                    </Badge>
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Functions
                                        <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent">
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove Functions</span>
                                        </Button>
                                    </Badge>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Input placeholder="Add tag..." className="flex-1" />
                                    <Button size="sm">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Subject, Topic & Sub-Topic</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="javascript">JavaScript</SelectItem>
                                            <SelectItem value="data-structures">Data Structures</SelectItem>
                                            <SelectItem value="algorithms">Algorithms</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="core-concepts">Core Concepts</SelectItem>
                                            <SelectItem value="advanced-js">Advanced JS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sub-Topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="closures">Closures</SelectItem>
                                            <SelectItem value="promises">Promises & Async</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>GitHub Gist Details</CardTitle>
                            <CardDescription>Link to the GitHub Gist containing the question and answer</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="gist-id">Gist ID</Label>
                                <Input id="gist-id" placeholder="e.g., abc123def456" />
                                <p className="text-xs text-muted-foreground">
                                    The ID from the Gist URL: https://gist.github.com/username/
                                    <span className="font-medium">gist-id</span>
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label htmlFor="question-file">Question Filename</Label>
                                <Input id="question-file" placeholder="e.g., question.md" defaultValue="question.md" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="answer-file">Answer Filename</Label>
                                <Input id="answer-file" placeholder="e.g., answer.md" defaultValue="answer.md" />
                            </div>

                            <div className="space-y-2">
                                <Label>Code Files</Label>
                                <div className="space-y-2">
                                    <Input placeholder="e.g., example.js" />
                                    <div className="flex justify-end">
                                        <Button variant="outline" size="sm">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add File
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                            <CardDescription>Optional details about the question</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter additional description or notes"
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="top-question" className="h-4 w-4 rounded border-gray-300" />
                                <Label htmlFor="top-question">Mark as Top Question</Label>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Cancel</Button>
                            <Button>Create Question</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
