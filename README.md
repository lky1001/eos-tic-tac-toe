# eos-tic-tac-toe
eos tic tac toe example with react


## create react project from create-react-app
- https://github.com/facebook/create-react-app

## install dependencies
```
$ npm install
```

## run server
```
$ npm start
```

## build production
```
$ npm run build
```

## contract compile
```
$ eosiocpp -o tic_tac_toe.wast tic_tac_toe.cpp
$ eosiocpp -g tic_tac_toe.abi tic_tac_toe.cpp
```

## contract deploy on tic.tac.toe account
```
$ cleos set contract tic.tac.toe tic_tac_toe
``` 