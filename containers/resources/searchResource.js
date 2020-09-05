
import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Background from '../../component/background/background';
import ClickButton from '../../component/clickButton/clickButton';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/AntDesign";
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';
import PlaceHolder from '../../component/placeHolder/placeHolder';
import { flattenHeaders } from '../../component/resourcesTree/resourceTree';
import { isEmpty } from 'lodash';

const { Navigator, Screen } = createMaterialTopTabNavigator();
const headers = ["header1", "header2", "header3", "header4", "header5", "header6", "header7"]

export const itemToTitle = (item) => {
    let title = ` ${item.groupId.replace('_', '"')}, ${item.text.replace('_', '"')}`;
    const headersTitles = isEmpty(item.filters) ? '' : headers.reduce((headersTitle, key, index) => {
      if (!isEmpty(item.filters[key])) {
        headersTitle += `${item.filters[key]}, `
      }
      return headersTitle;
  
  
    }, ', ')
    return title + headersTitles.slice(0, -2);
  }
const ResourcesSearch = ({ navigation, resources, cache, onRemove,onFilterRemove, onRemoveAll, editParams }) => {
    const bookIds = resources.map(resource => resource.bookId);
    const getAllBookFilter = React.useCallback(() => {
        return Object.keys(cache||{}).reduce((acc, curr) => {
            if (!bookIds.includes(curr)) {
                const headers = flattenHeaders(cache[curr].tree, {})
                headers.forEach(header => {
                    acc.push({ ...cache[curr], bookFilter: true,filters:header });

                })
            }
            return acc;
        }, [])
    }, [cache])
    return (
        <Background>
            <View style={styles.page}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>החיפוש יתבצעו במאגרים הבאים בלבד</Text>
                </View>
                <View style={styles.resourcesContainer}>
                    <FlatList
                        data={[...getAllBookFilter(),...resources ] || []}
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
                                <TouchableOpacity underlayColor="#ffffff00" onPress={() =>onFilterRemove(item.filters.id,item.id)}>
                                    <Icon color={'#47BBB2'} name={'close'} size={20} />
                                </TouchableOpacity>
                                <Text style={styles.resourceName}>{itemToTitle(item)}</Text>
                            </View> : <View key={index} style={styles.resourceContainer}>
                                    <TouchableOpacity underlayColor="#ffffff00" onPress={() => onRemove([item.bookId])}>
                                        <Icon color={'#47BBB2'} name={'close'} size={20} />
                                    </TouchableOpacity>
                                    <Text style={styles.resourceName}>{`${item.groupName.replace('_', '"')}, ${item.bookName.replace('_', '"')}`}</Text>
                                </View>
                        }}
                    />

                </View>
                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonsContainerRow}>
                        <View style={styles.buttonWrapper}><ClickButton optionsButton={{ paddingVertical: 7 }} onPress={() => navigation.goBack()} optionsText={{ fontSize: 22 }}>חפש תוצאות</ClickButton></View>
                        <View style={styles.buttonWrapper}><ClickButton outline={true} onPress={() => {
                            navigation.goBack()
                        }} optionsText={{ fontSize: 22 }}>חזרה</ClickButton></View>
                    </View>
                    <View style={styles.buttonsContainerRow}>
                        <View style={styles.buttonWrapper}><ClickButton outline={true} optionsText={{ fontSize: 22 }} onPress={onRemoveAll}>נקה הכל</ClickButton></View>
                        <View style={styles.buttonWrapper}><ClickButton outline={true} optionsText={{ fontSize: 22 }} onPress={() => {
                            navigation.navigate('groupResource', { screen: 'edit', params: editParams });
                        }}>הגדר קבוצה חדשה</ClickButton></View>
                    </View>
                </View>

            </View>
        </Background>
    )
}


const styles = StyleSheet.create({
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
        width: 180,
        marginHorizontal: 10
    },
    page: {
        flex: 1,
        width: '100%'
    },
    title: {
        fontFamily: "OpenSansHebrew",
        fontSize: 23,
        paddingRight: 10,
        color: '#7B7B7B',
        textAlign: 'center'
    },
    titleContainer: {
        flex: 0.15,
        width: '100%',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#A6A5A5',

    },
    resourcesContainer: {
        flex: 1,
        width: '100%',
    },
    buttonsContainer: {
        flex: 0.35,
        width: '100%',
    },
    buttonsContainerRow: {
        flex: 1,
        width: '100%',
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default optimizeHeavyScreen(ResourcesSearch, PlaceHolder);