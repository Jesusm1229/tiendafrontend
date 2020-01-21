import React, {useState, useEffect , Fragment} from 'react';
// Componentes de Material-UI.
import {Grid, Paper, Typography, ButtonBase} from '@material-ui/core';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Importando los Estilos.
import {useStyles} from './styles';

const Stock = () => {
  const classes = useStyles();

  // Hook para almacenar todos los productos.
  const [products, setProducts] = useState([]);

   useEffect(() =>{

    firebase.auth().onAuthStateChanged((user) => {
      let productsArray = []
      if (user) {
          // Buscamos los productos y verificamos si su stock es menor o igual a 10.
          const refProducts = firebase.database().ref().child('products').orderByKey();
          refProducts.once('value', snap => {
          snap.forEach(child => {
                        if(parseInt(child.val().stock, 10) <= 10)
                            productsArray.push(child.val());
                  });
              });
          setProducts(productsArray);
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
                              <Typography variant="body2" gutterBottom>
                                {"Stock: " + item.stock}
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

export default Stock;