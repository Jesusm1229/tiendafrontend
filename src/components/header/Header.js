import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// Icono de Tienda en el Header.
import StorefrontIcon from '@material-ui/icons/Storefront';

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
const Header = (props, showMe) =>{

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
          {props.children}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;