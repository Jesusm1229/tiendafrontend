import {makeStyles} from '@material-ui/core/styles';

// Estilos de makeStyles.
export const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
          marginTop: theme.spacing(2),
        },
      },
  }));