import React from 'react';
import {IconButton, Icon, MenuItem, Menu} from '@material-ui/core';
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
        if(onLogout){ 
          
          onLogout();
          // Te redirecciona a la pagina del Login.
          if(user.role)
            history.push('/adminlogin');
          else
            history.push('login');
        }
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
                {/* Si es verdadero es un administrador, si es falso es un usuario del sistema*/}
                {user.role === true?
                    <div>
                        <Icon>supervised_user_circle_icon</Icon>
                    </div>
                    :
                    <div>
                        <Icon>account_circle</Icon>
                    </div>
                }
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