import React, {useState, useEffect, useRef} from 'react';
import {Link, Grid, Box, Avatar, Button, CssBaseline, TextField, FormControlLabel, Typography, Container, Checkbox, FormControl, InputLabel, Select, MenuItem, CircularProgress} from '@material-ui/core';
import {LockOutlined, Cancel} from '@material-ui/icons';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Redireccionamientos.
import { Link as RouterLink, withRouter} from 'react-router-dom';
// Importando los Estilos. (Se importa el mismo estilo del Login de Usuario para resumir código).
import {useStyles} from '../login/styles';
// Importando Alert de SnackBar.
import Snackbar from '../snackbar/Snackbar';

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

  // Hook que almacena la direccion de correo del admin.
  const [direction, setDirection] = useState(null);

  // Hook para mostrar el progress o boton ingresar para el login.
  const [showProgress, setshowProgress] = useState(false);

  // Labels y Hooks para las direcciones de correos.
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  // Contenido del Snackbar.
  const[snack, setsnack] = useState({
      motive: '',
      text: '',
      appear: false,
  });
   
   useEffect(() => {
     setLabelWidth(inputLabel.current.offsetWidth);
     setDirection("@gmail.com");
   }, []);

  // Cambio en la tarjeta del administrador, cada vez que alguien inicia sesion.
  const handleChange = (e) => {

    // Limites para la contrasena.
    if(e.target.name === 'password' && e.target.value.length > 20)
        return;

    // Transforma el caracter ingresado a código ASCII.
    var key = e.target.value.charCodeAt(e.target.value.length - 1);

    // Validación del campo email.
    if(e.target.name === 'email')
      if( (key > 31 && key < 45) || (key > 57 && key < 65) || (key >= 64 && key < 95) || key > 122 || key === 47 || key === 96 ) return;
    
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

        setsnack({ appear: false, });
        setshowProgress(true);

            // Realizando consulta para que solo usuarios puedan acceder a traves de este login.
            var ref = firebase.database().ref("users");
            ref.orderByChild("email").equalTo(admin.email + direction).on("child_added", function(snapshot) {
              // Si el role es 'true', iniciara sesion como administrador, sino no podrá iniciar sesion por ser usuario.
              if(snapshot.val().role){
                  firebase.auth().signInWithEmailAndPassword(admin.email + direction, admin.password)
                  .then(response => {
                      // Una vez autenticado el administrador, redirecciona a la home.
                      props.history.push('/');
                  })
                  .catch(error => {
                    console.log(error);
                    setshowProgress(false);
                  });
              }
              else{
                  setshowProgress(false);
                  setsnack({
                    motive: 'error', text: 'Has introducido credenciales no validas o una cuenta de admin no existente', appear: true,
                  });
              }
            });

            ref.orderByChild("email").equalTo(admin.email + direction).once("value", snapshot => {
              if(!snapshot.exists()){
                  setshowProgress(false);
                  setsnack({
                    motive: 'error', text: 'Has introducido credenciales erroneas o una cuenta no existente.', appear: true,
                  });
              }
          });
  };

  // Funcion dedicada para modificar las direcciones del correo.
  const handleModified = (event) => {
    setDirection(event.target.value);
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
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="email"
                name="email"
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Correo"
                autoFocus
                value={admin.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                    Direccion*
                </InputLabel>
                <Select
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                     required
                     onChange={handleModified}
                     labelWidth={labelWidth}
                     defaultValue={"@gmail.com"}
                >
                     <MenuItem value={"@gmail.com"}>@gmail.com</MenuItem>
                     <MenuItem value={"@hotmail.com"}>@hotmail.com</MenuItem>
                     <MenuItem value={"@outlook.com"}>@outlook.com</MenuItem>
                     <MenuItem value={"@yahoo.com"}>@yahoo.com</MenuItem>
                </Select>
            </FormControl>
            </Grid>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoFocus
            autoComplete="current-password"
            value={admin.password}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Recuerdame"
          />
           </Grid>
           {showProgress?
          <Grid container justify="center" alignItems="center">
          <div className={classes.root}>
              <CircularProgress disableShrink color="secondary" />
          </div>
          </Grid>
          :
          <div>
             <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Ingresar
          </Button>
          </div>
          }
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
      {snack.appear?
        <div> <Snackbar motive={snack.motive} text={snack.text}/> </div>
        : <div/>
      }
    </Container>
  );
}

export default withRouter(AdminLogin);