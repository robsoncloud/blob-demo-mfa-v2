import { ChevronDown, FilterIcon, SearchIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";

import { useRequestFilter } from "@/utils/useRequestFilter";

const SearchBar = () => {
    const [searchKey, setSearchKey] = useState(""); // For search input value
    const [selectedFilter, setSelectedFilter] = useState("ticket"); // Track the selected filter
    const { filter, search, setFilter } = useRequestFilter();



    const handleSearchChange = (e) => {
        e.preventDefault(); 
        
        // setSearchKey(e.target.value);
    
        if (e.target.value.trim() === "") {
            // If the input is cleared, remove the search query from the URL
            setFilter({ filter: filter, search: "" });
        } else {
            // Otherwise, update the URL with the search query
            setFilter({ filter: filter, search: e.target.value });
        }
    };


    const handleSelectFilter = (value: string) => {
        
        setFilter({ filter: value, search: searchKey || "" }); // Ensure search is not undefined
    };

    return (
        <div className="flex flex-row items-center h-9 rounded-lg shadow-sm">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex flex-row items-center h-full px-5 rounded-l-lg border gap-2 text-sm">
                    <FilterIcon className="w-4 h-4" fill="currentColor" />
                    {filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : "Filter"} {/* Display the selected ticket filter */}
                    <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {/* Pass selected ticket as argument to handleSelectTicket */}
                    <DropdownMenuItem onClick={() => handleSelectFilter("ticket")}>Ticket</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSelectFilter("username")}>Username</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSelectFilter("hostname")}>Hostname</DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-row items-center rounded-r-lg border border-l-0 h-full relative">
                <SearchIcon className="w-4 h-4 ml-2 absolute text-gray-400" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="h-full py-0 px-3 border-none text-sm w-72 rounded-r-lg pl-8"
                    value={search}  // Bind the search key to the input field
                    onChange={handleSearchChange} // Update search key state on input change
                />
            </div>
        </div>
    );
};

export default SearchBar;
