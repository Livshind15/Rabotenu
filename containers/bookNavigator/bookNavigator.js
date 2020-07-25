import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Tabs from '../../component/tabs/tabs'
import BookView from '../bookView/bookView'
import BookList from '../bookList/bookList';
import { useAsync } from "react-async";
import axios from "axios";
import config from "../../config/config";

const { Navigator, Screen } = createMaterialTopTabNavigator();

const getBookTree = async ({ booksIds }) => {
    const data = await Promise.all(booksIds.map(bookId => {
        return axios.get(`${config.serverUrl}/book/tree/${bookId}`).then(res => res.data);
    }))
    return data || [];
}


const BookNavigator = ({ navigation, route }) => {
    const { selectedBooks } = route.params;
    const booksIds = (selectedBooks || []).map(book => book.bookId)
    const treeBooksResponse = useAsync({ promiseFn: getBookTree, booksIds })
    const bookView = () => <BookView booksId={booksIds[0]} />
    const bookList = () => <BookList tree={treeBooksResponse.data || {}} isPending={treeBooksResponse.isPending} />
    return (
        <Navigator swipeEnabled={false} initialRouteName='View' tabBar={props => <TopTabBar {...props} />}>
            <Screen name='Copy' component={View} />
            <Screen name='Menu' component={View} />
            <Screen name='Display' component={View} />
            <Screen name='BookList' component={bookList} />
            <Screen name='View' component={bookView} />
        </Navigator>
    )
}

const TopTabBar = ({ navigation, state }) => (
    <View style={styles.tabs}>
        <Tabs selectedIndex={state.index} onSelect={index => navigation.navigate(state.routeNames[index])}>
            <HeaderButton>העתקה</HeaderButton>
            <HeaderButton>תפריטי קשר</HeaderButton>
            <HeaderButton>הגדרות תצוגה</HeaderButton>
            <HeaderButton>רשימת ספרים</HeaderButton>
        </Tabs>
    </View>
);

const HeaderButton = ({ children, isSelected, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.tab} underlayColor="#ffffff00">
        <View style={[styles.tabLabel, isSelected ? styles.tabLabelSelect : {}]}>
            <Text style={[styles.text, isSelected ? styles.textSelect : {}]}>{children}</Text>
        </View>
    </TouchableOpacity>

)


const styles = StyleSheet.create({
    tab: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CBD4D3',
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    tabLabelSelect: {
        backgroundColor: '#504F4F'
    },
    textSelect: {
        color: '#A8AEAD',
    },
    text: {
        color: '#727575',
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 16,
    },
    tabLabel: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CBD4D3'
    },
    tabs: {
        height: 50,
        width: '100%'
    }
});

export default BookNavigator;