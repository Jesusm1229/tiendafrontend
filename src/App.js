import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import CssBaseLine from '@material-ui/core/CssBaseLine';

import Header from './components/header/Header';
import User from './components/user/User';
import Routes from './Routes';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCo6KH8xYCLGpQEBUjYcmNm4qfS3CnIlPE",
  authDomain: "tienda-database-99a8e.firebaseapp.com",
  databaseURL: "https://tienda-database-99a8e.firebaseio.com",
  projectId: "tienda-database-99a8e",
  storageBucket: "tienda-database-99a8e.appspot.com",
  messagingSenderId: "161923805569",
  appId: "1:161923805569:web:a39dffc22c7fbd9f62b880"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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

        {user && <User user={user} onLogout={onLogout} />}

      </Header>

      <Routes/>
 
    </Router>
  );
}

export default App;
