import React, {useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
// Importando Estilos.
import {useStyles} from './styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CustomizeSnackbar = (props) => {

  //Llamado de la Función de Estilos.
  const classes = useStyles();

  // Abrir o cerrar snackbar.
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway')
      return;
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.motive}>
          {props.text}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CustomizeSnackbar;