import * as React from 'react';
import Background from '../../component/background/background';
import { View, FlatList, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import axios from "axios";
import { Tooltip } from '@ui-kitten/components';
import Icon from "react-native-vector-icons/AntDesign";

import config from "../../config/config";
import { delay } from '../../utils/helpers';
import { isEmpty } from 'lodash';
import { Spinner } from '@ui-kitten/components';
import { optimizeHeavyScreen } from 'react-navigation-heavy-screen';
import PlaceHolder from '../../component/placeHolder/placeHolder';
import ErrorModel from '../../component/modalError/modalError';
import { IfInitial } from 'react-async';

const headers = ["header1", "header2", "header3", "header4", "header5", "header6", "header7"]
const DefaultScrollSize = 35;

class BookViewClass extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            end: false,
            index: 0,
            loading: false,
            retchedEnd: false,
            retchedStart: false,
            highlightIndex: null,
            showCopyModal: false,
            bookId: this.props.bookId,
            bookInfo: {},
        }
        this.styles = getStyles(this.props.textSize);
        this.headersFilter = { header1: "", header2: "", header3: "", header4: "", header5: "", header6: "", header7: "" }
        this.currHeader = {};
        this.bookName = [];
        this.headers = ['', '', '', '', '', '', '', '']
    }

    async componentDidMount() {
        delay(1000).then(() => {
            this.props.setMount(true)
        })
        const bookInfo = await this.getBookInfo([this.props.bookId])
        this.setState({ bookInfo: bookInfo })

        if (this.props.mode === 'scroll' && (this.props.index === 0 || (this.props.selectedHeader && Object.keys(this.props.selectedHeader).some(header => !isEmpty(this.props.selectedHeader[header]))))) {
            const index = await this.getContentIndex(this.props.bookId, this.props.selectedHeader);
            this.setState({ index: index }, () => this.fetchMore());
        }
        else if (this.props.mode === 'page' && (this.props.index === 0 || (this.props.selectedHeader && Object.keys(this.props.selectedHeader).some(header => !isEmpty(this.props.selectedHeader[header]))))) {
            const index = await this.getContentIndex(this.props.bookId, this.props.selectedHeader);
            this.setState({ loading: true, index: index }, () => this.fetchPage());


        }
        else if (this.props.mode === 'page') {
            this.setState({ loading: true ,index: this.props.index }, () => this.fetchPage());

        }
        else {
            this.setState({ index: this.props.index }, () => this.fetchMore());

        }

    }

    async componentDidUpdate(nextProps) {
        if (nextProps.selectedHeader !== this.props.selectedHeader ||
            nextProps.bookId !== this.props.bookId) {
            const bookInfo = await this.getBookInfo([this.props.bookId])
            this.setState({ bookInfo: bookInfo })
            if (this.props.mode !== 'page') {
                const index = await this.getContentIndex(nextProps.bookId, nextProps.selectedHeader);
                this.setState({ bookId: nextProps.bookId, index: index }, () => this.fetchMore());
            }
            else {
                const index = await this.getContentIndex(nextProps.bookId, nextProps.selectedHeader);
                this.setState({ bookId: nextProps.bookId, loading: true, index: index }, () => this.fetchPage());
            }

        }

    }


    bookToElements(bookContent) {
        const elements = bookContent.reduce((elements, content, index) => {
            if (!this.bookName.includes(content.bookName)) {
                this.bookName = [...this.bookName, content.bookName]
                elements.push({ id: elements.length + 1, type: "bookName", value: content.bookName, original: content })
            }
            headers.forEach((header, index) => {
                if (this.headers[index] !== content[header] && !isEmpty(content[header])) {
                    this.headers[index] = content[header]
                    if (!this.state.bookInfo.style[header].inLine) {
                        elements.push({ id: this.state.data.length + elements.length + 1, type: header, style: this.state.bookInfo.style[header], value: content[header], original: content })
                    }
                }
            })
            const inLineHeader = Object.keys(this.state.bookInfo.style).map((header) => {
                if (this.state.bookInfo.style[header].inLine) {
                    return header
                }
            }).filter(item => !isEmpty(item))
            if (content[inLineHeader[0]].length && elements[elements.length - 1] && elements[elements.length - 1].index && elements[elements.length - 1].index === content[inLineHeader[0]] && elements[elements.length - 1].value !== content.content) {
                elements[elements.length - 1] = { ...elements[elements.length - 1], parsaTag: elements[elements.length - 1].parsaTag ? elements[elements.length - 1].parsaTag : RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`).test(content.content), value: elements[elements.length - 1].value + content.content }
                return elements
            }
            if (inLineHeader[0]) {
                elements.push({
                    original: content,
                    id: this.state.data.length + elements.length + 1,
                    type: "content",
                    index: content[inLineHeader[0]],
                    parsaTag: RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`).test(content.content),
                    value: content.content
                })
            }
            else {
                elements.push({
                    original: content,
                    id: this.state.data.length + elements.length + 1,
                    type: "content",
                    parsaTag: RegExp(`<\s*פרשה[^>]*>(.*?)<\s*/\s*פרשה>`).test(content.content),
                    value: content.content
                })
            }

            return elements

        }, []);
        if (this.props.mode === 'page') {
            return [{
                type: "startButton",
            }, ...elements, {
                type: "endButton",
            }]
        }
        return elements;
    }

    async getBookContent([bookId, index, scroll]) {
        const { data } = await axios.get(`${config.serverUrl}/book/content/${bookId}?lteIndex=${index + scroll}&gteIndex=${index}`);
        return data || [];
    }

    async getBookContentByHeaders([bookId, header]) {
        let params = '';

        headers.forEach(headersType => {
            if (header[headersType]) {
                if (params.length) {
                    params += `&${headersType}=${header[headersType]}`
                }
                else {
                    params += `?${headersType}=${header[headersType]}`
                }
            }
        })
        const { data } = await axios.get(`${config.serverUrl}/book/content/${bookId}` + params);
        return data || [];
    }

    async getBookInfo([bookId]) {
        const { data } = await axios.get(`${config.serverUrl}/mapping/books/book/${bookId}`);
        return data || [];
    }


    async getContentIndex(bookId, header) {
        let url = `${config.serverUrl}/book/content/${bookId}?size=1`;
        headers.forEach(headersType => {
            if (header[headersType]) {
                url += `&${headersType}=${header[headersType]}`
            }
        })
        const { data } = await axios.get(url);
        if (isEmpty(data)) {
            return 0;
        }
        return data[0].index || 0
    }

    async getRefIndex(bookId, header, character, id) {
        let url = `${config.serverUrl}/mapping/groups/refs/${bookId}?character=${character.replace('.', '')}`;
        headers.forEach(headersType => {
            if (header[headersType]) {
                url += `&${headersType}=${header[headersType]}`
            }
        })
        if (id) {
            url += `&id=${id}`
        }
        const { data } = await axios.get(url);
        if (isEmpty(data)) {
            
        }
        return data[0]
    }

    async fetchMore() {               
        if (!this.state.loading) {
            this.setState({loading:true});
            this.getBookContent([this.state.bookId, this.state.index, DefaultScrollSize]).then(content => this.bookToElements(content, this.props.grammar, this.props.punctuation)).then(content => {
                this.setState({ end: !content.length,loading:false, data: [...this.state.data, ...content], index: this.state.index + DefaultScrollSize });
            })
        }
    }
    async fetchPage() {
        if (!(this.headersFilter && Object.keys(this.headersFilter).some(header => !isEmpty(this.headersFilter[header])))) {

            const content = await this.getBookContent([this.state.bookId, this.state.index, 0])
            if (!isEmpty(content[0])) {
                this.headersFilter = Object.keys(content[0]).reduce((headersValue, key) => {
                    if (headers.includes(key) && (headers.findIndex(item => item === key) < headers.findIndex(item => item === this.props.pageBy))) {
                        headersValue[key] = content[0][key];
                    }
                    if (headers.includes(key) && (headers.findIndex(item => item === key) === headers.findIndex(item => item === this.props.pageBy))) {
                        this.currHeader = { [key]: content[0][key] };
                    }
                    return headersValue;
                }, {})
            }
        }
        this.getBookContentByHeaders([this.state.bookId, { ...this.headersFilter, ...this.currHeader }]).then(content => this.bookToElements(content, this.props.grammar, this.props.punctuation)).then(content => {
            this.setState({ data: [] })
            this.bookName = [];
            this.headers = ['', '', '', '', '', '', '', '']
            this.setState({ end: !content.length, loading: false, data: [...this.state.data, ...content] });
        })
    }

    async onRefClick(index, id, char) {
        const original = this.state.data[index].original;
        const inLineHeader = Object.keys(this.state.bookInfo.style).map((header) => {
            if (this.state.bookInfo.style[header].inLine) {
                return header
            }
        }).filter(item => !isEmpty(item))
        console.log(this.state.data[index].original);
        console.log(headers[headers.findIndex(header=> inLineHeader[0]===header)+1])
        const ref = await this.getRefIndex(original.bookId, {
            ...{
                header1: original.header1,
                header2: original.header2,
                header3: original.header3,
                header4: original.header4,
                header5: original.header5,
                header6: original.header6,
                header7: original.header7,
            }, [headers[headers.findIndex(header=> inLineHeader[0]===header)+1]]:char
        }, id)
        if (!isEmpty(ref)) {
            this.props.onBookSelect(ref.bookId, ref.index);

        }
    }

    async onPrev() {
        const { data } = await axios.post(`${config.serverUrl}/book/parts/${this.props.bookId}`, {
            "type": this.props.pageBy,
            "parentParts": this.headersFilter,
        });
        const headerIndex = data.findIndex(header => header === this.currHeader[this.props.pageBy])
        if (data[headerIndex - 1]) {
            this.currHeader = { [this.props.pageBy]: data[headerIndex - 1] }
            this.setState({ loading: true, index: this.props.index }, () => this.fetchPage());
            return true;

        }

        else {
            const content = await this.getBookContent([this.state.bookId, this.state.data[1].original.index - 1, 0])
            if (!isEmpty(content) && !isEmpty(content[0])) {
                this.headersFilter = Object.keys(content[0]).reduce((headersValue, key) => {
                    if (headers.includes(key) && (headers.findIndex(item => item === key) < headers.findIndex(item => item === this.props.pageBy))) {
                        headersValue[key] = content[0][key];
                    }
                    if (headers.includes(key) && (headers.findIndex(item => item === key) === headers.findIndex(item => item === this.props.pageBy))) {
                        this.currHeader = { [key]: content[0][key] };
                    }
                    return headersValue;
                }, {})
                this.setState({ loading: true, index: this.props.index }, () => this.fetchPage());
                return true;

            }
            else {
                this.bookName = [];
                this.headers = ['', '', '', '', '', '', '', '']
                this.setState({ loading: false, data: [...this.state.data] });
                return false;
            }

        }
    }
    async getParts() {
        const { data } = await axios.post(`${config.serverUrl}/book/parts/${this.props.bookId}`, {
            "type": this.props.pageBy,
            "parentParts": this.headersFilter,
        });
        return data
    }
    async onNext() {
        const data = await this.getParts();
        const headerIndex = data.findIndex(header => header === this.currHeader[this.props.pageBy])
        if (data[headerIndex + 1]) {
            this.currHeader = { [this.props.pageBy]: data[headerIndex + 1] }
            this.setState({ loading: true }, () => this.fetchPage());
            return true;

        }
        else {
            const content = await this.getBookContent([this.state.bookId, this.state.data[this.state.data.length-2].original.index + 1, 0])
            if (!isEmpty(content) && !isEmpty(content[0])) {
                this.headersFilter = Object.keys(content[0]).reduce((headersValue, key) => {
                    if (headers.includes(key) && (headers.findIndex(item => item === key) < headers.findIndex(item => item === this.props.pageBy))) {
                        headersValue[key] = content[0][key];
                    }
                    if (headers.includes(key) && (headers.findIndex(item => item === key) === headers.findIndex(item => item === this.props.pageBy))) {
                        this.currHeader = { [key]: content[0][key] };
                    }
                    return headersValue;
                }, {})
                this.setState({ loading: true }, () => this.fetchPage());
                return true;
            }
            else {
                this.bookName = [];
                this.headers = ['', '', '', '', '', '', '', '']
                this.setState({ loading: false, data: [...this.state.data] });
                return false;
            }

        }
    }

    renderItem({ item, index }) {
        return (

            <Item onPrevPage={() => this.onPrev()} onNextPage={() => this.onNext()} textSize={this.props.textSize} onRefClick={(index, id, char) => this.onRefClick(index, id, char)} showCopyModal={() => { this.setState({ showCopyModal: true }) }} indexLongPress={async (index) => this.props.onTextLongPress(this.state.data[index])} indexPress={(pressIndex) => {
                this.props.onTextSelected(this.state.data[pressIndex]);
                this.setState({ highlightIndex: pressIndex })
            }} highlightIndex={this.state.highlightIndex} item={item} punctuation={this.props.punctuation} styles={this.styles} index={index} itemIndex={index} textSize={this.props.textSize} grammar={this.props.grammar} exegesis={this.props.exegesis}></Item>
        )
    }

    render() {
        return (
            <Background>
                <ErrorModel errorMsg={"הפיסקה עותקה בהצלחה"} errorTitle={'העתקת תוכן'} visible={this.state.showCopyModal} setVisible={(state) => { this.setState({ showCopyModal: state }) }} />

                {this.state.data.length ? <FlatList
                    onEndReachedThreshold={10}
                    initialNumToRender={2}
                    onEndReached={() => {
                        if (!this.state.end && this.props.mode === 'scroll') {
                            this.setState({  index: this.state.index + 1 }, () => this.fetchMore());
                        }
                    }}
                    keyExtractor={(date, index) => String(index)}
                    style={this.styles.view}
                    removeClippedSubviews={false}
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
        this.state = {
            end: false,
            start: false
        }
        this.comments = {};
    }
    shouldComponentUpdate(nextProps, nextState) {

        if (nextProps.highlightIndex !== this.props.index && this.props.index !== this.props.highlightIndex && nextState.end === this.state.end && nextState.start === this.state.start) {
            return false;
        }
        return true;
    }

    render() {
        const { item, onPrevPage, onNextPage, highlightIndex, indexLongPress, index, itemIndex, punctuation, onRefClick, styles, textSize, exegesis, indexPress, grammar } = this.props;
        if (item.type === 'startButton') {
            return <TouchableOpacity disabled={this.state.start} onPress={async () => {
                this.setState({ start: !(await onPrevPage()) })
            }} style={styles.prevPage}><Icon color={this.state.start ? "#455253" : "#11AFC2"} size={30} name={'up'} /></TouchableOpacity>
        }
        if (item.type === 'endButton') {
            return <TouchableOpacity disabled={this.state.end} onPress={async () => {
                this.setState({ end: !(await onNextPage()) })
            }} style={styles.nextPage}><Icon color={this.state.end ? "#455253" : "#11AFC2"} size={30} name={'down'} /></TouchableOpacity>
        }
        if (item.type === 'bookName') {
            return <Text style={styles.book}>{item.value.replace('_', '"')}</Text>
        }
        for (const header of headers) {
            if (item.type === header) {
                return <Text style={[styles.parsa, { fontSize:  24 + (textSize * 50), color: item.style.color, textAlign: item.style.textAlign || "right" }]}>{item.value}</Text>
            }
        }

        if (item.type === 'content') {
            let grayText = false;
            let boldText = false;
            let smallText = false;
            let comment = { enable: true, id: '', char: '' };
            return <TouchableOpacity onLongPress={async () => {
                await indexLongPress(index);
                if (highlightIndex === index) {
                    this.props.showCopyModal();
                }
            }} selectable onPress={() => indexPress(index)} key={Math.random()} style={[styles.pasokContainer, highlightIndex === index ? styles.pasokContainerHighlight : {}]}>
                {item.index ? <Text key={Math.random()} key={Math.random()} style={styles.pasok}>{item.index}</Text> : <></>}
                {item.value.split(' ').reduce((elements, splitContent, index) => {
                    let text = splitContent;
                    if (RegExp('<הערה').test(text)) {
                        comment.enable = true;
                        text = text.replace('<הערה', '')
                    }
                    if (comment.enable) {
                        const char = (RegExp(/תו="([^"]+)"/).exec(text));
                        if (char) {
                            text = text.replace(/תו="([^"]+)"/g, '')
                            comment.char = char[1];
                            const id = (RegExp(/Id="([^"]+)"/).exec(item.value.split(' ')[index + 1]));
                            if (id) {
                                comment.id = id[1];
                            }
                            this.comments[index] = { ...comment }
                            elements.push(
                                <TouchableOpacity onPress={() => { onRefClick(itemIndex, this.comments[index].id, this.comments[index].char) }}>
                                    <Text key={Math.random()} style={styles.pasokContentComment}> {comment.char} </Text>
                                </TouchableOpacity>)
                            return elements
                        }
                        text = text.replace(/Id="([^"]+)"/g, '')
                    }
                    if (RegExp('</הערה').test(text)) {
                        comment.enable = false;
                        text = text.replace('</הערה', '')
                    }
                    if (RegExp(`<\s*כתיב[^>]*>(.*?)`).test(text)) {
                        grayText = true;
                    }
                    if (RegExp(`(.*?)<\s*/\s*כתיב>`).test(text)) {
                        grayText = false;
                        elements.push(<Text selectable key={Math.random()} style={styles.pasokContentGray}> {removeGrayTag(text)}</Text>)
                        return elements
                    }
                    if (grayText) {
                        elements.push(<Text selectable key={Math.random()} style={styles.pasokContentGray}>{removeGrayTag(text)}</Text>)
                        return elements
                    }
                    if (RegExp(`<\s*קטן[^>]*>(.*?)`).test(text)) {
                        smallText = true;
                    }
                    if (RegExp(`(.*?)<\s*/\s*קטן>`).test(text)) {
                        smallText = false;
                        elements.push(<Text selectable key={Math.random()} style={styles.pasokContentSmall}> {removeBoldTag(removeSmallTag(text))}</Text>)
                        return elements
                    }
                    if (smallText) {
                        elements.push(<Text selectable key={Math.random()} style={styles.pasokContentSmall}> {removeBoldTag(removeSmallTag(text))}</Text>)
                        return elements
                    }
                    if (RegExp(`<\s*דה[^>]*>(.*?)`).test(text) || RegExp(`<\s*הדגשה[^>]*>(.*?)`).test(text)) {
                        boldText = true;
                    }
                    if (RegExp(`(.*?)<\s*/\s*דה>`).test(text) || RegExp(`(.*?)<\s*/\s*הדגשה>`).test(text)) {
                        boldText = false;
                        elements.push(<Text selectable key={Math.random()} style={styles.pasokContentBold}> {removeBoldTag(text)}</Text>)
                        return elements
                    }
                    if (boldText) {
                        elements.push(<Text selectable key={Math.random()} style={styles.pasokContentBold}> {removeBoldTag(text)}</Text>)
                        return elements
                    }

                    elements.push(<Text selectable={true} key={Math.random()} style={styles.pasokContent}> {removeNotNeedContent(text, punctuation, grammar)}</Text>)

                    return elements
                }, [])}
                {item.parsaTag && !exegesis ? <Text key={Math.random()} style={styles.pasokLink}>{'פ'}</Text> : <></>}
            </TouchableOpacity>
        }
        return <></>
    }
}

