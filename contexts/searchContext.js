import * as React from 'react';
import { AsyncStorage } from 'react-native';
import { flatten, isEqual, difference } from 'lodash';
import { getBooksInGroup, addCheckForResources } from '../containers/resources/resources';

const ResourcesGroupsKey = 'RabotenuResourceGroups';
const ResourcesGroupSelectedKey = 'RabotenuResourceGroupSelected';
const ResourcesSearchType = 'ResourcesSearchType';
const SearchHistoryType = 'SearchHistoryType';


export const SearchContext = React.createContext();

export const SearchProvider = ({ children }) => {
    const [searchInput, setSearchInput] = React.useState('');
    const [bookResult, setBookResult] = React.useState([]);
    const [searchType, setSearchType] = React.useState('exact');
    const [tableInput, setTableInput] = React.useState([[]]);
    const [allResourceToggle, setResourceToggle] = React.useState(false);
    const [selectedGroup, setSelectedGroup] = React.useState('');
    const [notSearchGroups, setNotSearchGroups] = React.useState({});
    const [notSearchBooks, setNotSearchBooks] = React.useState({});
    const [searchHistory, setSearchHistory] = React.useState([]);
    const [resourcesGroups, setResourcesGroups] = React.useState({});
    const [resources, setResources] = React.useState([]);
    const [removeResources, setRemoveResources] = React.useState([]);

    const [resourcesData, setData] = React.useState([]);

    React.useEffect(() => {
        if (allResourceToggle) {
            if (resourcesData && resourcesData.length) {
                setResources(addCheckForResources(resourcesData, true))
            }
        }
    }, [allResourceToggle]);
    React.useEffect(() => {
        if (resourcesGroups[selectedGroup]) {
            setResources(resourcesGroups[selectedGroup].resources)
        }
    }, [selectedGroup]);

    React.useEffect(() => {
        const allBooks = flatten(getBooksInGroup(resources, true).map(resource => resource.booksId));
        const books = flatten(getBooksInGroup(resources, false).map(resource => resource.booksId));
        const isAllResource = isEqual(allBooks, difference(allBooks, books))
        if (isAllResource) {
            setSelectedGroup('')
        }
        setResourceToggle(isAllResource);
    }, [resources]);

    React.useEffect(() => {
        const books = flatten(getBooksInGroup(resources, false).map(resource => resource.booksId));
        const groups = flatten(getBooksInGroup(resources, false).filter(resource => !!resource.groupIds).map(resource => resource.groupIds))

        setNotSearchGroups(groups)
        setNotSearchBooks(books)
    }, [removeResources, resources]);


    React.useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.getItem(ResourcesGroupSelectedKey)
                const jsonValue = value != null ? JSON.parse(value) : null;
                if (jsonValue !== null) {
                    setSelectedGroup(jsonValue)
                    if (resourcesGroups[selectedGroup]) {
                        setResources(resourcesGroups[selectedGroup].resources)
                    }
                }
            } catch (e) {
                console.log(e);
            }
        })()
    }, [resourcesGroups])

    React.useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.getItem(ResourcesGroupsKey)
                const jsonValue = value != null ? JSON.parse(value) : null;
                if (jsonValue !== null) {
                    setResourcesGroups(jsonValue)
                }
            } catch (e) {
                console.log(e);
            }
        })()
    }, [])
    React.useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.getItem(ResourcesSearchType)
                const jsonValue = value != null ? JSON.parse(value) : null;
                if (jsonValue !== null) {
                    setSearchType(jsonValue)
                }
            } catch (e) {
                console.log(e);
            }
        })()
    }, [])
    React.useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.getItem(SearchHistoryType)
                const jsonValue = value != null ? JSON.parse(value) : null;
                if (jsonValue !== null) {
                    setSearchHistory(jsonValue)
                }
            } catch (e) {
                console.log(e);
            }
        })()
    }, [])


    React.useEffect(() => {
        (async () => {
            try {
                const jsonValue = JSON.stringify(selectedGroup)
                await AsyncStorage.setItem(ResourcesGroupSelectedKey, jsonValue)
            } catch (e) {
                console.log(e);
            }
        })()
    }, [selectedGroup])
    React.useEffect(() => {
        (async () => {
            try {
                const jsonValue = JSON.stringify(searchType)
                await AsyncStorage.setItem(ResourcesSearchType, jsonValue)
            } catch (e) {
                console.log(e);
            }
        })()
    }, [searchType])
    React.useEffect(() => {
        (async () => {
            try {
                const jsonValue = JSON.stringify(searchHistory)
                await AsyncStorage.setItem(SearchHistoryType, jsonValue)
            } catch (e) {
                console.log(e);
            }
        })()
    }, [searchHistory])





    React.useEffect(() => {
        (async () => {
            try {
                const jsonValue = JSON.stringify(resourcesGroups)
                await AsyncStorage.setItem(ResourcesGroupsKey, jsonValue)
            } catch (e) {
                console.log(e);
            }
        })()
    }, [resourcesGroups])

    const setSearchCb = (search) => {
        if(search.length > 30){
            const newSearchHistory = search.slice(0, -1);;
            setSearchHistory(newSearchHistory)
        }
        else{
            setSearchHistory(search)

        }
    }

    return (
        <SearchContext.Provider value={{ setNotSearchGroups,setNotSearchBooks ,setSearchHistory:setSearchCb,searchHistory, searchInput, selectedGroup, setSelectedGroup, notSearchBooks, removeResources, allResourceToggle, setResourceToggle, notSearchGroups, setRemoveResources, setResourcesGroups, resourcesData, setData, resourcesGroups, resources, setResources, searchType, setSearchType, tableInput, setTableInput, searchType, bookResult, setSearchInput, setSearchType, setBookResult }}>
            {children}
        </SearchContext.Provider>
    )
}



