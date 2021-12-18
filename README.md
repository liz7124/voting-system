# Blockchain-based Voting System

### Setup
```
truffle init
truffle create contract voting #create contract file
truffle create test voting #create test file
```
> change ```dir``` variable in src/js/tools.js to your directory path.

### Run
1. Install dependencies in ```setup.sh```
2. Run ```ganache-cli -m dongseo```
3. Run ```truffle migrate --reset```
4. Run server ```node src/js/server.js```
5. Open ```localhost:3000``` from your browser
6. In user side, user need to sign a nounce from the server. User can sign by run a program ```node src/js/user.js```. Choose sign a code, then enter the nounce value from the server. Copy signature value and put it when user try to login to the server.
