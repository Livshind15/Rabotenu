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
import { Spinner } from '@ui-kitten/components';
import { SearchContext } from '../../contexts/searchContext';
import { RabotenuContext } from '../../contexts/applicationContext';
import { changeCheckById } from '../../component/resourcesTree/resourceTree';
import {  addCheckForResources,getAllBooksFromGroups } from './resources.utils';



const { Navigator, Screen } = createMaterialTopTabNavigator();




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




const Resources = ({ navigation }) => {
    const { selectedGroup, setSelectedGroup,cache,setCache, allResourceToggle, setResourceToggle, setResourcesGroups, resourcesGroups, resourcesData, resources, setResources } = React.useContext(SearchContext);
    const [showErrorModel, setShowErrorModel] = React.useState(false);

    const {
        setShowBack,
    } = React.useContext(RabotenuContext);
    React.useEffect(() => {
        setShowBack({ enable: true, navigation })
        return () => {
            setShowBack({ enable: false, navigation: null })
        }
    }, [])


    React.useEffect(() => {
        if (!selectedGroup.length && resourcesGroups[selectedGroup]) {
            setResourcesGroups({ ...{ ...resourcesGroups, [selectedGroup]: { groupName: resourcesGroups[selectedGroup].groupName, resources: resources,cache } } });
        }
    }, [resources]);


    const resourcesTreeView =React.useCallback ((props) => <ResourcesTreeView {...props} />
    ,[])
    const resourcesSearch = (props) => <ResourcesSearch onFilterRemove ={(id,bookId)=>{
      
        setCache({...cache,[bookId]:{...cache[bookId],tree:changeCheckById(cache[bookId].tree,false,id)}});
    }} cache={cache} editParams={{

        edit: true, resources: resources, groupName: "", onSave: ({ resources, groupName, groupId }) => {
            setResourcesGroups({ ...resourcesGroups, [groupId]: { groupName, resources: resources,cache} });
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

        setResourcesGroups({ ...resourcesGroups, [groupId]: { groupName, resources: resources,cache } });

        setResources(resources)
        setSelectedGroup(groupId)

    }} currCache={cache} currResources={resources} groups={resourcesGroups} removeGroup={(id) => {
        const newGroups = resourcesGroups;
        delete newGroups[id]
        setResourcesGroups({ ...newGroups })
    }} selectedGroup={selectedGroup} onGroupSelect={(id) => {
        setSelectedGroup(id);
        setResources(resourcesGroups[id].resources)
        setCache(resourcesGroups[id].cache||{})

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