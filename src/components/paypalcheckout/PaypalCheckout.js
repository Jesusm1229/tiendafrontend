import React from 'react';
// Importando el NPM de Pagos con PayPal.
import PaypalBtn from 'react-paypal-checkout';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Redireccionamientos.
import { withRouter } from 'react-router-dom';

const PaypalCheckout = (props) => {

    const paypalConfig = {
        env: 'sandbox',
        currency: 'USD',
        total: parseFloat(props.order.total),
        style: {
            'label':'pay', 
            'tagline': false, 
            'size':'medium', 
            'shape':'pill', 
            'color':'gold'
        },
        client: {
            sandbox:    'ASZhaJzIJD5s2scuPvG6cVgNyM6iM9jOly9WSvPXsfEdwvAPNCrY0vD6YxUaDpVWxqWYN7UWcf6NkIrT',
            production: 'YOUR-PRODUCTION-APP-ID',
        },
    };
    
    // Funcion que efectuara el pago via PayPal.
    const onSuccess = (payment) => {
        console.log("El Pago ha sido realizado con exito.", payment);
        alert("El Pago ha sido realizado con exito.");

        // Agregando la orden del shopping cart a la coleccion Orders.
        for(var counter = 0; counter < props.order.shoppingcart.length; counter++){

            const newOrder = {
                user_id: firebase.auth().currentUser.uid,
                product_id: props.order.shoppingcart[counter].id,
                quantity: props.order.shoppingcart[counter].quantity,
                total: props.order.shoppingcart[counter].pricefinal,
            };

            firebase.database().ref('/orders').push(newOrder)
            .catch(error => {
                console.log(error);
                alert(error.message);
            });
        }

        // Eliminando los productos del shoppingCart.
        const shoppingRef = firebase.database().ref().child('shoppingcart').orderByKey();
        shoppingRef.once('value', snap => {
        snap.forEach(child => {

            for(var counter = 0; counter < props.order.shoppingcart.length; counter++)
                if(props.order.shoppingcart[counter].id === child.val().product_id && firebase.auth().currentUser.uid === child.val().user_id){
                   let shopRef = firebase.database().ref('shoppingcart/' + child.key);
                   shopRef.remove();
                }
            });
        });

        // Disminuir el stock de productos comprados por el usuario.
        for(var shopCart = 0; shopCart < props.order.shoppingcart.length; shopCart++){

            const product = props.order.shoppingcart[shopCart];

            firebase.database().ref(`products/${product.id}`)
            .once('value')
            .then(snapshot =>{ 

                const editProduct = {
                    name:        product.name,
                    image:       product.image,
                    price:       product.price,
                    category:    product.category,
                    description: product.description,
                    stock:       snapshot.val().stock - product.quantity,
                };

                firebase.database().ref(`products/${product.id}`).update(editProduct)
                .catch(error => {
                    console.log(error);
                });

            });
        }

        props.history.push("/");
    }		

    // Funcion que realizara la cancelacion del pago.
    const onCancel = (data) => {
        console.log('El pago ha sido cancelado.', data);
        alert("El pago ha sido cancelado.");
    }	

    // Funcion que arrojara algun error ocurrido en la operacion del pago electronico.
    const onError = (err) => {
        console.log("Error!", err);	
        alert("Ha ocurrido un error.");	
    }
    
    return (
        <PaypalBtn 
            env={paypalConfig.env} 
            client={paypalConfig.client} 
            currency={paypalConfig.currency} 
            total={paypalConfig.total} 
            style={paypalConfig.style}
            onError={onError} 
            onSuccess={onSuccess} 
            onCancel={onCancel}
        />
    );
};

export default withRouter(PaypalCheckout);