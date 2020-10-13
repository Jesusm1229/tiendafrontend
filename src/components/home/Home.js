import React, {useState, useEffect , Fragment} from 'react'
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Componentes de Material-UI.
import {Card,CardHeader, CardMedia, CardContent, CardActions, Avatar, Typography, Grid, Button, FormControlLabel, Checkbox, ButtonGroup, Badge} from '@material-ui/core';
//Auxiliar para control de Typography
import Box from '@material-ui/core/Box';
// Iconos de Material-UI.
import {Favorite, AddShoppingCart, Edit, Delete, Remove, Add} from '@material-ui/icons';
// Importando Estilos.
import {useStyles} from './styles';
// Icono de Favorite o Like.
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// Redireccionamientos.
import { Redirect } from 'react-router-dom';
// Desencriptar las busquedas recibidas del Header.
import { Base64 } from 'js-base64';
// Importando Alert de SnackBar.
import Snackbar from '../snackbar/Snackbar';

import Carrusel from '../carousel/Carrusel';

// Componente Funcional Home.
const Home = (props) =>{

    const classes = useStyles();

    // Arreglo Hook para almacenar los productos traidos desde la base de datos.
    const [products, setProduct] = useState([]);

    // Arreglo Hook para almacenar los productos favoritos traidos desde la base de datos.
    const [favorites, setFavorites] = useState([]);

    // Hook para almacenar el role del usuario logueado.
    const [role, setRole] = useState();

    // Hook para almacenar el usuario logueado.
    const [userIn, setuserIn] = useState();

    // Hook para almacenar el index seleccionado del producto a editar.
    const [indexEdit, setIndexEdit] = useState(null);

    // Hook para almacenar los shoppingCart del usuario.
    const [shoppingCart, setshoppingCart] = useState([]);

    // Hook para confirmar si presiono o no una accion.
    const [press, setPress] = useState(false);

    // Control de estado del producto eliminado.
    const [estado, setEstado] = useState(false);

    // Contenido del Snackbar.
    const[snack, setsnack] = useState({
      motive: '',
      text: '',
      appear: false,
    });

    // Funcion que será iniciada primero antes de renderizar el componente. Se encarga de buscar todos los productos en firebase y almacenarla en el Arreglo Hook.
    useEffect(() =>{
      firebase.auth().onAuthStateChanged(function(user) { 
        if(user){
          setuserIn(user.uid);
        }
        else
          setuserIn(null);
      });

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
       }).catch(error => {
          console.log(error.message);
      });

      // Cargando los shoppingCart del usuario.
      const refShopping = firebase.database().ref().child('shoppingcart').orderByKey();
      let shoppingArray = []
      refShopping.once('value', snap => {
      snap.forEach(child => {

           const newShoppingCart = {
             product_id: child.val().product_id,
             user_id: child.val().user_id,
             quantity: child.val().quantity, 
           };

           firebase.auth().onAuthStateChanged(function(user) { 
             if(user){
               if(newShoppingCart.user_id === user.uid)
                 shoppingArray.push(newShoppingCart);
             }
           });
         });
         setshoppingCart(shoppingArray);
      }).catch(error => {
         console.log(error.message);
      });

      if(props.match.params.search !== undefined){
        console.log("Entro en la busqueda.");
        searchProducts(Base64.decode(props.match.params.search));
      }
      else{
          // Cargando los productos en el Home.
          const refProducts = firebase.database().ref().child('products').orderByKey();
          let productsArray = []
          refProducts.once('value', snap => {
          snap.forEach(child => {

            if(child.val().category === props.match.params.category || props.match.params.category === undefined){

                var productElement = {
                    id:          child.key, 
                    name:        child.val().name, 
                    price:       child.val().price,
                    image:       child.val().image,
                    category:    child.val().category,
                    description: child.val().description,
                    stock:       child.val().stock,
                    quantity:       1,
                };

                productsArray.push(productElement);
            }
            });
            setProduct(productsArray);
          }).catch(error => {
             console.log(error.message);
          });
      }

      }, [props.match.params.category, props.match.params.search]);

      // Funcion para la busqueda por nombre de los productos.
      function searchProducts(search){

                const refProducts = firebase.database().ref().child('products').orderByKey();
                let productsArray = []
                refProducts.once('value', snap => {
                snap.forEach(child => {   

                        if(child.val().name.includes(search) || child.val().name.includes(search[0].toUpperCase()) || child.val().name.includes(search.toLowerCase())){
                              var productElement = {
                                  id:          child.key, 
                                  name:        child.val().name, 
                                  price:       child.val().price,
                                  image:       child.val().image,
                                  category:    child.val().category,
                                  description: child.val().description,
                                  stock:       child.val().stock,
                                  quantity:       1,
                              };
                
                              productsArray.push(productElement);
                          }
                  });
                    setProduct(productsArray);
                }).catch(error => {
                    console.log(error.message);
              });
      }

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
                }).catch(error => {
                  console.log(error.message);
               });
              }
          });

        return role;
      }

    // Funcion para que un Admin pueda eliminar un producto del Home.
    function removeTarget(event, productid){
      event.preventDefault();

      setsnack({ appear: false, });

      if(!press){
          setPress(true);

          // Eliminando el producto.
          firebase.database().ref('products/' + productid).remove();

          // Eliminando los favoritos del producto.
          firebase.database().ref().child('favorites').orderByKey().once('value').then(function(snapshot) {
            snapshot.forEach(child => {
                  if(productid === child.val().product_id)
                      firebase.database().ref('favorites/' + child.key).remove(); 
            });
          }).catch(error => {
            console.log(error.message);
         });

          // Eliminando los shoppingCart asociados al producto.
          firebase.database().ref().child('shoppingcart').orderByKey().once('value', snap => {
            snap.forEach(child => {
                if(productid === child.val().product_id)
                    firebase.database().ref('shoppingcart/' + child.key).remove();
            });
            setsnack({
              motive: 'warning', text: 'Producto Eliminado - Actualiza la aplicacion para ver cambios', appear: true,
            });
          }).catch(error => {
            console.log(error.message);
         });
      }

      setEstado(true);
  }

    // Hook para verificar si hizo click para editar el producto o no.
    const [buttonClicked, setButtonClicked] = useState(false);

    // Fijando el click de edit en el Hook.
    function handleButtonClick(index){
        console.log(index);
        setIndexEdit(index);
        setButtonClicked(true);
    }

     // Funcion para agregar a favoritos un producto en especifico.
    function addtoFavorites(e, productid){
  
        e.preventDefault();
        setsnack({ appear: false, });

        if(userIn === null){
            props.history.push('/login');
            return;
        }

        if(e.target.checked){
            const newFavorite = {
                product_id: productid,
                user_id: userIn,
            };

            firebase.database().ref('/favorites').push(newFavorite)
            .then(response =>{

              setsnack({ motive: 'success', text: 'Agregado a Favoritos', appear: true, });

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
              }).catch(error => {
                console.log(error.message);
             });

            })
            .catch(error => {
                console.log(error);
            });

        }else{ // Se eliminara el like de ese producto.
           //let userRef = firebase.database().ref('favorites/' + obtainID(productid));
           //userRef.remove();

           firebase.database().ref().child('favorites').orderByKey().once('value', snap => { 
           snap.forEach(child => {
                  if(productid === child.val().product_id && child.val().user_id === firebase.auth().currentUser.uid){
                      setsnack({ motive: 'warning', text: 'Removido de Favoritos.', appear: true, });
                      
                      firebase.database().ref('favorites/' + child.key).remove().catch(error => {
                        console.log(error);
                        setsnack({
                            motive: 'error', text: 'Se ha producido un error de Eliminacion', appear: true,
                        });
                    });
                  }
            });
           }).catch(error => {
                console.log(error);
           });

           const name = e.target.getAttribute("name");
           setFavorites(favorites.filter(item => item.product_id !== name));
        }
   }

    // Obtener el indice del producto a eliminar.
    /*function obtainID(productid){
       for(var i = 0; i < favorites.length; i++)
            if(favorites[i].product_id === productid && favorites[i].user_id === firebase.auth().currentUser.uid)
                return favorites[i].id;
    }*/

    // Conocer si el usuario posee un favorito en un producto.
    function obtainFavorites(product_id){

      for(var i = 0; i < favorites.length; i++)
        if(favorites[i].product_id === product_id && favorites[i].user_id === userIn)
            return true;
        return false;
    }

    // Funcion para agregar a carrito de compra un producto en especifico con su cantidad segun el stock o disponibilidad.
    function addtoShoppingCart(e, productid, index){
  
        e.preventDefault();
        setsnack({ appear: false, });

        if(userIn === null){
          props.history.push('/login');
          return;
        }

        // Validar que el producto ya se encuentre agregado al carrito.
        const refShopping = firebase.database().ref().child('shoppingcart').orderByKey();
        refShopping.once('value', snap => {
        snap.forEach(child => {
              if(child.val().product_id === productid && firebase.auth().currentUser.uid === child.val().user_id){
                  setsnack({
                    motive: 'warning', text: 'No puedes agregar al carrito de compra. Ya existe el producto.', appear: true,
                  });
                  return;
              }
          });
        }).catch(error => {
          console.log(error);
        });

        if(!obtainShopping(productid)){

              const newShoppingCart = {
                product_id: productid,
                user_id: userIn,
                price: products[index].quantity * products[index].price,
                quantity: products[index].quantity 
              };
              
              firebase.database().ref('/shoppingcart').push(newShoppingCart)
              .then(response =>{
                setsnack({
                  motive: 'success', text: 'Agregado a Carro de Compra', appear: true,
                });
              })
              .catch(error => {
                console.log(error);
              });

              // Actualizando el Hook con el ultimo favorito agregado mas reciente.
              const refShopping = firebase.database().ref().child('shoppingcart').orderByKey();
              let shoppingArray = []
              refShopping.once('value', snap => {
              snap.forEach(child => {

                    const newShoppingCart = {
                      product_id: child.val().product_id,
                      user_id: child.val().user_id,
                      quantity: child.val().quantity, 
                    };

                    if(newShoppingCart.user_id === userIn)
                      shoppingArray.push(newShoppingCart);
              });
                setshoppingCart(shoppingArray);
              }).catch(error => {
                console.log(error);
              });
        }
}

   // Verifica la existencia de un shoppingCart asociado al usuario logueado.
   function obtainShopping(productid){
    for(var i = 0; i < shoppingCart.length; i++)
          if(shoppingCart[i].product_id === productid && shoppingCart[i].user_id === userIn)
                return true;
    return false;
  }

