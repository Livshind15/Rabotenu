import * as React from 'react';
import Background from '../../component/background/background';
import { WebView } from 'react-native-webview';
import { View, Platform, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';

export default function BookView({ booksIds }) {
  console.log(booksIds);
  return (
    <Background>
      <ScrollView style={styles.view}>
        <Text style={styles.book}>בראשית</Text>
        <Text style={styles.parsa}>פרשת בראשית</Text>
        <Text style={styles.chapter}>א' פרק</Text>
        <Text style={styles.pasokContainer}>
          <Text style={styles.pasok}>א </Text>
          <Text style={styles.pasokContent}>{`רַבִּי הוֹשַׁעְיָה רַבָּה פָּתַח (משלי ח, ל): וָאֶהְיֶה אֶצְלוֹ אָמוֹן וָאֶהְיֶה שַׁעֲשׁוּעִים יוֹם יוֹם וגו', אָמוֹן פַּדְּגוֹג, אָמוֹן מְכֻסֶּה, אָמוֹן מֻצְנָע, וְאִית דַּאֲמַר אָמוֹן רַבָּתָא. אָמוֹן פַּדְּגוֹג, הֵיךְ מָה דְאַתְּ אָמַר (במדבר יא, יב): כַּאֲשֶׁר יִשָֹּׂא הָאֹמֵן אֶת הַיֹּנֵק. אָמוֹן מְכֻסֶּה, הֵיאַךְ מָה דְאַתְּ אָמַר (איכה ד, ...`}</Text>
        </Text>
        <Text style={styles.pasokContainer}>
          <Text style={styles.pasok}>ב </Text>
          <Text style={styles.pasokContent}>{`רַבִּי הוֹשַׁעְיָה רַבָּה פָּתַח (משלי ח, ל): וָאֶהְיֶה אֶצְלוֹ אָמוֹן וָאֶהְיֶה שַׁעֲשׁוּעִים יוֹם יוֹם וגו', אָמוֹן פַּדְּגוֹג, אָמוֹן מְכֻסֶּה, אָמוֹן מֻצְנָע, וְאִית דַּאֲמַר אָמוֹן רַבָּתָא. אָמוֹן פַּדְּגוֹג, הֵיךְ מָה דְאַתְּ אָמַר (במדבר יא, יב): כַּאֲשֶׁר יִשָֹּׂא הָאֹמֵן אֶת הַיֹּנֵק. אָמוֹן מְכֻסֶּה, הֵיאַךְ מָה דְאַתְּ אָמַר (איכה ד, ...`}</Text>
        </Text>
      </ScrollView>
    </Background>
  )
}

const styles = StyleSheet.create({
  view: {
    width: '95%'
  },
  book: {
    color: '#11AFC2',
    fontFamily: "OpenSansHebrewBold",
    textAlign: 'center',
    padding: 10,
    fontSize: 40
  },
  parsa: {
    color: '#455253',
    fontFamily: "OpenSansHebrewBold",
    textAlign: 'right',
    fontSize: 24
  },
  chapter: {
    color: '#11AFC2',
    fontFamily: "OpenSansHebrew",
    textAlign: 'right',
    fontSize: 21,
    paddingBottom: 10
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