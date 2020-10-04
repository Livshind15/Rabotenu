import * as React from 'react';

import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';

import { parse } from 'node-html-parser';
import { removeNotNeedContent } from './bookView.utils';
import { indexesOf, insertSubString } from '../../utils/helpers';
import { groupBy, isEmpty } from 'lodash';

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

const textToHighlightTags = (content, highlight) => {
    const highlightPosition = highlight.reduce((position, currHighlight) => {
        const currPosition = indexesOf(content, currHighlight);
        if (!isEmpty(currPosition)) {
            position = [...position, ...currPosition.map(position => {
                return {
                    position,
                    highlight: currHighlight,
                    endPosition: position + currHighlight.length
                }
            })]
        }
        return position;
    }, []).sort((a, b) => b.position - a.position);
    const positions = groupBy(highlightPosition, "position");
    let highlightPositionUniq = Object.keys(positions).flatMap((position) => {
        return positions[position].sort(function (a, b) { return b.highlight.length - a.highlight.length })[0];
    }).reverse()
    const endPositions = groupBy(highlightPositionUniq, "endPosition");
    highlightPositionUniq = Object.keys(endPositions).flatMap((position) => {
        return endPositions[position].sort(function (a, b) { return b.highlight.length - a.highlight.length })[0];
    }).reverse();


    
    content = highlightPositionUniq.reduce((highlightContent, highlight) => {
        return insertSubString(highlightContent, highlight.position, highlight.highlight)
    }, content)
    console.log(highlightPositionUniq);
    if (!isEmpty(highlightPositionUniq)) {
        return parse(content).childNodes
    }
    return []

}
const innerTags = {
    "text": {
        render: (node, options, styles, refClick, index, highlight) => {
            let content = removeNotNeedContent(node.rawText, options.punctuation, options.grammar);
            return <Text key={index} style={styles.text}>{content}</Text>
        }
    },
    em: { render: (node, options, styles, refClick, index, highlight) => <Text key={index} style={styles.highlight}>{node.childNodes[0].rawText}</Text> },

}
const innerContentReduce = (node, options, styles, refClick, index, highlight = []) => {
    return innerTags[node._tag_name || 'text'].render(node, options, styles, refClick, index, highlight)
}




const tags = {
    text: {
        render: (node, options, styles, refClick, index, highlight) => {
            let content = removeNotNeedContent(node.rawText, options.punctuation, options.grammar);
            const highlightText = textToHighlightTags(content, highlight);
            if (isEmpty(highlightText)) {
                return <Text key={index} style={styles.text}>{content}</Text>
            }
            return highlightText.map((node, index) => innerContentReduce(node, options, styles, refClick, index, highlight))
        }
    },
    parsha: { render: (node, options, styles, refClick, index, highlight) => !options.exegesis ? <Text key={index} style={styles.parsha}>{node.childNodes[0].rawText}</Text> : <></> },
    bold: {
        render: (node, options, styles, refClick, index, highlight) => {
            let content = node.childNodes[0].rawText;
            const highlightText = textToHighlightTags(content, highlight);
            if (isEmpty(highlightText)) {
            return <Text key={index} style={styles.bold}>{content}</Text>
            }
            return highlightText.map((node, index) => innerContentReduce(node, options, {
                 text: styles.bold ,highlight:[styles.bold,styles.highlightText]
            }, refClick, index, highlight))
        }
    },
    small: {
        render: (node, options, styles, refClick, index, highlight) => {
            let content = node.childNodes[0].rawText;
            const highlightText = textToHighlightTags(content, highlight);
            if (isEmpty(highlightText)) {
            return <Text key={index} style={styles.small}>{content}</Text>
            }
            return highlightText.map((node, index) => innerContentReduce(node, options, {
                text: styles.small ,highlight:[styles.small,styles.highlightText]
           }, refClick, index, highlight))
        },
    },
    grey: { render: (node, options, styles, refClick, index, highlight) => <Text key={index} style={styles.grey}>{node.childNodes[0].rawText}</Text> },
    em: { render: (node, options, styles, refClick, index, highlight) => <Text key={index} style={styles.highlight}>{node.childNodes[0].rawText}</Text> },
    hide: { render: (node, options, styles, refClick, index, highlight) => <></> },
    ref: {
        render: (node, options, styles, refClick, index, highlight) => {
            const char = RegExp(/תו="([^"]+)"/).exec(node.rawAttrs)[1];
            const id = RegExp(/Id="([^"]+)"/).exec(node.rawAttrs) ? RegExp(/Id="([^"]+)"/).exec(node.rawAttrs)[1] : null;
            return !options.exegesis ? <TouchableOpacity key={index} onPress={() => refClick(id, char)} >
                <Text style={styles.ref}>{`${char} `}</Text>
            </TouchableOpacity> : <></>
        }
    },
}

const contentReduce = (node, options, styles, refClick, index, highlight = []) => {
    return tags[node._tag_name || 'text'].render(node, options, styles, refClick, index, highlight)
}

const Content = ({ contentValue, highlight = [], refClick, options }) => {
    let content = contentMap.reduce((content, replace) => {
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

        },
        indexWrapper: {
            width: 35,
            justifyContent: 'center',


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
        highlightText:{
            backgroundColor: 'yellow',
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
            <View key={Math.random()} style={[{ flexDirection: Platform.OS === "android" ? 'row-reverse' : "row", width: '100%', direction: 'rtl' }]}>

                {contentValue.index && contentValue.index.length < 3 ? <View style={[styles.indexWrapper, { alignItems: Platform.OS === "android" ? 'flex-end' : 'flex-start' }]}><Text style={[styles.index]}>{contentValue.index}</Text></View> : <></>}

                <Text selectable style={[{ width: "90%", textAlignVertical: "center", writingDirection: 'rtl', direction: 'rtl', textAlign: Platform.OS === 'android' ? 'right' : 'justify' }, Platform.OS === 'web' ? { userSelect: 'text' } : {}]} >
                    {parse(content).childNodes.map((node, index) => contentReduce(node, options, styles, refClick, index, highlight))}
                </Text>
            </View>
        </>
    )
}



export default Content;