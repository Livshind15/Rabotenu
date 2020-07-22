import * as React from 'react';
import { StyleSheet, View, StatusBar, Text, TouchableOpacity, Platform } from 'react-native';
import ClickButton from '../../component/clickButton/clickButton';
import Input from '../../component/input/input'
import Icon from "react-native-vector-icons/Entypo";


import Background from '../../component/background/background';

export default function ExploreAddReplace({ navigation }) {

    return (
        <Background>
            <View style={styles.headerContainer}>
                <Text style={styles.textHeader}>החלפות והוספות</Text>
            </View>
            <View style={styles.bodyContainer}>
                <View style={styles.row}>
                    <View style={styles.startCol}>
                        <InputArea title={'במקום'}></InputArea>
                    </View>
                    <View style={styles.centerCol}>
                        <View style={styles.divider} />
                    </View>
                    <View style={styles.endCol}>
                        <InputArea withPlus={true}  title={'חפש את'}></InputArea>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.startCol}>
                        <InputArea title={'כשאחפש'}></InputArea>
                    </View>
                    <View style={styles.centerCol}>
                        <View style={styles.divider} />
                    </View>
                    <View style={styles.endCol}>
                        <InputArea withPlus={true} title={'חפש גם את'}></InputArea>
                    </View>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.buttonWrapper}>
                    <ClickButton optionsButton={{ paddingVertical: 6 }} onPress={() => navigation.goBack()}>אישור</ClickButton>
                </View>
                <TouchableOpacity
                    underlayColor="#ffffff00"
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.clickText}>סגירה ללא שמירה</Text>
                </TouchableOpacity>
            </View>

        </Background>
    );
}

const InputArea = ({ title, withPlus = false }) => (
    <View style={styles.InputArea}>
        <Text style={styles.inputTitle}>{title}</Text>
        <View style={styles.inputAndButton}>
            <View style={styles.input}>
                <Input onChange={()=>{}} options={{ height: 32 }} placeholder={""} />
            </View>
            {withPlus && <View style={styles.plusButton}>
            <TouchableOpacity
                style={[styles.button]}
                underlayColor="#ffffff00"
            >
            <Icon name={'plus'} size={20} color={'#ffffff'}></Icon>
            </TouchableOpacity>
            </View>}
        </View>

    </View>
)



const styles = StyleSheet.create({
    button:{
        width: 27,
        height:27,
        paddingVertical: 5,
        borderRadius: 100,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#00AABE',

    },
    iconWrapper:{
        flex:1,
        width:'100%',
        backgroundColor:'red'
    },
    inputAndButton: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center'
    },
    plusButton: {
        width: 25,
        paddingTop:1,
        marginRight: 7,
        marginLeft: 8
    },

    inputTitle: {
        paddingBottom: 5,
        fontFamily: "OpenSansHebrew",
        fontSize: 16,
        paddingRight: 5,
        color: '#B0B0B0'
    },
    InputArea: {
        flex: 1,
        paddingRight: 5,
        justifyContent: 'center',
    },
    input: {
        alignItems: 'center',
        width: '98%',
        flex: 1,
        alignSelf: 'flex-end'
    },
    clickText: {
        color: '#11AFC2',
        fontFamily: "OpenSansHebrew",
        textAlign: 'center',
        paddingTop: 14,
        fontSize: 22,
        borderBottomColor: '#11AFC2',
        borderBottomWidth: 1,
    },
    buttonWrapper: {
        width: 95
    },
    divider: {
        flex: 0.8,
        width: 1,
        backgroundColor: '#E5E5E5',
        borderRadius: 100
    },
    startCol: {
        flex: 1,
    },
    centerCol: {
        flex: 0.05,
        justifyContent: 'center',
        alignItems: 'center'
    },
    endCol: {
        flex: 1,
    },
    row: {
        flex: 1,
        flexDirection: 'row-reverse'
    },
    headerContainer: {
        flex: 0.1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textHeader: {
        fontSize: 24,
        fontFamily: "OpenSansHebrewBold",
        color: '#5E5E5E',
    },
    bodyContainer: {
        flex: 0.5,
        width: '100%',
        flexDirection: 'column'

    },
    bottomContainer: {
        flex: 0.4,
        width: '100%',
        paddingTop: 20,
        alignItems: 'center'

    },
    page: {
        flex: 1,
        width: '100%',
        height: '90%',
        alignItems: 'center',
        alignContent: 'center',
    }
});
