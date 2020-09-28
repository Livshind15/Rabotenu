import * as React from 'react';
import { StyleSheet, StatusBar, Image, View } from 'react-native';
import { Spinner } from '@ui-kitten/components';
import Background from '../../component/background/background';
import image from './splash.logo.png';

export default function Splash() {
    React.useEffect(() => {
        StatusBar.setBarStyle('dark-content', true);
        return () => {
            StatusBar.setBarStyle('light-content', true);
        }
    }, [])
    return (
        <Background>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.logo}
                        source={image}
                        resizeMode='stretch'
                    />
                </View>
                <View style={styles.spinnerContainer}>
                    <Spinner color="#00ACC0" />
                </View>
            </View>
        </Background>
    );
}
const styles = StyleSheet.create({
    logo: {
        marginTop: 70,
        width: 220,
        height: 220,
    },
    rotate: {
        transform: [{ rotate: '270deg' }]
    },
    spinnerContainer: {
        flex: 0.2,
        width: "100%",
        justifyContent: 'center',
        alignItems: "center",
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: "center",
        width: "100%",
        flex: 1,
    },
    container: {
        flex: 1,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    }
});