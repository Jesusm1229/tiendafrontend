import React, {useState, useEffect , Fragment} from 'react';
// Componentes de Material-UI.
import {Grid, Paper, Typography, ButtonBase, Button} from '@material-ui/core';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Importando los Estilos.
import {useStyles} from './styles';
// Importando los iconos de Material-UI.
import {HighlightOff} from '@material-ui/icons';

const Favorites = (props) => {
  const classes = useStyles();

  // Hook para almacenar todos los productos.
  const [products, setProducts] = useState([]);

  // Hook para almacenar el usuario logueado.
  const [userin, setUserin] = useState(false);

   useEffect(() =>{

          // Verificamos si hay un usuario logueado.
          firebase.auth().onAuthStateChanged(function(user) { 
            if(user)
              setUserin(true);
          });

          if(!userin)
            return;

          // Buscamos los favoritos del usuario logueado en la coleccion 'favorites'.
          const reffavorites = firebase.database().ref().child('favorites').orderByKey();
          let productsArray = []
          reffavorites.once('value', snap => {
          snap.forEach(child => {

                if(child.val().user_id === firebase.auth().currentUser.uid){
                   firebase.database().ref('products/' + child.val().product_id)
                   .once('value')
                   .then(snapshot =>{

                      const favorite = {
                      id:           snapshot.key,
                      name:         snapshot.val().name,
                      category:     snapshot.val().category,
                      description:  snapshot.val().description,
                      image:        snapshot.val().image,
                      price:        snapshot.val().price,
                      stock:        snapshot.val().stock,
                    };
                    productsArray.push(favorite);

                  }).catch(error => {
                    console.log(error.message);
                 });

                  setProducts(productsArray);
                }
              });
          }).catch(error => {
            console.log(error.message);
         });
    },[userin]);

     // Funcion para que un Admin o Usuario pueda eliminar un favorito.
     function removeFavorite(event, index){
      event.preventDefault();

      // Eliminando los favoritos del producto.
      firebase.database().ref().child('favorites').orderByKey().once('value', snap => {
      snap.forEach(child => {
            if(products[index].id === child.val().product_id && child.val().user_id === firebase.auth().currentUser.uid){
                firebase.database().ref('favorites/' + child.key).remove();
                props.history.push('/');
            }
        });
      }).catch(error => {
        console.log(error.message);
     });
    }

  return (
  <Fragment>
    <ul>
    <Grid container justify="center" alignItems="center">
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
                                  <HighlightOff/> Eliminar de Favoritos
                           </Button>
                            </Grid>
                          </Grid>
                          <Grid item>
                              <Typography variant="subtitle1">{"Bs " + item.price + "/ Kg"}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </div>
              </Grid>
            ); // Termina el return, mostrando cada una de las tarjetas de productos.
          })
          }
      </Grid>
      </ul>
    </Fragment>
  );
}

export default Favorites;