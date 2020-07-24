import * as React from 'react';
import { useAsync } from "react-async"
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import OctIcons from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/Entypo";
import Accordian from '../accordian/accordian';
import config from "../../config/config";

const getGroups = async ({ parentGroupName }, { signal }) => {
    const res = await fetch(`${config.serverUrl}/subGroup?parentGroup=${parentGroupName}`, { signal })
    if (!res.ok) throw new Error(res.statusText)
    const groups = await res.json();
    return groups.map(group =>{
        return {groupName:group}
    })
  }

const ExploreTree = ({ parentGroupName, deep = 0 }) => {
    const { data, error, isPending } = useAsync({ promiseFn: getGroups, parentGroupName })

    return(<>
        {!isPending && data.map((group, index) => <Accordian key={index} index={index} header={group.groupName} additionalComponent={<Icon name={'folder'} size={22} color={'#515151'} />}>
            <View style={styles.innerScroll}>
                {/* {result.tree && <BookListTree results={result.tree} deep={deep + 1} />} */}
                {((group.books) || []).map((book, index) => <TouchableOpacity underlayColor="#ffffff00" key={index} style={[styles.resultContainer, { paddingRight: (40 + (10 * deep)) }]}>
                    <Text style={styles.resultText}>{book}</Text>
                    <OctIcons name={'book'} size={22} color={'#9AD3CE'}></OctIcons>
                </TouchableOpacity>)}
            </View>
        </Accordian>)}
    </>)
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
    page: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        paddingTop: 4,
        alignContent: 'center'
    },
    innerScroll: {
        flex: 1,
        width: '100%',
    },
    innerTree: {
        flex: 1,
        width: '100%',
        backgroundColor: 'yellow'
    },
    endContainer: {
        width: 100,
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    }
})

export default ExploreTree;