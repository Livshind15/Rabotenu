import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform,Clipboard  } from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Tabs from '../../component/tabs/tabs'
import BookList from '../bookList/bookList';
import { useAsync } from "react-async";
import axios from "axios";
import config from "../../config/config";
import BookDisplay from '../bookDisplay/bookDisplay';
import Copy from '../copy/copy';
import BookMenu from '../../component/bookMenu/bookMenu';
import BookViewClass, { removeNotNeedContent } from '../bookView/bookViewClass';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';
import PlaceHolder from '../../component/placeHolder/placeHolder';
import { RabotenuContext } from '../../contexts/applicationContext';

const { Navigator, Screen } = createMaterialTopTabNavigator();

const getBookTree = async ([booksIds]) => {
    const data = await Promise.all(booksIds.map(bookId => {
        return axios.get(`${config.serverUrl}/book/tree/${bookId}`).then(res => res.data);
    }))
    return data || [];
}

const getSubBooks = async ([bookId, section, chapter, verse]) => {
    let url = `${config.serverUrl}/mapping/groups/childBooks/${bookId}`;
    let params = '';
    if (section) {
        if (params.length) {
            params += `&section=${section}`
        }
        else {
            params += `?section=${section}`
        }
    }
    if (chapter) {
        if (params.length) {
            params += `&chapter=${chapter}`
        }
        else {
            params += `?chapter=${chapter}`
        }
    }
    if (verse) {
        if (params.length) {
            params += `&verse=${verse}`
        }
        else {
            params += `?verse=${verse}`
        }
    }
    const { data } = await axios.get(url + params);
    return { child: data, info: { section, chapter, verse } } || [];
}

const getParentBooks = async ([bookId, section, chapter, verse]) => {
    let url = `${config.serverUrl}/mapping/groups/parentBook/${bookId}`;
    let params = '';
    if (section) {
        if (params.length) {
            params += `&section=${section}`
        }
        else {
            params += `?section=${section}`
        }
    }
    if (chapter) {
        if (params.length) {
            params += `&chapter=${chapter}`
        }
        else {
            params += `?chapter=${chapter}`
        }
    }
    if (verse) {
        if (params.length) {
            params += `&verse=${verse}`
        }
        else {
            params += `?verse=${verse}`
        }
    }
    const { data } = await axios.get(url + params);
    return { parent: data, info: { section, chapter, verse } } || [];
}

