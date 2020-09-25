import * as React from 'react';

import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';

import { parse } from 'node-html-parser';
import { removeNotNeedContent } from './bookViewClass';

const contentMap = [{
    originTag: "<\s*פרשה[^>]*>",
    tag: '<parsha>',
}, {
    originTag: "<\s*/\s*פרשה>",
    tag: '</parsha>',
},
{
    originTag: "<\s*דה[^>]*>",
    tag: '<bold>',
}, {
    originTag: "<\s*/\s*דה>",
    tag: '</bold>',
}, {
    originTag: "<\s*הדגשה[^>]*>",
    tag: '<bold>',
}, {
    originTag: "<\s*/\s*הדגשה>",
    tag: '</bold>',
}, {
    originTag: "<\s*קטן[^>]*>",
    tag: '<small>',
}, {
    originTag: "<\s*/\s*קטן>",
    tag: '</small>',
}, {
    originTag: "<\s*כתיב[^>]*>",
    tag: '<grey>',
}, {
    originTag: "<\s*/\s*כתיב>",
    tag: '</grey>',
}, {
    originTag: "<\s*יוד[^>]*>",
    tag: '<hide>',
}, {
    originTag: "<\s*/\s*יוד>",
    tag: '</hide>',
}, {
    originTag: "<\s*וו[^>]*>",
    tag: '<hide>',
}, {
    originTag: "<\s*/\s*וו>",
    tag: '</hide>',
}, {
    originTag: "<\s*הערה",
    tag: '<ref',
}, {
    originTag: "<\s*/\s*הערה>",
    tag: '</ref>',
},
]
const tags = {
    text: { render: (node, options,styles) => <Text style={styles.text}>{removeNotNeedContent(node.rawText, options.punctuation, options.grammar)}</Text> },
    parsha: { render: (node, options,styles) => !options.exegesis ? <Text style={styles.parsha}>{node.childNodes[0].rawText}</Text> : <></> },
    bold: { render: (node, options,styles) => <Text style={styles.bold}>{node.childNodes[0].rawText}</Text> },
    small: { render: (node, options,styles) => <Text style={styles.small}>{node.childNodes[0].rawText}</Text> },
    grey: { render: (node, options,styles) => <Text style={styles.grey}>{node.childNodes[0].rawText}</Text> },
    em: { render: (node, options,styles) => <Text style={styles.highlight}>{node.childNodes[0].rawText}</Text> },
    hide: { render: (node, options,styles) => <></> },
    ref: {
        render: (node, options,styles, refClick) => {
            const char = RegExp(/תו="([^"]+)"/).exec(node.rawAttrs)[1];
            const id = RegExp(/Id="([^"]+)"/).exec(node.rawAttrs) ? RegExp(/Id="([^"]+)"/).exec(node.rawAttrs)[1] : null;
            return !options.exegesis ? <TouchableOpacity onPress={() => refClick(id, char)} >
                <Text style={styles.ref}>{`${char} `}</Text>
            </TouchableOpacity> : <></>
        }
    },
}

const contentReduce = (node, options,styles, refClick) => {
    return tags[node._tag_name || 'text'].render(node, options,styles, refClick)
}

const Content = ({ contentValue, refClick, options }) => {
    const content = contentMap.reduce((content, replace) => {
        return content.replace(new RegExp(replace.originTag, 'g'), replace.tag)
    }, contentValue.value)
    const styles = StyleSheet.create({
        ref: {
            color: '#00701a',
            fontSize: 13 + options.textSize * 40,
        },
        fullWidth: {
            width: '100%'
        },
        index: {
            color: '#455253',
            fontFamily: "OpenSansHebrewBold",
            fontSize: 19 + options.textSize * 40,
            width: 30
        },
        parsha: {
            color: '#11AFC2',
            alignSelf: 'center',
            fontSize: 11 + options.textSize * 40,
        },
        text: {
            color: '#455253',
            fontSize: 19 + options.textSize * 40,
        },
        highlight: {
            color: '#455253',
            fontFamily: "OpenSansHebrew",
            backgroundColor: 'yellow',
            fontSize: 19 + options.textSize * 40,
        },
        bold: {
            color: '#455253',
            fontWeight: "bold",
            fontSize: 19 + options.textSize * 40,
        },
        small: {
            color: '#455253',
            fontSize: 13 + options.textSize * 40,
        },
        grey: {
            color: '#CBD4D3',
            textAlign: 'right',
            fontSize: 16 + options.textSize * 40
        }
    });
    return (
        <>
            {contentValue.index && contentValue.index.length >= 3 ? <Text style={[styles.index, styles.fullWidth]}>{contentValue.index}</Text> : <></>}
            <View key={Math.random()} style={{ flexDirection: "row-reverse" }}>
                {contentValue.index && contentValue.index.length < 3 ? <Text style={[styles.index]}>{contentValue.index}</Text> : <></>}
                <Text style={{ width: "100%", userSelect: 'text', direction: 'rtl', textAlign: Platform.OS === 'android' ? 'right' : 'justify' }} >
                    {parse(content).childNodes.map((node) => contentReduce(node, options,styles, refClick))}
                </Text>
            </View>
        </>
    )
}



export default Content;