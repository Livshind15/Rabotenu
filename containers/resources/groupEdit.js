
import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Background from '../../component/background/background';
import ClickButton from '../../component/clickButton/clickButton';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/AntDesign";
import IconEvilIcons from "react-native-vector-icons/EvilIcons";
import Input from '../../component/input/input';

const Stack = createStackNavigator();


const GroupEdit = ({ navigation, name='' }) => {
    const [groupName, setGroupName] = React.useState(name)
    const [edit, setEdit] = React.useState(false)
    return (
        <Background>
            <View style={styles.page}>
                {!edit && <View style={styles.groupNameContainer}>
                    <Text style={styles.groupName}>{groupName}</Text>
                    <TouchableOpacity onPress={() => {
                        setEdit(true)
                    }} underlayColor="#ffffff00">
                        <IconEvilIcons color={'#595959'} name={'pencil'} size={40}></IconEvilIcons>
                    </TouchableOpacity>

                </View>}
                {edit && <View style={styles.input}>
                    <View style={styles.buttonWrapper}>
                        <ClickButton outline={true} onPress={() => {
                            setEdit(false)
                        }} optionsButton={{ paddingVertical: 8 }} optionsText={{ fontSize: 16 }}>שמור</ClickButton>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Input isLoading={false} value={groupName} placeholder={'תן שם לקבוצה'} onChange={(text) =>setGroupName(text)} options={{ fontSize: 16, paddingHorizontal: 20, height: 40 }} />
                    </View>

                </View>}

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>מאגרי הקבוצה:</Text>
                </View>
                <View style={styles.resourcesContainer}>
                    <ScrollView style={styles.resourcesContainerScroll}>
                        {/* {(resources || []).map((resource, index) => ( */}
                        <View style={styles.resourceContainer}>
                            <View style={styles.resourceContainerStart} >
                                <TouchableOpacity underlayColor="#ffffff00" onPress={() => onRemove([resource.key])}>
                                    <Icon color={'#47BBB2'} name={'close'} size={20} />
                                </TouchableOpacity>
                                <Text style={styles.resourceName}>{"בדddיקה"}</Text>
                            </View>
                        </View>
                        {/* ))} */}
                    </ScrollView>
                </View>
                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonWrapper}><ClickButton optionsButton={{ paddingVertical: 7 }} optionsText={{
                        fontSize: 24.

                    }}>סגור</ClickButton></View>

                </View>

            </View>
        </Background>
    )
}



const styles = StyleSheet.create({
    resourceContainerStart: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'row-reverse',
    },
    input: {
        width: '100%',
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#A6A5A5',
        borderBottomWidth: 1,
        justifyContent: 'center',
    },
    groupNameContainer: {
        width: '100%',
        height: 60,
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        borderBottomColor: '#A6A5A5',
        borderBottomWidth: 1,
        paddingHorizontal: 25,
    },
    inputWrapper: {
        flex: 0.82,
        height: '100%',
        justifyContent: 'center'
    },
    resourceContainerEnd: {
        width: 'auto',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'row-reverse',
    },
    resourcesContainerScroll: {
        width: '100%',
        flex: 1
    },
    resourceName: {
        color: '#8D8D8D',
        fontFamily: "OpenSansHebrew",
        paddingRight: 10,
        fontSize: 20,
    },
    viewText: {
        color: '#7EC0BA',
        fontFamily: "OpenSansHebrew",
        fontSize: 20,
        paddingHorizontal: 15
    },
    resourceContainer: {
        width: '100%',
        height: 60,
        paddingHorizontal: 25,
        justifyContent: 'flex-start',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        borderColor: '#DCDCDC',
        borderWidth: 1
    },
    buttonWrapper: {
        width: 220,
        marginHorizontal: 10
    },
    page: {
        flex: 1,
        width: '100%'
    },
    title: {
        fontFamily: "OpenSansHebrewBold",
        fontSize: 23,
        paddingRight: 10,
        color: '#7B7B7B',
        textAlign: 'right'
    },
    groupName: {
        fontFamily: "OpenSansHebrewBold",
        fontSize: 25,
        color: '#595959',
        paddingLeft: 10,
        paddingBottom:1,
        textAlign: 'right'
    },
    titleContainer: {
        flex: 0.15,
        paddingVertical: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',

    },
    resourcesContainer: {
        flex: 1,
        width: '100%',
    },
    buttonsContainer: {
        flex: 0.35,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'

    },
    buttonsContainerRow: {
        flex: 1,
        width: '100%',
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default GroupEdit;