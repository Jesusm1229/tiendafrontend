import React, {useState} from 'react';
// Componentes de Material-UI.
import {Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, FormLabel} from '@material-ui/core';
// Iconos de Material-UI.
import {LockOutlined, LockOpen} from '@material-ui/icons';
// Redireccionamientos.
import { Link as RouterLink, withRouter} from 'react-router-dom';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Componente para el Selector de Avatar de Usuario.
import AvatarEdit from 'react-avatar-edit';
// Encriptar y Desencriptar credenciales.
import { Base64 } from 'js-base64';
// Importando Estilos.
import {useStyles} from './styles';

// Creacion de Link RouterDOM para cambio de paginas sin renderizar todo nuevamente.
const MyLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

// Footer de CopyRight.
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © Tienda E-Commerce ' + new Date().getFullYear()}
    </Typography>
  );
}

// Componente Funcional Signup.
const Signup = (props) => {

  //Llamado de la Función de Estilos.
  const classes = useStyles();

  // Hook para almacenar la imagen del usuario.
  const [avatarC, setAvatar] = useState({
    image: '',
    preview: '',
    avatarURL: ''
  });

  // Hook para almacenar el usuario.
  const [user, setUser] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    avatar: '',
    role: false,
});

  // Evento HandleChange para modificar y asignar los datos al Hook.
  const handleChange = (e) => {

    // Limites para la contrasena.
    if(e.target.name === 'password')
        if(e.target.value.length > 20)
          return;

    // Limites para el nombre y apellido.
    if(e.target.name === 'name' || e.target.name === 'lastname')
      if(e.target.value.length > 20)
          return;

    // Transforma el caracter ingresado a código ASCII.
    var key = e.target.value.charCodeAt(e.target.value.length - 1);

    // Validación del campo Nombre y Apellido, solo se podrán introducir letras.
    if(e.target.name === 'name' || e.target.name === 'lastname')
        if(key < 97 || key > 122) return;

    // Validación del campo email.
    if(e.target.name === 'email')
      if( (key > 31 && key < 45) || (key > 57 && key < 64) || (key > 64 && key < 95) || (key > 122 || key === 47 || key === 96)) return;

    // Validación del campo contraseña.
    if(e.target.name === 'password')
      if((key > 126 || key === 32)) return;
    
    // Almacenando el usuario en el Hook.
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  // Función principal para registrar usuario.
  const handleSubmit = (e) => {
    e.preventDefault();

    if(avatarC.image !== ''){
         // AVATAR.
         console.log(avatarC.image.name);
         const storageRef = firebase.storage().ref(`avatars/${avatarC.image.name}`);
         storageRef.put(avatarC.image).then(function(result){

             storageRef.getDownloadURL().then(function(url){
                console.log("URL: " + url);
                avatarC.avatarURL = url;

                // Asignando la URL sacada del Firebase Storage al avatar del usuario.
                user.avatar = avatarC.avatarURL;

                // Registrando y autenticando al nuevo usuario.
                firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(response => {
                    // Encriptando la contraseña del registro de usuario.
                    user.password = Base64.encode(user.password);

                    firebase.database().ref(`/users/${response.user.uid}`).set(user);
                    alert('Bienvenido a Tienda E-Commerce');
                    props.history.push('/');
                })
                .catch(error => {
                    console.log(error);
                    alert(error.message);
                });
            });
        });
    }else{
          // Registrando y autenticando al nuevo usuario.
          firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
          .then(response => {
              // Encriptando la contraseña del registro de usuario.
              user.password = Base64.encode(user.password);

              firebase.database().ref(`/users/${response.user.uid}`).set(user);
              alert('Bienvenido a Tienda E-Commerce');
              props.history.push('/');
          })
          .catch(error => {
              console.log(error);
              alert(error.message);
          });
    }
}

// Funcion para quitar la foto elegida.
const onClose = () => {
  setAvatar({
    image: '',
    preview: '',
    avatarURL: ''
  });
}

// Fijando el nuevo previo a la foto del user.
const onCrop = (preview) => {
    avatarC.preview = preview;
    console.log(preview.name);
    console.log(avatarC.image.name);
}

// Verificando el tamaño de la imagen y 
const onBeforeFileLoad = (elem) => {

  if(elem.target.files[0].type === "image/jpeg" || elem.target.files[0].type === "image/jpg" || elem.target.files[0].type === "image/png"){

    if(elem.target.files[0].size > 71680){
      alert("La imagen es demasiado grande, elija otra.");
      elem.target.value = "";
    };

    // Fijando la imagen tomada al state.
    avatarC.image = elem.target.files[0];
  }else{
    elem.target.value = "";
    alert("Formato de imagen incorrecto. Elija una imagen.");
    return;
  }
}

return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography align="center" component="h1" variant="h5">
          Registro de Usuario
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
                autoComplete="lname"
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
              <Link to="/login" component={MyLink} variant="body2">
              <LockOpen/>Ya posees cuenta? Inicia Sesión.
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}><Copyright /></Box>
    </Container>
  );
}

export default withRouter(Signup);