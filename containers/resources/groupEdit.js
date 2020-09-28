
import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Background from '../../component/background/background';
import ClickButton from '../../component/clickButton/clickButton';
import {  FlatList } from 'react-native-gesture-handler';
import { EvilIcons } from '@expo/vector-icons'; 

import Input from '../../component/input/input';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';
import PlaceHolder from '../../component/placeHolder/placeHolder';
import ErrorModel from '../../component/modalError/modalError';
import { getAllBooksFromGroups } from './resources.utils';
import { flattenHeaders } from '../../component/resourcesTree/resourceTree';
import { itemToTitle } from './searchResource';

const Stack = createStackNavigator();
const headers = ["header1", "header2", "header3", "header4", "header5", "header6", "header7"]


const GroupEdit = ({ navigation, route }) => {
    const { edit, resources, groupName, groupId, onSave, cache } = route.params;
    const [showErrorModel, setShowErrorModel] = React.useState(false)
    const bookIds = resources.map(resource => resource.bookId);

    const getAllBookFilter = React.useCallback(() => {
        return Object.keys(cache || {}).reduce((acc, curr) => {
            if (!bookIds.includes(curr)) {
                const headers = flattenHeaders(cache[curr].tree, {})
                headers.forEach(header => {
                    acc.push({ ...cache[curr], bookFilter: true, filters: header });

                })
            }
            return acc;
        }, [])
    }, [cache])
    const [name, setGroupName] = React.useState(groupName)
    const [isEdit, setEdit] = React.useState(edit)
    return (
        <Background>
            <ErrorModel errorMsg={"לא נבחר שם לקבוצה"} errorTitle={'שגיאה'} visible={showErrorModel} setVisible={setShowErrorModel} />
            <View style={styles.page}>
                {!isEdit && <View style={styles.groupNameContainer}>
                    <Text style={styles.groupName}>{name}</Text>
                    <TouchableOpacity onPress={() => {
                        setEdit(true)
                    }} underlayColor="#ffffff00">
                        <EvilIcons color={'#595959'} name={'pencil'} size={40}></EvilIcons>
                    </TouchableOpacity>

                </View>}
                {isEdit && <View style={styles.input}>
                    <View style={styles.buttonWrapper}>
                        <ClickButton outline={true} onPress={() => {
                            setEdit(false)
                        }} optionsButton={{ paddingVertical: 8 }} optionsText={{ fontSize: 16 }}>שמור</ClickButton>
                    </View>
                    <View style={styles.inputWrapper}>
                        <Input isLoading={false} value={name} placeholder={'תן שם לקבוצה'} onChange={(text) => setGroupName(text)} options={{ fontSize: 16, paddingHorizontal: 20, height: 40 }} />
                    </View>

                </View>}

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>מאגרי הקבוצה:</Text>
                </View>
                <View style={styles.resourcesContainer}>

                    <FlatList

                        data={[...getAllBookFilter(), ...getAllBooksFromGroups(resources)]}
                        keyExtractor={(key, index) => index.toString()}
                        initialNumToRender={7}
                        onEndReachedThreshold={0.5}
                        onScrollToIndexFailed={() => { }}
                        getItemLayout={(data, index) => {
                            return { length: 60, offset: 60 * index, index }
                        }}
                        style={styles.resourcesContainerScroll}
                        renderItem={({ item, index }) => {
                            return !!item.bookFilter ? <View key={index} style={styles.resourceContainer}>
                                <View style={styles.resourceContainerStart} >
                                  
                                    <Text style={styles.resourceName}>{itemToTitle(item)}</Text>
                                </View>
                            </View> : <View key={index} style={styles.resourceContainer}>
                                    <View style={styles.resourceContainerStart} >
                        
                                        <Text style={styles.resourceName}>{`${item.groupName}, ${item.bookName}`}</Text>
                                    </View>
                                </View>
                            return
                        }}
                    />

                </View>
                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonWrapper}><ClickButton onPress={() => {
                        if (!name.length) {
                            setShowErrorModel(true)
                        }
                        else {
                            if (groupId) {
                                onSave({ resources, groupName: name, groupId })
                                navigation.navigate('groupResource', { screen: 'main' });
                            }
                            if (!groupId) {
                                onSave({ resources, groupName: name, groupId: Math.random() })
                                navigation.navigate('groupResource', { screen: 'main' });
                            }
                        }
                    }} optionsButton={{ paddingVertical: 7 }} optionsText={{
                        fontSize: 24.

                    }}>שמור</ClickButton></View>

                </View>

            </View>
        </Background >
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
        paddingBottom: 1,
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

export default optimizeHeavyScreen(GroupEdit, PlaceHolder);