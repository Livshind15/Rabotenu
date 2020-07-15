import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import ButtonList from '../../component/buttonList/buttonList';
import Background from '../../component/background/background';

export default function Home({ navigation }) {
    return (
        <Background>
            <Text style={styles.text}>בחר את אופן החיפוש:</Text>
            <ButtonList optionsList={[
                { text: 'עיון', onPres: () => navigation.push('Explore') },
                { text: 'חיפוש', onPres: () => { } },
                { text: 'ראשי תיבות', onPres: () => { } }]}></ButtonList>
        </Background>
    );
}
const styles = StyleSheet.create({
    text: {
        color: '#767474',
        fontSize: 20,
        fontFamily: "OpenSansHebrew",
        paddingBottom: 10
    }
});