import * as React from 'react';
import axios from "axios";
import Background from '../../component/background/background';
import { useAsync } from "react-async";
import { Spinner } from '@ui-kitten/components';
import { v4 as uuidv4 } from 'react-native-uuid';
import { View, Platform, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import config from "../../config/config";



export default function BookView({ textSize, grammar, bookContent, isPending, reachToEnd, onScroll }) {
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
      fontSize: 12 + (textSize * 50),
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
  let bookName = ''
  let section = ''
  let chapter = ''
  const bookContentRender = React.useCallback(() => {

    const booksElement = (bookContent || []).reduce((elements, item) => {
      let isParsa = false;
      let bold = false;
      let boldCenter = false;
      let content = grammar ? item.content.replace(/[^א-ת\s,;.-]/g, '') : item.content;
      if (RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`).test(content)) {
        isParsa = true
      }
      if (RegExp(`<\s*דה[^>]*>(.*?)<\s*/\s*דה>`).test(content)) {
        bold = true
      }
      if (item.bookName !== bookName) {
        bookName = item.bookName;
        elements.push(<Text key={uuidv4()} style={styles.book}>{item.bookName}</Text>)
      }
      if (item.section !== section) {
        section = item.section;
        elements.push(<Text key={uuidv4()} style={styles.parsa}>{item.section}</Text>)
      }
      if (item.chapter !== chapter) {
        chapter = item.chapter;
        elements.push(<Text key={uuidv4()} style={styles.chapter}>{item.chapter}</Text>)
      }
      { item.verse ? <Text style={styles.pasok}>{item.verse} </Text> : <></> }

      elements.push(
        <View key={uuidv4()} style={styles.pasokContainer}>
          {item.verse ? <Text style={styles.pasok}>{item.verse} </Text> : <></>}
          {content.split(' ').map((splitContent => {
            if (RegExp(`<\s*דה[^>]*>(.*?)`).test(splitContent)) {
              boldCenter = true;
              console.log(splitContent)
            }

            if (RegExp(`<\s*em[^>]*>(.*?)<\s*/\s*em>`).test(splitContent)) {
              return <Text style={styles.pasokContentMark}>{' '}{splitContent.match(/<em>(.*?)<\/em>/g).map((val) => val.replace(/<\/?em>/g, '').trim())}</Text>
            }
            if (RegExp(`(.*?)<\s*/\s*דה>`).test(splitContent)) {
              console.log(splitContent)
              boldCenter = false;

              return <Text style={styles.pasokContentBold}>{' '}{splitContent.replace(new RegExp(/<.דה./, 'g'), '').replace(/<\/?דה>/g, '')}</Text>

            }
            if (boldCenter) {
              return <Text style={styles.pasokContentBold}>{' '}{splitContent.replace(/<\/?דה>/g, '')}</Text>

            }

            return <Text style={styles.pasokContent}>{' '} {splitContent.replace(RegExp('<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>'), '')}</Text>
          }))}
          {isParsa && <Text style={styles.pasokLink}>{'פ'}</Text>}

        </View>
      )
      return elements
    }, [])
    if (!reachToEnd) {
      booksElement.push(
        <View key={uuidv4()} style={styles.spinnerContainer}>
          <Spinner color="#00ACC0" />
        </View>
      )
    }
    return booksElement;
  }, [bookContent, isPending])


  return (
    <Background>
      <ScrollView scrollEventThrottle={16} onScroll={onScroll} style={styles.view}>
        {bookContentRender()}
      </ScrollView>
    </Background>
  )
}

