import * as React from 'react';
import { StyleSheet, ScrollView, View, Text, FlatList, TouchableOpacity } from 'react-native';



import Background from '../../component/background/background';

import config from "../../config/config";
import { useAsync } from "react-async";
import axios from "axios";
import { Spinner } from '@ui-kitten/components';
import _, { uniqBy } from 'lodash';
import { SearchContext } from '../../contexts/searchContext';
import ErrorModel from '../../component/modalError/modalError';
import Accordian from '../../component/accordian/accordian';
import { isEmpty } from 'lodash';
import { removeTag, removeBoldTag, removeGrayTag, removeSmallTag } from '../bookView/bookViewClass';
const headers = ["header1", "header2", "header3", "header4", "header5", "header6", "header7"]
import { flattenHeaders } from '../../component/resourcesTree/resourceTree';
import Content from '../bookView/contentRender';
import { RabotenuContext } from '../../contexts/applicationContext';


const getSearchContent = async ({ booksIds, searchInput, type, tableInput, headersFilters }) => {
    const { data } = await axios.post(`${config.serverUrl}/book/search/`, {
        "content": searchInput,
        "type": !isEmpty(tableInput) ? type || 'exact' : 'exact',
        size: 50,
        table: tableInput,
        headers: headersFilters,
        "booksIds": booksIds
    });
    return Promise.all(data.map(async verse => {

        return { ...verse }
    })).then(val => uniqBy(val,'index'))
}


const SearchView = ({ navigation, route }) => {
    const {
        textSize,
        grammar,
        exegesis,
        punctuation,
         } = React.useContext(RabotenuContext);
    const { searchInput, searchType, tableInput, resources, cache } = React.useContext(SearchContext);
    const bookIds = resources.map(resource => resource.bookId);
    const getAllBookFilter = React.useCallback(() => {
        return Object.keys(cache || {}).reduce((acc, curr) => {
            if (!bookIds.includes(cache[curr].id)) {
                const headers = flattenHeaders(cache[curr].tree, {})
                headers.map(header => {
                    const newHeader = header;
                    delete newHeader.id;
                    return newHeader
                })
                acc = { ...acc, [cache[curr].id]: headers };
            }
            return acc;
        }, {})
    }, [cache])
    const { data, error, isPending } = useAsync({ promiseFn: getSearchContent, tableInput, booksIds: route.params.booksIds, type: searchType, searchInput, headersFilters: getAllBookFilter() })
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
                            const header = `${item.groupName.replace('_', '"')}, ${item.bookName.replace('_', '"')}`;
                            const content = {
                                original: item,
                                id: 0,
                                type: "content",
                                value: item.content
                            }
                            return <Accordian key={index} initExpanded={true} header={header} >
                                <TouchableOpacity onPress={() => {
                                    navigation.push('Result', { selectedIndex: item.index,highlight:item.highlight, ...getHeaders(item), selectedBooks: [{ bookId: item.bookId }] })
                                }} style={styles.contentContainer}>
                                    <Content key={index} highlight={item.highlight} contentValue={content} refClick={() => { } } options={{textSize:textSize,punctuation,exegesis,grammar}}></Content>
                                </TouchableOpacity>
                            </Accordian>
                        }
                        } />
                    : <View style={styles.spinnerContainer}>
                        <Spinner />
                    </View>}
            </View>
        </Background>
    )
}


const getHeaders = (currHeaders) => {
    const filteredHeaders = headers.reduce((headersFilter, header) => {
        if (currHeaders[header]) {
            headersFilter[header] = currHeaders[header]
        }
        return headersFilter;
    }, {})
    const sortHeaders = Object.keys(filteredHeaders).filter(header => headers.includes(header)).sort((a, b) => {
        return headers.indexOf(a) - headers.indexOf(b);
    })
    return ({ stepBy: sortHeaders[sortHeaders.length - 1], selectedHeaders: filteredHeaders });
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
    pasokContentSmall: {
        color: '#455253',
        textAlign: 'right',
        fontSize: 14,
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

