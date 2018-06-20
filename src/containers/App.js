import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from '../router/Routes';
import logo from '../static/logo.svg';
import './App.scss';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <div style={{marginTop: '4rem'}}>
            <Routes />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
