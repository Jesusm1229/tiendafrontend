import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import CssBaseLine from '@material-ui/core/CssBaseLine';

import Header from './components/header/Header';
import User from './components/user/User';
import Routes from './Routes';

function App() {
  return (
    <Router>

      <CssBaseLine/>

      <Header>

        <User/>

      </Header>

      <Routes/>
 
    </Router>
  );
}

export default App;