export const removeNotNeedContent = (content, punctuation, grammar) => {
    const contentWithoutTags = removeTag(content)
    return punctuation ? removePunctuation((grammar ? removeGrammar(contentWithoutTags) : contentWithoutTags)) : (grammar ? removeGrammar(contentWithoutTags) : contentWithoutTags)
}

const getStyles = (textSize) => {
    return StyleSheet.create({
        prevPage: {
            alignSelf: 'center',
            height: 20,
            justifyContent: 'center'
        },
        nextPage: {
            paddingTop: 5,
            alignSelf: 'center',
            height: 20,
            justifyContent: 'center'
        },
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
            fontWeight: "bold",
            textAlign: 'right',
            fontSize: 20 + (textSize * 50),
        },
        pasokLink: {
            color: '#11AFC2',
            textAlign: 'right',
            alignSelf: 'center',
            fontSize: 12 + (textSize * 50),
        },
        pasokContentSmall: {
            color: '#455253',
            textAlign: 'right',
            fontSize: 14 + (textSize * 50),
        },
        pasokContentComment: {
            color: '#00701a',
            textAlign: 'right',
            fontSize: 14 + (textSize * 50),
        },
        pasokContentGray: {
            color: '#CBD4D3',
            textAlign: 'right',
            fontSize: 17 + (textSize * 50),
        },
        pasokContent: {
            color: '#455253',
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
    return content.replace(/[^א-ת\s,:;־.-]/g, '')
}

export const removePunctuation = (content) => {
    // return ([...content] || []).reduce((newString, char, index) => {
    //     if (!['?', '!', ',', ".", ":"].includes(char) || [...content].length - 1 === index) {
    //         newString += char;
    //     }
    //     return newString;
    // }, '')
    return content
}

export const removeTag = (content) => {
    return content.replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig, '').replace('>', '').replace('<', '')
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
