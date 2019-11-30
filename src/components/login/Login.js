import React, {useState} from 'react';
import {Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, makeStyles, Container} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// Para el manejo de Links de tipo componentes.
import { Link as RouterLink, withRouter} from 'react-router-dom';
// Base de Datos.
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
// Icono para el link -> No tengo una cuenta.
import CancelIcon from '@material-ui/icons/Cancel';
// Firebase autenticacion con Google y Facebook.
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

// Creacion de Link RouterDOM para cambio de paginas sin renderizar todo nuevamente.
const MyLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Tienda E-Commerce
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = (props) => {
  const classes = useStyles();

  // Login con Facebook y Google.
    //const state = { isSignedIn: false }
    const uiConfig = {
      signInFlow: "popup",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccess: () => false,
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          console.log('signInSuccessWithAuthResult', authResult, redirectUrl);
          props.history.push('/');
          return false
      }
    }
  };

  // Aca finaliza el Login por Facebook y Google.

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  // Cambio en la tarjeta del usuario, cada vez que alguien inicia sesion.
  const handleChange = (e) => {

    var key = e.target.value.charCodeAt(e.target.value.length - 1);

    // Validación del campo email.
    if(e.target.name === 'email')
      if( (key > 31 && key < 45) || (key > 57 && key < 64) || (key > 64 && key < 95) || (key > 122 || key === 47 || key === 96)) return;

     // Validación del campo contraseña.
    if(e.target.name === 'password')
      if((key > 126 || key === 32)) return;
      
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  // Funcion para autenticar a un usuario e ingresar al sistema.
  const handleLogin = (e) => {
    e.preventDefault();

    // Realizando consulta para que solo usuarios puedan acceder a traves de este login.
    var ref = firebase.database().ref("users");
    ref.orderByChild("email").equalTo(user.email).on("child_added", function(snapshot) {
      
      // Si el role es 'false', iniciara sesion como usuario, sino no podrá iniciar sesion por ser administrador.
      if(!snapshot.val().role){
    
          firebase.auth().signInWithEmailAndPassword(user.email, user.password)
          .then(response => {
              // Una vez autenticado el usuario, redirecciona a la home.
              props.history.push('/');
          })
          .catch(error => {
          console.log(error);
          alert(error.message);
          });
      }
      else{
          alert("No puedes iniciar sesión, posees cuenta de administrador.");
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Ingresar a Tienda E-Commerce
        </Typography>
        <form className={classes.form} onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            defaultValue={user.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            defaultValue={user.password}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Recuerdame"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Ingresar
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Olvidaste tu contraseña?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" component={MyLink} variant="body2">
              <CancelIcon/>{"No tengo una cuenta"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Grid container justify="center" alignItems="center">
      {/*Modulo de Login con Google y Facebook*/}
      <StyledFirebaseAuth 
          uiConfig={uiConfig} 
          firebaseAuth={firebase.auth()}
      />
      </Grid>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default withRouter(Login);