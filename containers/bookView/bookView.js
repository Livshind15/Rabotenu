import * as React from 'react';
import Background from '../../component/background/background';
import { Spinner } from '@ui-kitten/components';
import { View, FlatList,ListView, StyleSheet, Dimensions, Text } from 'react-native';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import { RecyclerListView, DataProvider,LayoutProvider } from 'recyclerlistview';

import { delay } from '../../utils/helpers';
import { TextInput } from 'react-native-gesture-handler';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';
import PlaceHolder from '../../component/placeHolder/placeHolder';

export const bookToElements = (bookContent, grammar) => {
  let bookName = [];
  let section = [];
  let chapter = '';
  return bookContent.reduce((elements, content) => {
    if (!bookName.includes(content.bookName)) {
      bookName = [...bookName, content.bookName]
      elements.push({ id: elements.length + 1, type: "bookName", value: content.bookName })
    }
    if (!section.includes(content.section)) {
      section = [...section, content.section]
      elements.push({ id: elements.length + 1, type: "section", value: content.section })
    }
    if (chapter !== content.chapter) {
      chapter = content.chapter
      elements.push({ id: elements.length + 1, type: "chapter", value: content.chapter })
    }
    elements.push({ id: elements.length + 1, type: "verse", parsaTag: RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`).test(content.content), index: content.verse, value: grammar ? removeGrammar(removeTag(content.content)) : removeTag(content.content) })
    return elements

  }, []);
}

const SelectText = ({ style, children }) => (
  <TextInput
    underlineColorAndroid='transparent'
    underlineColorAndroid={'#FFFFFF00'}
    editable={false}
    value={children}
    style={style} />
)

const dataProvider = new DataProvider((r1, r2) => {
  console.log(r1, r2);
  return r1.id !== r2.id;
})

function BookView({ textSize, exegesis, grammar, index, fetchMore, refreshing, setMount, bookContent, startChapter, isPending }) {
  const [data,setData] = React.useState()
  const styles = StyleSheet.create({
    view: {
      width: '100%',
      padding: 25
    },
    spinnerContainer: {
      height: 100,
      width: "100%",
      justifyContent: 'center',
      alignItems: "center",
    },
    book: {
      color: '#11AFC2',
      fontFamily: "OpenSansHebrewBold",
      textAlign: 'center',
      padding: 8,
      fontSize: 24 + (textSize * 50)
    },
    parsa: {
      color: '#455253',
      fontFamily: "OpenSansHebrewBold",
      textAlign: 'right',
      fontSize: 22 + (textSize * 50),
      paddingVertical: 8
    },
    chapter: {
      color: '#11AFC2',
      fontFamily: "OpenSansHebrew",
      textAlign: 'right',
      fontSize: 21 + (textSize * 50),
      paddingVertical: 10
    },
    pasok: {
      color: '#455253',
      fontFamily: "OpenSansHebrewBold",
      textAlign: 'right',
      fontSize: 20 + (textSize * 50),
    },
    pasokContentBold: {
      color: '#455253',
      fontFamily: "OpenSansHebrewBold",
      textAlign: 'right',
      fontSize: 21 + (textSize * 50),
    },
    pasokLink: {
      color: '#11AFC2',
      fontFamily: "OpenSansHebrewBold",
      textAlign: 'right',
      alignSelf: 'center',
      fontSize: 12 + (textSize * 50),
    },
    pasokContentGray: {
      color: '#CBD4D3',
      fontFamily: "OpenSansHebrew",
      textAlign: 'right',
      fontSize: 17 + (textSize * 50),
    },
    pasokContent: {
      color: '#455253',
      fontFamily: "OpenSansHebrew",
      textAlign: 'right',
      fontSize: 20 + (textSize * 50),
    },
    pasokContainer: {
      flexWrap: 'wrap',
      flexDirection: 'row-reverse',

    }
  });
  const flatListRef = React.useRef();

  React.useEffect(() => {
    delay(1000).then(() => {
      setMount(true)
    })
  }, [])
  React.useEffect(() => {
    console.log(bookContent);
    setData(dataProvider.cloneWithRows(
      bookToElements( bookContent,grammar)
    ))
  }, [bookContent])

  const renderText = (item, index) => {
    if (item.type === 'bookName') {
      return <Text selectable style={styles.book}>{item.value}</Text>
    }
    if (item.type === 'section') {
      return <Text selectable style={styles.parsa}>{item.value}</Text>

    }
    if (item.type === 'chapter') {
      return <Text selectable style={styles.chapter}>{item.value}</Text>


    }
    if (item.type === 'verse') {
      let grayText = false;
      let boldText = false;

      return <View key={Math.random()} selectable style={styles.pasokContainer}>
        <Text selectable key={Math.random()} style={styles.pasok}>{item.index} </Text>

        {item.value.split(' ').map(((splitContent, index) => {
          if (RegExp(`<\s*כתיב[^>]*>(.*?)`).test(splitContent)) {
            grayText = true;
          }
          if (RegExp(`(.*?)<\s*/\s*כתיב>`).test(splitContent)) {
            grayText = false;
            return <Text selectable key={Math.random()} style={styles.pasokContentGray}> {removeGrayTag(splitContent)}</Text>
          }
          if (grayText) {
            return <Text selectable key={Math.random()} style={styles.pasokContentGray}>{removeGrayTag(splitContent)}</Text>
          }
          if (RegExp(`<\s*דה[^>]*>(.*?)`).test(splitContent)) {
            boldText = true;
          }
          if (RegExp(`(.*?)<\s*/\s*דה>`).test(splitContent)) {
            boldText = false;
            return <Text selectable key={Math.random()} style={styles.pasokContentBold}> {removeBoldTag(splitContent)}</Text>
          }
          if (boldText) {
            return <Text selectable key={Math.random()} style={styles.pasokContentBold}> {removeBoldTag(splitContent)}</Text>
          }
          return <Text selectable key={Math.random()} style={styles.pasokContent}> {splitContent}</Text>
        }))}
        {item.parsaTag && !exegesis ? <Text selectable key={Math.random()} style={styles.pasokLink}>{'פ'}</Text> : <></>}
      </View>
    }
    return <></>
  }

  // React.useEffect(
  //   () => {
  //     const index = data.findIndex((item) => item.type === 'chapter' && item.value === startChapter);
  //     if (index !== -1 && flatListRef.current && flatListRef.current.scrollToIndex) {
  //       flatListRef.current.scrollToIndex({
  //         animated: false,
  //         index: index
  //       });
  //     }
  //   }
  //   , [startChapter])

  return (

    <Background>
      {/* <FlatList

refreshing={x}
        onEndReachedThreshold={0.9}
        onEndReached={() => {
          console.log('aaa');
          setX(true)

          fetchMore()
        }
        }
        getItemLayout={(data, index) => {
          return { length: (5 - Dimensions.get('window').width / Dimensions.get('window').height) * 15.5, offset: (5 - Dimensions.get('window').width / Dimensions.get('window').height) * 15.5 * index, index }
        }}
        renderScrollComponent={props => <InfiniteScrollView {...props} />}

        ref={flatListRef}
        keyExtractor={(date, index) => String(index)}
        style={styles.view}
        data={bookToElements(bookContent)} renderItem={renderItem} /> */}
  <RecyclerListView
             style={{ flex: 1 }}
             contentContainerStyle={{ margin: 3 }}
             onEndReached={fetchMore}
             renderAheadOffset={0}

             dataProvider={data}
             layoutProvider={ new LayoutProvider(
              index => {
                  return index;
              },
              (type, dimension) => {
                  dimension.height = 100;
                  dimension.width = 360;
              }
          )}
             rowRenderer={renderItem}
            />

    </Background>
  )
}

const renderItem = ({ item, index }) => {
  return (
    <Text>aaaaa</Text>
  )
}


export const removeGrammar = (content) => {
  return content.replace(/[^א-ת\s,;.-]/g, '')
}

export const removeTag = (content) => {

  return content.replace(RegExp('<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>'), '')
}

export const removeGrayTag = (content) => {
  return content.replace(new RegExp(/<.כתיב./, 'g'), '').replace(/<\/?כתיב>/g, '')
}

export const removeBoldTag = (content) => {
  return content.replace(new RegExp(/<.דה./, 'g'), '').replace(/<\/?דה>/g, '')
}

export default BookView