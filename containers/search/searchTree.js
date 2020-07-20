import * as React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Entypo";



import Background from '../../component/background/background';
import Input from '../../component/input/input'
import ClickButton from '../../component/clickButton/clickButton';
import Accordian from '../../component/accordian/accordian';
import Tree from '../../component/tree/tree';
import result from './searchTree.mock';

const SearchTree = ({ navigation }) => {
    const [input, setInput] = React.useState('');

    return (
        <Background>
            <View style={styles.page}>
                <View style={styles.input}>
                    <View style={styles.buttonWrapper}>
                        <ClickButton outline={true} optionsButton={{ paddingVertical: 8 }} optionsText={{ fontSize: 16 }}>חיפוש</ClickButton>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Input value={input} onChange={setInput} options={{ fontSize: 16, paddingHorizontal: 20, height: 40 }} />
                    </View>
                </View>
                <View style={styles.resultCountWrapper}>
                    <Text style={styles.titleResult}>שם הספר</Text>
                    <Text style={styles.titleResult}>תוצאות</Text>
                </View>
                <ScrollView style={styles.scroll}>
                    <Tree results={result}/>
                </ScrollView>
            </View>

        </Background>
    )
}



const styles = StyleSheet.create({
    showButtonWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'

    },
    countResultWrapper: {
        backgroundColor: '#E4E4E4',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'

    },
    endContainer: {
        width: 120,
        flexDirection: 'row-reverse',
        height: '100%'
    },
    resultCountWrapper: {
        height: 40,
        width: '100%',
        paddingLeft:24,
        paddingRight:15,
        backgroundColor: '#CBD4D3',
        shadowColor: "#000",
        borderTopWidth: 1.5,
        borderTopColor: '#B6BAB9',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    countText: {
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 18,
        color: "#6D6D6D"
    },
    showButtonText: {
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 18,
        color: '#5AB3AC'
    },
    titleResult: {
        fontFamily: "OpenSansHebrewBold",
        textAlign: 'center',
        fontSize: 16,
        color: "#6D6D6D"
    },
    titleCount: {
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        fontSize: 14,
        color: '#878A8A'
    },
    inputWrapper: {
        flex: 0.82,
        height: '100%',
        justifyContent: 'center'
    },
    input: {
        width: '95%',
        height: 55,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonWrapper: {
        flex: 0.18,
        height: '100%',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignContent: 'center',
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
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
    }
});

export default SearchTree;