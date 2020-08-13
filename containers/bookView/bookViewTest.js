import React, { Component } from "react";
import { View, StyleSheet,Text } from "react-native";
import { RecyclerListView, DataProvider,LayoutProvider } from "recyclerlistview";
import axios from "axios";
import config from "../../config/config";
import { bookToElements } from "./bookView";
const getBookContent = async ([bookId, index]) => {
    const { data } = await axios.get(`${config.serverUrl}/book/content/${bookId}?lteIndex=${((index + 1) * 50)}&gteIndex=${(index * 50)}`);
    return data || [];
}

export default class BookViewTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProvider: new DataProvider((r1, r2) => {
                return r1 !== r2;
            }),
            layoutProvider: new LayoutProvider(
                index => {
                    return index;
                },
                (type, dimension) => {
                    dimension.height = 100;
                    dimension.width = 1000;
                }
            ),
            data:[],
            count: 0,
        };
    }
    componentWillMount() {
        this.fetchMoreData();
    }
    async fetchMoreData() {
        const fetchData =  await getBookContent(['9150e004-3b32-407f-9f26-37045f22769c',this.state.count]).then(res => bookToElements(res,false));
        console.log(fetchData);
            this.setState({
                dataProvider: this.state.dataProvider.cloneWithRows(fetchData),
                count: this.state.count + 1
            });
        
    }
    rowRenderer = (type, data) => {
        //We have only one view type so not checks are needed here
        return <Text>{data.value}</Text>;
    };
  
    handleListEnd = () => {
        this.fetchMoreData();
        this.setState({});
    };
  
    render() {
        return (
            <View style={styles.container}>

                {this.state.count > 0 ? (
                    <RecyclerListView
                        style={{ flex: 1 }}
                        onEndReached={this.handleListEnd}
                        dataProvider={this.state.dataProvider}
                        layoutProvider={this.state.layoutProvider}
                        renderAheadOffset={0}
                        rowRenderer={this.rowRenderer}
                    />
                ) : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
        justifyContent: "space-between"
    }
});
