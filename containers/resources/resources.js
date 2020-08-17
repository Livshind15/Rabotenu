import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Toggle } from '@ui-kitten/components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Tabs from '../../component/tabs/tabs';
import TabButton from '../../component/tabButton/tabButton';
import ResourcesSearch from './searchResource';
import ResourcesTreeView from './resourcesTree';
import ResourcesGroups from './resourcesGroups';

import ErrorModel from '../../component/modalError/modalError';
import { flatten, isEqual, difference } from 'lodash';
import { Spinner } from '@ui-kitten/components';
import { SearchContext } from '../../contexts/searchContext';


const { Navigator, Screen } = createMaterialTopTabNavigator();

export const getBooksInGroup = (groups, allGroups) => {
    return groups.reduce((groups, group) => {
        let removeResource = { booksId: [], groupIds: '' }
        removeResource.booksId = (group.books || []).reduce((books, book) => {
            if (!book.isCheck || allGroups) {
                books.push(book.bookId)
            }
            return books;
        }, [])
        if (!group.isCheck || allGroups) {
            removeResource.groupIds = group.groupId;
        }
        groups.push(removeResource)

        if (group.subGroups && group.subGroups.length) {
            groups = [...groups, ...flatten(getBooksInGroup(group.subGroups, allGroups))]

        }
        return groups
    }, [])

}



export const getAllBooksFromGroups = (groups) => {
    return groups.reduce((resources, group) => {
        resources = [...resources, ...(group.books || []).reduce((books, book) => {
            if (book.isCheck) {
                books.push({ ...book, groupName: group.groupName, groupId: group.groupId })
            }

            return books;
        }, [])]

        if (group.subGroups && group.subGroups.length) {
            resources = [...resources, ...(getAllBooksFromGroups(group.subGroups))]

        }
        return resources;
    }, [])

}
export const removeResourceFromTree = (resources, keys) => {
    return resources.map(resource => {
        const books = resource.books.map(book => {
            if (keys.includes(book.bookId)) {
                return { ...book, isCheck: false }
            }
            return book
        })
        let subGroups = []
        if (resource.subGroups.length) {
            subGroups = removeResourceFromTree(resource.subGroups, keys)
        }
        return { ...resource, books, subGroups }
    })
}


export const addCheckForResources = (resources, check) => {
    return resources.map(resource => {
        const books = resource.books.map(book => {
            return { ...book, isCheck: check }
        })
        let subGroups = []
        if (resource.subGroups.length) {
            subGroups = addCheckForResources(resource.subGroups, check)
        }
        return { ...resource, books, subGroups, isCheck: check }
    })
}

const Resources = ({ navigation }) => {
    const {selectedGroup, setSelectedGroup, allResourceToggle, setResourceToggle, setResourcesGroups, resourcesGroups, resourcesData, resources, setRemoveResources, setResources } = React.useContext(SearchContext);
    const [showErrorModel, setShowErrorModel] = React.useState(false);
    console.log({ resources, resourcesGroups })

    // React.useEffect(() => {
    //     if (error) {
    //         setShowErrorModel(true);
    //     }
    // }, [error]);

   

    React.useEffect(() => {
        if (!selectedGroup.length && resourcesGroups[selectedGroup]) {
            setResourcesGroups({ ...{ ...resourcesGroups, [selectedGroup]: { groupName: resourcesGroups[selectedGroup].groupName, resources: resources } } });
        }
    }, [resources]);


    const resourcesTreeView = (props) => <ResourcesTreeView resources={resources} onRemoveResources={(removeResources, resourceTree) => {
        setResources(resourceTree)
        setRemoveResources(removeResources)
        setResourceToggle(false)
    }} {...props} />

    const resourcesSearch = (props) => <ResourcesSearch editParams={{
        edit: true, resources: resources, groupName: "", onSave: ({ resources, groupName, groupId }) => {
            setResourcesGroups({ ...resourcesGroups, [groupId]: { groupName, resources: resources } });
            setResources(resources)
            setSelectedGroup(groupId)
        }
    }} onRemove={(keys) => {
        setResources(removeResourceFromTree(resources, keys))

    }} onRemoveAll={() => {
        setResources(addCheckForResources(resourcesData, false))
    }} {...props} resources={getAllBooksFromGroups(resources)}
    />

    const resourcesGroupsView = (props) => <ResourcesGroups onSave={({ resources, groupName, groupId }) => {

        setResourcesGroups({ ...resourcesGroups, [groupId]: { groupName, resources: resources } });

        setResources(resources)
        setSelectedGroup(groupId)

    }} currResources={resources} groups={resourcesGroups} removeGroup={(id) => {
        const newGroups = resourcesGroups;
        delete newGroups[id]
        setResourcesGroups({ ...newGroups })
    }} selectedGroup={selectedGroup} onGroupSelect={(id) => {
        setSelectedGroup(id);
        setResources(resourcesGroups[id].resources)

    }} {...props} />


    return (
        <>
            {resourcesData && resourcesData.length ?
                <View style={styles.page}>
                    <ErrorModel errorMsg={"שגיאה בבקשה מהשרת של המאגרים"} errorTitle={'שגיאה'} visible={showErrorModel} setVisible={setShowErrorModel} />

                    <View style={styles.header}>
                        <Toggle checked={allResourceToggle} onChange={setResourceToggle} />
                        <Text style={styles.headerText}>חפש בכל המאגרים</Text>
                    </View>
                    <View style={styles.body}>
                        <Navigator initialRouteName='SearchResource' tabBar={props => <TopTabBar {...props} />}>
                            <Screen name='groupResource' component={resourcesGroupsView} />
                            <Screen name='SearchResource' component={resourcesSearch} />
                            <Screen name='TreeResource' component={resourcesTreeView} />
                        </Navigator>
                    </View>
                </View> : <View style={styles.spinnerContainer}>
                    <Spinner />
                </View>}
        </>
    )
}

const TopTabBar = ({ navigation, state }) => (
    <View style={styles.tabs}>
        <Tabs selectedIndex={state.index} onSelect={index => navigation.navigate(state.routeNames[index])}>
            <TabButton textStyle={{ fontSize: 16 }}>קבוצות</TabButton>
            <TabButton textStyle={{ fontSize: 16 }}>חיפוש מראה מקום</TabButton>
            <TabButton textStyle={{ fontSize: 16 }}>תצוגת עץ</TabButton>
        </Tabs>
    </View>
);

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        width: "100%",
        justifyContent: 'center',
        alignItems: "center"
    },
    tabs: {
        height: 60,
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        zIndex: 5,
    },
    page: {
        flex: 1,
        width: '100%'
    },
    headerText: {
        fontFamily: "OpenSansHebrew",
        fontSize: 18,
        paddingRight: 10,
        color: '#A8ADAC',
        textAlign: 'center'
    },
    body: {
        flex: 1,
        width: '100%',
    },
    header: {
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row-reverse',
        backgroundColor: '#FFFFFF'
    }
});

export default Resources;