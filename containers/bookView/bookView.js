import * as React from 'react';
import axios from "axios";
import Background from '../../component/background/background';
import { useAsync } from "react-async";
import { Spinner } from '@ui-kitten/components';

import nextId from "react-id-generator";import { View, Platform, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import config from "../../config/config";


const getBookContent = async ([bookId, index]) => {
  const { data } = await axios.get(`${config.serverUrl}/book/content/${bookId}?gteIndex=${index * 500}&lteIndex=${(index * 500) + 500}`);
  return data || [];

}

export default function BookView({ booksId }) {
  let bookName = ''
  let section = ''
  let chapter = ''
  const [bookContent, setBookContent] = React.useState([]);
  const [reachToEnd, setReachToEnd] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const onBookContentResolved = (data) => {
    if (!data.length) {
      setReachToEnd(true);
    }
    setBookContent([...bookContent, ...data])
  }

  const { error, isPending, run } = useAsync({ deferFn: getBookContent, initialValue: bookContent, onResolve: onBookContentResolved });
  React.useEffect(() => {
    run(booksId, page);
    setPage(page + 1)
  }, [])
  const onScroll = ({ nativeEvent }) => {
    let paddingToBottom = 1000;
    paddingToBottom += nativeEvent.layoutMeasurement.height;
    if (nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - paddingToBottom) {
      if (!isPending && !reachToEnd) {
        run(booksId, page);
        setPage(page + 1)
      }
    }
  }

  const bookContentRender = React.useCallback(() => {

    const booksElement = (bookContent || []).reduce((elements, item) => {

      if (item.bookName !== bookName) {
        bookName = item.bookName;
        elements.push(<Text key={nextId()} style={styles.book}>{item.bookName}</Text>)
      }
      if (item.section !== section) {
        section = item.section;
        elements.push(<Text key={nextId()} style={styles.parsa}>{item.section}</Text>)

      }
      if (item.chapter !== chapter) {
        chapter = item.chapter;
        elements.push(<Text key={nextId()} style={styles.chapter}>{item.chapter}</Text>)
      }
      elements.push(
        <Text key={nextId()} style={styles.pasokContainer}>
          {item.verse ? <Text style={styles.pasok}>{item.verse} </Text> : <></>}
          <Text style={styles.pasokContent}>{item.content}</Text>
        </Text>

      )
      return elements
    }, [])
    if (  isPending||!booksElement.length) {
      booksElement.push(
        <View key={nextId()} style={styles.spinnerContainer}>
          <Spinner color="#00ACC0" />
        </View>
      )
    }
    return booksElement;
  }, [bookContent, isPending])


  return (
    <Background>
      <ScrollView onScroll={onScroll} style={styles.view}>
        {bookContentRender()}
      </ScrollView>
    </Background>
  )
}

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
    fontSize: 40
  },
  parsa: {
    color: '#455253',
    fontFamily: "OpenSansHebrewBold",
    textAlign: 'right',
    fontSize: 24,
    paddingVertical: 8
  },
  chapter: {
    color: '#11AFC2',
    fontFamily: "OpenSansHebrew",
    textAlign: 'right',
    fontSize: 21,
    paddingVertical: 10
  },
  pasok: {
    color: '#455253',
    fontFamily: "OpenSansHebrewBold",
    textAlign: 'right',
    fontSize: 22,
  },
  pasokContent: {
    color: '#455253',
    fontFamily: "OpenSansHebrew",
    textAlign: 'right',
    fontSize: 21,
  },
  pasokContainer: {
    textAlign: 'right',
    direction: 'rtl'

  }
});