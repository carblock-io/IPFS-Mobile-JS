/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import nodejs from 'nodejs-mobile-react-native';
import React, { Component } from 'react';
const RNFS = require('react-native-fs');
import {
  StyleSheet,
  Text,
  View,
    TextInput,
    TouchableOpacity,
    Linking,
    Alert,
    Clipboard
} from 'react-native';

export default class App extends Component {

    constructor(){
        super();
        this.state = {
            hasInit : false,
            addTxt:'',
            ipfsUrl:'',
            ipfsTxt:'',
            contentHash:''
        }
    }


    componentWillMount()
    {
        nodejs.start("main.js");
        nodejs.channel.addListener(
            "message",
            (msg) => {
                let msgObj = JSON.parse(msg);
                if(msgObj.msgType === "init"){
                    nodejs.channel.send(JSON.stringify({
                        msgType:"tryOpenRep",
                        rootPath:RNFS.DocumentDirectoryPath
                    }));
                }
                else if(msgObj.msgType === "ready"){
                    alert("IPFS-Mobile has ready!");
                    this.setState({hasInit:true});
                }
                else if(msgObj.msgType === "addTxtSuccess"){
                    Alert.alert('提示', `添加内容成功${msgObj.hash}，点击确认将哈希值复制到剪贴板！`, [
                        {
                            text: '确认', onPress: () => {
                            Clipboard.setString(msgObj.hash);
                            fetch(`https://ipfs.io/ipfs/${msgObj.hash}`).then(res=>{
                                console.log(res.result);
                                this.setState({ipfsTxt:res.result})
                            })
                        }}
                    ]);
                }
                else if(msgObj.msgType === "getHashSuccess"){
                    alert(msgObj.data);
                }
            },
            this
        );
    }

  render() {
    return (
      <TouchableOpacity activeOpacity = {1} onPress = {()=>{
          this.refs.contentInput&&this.refs.contentInput.blur()
          this.refs.contentInput1&&this.refs.contentInput1.blur()
      }} style={styles.container}>
          {this.state.hasInit?this.renderConrol():this.renderInit()}
          {this.state.hasInit?this.renderGet():this.renderInit()}
      </TouchableOpacity>
    );
  }

  renderInit(){
    return (
        <Text>
            Init IPFS ...
        </Text>
    )
  }

  renderGet(){
      return(
          <View style = {{alignItems:'center',justifyContent:'center',marginTop:20}}>
              <TextInput ref = 'contentInput1'
                         style={styles.input}
                         placeholder="输入内容Hash"
                         onChangeText={(text) => this.setState({contentHash:text})}/>
              <TouchableOpacity activeOpacity = {0.7} onPress = {()=>{
                  nodejs.channel.send(JSON.stringify({
                      msgType:"getHash",
                      txt:this.state.contentHash
                  }));
                  this.refs.contentInput1&&this.refs.contentInput1.blur()
              }} style = {{marginTop:20,width:180,height:40,backgroundColor:'#3D3D3D',alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{color:'white'}}>从IPFS获取内容</Text>
              </TouchableOpacity>
          </View>
      )
  }

  renderConrol(){
      return (
          <View style = {{alignItems:'center',justifyContent:'center'}}>
              <TextInput ref = 'contentInput'
                  style={styles.input}
                  placeholder="输入文本内容"
                  onChangeText={(text) => this.setState({addTxt:text})}/>
              <TouchableOpacity activeOpacity = {0.7} onPress = {()=>{
                  nodejs.channel.send(JSON.stringify({
                      msgType:"addText",
                      txt:this.state.addTxt +'\n'
                  }));
                  this.refs.contentInput&&this.refs.contentInput.blur()
              }} style = {{marginTop:20,width:180,height:40,backgroundColor:'#3D3D3D',alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{color:'white'}}>添加到IPFS</Text>
              </TouchableOpacity>
              <Text style = {{marginTop:20}}>
                  {this.state.ipfsTxt}
              </Text>
          </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
    input:{
        width:240,
        height:45,
        borderWidth:1,
        borderColor: '#ccc',
        borderRadius: 4,
        textAlign:'center'
    },
    button: {
        margin: 5,
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#cdcdcd',
    },
    buttonText:{
        fontSize:20,
    }
});
