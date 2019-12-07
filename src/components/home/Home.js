import React, {useState, useEffect ,Fragment} from 'react'
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {Card,CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton, Typography, Grid, ListItemText, ListItemIcon, Menu, MenuItem} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import {Favorite, AddShoppingCart, Edit, Delete, Settings} from '@material-ui/icons';

// Estilo para las tarjetas.
const useStyles = makeStyles(theme => ({
    card: {
      maxWidth: 265,
      maxHeight: 340,
      backgroundColor: '#EEF1F3',
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
    },
    root: {
        '& > *': {
          margin: theme.spacing(1),
          width: 35,
          height: 25,
        },
    },
    media: {
      height: 150,
      width: 270,
      paddingTop: '56.25%', // 16:9
    },
    avatar: {
      backgroundColor: blue[500],
    },
  }));

  // Estilos para el Menu Selector.
  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })(props => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));
  
  const StyledMenuItem = withStyles(theme => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

const Home = () =>{

    const classes = useStyles();

    // Hook para evento de abrir y cerrar el boton del engranaje para las opciones del administrador.
    const [anchorEl, setAnchorEl] = React.useState(null);

    // Evento para hacer click sobre el icono de engranaje.
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    // Evento para cerrar las opciones del engranaje.
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Arreglo Hook para almacenar los productos traidos desde la base de datos.
    const [products, setProduct] = useState([]);

    // Hook para almacenar el role del usuario logueado.
    const [role, setRole] = useState();

    // Funcion que será iniciada primero antes de renderizar el componente. Se encarga de buscar todos los productos en firebase y almacenarla en el Arreglo Hook.
    useEffect(() =>{
        const referencia = firebase.database().ref().child('products').orderByKey();
        let productsArray = []
        referencia.once('value', snap => {
        snap.forEach(child => {

            var productElement = {
                id:          child.key, 
                name:        child.val().name, 
                price:       child.val().price,
                image:       child.val().image,
                category:    child.val().category,
                description: child.val().description
            };

            productsArray.push(productElement);
           });
           setProduct(productsArray);
        });
      }, []);

      // Funcion para obtener el role del usuario logueado.
      function obtainRoleUser(){

        firebase.auth().onAuthStateChanged(response =>{
            // Si ocurre un response, hay un usuario autenticado.
            if(response){
              // Leer los datos del usuario, extraer el role y guardarlo en el Hook.
              firebase.database().ref(`/users/${response.uid}`)
              .once('value')
              .then(snapshot =>{
                setRole(snapshot.val().role);
              });
            }
          });

        return role;
      }

return( 
    <Fragment>
    <ul>
    <Grid container justify="center" alignItems="center">
        {/*Si hay productos almacenados en el Hook se itera sobre ese arreglo Hook donde estarán almacenados todos los productos.*/}
        { products && products.map((item, index) => {
            return(
            // Comienza la tarjeta.
                <Card className={classes.card}>
                  <CardHeader
                    avatar={
                      <Avatar aria-label="recipe" src={item.image} className={classes.avatar}/>
                    }
                    action={
                        // Si el role del usuario es 'true', entonces es un administrador y podrá editar y borrar los productos. Caso contrario (usuario): No podrá gestionar los productos.
                        obtainRoleUser() === true?
                        <div>
                            <Settings
                                aria-controls="customized-menu"
                                aria-haspopup="true"
                                variant="contained"
                                color="primary"
                                onClick={handleClick}
                            />
                            <StyledMenu
                                id="customized-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <Edit fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Editar Producto" />
                                </StyledMenuItem>
                                <StyledMenuItem>
                                    <ListItemIcon>
                                        <Delete fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Borrar Producto" />
                                </StyledMenuItem>
                            </StyledMenu>
                        </div>
                        :
                        <div/>
                    }
                    title={item.name}
                    subheader={"Categoria: " + item.category}
                  />
                  <CardMedia
                    className={classes.media}
                    image={item.image}
                    title={item.image.title}
                  />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                  <Grid container justify="center" alignItems="center">
                      <IconButton color="primary" aria-label="add to favorites">
                         <Favorite />
                      </IconButton>
                      <IconButton color="primary" aria-label="add to shopping cart">
                         <AddShoppingCart />
                      </IconButton>
                  </Grid>
                  </CardActions>
                </Card>
            ); // Termina el return, mostrando cada una de las tarjetas de productos.
        })
        }
    </Grid>
    </ul>
    </Fragment>
   );
}

export default Home;