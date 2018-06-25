import React, { Component } from 'react';
import Button from "@material-ui/core/Button"
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

const BOARD_SIZE = 9;

class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            challenger: '',
            host: '',
            trun: '',
            winner: '',
            board: [],
            isLoading: false
        };

        this.eos = EOS(EOS_CONFIG);
    }

    componentDidMount() {
        this.setState({
            state:true
        });
        this.getGameInfo();
    }

    getGameInfo = () => {
            this.eos.getTableRows(true, 'tic.tac.toe', 'initb','games').then((data) => {
                let board = [];

                if (!data.rows) {
                    for (let i = 0; i < BOARD_SIZE; i++) {
                        board[i] = 0;
                    }

                    this.setState({
                        challenger: '',
                        host: '',
                        trun: '',
                        winner: '',
                        board: board,
                        isLoading: false
                    });
                } else {
                    for (let i = 0; i < BOARD_SIZE; i++) {
                        board.push(data.rows[0].board[i]);
                    }

                    this.setState({
                        challenger: data.rows[0].challenger,
                        host: data.rows[0].host,
                        trun: data.rows[0].turn,
                        winner: data.rows[0].winner,
                        board: board,
                        isLoading: false
                    });
                }
                
                console.log(data);
            });
    };

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
                <Button name="start" onClick={this.createGame} variant="contained" color="primary">Create Game</Button>
            </div>
        );
    };
};

export default Game;