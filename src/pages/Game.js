import React, { Component } from 'react';
import Button from "@material-ui/core/Button"
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
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
            isPlay: false,
            challenger: 'inita',
            host: 'initb',
            turn: '',
            winner: '',
            board: [],
            isLoading: false
        };

        this.eos = EOS(EOS_CONFIG);
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    getGameInfo = () => {
        this.eos.getTableRows(true, CONTRACT_NAME, this.state.host, 'games').then((data) => {
            let board = [];

            if (!data.rows) {
                for (let i = 0; i < BOARD_SIZE; i++) {
                    board[i] = 0;
                }

                this.setState({
                    isPlay: false,
                    challenger: '',
                    host: '',
                    turn: '',
                    winner: '',
                    board: board
                });

                let host = this.state.host;
                let challenger = this.state.challenger;

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
                    ).then((res) => { 
                        this.setState({
                            isPlay: true,
                            isLoading: false
                        });
                    })
                    .catch((err) => { console.log(err) });
                });
            } else {
                for (let i = 0; i < BOARD_SIZE; i++) {
                    board.push(data.rows[0].board[i]);
                }

                this.setState({
                    isPlay: true,
                    challenger: data.rows[0].challenger,
                    host: data.rows[0].host,
                    turn: data.rows[0].turn,
                    winner: data.rows[0].winner,
                    board: board,
                    isLoading: false
                });
            }
            
            console.log(data);
        }).catch((err) => { console.log(err) });;
    };

    createGame = () => {
        this.setState({
            isLoading:true
        });

        this.getGameInfo();
    }

    render() {
        return(
            <div>
                {
                    this.state.isLoading && <div><CircularProgress /> &nbsp;&nbsp;Now Loading...<br/><br/></div>
                }
                Tic Tac Toe
                {
                    this.state.isPlay && 
                    <div>
                        <br />
                        Host : {this.state.host}, &nbsp; Challenger : {this.state.challenger} <br/><br/>
                        Turn : {this.state.turn} <br/><br/>
                        <div className="game-board">
                            {this.state.board[0]}&nbsp;
                            {this.state.board[1]}&nbsp;
                            {this.state.board[2]}<br/>
                            {this.state.board[3]}&nbsp;
                            {this.state.board[4]}&nbsp;
                            {this.state.board[5]}<br/>
                            {this.state.board[6]}&nbsp;
                            {this.state.board[7]}&nbsp;
                            {this.state.board[8]}
                        </div>
                    </div>
                }
                {
                    !this.state.isPlay && 
                    <div>
                        <form className="player-info-container" noValidate autoComplete="off">
                            <div className="field-margin">
                                <Grid container spacing={8} alignItems="flex-end">
                                    <Grid item>
                                        <AccountCircle />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            required
                                            id="host"
                                            label="Host"
                                            placeholder="host account"
                                            className="player-field"
                                            onChange={this.handleChange('host')}
                                            value="initb"
                                            margin="normal" />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={8} alignItems="flex-end">
                                    <Grid item>
                                        <AccountCircle />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            required
                                            id="challenger"
                                            label="Challenger"
                                            placeholder="challenger account"
                                            className="player-field"
                                            onChange={this.handleChange('challenger')}
                                            value="inita"
                                            margin="normal" />
                                    </Grid>
                                </Grid>
                            </div>
                        </form>
                        <Button name="start" onClick={this.createGame} variant="contained" color="primary">Create Game</Button>
                    </div>
                }
            </div>
        );
    };
};

export default Game;