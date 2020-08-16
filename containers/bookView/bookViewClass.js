import * as React from 'react';
import Background from '../../component/background/background';
import { View, FlatList, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import axios from "axios";
import config from "../../config/config";
import { delay } from '../../utils/helpers';
import { isEmpty } from 'lodash';
import { Spinner } from '@ui-kitten/components';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';
import PlaceHolder from '../../component/placeHolder/placeHolder';


const DefaultScrollSize = 250;

class BookViewClass extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            end: false,
            index: 0,
            loading: false,
            highlightIndex: null,
            bookId: this.props.bookId
        }
        this.styles = getStyles(this.props.textSize);

        this.bookName = [];
        this.section = [];
        this.chapter = '';
    }

    async componentDidMount() {
        delay(1000).then(() => {
            this.props.setMount(true)
        })
        const index = await this.getContentIndex(this.props.bookId, this.props.section, this.props.chapter, this.props.verse);
        this.setState({ loading: true, index: index }, () => this.fetchMore());
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.section !== this.props.section ||
            nextProps.chapter !== this.props.chapter ||
            nextProps.verse !== this.props.verse ||
            nextProps.bookId !== this.props.bookId) {
            const index = await this.getContentIndex(nextProps.bookId, nextProps.section, nextProps.chapter, nextProps.verse);
            this.setState({ bookId: nextProps.bookId, loading: true, index: index }, () => this.fetchMore());
        }

    }

    bookToElements(bookContent, grammar) {

        return bookContent.reduce((elements, content, index) => {
            if (!this.bookName.includes(content.bookName)) {
                this.bookName = [...this.bookName, content.bookName]
                elements.push({ id: elements.length + 1, type: "bookName", value: content.bookName, original: content })
            }
            if (!this.section.includes(content.section)) {
                this.section = [...this.section, content.section]
                elements.push({ id: elements.length + 1, type: "section", value: content.section, original: content })
            }
            if (this.chapter !== content.chapter) {
                this.chapter = content.chapter
                elements.push({ id: elements.length + 1, type: "chapter", value: content.chapter, original: content })
            }

            if (content.verse.length && elements[elements.length - 1] && elements[elements.length - 1].index && elements[elements.length - 1].index === content.verse) {
                elements[elements.length - 1] = { ...elements[elements.length - 1],parsaTag: elements[elements.length - 1].parsaTag ? elements[elements.length - 1].parsaTag :RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`).test(content.content), value: grammar ? removeGrammar(removeTag(elements[elements.length - 1].value + content.content)) : removeTag(elements[elements.length - 1].value + content.content) }
                return elements
            }
           if(elements[elements.length - 1].type === 'chapter' && !content.content.length){
               return elements
           }
           if(elements[elements.length - 1].type === 'section' && !content.content.length){
            return elements
        }
            elements.push({ original: content, id: elements.length + 1, type: "verse", parsaTag: RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`).test(content.content), index: content.verse, value: grammar ? removeGrammar(removeTag(content.content)) : removeTag(content.content) })
            return elements

        }, []);
    }

    async getBookContent([bookId, index]) {
        console.log({ bookId, index });

        const { data } = await axios.get(`${config.serverUrl}/book/content/${bookId}?lteIndex=${index + DefaultScrollSize}&gteIndex=${index}`);
        return data || [];
    }

    async getContentIndex(bookId, section, chapter, verse) {
        let url = `${config.serverUrl}/book/content/${bookId}?size=1`;
        if (section) {
            url += `&section=${section}`
        }
        if (chapter) {
            url += `&chapter=${chapter}`
        }
        if (verse) {
            url += `&verse=${verse}`
        }
        const { data } = await axios.get(url);
        if (isEmpty(data)) {
            return 0;
        }
        return data[0].index || 0
    }

    async fetchMore() {
        if (this.state.loading) {
            this.getBookContent([this.state.bookId, this.state.index]).then(content => this.bookToElements(content, this.props.grammar)).then(content => {
                console.log({ content });
                this.setState({ end: !content.length, data: [...this.state.data, ...content], index: this.state.index + DefaultScrollSize });
            })
        }
    }

    renderItem({ item, index }) {
        return (
            <Item indexPress={(pressIndex) => {
                this.props.onTextSelected(this.state.data[pressIndex]);
                this.setState({ highlightIndex: pressIndex })
            }} highlightIndex={this.state.highlightIndex} item={item} styles={this.styles} index={index} textSize={this.props.textSize} exegesis={this.props.exegesis}></Item>
        )
    }



    render() {
        return (
            <Background>
                {this.state.data.length ? <FlatList
                    onEndReachedThreshold={10}
                    initialNumToRender={2}
                    onEndReached={() => {
                        if (!this.state.end) {
                            this.setState({ loading: true }, () => this.fetchMore());
                        }
                    }}
                    keyExtractor={(date, index) => String(index)}
                    style={this.styles.view}
                    refreshing={this.state.loading}
                    data={this.state.data}
                    renderItem={this.renderItem.bind(this)} /> : <View style={this.styles.spinnerContainer}>
                        <Spinner />
                    </View>}
            </Background>
        )
    }
}

