const crypto = require("crypto"), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");

class Block {
    constructor(timestamp = "", data = []) {
        this.timestamp = timestamp
        this.data = data
        this.hash = this.getHash()
        this.prevHash = ""
        this.nonce = 0
    }

    getHash() {
        return SHA256(this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce)
    }

    mine(difficulty) {
        while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
            this.nonce++;
            this.hash = this.getHash();
        }
    }
}

class Blockchain {
    constructor() {
        let genesisBlock = new Block(
            Math.floor(Date.now() / 1000),
            JSON.stringify([])
        )
        this.chain = [genesisBlock]
        this.difficulty = 2;
    }
    
    getSize() {
        return this.chain.length;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(block) {
        block.prevHash = this.getLastBlock().hash;
        block.hash = block.getHash();
        block.mine(this.difficulty)
        this.chain.push(Object.freeze(block));
    }

    isValid() {
        let size = this.getSize()
        for(let i = 1 ; i < size ; i++) {
            if(this.chain[i].hash !== this.chain[i].getHash() || this.chain[i].prevHash !== this.chain[i - 1].hash) {
                return false
            }
        }
        return true
    }
}

let blockchain = new Blockchain()
let block1 = new Block(
    Math.floor(Date.now() / 1000),
    [
        {
            "from": "Ben",
            "to": "Jo",
            "amount": 10
        },
        {
            "from": "Jo",
            "to": "Ben",
            "amount": 5
        }
    ]
)
blockchain.addBlock(block1)
let block2 = new Block(
    Math.floor(Date.now() / 1000),
    [
        {
            "from": "Ben",
            "to": "Jo",
            "amount": 10
        },
        {
            "from": "Jo",
            "to": "Ben",
            "amount": 5
        }
    ]
)
blockchain.addBlock(block2)
console.log(blockchain)
if(blockchain.isValid()) {
    console.log('oui')
}
else {
    console.log('non')
} 
