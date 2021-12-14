const express = require('express');
const tools = require('./tools');
const Web3 = require('web3');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const dir = "/home/lizz/MyProjects/voting/"

const net = require("net");
//const rp = require('request-promise-native');
//const NodeCache = require( "node-cache" );

//const myCache = new NodeCache();

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
//const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.0.30:8545'));

const RC = tools.constructSmartContract(tools.getContractABI(), tools.getContractAddress());

const app = express();
//app.use(express.json());
//app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(request,response) {
    response.sendFile(path.join(dir+'src/login.html'));
});

app.post('/registration', async (request, response) => {
    
});

app.listen(3000, async(request, response) => {
    console.log("I'm listening");
});