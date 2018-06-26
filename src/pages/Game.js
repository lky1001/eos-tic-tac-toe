import React, { Component } from 'react';
import Board from '../components/Board';
import Button from '@material-ui/core/Button';
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

            if (!data.rows || data.rows.length === 0) {
                for (let i = 0; i < BOARD_SIZE; i++) {
                    board[i] = 0;
                }

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
                            challenger: challenger,
                            host: host,
                            turn: host,
                            winner: '',
                            board: board,
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

                checkWinner(this.state.board);
            }
            
            console.log(data);
        }).catch((err) => { 
            console.log(err);
            this.setState({
                isLoading: false
            });
        });
    };

    createGame = () => {
        this.setState({
            isLoading:true
        });

        this.getGameInfo();
    };

    move = (x, y) => {
        let i = x * 3 + y;

        this.setState({
            isLoading: true
        });

        let move = {
            challenger: this.state.challenger,
            host: this.state.host,
            by: this.state.turn,
            mvt: {
                row: x,
                column: y
            }
        };

        this.eos.contract(CONTRACT_NAME).then((contract) => {
            contract.move(
                this.state.challenger,
                this.state.host,
                this.state.turn,
                { row: x, column: y },
                { authorization: [move.challenger, move.host,move.by] } 
            ).then((res) => { 
                this.setState({ 
                    isLoading: false 
                });

                this.getGameInfo();
            }).catch((err) => { 
                console.log(err);
                this.setState({
                    isLoading: false
                });
            });
        });
    };

    restartGame = () => {
        this.setState({
            isLoading: true
        });

        this.eos.contract(CONTRACT_NAME).then((contract) => {
            contract.restart(
              this.state.challenger,
              this.state.host,
              this.state.host,
              { authorization: [this.state.challenger, this.state.host,this.state.host] }
            ).then((res) => { 
                this.setState({ 
                    isLoading: false 
                });

                this.getGameInfo();
            }).catch((err) => { 
                console.log(err);
                this.setState({
                    isLoading: false
                });
            });
        });
    };

    closeGame = () => {
        this.setState({
            isLoading: true
        });

        this.eos.contract(CONTRACT_NAME).then((contract) => {
            contract.close(
                this.state.challenger,
                this.state.host,
                { authorization: [this.state.challenger, this.state.host,this.state.host] }
            ).then((res) => { 
                this.setState({ 
                    isLoading: false,
                    isPlay: false
                });
            }).catch((err) => { 
                console.log(err);
                this.setState({
                    isLoading: false
                });
            });
        });
    };

    checkWinner = (board) => {
        // todo
    };

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
                            <Board board={this.state.board}
                                handleClick={this.move} />
                        </div>
                        <Button name="start" onClick={this.restartGame} variant="contained" color="primary">Restart Game</Button> <br /><br />
                        {
                            this.state.turn === this.state.host &&
                            <Button name="start" onClick={this.closeGame} variant="contained" color="primary">Close Game</Button>
                        }
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