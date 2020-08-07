import * as React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';



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
import { SearchContext } from '../../contexts/searchContext';
import ErrorModel from '../../component/modalError/modalError';
import Accordian from '../../component/accordian/accordian';

const getSearchContent = async ({ booksIds, searchInput }) => {
    const { data } = await axios.post(`${config.serverUrl}/book/search/`, {
        "content": searchInput,
        "type": "exact",
        "booksIds": booksIds
    });
    return Promise.all(data.map(async verse => {
        const nextVerses = await axios.get(`${config.serverUrl}/book/content/${verse.bookId}?gteIndex=${verse.index + 1}&lteIndex=${(verse.index + 10)}`).then(res => res.data.filter(content => content.chapter === verse.chapter));
        if (!nextVerses.length) {
            const pevVerses = await axios.get(`${config.serverUrl}/book/content/${verse.bookId}?gteIndex=${verse.index - 10}&lteIndex=${(verse.index - 1)}`).then(res => res.data.filter(content => content.chapter === verse.chapter));
            return { ...verse, nextVerses, pevVerses }
        }
        return { ...verse, nextVerses }
    }))
}


const SearchView = ({ navigation, route }) => {
    const { searchInput } = React.useContext(SearchContext);
    const { data, error, isPending } = useAsync({ promiseFn: getSearchContent, booksIds: route.params.booksIds, searchInput })
    const [showErrorModel, setShowErrorModel] = React.useState(false);
    React.useEffect(() => {
        if (error) {
            setShowErrorModel(true);
        }
    }, [error])
    return (
        <Background>
            <ErrorModel errorMsg={"שגיאה בבקשה מהשרת של תוצאות החיפוש"} errorTitle={'שגיאה'} visible={showErrorModel} setVisible={setShowErrorModel} />

            <View style={styles.page}>
                {!isPending && data && data.length ? <ScrollView style={styles.scroll}>
                    {data.map(res => {
                        const content = res.highlight[0].match(/(?:<(\w+)[^>]*>(?:[\w+]+(?:(?!<).*?)<\/\1>?)[^\s\w]?|[^\s]+)/g);
                        let boldCenter = false;
                        return (
                            <Accordian initExpanded={true} header={`${res.groupName}, ${res.bookName}, ${res.chapter}, פסוק ${res.verse}`} >
                                <TouchableOpacity onLongPress={() => {
                                    navigation.push('Result', { selectedBooks: [{ bookId: res.bookId }] })
                                }} style={styles.contentContainer}>
                                    <Text style={styles.pasokContainer}>
                                        {res.pevVerses && res.pevVerses.map(content => {
                                            return (
                                                <>
                                                    {content.verse ? <Text style={styles.pasok}>{content.verse} </Text> : <></>}
                                                    {content.content.split(' ').map(splitContent => {
                                                        if (RegExp(/<\/?דה>/g).test(splitContent)) {
                                                            boldCenter = true;
                                                        }

                                                        if (RegExp(`<\s*em[^>]*>(.*?)<\s*/\s*em>`).test(splitContent)) {
                                                            return <><Text style={styles.pasokContentMark}>{splitContent.match(/<em>(.*?)<\/em>/g).map((val) => val.replace(/<\/?em>/g, '').trim())}</Text><Text> </Text> </>
                                                        }
                                                        if (RegExp(/<.דה./g).test(splitContent) || RegExp(/<\/?דה>/g).test(splitContent)) {
                                                            boldCenter = false;

                                                            return <><Text style={styles.pasokContentBold}>{splitContent.replace(new RegExp(/<.דה./, 'g'), '').replace(/<\/?דה>/g, '')}</Text><Text> </Text> </>

                                                        }
                                                        if (boldCenter) {
                                                            return <><Text style={styles.pasokContentBold}>{splitContent.replace(/<\/?דה>/g, '')}</Text><Text> </Text> </>

                                                        }

                                                        return <><Text style={styles.pasokContent}>{splitContent.replace(RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`), '')}</Text><Text> </Text></>
                                                    })}                                                </>)

                                        })}

                                        {res.verse ? <Text style={styles.pasok}>{res.verse} </Text> : <></>}
                                        {content.map(splitContent => {
                                            if (RegExp(/<\/?דה>/g).test(splitContent)) {
                                                boldCenter = true;
                                            }

                                            if (RegExp(`<\s*em[^>]*>(.*?)<\s*/\s*em>`).test(splitContent)) {
                                                return <><Text style={styles.pasokContentMark}>{splitContent.match(/<em>(.*?)<\/em>/g).map((val) => val.replace(/<\/?em>/g, '').trim())}</Text><Text> </Text> </>
                                            }
                                            if (RegExp(/<.דה./g).test(splitContent) || RegExp(/<\/?דה>/g).test(splitContent)) {
                                                boldCenter = false;

                                                return <><Text style={styles.pasokContentBold}>{splitContent.replace(new RegExp(/<.דה./, 'g'), '').replace(/<\/?דה>/g, '')}</Text><Text> </Text> </>

                                            }
                                            if (boldCenter) {
                                                return <><Text style={styles.pasokContentBold}>{splitContent.replace(/<\/?דה>/g, '')}</Text><Text> </Text> </>

                                            }

                                            return <><Text style={styles.pasokContent}>{splitContent.replace(RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`), '')}</Text><Text> </Text></>
                                        }

                                        )}
                                        {res.nextVerses && res.nextVerses.map(content => {

                                            return (
                                                <>
                                                    {content.verse ? <Text style={styles.pasok}>{content.verse} </Text> : <></>}
                                                    {content.content.split(' ').map(splitContent => {
                                                        if (RegExp(`<\s*דה[^>]*>(.*?)`).test(splitContent)) {
                                                            boldCenter = true;
                                                            console.log(splitContent)
                                                        }

                                                        if (RegExp(`<\s*em[^>]*>(.*?)<\s*/\s*em>`).test(splitContent)) {
                                                            return <><Text style={styles.pasokContentMark}>{splitContent.match(/<em>(.*?)<\/em>/g).map((val) => val.replace(/<\/?em>/g, '').trim())}</Text><Text> </Text> </>
                                                        }
                                                        if (RegExp(`(.*?)<\s*/\s*דה>`).test(splitContent)) {
                                                            console.log(splitContent)
                                                            boldCenter = false;

                                                            return <><Text style={styles.pasokContentBold}>{splitContent.replace(new RegExp(/<.דה./, 'g'), '').replace(/<\/?דה>/g, '')}</Text><Text> </Text> </>

                                                        }
                                                        if (boldCenter) {
                                                            return <><Text style={styles.pasokContentBold}>{splitContent.replace(/<\/?דה>/g, '')}</Text><Text> </Text> </>

                                                        }

                                                        return <><Text style={styles.pasokContent}>{splitContent.replace(RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`), '')}</Text><Text> </Text></>
                                                    })}

                                                </>)
                                        })}

                                    </Text>
                                </TouchableOpacity>


                            </Accordian>
                        )
                    })}

                </ScrollView> :
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
        textAlign: 'right',
        direction: 'rtl',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0


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