import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Plus, Search } from "lucide-react"

export default function GlossaryPage() {
    // Mock data for glossary terms
    const glossaryTerms = {
        javascript: [
            {
                term: "Closure",
                definition:
                    "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).",
            },
            {
                term: "Hoisting",
                definition: "JavaScript's default behavior of moving declarations to the top of the current scope.",
            },
            {
                term: "Promise",
                definition: "An object representing the eventual completion or failure of an asynchronous operation.",
            },
            {
                term: "Event Loop",
                definition: "A programming construct that waits for and dispatches events or messages in a program.",
            },
            { term: "Prototype", definition: "A mechanism by which JavaScript objects inherit features from one another." },
            {
                term: "Callback",
                definition:
                    "A function passed into another function as an argument, which is then invoked inside the outer function.",
            },
            {
                term: "Lexical Scope",
                definition: "The scope defined by the location where a variable is declared in the source code.",
            },
            {
                term: "Temporal Dead Zone",
                definition:
                    "The period between entering scope and being declared where let and const variables cannot be accessed.",
            },
        ],
        dataStructures: [
            { term: "Array", definition: "A collection of elements identified by index or key." },
            {
                term: "Linked List",
                definition:
                    "A linear collection of data elements whose order is not given by their physical placement in memory.",
            },
            { term: "Stack", definition: "A collection of elements with two main operations: push and pop." },
            { term: "Queue", definition: "A collection of elements that follows the First In, First Out (FIFO) principle." },
            { term: "Tree", definition: "A widely used data structure that simulates a hierarchical tree structure." },
            { term: "Graph", definition: "A non-linear data structure consisting of nodes and edges." },
            { term: "Hash Table", definition: "A data structure that implements an associative array abstract data type." },
        ],
        algorithms: [
            {
                term: "Binary Search",
                definition: "A search algorithm that finds the position of a target value within a sorted array.",
            },
            {
                term: "Depth-First Search",
                definition: "An algorithm for traversing or searching tree or graph data structures.",
            },
            {
                term: "Breadth-First Search",
                definition: "An algorithm for traversing or searching tree or graph data structures.",
            },
            {
                term: "Merge Sort",
                definition: "An efficient, stable, comparison-based, divide and conquer sorting algorithm.",
            },
            { term: "Quick Sort", definition: "An efficient sorting algorithm that uses a divide-and-conquer strategy." },
            {
                term: "Dynamic Programming",
                definition: "A method for solving complex problems by breaking them down into simpler subproblems.",
            },
        ],
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Topic Glossary</h1>
                    <p className="text-muted-foreground">Key terms and definitions for each topic</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search glossary terms..." className="pl-9" />
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Term
                    </Button>
                </div>

                <Tabs defaultValue="javascript" className="w-full">
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        <TabsTrigger value="dataStructures">Data Structures</TabsTrigger>
                        <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
                    </TabsList>

                    <TabsContent value="javascript" className="mt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {glossaryTerms.javascript.map((item, index) => (
                                <Card key={index}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            <CardTitle className="text-lg">{item.term}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{item.definition}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="dataStructures" className="mt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {glossaryTerms.dataStructures.map((item, index) => (
                                <Card key={index}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            <CardTitle className="text-lg">{item.term}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{item.definition}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="algorithms" className="mt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {glossaryTerms.algorithms.map((item, index) => (
                                <Card key={index}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                            <CardTitle className="text-lg">{item.term}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{item.definition}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
