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


const Resources = ({ navigation }) => {
    const [allResourceToggle, setResourceToggle] = React.useState(true);
    const { data, error, isPending } = useAsync({ promiseFn: getGroups })
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
            setAlResources(books);
            setResources(books)
        }
    }, [data]);
    React.useEffect(() => {
        if (allResourceToggle) {
            setResources(allResource);
        }
    }, [allResourceToggle]);
    React.useEffect(() => {
        const isAllResource = isEqual(resources, allResource)
        setResourceToggle(isAllResource);
    }, [resources]);
    const resourcesTreeView =  (props) => <ResourcesTreeView resources={data} {...props} />

    const resourcesSearch = (props) => <ResourcesSearch {...props} resources={resources} onRemove={(keys) => {
        setResources(keys.reduce((filterResources, key) => {
            filterResources = filterResources.filter(resource => resource.bookId != key);
            return filterResources;
        }, resources));
    }} />
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
                            <Screen name='groupResource' component={ResourcesGroups} />
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