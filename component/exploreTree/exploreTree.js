import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import OctIcons from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/Entypo";
import Accordian from '../accordian/accordian';
import { useAsync } from "react-async";
import { isEmpty } from 'lodash';

const ExploreTree = ({ getBookInfo, navigation, groups = [], deep = 0 }) => {
    return (groups || []).map((group, index) => <Accordian customStyles={{ container: { paddingRight: 18 + (10 * deep) } }} key={index} index={index} header={group.groupName.replace('_', '"') || ''} additionalComponent={<Icon name={'folder'} size={22} color={'#515151'} />}>
        {group.subGroups && group.subGroups && group.subGroups.length || group.books.length ? <View style={styles.innerScroll}>
            {group.subGroups && group.subGroups.length ? <ExploreTree getBookInfo={getBookInfo} navigation={navigation} groups={group.subGroups} deep={deep + 1} /> : <></>}
            {group.books.length ? ((group.books) || []).map((book, index) => {
                const [info, setInfo] = React.useState([]);
                {/* const { data, error, isPending } = useAsync({ promiseFn: getBookInfo, bookId: book.bookId }) */ }
                {/* getBookInfo(book.bookId).then(book =>{ */ }
                {/* setInfo(book) */ }
                {/* })  */ }
                {/* const [info,setInfo] = React.useState();
                {/* const { data, error, isPending } = useAsync({ promiseFn: getBookInfo, bookId: book.bookId }) */}
                {/* getBookInfo(book.bookId).then(book =>{ */ }
                {/* setInfo(book) */ }
                {/* })  */ }
                const [expanded, setExpanded] = React.useState(false);
                return <Accordian
                    initExpanded={expanded}
                    onExpanded={ (state) => {
                        if (state) {
                            getBookInfo(book.bookId).then(infoRes => {
                                setInfo(infoRes[0]||[])
                                if(isEmpty(infoRes[0].tree)){
                                    navigation.push('Result', { selectedBooks: [{ bookId: book.bookId }] })
                                }
                                else{
                                    setExpanded(true);
                                }
                            })
                        }
                        // navigation.push('Result', { selectedBooks: [{ bookId: book.bookId }] })
                    }}
                    shouldExpanded={!isEmpty(info)&&!isEmpty(info.tree)}
                    additionalComponent={
                        <TouchableOpacity onPress={() => navigation.push('Result', { selectedBooks: [{ bookId: book.bookId }] })} underlayColor="#ffffff00">
                            <OctIcons style={{ paddingRight: 25, paddingLeft: 5 }} name={'book'} size={22} color={'#9AD3CE'} />
                        </TouchableOpacity>} endToggle={true} header={book.bookName.replace('_', '"')}  ></Accordian>
            }) : <></>}
        </View> : <></>}
        
    </Accordian>)
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