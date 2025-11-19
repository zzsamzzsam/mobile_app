/* eslint-disable prettier/prettier */
import { useState, useMemo } from 'react';

const useSearch = (initialData, filterFunction) => {
    const [query, setQuery] = useState('');

    const filteredData = useMemo(() => {
        if (!query) return initialData;
        return initialData.filter(item => filterFunction(item, query));
    }, [initialData, query, filterFunction]);

    return { query, setQuery, filteredData };
};

export default useSearch;
