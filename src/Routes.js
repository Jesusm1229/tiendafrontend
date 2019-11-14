import React from 'react';
import {Route, Switch} from 'react-router-dom';

import Login from './components/login/Login';
import Signup from './components/signup/Signup';

const Routes = () =>(

    <Switch>
      <Route exact path = "/login" component={Login}/>
      <Route exact path = "/signup" component={Signup}/>
    </Switch>

);

export default Routes;