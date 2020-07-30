import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Toggle } from '@ui-kitten/components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Tabs from '../../component/tabs/tabs';
import TabButton from '../../component/tabButton/tabButton';
import ResourcesSearch from './searchResource';


const { Navigator, Screen } = createMaterialTopTabNavigator();

const initResources = [{ name: 'תנך', key: 0 }, { name: 'תנך', key: 1 }, { name: 'תנך', key: 2 }, { name: 'תנך', key: 3 }, { name: 'תנך', key: 4 }];

const Resources = ({ navigation }) => {
    const [allResourceToggle, setResourceToggle] = React.useState(true);
    const [resources, setResources] = React.useState(initResources);
    const resourcesSearch = (props) => <ResourcesSearch {...props} resources={resources} onRemove={(keys) => {
        setResources(keys.reduce((filterResources, key) => {
            filterResources = filterResources.filter(resource => resource.key != key);
            return filterResources;
        }, resources));
    }} />
    React.useEffect(() => {
        if (allResourceToggle) {
            setResources(initResources);
        }
    }, [allResourceToggle]);
    React.useEffect(() => {
        if (resources !== initResources) {
            setResourceToggle(false);
        }
    }, [resources]);

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <Toggle checked={allResourceToggle} onChange={setResourceToggle} />
                <Text style={styles.headerText}>חפש בכל המאגרים</Text>
            </View>
            <View style={styles.body}>
                <Navigator initialRouteName='SearchResource' tabBar={props => <TopTabBar {...props} />}>
                    <Screen name='TreeResource' component={View} />
                    <Screen name='SearchResource' component={resourcesSearch} />
                    <Screen name='groupResource' component={View} />

                </Navigator>
            </View>
        </View>
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