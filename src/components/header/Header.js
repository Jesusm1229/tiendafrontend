import React from 'react';
// Componentes y Estilo makeStyle de Material-UI.
import {AppBar, Toolbar, Typography, Button} from '@material-ui/core';
// Icono de Tienda en el Header.
import StorefrontIcon from '@material-ui/icons/Storefront';
// Redireccionamientos.
import { Link as RouterLink, withRouter} from 'react-router-dom';
// Importando los Estilos.
import {useStyles} from './styles';

// Creacion de Link RouterDOM para cambio de paginas sin renderizar todo nuevamente.
const MyLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

// Componente Funcional Header.
const Header = (props) =>{

  // Llamado de la Función de Estilos.
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Button to="/" component={MyLink} color="inherit"><StorefrontIcon/></Button>
          <Typography variant="h6" className={classes.title}> Tienda E-Commerce </Typography>
          {props.children}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(Header);