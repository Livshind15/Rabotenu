import * as React from 'react';
import { StyleSheet, Text,StatusBar } from 'react-native';
import ButtonList from '../../component/buttonList/buttonList';
import Background from '../../component/background/background';
import { RabotenuContext } from '../../contexts/applicationContext';

export default function Home({ navigation }) {
    const { setTitle } = React.useContext(RabotenuContext);
    React.useEffect(()=>{
        StatusBar.setBarStyle('dark-content', true);
        return () => {
            StatusBar.setBarStyle('light-content', true);
        }
    },[])
    return (
        <Background>
            <Text style={styles.text}>בחר את אופן החיפוש:</Text>
            <ButtonList optionsList={[
                {
                    text: 'עיון', onPres: () => {
                        setTitle('עיון')
                        navigation.push('Main',{screen:'Explore'})
                    }
                },
                {
                    text: 'חיפוש', onPres: () => {
                        setTitle('חיפוש')
                        navigation.push('Main',{screen:'Search'})
                    }
                },
                {
                    text: 'ראשי תיבות', onPres: () => {
                        setTitle('ראשי תיבות')
                        navigation.push('Main',{screen:'Acronym'})
                    }
                }]}></ButtonList>
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