return( 
    <Fragment>
      <Carrusel/>
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
                    title={item.name}
                    subheader={"Categoria: " + item.category}
                    />
                  <CardMedia
                    className={classes.media}
                    image={item.image}
                    title={item.image.title}
                  />
                  <CardContent>
                    <Typography component="p" variant="body2" color="textSecondary"  align="justify">
                    <Box fontWeight="fontWeightBold">
                      {item.description}
                    </Box>
                    </Typography>
                    {obtainRoleUser() === true?
                    <div>
                    <Typography variant="subtitle1" color="textSecondary" component="p">
                      {"Stock: " + item.stock}
                    </Typography>
                    </div>
                    : <div/>
                    }
                    <Typography variant="subtitle1" color="textSecondary" component="p" alig>
                      {item.price + "Bs / Kg"}
                    </Typography>
                    <Grid container justify="center" alignItems="center">
                    {obtainRoleUser() !== undefined?
                    <div>
                    <ButtonGroup>
                        <Button
                          aria-label="reduce"
                          onClick={() => {
                            let productsArray = [...products];
                            productsArray[index].quantity = Math.max(productsArray[index].quantity - 1, 1);
                            setProduct(productsArray);
                            console.log(products);
                          }}
                        >
                          <Remove fontSize="small" />
                        </Button>
                        <Button
                          aria-label="increase"
                          onClick={() => {
                            let productsArray = [...products];
                            
                            if(productsArray[index].quantity < productsArray[index].stock)
                                productsArray[index].quantity = productsArray[index].quantity + 1;
                            
                            setProduct(productsArray);
                            console.log(products);
                          }}
                        >
                          <Add fontSize="small" />
                        </Button>
                    </ButtonGroup>
                    <Grid container justify="center" alignItems="center">
                        <Typography variant="body2" color="textSecondary" component="p">
                          {"Cantidad: " + products[index].quantity}
                        </Typography>
                    </Grid>
                    </div>
                    : <div/>
                    }
                  </Grid>
                  </CardContent>
                  <CardActions disableSpacing>
                  <Grid container justify="center" alignItems="center">
                      <div>
                          <FormControlLabel disabled={estado} style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}
                            control={<Checkbox checked={obtainFavorites(products[index].id)} icon={<FavoriteBorder fontSize="default" />} checkedIcon={<Favorite fontSize="default" />} name={products[index].id} />}
                            onChange={(event) => addtoFavorites(event, products[index].id)}
                          />
                      </div>
                            <Button disabled={estado} style={{maxWidth: '45px', maxHeight: '30px', minWidth: '45px', minHeight: '30px'}}
                                onClick={(event) => addtoShoppingCart(event, products[index].id, index)}
                                entry = {index}>
                                {obtainRoleUser() !== undefined?
                                <div>
                                <Badge color="secondary" badgeContent={products[index].quantity} max={999}>
                                  <AddShoppingCart color="primary" fontSize="default"/>
                                </Badge>
                                </div>
                                :
                                <div>
                                  <Badge color="secondary" badgeContent={0} max={999}>
                                  <AddShoppingCart color="primary" fontSize="default"/>
                                  </Badge>
                                </div>
                                }
                            </Button>

                      {obtainRoleUser() === true?
                      <div>
                      <Button disabled={estado} style={{maxWidth: '45px', maxHeight: '30px', minWidth: '45px', minHeight: '30px'}}
                          onClick={(event) => removeTarget(event, products[index].id)}
                          entry = {index}>
                            <Delete color="primary" fontSize="default"/>
                      </Button>
                        
                      <Button disabled={estado} style={{maxWidth: '45px', maxHeight: '30px', minWidth: '45px', minHeight: '30px'}} onClick={() => handleButtonClick(index)} entry={index}>
                          <Edit color="primary" fontSize="default" />
                      </Button>

                      {buttonClicked? (
                          <Redirect
                            to={{
                                pathname: '/editproduct',
                                state: { product: products[indexEdit] }
                            }}
                          />
                      ) : null}
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
      {snack.appear?
          <div> <Snackbar motive={snack.motive} text={snack.text}/> </div>
          : <div/>
      }
  </Fragment>
  );
}

export default Home;