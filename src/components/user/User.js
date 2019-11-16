import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {withRouter} from 'react-router-dom';
// Base de Datos.
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const User = ({history, user, onLogout}) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Evento para abrir el menu del usuario.
  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  // Evento para cerrar el menu del usuario.
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Cierre de Sesion de Usuario.
  const handleLogout = () => {

    setAnchorEl(null);

     firebase.auth().signOut().then(() =>{
        if(onLogout) onLogout();
        // Te redirecciona a la pagina del Login.
        history.push('/login');
     });
  };

    return(
        <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Icon>account_circle</Icon>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem disabled>{user.name + " " + user.lastname}</MenuItem>
                <MenuItem onClick={handleLogout}><ExitToAppIcon/>Cerrar Sesión</MenuItem>
              </Menu>
            </div>
    );
};

export default withRouter(User);