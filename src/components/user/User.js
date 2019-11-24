import React from 'react';
import {IconButton, Icon, MenuItem, Menu, Avatar, makeStyles} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
// Base de Datos.
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const useStyles = makeStyles({
  avatar: {
    margin: 10,
    height: 40,
    width: 40,
  },
});

const User = ({history, user, onLogout}) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const classes = useStyles();

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
                <Avatar alt="Remy Sharp" src={user.avatar} className={classes.bigAvatar} />
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
              {/* Si es verdadero es un administrador, si es falso es un usuario del sistema*/}
               {user.role === true?
                    <div>
                        <MenuItem disabled><Icon>supervised_user_circle_icon</Icon>{user.name + " " + user.lastname}</MenuItem>
                    </div>
                    :
                    <div>
                        <MenuItem disabled><Icon>account_circle</Icon>{user.name + " " + user.lastname}</MenuItem>
                    </div>
                }
                <MenuItem onClick={handleLogout}><Icon>exit_to_app_icon</Icon>Cerrar Sesión</MenuItem>
              </Menu>
            </div>
    );
};

export default withRouter(User);