import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { NavLink } from 'react-router-dom';
import Routes from '../router/Routes';
import logo from '../static/logo.svg';
import { Home } from '../pages' 
import './App.scss';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <AppBar position="static">
            <Toolbar>
              <IconButton
                    component={NavLink}
                    to="/"
                    color="inherit">
                <Home />
              </IconButton>
            </Toolbar>
          </AppBar>

          <div style={{marginTop: '4rem'}}>
            <Routes />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
