import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const ResourcesGroupsKey = 'RabotenuResourceGroups';
export const SearchContext = React.createContext();

export const SearchProvider = ({ children }) => {
    const [searchInput, setSearchInput] = React.useState('');
    const [bookResult, setBookResult] = React.useState([]);
    const [searchType, setSearchType] = React.useState('exact');
    const [tableInput, setTableInput] = React.useState([[]]);

    const [resourcesGroups, setResourcesGroups] = React.useState({});
    const [resources, setResources] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            try {
                const value = await AsyncStorage.getItem(ResourcesGroupsKey)
                const jsonValue = value != null ? JSON.parse(value) : null;
                console.log({ jsonValue });
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
                const jsonValue = JSON.stringify(resourcesGroups)
                await AsyncStorage.setItem(ResourcesGroupsKey, jsonValue)
            } catch (e) {
                console.log(e);
            }
        })()


    }, [resourcesGroups])

    return (
        <SearchContext.Provider value={{ searchInput, setResourcesGroups, resourcesGroups, resources, setResources, searchType, setSearchType, tableInput, setTableInput, searchType, bookResult, setSearchInput, setSearchType, setBookResult }}>
            {children}
        </SearchContext.Provider>
    )
}



