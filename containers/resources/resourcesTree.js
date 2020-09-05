import * as React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';


import Background from '../../component/background/background';
import ResourceTree, { addCheckForBookHeaders } from '../../component/resourcesTree/resourceTree';
import { flatten } from 'lodash';
import ErrorModel from '../../component/modalError/modalError';
import { getBookTree } from '../explore/exploreTreeView';
import { SearchContext } from '../../contexts/searchContext';
import { getBookInfo } from './resources';


const ResourcesTreeView = ({ navigation }) => {
    const { setResourceToggle, resources, setCache, setRemoveResources, setResources } = React.useContext(SearchContext);
    const updateCache = (bookFilter, bookId, cacheState) => {
        setCache({ ...cacheState, [bookId]: bookFilter });
    }
   
    const getBook = async (bookId, state, cacheState) => {
        const bookFilter = await getBookInfo(bookId, state, cacheState)
        setCache({ ...cacheState, [bookId]: bookFilter });
        return bookFilter
    }

    return (
        <Background>

            <View style={styles.page}>

                <ScrollView style={styles.scroll}>
                    <ResourceTree updateCache={updateCache} getBookInfo={getBook} navigation={navigation} onChange={(removeResources, resourceTree) => {
                        setResources(resourceTree)
                        setRemoveResources(removeResources)
                        setResourceToggle(false)
                    }} groups={resources} />
                </ScrollView>
            </View>
        </Background>
    )
}


const styles = StyleSheet.create({
    resultText: {
        fontSize: 16,
        paddingRight: 15,
        fontFamily: "OpenSansHebrew",
        color: '#8D8C8C',
    },
    spinnerContainer: {
        flex: 1,
        width: "100%",
        justifyContent: 'center',
        alignItems: "center"
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
        justifyContent: 'flex-start',
        paddingTop: 4,
        alignContent: 'center'
    }
});

export default ResourcesTreeView;