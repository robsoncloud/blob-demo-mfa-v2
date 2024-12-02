import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type RequestFilter = {
    filter?: "ticket" | "username" | "hostname";
    search?: string;
};

export function useRequestFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Get current filter and search values from the URL
    const filter = searchParams.get("filter");
    const search = searchParams.get("search");

    // Memoize the setFilter function to prevent unnecessary re-renders
    const setFilter = useCallback((newFilter: RequestFilter) => {
        setSearchParams((params) => {
            // Set or remove 'filter' and 'search' based on the input
           ;params.set("filter", newFilter.filter);
            params.set("search", newFilter.search);
                
            return params;
        });
    }, []);

    return { filter, search, setFilter };
}
