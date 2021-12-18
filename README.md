# Blockchain-based Voting System

### Setup
```
truffle init
truffle create contract voting #create contract file
truffle create test voting #create test file
```
> change ```dir``` variable in src/js/tools.js to your directory path.

### Run
1. Install dependencies in setup.sh
2. Run ```ganache-cli -m dongseo```
3. Run ```truffle migrate --reset```
4. Run ```node src/js/server.js```
5. Open localhost:3000 in your browser
