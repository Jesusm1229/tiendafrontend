import React from 'react';
// Redireccionamientos.
import {Route, Switch} from 'react-router-dom';
// Componentes de la aplicación.
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import AdminLogin from './components/admin/AdminLogin';
import AdminSignup from './components/admin/AdminSignup';
import Addproduct from './components/adminstock/Addproduct';
import Home from './components/home/Home';
import Editproduct from './components/adminstock/Editproduct';

// Componente Funcional Routes.
const Routes = () =>(
    <Switch>
      <Route exact path = "/login" component={Login}/>
      <Route exact path = "/signup" component={Signup}/>
      <Route exact path = "/adminlogin" component={AdminLogin}/>
      <Route exact path = "/adminsignup" component={AdminSignup}/>
      <Route exact path = "/addproduct" component={Addproduct}/>
      <Route exact path = "/editproduct" component={Editproduct}/>
      <Route exact path = "/" component={Home}/>
    </Switch>
);

export default Routes;