import React, {useState} from 'react';
import {Link, Grid, Box, Avatar, Button, CssBaseline, TextField, FormControlLabel, Typography, Container, makeStyles, Checkbox} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

// Base de Datos.
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Privado Sólo Administradores - Tienda E-Commerce
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

const AdminLogin = (props) => {
  const classes = useStyles();

  const [admin, setAdmin] = useState({
    email: '',
    password: ''
  });

  // Cambio en la tarjeta del administrador, cada vez que alguien inicia sesion.
  const handleChange = (e) => {
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
          else{
              alert("No puedes iniciar sesión, posees cuenta de usuario.");
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
          Ingreso de Administrador
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
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default AdminLogin;