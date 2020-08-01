import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import OctIcons from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/Entypo";
import Accordian from '../accordian/accordian';
import { CheckBox } from '@ui-kitten/components';


const ResourceTree = ({ navigation, groups = [], deep = 0 }) => {
    return (groups || []).map((group, index) => <Accordian customStyles={{ container: { paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={group.groupName} additionalComponent={
           <View style={styles.checkBoxWrapper}>
            <CheckBox
                checked={true}
                onChange={()=> {}}>
            </CheckBox>
        </View>
    } endToggle={true}>
        {group.subGroups.length || group.books.length ? <View style={styles.innerScroll}>
            {group.subGroups.length ? <ResourceTree navigation={navigation} groups={group.subGroups} deep={deep + 1} /> : <></>}
            {group.books.length ? ((group.books) || []).map((book, index) => <TouchableOpacity underlayColor="#ffffff00" key={index} onPress={() => { navigation.push('Result', { selectedBooks: [{ bookId: book.bookId }] }) }} style={[styles.resultContainer, { paddingRight: (40 + (10 * deep)) }]}>
                <Text style={styles.resultText}>{book.bookName}</Text>
                <View style={styles.checkBoxWrapper}>
            <CheckBox
                checked={true}
                onChange={()=> {}}>
            </CheckBox>
        </View>
            </TouchableOpacity>) : <></>}
        </View> : <></>}
    </Accordian>)
}

const styles = StyleSheet.create({
    checkBoxWrapper: {
        alignItems: 'center',
        width: 45
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
   
    innerScroll: {
        flex: 1,
        width: '100%',
    }
})

export default ResourceTree;