import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import OctIcons from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/Entypo";
import Accordian from '../accordian/accordian';
import { CheckBox } from '@ui-kitten/components';
import { flatten, isEmpty } from 'lodash';
import { Spinner } from '@ui-kitten/components';
import BookListTree from '../bookListTree/bookListTree';
import BookListTreeCheckBox from '../bookListTree/bookListTreeCheckBox';
import { SearchContext } from '../../contexts/searchContext';

const changeGroupsChecks = (group, state) => {
    const books = (group.books || []).map(book => {
        return { ...book, isCheck: state }
    })
    let subGroups = []
    if (group.subGroups && group.subGroups.length) {
        subGroups = group.subGroups.map(subGroup => changeGroupsChecks(subGroup, state))
    }
    return { ...group, books, subGroups, isCheck: state }
}


const getAllBooksInGroup = (groups) => {
    return groups.reduce((groups, group) => {
        let removeResource = { booksId: [], groupIds: '' }
        removeResource.booksId = (group.books || []).reduce((books, book) => {
            if (!book.isCheck) {
                books.push(book.bookId)
            }
            return books;
        }, [])
        if (!group.isCheck) {
            removeResource.groupIds = group.groupId;
        }
        groups.push(removeResource)

        if (group.subGroups && group.subGroups.length) {
            groups = [...groups, ...flatten(getAllBooksInGroup(group.subGroups))]

        }
        return groups
    }, [])

}

export const changeCheckById = (bookHeaders, check,uuid) => {
    return bookHeaders.map(bookHeader => {
       if(bookHeader.uuid === uuid) {
        return { ...bookHeader, tree: addCheckForBookHeaders(bookHeader.tree || [], false, false) , isCheck: check }

       }
        return { ...bookHeader, tree: changeCheckById(bookHeader.tree || [], check,uuid) }
    })
}
export const addCheckForBookHeaders = (bookHeaders, check,newUuid) => {
    return bookHeaders.map(bookHeader => {
        if(newUuid){
            return { ...bookHeader, tree: addCheckForBookHeaders(bookHeader.tree || [], check,newUuid), isCheck: check,uuid:Math.random() }

        }
        return { ...bookHeader, tree: addCheckForBookHeaders(bookHeader.tree || [], check,newUuid), isCheck: check }
    })
}
const checkForUnCheckResource = (group) => {
    if (!group.books.every(book => !book.isCheck) && group.books.some(book => !book.isCheck)) {
        return true;
    }
    return false
}
export const flattenHeaders = (tree, headers) => {
    return tree.reduce((treeHeaders, header) => {
        if (header.isCheck) {
            treeHeaders = [...treeHeaders, { [header.type]: header.text,id:header.uuid, ...headers }]
        }
        else {
            treeHeaders = [...treeHeaders, ...flattenHeaders(header.tree, { [header.type]: header.text, ...headers })]

        }

        return treeHeaders;
    }, [])
}
export const flattenAllHeaders = (tree, headers) => {
    return tree.reduce((treeHeaders, header) => {
        treeHeaders = [...treeHeaders, { [header.type]: header.text, ...headers }]


        return treeHeaders;
    }, [])
}

export const isArrayEqual = function (x, y) {
    return _(x).xorWith(y, _.isEqual).isEmpty();
};


