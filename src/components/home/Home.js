import React, {useState, useEffect , Fragment} from 'react'
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Componentes de Material-UI.
import {Card,CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton, Typography, Grid, ListItemText, ListItemIcon, Button, FormControlLabel, Checkbox} from '@material-ui/core';
// Iconos de Material-UI.
import {Favorite, AddShoppingCart, Edit, Delete, Settings} from '@material-ui/icons';
// Importando Estilos.
import {useStyles, StyledMenu, StyledMenuItem} from './styles';
// Componente EditProduct.
import Editproduct from '../adminstock/Editproduct';
// Redireccionamientos.
import { Redirect } from 'react-router-dom';
// Icono de Favorite o Like.
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

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

    // Arreglo Hook para almacenar los productos favoritos traidos desde la base de datos.
    const [favorites, setFavorites] = useState([]);

    // Hook para almacenar el role del usuario logueado.
    const [role, setRole] = useState();

    // Hook para almacenar el usuario logueado.
    const [userIn, setuserIn] = useState();

    // Funcion que será iniciada primero antes de renderizar el componente. Se encarga de buscar todos los productos en firebase y almacenarla en el Arreglo Hook.
    useEffect(() =>{

      /*firebase.auth().onAuthStateChanged(function(user) { 
        if(user)
          setuserIn(user.uid);
        else
          setuserIn(null);
      });*/

        // Cargando los favorites de los productos.
        const refFavorites = firebase.database().ref().child('favorites').orderByKey();
        let favoritesArray = []
        refFavorites.once('value', snap => {
        snap.forEach(child => {

            var favoriteElement = {
                id:          child.key, 
                product_id:  child.val().product_id, 
                user_id:     child.val().user_id
            };

            favoritesArray.push(favoriteElement);
           });
           setFavorites(favoritesArray);
        });

        // Cargando los productos en el Home.
        const refProducts = firebase.database().ref().child('products').orderByKey();
        let productsArray = []
        refProducts.once('value', snap => {
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

      // Eliminando el producto.
      let productRef = firebase.database().ref('products/' + products[index].id);
      productRef.remove();

      // Eliminando los favoritos del producto.
      const favoritesRef = firebase.database().ref().child('favorites').orderByKey();
      favoritesRef.once('value', snap => {
      snap.forEach(child => {

         if(products[index].id === child.val().product_id){
            let favoriteRef = firebase.database().ref('favorites/' + child.key);
            favoriteRef.remove();
         }
        });
      });

      window.location.reload(false);
    }

    // Hook para verificar si hizo click para editar el producto o no.
    const [buttonClicked, setButtonClicked] = useState(false);

    // Fijando el click de edit en el Hook.
    function handleButtonClick(){
        setButtonClicked(true)
    }

    // Funcion para agregar a favoritos un producto en especifico.
    function addtoFavorites(e, productid){
  
       e.preventDefault();

       firebase.auth().onAuthStateChanged(function(user) { 
        if(!user){
          props.history.push('/login');
          setuserIn(null);
        }
      });

       if(e.target.checked && userIn !== null){

           const newFavorite = {
                product_id: productid,
                user_id: firebase.auth().currentUser.uid
           };

            firebase.database().ref('/favorites').push(newFavorite)
            .then(response =>{
              alert("Agregado a Favoritos");  
            })
            .catch(error => {
              console.log(error);
              alert(error.message);
            });

            // Actualizando el Hook con el ultimo favorito agregado mas reciente.
            const refFavorites = firebase.database().ref().child('favorites').orderByKey();
            let favoritesArray = []
            refFavorites.once('value', snap => {
            snap.forEach(child => {

                var favoriteElement = {
                    id:          child.key, 
                    product_id:  child.val().product_id, 
                    user_id:     child.val().user_id
                };

                favoritesArray.push(favoriteElement);
              });
              setFavorites(favoritesArray);
            });
        }else{ // Se eliminara el like de ese producto.

          if(userIn !== null){
            let userRef = firebase.database().ref('favorites/' + obtainIndex(productid));
            userRef.remove();
            alert("Removido de Favoritos.");
          }
       }
    }

    // Obtener el indice del producto a eliminar.
    function obtainIndex(product_id){
       for(var i = 0; i < favorites.length; i++){
            if(favorites[i].product_id === product_id && favorites[i].user_id === firebase.auth().currentUser.uid)
               return favorites[i].id;
       }
    }

    // Conocer si el usuario posee un favorito en un producto.
    function obtainFavorites(product_id){

      firebase.auth().onAuthStateChanged(function(user) { 
        if(user)
          setuserIn(user.uid);
        else
          setuserIn(null);
      });
     
      if(userIn !== null){
        for(var i = 0; i < favorites.length; i++)
          if(favorites[i].product_id === product_id && favorites[i].user_id === userIn)
              return true;
      }

      return false;
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
                    <Typography variant="subtitle1" color="textSecondary" component="p">
                      {item.price + "Bs"}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                  <Grid container justify="center" alignItems="center">
                     {obtainFavorites(products[index].id)?
                         
                      <div>
                          <FormControlLabel
                            control={<Checkbox checked={true} icon={<FavoriteBorder />} checkedIcon={<Favorite />} value="checkedH" />}
                            onChange={(event) => addtoFavorites(event, products[index].id)}
                          />
                      </div>
                        : 
                      <div>
                          <FormControlLabel
                            control={<Checkbox checked={false} icon={<FavoriteBorder />} checkedIcon={<Favorite />} value="checkedH" />}
                            onChange={(event) => addtoFavorites(event, products[index].id)}
                          />
                      </div>
                    }
                      <IconButton color="primary" aria-label="add to shopping cart">
                         <AddShoppingCart fontSize="small"/>
                      </IconButton>
                      {obtainRoleUser() === true?
                      <div>
                      <Button 
                          onClick={(event) => removeTarget(event, index)}
                          entry = {index}>
                            <Delete color="primary" fontSize="small"/>
                      </Button>
                      <Button 
                          onClick={() => handleButtonClick()}
                          entry = {index}>
                            <Edit color="primary" fontSize="small"/>
                      </Button>
                    
                        {buttonClicked ? <Redirect to="/editproduct"> <Editproduct variable={true}/></Redirect> : null}
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

export default Home;