import {makeStyles} from '@material-ui/core/styles';

// Estilo de las tarjetas de favorites.
export const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      margin: 'auto',
      maxWidth: 800,
      marginTop: theme.spacing(2),
    },
    image: {
      width: 160,
      height: 160,
    },
    img: {
      margin: 'auto',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
    },
  }));