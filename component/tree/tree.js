import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import OctIcons from "react-native-vector-icons/Octicons";
import Accordian from '../../component/accordian/accordian';
import { flatten } from 'lodash';

const getSubBookInGroup = (group) => {
    let books = group.books;
    if(group.subGroups){
        books = [...books,...flatten(group.subGroups.map(getSubBookInGroup))]
    }
    return books
}

const Tree = ({navigation, results, deep = 0 }) => (
    <>
        {results.map((result, index) => (
            <Accordian customStyles={{ container: { paddingLeft: 0, paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={result.groupName} additionalComponent={
                <View style={styles.endContainer}>
                    <View style={styles.showButtonWrapper}>
                        <TouchableOpacity
                            underlayColor="#ffffff00" 
                            onPress={()=>navigation.push('SearchView',{booksIds:getSubBookInGroup(result).map(book => book.bookId)})}

                            >
                            <Text style={styles.showButtonText}>צפייה</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.countResultWrapper}>
                        <Text style={styles.countText}>{result.doc_count}</Text>
                    </View>
                </View>
            }>
                <View >
                    {result.subGroups && <Tree navigation={navigation} results={result.subGroups} deep={deep + 1} />}
                    {((result.books) || []).map((book, index) => <TouchableOpacity underlayColor="#ffffff00" key={index} style={[styles.resultContainer, { paddingRight: (40 + (10 * deep)) }]}>
                        <View style={styles.bookContainer}>
                            <View style={styles.bookName}>
                                <OctIcons name={'book'} size={22} color={'#9AD3CE'}></OctIcons>
                                <Text style={styles.resultText}>{book.bookName}</Text>
                            </View>
                            <View style={styles.endContainer}>
                                <View style={styles.showButtonWrapper}>
                                    <TouchableOpacity
                                        underlayColor="#ffffff00" 
                                        onPress={()=>navigation.push('SearchView',{booksIds:[book.bookId]})}

                                        >
                                        <Text style={styles.showButtonText}>צפייה</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.countResultWrapper}>
                                    <Text style={styles.countText}>{book.doc_count}</Text>
                                </View>
                            </View>
                        </View>

                    </TouchableOpacity>)}
                </View>

            </Accordian>
        ))}
    </>
)

const styles = StyleSheet.create({
    bookName: {
        flex: 1,
        flexDirection: 'row-reverse'
    },
    bookContainer: {
        flexDirection: 'row-reverse',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
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
        borderBottomWidth: 1,
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