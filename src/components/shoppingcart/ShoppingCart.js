import React, {useState, useEffect , Fragment} from 'react';
// Componentes de Material-UI.
import {Grid, Paper, Typography, ButtonBase, Button} from '@material-ui/core';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Importando los Estilos.
import {useStyles} from './styles';
// Importando los iconos de Material-UI.
import {HighlightOff} from '@material-ui/icons';

const ShoppingCart = () => {
  const classes = useStyles();

  // Hook para almacenar todos los productos.
  const [products, setProducts] = useState([]);

   useEffect(() =>{

          // Buscamos los productos que anadio el usuario al carrito o a la coleccion 'shoppingcart'.
          const refFavorites = firebase.database().ref().child('shoppingcart').orderByKey();
          let productsArray = []
          refFavorites.once('value', snap => {
          snap.forEach(child => {

                if(child.val().user_id === firebase.auth().currentUser.uid){
                   firebase.database().ref('products/' + child.val().product_id)
                   .once('value')
                   .then(snapshot =>{

                    const shopping = {
                      id:           snapshot.key,
                      name:         snapshot.val().name,
                      category:     snapshot.val().category,
                      description:  snapshot.val().description,
                      image:        snapshot.val().image,
                      price:        snapshot.val().price,
                      stock:        snapshot.val().stock,
                      quantity:     child.val().quantity,
                    };

                    productsArray.push(shopping);
                  });
                }
              });
            setProducts(productsArray);
          });
    },[]);

     // Funcion para que un Admin o Usuario pueda eliminar un producto de su carrito de compra.
     function removeFavorite(event, index){
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
                            </Grid>
                            <Grid item>
                            <Button 
                                onClick={(event) => removeFavorite(event, index)}>
                                  <HighlightOff/> Eliminar del Carrito
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