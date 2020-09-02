import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Accordian from '../../component/accordian/accordian';
import Feather from 'react-native-vector-icons/Feather';
import { isEmpty } from 'lodash';

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
const BookListTree = ({ results, bookId, parent, deep = 0, onSelect = () => { } }) => {
    return results.map((result, index) => {
        const [expanded, setExpanded] = React.useState(false)
        return (<Accordian
            initExpanded={expanded}
            onToggleClick={(state) => {
                setExpanded(state)
            }}
            onLongPress={() => {

            }} onExpanded={() => {
                if (result.isBook) {
                    onSelect({ 'bookId': result.id })
                }
                else {
                    onSelect({
                        'bookId': getParentBook(parent),
                        ...parentHeaders(parent),
                        [result.type]: result.text,
                        stepBy:result.type
                    })
                }

                setExpanded(false)
            }} shouldExpanded={!isEmpty(result.tree)} customStyles={{ header: { paddingLeft: 0, paddingRight: result.tree ? 0 : (2 * deep) }, container: { paddingLeft: 0, paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={result.isBook ? `${result.groupId.replace('_', '"')}, ${result.text.replace('_', '"')}` : result.text.replace('_', '"')} additionalComponent={
                result.isBook ? <View style={styles.endContainer}>
                    <TouchableOpacity onPress={() => {
                        if (bookId !== result.id) {
                            onSelect({ 'book': result.id })
                        }
                    }
                    } underlayColor="#ffffff00" >
                        <MaterialCommunityIcons style={{ paddingHorizontal: 5 }} color={bookId === result.id ? '#01A7BC' : '#A0A0A0'} size={30} name={'eye'} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity underlayColor="#ffffff00" >
                        <Feather style={{ paddingHorizontal: 5 }} color={'#0384AE'} size={30} name={'info'}></Feather>
                    </TouchableOpacity> */}
                </View> : <></>
            }>

            <View >
                {result.tree && <BookListTree parent={{ ...result, parent: parent }} bookId={bookId} onSelect={onSelect} results={result.tree} deep={deep + 1} />}
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

export default BookListTree;