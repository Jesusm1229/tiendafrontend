import React, {useState, useEffect , Fragment} from 'react';
// Componentes de Material-UI.
import {Grid, Paper, Typography, ButtonBase} from '@material-ui/core';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Importando los Estilos.
import {useStyles} from './styles';

const Favorites = () => {
  const classes = useStyles();

  // Hook para almacenar todos los productos.
  const [products, setProducts] = useState([]);

   useEffect(() =>{

    firebase.auth().onAuthStateChanged((user) => {
      let productsArray = []
      if (user) {
          // Buscamos los favoritos del usuario logueado en la coleccion 'favorites'.
          const refFavorites = firebase.database().ref().child('favorites').orderByKey();
          refFavorites.once('value', snap => {
          snap.forEach(child => {

                if(child.val().user_id === user.uid){
                   firebase.database().ref('products/' + child.val().product_id)
                   .once('value')
                   .then(snapshot =>{
                    productsArray.push(snapshot.val());
                  });
                }
              });
            setProducts(productsArray);
          });
      }
    });
    }, []);

  return (
  <Fragment>
    <ul>
        {/*Si hay productos almacenados en el Hook se itera sobre ese arreglo Hook donde estarán almacenados todos los productos.*/}
        { products && products.map((item, index) => {
            return(
              <Grid container justify="center" alignItems="center">
                  <div className={classes.root}>
                    <Paper className={classes.paper} key={index}>
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
                              <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                Remove
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid item>
                              <Typography variant="subtitle1">{"Bs " + item.price}</Typography>
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

export default Favorites;