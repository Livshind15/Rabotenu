
import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Background from '../../component/background/background';
import ClickButton from '../../component/clickButton/clickButton';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/AntDesign";
import IconEvilIcons from "react-native-vector-icons/EvilIcons";
import GroupEdit from './groupEdit';
const Stack = createStackNavigator();


const ResourcesGroups = ({ navigation, groups, selectedGroup, onGroupSelect,currCache, currResources, onSave, removeGroup }) => {

    return (
        <Background>
            <View style={styles.page}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>הקבוצות שלי:</Text>
                </View>
                <View style={styles.resourcesContainer}>
                    <ScrollView style={styles.resourcesContainerScroll}>
                        {Object.keys(groups || {}).map((groupId, index) => (
                            <TouchableOpacity keys={index} style={styles.resourceContainer}>
                                <View style={styles.resourceContainerStart} >
                                    <TouchableOpacity underlayColor="#ffffff00" onPress={() => {
                                        removeGroup(groupId)
                                    }}>
                                        <Icon color={'#47BBB2'} name={'close'} size={20} />
                                    </TouchableOpacity>
                                    <Text style={styles.resourceName}>{groups[groupId].groupName}</Text>
                                </View>

                                <View style={styles.resourceContainerEnd} >
                                    <TouchableOpacity onPress={() => {
                                        navigation.push('edit', { edit: false,cache: groups[groupId].cache, resources: groups[groupId].resources, groupName: groups[groupId].groupName, groupId, onSave: onSave })
                                    }} underlayColor="#ffffff00">
                                        <IconEvilIcons color={'#B4B4B4'} name={'pencil'} size={40}></IconEvilIcons>
                                    </TouchableOpacity>
                                    <TouchableOpacity underlayColor="#ffffff00">
                                        <Text onPress={() => onGroupSelect(groupId)} style={[styles.viewText, groupId !== selectedGroup ? styles.viewTextDisable : '']}>{"בחר"}</Text>
                                    </TouchableOpacity>

                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonWrapper}><ClickButton onPress={() => {
                        navigation.push('edit', { edit: true,cache: currCache, resources: currResources, groupName: "", onSave: onSave })
                    }} optionsButton={{ paddingVertical: 7 }} optionsText={{ fontSize: 22 }}>יצרת קבוצה חדשה</ClickButton></View>

                </View>

            </View>
        </Background>
    )
}

const Routes = (args) => {
    const resourcesGroups = (props) => <ResourcesGroups  {...args} {...props} />
    const groupEdit = (props) => <GroupEdit {...args}  {...props} />

    return (
        <Stack.Navigator initialRouteName="main" >
            <Stack.Screen name="main" options={{ headerShown: false, title: 'רבותינו' }} component={resourcesGroups} />
            <Stack.Screen name="edit" options={{ headerShown: false, title: 'רבותינו' }} component={groupEdit} />
        </Stack.Navigator>
    );
}



const styles = StyleSheet.create({

    resourceContainerStart: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'row-reverse',
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
    viewTextDisable: {
        color: '#B4B4B4',

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
    titleContainer: {
        flex: 0.15,
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

export default Routes;