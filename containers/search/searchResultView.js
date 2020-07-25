import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Toggle } from '@ui-kitten/components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Tabs from '../../component/tabs/tabs';
import TabButton from '../../component/tabButton/tabButton';
import SearchTree from './searchTree';
import SearchResult from './searchResult';


const { Navigator, Screen } = createMaterialTopTabNavigator();


const SearchResultView = ({ navigation }) => {
    const [allResourceToggle, setResourceToggle] = React.useState(true);

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <Toggle checked={allResourceToggle} onChange={setResourceToggle} />
                <Text style={styles.headerText}>חפש בכל המאגרים</Text>
            </View>
            <View style={styles.body}>
                <Navigator initialRouteName='SearchExplore' tabBar={props => <TopTabBar {...props} />}>
                    <Screen name='Tree' component={SearchTree} />
                    <Screen name='SearchExplore' component={SearchResult} />
                </Navigator>
            </View>
        </View>
    )
}

const TopTabBar = ({ navigation, state }) => (
    <View style={styles.tabs}>
        <Tabs selectedIndex={state.index} onSelect={index => navigation.navigate(state.routeNames[index])}>
            <TabButton>תצוגת עץ</TabButton>
            <TabButton>כל התוצאות</TabButton>
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

export default SearchResultView;