const ResourceTree =    ({ getBookInfo, navigation, updateCache, onChange = () => { }, groups = [], deep = 0 }) => {

    const [groupsState, setGroups] = React.useState(groups);
    React.useEffect(() => {
        setGroups(groups);
    }, [groups])

    return (groupsState || []).map((group, index) => {

        const isIndeterminate = checkForUnCheckResource(group);
        return (<Accordian

            customStyles={{ container: { paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={group.groupName} additionalComponent={
                <View style={styles.checkBoxWrapper}>
                    <CheckBox
                        checked={group.isCheck}

                        indeterminate={isIndeterminate}
                        onChange={(state) => {
                            const newGroupsState = groupsState;
                            newGroupsState[index] = changeGroupsChecks(newGroupsState[index], state);
                            setGroups([...newGroupsState])
                            onChange(flatten(getAllBooksInGroup(groupsState)), groupsState)
                        }}>
                    </CheckBox>
                </View>
            } endToggle={true}>
            {group.subGroups.length || group.books.length ? <View style={styles.innerScroll}>
                {group.subGroups.length ? <ResourceTree updateCache={updateCache}  getBookInfo={getBookInfo} onChange={() => onChange(flatten(getAllBooksInGroup(groupsState)), groupsState)} navigation={navigation} groups={group.subGroups} deep={deep + 1} /> : <></>}
                {group.books.length ? ((group.books) || []).map((book, key) => {
                    const [isLoading, setLoading] = React.useState(false);
                    const [expanded, setExpanded] = React.useState(false);
                    const { cache } = React.useContext(SearchContext);
                    const info = cache[book.bookId]
                    const onBookFilterChange = React.useCallback(async (change) => {
                        const newInfo = info;
                        newInfo.tree = change;
                        updateCache(newInfo, book.bookId, cache)
                    }, [cache])
                    const onExpanded = React.useCallback(async (state) => {
                        if (state) {
                            setLoading(true);
                            const infoRes = await getBookInfo(book.bookId, book.isCheck, cache)
                            updateCache(infoRes, book.bookId, cache)
                            setLoading(false);

                        }


                        {/* } */ }
                        {/* setLoading(false); */ }


                    }, [info, cache,book])
                  
                    return (<Accordian
                        onExpanded={onExpanded}
                        initExpanded={expanded}

                        shouldExpanded={!isEmpty(info) && !isEmpty(info.tree)}
                        customStyles={{ container: { paddingRight: (40 + (10 * deep)) } }} key={key} index={key} additionalComponent={
                            <View style={styles.checkBoxWrapper}>
                                {isLoading ? <Spinner></Spinner> : <CheckBox
                                    checked={book.isCheck}
                                    onChange={(state) => {
                                        const newGroupsState = groupsState;
                                        newGroupsState[index].books[key].isCheck = state;
                                        // setInfo({ ...info, tree: addCheckForBookHeaders(info.tree, state) })
                                        setGroups([...newGroupsState])
                                        onChange(flatten(getAllBooksInGroup(newGroupsState)), newGroupsState)


                                    }}>
                                </CheckBox>}
                            </View>} endToggle={true} header={book.bookName}>
                        {!isEmpty(info) && !isEmpty(info.tree) ? <BookListTreeCheckBox onUnCheck={() => {

                        }} onSelect={(select) => {


                        }} deep={deep + 5} results={info.tree} onUnCheck={() => {
                            const newGroupsState = groupsState;
                            newGroupsState[index].books[key].isCheck = false;
                            setGroups([...newGroupsState])
                            onChange(flatten(getAllBooksInGroup(newGroupsState)), newGroupsState)
                        }} onChange={onBookFilterChange} bookId={book.bookId} parent={info}></BookListTreeCheckBox> : <></>}
                    </Accordian>)
                }
                ) : <></>}
            </View> : <></>}
        </Accordian>)
    })
}

const styles = StyleSheet.create({
    checkBoxWrapper: {
        alignItems: 'center',
        width: 45
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

export default ResourceTree;

{/* <TouchableOpacity underlayColor="#ffffff00" key={key} style={[styles.resultContainer, { paddingRight: (40 + (10 * deep)) }]}>
<Text style={styles.resultText}>{book.bookName}</Text>
<View style={styles.checkBoxWrapper}>
    <CheckBox
        checked={book.isCheck}
        onChange={(state) => {
            const newGroupsState = groupsState;
            newGroupsState[index].books[key].isCheck = state;
            setGroups([...newGroupsState])
            onChange(flatten(getAllBooksInGroup(newGroupsState)),newGroupsState)

        }}>
    </CheckBox>
</View>
</TouchableOpacity> */}