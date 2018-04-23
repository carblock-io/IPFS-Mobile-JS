const IPFS = require('ipfs');
const EventEmitter = require('events');
class FileNode extends EventEmitter{
    constructor(options) {
        super();
        this._ipfs = null;
        this._options = options;
        this._start()
    }

    _start() {
        const self = this;

        this._ipfs = new IPFS(this._options);
        this.addSuperNode();
        this._ipfs.on('error', (e) => {
            console.log(`IPFS ERROR : ${e}`);
            self.emit('error',e);
        });

        this._ipfs.on('ready', () => {
            self.getIPFSId();
            self.getIPFSPeerInfo();
            self.emit('ready');
        })
    }

    getIPFSPeerInfo(){
        setInterval(async () => {
            const networkPeers = await this._ipfs.swarm.peers();
            console.log(`IPFS Online: ${Date.now()} - ${this._ipfs.isOnline()}`);
            console.log(`Network Peers: ${networkPeers.length}`);
            networkPeers.forEach(function(p) {
                console.log(`Network PeerId: ${p.peer.id.toB58String()}`)
            });
            console.log(`--------------------------------------------------`);
        }, 5000);
    };

    addSuperNode(){
        this._ipfs.bootstrap.add('/ip4/47.75.72.6/tcp/4001/ipfs/QmXXyAoF2JgdF4YT1B238BQauPRmiFrim6PNRcrZHXkGh2');
        // this._ipfs.swarm.connect('/ip4/47.75.72.6/tcp/4001/ipfs/QmXXyAoF2JgdF4YT1B238BQauPRmiFrim6PNRcrZHXkGh2',()=>{
        //     console.log("链接节点成功!");
        // })
    }

    async getIPFSId(){
        let id = await this._ipfs.id();
        console.log(`--------------------------------------------------`);
        console.log(`IPFS ID INFO:`);
        console.log(id);
        console.log(`--------------------------------------------------`);
    }

    getIPFSVersion(cb){
        this._ipfs.version(cb);
    }

    addTxt(txt,cb){
        console.log(`try add :${txt}`);
        let self = this;
        this._ipfs.files.add({
            path: 'demon.txt',
            content: Buffer.from(txt)
        }, (err, filesAdded) => {
            if (!err) {
                console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash);
                console.log(`local hash : ${filesAdded[0].hash}`);
                self.catTxt(filesAdded[0].hash);
                cb(null,filesAdded[0].hash);
            }
            else{
                console.log(err);
                cb(err,null);
            }
        })
    }

    async catTxt(hash){
        console.log(`try cat hash:${hash}`);
        let data = await this._ipfs.files.cat(hash);
        console.log(`File content:${data}`);
        return data
    }

    getTxt(hash,cb){
        this._ipfs.files.cat(hash,cb)
    }
}

module.exports = FileNode;