import * as React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import BookListTree from '../../component/bookListTree/bookListTree';
import result from './bookList.mock';

import Background from '../../component/background/background';

const BookList = ({ }) => {
    return (
        <Background>
            <View style={styles.page}>
            <ScrollView style={styles.scroll}>
                    <BookListTree results={result}/>
                </ScrollView>
            </View>
        </Background>
    )
}

const styles = StyleSheet.create({
   
    page: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
    },
    scroll: {
        flex: 1,
        width: '100%'
    },
});

export default BookList;