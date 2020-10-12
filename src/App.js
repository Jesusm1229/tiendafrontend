import React, {useState, useEffect} from 'react';
// Rediccionamientos.
import {BrowserRouter as Router, Link as RouterLink} from 'react-router-dom';
// Estilos e Iconos.
import Button from '@material-ui/core/Button';
import CssBaseLine from '@material-ui/core/CssBaseline'
// Icono para el boton de registro y login.
import {HowToReg, VpnKey} from '@material-ui/icons';
// Componentes del proyecto.
import Header from './components/header/Header';
import User from './components/user/User';
import Routes from './Routes';

// Base de Datos Firebase.
import firebase from './FirebaseConfig';
//Footer
import Footer from './components/footer/Footer';

// Componente Funcional Principal.
const App = () => {

  // Funcion para que no cargue ningun usuario al principio de la aplicacion.
  const [user, setUser] = useState(null);

  // Funcion para cierre de sesion de usuario.
  const onLogout = () => {
    setUser(null);
  };

  // Evento para que este pendiente del status autenticado.
  useEffect(() =>{
    document.title = "Tienda Medina y Gonzalez"
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
          <Header user={user}>
              {/* Si no se encuentra un usuario logueado, entonces se mostrarán los botones de Login y Signup.*/}
              {!user && <Button to="/login" component={React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />)} color="inherit"><VpnKey/>Login</Button>}
              {!user && <Button to="/signup" component={React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />)} color="inherit"><HowToReg/>Signup</Button>}

              {/* Mostrar icono de usuario o administrador y opciones al momento de iniciar sesion. */}
              {user && <User user={user} onLogout={onLogout} />}
          
          </Header>          
          <Routes/>          
          <Footer/>
    </Router>
    
  );
}

export default App;