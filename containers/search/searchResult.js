import * as React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';

import Background from '../../component/background/background';
import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
import { SearchContext } from '../../contexts/searchContext';
import PlaceHolder from '../../component/placeHolder/placeHolder';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';
import { FlatList } from 'react-native-gesture-handler';
import SearchTypeModel from '../../component/searchType/searchType';
import { typeToIndex, optionsSearch } from './search.common';
import { isEmpty } from 'lodash';

const SearchResult = ({ navigation, result, input, onSearch, onInput }) => {
    const [searchInput, setInput] = React.useState(input);
    const [isLoading, setLoading] = React.useState(false);
    const { setSearchType, searchType, setTableInput } = React.useContext(SearchContext);
    const [showSearchType, setShowSearchType] = React.useState(false);
    const [isDelay, setDelay] = React.useState(false)
    setTimeout(() => {
        setDelay(true)
      }, 1000);
    React.useEffect(() => {
        if (isDelay&& !isLoading && isEmpty(result)) {
            setShowSearchType(true);
        }
    }, [result, isLoading,isDelay]);


    return (
        <Background>
            <SearchTypeModel currSelect={typeToIndex.findIndex(item => item === searchType) || 0} onOptionChange={async (index) => {
                console.log(index);
                setSearchType(typeToIndex[index] || 'exact');
                setTableInput([[]])
                if (index === 4) {
                    navigation.push('TableSearch');
                    setShowSearchType(false)
                }
                onInput(searchInput)
                setLoading(true)
                console.log(typeToIndex[index] || 'exact');
                await onSearch(searchInput,typeToIndex[index] || 'exact').then((res)=>{
                    setShowSearchType(false)
                    setLoading(false)
                })
              

            }} setVisible={setShowSearchType} options={optionsSearch} visible={showSearchType}></SearchTypeModel>
            <View style={styles.page}>
                <View style={styles.input}>
                    <View style={styles.buttonWrapper}>
                        <ClickButton outline={true} onPress={async () => {
                            setSearchType('exact')
                            onInput(searchInput)
                            setLoading(true)
                            await onSearch(searchInput,searchType   )
                            setLoading(false)
                        }} optionsButton={{ paddingVertical: 8 }} optionsText={{ fontSize: 16 }}>חיפוש</ClickButton>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Input onFocus={() => {
                            if (searchType === "table") {
                                navigation.push("TableSearch")
                            }
                        }} isLoading={isLoading} onSubmit={async ()=>{
                            setSearchType('exact')
                            onInput(searchInput)
                            setLoading(true)
                            await onSearch(searchInput,searchType   )
                            setLoading(false)
                        }} value={searchInput} onChange={setInput} options={{ fontSize: 16, paddingHorizontal: 20, height: 40 }} />
                    </View>
                </View>
                <View style={styles.resultCountWrapper}>
                    <Text style={styles.titleResult}>שם הספר</Text>
                    <Text style={styles.titleResult}>תוצאות</Text>
                </View>
                <FlatList
                    data={result.filter(result => result.bookId) || []}
                    style={styles.scroll}
                    keyExtractor={(key, index) => index.toString()}
                    initialNumToRender={7}
                    onScrollToIndexFailed={() => { }}
                    getItemLayout={(data, index) => {
                        return { length: 120, offset: 120 * index, index }
                    }}
                    style={styles.scroll}
                    renderItem={({ item, index }) => (
                        <View key={index}>
                            <TouchableOpacity underlayColor="#ffffff00" style={[styles.row, index === 0 ? { borderTopWidth: 1 } : {}]} >
                                <View style={styles.additionalComponent}>
                                    <View style={styles.endContainer}>
                                        <View style={styles.showButtonWrapper}>
                                            <TouchableOpacity
                                                underlayColor="#ffffff00"
                                                onPress={() => navigation.push('SearchView', { booksIds: [item.bookId] })}
                                            >
                                                <Text style={styles.showButtonText}>צפייה</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.countResultWrapper}>
                                            <Text style={styles.countText}>{item.doc_count}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.toggleAndText}>
                                    <Text style={[styles.title, styles.font]}>{`${item.groupName ? item.groupName.replace('_', '"') + ', ' : ""}${item.bookName ? item.bookName.replace('_', '"') : ""}`}</Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                    )}
                />



            </View>

        </Background>
    )
}



const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        marginBottom: 4,
        paddingRight: 5,
        fontFamily: "OpenSansHebrew",
        color: '#919191',
    },
    showButtonWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'

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
    additionalComponent: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        paddingRight: 18,
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderColor: '#E4E4E4'
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

export default optimizeHeavyScreen(SearchResult, PlaceHolder);