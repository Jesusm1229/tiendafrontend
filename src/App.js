import React, {useState, useEffect} from 'react';

// Rediccionamientos.
import {BrowserRouter as Router} from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

// Estilos e Iconos.
import Button from '@material-ui/core/Button';
import CssBaseLine from '@material-ui/core/CssBaseline'

// Icono para el boton de registro y login.
import {HowToReg, VpnKey} from '@material-ui/icons';

// Componentes.
import Header from './components/header/Header';
import User from './components/user/User';
import Routes from './Routes';

// Base de Datos Firebase.
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDyCRZge5ATfhgPZpGFbcZrZLPmmqWDcLI",
  authDomain: "tienda-database-a1d33.firebaseapp.com",
  databaseURL: "https://tienda-database-a1d33.firebaseio.com",
  projectId: "tienda-database-a1d33",
  storageBucket: "tienda-database-a1d33.appspot.com",
  messagingSenderId: "413071785371",
  appId: "1:413071785371:web:ac337bac22ff2195f2f53e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const MyLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

function App() {

  // Funcion para que no cargue ningun usuario al principio de la aplicacion.
  const [user, setUser] = useState(null);

  // Funcion para cierre de sesion de usuario.
  const onLogout = () => {
    setUser(null);
  };

  // Evento para que este pendiente del status autenticado.
  useEffect(() =>{
    firebase.auth().onAuthStateChanged(response =>{
      // Si ocurre un response, hay un usuario autenticado.
      if(response){
        // Leer los datos del usuario.
        firebase.database().ref(`/users/${response.uid}`)
        .once('value')
        .then(snapshot =>{
          setUser(snapshot.val());
        });
      }
    });
  }, []);

  return (
    <Router>
      <CssBaseLine/>
          <Header>
              {/* Si no se encuentra un usuario logueado, entonces se mostrarán los botones de Login y Signup.*/}
              {!user && <Button to="/login" component={MyLink} color="inherit"><VpnKey/>Login</Button>}
              {!user && <Button to="/signup" component={MyLink} color="inherit"><HowToReg/>Signup</Button>}
                
              {/* Mostrar icono de usuario o administrador y opciones al momento de iniciar sesion. */}
              {user && <User user={user} onLogout={onLogout} />}
          </Header>
          <Routes/>
    </Router>
  );
}

export default App;