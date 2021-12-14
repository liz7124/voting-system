const express = require('express');
const tools = require('./tools');
const Web3 = require('web3');

const net = require("net");
const rp = require('request-promise-native');
const NodeCache = require( "node-cache" );

const myCache = new NodeCache();

//const web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.0.30:8545'));
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.0.30:8545'));

const RC = tools.constructSmartContract(tools.getContractABI(), tools.getContractAddress());

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/registration', async (request, response) => {
    
});