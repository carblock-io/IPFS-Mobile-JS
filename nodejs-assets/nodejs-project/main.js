const rn_bridge = require('rn-bridge');
const path = require('path');
const FileNode = require('./fileNode');
rn_bridge.channel.on('message', (msg) => {
    dealWithMsg(msg);
});

rn_bridge.channel.send(JSON.stringify({msgType:'init'}));

let fileNode = null;

const dealWithMsg = function(msg){
  let msgObj = JSON.parse(msg);
  if(msgObj.msgType === "tryOpenRep"){
      let ipfsRepoPath = path.join(msgObj.rootPath,"ipfs");
      console.log(`tryOpenRep:${ipfsRepoPath}`);
      fileNode = new FileNode({
          repo: ipfsRepoPath,
          init: true,
          pass: 'f9bb081820125cf55e0d1bc96493d292ac0be0ce68ea05051a20d3200f28563c',
      });
      fileNode.on('ready',()=>{
          rn_bridge.channel.send(JSON.stringify({msgType:'ready'}));
      });
      fileNode.on('error',e=>{
        console.log(`IPFS ERROR:${e}`);
      });
  }
  else if(msgObj.msgType === "addText"){
      console.log(msgObj);
      fileNode.addTxt(msgObj.txt,(e,hash)=>{
        if(!e){
            rn_bridge.channel.send(JSON.stringify({msgType:'addTxtSuccess',hash:hash}));
        }
        else{
            console.log(e);
        }
      });
  }
  else if(msgObj.msgType === 'getHash'){
      fileNode.getTxt(msgObj.txt,(e,r)=>{
          console.log(e);
          console.log(r.toString('utf8'));
          rn_bridge.channel.send(JSON.stringify({msgType:'getHashSuccess',data:r.toString('utf8')}));
      })
      // rn_bridge.channel.send(JSON.stringify({msgType:'getHashSuccess',data:data}));
  }
};

process.on('uncaughtException', (err) => {
    console.log(err);
});
