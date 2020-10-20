import React, {useState} from 'react';
// Importando el NPM de Pagos con PayPal.
import PaypalBtn from 'react-paypal-checkout';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Redireccionamientos.
import { withRouter } from 'react-router-dom';
// Importando Alert de SnackBar.
import Snackbar from '../snackbar/Snackbar';

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

    // Contenido del Snackbar.
    const[snack, setsnack] = useState({
        motive: '',
        text: '',
        appear: false,
    });
    
    // Funcion que efectuara el pago via PayPal.
    const onSuccess = (payment) => {
        setsnack({ appear: false, });
        console.log("El Pago ha sido realizado con exito.", payment);

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
                setsnack({
                    motive: 'error', text: 'Se ha producido un error en Proceso de Pago', appear: true,
                });
            });
        }

        // Eliminando los productos del shoppingCart.
        const shoppingRef = firebase.database().ref().child('shoppingcart').orderByKey();
        shoppingRef.once('value', snap => {
        snap.forEach(child => {

            for(var counter = 0; counter < props.order.shoppingcart.length; counter++)
                if(props.order.shoppingcart[counter].id === child.val().product_id && firebase.auth().currentUser.uid === child.val().user_id){
                   firebase.database().ref('shoppingcart/' + child.key).remove()
                   .catch(error => {
                      console.log(error);
                   });
                }
            });
        }).catch(error => {
            console.log(error);
        });

        setsnack({
            motive: 'success', text: 'El Pago ha sido realizado con exito.', appear: true,
        });

        props.history.push("/");

        alert("El Pago ha sido realizado con exito.");
    }		

    // Funcion que realizara la cancelacion del pago.
    const onCancel = (data) => {
        setsnack({ appear: false, });

        setsnack({
            motive: 'info', text: 'El pago ha sido cancelado.', appear: true,
        });
    }	

    // Funcion que arrojara algun error ocurrido en la operacion del pago electronico.
    const onError = (err) => {
        setsnack({ appear: false, });
        
        setsnack({
            motive: 'error', text: 'Ha ocurrido un error.', appear: true,
        });	
    }
    
    return (
        <div>
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
            
            {snack.appear?
                <div> <Snackbar motive={snack.motive} text={snack.text}/> </div>
                : <div/>
            }
        </div>
    );
};

export default withRouter(PaypalCheckout);