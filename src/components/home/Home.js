import React, {useState, useEffect , Fragment} from 'react'
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Componentes de Material-UI.
import {Card,CardHeader, CardMedia, CardContent, CardActions, Avatar, Typography, Grid, ListItemText, ListItemIcon, Button, FormControlLabel, Checkbox, ButtonGroup, Badge} from '@material-ui/core';
// Iconos de Material-UI.
import {Favorite, AddShoppingCart, Edit, Delete, Settings, Remove, Add} from '@material-ui/icons';
// Importando Estilos.
import {useStyles, StyledMenu, StyledMenuItem} from './styles';
// Icono de Favorite o Like.
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// Redireccionamientos.
import { Redirect } from 'react-router-dom';
// Desencriptar las busquedas recibidas del Header.
import { Base64 } from 'js-base64';

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

    // Hook para almacenar el index seleccionado del producto a editar.
    const [indexEdit, setIndexEdit] = useState(null);

    // Hook para almacenar los shoppingCart del usuario.
    const [shoppingCart, setshoppingCart] = useState([]);

    // Hook para confirmar si presiono o no una accion.
    const [press, setPress] = useState(false);

    // Funcion que será iniciada primero antes de renderizar el componente. Se encarga de buscar todos los productos en firebase y almacenarla en el Arreglo Hook.
    useEffect(() =>{

      if(props.match.params.search !== undefined)
        console.log("Resultado de Busqueda: " + Base64.decode(props.match.params.search));

      firebase.auth().onAuthStateChanged(function(user) { 
        if(user)
          setuserIn(user.uid);
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
        });

        // Cargando los productos en el Home.
        const refProducts = firebase.database().ref().child('products').orderByKey();
        let productsArray = []
        refProducts.once('value', snap => {
        snap.forEach(child => {

          if(child.val().category === props.match.params.category || props.match.params.category === undefined){
            console.log("entro");
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
         });

      }, [props.match.params.category, props.match.params.search]);

      //console.log(shoppingCart);
      console.log(products);

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
    function removeTarget(event, productid){
      //event.preventDefault();

      if(!press){
          setPress(true);
          // Eliminando los favoritos del producto.
          const favoritesRef = firebase.database().ref().child('favorites').orderByKey();
          favoritesRef.once('value', snap => {
          snap.forEach(child => {

            if(productid === child.val().product_id){
                console.log("Entro");
                let favoriteRef = firebase.database().ref('favorites/' + child.key);
                favoriteRef.remove();
            }
            });
          });

          // Eliminando los shoppingCart asociados al producto.
          const shoppingRef = firebase.database().ref().child('shoppingcart').orderByKey();
          shoppingRef.once('value', snap => {
          snap.forEach(child => {

            if(productid === child.val().product_id){
                let shopRef = firebase.database().ref('shoppingcart/' + child.key);
                shopRef.remove();
            }
            });
          });

          // Eliminando el producto.
          let productRef = firebase.database().ref('products/' + productid);
          productRef.remove();

          window.location.reload(false);
    }
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
            let userRef = firebase.database().ref('favorites/' + obtainIndex(productid));
            userRef.remove();
            alert("Removido de Favoritos.");
       }
    }

    // Obtener el indice del producto a eliminar.
    function obtainIndex(product_id){
       for(var i = 0; i < favorites.length; i++){
            if(favorites[i].product_id === product_id && favorites[i].user_id === userIn)
               return favorites[i].id;
       }
    }

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

      if(userIn === null){
        props.history.push('/login');
        return;
      }

      if(!press){
        setPress(true);
        if(!obtainShopping(productid)){
            const newShoppingCart = {
              product_id: productid,
              user_id: userIn,
              price: products[index].quantity * products[index].price,
              quantity: products[index].quantity 
            };
            
            firebase.database().ref('/shoppingcart').push(newShoppingCart)
            .then(response =>{
              alert("Agregado a Carro de Compra");
              setPress(false);
            })
            .catch(error => {
              console.log(error);
              alert(error.message);
              setPress(false);
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
            });
    }
    else{  
        setPress(false);
        alert("No puedes agregar al carrito de compra. Ya existe el producto.");
    }
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
                    <Typography variant="body2" color="textSecondary" component="p" align="justify">
                      {item.description}
                    </Typography>
                    {obtainRoleUser() === true?
                    <div>
                    <Typography variant="subtitle1" color="textSecondary" component="p">
                      {"Stock: " + item.stock}
                    </Typography>
                    </div>
                    : <div/>
                    }
                    <Typography variant="subtitle1" color="textSecondary" component="p">
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
                    <Typography variant="body2" color="textSecondary" component="p">
                      {"Cantidad: " + products[index].quantity}
                    </Typography>
                    </div>
                    : <div/>
                    }
                  </Grid>
                  </CardContent>
                  <CardActions disableSpacing>
                  <Grid container justify="center" alignItems="center">
                      <div>
                          <FormControlLabel
                            control={<Checkbox defaultChecked={obtainFavorites(products[index].id)} icon={<FavoriteBorder fontSize="default" />} checkedIcon={<Favorite fontSize="default" />} />}
                            onChange={(event) => addtoFavorites(event, products[index].id)}
                          />
                      </div>
                            <Button
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
                      <Button 
                          onClick={(event) => removeTarget(event, products[index].id)}
                          entry = {index}>
                            <Delete color="primary" fontSize="default"/>
                      </Button>
                        
                      <Button onClick={() => handleButtonClick(index)} entry={index}>
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
  </Fragment>
  );
}

export default Home;