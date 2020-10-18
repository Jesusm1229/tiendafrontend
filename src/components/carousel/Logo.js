import React from 'react';
import './styles.css';

function Logo(){ 
return(
    <div>
    <div className = "Logo" >
      <img src = {require('../../images/LOGO.png')} alt = "Logo" width= "50%" object-fit = "cover"/> 
      
    </div>

    <div className= "frescura">
        <img src = {require('../../images/frescura.png')} alt = "frescura" width= "100%" /> 
    </div>

    <div className= "alcance">
        <img src = {require('../../images/alcance.png')} alt = "alcance" width= "100%"  /> 
    </div>


    </div>
  );
  
 }
    export default Logo;