import React, { Component } from 'react';
import Board from '../components/Board';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import * as Eos from 'eosjs';

// eos contract account
const CONTRACT_NAME = "tic.tac.toe";

const requiredFields = {
    accounts:[
        {blockchain:'eos', host:'127.0.0.1', port:8888}
    ]
};

const BOARD_SIZE = 9;

class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLogin: false,
            isPlay: false,
            challenger: 'inita',
            host: 'initb',
            turn: '',
            winner: '',
            board: [],
            isLoading: false
        };

        //this.eos = EOS(EOS_CONFIG);

        let scatterNetwork = {
            protocol:'http',
            blockchain: 'eos',
            host: '127.0.0.1',
            port: 8888,
            chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
        };

        let config = {
            broadcast: true,
            sign: true,
            chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
        };

        document.addEventListener('scatterLoaded', scatterExtension => {
            this.scatter = window.scatter;            
            //window.scatter = null;

            this.eos = this.scatter.eos(scatterNetwork, Eos, config);

            if (!this.scatter.identity) {
                this.setState({
                    isLogin: false
                });
            } else {
                this.setState({
                    isLogin: true
                });
            }
        });
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

                this.eos.contract(CONTRACT_NAME, requiredFields).then((contract) => {
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

                this.checkWinner(this.state.board);
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

        this.eos.contract(CONTRACT_NAME, requiredFields).then((contract) => {
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

        this.eos.contract(CONTRACT_NAME, requiredFields).then((contract) => {
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

        this.eos.contract(CONTRACT_NAME, requiredFields).then((contract) => {
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

    getScatterId = () => {
        this.scatter.getIdentity().then(id => {
            if(!id) return false;
            console.log('Possible identity', id);
            this.setState({
                isLogin: true,
                identity: id
            });
        });
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
                        <Button name="restart" onClick={this.restartGame} variant="contained" color="primary">Restart Game</Button> <br /><br />
                        {
                            this.state.turn === this.state.host &&
                            <Button name="close" onClick={this.closeGame} variant="contained" color="primary">Close Game</Button>
                        }
                    </div>
                }
                {
                    !this.state.isLogin &&
                    <div>
                        <Button name="login" onClick={this.getScatterId} variant="contained" color="primary">Login</Button>
                    </div>
                }
                {
                    this.state.isLogin && !this.state.isPlay && 
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
                                            value={this.state.host}
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
                                            value={this.state.challenger}
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