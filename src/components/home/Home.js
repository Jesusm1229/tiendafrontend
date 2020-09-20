import React, {useState, useEffect , Fragment} from 'react'
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Componentes de Material-UI.
import {Card,CardHeader, CardMedia, CardContent, CardActions, Avatar, Typography, Grid, Button, FormControlLabel, Checkbox, ButtonGroup, Badge} from '@material-ui/core';
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

    // Contenido del Snackbar.
    const[snack, setsnack] = useState({
      motive: '',
      text: '',
      appear: false,
    });

    // Funcion que será iniciada primero antes de renderizar el componente. Se encarga de buscar todos los productos en firebase y almacenarla en el Arreglo Hook.
    useEffect(() =>{
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

      if(props.match.params.search !== undefined){
        console.log("Entro en la busqueda.");
        searchProducts(Base64.decode(props.match.params.search));
      }
      else{
          // Cargando los productos en el Home.
          console.log("Entro sin busqueda.");
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
          });
      }

      }, [props.match.params.category, props.match.params.search]);

      // Funcion para la busqueda de los productos.
      function searchProducts(search){

        // Buscando los productos de la busqueda.
        const refProducts = firebase.database().ref().child('products').orderByKey();
         let productsArray = []
         refProducts.once('value', snap => {
         snap.forEach(child => {
          
           if(child.val().name.includes(search.toLowerCase())){
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
          });

          // Eliminando los shoppingCart asociados al producto.
          firebase.database().ref().child('shoppingcart').orderByKey().once('value', snap => {
            snap.forEach(child => {
                if(productid === child.val().product_id)
                    firebase.database().ref('shoppingcart/' + child.key).remove();
            });
            setsnack({
              motive: 'success', text: 'Producto Eliminado.', appear: true,
            });
            window.location.reload(); 
          });
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
      setsnack({ appear: false, });

     if(userIn === null){
         props.history.push('/login');
         return;
     }

     if(!press){
        setPress(true);
      if(e.target.checked){

            const newFavorite = {
                product_id: productid,
                user_id: userIn,
            };

              firebase.database().ref('/favorites').push(newFavorite)
              .then(response =>{

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

                setsnack({
                  motive: 'success', text: 'Agregado a Favoritos', appear: true,
                });
                setPress(false);
              })
              .catch(error => {
                console.log(error);
                alert(error.message);
              });

       }else{ // Se eliminara el like de ese producto.
           let userRef = firebase.database().ref('favorites/' + obtainID(productid));
           userRef.remove();

           const name = e.target.getAttribute("name");
           setFavorites(favorites.filter(item => item.product_id !== name));

           setsnack({
            motive: 'success', text: 'Removido de Favoritos.', appear: true,
           });
           setPress(false);
        }
      }
   }

    // Obtener el indice del producto a eliminar.
    function obtainID(productid){
       for(var i = 0; i < favorites.length; i++)
            if(favorites[i].product_id === productid && favorites[i].user_id === firebase.auth().currentUser.uid)
                return favorites[i].id;
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
      setsnack({ appear: false, });

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
              setsnack({
                motive: 'success', text: 'Agregado a Carro de Compra', appear: true,
               });
              setPress(false);
            })
            .catch(error => {
              console.log(error);
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
        setsnack({
          motive: 'warning', text: 'No puedes agregar al carrito de compra. Ya existe el producto.', appear: true,
         });
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
                <Card className={classes.card}>
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
                            control={<Checkbox checked={obtainFavorites(products[index].id)} icon={<FavoriteBorder fontSize="default" />} checkedIcon={<Favorite fontSize="default" />} name={products[index].id} />}
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
      {snack.appear?
          <div> <Snackbar motive={snack.motive} text={snack.text}/> </div>
          : <div/>
      }
  </Fragment>
  );
}

export default Home;