import * as React from 'react';

export const SearchContext = React.createContext();

export const SearchProvider = ({ children }) => {
    const [searchInput, setSearchInput] = React.useState('');
    const [searchType, setSearchType] = React.useState('');
    const [bookResult,setBookResult] = React.useState([]);
    

    return (
        <SearchContext.Provider value={{searchInput, searchType,bookResult,setSearchInput,setSearchType,setBookResult}}>
            {children}
        </SearchContext.Provider>
    )
}



