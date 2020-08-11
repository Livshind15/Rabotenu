import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import OctIcons from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/Entypo";
import Accordian from '../accordian/accordian';
import { CheckBox } from '@ui-kitten/components';
import { flatten } from 'lodash';

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


const getAllBooksInGroup = (group) => {
    let removeResource = [{ booksId: [], groupIds: '' }]
    removeResource[0].booksId = (group.books || []).reduce((books, book) => {
        if (!book.isCheck) {
            books.push(book.bookId)
        }
        return books;
    }, [])
    if (removeResource[0].booksId.length === group.books.length  ) {
        removeResource[0].groupIds = group.groupId;
    }
    if (group.subGroups && group.subGroups.length) {
        removeResource = [...removeResource, ...flatten(group.subGroups.map(subGroup => getAllBooksInGroup(subGroup)))]

    }
    return removeResource
}

const checkForUnCheckResource = (group) => {
    if (!group.books.every(book => !book.isCheck) && group.books.some(book => !book.isCheck)) {
        return true;
    }
    return false
}

const ResourceTree = ({ navigation, onChange = () => { }, groups = [], deep = 0 }) => {
    const [groupsState, setGroups] = React.useState(groups);
    React.useEffect(() => {
        setGroups(groups);
    }, [groups])

    return (groupsState || []).map((group, index) => {
        const isIndeterminate = checkForUnCheckResource(group);
        return (<Accordian customStyles={{ container: { paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={group.groupName} additionalComponent={
            <View style={styles.checkBoxWrapper}>
                <CheckBox
                    checked={group.isCheck}
                    indeterminate={isIndeterminate}
                    onChange={(state) => {
                        const newGroupsState = groupsState;
                        newGroupsState[index] = changeGroupsChecks(newGroupsState[index], state);
                        setGroups([...newGroupsState])
                        onChange(flatten(getAllBooksInGroup(newGroupsState[index])))
                    }}>
                </CheckBox>
            </View>
        } endToggle={true}>
            {group.subGroups.length || group.books.length ? <View style={styles.innerScroll}>
                {group.subGroups.length ? <ResourceTree onChange={onChange} navigation={navigation} groups={group.subGroups} deep={deep + 1} /> : <></>}
                {group.books.length ? ((group.books) || []).map((book, key) => <TouchableOpacity underlayColor="#ffffff00" key={key} style={[styles.resultContainer, { paddingRight: (40 + (10 * deep)) }]}>
                    <Text style={styles.resultText}>{book.bookName}</Text>
                    <View style={styles.checkBoxWrapper}>
                        <CheckBox
                            checked={book.isCheck}
                            onChange={(state) => {
                                const newGroupsState = groupsState;
                                newGroupsState[index].books[key].isCheck = state;
                                setGroups([...newGroupsState])
                                onChange(flatten(getAllBooksInGroup(newGroupsState[index])))

                            }}>
                        </CheckBox>
                    </View>
                </TouchableOpacity>) : <></>}
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