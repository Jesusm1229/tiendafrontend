import React from 'react';
import {Route, Switch} from 'react-router-dom';

import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import AdminLogin from './components/admin/AdminLogin';
import AdminSignup from './components/admin/AdminSignup';

const Routes = () =>(

    <Switch>
      <Route exact path = "/login" component={Login}/>
      <Route exact path = "/signup" component={Signup}/>
      <Route exact path = "/adminlogin" component={AdminLogin}/>
      <Route exact path = "/adminsignup" component={AdminSignup}/>
    </Switch>

);

export default Routes;