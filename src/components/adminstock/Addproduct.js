import React, {useState, useEffect, useRef} from 'react';
// Componentes de Material-UI.
import {Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, FormLabel, MenuItem, FormControl, InputLabel, Select, OutlinedInput, InputAdornment, FormHelperText} from '@material-ui/core';
// Iconos de Materia-UI.
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Componente para el Selector de Avatar de Usuario.
import AvatarEdit from 'react-avatar-edit';
import clsx from 'clsx';
// Importando los Estilos.
import {useStyles} from './styles';

// Funcion de CopyRight para el footer de la pagina.
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © Tienda E-Commerce ' + new Date().getFullYear()}
    </Typography>
  );
}

// Componente Funcional Addproduct.
const Addproduct = () => {

  // Llamado de la función de Estilos.
  const classes = useStyles();

  // Hook para las propiedades del producto.
  const [product, setProduct] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
    stock: '',
});

// Hook para la categoria de los productos.
const [category, setCategory] = useState('');

// Funcion HandleChange para modificar y asignar los datos al Hook.
const handleChange = (e) => {

  // Transforma el caracter ingresado a código ASCII.
  var key = e.target.value.charCodeAt(e.target.value.length - 1);

    // Validación del campo Nombre y Descripción, solo se podrán introducir letras.
    if(e.target.name === 'name' || e.target.name === 'description')
        if( key !== 32 && (key < 97 || key > 122)) return;

    // Validación del campo Precio, solo se podrán introducir numeros y un maximo de 5 digitos.
    if(e.target.name === 'price' || e.target.name === 'stock')
            if(key < 48 || key > 57) return;

    // Almacenando en el Hook el producto.
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
      [e.target.description]: e.target.value,
      [e.target.category]: e.target.value,
      [e.target.price]: e.target.price,
      [e.target.stock]: e.target.stock,
    });
};

  // Labels y Hooks para las categorias de productos.
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

// Funcion dedicada para modificar las categorias de los productos.
const handleModified = (event) => {
    product.category = event.target.value;
    setCategory(event.target.value);
  };

// Verificando el tamaño de la imagen y almacenando la propiedad image del Hook.
const onBeforeFileLoad = (elem) => {
    if(elem.target.files[0].size > 91680){
      alert("La imagen es demasiado grande, elija otra.");
      elem.target.value = "";
    };

    // Fijando la imagen tomada al hook de product.
    product.image = elem.target.files[0];
    console.log(product.image.name);
}

 // Funcion para quitar la foto elegida.
 const onClose = () => {
    product.image = '';
}

// Funcion para suministrar todos los datos a la base de datos.
const handleSubmit = (e) => {
    e.preventDefault();

    if(product.image && product.category !== ''){
        // Imagen del producto.
        console.log(product.image.name);
        const storageRef = firebase.storage().ref(`products/${product.image.name}`);
        storageRef.put(product.image).then(function(result){

            storageRef.getDownloadURL().then(function(url){
               // Asignando la URL sacada del Firebase Storage al avatar del administrador.

                const newProduct = {
                    name: product.name,
                    image: url,
                    price: product.price,
                    category: product.category,
                    description: product.description,
                    stock: product.stock
                };

                firebase.database().ref('/products').push(newProduct)
                .then(response =>{
                    alert("Producto Agregado con Exito.");  
                })
                .catch(error => {
                    console.log(error);
                    alert(error.message);
                });
            });
        });
    }
    else
        alert("Complete el formulario.");
}

return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography align="center" component="h1" variant="h5"> Agregar un producto </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Nombre Producto"
                autoFocus
                value={product.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                    Categoria*
                </InputLabel>
                <Select
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                     required
                     value={category}
                     onChange={handleModified}
                     labelWidth={labelWidth}
                >
                <MenuItem value="">
                     <em>Ninguna</em>
                     </MenuItem>
                     <MenuItem value={"Pescaderia"}>Pescaderia</MenuItem>
                     <MenuItem value={"Carniceria"}>Carniceria</MenuItem>
                     <MenuItem value={"Charcuteria"}>Charcuteria</MenuItem>
                     <MenuItem value={"Frutas"}>Frutas</MenuItem>
                     <MenuItem value={"Verduras"}>Verduras</MenuItem>
                     <MenuItem value={"Vegetales"}>Vegetales</MenuItem>
                </Select>
            </FormControl>
            </Grid>
            <Grid container justify="center" alignItems="center">
                <FormLabel>Selecciona un imagen del producto.</FormLabel>
            </Grid>
            <Grid container justify="center" alignItems="center">
            <AvatarEdit
              width={250}
              height={130}
              onClose={onClose}
              onBeforeFileLoad={onBeforeFileLoad}
            />
            </Grid>
            <Grid container justify="center" alignItems="center">
                <FormControl className={clsx(classes.margin, classes.textField, classes.priceModule)} variant="outlined">
                <OutlinedInput
                    id="outlined-adornment-weight"
                    name="price"
                    required
                    value={product.price}
                    onChange={handleChange}
                    endAdornment={<InputAdornment position="end">Bs</InputAdornment>}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                    'aria-label': 'weight',
                    }}
                    labelWidth={0}
                />
                    <FormHelperText id="outlined-weight-helper-text">Precio</FormHelperText>
                </FormControl>
            </Grid>
            <Grid container justify="center" alignItems="center">
                <FormControl className={clsx(classes.margin, classes.textField, classes.priceModule)} variant="outlined">
                <OutlinedInput
                    id="outlined-adornment-weight"
                    name="stock"
                    required
                    value={product.stock}
                    onChange={handleChange}
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                    'aria-label': 'weight',
                    }}
                    labelWidth={0}
                />
                    <FormHelperText id="outlined-weight-helper-text">Stock del Producto</FormHelperText>
                </FormControl>
            </Grid>
            <Grid container justify="center" alignItems="center">
            <TextField
                id="outlined-multiline-static"
                label="Descripción producto"
                multiline
                required
                rows="5"
                value={product.description}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                fullWidth
                autoComplete="fdescription"
                name="description"
                autoFocus
                onChange={handleChange}
            />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Agregar Producto
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}><Copyright /></Box>
    </Container>
  );
}

export default Addproduct;