import React, {useState, useEffect , Fragment} from 'react';
// Componentes de Material-UI.
import {Grid, Paper, Typography, ButtonBase} from '@material-ui/core';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Importando los Estilos.
import {useStyles} from './styles';

const Orders = () => {
  const classes = useStyles();

  // Hook para almacenar todos los productos.
  const [orders, setOrders] = useState([]);

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

          // Buscamos las compras del usuario logueado en la coleccion 'orders'.
          const reffavorites = firebase.database().ref().child('orders').orderByKey();
          let ordersArray = []
          reffavorites.once('value', snap => {
          snap.forEach(child => {

                if(child.val().user_id === firebase.auth().currentUser.uid){
                   firebase.database().ref('products/' + child.val().product_id)
                   .once('value')
                   .then(snapshot =>{

                      const order = {
                      name:         snapshot.val().name,
                      category:     snapshot.val().category,
                      description:  snapshot.val().description,
                      image:        snapshot.val().image,
                      total:        child.val().total,
                      quantity:     child.val().quantity,
                    };
                    ordersArray.push(order);

                  }).catch(error => {
                    console.log(error.message);
                 });
                }
              });
            setOrders(ordersArray);
          }).catch(error => {
            console.log(error.message);
         });
    },[userin]);

  return (
  <Fragment>
    <ul>
        {/*Si hay productos almacenados en el Hook se itera sobre ese arreglo Hook donde estarán almacenados todos las ordenes.*/}
        { orders && orders.map((item, index) => {
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
                              <Typography variant="body2" gutterBottom>
                                {"Cantidad: " + item.quantity}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {item.description}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid item>
                              <Typography variant="subtitle1">{"Total: "+ item.total + " Bs"}</Typography>
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

export default Orders;