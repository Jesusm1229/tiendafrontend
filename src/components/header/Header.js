import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
// Icono de Tienda en el Header.
import StorefrontIcon from '@material-ui/icons/Storefront';
// Para el manejo de Links de tipo componentes.
import { Link as RouterLink } from 'react-router-dom';
// Icono para el boton de registro.
import HowToRegIcon from '@material-ui/icons/HowToReg';
// Icono para el boton de login.
import VpnKeyIcon from '@material-ui/icons/VpnKey';

// Creacion de Link RouterDOM para cambio de paginas sin renderizar todo nuevamente.
const MyLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

// Estilos del header.
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

// Parametro props es el componente del usuario.
const Header = (props) =>{

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <StorefrontIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Tienda E-Commerce
          </Typography>
          <Button to="/login" component={MyLink} color="inherit"><VpnKeyIcon/>Login</Button>
          <Button to="/signup" component={MyLink} color="inherit"><HowToRegIcon/>Signup</Button>
          {props.children}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;