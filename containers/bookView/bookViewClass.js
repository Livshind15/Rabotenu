import * as React from 'react';
import Background from '../../component/background/background';
import { View, FlatList, StyleSheet, Dimensions, Text } from 'react-native';
import axios from "axios";
import config from "../../config/config";



export default class BookViewClass extends React.Component {
    constructor(props) {
        super(props);
        const { textSize } = this.props;
        this.styles = StyleSheet.create({
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
        this.state = {
            data: [],
            index: 0
        }
        this.bookName = [];
        this.section = [];
        this.chapter = '';
    }
    async componentWillMount() {
        this.fetchMore();
    }
    bookToElements (bookContent, grammar)  {
        return bookContent.reduce((elements, content) => {
            if (! this.bookName.includes(content.bookName)) {
                this.bookName = [...this.bookName, content.bookName]
                elements.push({ id: elements.length + 1, type: "bookName", value: content.bookName })
            }
            if (! this.section.includes(content.section)) {
                this.section = [...this.section, content.section]
                elements.push({ id: elements.length + 1, type: "section", value: content.section })
            }
            if (this.chapter !== content.chapter) {
                this.chapter = content.chapter
                elements.push({ id: elements.length + 1, type: "chapter", value: content.chapter })
            }
            elements.push({ id: elements.length + 1, type: "verse", parsaTag: RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`).test(content.content), index: content.verse, value: grammar ? removeGrammar(removeTag(content.content)) : removeTag(content.content) })
            return elements
    
        }, []);
    }
    async getBookContent([bookId, index]) {
        const { data } = await axios.get(`${config.serverUrl}/book/content/${bookId}?lteIndex=${((index + 1) * 250)}&gteIndex=${(index * 250)}`);
        return data || [];
    }
    async fetchMore() {
        const content = await this.getBookContent([this.props.bookId, this.state.index]).then(content => this.bookToElements(content, this.props.grammar));
        console.log({ content });
        this.setState({ data: [...this.state.data, ...content], index: this.state.index + 1 })
    }
    renderItem({ item, index }) {
        return (
            <View key={index} >
                {this.renderText(item, index)}
            </View>
        )
    }
    renderText(item, index) {
        const { styles } = this;
        const { exegesis } = this.props;
        if (item.type === 'bookName') {
            return <Text selectable style={styles.book}>{item.value}</Text>
        }
        if (item.type === 'section') {
            return <Text selectable style={styles.parsa}>{item.value}</Text>
        }
        if (item.type === 'chapter') {
            return <Text selectable style={styles.chapter}>{item.value}</Text>
        }
        if (item.type === 'verse') {
            let grayText = false;
            let boldText = false;
            return <View key={Math.random()} selectable style={styles.pasokContainer}>
                <Text selectable key={Math.random()} style={styles.pasok}>{item.index} </Text>
                {item.value.split(' ').map(((splitContent, index) => {
                    if (RegExp(`<\s*כתיב[^>]*>(.*?)`).test(splitContent)) {
                        grayText = true;
                    }
                    if (RegExp(`(.*?)<\s*/\s*כתיב>`).test(splitContent)) {
                        grayText = false;
                        return <Text selectable key={Math.random()} style={styles.pasokContentGray}> {removeGrayTag(splitContent)}</Text>
                    }
                    if (grayText) {
                        return <Text selectable key={Math.random()} style={styles.pasokContentGray}>{removeGrayTag(splitContent)}</Text>
                    }
                    if (RegExp(`<\s*דה[^>]*>(.*?)`).test(splitContent)) {
                        boldText = true;
                    }
                    if (RegExp(`(.*?)<\s*/\s*דה>`).test(splitContent)) {
                        boldText = false;
                        return <Text selectable key={Math.random()} style={styles.pasokContentBold}> {removeBoldTag(splitContent)}</Text>
                    }
                    if (boldText) {
                        return <Text selectable key={Math.random()} style={styles.pasokContentBold}> {removeBoldTag(splitContent)}</Text>
                    }
                    return <Text selectable key={Math.random()} style={styles.pasokContent}> {splitContent}</Text>
                }))}
                {item.parsaTag && !exegesis ? <Text selectable key={Math.random()} style={styles.pasokLink}>{'פ'}</Text> : <></>}
            </View>
        }
        return <></>
    }
    render() {
        console.log(this.state.data);
        return (
            <Background>
                <FlatList

                    onEndReachedThreshold={0.5 }
                    onEndReached={this.fetchMore.bind(this)}
                    getItemLayout={(data, index) => {
                        return { length: (5 - Dimensions.get('window').width / Dimensions.get('window').height) * 15.5, offset: (5 - Dimensions.get('window').width / Dimensions.get('window').height) * 15.5 * index, index }
                    }}
                    keyExtractor={(date, index) => String(index)}
                    style={this.styles.view}
                    data={this.state.data}
                    renderItem={this.renderItem.bind(this)} />



            </Background>
        )
    }
}


export const removeGrammar = (content) => {
    return content.replace(/[^א-ת\s,;.-]/g, '')
}

export const removeTag = (content) => {

    return content.replace(RegExp('<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>'), '')
}

export const removeGrayTag = (content) => {
    return content.replace(new RegExp(/<.כתיב./, 'g'), '').replace(/<\/?כתיב>/g, '')
}

export const removeBoldTag = (content) => {
    return content.replace(new RegExp(/<.דה./, 'g'), '').replace(/<\/?דה>/g, '')
}

