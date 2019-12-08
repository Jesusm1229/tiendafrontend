import React, {useState} from 'react'
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Componentes de Material-UI.
import { Button } from '@material-ui/core';
// Componente de Avatar-Selector.
import AvatarEdit from 'react-avatar-edit';

// Componente Funcion ImageUpload.
const ImageUpload = () => {

  // Hook para almacenar Avatar.
  const [avatar, setAvatar] = useState({
      image: null,
      preview: null,
      src: "",
      avatarURL: null
  });

    // Variable state con propiedades: image, preview y src inicializadas en null.
  const state = {image: null, preview: null, src: "", avatarURL: null}

  // Funcion para quitar la foto elegida.
  const onClose = () => {
        state.preview = null;
  }
    
  // Fijando el nuevo previo a la foto del user.
  const onCrop = (preview) => {
        state.preview = preview;
        console.log(preview.name);
        console.log(state.image.name);
  }
    
  // Verificando el tamaño de la imagen y 
  const onBeforeFileLoad = (elem) => {
        if(elem.target.files[0].size > 71680){
          alert("La imagen es demasiado grande, elija otra.");
          elem.target.value = "";
        };

        // Fijando la imagen tomada al state.
        state.image = elem.target.files[0];
  }
    
  // Método para subir la imagen al storage de Firebase.
  const handleUpload = (e) => {
        console.log(state.image.name);
        const storageRef = firebase.storage().ref(`avatars/${state.image.name}`);
        storageRef.put(state.image).then(function(result){

            storageRef.getDownloadURL().then(function(url){
                console.log("URL: " + url);
                state.avatarURL = url;
                console.log("state.avatarURL: " + state.avatarURL);
            });
        });
  }

  return (
        <div>
        <AvatarEdit
          width={150}
          height={150}
          onCrop={onCrop}
          onClose={onClose}
          onBeforeFileLoad={onBeforeFileLoad}
          src={state.src}
        />
        <Button onClick={handleUpload}>Subir</Button>
      </div>
    )  
}

export default ImageUpload;