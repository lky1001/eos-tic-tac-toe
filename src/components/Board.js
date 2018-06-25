import React, { Component } from 'react';

class Board extends Component {

    constructor(props) {
        super(props);
    }

    renderCell(x, y) {
        let i = x * 3 + y;

        return (
            <div className="board-cell"
                onClick={() => this.props.handleClick(x, y)}>
                <div className="cell-text">
                    {this.props.board[i]}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderCell(0, 0)}
                    {this.renderCell(0, 1)}
                    {this.renderCell(0, 2)}
                </div>
                <div className="board-row">
                    {this.renderCell(1, 0)}
                    {this.renderCell(1, 1)}
                    {this.renderCell(1, 2)}
                </div>
                <div className="board-row">
                    {this.renderCell(2, 0)}
                    {this.renderCell(2, 1)}
                    {this.renderCell(2, 2)}
                </div>
            </div>
        )
    }
};

export default Board