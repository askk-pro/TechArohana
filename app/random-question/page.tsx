import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Filter, Shuffle } from "lucide-react"
import Link from "next/link"

export default function RandomQuestionPage() {
    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Random Question Picker</h1>
                    <p className="text-muted-foreground">Get a random question based on your filters</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Filters</CardTitle>
                                <CardDescription>Customize your random question selection</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Subjects" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Subjects</SelectItem>
                                            <SelectItem value="javascript">JavaScript</SelectItem>
                                            <SelectItem value="data-structures">Data Structures</SelectItem>
                                            <SelectItem value="algorithms">Algorithms</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Difficulty</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Any Difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">Any Difficulty</SelectItem>
                                            <SelectItem value="easy">Easy</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Question Type</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Any Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">Any Type</SelectItem>
                                            <SelectItem value="conceptual">Conceptual</SelectItem>
                                            <SelectItem value="theory">Theory</SelectItem>
                                            <SelectItem value="practical">Practical</SelectItem>
                                            <SelectItem value="coding">Coding</SelectItem>
                                            <SelectItem value="scenario">Scenario</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label className="text-base">Status Filters</Label>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="unread" />
                                            <Label htmlFor="unread">Only Unread</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="not-understood" />
                                            <Label htmlFor="not-understood">Not Understood Yet</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="not-confident" />
                                            <Label htmlFor="not-confident">Not Confident Yet</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="important" />
                                            <Label htmlFor="important">Only Important</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="exclude-snoozed" defaultChecked />
                                            <Label htmlFor="exclude-snoozed">Exclude Snoozed</Label>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label>Minimum Priority</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Any Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Any Priority</SelectItem>
                                            <SelectItem value="3">3+</SelectItem>
                                            <SelectItem value="5">5+</SelectItem>
                                            <SelectItem value="7">7+</SelectItem>
                                            <SelectItem value="9">9+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button className="w-full">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Apply Filters
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        <Card className="h-full flex flex-col">
                            <CardHeader>
                                <CardTitle>Your Random Question</CardTitle>
                                <CardDescription>Click the button to get a random question based on your filters</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col items-center justify-center gap-6 py-10">
                                <div className="text-center space-y-4">
                                    <Shuffle className="mx-auto h-16 w-16 text-muted-foreground" />
                                    <div>
                                        <h2 className="text-xl font-semibold">Ready to test your knowledge?</h2>
                                        <p className="text-muted-foreground mt-1">Click the button below to get a random question</p>
                                    </div>
                                </div>
                                <Button size="lg" className="gap-2">
                                    <Shuffle className="h-5 w-5" />
                                    Get Random Question
                                </Button>
                            </CardContent>
                            <CardFooter className="border-t p-4">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex gap-2">
                                        <Badge variant="outline">JavaScript</Badge>
                                        <Badge variant="outline">Medium</Badge>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/question/123">
                                            View Last Question
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
