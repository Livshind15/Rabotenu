import * as React from 'react';
import { useAsync } from "react-async";
import axios from "axios";
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import OctIcons from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/Entypo";
import Accordian from '../accordian/accordian';
import config from "../../config/config";


const getGroups = async () => {
    const { data } = await axios.get(`${config.serverUrl}/mapping/groups/`);
    return data || [];
}

const ExploreTree = ({ groups = [], deep = 0 }) => {
    if (groups.length) {
        return (groups || []).map((group, index) => <Accordian customStyles={{ container: { paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={group.groupName} additionalComponent={<Icon name={'folder'} size={22} color={'#515151'} />}>
            {group.subGroups.length || group.books.length ? <View style={styles.innerScroll}>
                {group.subGroups.length ? <ExploreTree groups={group.subGroups} deep={deep + 1} /> : <></>}
                {group.books.length ? ((group.books) || []).map((book, index) => <TouchableOpacity underlayColor="#ffffff00" key={index} onPress={() => console.log(`open book => ${book.bookId}`)} style={[styles.resultContainer, { paddingRight: (40 + (10 * deep)) }]}>
                    <Text style={styles.resultText}>{book.bookName}</Text>
                    <OctIcons name={'book'} size={22} color={'#9AD3CE'}></OctIcons>
                </TouchableOpacity>) : <></>}
            </View> : <></>}
        </Accordian>)
    }
    else {
        const { data, error, isPending } = useAsync({ promiseFn: getGroups })

        return !isPending && (data || []).map((group, index) => <Accordian key={index} index={index} customStyles={{ container: { paddingRight: 18 + (10 * deep) } }} header={group.groupName} additionalComponent={<Icon name={'folder'} size={22} color={'#515151'} />}>
            {group.subGroups.length || group.books.length ? <View style={styles.innerScroll}>
                {group.subGroups.length ? <ExploreTree groups={group.subGroups} deep={deep + 1} /> : <></>}
                {group.books.length ? ((group.books) || []).map((book, index) => <TouchableOpacity underlayColor="#ffffff00" key={index} onPress={() => console.log(`open book => ${book.bookId}`)} style={[styles.resultContainer, { paddingRight: (40 + (10 * deep)) }]}>
                    <Text style={styles.resultText}>{book.bookName}</Text>
                    <OctIcons name={'book'} size={22} color={'#9AD3CE'}></OctIcons>
                </TouchableOpacity>) : <></>}
            </View> : <></>}
        </Accordian>)
    }

}

const styles = StyleSheet.create({
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

export default ExploreTree;