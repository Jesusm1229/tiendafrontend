import React from 'react';
import { green } from '@material-ui/core/colors';
import {Menu, MenuItem, makeStyles, withStyles} from '@material-ui/core';

// Estilo para las tarjetas.
export const useStyles = makeStyles(theme => ({
    card: {
      maxWidth: 265,
      maxHeight: 510,
      backgroundColor: '#FFFFF0',
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(5),
      },
    root: {
        '& > *': {
          margin: theme.spacing(1),
          width: 35,
          height: 25,
        },
    },
    media: {
      height: 230,
      width: 270,
      paddingTop: '56.25%', // 16:9
    },
    avatar: {
      backgroundColor: green[500],
    },
  }));

  // Estilos para el Menu Selector.
export const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
    })(props => (
        <Menu
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          {...props}
        />
    ));
  
  // Estilos para el engranaje de opciones (Editar y Eliminar) de la tarjeta.
export const StyledMenuItem = withStyles(theme => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);