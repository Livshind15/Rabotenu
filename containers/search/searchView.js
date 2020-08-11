import * as React from 'react';
import { StyleSheet, ScrollView, View, Text, FlatList, TouchableOpacity } from 'react-native';



import Background from '../../component/background/background';

import config from "../../config/config";
import { useAsync } from "react-async";
import axios from "axios";
import { Spinner } from '@ui-kitten/components';
import _ from 'lodash';
import { SearchContext } from '../../contexts/searchContext';
import ErrorModel from '../../component/modalError/modalError';
import Accordian from '../../component/accordian/accordian';
import { removeTag, removeBoldTag, removeGrayTag } from '../bookView/bookView';
import { isEmpty } from 'lodash';


const getSearchContent = async ({ booksIds, searchInput, type, tableInput }) => {
    const { data } = await axios.post(`${config.serverUrl}/book/search/`, {
        "content": searchInput,
        "type": !isEmpty(tableInput) ? type || 'exact' : 'exact',
        size: 50,
        table:tableInput,
        "booksIds": booksIds
    });
    return Promise.all(data.map(async verse => {
        // const nextVerses = await axios.get(`${config.serverUrl}/book/content/${verse.bookId}?gteIndex=${verse.index + 1}&lteIndex=${(verse.index + 10)}`).then(res => res.data.filter(content => content.chapter === verse.chapter));
        // if (!nextVerses.length) {
        //     const pevVerses = await axios.get(`${config.serverUrl}/book/content/${verse.bookId}?gteIndex=${verse.index - 10}&lteIndex=${(verse.index - 1)}`).then(res => res.data.filter(content => content.chapter === verse.chapter));
        //     return { ...verse }
        // }
        return { ...verse }
    }))
}


const SearchView = ({ navigation, route }) => {
    const { searchInput, searchType,tableInput } = React.useContext(SearchContext);

    const { data, error, isPending } = useAsync({ promiseFn: getSearchContent,tableInput, booksIds: route.params.booksIds, type: searchType, searchInput })
    const [showErrorModel, setShowErrorModel] = React.useState(false)
    React.useEffect(() => {
        if (error) {
            setShowErrorModel(true);
        }
    }, [error])
    return (
        <Background>
            <ErrorModel errorMsg={"שגיאה בבקשה מהשרת של תוצאות החיפוש"} errorTitle={'שגיאה'} visible={showErrorModel} setVisible={setShowErrorModel} />

            <View style={styles.page}>
                {!isPending && data && data.length ?
                    <FlatList
                        keyExtractor={item => item.id}
                        style={styles.view} data={data} renderItem={({ item, index }) => {
                            let content = item.content.match(/(?:<(\w+)[^>]*>(?:[\w+]+(?:(?!<).*?)<\/\1>?)[^\s\w]?|[^\s]+)/g);
                            if (item.highlight && item.highlight[0]) {
                                content = item.highlight[0].match(/(?:<(\w+)[^>]*>(?:[\w+]+(?:(?!<).*?)<\/\1>?)[^\s\w]?|[^\s]+)/g);
                            }

                            let grayText = false;
                            let boldText = false;
                            return (<Accordian initExpanded={true} header={`${item.groupName}, ${item.bookName}, ${item.chapter}, פסוק ${item.verse}`} >
                                <TouchableOpacity onPress={() => {
                                    navigation.push('Result', { selectedChapter: item.chapter, selectedBooks: [{ bookId: item.bookId }] })
                                }} style={styles.contentContainer}>
                                    <View style={styles.pasokContainer}>
                                        {item.verse ? <Text style={styles.pasok}>{item.verse} </Text> : <></>}
                                        {content.map(splitContent => {
                                            if (RegExp(`<\s*em[^>]*>(.*?)<\s*/\s*em>`).test(splitContent)) {
                                                return <><Text>{' '}</Text><Text style={styles.pasokContentMark}>{splitContent.match(/<em>(.*?)<\/em>/g).map((val) => val.replace(/<\/?em>/g, '').trim())}</Text><Text> </Text> </>
                                            }
                                            if (RegExp(`<\s*/\s*em>(.*?)<\s*em[^>]*>`).test(splitContent)) {
                                                return <><Text>{' '}</Text><Text style={styles.pasokContentMark}>{splitContent.match(/<\/em>(.*?)<em>/g).map((val) => val.replace(/<\/?em>/g, '').trim())}</Text><Text> </Text> </>
                                            }
                                            if (RegExp(`<\s*כתיב[^>]*>(.*?)`).test(splitContent)) {
                                                grayText = true;
                                            }
                                            if (RegExp(`(.*?)<\s*/\s*כתיב>`).test(splitContent)) {
                                                grayText = false;
                                                return <Text style={styles.pasokContentGray}> {removeGrayTag(splitContent)}</Text>
                                            }
                                            if (grayText) {
                                                return <Text style={styles.pasokContentGray}>{removeGrayTag(splitContent)}</Text>
                                            }
                                            if (RegExp(`<\s*דה[^>]*>(.*?)`).test(splitContent)) {
                                                boldText = true;
                                            }
                                            if (RegExp(`(.*?)<\s*/\s*דה>`).test(splitContent)) {
                                                boldText = false;
                                                return <Text style={styles.pasokContentBold}> {removeBoldTag(splitContent)}</Text>
                                            }
                                            if (boldText) {
                                                return <Text style={styles.pasokContentBold}> {removeBoldTag(splitContent)}</Text>
                                            }


                                            return <Text style={styles.pasokContent}> {removeTag(splitContent)}</Text>
                                        }
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Accordian>)
                        }} />
                    :
                    <View style={styles.spinnerContainer}>
                        <Spinner />
                    </View>}
            </View>
        </Background>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal: 35,
        paddingVertical: 10,
        flex: 1,
        width: '100%'
    },
    pasokContentMark: {
        color: '#455253',
        fontFamily: "OpenSansHebrew",
        textAlign: 'right',
        backgroundColor: 'yellow',
        fontSize: 20,
    },
    pasokContentBold: {
        color: '#455253',
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'right',
        fontSize: 19,
        padding: 0
    },
    pasokContentGray: {
        color: '#CBD4D3',
        fontFamily: "OpenSansHebrew",
        textAlign: 'right',
        fontSize: 18,
    },
    pasok: {
        color: '#455253',
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'right',
        fontSize: 18,
        padding: 0
    },
    pasokContent: {
        color: '#455253',
        fontFamily: "OpenSansHebrew",
        textAlign: 'right',
        fontSize: 20,
        padding: 0

    },
    pasokContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row-reverse',
  

    },
    view: {
        width: '100%'
    },
    scroll: {
        flex: 1,
        width: '100%'
    },
    spinnerContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    page: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
    }
});

