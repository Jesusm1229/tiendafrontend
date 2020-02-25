import React, {useState, useEffect , Fragment} from 'react';
// Componentes de Material-UI.
import {Grid, Paper, Typography, ButtonBase, Button} from '@material-ui/core';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Importando los Estilos.
import {useStyles} from './styles';
// Importando los iconos de Material-UI.
import {RemoveShoppingCart} from '@material-ui/icons';
// Importando el componente de Button de PayPal.
import PaypalCheckout from '../paypalcheckout/PaypalCheckout';

const ShoppingCart = () => {
  const classes = useStyles();

  // Hook para almacenar todos los productos.
  const [products, setProducts] = useState([]);

  // Hook para almacenar el monto total a cancelar en bolivares por parte del usuario.
  const [toPay, settoPay] = useState();

  // Hook para almacenar la informacion del usuario logueado.
  const [user, setUser] = useState();

  // Orden el shoppingCart completo para enviar a PayPal.
  const order = {
    total: (toPay/75000).toFixed(2),
    shoppingcart: products,
  };

   useEffect(() =>{

          // Usuario logueado al momento de realizar la compra.
          firebase.auth().onAuthStateChanged(response =>{
            if(response){
              firebase.database().ref(`/users/${response.uid}`)
              .once('value')
              .then(snapshot =>{
                setUser(snapshot.val());
              });
            }
          });

          // Buscamos los productos que anadio el usuario al carrito o a la coleccion 'shoppingcart'.
          const refshopping = firebase.database().ref().child('shoppingcart').orderByKey();
          let productsArray = []
          var total = 0
          refshopping.once('value', snap => {
          snap.forEach(child => {

                if(child.val().user_id === firebase.auth().currentUser.uid){
                   firebase.database().ref('products/' + child.val().product_id)
                   .once('value')
                   .then(snapshot =>{

                    console.log(snapshot.key);

                    const shopping = {
                      id:           snapshot.key,
                      name:         snapshot.val().name,
                      category:     snapshot.val().category,
                      description:  snapshot.val().description,
                      image:        snapshot.val().image,
                      price:        snapshot.val().price,
                      stock:        snapshot.val().stock,
                      quantity:     child.val().quantity,
                      pricefinal:   snapshot.val().price * child.val().quantity,
                    };

                    total += shopping.pricefinal;

                    productsArray.push(shopping);
                    settoPay(total);
                  });
                }
              });
            setProducts(productsArray);
          });
    },[]);

     // Funcion para que un Admin o Usuario pueda eliminar un producto de su carrito de compra.
     function removeShopping(event, index){
      event.preventDefault();

      // Eliminando un producto del carrito de compra.
      const shoppingRef = firebase.database().ref().child('shoppingcart').orderByKey();
      shoppingRef.once('value', snap => {
      snap.forEach(child => {

         if(products[index].id === child.val().product_id){
            let shopRef = firebase.database().ref('shoppingcart/' + child.key);
            shopRef.remove();
            window.location.reload(false);
         }
        });
      });
    }

  return (
  <Fragment>
    <ul>
        {/*Si hay productos almacenados en el Hook se itera sobre ese arreglo Hook donde estarán almacenados todos los productos.*/}
        { products && products.map((item, index) => {
            return(
              <Grid container justify="center" alignItems="center" key={index}>
                  <div className={classes.root}>
                    <Paper className={classes.paper}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <ButtonBase className={classes.image}>
                            <img className={classes.img} alt="complex" src={item.image} />
                          </ButtonBase>
                        </Grid>
                        <Grid item xs={12} sm container>
                          <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                              <Typography gutterBottom variant="subtitle1">
                                {item.name}
                              </Typography>
                              <Typography variant="body2" gutterBottom>
                                {"Categoria: " + item.category}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {item.description}
                              </Typography>
                              <Typography variant="subtitle2">{"A pagar: " + item.pricefinal}
                              </Typography>
                            </Grid>
                            <Grid item>
                            <Button 
                                onClick={(event) => removeShopping(event, index)}>
                                  <RemoveShoppingCart/> Eliminar del Carrito
                           </Button>
                            </Grid>
                          </Grid>
                          <Grid item>
                              <Typography variant="subtitle1">{"Bs " + item.price + "/ Kg"}</Typography>
                          </Grid>
                          <Grid item>
                              <Typography variant="subtitle1">{"Cantidad: " + item.quantity}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                    {index === products.length - 1?

                    <div>
                      <Paper className={classes.paper}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                              <Grid item xs>
                                <Typography gutterBottom variant="subtitle1">
                                  {"Facturacion El Vecino Tarazona."}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  {"Cliente: " + user.name + " " + user.lastname}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {"Subtotal: " + toPay + " Bs"}
                                </Typography>
                                <Typography variant="subtitle2">{"Total a pagar: " + (toPay/75000).toFixed(2) + "$ o " + toPay + " Bs"}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Paper>

                      <Grid container justify="center" alignItems="center" key={index} className={classes.paper}>
                          <PaypalCheckout order={order}/>
                      </Grid>
                    </div>
                    : <div/>
                  }
                  </div>
              </Grid>
            ); // Termina el return, mostrando cada una de las tarjetas de productos.
          })
          }
      </ul>
    </Fragment>
  );
}

export default ShoppingCart;