class Item extends React.Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.highlightIndex !== this.props.index && this.props.index !== this.props.highlightIndex) {
            return false;
        }
        return true;
    }

    render() {
        const { item, highlightIndex, index, styles, exegesis, indexPress } = this.props;
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
            let grayText = false;
            let boldText = false;
            let smallText = false;
            return <TouchableOpacity onPress={() => indexPress(index)} key={Math.random()} style={[styles.pasokContainer, highlightIndex === index ? styles.pasokContainerHighlight : {}]}>
                <Text key={Math.random()} style={styles.pasok}>{item.index}</Text>

                {item.value.split(' ').map(((splitContent, index) => {
                    if (RegExp(`<\s*כתיב[^>]*>(.*?)`).test(splitContent)) {
                        grayText = true;
                    }
                    if (RegExp(`(.*?)<\s*/\s*כתיב>`).test(splitContent)) {
                        grayText = false;
                        return <Text key={Math.random()} style={styles.pasokContentGray}> {removeGrayTag(splitContent)}</Text>
                    }
                    if (grayText) {
                        return <Text key={Math.random()} style={styles.pasokContentGray}>{removeGrayTag(splitContent)}</Text>
                    }
                    if (RegExp(`<\s*קטן[^>]*>(.*?)`).test(splitContent)) {
                        smallText = true;
                    }
                    if (RegExp(`(.*?)<\s*/\s*קטן>`).test(splitContent)) {
                        smallText = false;
                        return <Text key={Math.random()} style={styles.pasokContentSmall}> {removeBoldTag(removeSmallTag(splitContent))}</Text>
                    }
                    if (smallText) {
                        return <Text key={Math.random()} style={styles.pasokContentSmall}> {removeBoldTag(removeSmallTag(splitContent))}</Text>
                    }
                    if (RegExp(`<\s*דה[^>]*>(.*?)`).test(splitContent)|| RegExp(`<\s*הדגשה[^>]*>(.*?)`).test(splitContent)) {
                        boldText = true;
                    }
                    if (RegExp(`(.*?)<\s*/\s*דה>`).test(splitContent)||RegExp(`(.*?)<\s*/\s*הדגשה>`).test(splitContent)) {
                        boldText = false;
                        return <Text key={Math.random()} style={styles.pasokContentBold}> {removeBoldTag(splitContent)}</Text>
                    }
                    if (boldText) {
                        return <Text key={Math.random()} style={styles.pasokContentBold}> {removeBoldTag(splitContent)}</Text>
                    }
                    return <Text key={Math.random()} style={styles.pasokContent}> {splitContent}</Text>
                }))}
                {item.parsaTag && !exegesis ? <Text key={Math.random()} style={styles.pasokLink}>{'פ'}</Text> : <></>}
            </TouchableOpacity>
        }
        return <></>
    }
}


const getStyles = (textSize) => {
    return StyleSheet.create({
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
            fontFamily: "OpenSansHebrewBold",
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
            fontFamily: "Hebrew",
            fontWeight: "bold",
            textAlign: 'right',
            fontSize: 20+ (textSize * 50),
        },
        pasokLink: {
            color: '#11AFC2',
            fontFamily: "Hebrew",
            textAlign: 'right',
            alignSelf: 'center',
            fontSize: 12 + (textSize * 50),
        },
        pasokContentSmall: {
            color: '#455253',
            fontFamily: "Hebrew",
            textAlign: 'right',
            fontSize: 14 + (textSize * 50),
        },
        pasokContentGray: {
            color: '#CBD4D3',
            fontFamily: "Hebrew",
            textAlign: 'right',
            fontSize: 17 + (textSize * 50),
        },
        pasokContent: {
            color: '#455253',
            fontFamily: "Hebrew",
            textAlign: 'right',
            fontSize: 20 + (textSize * 50),
        },
        pasokContainer: {
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row-reverse',

        },
        pasokContainerHighlight: {
            backgroundColor: "#11afc02F"

        }
    });
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
export const removeSmallTag = (content) => {
    return content.replace(new RegExp(/<קטן>/, 'g'), '').replace(/<\/?קטן>/g, '')
}
export const removeBoldTag = (content) => {
    return content.replace(new RegExp(/<.דה./, 'g'), '').replace(/<\/?דה>/g, '').replace(new RegExp(/<.הדגשה./, 'g'), '').replace(/<\/?הדגשה>/g, '')
}

export default optimizeHeavyScreen(BookViewClass, PlaceHolder)
