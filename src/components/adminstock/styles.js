import {makeStyles} from '@material-ui/core/styles';

// Estilos de material UI para las interfaces.
export const useStyles = makeStyles(theme => ({
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
    formControl: {
      margin: theme.spacing(0),
      width: '100%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    priceModule: {
        marginTop: theme.spacing(2),
    }
  }));