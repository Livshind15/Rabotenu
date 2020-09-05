import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Accordian from '../../component/accordian/accordian';
import Feather from 'react-native-vector-icons/Feather';
import { isEmpty } from 'lodash';
import { Spinner, CheckBox } from '@ui-kitten/components';
import { addCheckForBookHeaders, isArrayEqual, flattenHeaders } from '../resourcesTree/resourceTree';

const getParentBook = (result) => {
    if (result.id) {
        return result.id;
    }
    else if (result.parent) {
        return getParentBook(result.parent)
    }
    return '';
}

const parentHeaders = (result) => {
    if (result.isBook) {
        return {};
    }
    const headers = { [result.type]: result.text, ...parentHeaders(result.parent) }
    return headers;
}
const BookListTreeCheckBox = ({ results, bookId, parent, deep = 0, onChange = () => { }, onUnCheck = () => { }, onSelect = () => { } }) => {
    const [headers, setHeaders] = React.useState(results)
    React.useEffect(() => {
        setHeaders(results)
    }, [results])
    // React.useEffect(() => {
    //     onChange(headers)
    // }, [headers])

    return (headers || []).map((result, index) => {
        const [expanded, setExpanded] = React.useState(false)
        return (<Accordian
            initExpanded={expanded}
            endToggle={true}
            onToggleClick={(state) => {
                setExpanded(state)
            }}
            onLongPress={() => {

            }} onExpanded={() => {
                // if (result.isBook) {
                //     onSelect({ 'bookId': result.id })
                // }
                // else {
                //     onSelect({
                //         'bookId': getParentBook(parent),
                //         ...parentHeaders(parent),
                //         [result.type]: result.text,
                //         stepBy: result.type
                //     })
                // }

                // setExpanded(false)
            }} shouldExpanded={!isEmpty(result.tree)} customStyles={{ header: { paddingLeft: result.tree ? 0 : (2 * deep), paddingRight: result.tree ? 0 : (2 * deep) }, container: { paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={result.isBook ? `${result.groupId.replace('_', '"')}, ${result.text.replace('_', '"')}` : result.text.replace('_', '"')} additionalComponent={
                !result.isBook ?
                    <View style={styles.checkBoxWrapper}>
                        <CheckBox
                            checked={result.isCheck}
                            onChange={(state) => {
                                const newResults = headers;

                                newResults[index].isCheck = state;
                                if (state) {
                                    newResults[index].tree = addCheckForBookHeaders(newResults[index].tree, true)

                                }
                                else {
                                    onUnCheck();
                                }
                                setHeaders([...newResults])
                                onChange([...newResults])

                                // else {
                                //     if (!parent.isBook) {
                                //         const newParent = parent;
                                //         newParent.isCheck = false
                                //         // onParentChange({ ...newParent, tree: newResults })
                                //     }

                                // }
                                // onParentChange({ ...parent, tree: newResults })

                                // setGroups([...newGroupsState])
                                // onChange(flatten(getAllBooksInGroup(newGroupsState)), newGroupsState)

                            }}>
                        </CheckBox>
                    </View> : <></>
            }>

            <View >
                {result.tree && <BookListTreeCheckBox onUnCheck={() => {

                    const newResults = headers;

                    newResults[index].isCheck = false;

                    setHeaders([...newResults])
                    onChange([...newResults])


                }} parent={{ ...result, parent: parent }} onChange={(change) => {
                    const newResults = headers;
                    // if (!isArrayEqual(flattenHeaders(result.tree),flattenHeaders(change))) {
                        newResults[index] = { ...result, tree: change };
                        setHeaders([...newResults])
                        onChange([...newResults])
                    // }

                }} bookId={bookId} onSelect={onSelect} results={result.tree} deep={deep + 1} />}
            </View>

        </Accordian>)
    })
}

const styles = StyleSheet.create({
    resultText: {
        fontSize: 16,
        paddingRight: 15,
        fontFamily: "OpenSansHebrew",
        color: '#8D8C8C',
    },
    checkBoxWrapper: {
        alignItems: 'center',
        width: 45
    },
    resultContainer: {
        height: 40,
        paddingLeft: 25,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderColor: '#E4E4E4'
    },
    endContainer: {
        width: 100,
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }
})

export default BookListTreeCheckBox;