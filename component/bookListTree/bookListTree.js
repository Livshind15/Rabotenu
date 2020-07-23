import * as React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';

import Ionicons from "react-native-vector-icons/Ionicons";


import OctIcons from "react-native-vector-icons/Octicons";
import Accordian from '../../component/accordian/accordian';
import Feather from 'react-native-vector-icons/Feather';

const BookListTree = ({ results, deep = 0 }) => (
    <>
        {results.map((result, index) => (
            <Accordian customStyles={{ container: { paddingLeft: 0, paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={result.title} additionalComponent={
                <View style={styles.endContainer}>
                <Feather color={'#0384AE'} size={30} name={'info'}></Feather>
                </View>
            }>
                <View >
                    {result.tree && <BookListTree results={result.tree} deep={deep + 1} />}              
                        {((result.books) || []).map((book, index) => <TouchableOpacity underlayColor="#ffffff00" key={index} style={[styles.resultContainer, { paddingRight: (40 + (10 * deep)) }]}>
                            <Text style={styles.resultText}>{book.title}</Text>
                            <OctIcons name={'book'} size={22} color={'#9AD3CE'}></OctIcons>
                        </TouchableOpacity>)}
                </View>

            </Accordian>
        ))}
    </>
)

const styles = StyleSheet.create({
    resultText: {
        fontSize: 16,
        paddingRight: 15,
        fontFamily: "OpenSansHebrew",
        color: '#8D8C8C',
    },
    innerScroll: {
        flex: 1,
        width: '100%',
    },
    innerTree:{
        flex: 1,
        width: '100%',
        backgroundColor:'yellow'
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
        justifyContent:'center',
        alignItems:'center',
        height: '100%'
    }
})

export default BookListTree;