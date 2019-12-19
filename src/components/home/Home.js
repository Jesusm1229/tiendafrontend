import React, {useState, useEffect , Fragment} from 'react'
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Componentes de Material-UI.
import {Card,CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton, Typography, Grid, ListItemText, ListItemIcon, Link, Button} from '@material-ui/core';
// Iconos de Material-UI.
import {Favorite, AddShoppingCart, Edit, Delete, Settings} from '@material-ui/icons';
// Importando Estilos.
import {useStyles, StyledMenu, StyledMenuItem} from './styles';
// Redireccionamientos.
import { Link as RouterLink, withRouter} from 'react-router-dom';

// Creacion de Link RouterDOM para cambio de paginas sin renderizar todo nuevamente.
const MyLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

// Componente Funcional Home.
const Home = (props) =>{

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
                  if(snapshot.exists())
                    setRole(snapshot.val().role);
                  else
                    props.history.push('/login');
                });
              }
          });

        return role;
      }

    // Funcion para que un Admin pueda eliminar un producto del Home.
    function removeTarget(event, index){
      event.preventDefault();

      console.log(index);
      console.log(products[index].id);

      let userRef = firebase.database().ref('products/' + products[index].id);
      userRef.remove();
      window.location.reload(false);
    }

return( 
  <Fragment>
    <ul>
    <Grid container justify="center" alignItems="center">
        {/*Si hay productos almacenados en el Hook se itera sobre ese arreglo Hook donde estarán almacenados todos los productos.*/}
        { products && products.map((item, index) => {
            return(
            // Comienza la tarjeta.
                <Card className={classes.card} key={index}>
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
                                    <ListItemText primary="Eliminar Producto" />
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
                <h5>{item.price + "Bs"}</h5>
                  <Grid container justify="center" alignItems="center">
                      <IconButton color="primary" aria-label="add to favorites">
                         <Favorite />
                      </IconButton>
                      <IconButton color="primary" aria-label="add to shopping cart">
                         <AddShoppingCart />
                      </IconButton>
                      {obtainRoleUser() === true?
                      <div>
                      <Link to="/" component={MyLink} variant="body2">
                      <Button 
                          onClick={(event) => removeTarget(event, index)}
                          entry = {index}>
                            <Delete color="primary"/>
                      </Button>
                      </Link>
                      </div>
                      : <div/>
                      }
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

export default withRouter(Home);