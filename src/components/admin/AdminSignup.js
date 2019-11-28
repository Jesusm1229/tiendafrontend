import React, {useState} from 'react';
import {Link, Grid, Box, Typography, makeStyles, Container, FormLabel, Checkbox, FormControlLabel, TextField, CssBaseline, Button, Avatar} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// Icono de inicio de sesion via link.
import LockOpenIcon from '@material-ui/icons/LockOpen';
// Redireccionamientos.
import { Link as RouterLink, withRouter} from 'react-router-dom';
// Base de Datos.
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
// Encriptar y Desencriptar credenciales.
import { Base64 } from 'js-base64';
// Componente para el Selector de Avatar de Administrador.
import AvatarEdit from 'react-avatar-edit';

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const AdminSignup = (props) => {
  const classes = useStyles();

  const [avatarC, setAvatar] = useState({
    image: null,
    preview: null,
    avatarURL: null
  });

  const [user, setUser] = useState({
      name: '',
      lastname: '',
      email: '',
      password: '',
      avatar: '',
      role: true
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  // Funcion de Registro de Administrador.
  const handleSubmit = (e) => {
    e.preventDefault();

    if(avatarC.image != null){
         // AVATAR.
         console.log(avatarC.image.name);
         const storageRef = firebase.storage().ref(`avatars/${avatarC.image.name}`);
         storageRef.put(avatarC.image).then(function(result){

             storageRef.getDownloadURL().then(function(url){
                console.log("URL: " + url);
                avatarC.avatarURL = url;

                // Asignando la URL sacada del Firebase Storage al avatar del administrador.
                user.avatar = avatarC.avatarURL;

                // Registrando y autenticando al nuevo administrador.
                firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(response => {
                    // Encriptando la contraseña del registro de administrador.
                    user.password = Base64.encode(user.password);

                    firebase.database().ref(`/users/${response.user.uid}`).set(user);
                    alert('Ya puedes administrar la Tienda E-commerce');
                    props.history.push('/');
                })
                .catch(error => {
                    console.log(error);
                    alert(error.message);
                });
            });
        });
    }else
      alert("Debes introducir un avatar.");
}

   // Funcion para quitar la foto elegida.
   const onClose = () => {
    setAvatar({
      preview: null
    });
    
    avatarC.preview = null;
  }

   // Fijando el nuevo previo a la foto del user.
   const onCrop = (preview) => {
      avatarC.preview = preview;
      console.log(preview.name);
      console.log(avatarC.image.name);
   }

   // Verificando el tamaño de la imagen y 
   const onBeforeFileLoad = (elem) => {
      if(elem.target.files[0].size > 71680){
         alert("La imagen es demasiado grande, elija otra.");
         elem.target.value = "";
      };

    // Fijando la imagen tomada al state.
    avatarC.image = elem.target.files[0];
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registro de Administrador
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Nombre"
                autoFocus
                value={user.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastname"
                label="Apellido"
                name="lastname"
                //autoComplete="lname"
                value={user.lastname}
                onChange={handleChange}
              />
            </Grid>
            <Grid container justify="center" alignItems="center">
                <FormLabel>Selecciona un avatar</FormLabel>
            </Grid>
            <Grid container justify="center" alignItems="center">
            <AvatarEdit
              width={130}
              height={130}
              onCrop={onCrop}
              onClose={onClose}
              onBeforeFileLoad={onBeforeFileLoad}
            />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="email"
                autoComplete="email"
                label="Correo Electronico"
                id="email"
                value={user.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={user.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="Quiero recibir informacion de productos y noticia de la tienda via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Registrarme
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/adminlogin" component={MyLink} variant="body2">
              <LockOpenIcon/>Ya posees cuenta de Administrador? Inicia Sesión.
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

export default withRouter(AdminSignup);