import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import OctIcons from "react-native-vector-icons/Octicons";
import Accordian from '../../component/accordian/accordian';
import Feather from 'react-native-vector-icons/Feather';

const BookListTree = ({ results, bookId, deep = 0, onSelect = () => { } }) => {
    return <>
        {results.map((result, index) => (
            <Accordian onExpanded={() => {

                if (!result.tree ) {
                    onSelect({
                        'chapter': result.text
                    })
                }
            }} shouldExpanded={!!result.tree} customStyles={{ container: { paddingLeft: 0, paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={result.isBook ? `${result.groupId}, ${result.text}` : result.text} additionalComponent={
                result.isBook ? <View style={styles.endContainer}>
                    <TouchableOpacity onPress={() => {
                    if(bookId !== result.id){
                        onSelect({ 'book': result.id })
                    }}
                    } underlayColor="#ffffff00" >
                        <OctIcons style={{ paddingHorizontal: 5 }} color={bookId === result.id ? '#0384AE' : '#A0A0A0'} size={30} name={'book'}></OctIcons>
                    </TouchableOpacity>
                    <TouchableOpacity underlayColor="#ffffff00" >
                        <Feather style={{ paddingHorizontal: 5 }} color={'#0384AE'} size={30} name={'info'}></Feather>
                    </TouchableOpacity>
                </View> : <></>
            }>

                <View >
                    {result.tree && <BookListTree bookId={bookId} onSelect={onSelect} results={result.tree} deep={deep + 1} />}
                </View>

            </Accordian>
        ))}
    </>
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