import React, {useState, useEffect, useRef} from 'react';
// Componentes de Material-UI.
import {Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, FormLabel, MenuItem, Select, FormControl, InputLabel, CircularProgress} from '@material-ui/core';
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
// Importando Alert de SnackBar.
import Snackbar from '../snackbar/Snackbar';

// Componente Funcional Signup.
const Signup = (props) => {

  //Llamado de la Función de Estilos.
  const classes = useStyles();

  // Hook para almacenar la imagen del usuario.
  const [avatarC, setAvatar] = useState({
    image: '',
    preview: '',
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

  // Hook para almacenar la direccion de correo del usuario.
  const [direction, setDirection] = useState(null);

   // Hook para mostrar el progress o boton de registrar.
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
      if( (key > 31 && key < 45) || (key > 57 && key < 64) || (key >= 64 && key < 95) || (key > 122 || key === 47 || key === 96)) return;

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

    setsnack({ appear: false, });
    setshowProgress(true);

    // Verificacion de contrasena.
    if(user.password.length < 6){
      setsnack({
        motive: 'warning', text: 'Has introducido una contrasena con menos de 6 caracteres.', appear: true,
      });
      setshowProgress(false);
      return;
    }

    if(avatarC.image !== ''){
      var ref = firebase.database().ref("users");
      ref.orderByChild("email").equalTo(user.email + direction).once("value", snapshot => {
      if(!snapshot.exists()){
            const storageRef = firebase.storage().ref(`avatars/${avatarC.image.name}`);
            storageRef.put(avatarC.image).then(function(result){

            storageRef.getDownloadURL().then(function(url){
                // Asignando la URL sacada del Firebase Storage al avatar del administrador.
                user.avatar = url;

                // Registrando y autenticando al nuevo administrador.
                firebase.auth().createUserWithEmailAndPassword(user.email + direction, user.password)
                .then(response => {
                    // Encriptando la contraseña del registro de administrador.
                    user.password = Base64.encode(user.password);
                    user.email = user.email + direction;

                    firebase.database().ref(`/users/${response.user.uid}`).set(user);
                    props.history.push('/');
                })
                .catch(error => {
                    setshowProgress(false);
                    setsnack({
                      motive: 'error', text: 'Error en Registro.', appear: true,
                    });
                });
            })
            .catch(error =>{
              setshowProgress(false);
              setsnack({
                motive: 'error', text: 'Error obtencion de datos del perfil.', appear: true,
              });
            });
          })
          .catch(error =>{
            setshowProgress(false);
            setsnack({
              motive: 'error', text: 'Error al cargar la imagen.', appear: true,
            });
          });
        }
        else{
          setshowProgress(false);
          setsnack({
            motive: 'warning', text: 'Has introducido una cuenta ya existente.', appear: true,
          });
        }
      })
      .catch(error => {
        setshowProgress(false);
        setsnack({
          motive: 'error', text: 'Error en Registro.', appear: true,
        });
      });
    }else{
       // Registrando y autenticando al nuevo usuario.
       firebase.auth().createUserWithEmailAndPassword(user.email + direction, user.password)
       .then(response => {
           // Encriptando la contraseña del registro de usuario.
           user.password = Base64.encode(user.password);
           user.email = user.email + direction;

           firebase.database().ref(`/users/${response.user.uid}`).set(user);
           props.history.push('/');
       })
       .catch(error => {
           setshowProgress(false);
           setsnack({
              motive: 'error', text: 'Error en registro es probable que hayas introducido una cuenta ya existente.', appear: true,
           });
       });
    }
}

// Funcion para quitar la foto elegida.
const onClose = () => {
  setAvatar({
    image: '',
    preview: '',
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

  setsnack({ appear: false, });

  if(elem.target.files[0].type === "image/jpeg" || elem.target.files[0].type === "image/jpg" || elem.target.files[0].type === "image/png"){

    if(elem.target.files[0].size > 71680){
      setsnack({
          motive: 'warning', text: 'La imagen es demasiado grande, elija otra.', appear: true,
      });
      elem.target.value = "";
      return;
    };

    // Fijando la imagen tomada al state.
    avatarC.image = elem.target.files[0];
  }else{
    elem.target.value = "";
    setsnack({
        motive: 'error', text: 'Formato de imagen incorrecto. Elija una imagen.', appear: true,
    });
    return;
  }
}

// Funcion dedicada para modificar las direcciones del correo.
const handleModified = (event) => {
  setDirection(event.target.value);
};

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
                value={user.email}
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
                     name="direction"
                >
                     <MenuItem value={"@gmail.com"}>@gmail.com</MenuItem>
                     <MenuItem value={"@hotmail.com"}>@hotmail.com</MenuItem>
                     <MenuItem value={"@outlook.com"}>@outlook.com</MenuItem>
                     <MenuItem value={"@yahoo.com"}>@yahoo.com</MenuItem>
                </Select>
            </FormControl>
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
            Registrarme
          </Button>
          </div>
          }
          <Grid container justify="flex-end">
            <Grid item>
              {/* // Creacion de Link RouterDOM para cambio de paginas sin renderizar todo nuevamente. */}
              <Link to="/login" component={React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />)} variant="body2">
              <LockOpen/>Ya posees cuenta? Inicia Sesión.
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

// Footer de CopyRight.
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright© Tienda Medina y Gonzalez ' + new Date().getFullYear()}
    </Typography>
  );
}

export default withRouter(Signup);