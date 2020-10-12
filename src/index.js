import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

//Función para control de colores y tema.
const theme = createMuiTheme({
    palette: {
      background: {
         default: "#F5F5DC"
       },     
       primary: {
          main: "#82AE46" // Verde
                 },
       secondary: {
          main: "#E4B2D6" //Rosado
                  }
             },
  });

ReactDOM.render(<ThemeProvider theme={theme}><App /></ThemeProvider>,document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
