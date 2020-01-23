import React, {useState, useEffect} from 'react';
// Componentes y Estilo makeStyle de Material-UI.
import {AppBar, Toolbar, Typography, Button, Drawer, CssBaseline, List, Divider, IconButton, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
// Icono de Tienda en el Header.
import {Menu, ChevronLeft, ChevronRight, AddCircleOutline, Home, FavoriteBorder, Timelapse, AddShoppingCart} from '@material-ui/icons';
// Redireccionamientos.
import { Link as RouterLink, withRouter} from 'react-router-dom';
// Importando los Estilos.
import {useStyles} from './styles';
// Importando el boton de menu desplegable.
import { useTheme } from '@material-ui/core/styles';
// Estilos de clsx.
import clsx from 'clsx';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';

// Creacion de Link RouterDOM para cambio de paginas sin renderizar todo nuevamente.
const MyLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

// Componente Funcional Header.
const Header = (props) =>{

  // Llamado de la Función de Estilos.
  const classes = useStyles();
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  // Hook para capturar el role del usuario logueado.
  const[role, setRole] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Evento para que este pendiente del status del role autenticado.
  useEffect(() =>{
    firebase.auth().onAuthStateChanged(response =>{
      // Si ocurre un response, hay un usuario autenticado.
      if(response){
        // Leer los datos del usuario.
        firebase.database().ref(`/users/${response.uid}`)
        .once('value')
        .then(snapshot =>{
          setRole(snapshot.val().role);
        });
      }
    });
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
              {props.user?
              <div>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <Menu />
              </IconButton>
              </div>
              : <div/>
              }
          <Button to="/" component={MyLink} color="inherit"><Home/></Button>
          <Typography variant="h6" className={classes.title}>
            Tienda E-Commerce
          </Typography>
          {props.children}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem button component={RouterLink} to="/">
              <ListItemIcon ><Home/></ListItemIcon>
              <ListItemText primary="Inicio" />
            </ListItem>
        </List>
        {role?
        <div>
        <List>
            <ListItem button component={RouterLink} to="/addproduct">
              <ListItemIcon ><AddCircleOutline/></ListItemIcon>
              <ListItemText primary="Agregar Producto" />
            </ListItem>
        </List>
        </div>
        : <div/>
        }
        <List>
            <ListItem button component={RouterLink} to="/favorites">
              <ListItemIcon ><FavoriteBorder/></ListItemIcon>
              <ListItemText primary="Ver Favoritos" />
            </ListItem>
        </List>
        <List>
            <ListItem button component={RouterLink} to="/lastproducts">
              <ListItemIcon ><Timelapse/></ListItemIcon>
              <ListItemText primary="Productos casi Agotados" />
            </ListItem>
        </List>
        <Divider/>
        <List>
            <ListItem button component={RouterLink} to="/shoppinglist">
              <ListItemIcon ><AddShoppingCart/></ListItemIcon>
              <ListItemText primary="Agregados Al Carrito" />
            </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
      </main>
    </div>
  );
}

export default withRouter(Header);