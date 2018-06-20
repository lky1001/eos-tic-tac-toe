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

## create ABI
```
$ eosiocpp -o tic_tac_toe.wast tic_tac_toe.cpp
```

## contract compile
```
$ eosiocpp -g tic_tac_toe.abi tic_tac_toe.cpp
```

## create deploy account
```
$ cleos create account eosio tic.tac.toe EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
```

## contract deploy on tic.tac.toe account
```
$ cleos set contract tic.tac.toe tic_tac_toe
```

## create test player account
```
$ cleos create account eosio inita EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

$ cleos create account eosio initb EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
```