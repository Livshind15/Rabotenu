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
    pasokContent: {
      color: '#455253',
      fontFamily: "OpenSansHebrew",
      textAlign: 'right',
      fontSize: 20 + (textSize * 50),
    },
    pasokContainer: {
      textAlign: 'right',
      direction: 'rtl'

    }
  });
  let bookName = ''
  let section = ''
  let chapter = ''
  const bookContentRender = React.useCallback(() => {

    const booksElement = (bookContent || []).reduce((elements, item) => {

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
      elements.push(
        <Text key={uuidv4()} style={styles.pasokContainer}>
          {item.verse ? <Text style={styles.pasok}>{item.verse} </Text> : <></>}
          <Text style={styles.pasokContent}>{grammar? item.content.replace(/[^א-ת\s,;.-]/g, ''):item.content}</Text>
        </Text>

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

