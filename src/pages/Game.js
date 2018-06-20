import React, { Component } from 'react';
import EOS from 'eosjs';

// eos contract account
const CONTRACT_NAME = "tic.tac.toe";
// eos contract execute account, pair with keyProvider
const CONTRACT_SENDER = "tic.tac.toe";

const EOS_CONFIG = {
    // private key
    keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
    httpEndpoint: 'http://127.0.0.1:8888'
};

class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.eos = EOS(EOS_CONFIG);
    }

    createGame = () => {
        let host = 'initb';
        let challenger = 'inita';

        this.eos.contract(CONTRACT_NAME).then((contract) => {
            contract.create(
                challenger,
                host,
                { 
                    authorization: [
                        challenger,
                         host
                    ]
                } 
            ).then((res) => { alert(res); })
            .catch((err) => { console.log(err) });
        });
    }

    render() {
        return(
            <div>
                Tic Tac Toe<br /><br />
                <button name="start" onClick={this.createGame}>Create Game</button>
            </div>
        );
    };
};

export default Game;