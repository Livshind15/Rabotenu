import * as React from 'react';

import { StyleSheet, ScrollView, View } from 'react-native';
import BookListTree from '../../component/bookListTree/bookListTree';
import Background from '../../component/background/background';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';
import PlaceHolder from '../../component/placeHolder/placeHolder';




const BookList = ({ tree,isPending,navigation,onSelectChapter,onSelectBook,bookId }) => {
    return (
        <Background>
            <View style={styles.page}>
                <ScrollView style={styles.scroll}>
                    {!isPending && tree ? <BookListTree bookId={bookId} onSelect={(select => {
                        if(select.chapter){
                            onSelectChapter(select.chapter)
                            navigation.navigate('View')
                        }
                        if(select.book){
                            onSelectBook(select.book)
                            navigation.navigate('View')
                        }
                    })} results={tree} /> : <></>}
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

export default optimizeHeavyScreen(BookList,PlaceHolder);