const express = require('express');
const tools = require('./tools');
const Web3 = require('web3');
//const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const dir = "/home/lizz/MyProjects/voting-system/"

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const RC = tools.constructSmartContract(tools.getContractABI(), tools.getContractAddress());

const app = express();
//app.use(express.json());
//app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request,response) {
    response.render('pages/registration');
});

app.post('/registration', async (request, response) => {
    var addr = request.body.address;
    var pwd = request.body.password;
    try {
        let tx = await RC.methods.registerVoter(addr).send({
            from: addr,
            gas: 1000000
        })
        console.log(tx);
        response.send("<p id='accountAddress'>Successfully Registered: "+addr+"</p>");
    } catch(err) {
        console.log(err);
    }
});

app.get('/login',function(request,response) {
    response.render('pages/login');
});

app.post('/auth', async (request, response) => {
    var addr = request.body.address;
    var pwd = request.body.password;
    var signature = request.body.signature;

    try {
        RC.methods.getVoter(25,signature).call({from: addr}).then(function(res) {
            console.log(res);
            if(res == true) {
                response.redirect('/voting');
            } else {
                response.send();
            }
        });
    } catch(err) {
        console.log(err);
    }
});

app.get('/voting', async (request, response)=> {
    let candidateCounter = await RC.methods.candCounter.call().call();
    var _candObj = [];
    for(i=1; i <= candidateCounter; i++) {
        let _candidates = await RC.methods.candidates(i).call();
        _candObj[i-1] = {id:_candidates['id'],name:_candidates['name'],voteCount:_candidates['voteCount']};
    }
    response.render('pages/voting', {
        candList:_candObj,
        
    });
});

app.post('/vote', async function (request, response) {
    var candId = request.body.candSelect;
    var addr = '0x6828934Ab026a2C1295Fa75716D9B1B0344092DE'; //for testing
    try {
        let tx = await RC.methods.vote(candId).send({
            from: addr,
            gas: 1000000
        })
        console.log(tx);
        response.redirect('/voting');
    } catch(err) {
        console.log(err);
    }
});

app.listen(3000, async(request, response) => {
    console.log("I'm listening");
});