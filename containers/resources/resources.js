import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Toggle } from '@ui-kitten/components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Tabs from '../../component/tabs/tabs';
import TabButton from '../../component/tabButton/tabButton';
import ResourcesSearch from './searchResource';
import ResourcesTreeView from './resourcesTree';
import ResourcesGroups from './resourcesGroups';
import config from "../../config/config";
import { useAsync } from "react-async";
import axios from "axios";
import ErrorModel from '../../component/modalError/modalError';
import { flatten, isEqual } from 'lodash';
import { Spinner } from '@ui-kitten/components';


const { Navigator, Screen } = createMaterialTopTabNavigator();


const getGroups = async () => {
    const { data } = await axios.get(`${config.serverUrl}/mapping/groups/`);
    return data || [];
}

const getAllBooksFromGroups = (groups) => {
    return flatten(groups.map(group => {
        let books = group.books.map(book => {
            return { ...book, groupName: group.groupName, groupId: group.groupId }
        })
        if (group.subGroups && group.subGroups.length) {
            books = [...books, ...getAllBooksFromGroups(group.subGroups)]
        }
        return books
    }))
}



export const addCheckForResources = (resources, check) => {
    return resources.map(resource => {
        const books = resource.books.map(book => {
            return { ...book, isCheck: check }
        })
        let subGroups = []
        if (resource.subGroups.length) {
            subGroups = addCheckForResources(resource.subGroups)
        }
        return { ...resource, books, subGroups, isCheck: check }
    })
}

const Resources = ({ navigation }) => {
    const [allResourceToggle, setResourceToggle] = React.useState(true);
    const { data, error, isPending } = useAsync({ promiseFn: getGroups })
    const [resourcesTree, setResourcesTree] = React.useState([]);
    const [resources, setResources] = React.useState([]);
    const [allResource, setAlResources] = React.useState([]);
    const [showErrorModel, setShowErrorModel] = React.useState(false);
    React.useEffect(() => {
        if (error) {
            setShowErrorModel(true);
        }
    }, [error]);
    React.useEffect(() => {
        if (data && data.length) {
            const books = getAllBooksFromGroups(data);
            setResourcesTree(addCheckForResources(data, true))
            setAlResources(books);
            setResources(books)
        }
    }, [data]);
    React.useEffect(() => {
        if (allResourceToggle) {
            if (data && data.length) {
                setResourcesTree(addCheckForResources(data, true))
            }
            setResources(allResource);
        }
    }, [allResourceToggle]);
    React.useEffect(() => {
        const isAllResource = isEqual(resources, allResource)
        setResourceToggle(isAllResource);
    }, [resources]);
    const resourcesTreeView = (props) => <ResourcesTreeView resources={resourcesTree} onRemoveResources={(allBooks, groups, books, resourceTree) => {
        console.log({ allBooks, groups, books, resourceTree })
        setResources(allResource.reduce((resources, resource) => {
            if (!allBooks.includes(resource.bookId)) {
                resources.push(resource)
            }
            return resources
        }, []))
        setResourceToggle(false)
    }} {...props} />

    const resourcesSearch = (props) => <ResourcesSearch {...props} resources={resources} onRemoveAll={() => {
        setResourcesTree(addCheckForResources(data, false))

    }} onRemove={(keys) => {
        setResources(keys.reduce((filterResources, key) => {
            filterResources = filterResources.filter(resource => resource.bookId != key);
            return filterResources;
        }, resources));
    }} />

    const resourcesGroups = (props) => <ResourcesGroups {...props}  />


    return (
        <>
            {!isPending && data && data.length ?
                <View style={styles.page}>
                    <ErrorModel errorMsg={"שגיאה בבקשה מהשרת של המאגרים"} errorTitle={'שגיאה'} visible={showErrorModel} setVisible={setShowErrorModel} />

                    <View style={styles.header}>
                        <Toggle checked={allResourceToggle} onChange={setResourceToggle} />
                        <Text style={styles.headerText}>חפש בכל המאגרים</Text>
                    </View>
                    <View style={styles.body}>
                        <Navigator initialRouteName='SearchResource' tabBar={props => <TopTabBar {...props} />}>
                            <Screen name='groupResource' component={resourcesGroups} />
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