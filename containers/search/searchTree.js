import * as React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';



import Background from '../../component/background/background';
import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
import Tree from '../../component/tree/tree';
import results from './searchTree.mock';
import config from "../../config/config";
import { useAsync } from "react-async";
import axios from "axios";
import { Spinner } from '@ui-kitten/components';
import _ from 'lodash';

import ErrorModel from '../../component/modalError/modalError';

const getGroups = async ({ bookResult }) => {
    const { data } = await axios.get(`${config.serverUrl}/mapping/groups/`);
    return attachResultToGroups(data, _.keyBy(bookResult, 'bookId')).groups || [];
}

const attachResultToGroups = (groups, bookResult) => {
    let count = 0;
    for (const group of groups) {
        group.books = group.books.reduce((books, book) => {
            if (bookResult[book.bookId]) {
                books.push({ ...book, doc_count: bookResult[book.bookId].doc_count });
                count = count + bookResult[book.bookId].doc_count;
            }
            return books
        }, [])
        group.doc_count = group.books.reduce((docsCount, book) => {
            return docsCount + book.doc_count
        }, 0)
        if (group.subGroups.length) {
            const result = attachResultToGroups(group.subGroups, bookResult);
            if(!!result.count){
                group.subGroups = result.groups;
                group.doc_count += result.count
            }
            group.subGroups = [];
        }
    }
    return { groups, count };
}

const SearchTree = ({ navigation, input, onSearch, onInput, result }) => {
    const [searchInput, setInput] = React.useState(input);
    const [isLoading, setLoading] = React.useState(false);
    const { data, error, isPending } = useAsync({ promiseFn: getGroups, bookResult: result })
    const [showErrorModel, setShowErrorModel] = React.useState(false);
    React.useEffect(() => {
        if (error) {
            setShowErrorModel(true);
        }
    }, [error]);
    return (
        <Background>
            <ErrorModel errorMsg={"שגיאה בבקשה מהשרת של תצוגת עץ"} errorTitle={'שגיאה'} visible={showErrorModel} setVisible={setShowErrorModel} />
            <View style={styles.page}>
                <View style={styles.input}>
                    <View style={styles.buttonWrapper}>
                        <ClickButton onPress={async () => {
                            onInput(searchInput)
                            setLoading(true)
                            await onSearch(searchInput)
                            setLoading(false)
                        }} outline={true} optionsButton={{ paddingVertical: 8 }} optionsText={{ fontSize: 16 }}>חיפוש</ClickButton>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Input value={searchInput} isLoading={isLoading} onChange={setInput} options={{ fontSize: 16, paddingHorizontal: 20, height: 40 }} />
                    </View>
                </View>
                <View style={styles.resultCountWrapper}>
                    <Text style={styles.titleResult}>שם הספר</Text>
                    <Text style={styles.titleResult}>תוצאות</Text>
                </View>
                <ScrollView style={styles.scroll}>
                    {!isPending && data && data.length ? <Tree navigation={navigation} results={data} /> : <View style={styles.spinnerContainer}>
                        <Spinner />
                    </View>}
                </ScrollView>
            </View>
        </Background>
    )
}



const styles = StyleSheet.create({
    showButtonWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'

    },
    spinnerContainer: {
        flex: 1,
        width: "100%",
        justifyContent: 'center',
        alignItems: "center"
    },
    countResultWrapper: {
        backgroundColor: '#E4E4E4',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'

    },
    endContainer: {
        width: 120,
        flexDirection: 'row-reverse',
        height: '100%'
    },
    resultCountWrapper: {
        height: 40,
        width: '100%',
        paddingLeft: 24,
        paddingRight: 15,
        backgroundColor: '#CBD4D3',
        shadowColor: "#000",
        borderTopWidth: 1.5,
        borderTopColor: '#B6BAB9',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    countText: {
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 18,
        color: "#6D6D6D"
    },
    showButtonText: {
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 18,
        color: '#5AB3AC'
    },
    titleResult: {
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'center',
        fontSize: 16,
        color: "#6D6D6D"
    },
    titleCount: {
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 14,
        color: '#878A8A'
    },
    inputWrapper: {
        flex: 0.82,
        height: '100%',
        justifyContent: 'center'
    },
    input: {
        width: '95%',
        height: 55,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonWrapper: {
        flex: 0.18,
        height: '100%',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignContent: 'center',
    },
    resultText: {
        fontSize: 16,
        paddingRight: 15,
        fontFamily: "OpenSansHebrew",
        color: '#8D8C8C',
    },
    scroll: {
        flex: 1,
        width: '100%'
    },
    innerScroll: {
        flex: 1,
        width: '100%'
    },
    resultContainer: {
        height: 40,
        paddingLeft: 25,
        paddingRight: 60,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderColor: '#E4E4E4'
    },
    page: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
    }
});

export default SearchTree;