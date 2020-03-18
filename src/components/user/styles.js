import {makeStyles} from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';

// Estilos de makeStyles.
export const useStyles = makeStyles(theme => ({
    avatar: {
      margin: 10,
      height: 40,
      width: 40,
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
  }));