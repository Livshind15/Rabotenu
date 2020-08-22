import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import OctIcons from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/Entypo";
import Accordian from '../accordian/accordian';
import { useAsync } from "react-async";
import BookListTree from '../bookListTree/bookListTree'
import { isEmpty } from 'lodash';
import { Spinner } from '@ui-kitten/components';

const ExploreTree = ({ getBookInfo, navigation, groups = [], deep = 0 }) => {
    return (groups || []).map((group, index) => {
        return <Accordian customStyles={{ container: { paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={group.groupName.replace('_', '"') || ''} additionalComponent={<Icon name={'folder'} size={22} color={'#515151'} />}>
            {group.subGroups && group.subGroups && group.subGroups.length || group.books.length ? <View style={styles.innerScroll}>
                {group.subGroups && group.subGroups.length ? <ExploreTree getBookInfo={getBookInfo} navigation={navigation} groups={group.subGroups} deep={deep + 1} /> : <></>}
                {group.books.length ? ((group.books) || []).map((book, index) => {
                    const [info, setInfo] = React.useState([]);
                    const [isLoading, setLoading] = React.useState(false);
                    const [expanded, setExpanded] = React.useState(false);
                    return <Accordian
                        initExpanded={expanded}
                        onExpanded={(state) => {
                            if (state) {
                                setLoading(true);
                                getBookInfo(book.bookId).then(infoRes => {
                                    setInfo(infoRes[0] || [])
                                    if (isEmpty(infoRes[0].tree)) {
                                        navigation.push('Result', { selectedBooks: [{ bookId: book.bookId }] })
                                    }
                                    else {
                                        setExpanded(true);
                                    }
                                    setLoading(false);

                                })
                            }
                        }}
                        shouldExpanded={!isEmpty(info) && !isEmpty(info.tree)}
                        additionalComponent={
                            <TouchableOpacity style={{ paddingRight: 25+ (10 * deep) , paddingLeft: 5 }} onPress={() => navigation.push('Result', { selectedBooks: [{ bookId: book.bookId }] })} underlayColor="#ffffff00">
                                {isLoading ? <Spinner></Spinner> : <OctIcons name={'book'} size={22} color={'#9AD3CE'} />}
                            </TouchableOpacity>} endToggle={true} header={book.bookName.replace('_', '"')}  >
                        {!isEmpty(info) && !isEmpty(info.tree) ? <BookListTree onSelect={({ bookId, chapter, verse, section }) => {
                            navigation.push('Result', { selectedBooks: [{ bookId: bookId }], selectedChapter: chapter, selectedVerse: verse, selectedSection: section })
                        }} deep={deep + 5} results={info.tree} bookId={book.bookId} parent={info}></BookListTree> : <></>}
                    </Accordian>
                }) : <></>}
            </View> : <></>}

        </Accordian>
    })
}


const styles = StyleSheet.create({
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

    innerScroll: {
        flex: 1,
        width: '100%',
    }
})

export default ExploreTree;