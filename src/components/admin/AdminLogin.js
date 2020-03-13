import React, {useState} from 'react';
import {Link, Grid, Box, Avatar, Button, CssBaseline, TextField, FormControlLabel, Typography, Container, Checkbox} from '@material-ui/core';
import {LockOutlined, Cancel} from '@material-ui/icons';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Redireccionamientos.
import { Link as RouterLink, withRouter} from 'react-router-dom';
// Importando los Estilos. (Se importa el mismo estilo del Login de Usuario para resumir código).
import {useStyles} from '../login/styles';

// Creacion de Link RouterDOM para cambio de paginas sin renderizar todo nuevamente.
const MyLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

// Footer CopyRight.
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © Administradores - Tienda E-Commerce ' + new Date().getFullYear()}
    </Typography>
  );
}

// Componente Funcional AdminLogin.
const AdminLogin = (props) => {

  // Llamando a la función del estilo.
  const classes = useStyles();

  // Hook para almacenar las credenciales del administrador.
  const [admin, setAdmin] = useState({
    email: '',
    password: ''
  });

  // Cambio en la tarjeta del administrador, cada vez que alguien inicia sesion.
  const handleChange = (e) => {

    // Limites para la contrasena.
    if(e.target.name === 'password')
        if(e.target.value.length > 20)
          return;

    // Transforma el caracter ingresado a código ASCII.
    var key = e.target.value.charCodeAt(e.target.value.length - 1);

    // Validación del campo email.
    if(e.target.name === 'email')
      if( (key > 31 && key < 45) || (key > 57 && key < 64) || (key > 64 && key < 95) || (key > 122 || key === 47 || key === 96)) return;
    
     // Validación del campo contraseña.
    if(e.target.name === 'password')
      if((key > 126 || key === 32)) return;

    // Almacenando el administrador dentro del Hook.
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value
    });
  };

  // Funcion para autenticar a un usuario e ingresar al sistema.
  const handleLogin = (e) => {
        e.preventDefault();
    
        // Realizando consulta para que solo usuarios puedan acceder a traves de este login.
        var ref = firebase.database().ref("users");
        ref.orderByChild("email").equalTo(admin.email).on("child_added", function(snapshot) {
          
          // Si el role es 'true', iniciara sesion como administrador, sino no podrá iniciar sesion por ser usuario.
          if(snapshot.val().role){
        
              firebase.auth().signInWithEmailAndPassword(admin.email, admin.password)
              .then(response => {
                  // Una vez autenticado el administrador, redirecciona a la home.
                  props.history.push('/');
              })
              .catch(error => {
              console.log(error);
              alert(error.message);
              });
          }
          else
              alert("No puedes iniciar sesión, posees cuenta de usuario.");
        });
      };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography align="center" component="h1" variant="h5">Ingreso de Administrador</Typography>
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
            defaultValue={admin.email}
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
            defaultValue={admin.password}
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
              <Link to="/adminsignup" component={MyLink} variant="body2">
              <Cancel/>{"No tengo cuenta"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}><Copyright /></Box>
    </Container>
  );
}

export default withRouter(AdminLogin);