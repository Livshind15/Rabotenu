import * as React from 'react';

import { StyleSheet, ScrollView, View } from 'react-native';
import BookListTree from '../../component/bookListTree/bookListTree';
import Background from '../../component/background/background';




const BookList = ({ tree,isPending }) => {
    return (
        <Background>
            <View style={styles.page}>
                <ScrollView style={styles.scroll}>
                    {!isPending && tree ? <BookListTree results={tree} /> : <></>}
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