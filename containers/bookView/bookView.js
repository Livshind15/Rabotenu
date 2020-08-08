import * as React from 'react';
import axios from "axios";
import Background from '../../component/background/background';
import { useAsync } from "react-async";
import { Spinner } from '@ui-kitten/components';
import { v4 as uuidv4 } from 'react-native-uuid';
import { View, Platform, FlatList, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import config from "../../config/config";



export default function BookView({ textSize, grammar, bookContent, isPending }) {
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
  let bookName = []
  let section = []
  let chapter = ''

  let data = bookContent.reduce((elements, content) => {
    if (!bookName.includes(content.bookName)) {
      bookName = [...bookName, content.bookName]
      elements.push({ type: "bookName", value: content.bookName })
    }
    if (!section.includes(content.section)) {
      section = [...section, content.section]
      elements.push({ type: "section", value: content.section })
    }
    if (chapter !== content.chapter) {
      chapter = content.chapter
      elements.push({ type: "chapter", value: content.chapter })
    }
    elements.push({ type: "verse", parsaTag: RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`).test(content.content), index: content.verse, value: grammar ? removeGrammar(removeTag(content.content)) : removeTag(content.content) })
    return elements
  }, [])
  return (

    <Background>
      {isPending ? <View style={styles.spinnerContainer}>
        <Spinner />
      </View> : <FlatList ref={flatListRef} style={styles.view} data={data} renderItem={({ item, index }) => {
        if (item.type === 'bookName') {
          return <Text style={styles.book}>{item.value}</Text>
        }
        if (item.type === 'section') {
          return <Text style={styles.parsa}>{item.value}</Text>
        }
        if (item.type === 'chapter') {
          return <Text style={styles.chapter}>{item.value}</Text>
        }
        if (item.type === 'verse') {
          let boldText = false;
          let grayText = false
          return <View style={styles.pasokContainer}>
            <Text style={styles.pasok}>{item.index} </Text>

            {item.value.split(' ').map(((splitContent, index) => {
              if (RegExp(`<\s*כתיב[^>]*>(.*?)`).test(splitContent)) {
                grayText = true;
              }
              if (RegExp(`(.*?)<\s*/\s*כתיב>`).test(splitContent)) {
                grayText = false;
                return <Text style={styles.pasokContentGray}> {removeGrayTag(splitContent)}</Text>
              }
              if (grayText) {
                return <Text style={styles.pasokContentGray}>{removeGrayTag(splitContent)}</Text>
              }
              if (RegExp(`<\s*דה[^>]*>(.*?)`).test(splitContent)) {
                boldText = true;
              }
              if (RegExp(`(.*?)<\s*/\s*דה>`).test(splitContent)) {
                boldText = false;
                return <Text style={styles.pasokContentBold}> {removeBoldTag(splitContent)}</Text>
              }
              if (boldText) {
                return <Text style={styles.pasokContentBold}> {removeBoldTag(splitContent)}</Text>
              }
              return <Text style={styles.pasokContent}> {splitContent}</Text>
            }))}
            {item.parsaTag ? <Text style={styles.pasokLink}>{'פ'}</Text> : <></>}
          </View>
        }
        return <></>
      }} />}


    </Background>
  )
}

const removeGrammar = (content) => {
  return content.replace(/[^א-ת\s,;.-]/g, '')
}

const removeTag = (content) => {
  return content.replace(RegExp('<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>'), '')
}

const removeGrayTag = (content) => {
  return content.replace(new RegExp(/<.כתיב./, 'g'), '').replace(/<\/?כתיב>/g, '')
}

const removeBoldTag = (content) => {
  return content.replace(new RegExp(/<.דה./, 'g'), '').replace(/<\/?דה>/g, '')
}

