import * as React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Tabs from '../../component/tabs/tabs';
import BottomTabButton from '../../component/bottomTabButton/bottomTabButton';
import ExploreIcon from '../../assets/explore.svg';
import SearchIcon from '../../assets/search.svg';
import ShortCutIcon from '../../assets/shortCuts.svg';
import Explore from '../explore/explore';
import Search from '../search/search';
import Acronym from '../acronym/acronym';
import { RabotenuContext } from '../../contexts/applicationContext';
import { SearchProvider } from '../../contexts/searchContext';

const Tab = createBottomTabNavigator();


export default function MainNavigator({ route }) {

    return (
        <SearchProvider>

        <Tab.Navigator initialRouteName={route.params.screen} tabBar={props => <BottomTabBar {...props} />}>
            <Tab.Screen name="Acronym" component={Acronym} />
            <Tab.Screen name="Search" component={Search} />
            <Tab.Screen name="Explore" component={Explore} />
        </Tab.Navigator>
        </SearchProvider>
    );
}

const BottomTabBar = ({ navigation, state }) => {
    const { setTitle } = React.useContext(RabotenuContext)
    const getTitle = (screenName) => {
        return {
            Acronym: 'ראשי תיבות',
            Search: 'חיפוש',
            Explore: 'עיון'
        }[screenName]
    }

    return (
        <View style={{ height: 60 }}>
            <Tabs selectedIndex={state.index} onSelect={index => {
                setTitle(getTitle(state.routeNames[index]))
                navigation.navigate(state.routeNames[index])
            }}>
                <BottomTabButton Icon={ShortCutIcon}>ראשי תיבות</BottomTabButton>
                <BottomTabButton Icon={SearchIcon}>חיפוש</BottomTabButton>
                <BottomTabButton Icon={ExploreIcon}>עיון</BottomTabButton>
            </Tabs>
        </View>
    )
}


