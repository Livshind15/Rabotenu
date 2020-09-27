import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Clipboard } from 'react-native';

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
import { getLastHeader } from '../explore/exploreResultView';

const { Navigator, Screen } = createMaterialTopTabNavigator();
const headers = ["header1", "header2", "header3", "header4", "header5", "header6", "header7"]

const getBookTree = async ([booksIds]) => {
    const data = await Promise.all(booksIds.map(bookId => {
        return axios.get(`${config.serverUrl}/book/tree/${bookId}`).then(res => res.data);
    }))
    return data || [];
}

const getSubBooks = async ([bookId, header]) => {
    let url = `${config.serverUrl}/mapping/groups/childBooks/${bookId}`;
    let params = '';
    headers.forEach(headersType => {
        if (header &&header[headersType]) {
            if (params.length) {
                params += `&${headersType}=${header[headersType]}`
            }
            else {
                params += `?${headersType}=${header[headersType]}`
            }
        }
    })

    const { data } = await axios.get(url + params);
    return { child: data, info: header } || [];
}

const getParallelBooks = async ([bookId, header]) => {
    let url = `${config.serverUrl}/mapping/groups/parallelBooks/${bookId}`;
    let params = '';

    headers.forEach(headersType => {
        if (header &&header[headersType]) {
            if (params.length) {
                params += `&${headersType}=${header[headersType]}`
            }
            else {
                params += `?${headersType}=${header[headersType]}`
            }
        }
    })

    const { data } = await axios.get(url + params);
    return { parent: data, info: header } || [];
}


const getParentBooks = async ([bookId, header]) => {
    let url = `${config.serverUrl}/mapping/groups/parentBook/${bookId}`;
    let params = '';
    headers.forEach(headersType => {
        if (header && header[headersType]) {
            if (params.length) {
                params += `&${headersType}=${header[headersType]}`
            }
            else {
                params += `?${headersType}=${header[headersType]}`
            }
        }
    })
    
    const { data } = await axios.get(url + params);
    return { parent: data, info: header } || [];
}

const BookNavigator = ({ navigation, route }) => {
    const {
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

    const { selectedBooks, selectedHeaders, selectedIndex, stepBy, highlight } = route.params;
    const [selectedHeader, setSelectedHeader] = React.useState(selectedHeaders || { header1: '', header2: '', header3: '', header4: '', header5: '', header6: '', header7: '' });
    const { booksIds, setBooksIds } = React.useContext(RabotenuContext);
    const [pageBy, setStepBy] = React.useState(stepBy);
    const [currBook, setCurrBook] = React.useState(selectedBooks[0].bookId)
    const [initIndex, setInitIndex] = React.useState(selectedIndex || 0);
    const [bookListMount, setBookListMount] = React.useState(false);
    const [tree, setTree] = React.useState([])

    const subBooks = useAsync({ deferFn: getSubBooks })
    const parentBooks = useAsync({ deferFn: getParentBooks });
    const parallelBooks = useAsync({ deferFn: getParallelBooks });

    React.useEffect(() => {
        setBooksIds((selectedBooks || []).map(book => book.bookId));

    }, [selectedBooks])
    React.useEffect(() => {
        console.log({currBook})
        subBooks.run(currBook)
        parentBooks.run(currBook)
        parallelBooks.run(currBook)

    }, [currBook])

    const treeFunc = useAsync({ deferFn: getBookTree, onResolve: setTree, booksIds })
    React.useEffect(() => {
        treeFunc.run(booksIds);
    }, [booksIds])

    const bookView = React.useCallback((props) => {
        return <BookViewClass
            {...props}
            bookId={currBook}
            selectedHeader={selectedHeader}
            setMount={setBookListMount}
            index={initIndex}
            pageBy={pageBy}
            setShowBack={setShowBack}
            parentNavigation = {navigation}
            highlight={highlight || []}
            mode={pageBy ? 'page' : 'scroll'}
            onBookSelect={(bookId, index) => {
                setInitIndex(index)
                if (!booksIds.includes(bookId)) {
                    setBooksIds([...booksIds, bookId])
                }
                setCurrBook(bookId)
            }}
            onTextLongPress={async (text) => {
                const header = (`
                ${text.original.groupName ? text.original.groupName.replace("_", '') + ' ' : '"'}
                ${text.original.bookName ? text.original.bookName.replace("_", '"') + ' ' : ""}
                ${text.original.header1 ? text.original.header1 + ' ' : ""}
                ${text.original.header2 ? text.original.header2 + ' ' : ""}
                ${text.original.header3 ? text.original.header3 + ' ' : ""}
                ${text.original.header4 ? text.original.header4 + ' ' : ""}
                ${text.original.header5 ? text.original.header5 + ' ' : ""}
                ${text.original.header6 ? text.original.header6 + ' ' : ""}
                ${text.original.header7 ? text.original.header7 + ' ' : ""}
                 `)
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
                const { bookId, header1, header2, header3, header4, header5, header6, header7 } = text.original;

                subBooks.run(bookId, { header1, header2, header3, header4, header5, header6, header7 })
                parentBooks.run(bookId, { header1, header2, header3, header4, header5, header6, header7 })
                parallelBooks.run(bookId, { header1, header2, header3, header4, header5, header6, header7 })

            }}
            textSize={textSize}
            exegesis={exegesis}
            punctuation={punctuation}
            grammar={grammar} />
    }, [currBook, selectedHeader, pageBy, copyTitle, booksIds, textSize, exegesis, grammar, punctuation, initIndex, godReplace

    ])
    const bookList = React.useCallback((props) => {
        return <BookList

            bookId={currBook}
            {...props}
            onSelect={(select) => {
                setCurrBook(select.bookId)
                setStepBy(select.stepBy)
                setSelectedHeader(Object.keys(select).reduce((headers, key) => {
                    if (key !== 'bookId') {
                        headers[key] = select[key];
                    }
                    return headers;
                }, {}))
            }}
            tree={tree || {}}
            isPending={treeFunc.isPending} />
    }, [booksIds, currBook, tree])

    const bookDisplay = React.useCallback((props) => {
        return <BookDisplay {...props} title={copyTitle} godOption={godReplace} onSaveCopy={({ attachTitle, godReplace }) => {
            setGodReplace(godReplace);
            setCopyTitle(attachTitle);
        }} onSave={({ textSize, grammar, exegesis, flavors, punctuation }) => {
            setTextSide(textSize);
            setGrammar(grammar);
            setExegesis(exegesis);
            setFlavors(flavors);
            setPunctuation(punctuation)
        }} setting={{ textSize, grammar, exegesis, flavors, punctuation }} />
    }, [textSize, grammar, exegesis, flavors, punctuation])

    const bookMenu = React.useCallback((props) => {
        return <BookMenu {...props} childData={subBooks.data} parallelData={parallelBooks.data} parentData={parentBooks.data} isPending={subBooks.isPending} onBookSelect={(book, info) => {
            setSelectedHeader(info)
            console.log({ info });
            if(info){
                setStepBy(getLastHeader(info))
            }
            else{
                setStepBy(null);
            }
            if (!booksIds.includes(book)) {
                setBooksIds([...booksIds, book])
            }
            setCurrBook(book)
        }} bookId={currBook} />
    }, [booksIds, currBook, subBooks, parentBooks,parallelBooks])


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