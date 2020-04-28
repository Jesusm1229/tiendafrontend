import React, {useState, useEffect} from 'react'
// Redireccionamientos.
import {withRouter} from 'react-router-dom';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Importando estilos.
import {useStyles} from './styles';
// Componentes de Material-UI.
import {Button, Grid, Container, CssBaseline, Avatar, Typography, CircularProgress} from '@material-ui/core';
// Componente de Avatar-Selector.
import AvatarEdit from 'react-avatar-edit';
// Iconos de Material-UI.
import {PhotoCamera} from '@material-ui/icons';

// Componente Funcional User.
const ChangeAvatar = (props) => {

  // Llamado de la Función de Estilos.
  const classes = useStyles();

  // Hook para almacenar la imagen del usuario.
  const [avatarImage, setAvatarImage] = useState("");

  // Hook para almacenar el usuario logueado.
  const [userphoto, setUserPhoto] = useState("");

  // Hook para mostrar el progress o boton de subir avatar.
  const [showProgress, setshowProgress] = useState(false);
  
  // Hook para almacenar el usuario logueado.
  const [userin, setUserin] = useState(false);

  useEffect(() =>{

    firebase.auth().onAuthStateChanged(function(user) { 
        if(user){
            setUserin(true);
            firebase.database().ref().child('users').orderByKey()
            .once('value', snap => {
            snap.forEach(child => {
                if(user.uid === child.key){
                    setUserPhoto(child.val().avatar);
                    setAvatarImage(child.val().avatar);
                }
            })
          })
        }
        else
            setUserPhoto(null);
      });
  },[]);

  // Funcion para quitar la foto elegida.
  const onClose = () => {
    setAvatarImage('');
    console.log("Quitaste la foto");
  }
  
  // Verificando el tamaño de la imagen y 
  const onBeforeFileLoad = (elem) => {
  
    if(elem.target.files[0].type === "image/jpeg" || elem.target.files[0].type === "image/jpg" || elem.target.files[0].type === "image/png"){
  
      if(elem.target.files[0].size > 71680){
        alert("La imagen es demasiado grande, elija otra.");
        elem.target.value = "";
        return;
      };
  
      // Fijando la imagen tomada al state.
      setAvatarImage(elem.target.files[0]);
    }else{
      elem.target.value = "";
      alert("Formato de imagen incorrecto. Elija una imagen.");
      return;
    }
  }

  // Funcion para cambiar el avatar del usuario o administrador.
  const handleUpload = (e) => {
    e.preventDefault();
    setshowProgress(true);

            // Casos donde no ha realizado ningun cambio de avatar.
            if((userphoto === "" && avatarImage === "") || (userphoto === avatarImage)){
                alert("No has realizado ningun cambio.");
                setshowProgress(false);
                return;
            }

            // Eliminar avatar existente.
            if(userphoto !== "" && avatarImage === ""){
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).update({ 
                    avatar: "",
                  })
                  .catch(error => {
                    console.log(error.message);
                    alert("Error al actualizar el avatar.");
                    setshowProgress(false);
                  });

                  alert("Avatar Eliminado."); 
                  props.history.push('/');
                  window.location.reload(false);
            }

            // Editar Avatar existente.
            if(avatarImage !== ""){
                // AVATAR.
                console.log(avatarImage.name);
                const storageRef = firebase.storage().ref(`avatars/${avatarImage.name}`);
                storageRef.put(avatarImage).then(function(result){

                    storageRef.getDownloadURL().then(function(url){
                        firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).update({ 
                            avatar: url,
                        })
                        .catch(error => {
                            console.log(error.message);
                            alert("Error al actualizar el avatar.");
                            setshowProgress(false);
                        });
                          
                          alert("Avatar Editado con Exito."); 
                          props.history.push('/');
                          window.location.reload(false);
                    })
                    .catch(error => {
                          console.log(error.message);
                          alert("Error obtencion de datos del perfil.");
                          setshowProgress(false);
                    });
                })
                .catch(error =>{
                    console.log(error.message);
                    alert("Error al cargar la imagen.");
                    setshowProgress(false);
                });
            }
  }

  return(
    <div>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        {userin?
        <div>
            <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <PhotoCamera />
            </Avatar>
            <Typography align="center" component="h1" variant="h5">
                Cambio de Avatar
            </Typography>
            <Grid container justify="center" alignItems="center">
                { userphoto !== ""?
                <div>
                    <AvatarEdit
                        width={150}
                        height={150}
                        onClose={onClose}
                        onBeforeFileLoad={onBeforeFileLoad}
                        src={userphoto}
                    />
                </div>
                : <div/>
                }
                { userphoto === ""?
                <div> 
                    <AvatarEdit
                        width={150}
                        height={150}
                        onClose={onClose}
                        onBeforeFileLoad={onBeforeFileLoad}
                        src={""}
                    />
                </div>
                : <div/>
                }
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
                onClick={handleUpload}
            >
            Guardar cambios
            </Button>
          </div>
          }
          </div>
        </div>
        : <div/>
        }
        </Container>
    </div>
    )
};

export default withRouter(ChangeAvatar);