import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Tabs({ children }) {
    const [tabIndex, setTabIndex] = React.useState(0)
    return (
        <View style={{ flex: 1, width: '100%', flexDirection: 'row' }}>
            {React.Children.map(children, (child, index) => (
                React.cloneElement(child, {
                    key: index,
                    isSelected: tabIndex === index,
                    onPress: () => setTabIndex(index)
                })
            ))}
        </View>
    );
}

const styles = StyleSheet.create({

});