const BookNavigator = ({ navigation, route }) => {
    const {
        showBack,
        copyTitle,
        setCopyTitle,
        setGodReplace,
        godReplace,
        flavors,
        setFlavors,
        setShowBack,
        textSize,
        setTextSide,
        grammar,
        setGrammar,
        exegesis,
        setExegesis,
        punctuation,
        setPunctuation } = React.useContext(RabotenuContext);
    React.useEffect(() => {
        setShowBack({ enable: true, navigation })
        return () => {
            setShowBack({ enable: false, navigation: null })
        }
    }, [])

    const { selectedBooks, selectedChapter, selectedIndex, selectedVerse, selectedSection } = route.params;

    const { booksIds, setBooksIds } = React.useContext(RabotenuContext);

    const [currBook, setCurrBook] = React.useState(selectedBooks[0].bookId)
    const [initIndex, setInitIndex] = React.useState(selectedIndex || 0);


    const [bookListMount, setBookListMount] = React.useState(false);
    const [tree, setTree] = React.useState([])
    const [chapter, setChapter] = React.useState(selectedChapter || '');
    const [verse, setVerse] = React.useState(selectedVerse || '');
    const [section, setSection] = React.useState(selectedSection || '');

    const subBooks = useAsync({ deferFn: getSubBooks })
    const parentBooks = useAsync({ deferFn: getParentBooks })

    React.useEffect(() => {
        setBooksIds((selectedBooks || []).map(book => book.bookId));

    }, [selectedBooks])
    React.useEffect(() => {
        subBooks.run(currBook)
        parentBooks.run(currBook)

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
            index={initIndex}
            section={section}
            mode={'scroll'}
            chapter={chapter}
            onBookSelect={(bookId,index) => {
                setInitIndex(index)
                if (!booksIds.includes(bookId)) {
                    setBooksIds([...booksIds, bookId])
                }
                setCurrBook(bookId)
            }}
            onTextLongPress={async (text) => {
                const header = (`${text.original.groupName ? text.original.groupName.replace("_", '') + ' ' : '"'}${text.original.bookName ? text.original.bookName.replace("_", '"') + ' ' : ""}${text.original.section ? text.original.section + ' ' : ""}${text.original.chapter ? text.original.chapter + ' ' : ""}${text.original.verse ? text.original.verse + ' ' : ""} `)

                if (Platform.OS === 'web') {
                    if (navigator.clipboard) {
                        if (copyTitle.enable) {
                            if (copyTitle.position === 0) {
                                navigator.clipboard.writeText(header + '\n' + removeNotNeedContent(text.value, punctuation, grammar).replace('יְהֹוָ֧ה', godReplace))

                            } else {
                                navigator.clipboard.writeText(removeNotNeedContent(text.value, punctuation, grammar).replace('יְהֹוָ֧ה', godReplace) + header + '\n')
                            }
                        } else {
                            navigator.clipboard.writeText(removeNotNeedContent(text.value, punctuation, grammar).replace('יְהֹוָ֧ה', godReplace))
                        }
                    }
                }
                else {
                    if (copyTitle.enable) {
                        if (copyTitle.position === 0) {
                            Clipboard.setString(header + '\n' + removeNotNeedContent(text.value, punctuation, grammar).replace('יְהֹוָ֧ה', godReplace))

                        } else {
                            Clipboard.setString(removeNotNeedContent(text.value, punctuation, grammar).replace('יְהֹוָ֧ה', godReplace) + header + '\n')
                        }
                    } else {
                        Clipboard.setString(removeNotNeedContent(text.value, punctuation, grammar).replace('יְהֹוָ֧ה', godReplace))
                    }
                }
            }}
            onTextSelected={(text) => {
                const { bookId, section, chapter, verse } = text.original;
                // setChapter(chapter)
                // setVerse(verse)
                // setSection(section)
                subBooks.run(bookId, section, chapter, verse)
                parentBooks.run(bookId, section, chapter, verse)

            }}
            textSize={textSize}
            exegesis={exegesis}
            punctuation={punctuation}
            grammar={grammar} />
    }, [currBook, chapter, section, copyTitle,booksIds, verse, textSize, exegesis, grammar, punctuation, initIndex, godReplace

    ])
    const bookList = React.useCallback((props) => {
        return <BookList
            onSelectBook={(book) => {
                if (!booksIds.includes(book)) {
                    setBooksIds([...booksIds, book])
                }
                setChapter('')
                setSection('')
                setVerse('')
                setInitIndex(0)
                setCurrBook(book)
            }}
            bookId={currBook}
            {...props}
            onSelectSection={setSection}
            onSelectVerse={setVerse}
            onSelectChapter={setChapter}
            tree={tree || {}}
            isPending={treeFunc.isPending} />
    }, [booksIds, currBook, tree])
    const bookDisplay = React.useCallback((props) => {
        return <BookDisplay {...props}   title={copyTitle}  godOption={godReplace} onSaveCopy={({ attachTitle, godReplace }) => {
            setGodReplace(godReplace);
            setCopyTitle(attachTitle);
        }}  onSave={({ textSize, grammar, exegesis, flavors, punctuation }) => {
            setTextSide(textSize);
            setGrammar(grammar);
            setExegesis(exegesis);
            setFlavors(flavors);
            setPunctuation(punctuation)
        }} setting={{ textSize, grammar, exegesis, flavors, punctuation }} />
    }, [textSize, grammar, exegesis, flavors, punctuation])
    const bookCopy = React.useCallback((props) => {
        return <Copy title={copyTitle} godOption={godReplace} {...props} onSave={({ attachTitle, godReplace }) => {
            setGodReplace(godReplace);
            setCopyTitle(attachTitle);
        }}></Copy>
    }, [])
    const bookMenu = React.useCallback((props) => {
        return <BookMenu {...props} childData={subBooks.data} parentData={parentBooks.data} isPending={subBooks.isPending} onBookSelect={(book, info) => {
            const { section, chapter, verse } = info
            setChapter(chapter)
            setVerse(verse)
            setSection(section)
            setInitIndex(0)
            if (!booksIds.includes(book)) {
                setBooksIds([...booksIds, book])
            }
            setCurrBook(book)
        }} bookId={currBook} />
    }, [booksIds, currBook, subBooks,parentBooks])


    return (
        <Navigator swipeEnabled={false} initialRouteName='View' tabBar={props => <TopTabBar {...props} />}>
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
            <HeaderButton>תפריטי קשר</HeaderButton>
            <HeaderButton>הגדרות כלליות</HeaderButton>
            <HeaderButton>חלונית ניווט</HeaderButton>
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