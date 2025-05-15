import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle, Clock, Star, Filter, ArrowUpDown, Shuffle } from "lucide-react"
import { QuestionCard } from "@/components/question-card"

export default function Dashboard() {
    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Track your progress and continue your interview preparation</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">248</div>
                            <p className="text-xs text-muted-foreground">Across 12 subjects</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">124</div>
                            <Progress value={50} className="h-2" />
                            <p className="mt-1 text-xs text-muted-foreground">50% of all questions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Snoozed</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">18</div>
                            <p className="text-xs text-muted-foreground">Will appear in the next 7 days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Important</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">36</div>
                            <p className="text-xs text-muted-foreground">Marked as important</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Recent Questions</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm">
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                Sort
                            </Button>
                            <Button variant="default" size="sm">
                                <Shuffle className="mr-2 h-4 w-4" />
                                Random
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 md:w-auto">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="unread">Unread</TabsTrigger>
                            <TabsTrigger value="important">Important</TabsTrigger>
                            <TabsTrigger value="snoozed">Snoozed</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="mt-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <QuestionCard
                                    title="Explain closures in JavaScript"
                                    difficulty="Medium"
                                    tags={["JavaScript", "Functions", "Scope"]}
                                    isTopQuestion={true}
                                    isRead={true}
                                    isUnderstood={true}
                                    knowsAnswer={false}
                                    isConfident={false}
                                    isImportant={true}
                                    priority={8}
                                />
                                <QuestionCard
                                    title="Implement a binary search tree"
                                    difficulty="Hard"
                                    tags={["Data Structures", "Trees", "Algorithms"]}
                                    isTopQuestion={true}
                                    isRead={true}
                                    isUnderstood={true}
                                    knowsAnswer={true}
                                    isConfident={false}
                                    isImportant={true}
                                    priority={9}
                                />
                                <QuestionCard
                                    title="Explain the event loop in JavaScript"
                                    difficulty="Medium"
                                    tags={["JavaScript", "Async", "Runtime"]}
                                    isTopQuestion={false}
                                    isRead={true}
                                    isUnderstood={false}
                                    knowsAnswer={false}
                                    isConfident={false}
                                    isImportant={false}
                                    priority={5}
                                />
                                <QuestionCard
                                    title="Implement a debounce function"
                                    difficulty="Medium"
                                    tags={["JavaScript", "Functions", "Performance"]}
                                    isTopQuestion={false}
                                    isRead={false}
                                    isUnderstood={false}
                                    knowsAnswer={false}
                                    isConfident={false}
                                    isImportant={false}
                                    priority={4}
                                />
                                <QuestionCard
                                    title="Explain the virtual DOM in React"
                                    difficulty="Medium"
                                    tags={["React", "Performance", "Rendering"]}
                                    isTopQuestion={true}
                                    isRead={true}
                                    isUnderstood={true}
                                    knowsAnswer={true}
                                    isConfident={true}
                                    isImportant={true}
                                    priority={7}
                                />
                                <QuestionCard
                                    title="Implement a linked list"
                                    difficulty="Medium"
                                    tags={["Data Structures", "Linked Lists"]}
                                    isTopQuestion={false}
                                    isRead={true}
                                    isUnderstood={true}
                                    knowsAnswer={false}
                                    isConfident={false}
                                    isImportant={false}
                                    priority={6}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="unread" className="mt-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <QuestionCard
                                    title="Implement a debounce function"
                                    difficulty="Medium"
                                    tags={["JavaScript", "Functions", "Performance"]}
                                    isTopQuestion={false}
                                    isRead={false}
                                    isUnderstood={false}
                                    knowsAnswer={false}
                                    isConfident={false}
                                    isImportant={false}
                                    priority={4}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="important" className="mt-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <QuestionCard
                                    title="Explain closures in JavaScript"
                                    difficulty="Medium"
                                    tags={["JavaScript", "Functions", "Scope"]}
                                    isTopQuestion={true}
                                    isRead={true}
                                    isUnderstood={true}
                                    knowsAnswer={false}
                                    isConfident={false}
                                    isImportant={true}
                                    priority={8}
                                />
                                <QuestionCard
                                    title="Implement a binary search tree"
                                    difficulty="Hard"
                                    tags={["Data Structures", "Trees", "Algorithms"]}
                                    isTopQuestion={true}
                                    isRead={true}
                                    isUnderstood={true}
                                    knowsAnswer={true}
                                    isConfident={false}
                                    isImportant={true}
                                    priority={9}
                                />
                                <QuestionCard
                                    title="Explain the virtual DOM in React"
                                    difficulty="Medium"
                                    tags={["React", "Performance", "Rendering"]}
                                    isTopQuestion={true}
                                    isRead={true}
                                    isUnderstood={true}
                                    knowsAnswer={true}
                                    isConfident={true}
                                    isImportant={true}
                                    priority={7}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="snoozed" className="mt-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {/* No snoozed questions in this example */}
                                <div className="col-span-full text-center py-8">
                                    <p className="text-muted-foreground">No snoozed questions</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