export default SearchView;

// /*
//    {res.pevVerses && res.pevVerses.map(content => {
//                                             return (
//                                                 <>
//                                                     {content.verse ? <Text style={styles.pasok}>{content.verse} </Text> : <></>}
//                                                     {content.content.split(' ').map(splitContent => {
//                                                         if (RegExp(`<\s*כתיב[^>]*>(.*?)`).test(splitContent)) {
//                                                             grayText = true;
//                                                         }
//                                                         if (RegExp(`(.*?)<\s*/\s*כתיב>`).test(splitContent)) {
//                                                             grayText = false;
//                                                             return <Text style={styles.pasokContentGray}> {removeGrayTag(splitContent)}</Text>
//                                                         }
//                                                         if (grayText) {
//                                                             return <Text style={styles.pasokContentGray}>{removeGrayTag(splitContent)}</Text>
//                                                         }
//                                                         if (RegExp(/<\/?דה>/g).test(splitContent)) {
//                                                             boldCenter = true;
//                                                         }

//                                                         if (RegExp(`<\s*em[^>]*>(.*?)<\s*/\s*em>`).test(splitContent)) {
//                                                             return <><Text style={styles.pasokContentMark}>{splitContent.match(/<em>(.*?)<\/em>/g).map((val) => val.replace(/<\/?em>/g, '').trim())}</Text><Text> </Text> </>
//                                                         }
//                                                         if (RegExp(/<.דה./g).test(splitContent) || RegExp(/<\/?דה>/g).test(splitContent)) {
//                                                             boldCenter = false;

//                                                             return <><Text style={styles.pasokContentBold}>{splitContent.replace(new RegExp(/<.דה./, 'g'), '').replace(/<\/?דה>/g, '')}</Text><Text> </Text> </>

//                                                         }
//                                                         if (boldCenter) {
//                                                             return <><Text style={styles.pasokContentBold}>{splitContent.replace(/<\/?דה>/g, '')}</Text><Text> </Text> </>

//                                                         }

//                                                         return <><Text style={styles.pasokContent}>{splitContent.replace(RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`), '')}</Text><Text> </Text></>
//                                                     })}                                                </>)

//                                         })}*/