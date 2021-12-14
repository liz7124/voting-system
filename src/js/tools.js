const EthCrypto = require('eth-crypto');
const crypto = require('crypto');
const fs = require('fs');
const Web3 = require('web3');

// for symmetric encryption and decryption
const algorithm = 'aes256';
const inputEncoding = 'utf8';
const outputEncoding = 'hex';

//path
const userPath = '../assets/user.json';
const serverPath = '../assets/vote-server.json';
const contractPath = '../assets/voting-contract.json';
const contractABIPath = '../../build/contracts/voting.json';

//endpoints
//const gatewayEndpoint = 'http://192.168.0.32:4000/newfirmwareupdate';

//web3
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
//const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.0.30:8545'));

var self = module.exports = {
    /**
     * Read JSON file and return the contents of the file in object.
     * Also convert the address of Ethereum (if any) to checksum format.
     * @param {string} path     path to the JSON file.
     */
    readFile: function (path) {
        let data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    },
    /**
     * Construct a web3 object of the smart contract.
     * @param {string} abi       the ABI of the contract.
     * @param {string} address   the address of the deployed contract.
     */
    constructSmartContract: function (abi, address) {
        return new web3.eth.Contract(abi, address);
    },
    /**
     * Hash the payload.
     * @param {string} payload  the payload to be hashed.
     */
    hashPayload: function (payload) {
        return EthCrypto.hash.keccak256(payload);
        //var hash = web3.utils.keccak256(web3.eth.abi.encodeParameters(payload));
        //return hash;
    },
    /**
     * Add prefixed to the hash messages
     * @param {string} hash hash messages. 
     */
    prefixedHash: function (hash) {
        return EthCrypto.hash.keccak256("NewFirmwareUpdate:"+hash);
    },
    /**
     * Encrypt the payload with destination public key.
     * @param {string} payloadHash      Hash of payload to be signed.
     * @param {hex} sourcePrivateKey    Key used to sign.
     */
    signPayload: function (payloadHash, sourcePrivateKey) {
        return EthCrypto.sign(sourcePrivateKey, payloadHash);
    },
    /**
     * Recover the ethereum address from given signature.
     * @param {string} signature    the signature.
     * @param {string} hash         the hash pf the payload tied to the signature.
     */
    recoverAddress: function (signature, hash) {
        return EthCrypto.recover(signature, hash);
    },
    /**
     * Convert string to byte (for smart contract).
     * We can store more efficiently in bytes rather than in string
     * @param {*} string    string to be converted.
     */
    convertStringToByte: function (string) {
        return web3.utils.fromAscii(string);
    },
    /**
     * Convert byte to string (for smart contract).
     * @param {*} byte      byte to be converted.
     */
    convertByteToString: function (byte) {
        return web3.utils.toAscii(byte);
    },
    /**
     * Encrypt the payload with destination public key.
     * @param {string} payload          Payload to be encrypted.
     * @param {hex} destPublicKey       Key used to encrypt.
     */
    encryptPayload: async function (payload, destPublicKey) {
        const encryptedPayload = await EthCrypto.encryptWithPublicKey(destPublicKey, payload);
        return EthCrypto.cipher.stringify(encryptedPayload);
    },
    /**
     * Decrypt payload using source private key.
     * @param {string} encryptedPayload the encrypted payload to be decrypted.
     * @param {hex} privateKey          the key used to decrypt.
     */
    decryptPayload: async function (encryptedPayload, privateKey) {
        const encrypted = EthCrypto.cipher.parse(encryptedPayload);
        return await EthCrypto.decryptWithPrivateKey(privateKey, encrypted);
    },
    /**
     * Encrypt the message using symmetric encryption.
     * @param {hex} key         Key used to encrypt.
     * @param {string} data     Payload to be encrypted.
     */
    encryptSymmetrically(key, data) {
        let cipher = crypto.createCipher(algorithm, key);
        let ciphered = cipher.update(data, inputEncoding, outputEncoding);
        ciphered += cipher.final(outputEncoding);
        return ciphered;
    },
    /**
     * Decrypt the message using symmetric encryption.
     * @param {hex} key             Key used to decrypt.
     * @param {string} ciphered     Payload to be decrypted.
     */
    decryptSymmetrically(key, ciphered) {
        let decipher = crypto.createDecipher(algorithm, key);
        let deciphered = decipher.update(ciphered, outputEncoding, inputEncoding);
        deciphered += decipher.final(inputEncoding);
        return deciphered;
    },
//add verify

//-------------------GET---------------------------------------//
    /**
     * Get user private key from ganache configuration.
     */
    getUserPrivateKey: function () {
        let obj = self.readFile(userPath);
        return obj.privateKey;
    },
    /**
     * Get user public key from ganache configuration.
     */
    getUserPublicKey: function () {
        let obj = self.readFile(userPath);
        return EthCrypto.publicKeyByPrivateKey(obj.privateKey);
    },
    /**
     * Get user address from ganache configuration.
     */
    getUserAddress: function() {
        let obj = self.readFile(userPath);
        return web3.utils.toChecksumAddress(obj.address);
    },

    /**
     * Get server private key from ganache configuration.
     */
    getServerPrivateKey: function () {
        let obj = self.readFile(serverPath);
        return obj.privateKey;
    },
    /**
     * Get server public key from ganache configuration.
     */
    getServerPublicKey: function () {
        let obj = self.readFile(serverPath);
        return EthCrypto.publicKeyByPrivateKey(obj.privateKey);
    },
    /**
     * Get server address from ganache configuration.
     */
    getServerAddress: function() {
        let obj = self.readFile(serverPath);
        return web3.utils.toChecksumAddress(obj.address);
    },
    /**
     * Get contract address from ganache after 'truffle deploy'.
     */
    getContractAddress: function () {
        let obj = self.readFile(contractPath);
        return web3.utils.toChecksumAddress(obj.address);
    },
    /**
     * Parsing the local contract ABI from truffle.
     * in live network, the ABI can be queried from etherscan.io
     */
    getContractABI: function () {
        let obj = self.readFile(contractABIPath);
        return obj.abi;
    },
    /**
     * Get Gateway URL endpoint for manufacturer send the firmware metadata
     */
    /*getGatewayEnpoint: function () {
        return gatewayEndpoint;
    }*/
}