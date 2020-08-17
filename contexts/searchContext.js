import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { flatten, isEqual, difference } from 'lodash';
import { getBooksInGroup, addCheckForResources } from '../containers/resources/resources';

const ResourcesGroupsKey = 'RabotenuResourceGroups';
const ResourcesGroupSelectedKey = 'RabotenuResourceGroupSelected';
const ResourcesSearchType = 'ResourcesSearchType';


export const SearchContext = React.createContext();

export const SearchProvider = ({ children }) => {
    const [searchInput, setSearchInput] = React.useState('');
    const [bookResult, setBookResult] = React.useState([]);
    const [searchType, setSearchType] = React.useState('exact');
    const [tableInput, setTableInput] = React.useState([[]]);
    const [allResourceToggle, setResourceToggle] = React.useState(false);
    const [selectedGroup, setSelectedGroup] = React.useState('');

    const [resourcesGroups, setResourcesGroups] = React.useState({});
    const [resources, setResources] = React.useState([]);
    const [removeResources, setRemoveResources] = React.useState([]);

    const [resourcesData, setData] = React.useState([]);
    React.useEffect(() => {
        const allBooks = flatten(getBooksInGroup(resources, true).map(resource => resource.booksId));
        const books = flatten(getBooksInGroup(resources, false).map(resource => resource.booksId));
        const isAllResource = isEqual(allBooks, difference(allBooks, books))
        setResourceToggle(isAllResource);
    }, []);
    React.useEffect(() => {
        if (allResourceToggle) {
            if (resourcesData && resourcesData.length) {
                setResources(addCheckForResources(resourcesData, true))
            }
        }
    }, [allResourceToggle]);
    React.useEffect(() => {
        if(resourcesGroups[selectedGroup]){
            setResources(resourcesGroups[selectedGroup].resources)
        }
    }, [selectedGroup]);

    React.useEffect(() => {
        const allBooks = flatten(getBooksInGroup(resources, true).map(resource => resource.booksId));
        const books = flatten(getBooksInGroup(resources, false).map(resource => resource.booksId));
        const isAllResource = isEqual(allBooks, difference(allBooks, books))
        if(isAllResource){
            setSelectedGroup('')
        }
        setResourceToggle(isAllResource);
    }, [resources]);
    

    const notSearchGroupAndBooks = () => {
        const groups = removeResources.filter(resource => !!resource.groupIds).map(resource => resource.groupIds)
        const books = flatten(removeResources.filter(resource => !resource.groupIds).map(resource => resource.booksId))
        return { groups, books }
    }

    React.useEffect(() => {
        console.log(resources, resourcesGroups);
    }, [resources])

    React.useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.getItem(ResourcesGroupSelectedKey)
                const jsonValue = value != null ? JSON.parse(value) : null;
                if (jsonValue !== null) {
                    setSelectedGroup(jsonValue)
                    console.log(resourcesGroups);
                    if(resourcesGroups[selectedGroup]){
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
                const jsonValue = JSON.stringify(resourcesGroups)
                await AsyncStorage.setItem(ResourcesGroupsKey, jsonValue)
            } catch (e) {
                console.log(e);
            }
        })()
    }, [resourcesGroups])

    return (
        <SearchContext.Provider value={{ searchInput,selectedGroup, setSelectedGroup, removeResources,allResourceToggle, setResourceToggle, notSearchGroupAndBooks, setRemoveResources, setResourcesGroups, resourcesData, setData, resourcesGroups, resources, setResources, searchType, setSearchType, tableInput, setTableInput, searchType, bookResult, setSearchInput, setSearchType, setBookResult }}>
            {children}
        </SearchContext.Provider>
    )
}



