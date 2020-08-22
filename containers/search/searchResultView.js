import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Toggle } from '@ui-kitten/components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Tabs from '../../component/tabs/tabs';
import TabButton from '../../component/tabButton/tabButton';
import SearchTree from './searchTree';
import SearchResult from './searchResult';
import { SearchContext } from '../../contexts/searchContext';
import PlaceHolder from '../../component/placeHolder/placeHolder';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';


const { Navigator, Screen } = createMaterialTopTabNavigator();

const SearchResultView = ({ navigation, route }) => {
    const onSearch  = route.params.onSearch || (()=>{});
    const { searchInput, bookResult, allResourceToggle, setResourceToggle, setSearchInput, setBookResult, notSearchBooks,notSearchGroups, setSearchType, searchType, tableInput } = React.useContext(SearchContext);
    const searchResult = (props) => <SearchResult {...props} onInput={setSearchInput} input={searchInput} onSearch={async (input) => {
        const result = await onSearch(input, searchType, tableInput, notSearchBooks, notSearchGroups);
        setBookResult(result);

    }} result={bookResult} />
    const searchTree = (props) => <SearchTree {...props} onInput={setSearchInput} input={searchInput} onSearch={async (input) => {
        const result = await onSearch(input, searchType, tableInput, notSearchBooks, notSearchGroups);
        setBookResult(result);

    }} result={bookResult} />

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <Toggle checked={allResourceToggle} onChange={(status)=>{
                    setResourceToggle(status)
                    if(!status){
                        navigation.push('Resources')
                    }
                    }} />
                <Text style={styles.headerText}>חפש בכל המאגרים</Text>
            </View>
            <View style={styles.body}>
                <Navigator initialRouteName='SearchExplore' tabBar={props => <TopTabBar {...props} />}>
                    <Screen name='Tree' options={{ title: 'רבותינו' }} component={searchTree} />
                    <Screen name='SearchExplore' options={{ title: 'רבותינו' }} component={searchResult} />
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

export default optimizeHeavyScreen(SearchResultView, PlaceHolder);;