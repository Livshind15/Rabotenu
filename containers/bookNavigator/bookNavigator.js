import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Tabs from '../../component/tabs/tabs'
import BookView, { bookToElements } from '../bookView/bookView'
import BookList from '../bookList/bookList';
import { useAsync } from "react-async";
import axios from "axios";
import config from "../../config/config";
import BookDisplay from '../bookDisplay/bookDisplay';
import Copy from '../copy/copy';
import BookMenu from '../../component/bookMenu/bookMenu';
import BookViewTest from '../bookView/bookViewTest';
import BookViewClass from '../bookView/bookViewClass';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';
import PlaceHolder from '../../component/placeHolder/placeHolder';

const { Navigator, Screen } = createMaterialTopTabNavigator();

const getBookTree = async ([booksIds]) => {
    const data = await Promise.all(booksIds.map(bookId => {
        return axios.get(`${config.serverUrl}/book/tree/${bookId}`).then(res => res.data);
    }))
    return data || [];
}


const getBookContent = async ([bookId, index]) => {
    const { data } = await axios.get(`${config.serverUrl}/book/content/${bookId}?lteIndex=${((index + 1) * 50)}&gteIndex=${(index * 50)}`);
    return data || [];
}

const getSubBooks = async ([bookId]) => {
    const { data } = await axios.get(`${config.serverUrl}/mapping/groups/childBooks/${bookId}`);
    return data || [];
}

const BookNavigator = ({ navigation, route }) => {
    const { selectedBooks, selectedChapter } = route.params;
    const [booksIds, setBooksIds] = React.useState((selectedBooks || []).map(book => book.bookId));
    const [currBook, setCurrBook] = React.useState(booksIds[0])
    const [textSize, setTextSide] = React.useState(0.15);
    const [grammar, setGrammar] = React.useState(false);
    const [exegesis, setExegesis] = React.useState(false);
    const [flavors, setFlavors] = React.useState(true);
    const [bookListMount, setBookListMount] = React.useState(false);
    const [tree, setTree] = React.useState([])
    const [chapter, setChapter] = React.useState(selectedChapter || '');
    const [verse, setVerse] = React.useState('');
    const [section, setSection] = React.useState('');

    const subBooks = useAsync({ deferFn: getSubBooks })
    React.useEffect(() => {
        subBooks.run(currBook)

    }, [currBook])

    const treeFunc = useAsync({ deferFn: getBookTree, onResolve: setTree, booksIds })
    React.useEffect(() => {
        treeFunc.run(booksIds);
    }, [booksIds])

    const bookView = React.useCallback((props) => {
        return <BookViewClass
            {...props}
            bookId={currBook}
            setMount={setBookListMount}
            verse={verse}
            section={section}
            chapter={chapter}
            textSize={textSize}
            exegesis={exegesis}
            grammar={grammar} />
    }, [currBook, chapter, textSize, exegesis, grammar])
    const bookList = React.useCallback((props) => {
        return <BookList
            onSelectBook={(book) => {
                if (!booksIds.includes(book)) {
                    setBooksIds([...booksIds, book])
                }
                setChapter('')
                setCurrBook(book)
            }}
            bookId={currBook}
            {...props}
            onSelectChapter={setChapter}
            tree={tree || {}}
            isPending={treeFunc.isPending} />
    }, [booksIds, currBook, tree])
    const bookDisplay = React.useCallback((props) => {
        return  <BookDisplay {...props} onSave={({ textSize, grammar, exegesis, flavors }) => {
            setTextSide(textSize);
            setGrammar(grammar);
            setExegesis(exegesis);
            setFlavors(flavors);
        }} setting={{ textSize, grammar, exegesis, flavors }}/>
    }, [textSize, grammar, exegesis, flavors])
    const bookCopy = React.useCallback((props) => {
        return  <Copy {...props} onSave={() => { }}></Copy>
    }, [])
    const bookMenu = React.useCallback((props) => {
        return  <BookMenu {...props} data={subBooks.data} isPending={subBooks.isPending} onBookSelect={(book) => {
            setChapter('')
            if (!booksIds.includes(book)) {
                setBooksIds([...booksIds, book])
            }
            setCurrBook(book)
        }} bookId={currBook}/>
    }, [booksIds,currBook,subBooks])
   

    return (
        <Navigator swipeEnabled={false} initialRouteName='View' tabBar={props => <TopTabBar {...props} />}>
            <Screen name='Copy' options={{ title: 'רבותינו' }} component={bookListMount ? bookCopy : View} />
            <Screen name='Menu' options={{ title: 'רבותינו' }} component={bookMenu} />
            <Screen name='Display' options={{ title: 'רבותינו' }} component={bookDisplay} />
            <Screen name='BookList' options={{ title: 'רבותינו' }} component={bookList} />
            <Screen name='View' options={{ title: 'רבותינו' }} component={bookView} />
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

export default optimizeHeavyScreen(BookNavigator, PlaceHolder);