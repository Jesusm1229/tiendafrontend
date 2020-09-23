import React, {useState, useEffect} from 'react';
// Componentes y Estilo makeStyle de Material-UI.
import {AppBar, Toolbar, Typography, Button, Drawer, CssBaseline, List, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Badge, InputBase } from '@material-ui/core';
// Icono de Tienda en el Header.
import {Menu, ChevronLeft, ChevronRight, AddCircleOutline, Home, Timelapse, ShoppingCartSharp, Favorite, Search} from '@material-ui/icons';
// Importando colores.
import { orange, red, blue } from '@material-ui/core/colors';
// Redireccionamientos.
import { Link as RouterLink, useLocation} from 'react-router-dom';
// Importando los Estilos.
import {useStyles} from './styles';
// Importando el boton de menu desplegable.
import { useTheme } from '@material-ui/core/styles';
// Estilos de clsx.
import clsx from 'clsx';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Redireccionamientos.
import { withRouter } from 'react-router-dom';
// Encriptar las busquedas.
import { Base64 } from 'js-base64';

// Componente Funcional Header.
const Header = (props) =>{

  // Llamado de la Función de Estilos.
  const classes = useStyles();
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  // Hook para capturar el role del usuario logueado.
  const[role, setRole] = useState(null);

  // Hook para saber si hay un usuario logueado.
  const[userin, setUserin] = useState(false);

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
        setUserin(true);
        firebase.database().ref(`/users/${response.uid}`)
        .once('value')
        .then(snapshot =>{
          setRole(snapshot.val().role);
        });
      }
    });
  }, []);

  const [busqueda, setbusqueda] = useState();

  function HeaderView() {
    let location = useLocation();
    return location.pathname
  }

  const handleChangeSearch = (e) => {

      console.log(e.target.value);

      // Transforma el caracter ingresado a código ASCII.
      var key = e.target.value.charCodeAt(e.target.value.length - 1);
      console.log(key);

      // Validación del campo Nombre y Descripción, solo se podrán introducir letras.
      if( key !== 32 && (key < 97 || key > 122)) 
          return;

      setbusqueda(e.target.value);
  }

  const handleEnterKey = (e) => {

      if(e.key === 'Enter' && busqueda === '')
          return;

      if(e.key === 'Enter' && busqueda !== undefined){
          props.history.push('/search/results/' + Base64.encode(busqueda));
      }
  }

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
          <Button to="/" component={React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />)} color="inherit"><Home/></Button>
          <Typography variant="h6" className={classes.title}>
            Tienda Medina y Gonzalez
          </Typography>
            {HeaderView() === '/login' || HeaderView() === '/signup' || HeaderView() === '/adminlogin' || HeaderView() === '/adminsignup' || HeaderView() === '/lastproducts' 
            || HeaderView() === '/favorites' || HeaderView() === '/shoppingcart' || HeaderView() === '/addproduct' || HeaderView() === '/editproduct' || HeaderView() === '/changeavatar' ?
                <div> </div>
                : <div> 
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                          <Search />
                        </div>
                        <InputBase onChange={handleChangeSearch} onKeyDown={handleEnterKey}
                          placeholder="Busqueda..."
                          classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                          }}
                          inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                </div>
            }
          
          {props.user?
              <div>
                  <Button to="/shoppingcart" component={React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />)} color="inherit">
                  <Badge badgeContent={props.cantidad} color="secondary" max={999}>
                    <ShoppingCartSharp />
                  </Badge>
                  </Button>

                  <Button to="/lastproducts" component={React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />)} color="inherit"><Timelapse style={{ color: orange[500] }} /></Button>
                  <Button to="/favorites" component={React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />)} color="secondary"><Favorite /></Button>
              </div>
              : <div/>
          }
          
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
        {role && userin?
        <div>
        <List>
            <ListItem button component={RouterLink} to="/addproduct">
              <ListItemIcon ><AddCircleOutline style={{ color: blue[500] }}/></ListItemIcon>
              <ListItemText primary="Agregar Producto" />
            </ListItem>
        </List>
        </div>
        : <div/>
        }
        <List>
            <ListItem button component={RouterLink} to="/lastproducts">
              <ListItemIcon ><Timelapse style={{ color: orange[500] }}/></ListItemIcon>
              <ListItemText primary="Productos casi Agotados" />
            </ListItem>
        </List>
        {userin?
        <div>
        <List>
            <ListItem button component={RouterLink} to="/favorites">
              <ListItemIcon ><Favorite style={{ color: red[500] }}/></ListItemIcon>
              <ListItemText primary="Ver Favoritos" />
            </ListItem>
        </List>
        <Divider/>
        <List>
            <ListItem button component={RouterLink} to="/shoppingcart">
              <ListItemIcon ><ShoppingCartSharp/></ListItemIcon>
              <ListItemText primary="Agregados Al Carrito" />
            </ListItem>
        </List>
        <Divider/>
        </div>
        : <div/>
        }
        <List>
            <ListItem button component={RouterLink} to="/">
              <ListItemIcon>
              <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" width="34" height="34" viewBox="0 0 24 24"><path d="M18,8H8V18H6V8A2,2 0 0,1 8,6H18V8M14,2H4A2,2 0 0,0 2,4V14H4V4H14V2M22,12V20A2,2 0 0,1 20,22H12A2,2 0 0,1 10,20V12A2,2 0 0,1 12,10H20A2,2 0 0,1 22,12M20,15H17V12H15V15H12V17H15V20H17V17H20V15Z" /></svg>
              </ListItemIcon>
              <ListItemText primary="Todas las Categorias" />
            </ListItem>
        </List>
        <List>
            <ListItem button component={RouterLink} to="/category/Pescaderia">
              <ListItemIcon>
              <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" width="34" height="34" viewBox="0 0 24 24"><path d="M12,20L12.76,17C9.5,16.79 6.59,15.4 5.75,13.58C5.66,14.06 5.53,14.5 5.33,14.83C4.67,16 3.33,16 2,16C3.1,16 3.5,14.43 3.5,12.5C3.5,10.57 3.1,9 2,9C3.33,9 4.67,9 5.33,10.17C5.53,10.5 5.66,10.94 5.75,11.42C6.4,10 8.32,8.85 10.66,8.32L9,5C11,5 13,5 14.33,5.67C15.46,6.23 16.11,7.27 16.69,8.38C19.61,9.08 22,10.66 22,12.5C22,14.38 19.5,16 16.5,16.66C15.67,17.76 14.86,18.78 14.17,19.33C13.33,20 12.67,20 12,20M17,11A1,1 0 0,0 16,12A1,1 0 0,0 17,13A1,1 0 0,0 18,12A1,1 0 0,0 17,11Z" /></svg>
              </ListItemIcon>
              <ListItemText primary="Pescaderia" />
            </ListItem>
        </List>
        <List>
            <ListItem button component={RouterLink} to="/category/Carniceria">
              <ListItemIcon>
              <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" width="34" height="34" viewBox="0 0 24 24"><path d="M9.5,9A1.5,1.5 0 0,0 8,10.5A1.5,1.5 0 0,0 9.5,12A1.5,1.5 0 0,0 11,10.5A1.5,1.5 0 0,0 9.5,9M14.5,9A1.5,1.5 0 0,0 13,10.5A1.5,1.5 0 0,0 14.5,12A1.5,1.5 0 0,0 16,10.5A1.5,1.5 0 0,0 14.5,9M12,4L12.68,4.03C13.62,3.24 14.82,2.59 15.72,2.35C17.59,1.85 20.88,2.23 21.31,3.83C21.62,5 20.6,6.45 19.03,7.38C20.26,8.92 21,10.87 21,13A9,9 0 0,1 12,22A9,9 0 0,1 3,13C3,10.87 3.74,8.92 4.97,7.38C3.4,6.45 2.38,5 2.69,3.83C3.12,2.23 6.41,1.85 8.28,2.35C9.18,2.59 10.38,3.24 11.32,4.03L12,4M10,16A1,1 0 0,1 11,17A1,1 0 0,1 10,18A1,1 0 0,1 9,17A1,1 0 0,1 10,16M14,16A1,1 0 0,1 15,17A1,1 0 0,1 14,18A1,1 0 0,1 13,17A1,1 0 0,1 14,16M12,13C9.24,13 7,15.34 7,17C7,18.66 9.24,20 12,20C14.76,20 17,18.66 17,17C17,15.34 14.76,13 12,13M7.76,4.28C7.31,4.16 4.59,4.35 4.59,4.35C4.59,4.35 6.8,6.1 7.24,6.22C7.69,6.34 9.77,6.43 9.91,5.9C10.06,5.36 8.2,4.4 7.76,4.28M16.24,4.28C15.8,4.4 13.94,5.36 14.09,5.9C14.23,6.43 16.31,6.34 16.76,6.22C17.2,6.1 19.41,4.35 19.41,4.35C19.41,4.35 16.69,4.16 16.24,4.28Z" /></svg>
              </ListItemIcon>
              <ListItemText primary="Carniceria" />
            </ListItem>
        </List>
        <List>
            <ListItem button component={RouterLink} to="/category/Charcuteria">
              <ListItemIcon >
              <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" width="34" height="34" viewBox="0 0 24 24"><path d="M10.5,18A0.5,0.5 0 0,1 11,18.5A0.5,0.5 0 0,1 10.5,19A0.5,0.5 0 0,1 10,18.5A0.5,0.5 0 0,1 10.5,18M13.5,18A0.5,0.5 0 0,1 14,18.5A0.5,0.5 0 0,1 13.5,19A0.5,0.5 0 0,1 13,18.5A0.5,0.5 0 0,1 13.5,18M10,11A1,1 0 0,1 11,12A1,1 0 0,1 10,13A1,1 0 0,1 9,12A1,1 0 0,1 10,11M14,11A1,1 0 0,1 15,12A1,1 0 0,1 14,13A1,1 0 0,1 13,12A1,1 0 0,1 14,11M18,18C18,20.21 15.31,22 12,22C8.69,22 6,20.21 6,18C6,17.1 6.45,16.27 7.2,15.6C6.45,14.6 6,13.35 6,12L6.12,10.78C5.58,10.93 4.93,10.93 4.4,10.78C3.38,10.5 1.84,9.35 2.07,8.55C2.3,7.75 4.21,7.6 5.23,7.9C5.82,8.07 6.45,8.5 6.82,8.96L7.39,8.15C6.79,7.05 7,4 10,3L9.91,3.14V3.14C9.63,3.58 8.91,4.97 9.67,6.47C10.39,6.17 11.17,6 12,6C12.83,6 13.61,6.17 14.33,6.47C15.09,4.97 14.37,3.58 14.09,3.14L14,3C17,4 17.21,7.05 16.61,8.15L17.18,8.96C17.55,8.5 18.18,8.07 18.77,7.9C19.79,7.6 21.7,7.75 21.93,8.55C22.16,9.35 20.62,10.5 19.6,10.78C19.07,10.93 18.42,10.93 17.88,10.78L18,12C18,13.35 17.55,14.6 16.8,15.6C17.55,16.27 18,17.1 18,18M12,16C9.79,16 8,16.9 8,18C8,19.1 9.79,20 12,20C14.21,20 16,19.1 16,18C16,16.9 14.21,16 12,16M12,14C13.12,14 14.17,14.21 15.07,14.56C15.65,13.87 16,13 16,12A4,4 0 0,0 12,8A4,4 0 0,0 8,12C8,13 8.35,13.87 8.93,14.56C9.83,14.21 10.88,14 12,14M14.09,3.14V3.14Z"/></svg>
              </ListItemIcon>
              <ListItemText primary="Charcuteria" />
            </ListItem>
        </List>
        <List>
            <ListItem button component={RouterLink} to="/category/Frutas">
              <ListItemIcon >
              <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" width="34" height="34" viewBox="0 0 24 24"><path d="M16.4 16.4C19.8 13 19.8 7.5 16.4 4.2L4.2 16.4C7.5 19.8 13 19.8 16.4 16.4M16 7C16.6 7 17 7.4 17 8C17 8.6 16.6 9 16 9S15 8.6 15 8C15 7.4 15.4 7 16 7M16 11C16.6 11 17 11.4 17 12C17 12.6 16.6 13 16 13S15 12.6 15 12C15 11.4 15.4 11 16 11M12 11C12.6 11 13 11.4 13 12C13 12.6 12.6 13 12 13S11 12.6 11 12C11 11.4 11.4 11 12 11M12 15C12.6 15 13 15.4 13 16C13 16.6 12.6 17 12 17S11 16.6 11 16C11 15.4 11.4 15 12 15M8 17C7.4 17 7 16.6 7 16C7 15.4 7.4 15 8 15S9 15.4 9 16C9 16.6 8.6 17 8 17M18.6 18.6C14 23.2 6.6 23.2 2 18.6L3.4 17.2C7.2 21 13.3 21 17.1 17.2C20.9 13.4 20.9 7.3 17.1 3.5L18.6 2C23.1 6.6 23.1 14 18.6 18.6Z" /></svg>
              </ListItemIcon>
              <ListItemText primary="Frutas" />
            </ListItem>
        </List>
        <List>
            <ListItem button component={RouterLink} to="/category/Verduras">
              <ListItemIcon >
              <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" width="34" height="34" viewBox="0 0 24 24"><path d="M6.5,6C7.47,6 8.37,6.5 9.11,7.38C9.66,6.79 10.31,6.36 11,6.15V4A2,2 0 0,1 13,2H15V4H13V6.15C13.69,6.36 14.34,6.79 14.89,7.38C15.63,6.5 16.53,6 17.5,6C20,6 22,9.36 22,13.5C22,17.64 20,21 17.5,21C16.53,21 15.63,20.5 14.89,19.62C14.08,20.5 13.08,21 12,21C10.92,21 9.92,20.5 9.11,19.62C8.37,20.5 7.47,21 6.5,21C4,21 2,17.64 2,13.5C2,9.36 4,6 6.5,6Z" /></svg>
              </ListItemIcon>
              <ListItemText primary="Verduras" />
            </ListItem>
        </List>
        <List>
            <ListItem button component={RouterLink} to="/category/Vegetales">
              <ListItemIcon>
              <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" width="34" height="34" viewBox="0 0 24 24"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" /></svg>
              </ListItemIcon>
              <ListItemText primary="Vegetales" />
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