import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import OctIcons from "react-native-vector-icons/Octicons";
import Accordian from '../../component/accordian/accordian';


const Tree = ({ results, deep = 0 }) => (
    <>
        {results.map((result, index) => (
            <Accordian customStyles={{ container: { paddingLeft: 0, paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={result.title} additionalComponent={
                <View style={styles.endContainer}>
                    <View style={styles.showButtonWrapper}>
                        <TouchableOpacity
                            underlayColor="#ffffff00" >
                            <Text style={styles.showButtonText}>צפייה</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.countResultWrapper}>
                        <Text style={styles.countText}>{result.len}</Text>
                    </View>
                </View>
            }>
                <View >
                    {result.tree && <Tree results={result.tree} deep={deep + 1} />}
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
    countResultWrapper: {
        backgroundColor: '#E4E4E4',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
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
    countText: {
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 18,
        color: "#6D6D6D"
    },
    endContainer: {
        width: 150,
        flexDirection: 'row-reverse',
        height: '100%'
    },
    showButtonWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    showButtonText: {
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 18,
        color: '#5AB3AC'
    },
})

export default Tree;