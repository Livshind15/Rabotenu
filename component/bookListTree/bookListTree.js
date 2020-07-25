import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import OctIcons from "react-native-vector-icons/Octicons";
import Accordian from '../../component/accordian/accordian';
import Feather from 'react-native-vector-icons/Feather';

const BookListTree = ({ results, deep = 0 }) => (
    <>
        {results.map((result, index) => (
            <Accordian customStyles={{ container: { paddingLeft: 0, paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={result.text} additionalComponent={
                result.isBook ?  <View style={styles.endContainer}>
                    <Feather color={'#0384AE'} size={30} name={'info'}></Feather>
                </View>: <></>
            }>
                <View >
                    {result.tree && <BookListTree results={result.tree} deep={deep + 1} />}
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