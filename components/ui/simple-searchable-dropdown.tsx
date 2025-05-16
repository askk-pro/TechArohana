"use client"

import * as React from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface Option {
    value: string
    label: string
}

interface SimpleSearchableDropdownProps {
    options: Option[]
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    className?: string
}

export function SimpleSearchableDropdown({
    options,
    value,
    onValueChange,
    placeholder = "Select an option",
    disabled = false,
    className,
}: SimpleSearchableDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    // Find the selected option for display
    const selectedOption = options.find((option) => option.value === value)

    // Filter options based on search query
    const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))

    // Handle click outside to close dropdown
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    // Handle option selection
    const handleSelect = (option: Option) => {
        onValueChange(option.value)
        setIsOpen(false)
        setSearchQuery("")
    }

    return (
        <div className={cn("relative w-full", className)} ref={dropdownRef}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between text-ellipsis overflow-hidden whitespace-nowrap"
                            onClick={() => !disabled && setIsOpen(!isOpen)}
                            disabled={disabled}
                        >
                            <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                            <ChevronDown
                                className={cn("ml-2 h-4 w-4 shrink-0 opacity-50 flex-none", isOpen && "rotate-180 transform")}
                            />
                        </Button>
                    </TooltipTrigger>
                    {selectedOption && (
                        <TooltipContent side="bottom" className="max-w-[300px] break-words">
                            {selectedOption.label}
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-input bg-background shadow-lg">
                    <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div className="max-h-60 overflow-auto p-1">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm">No results found.</div>
                        ) : (
                            filteredOptions.map((option) => (
                                <TooltipProvider key={option.value}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={cn(
                                                    "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm",
                                                    "hover:bg-accent hover:text-accent-foreground",
                                                    value === option.value && "bg-accent text-accent-foreground",
                                                )}
                                                onClick={() => handleSelect(option)}
                                            >
                                                <Check
                                                    className={cn("mr-2 h-4 w-4 flex-none", value === option.value ? "opacity-100" : "opacity-0")}
                                                />
                                                <span className="truncate">{option.label}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="max-w-[300px] break-words">
                                            {option.label}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
