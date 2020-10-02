import React, {useState, useEffect, useRef} from 'react';
// Componentes de Material-UI.
import {Avatar, Button, CssBaseline, TextField, Grid, Box, Typography, Container, FormLabel, MenuItem, FormControl, InputLabel, Select, OutlinedInput, InputAdornment, FormHelperText, Link, CircularProgress} from '@material-ui/core';
// Base de Datos Firebase.
import firebase from '../../FirebaseConfig';
// Componente para el Selector de Avatar de Usuario.
import AvatarEdit from 'react-avatar-edit';
import clsx from 'clsx';
// Importando los Estilos.
import {useStyles} from './styles';
// Redireccionamientos.
import { Link as RouterLink, withRouter} from 'react-router-dom';
// Importando el useLocation para transferir states de un componente a otro.
import { useLocation } from 'react-router-dom';
// Importando Alert de SnackBar.
import Snackbar from '../snackbar/Snackbar';
// Iconos de Materia-UI.
import EditIcon from '@material-ui/icons/Edit';

// Componente Funcional Addproduct.
const Editproduct = (props) => {

  // Llamado de la función de Estilos.
  const classes = useStyles();

  // Hook para las propiedades del producto.
  const [product, setProduct] = useState({
    id:          useLocation().state.product.id,
    name:        useLocation().state.product.name,
    price:       useLocation().state.product.price,
    image:       useLocation().state.product.image,
    category:    useLocation().state.product.category,
    description: useLocation().state.product.description,
    stock:       useLocation().state.product.stock,
});

// Hook para la categoria de los productos.
const [category, setCategory] = useState('');

// Hook para almacenar si presiono o no el boton de edicion.
const [showProgress, setshowProgress] = useState(false);

// Hook para almacenar el usuario logueado.
const [userin, setUserin] = useState(false);

// Contenido del Snackbar.
const[snack, setsnack] = useState({
  motive: '',
  text: '',
  appear: false,
});

// Funcion HandleChange para modificar y asignar los datos al Hook.
const handleChange = (e) => {

  // Limite para campo de descripcion.
  if(e.target.name === 'description')
      if(e.target.value.length > 60)
        return;   
  
  if(e.target.name === 'price' || e.target.name === 'stock')
      if(e.target.value.length > 5)
        return;

  if(e.target.name === 'name')
      if(e.target.value.length > 20)
        return;

  // Transforma el caracter ingresado a código ASCII.
  var key = e.target.value.charCodeAt(e.target.value.length - 1);

    // Validación del campo Nombre y Descripción, solo se podrán introducir letras.
    if(e.target.name === 'name' || e.target.name === 'description'){
        if((e.target.value.length -1 === 0) && (key < 65 || key > 90) && (key < 97 || key > 122)) return;
        
        if((e.target.value.length -1 !== 0) && key !== 32 && (key < 97 || key > 122)) return;
    }

    // Validación del campo Precio, solo se podrán introducir numeros y un maximo de 5 digitos.
    if(e.target.name === 'price' || e.target.name === 'stock')
            if(key < 48 || key > 57) return;

    // Almacenando en el Hook el producto.
    setProduct({
      ...product,
      id: product.id,
      [e.target.name]: e.target.value,
      [e.target.description]: e.target.value,
      [e.target.category]: e.target.value,
      [e.target.price]: e.target.value,
      [e.target.stock]: e.target.value,
    });
};

  // Labels y Hooks para las categorias de productos.
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  useEffect(() => {
     // Verificamos si hay un usuario logueado.
     firebase.auth().onAuthStateChanged(function(user) { 
      if(user)
        setUserin(true);
    });

    if(!userin)
      return;

    setLabelWidth(inputLabel.current.offsetWidth);
  }, [userin]);

// Funcion dedicada para modificar las categorias de los productos.
const handleModified = (event) => {
    product.category = event.target.value;
    setCategory(event.target.value);
  };

// Verificando el tamaño de la imagen y almacenando la propiedad image del Hook.
const onBeforeFileLoad = (elem) => {

  if(elem.target.files[0].type === "image/jpeg" || elem.target.files[0].type === "image/jpg" || elem.target.files[0].type === "image/png"){

    if(elem.target.files[0].size > 91680){
      alert("La imagen es demasiado grande, elija otra.");
      elem.target.value = "";
      return;
    };

    // Fijando la imagen tomada al hook de product.
    product.image = elem.target.files[0];
    console.log(product.image.name);

  }else{
    elem.target.value = "";
    alert("Formato de imagen incorrecto. Elija una imagen.");
    return;
  }
}

 // Funcion para quitar la foto elegida.
 const onClose = () => {
    product.image = '';
}

// Funcion para realizar la efectiva edicion de un producto en particular.
const handleSubmit = (e) => {
    e.preventDefault();

    setsnack({ appear: false, });
    setshowProgress(true);

          // Verificando si ha realizado algun cambio, antes de realizar la consulta.
          firebase.database().ref(`products/${product.id}`)
          .once('value', snap => {
              
            if(snap.val().name === product.name && snap.val().price === product.price && snap.val().stock === product.stock &&
                snap.val().description === product.description && snap.val().image === product.image && snap.val().category === product.category){
                setsnack({
                  motive: 'info', text: 'No has realizado ninguna edicion.', appear: true,
                });
                setshowProgress(false);
                return;
              }

              if(product.image === ''){
                setsnack({
                  motive: 'info', text: 'Seleccione una imagen de producto.', appear: true,
                });
                setshowProgress(false);
                return;
              }

              if(product.image.name !== undefined){
                const storageRef = firebase.storage().ref(`products/${product.image}`);
                storageRef.put(product.image).then(function(result){
        
                    storageRef.getDownloadURL().then(function(url){

                        const editProduct = {
                            name: product.name,
                            image: url,
                            price: product.price,
                            category: product.category,
                            description: product.description,
                            stock: product.stock,
                        };

                        firebase.database().ref(`products/${product.id}`).update(editProduct)
                        .then(response =>{
                            setsnack({
                              motive: 'success', text: 'Producto Editado con Exito.', appear: true,
                            });
                            props.history.push("/");  
                        })
                        .catch(error => {
                            console.log(error.message);
                            setsnack({
                              motive: 'error', text: 'Se ha producido un error al editar el producto.', appear: true,
                            });
                        });
                    })
                    .catch(error => {
                          console.log(error.message);
                          setsnack({
                            motive: 'error', text: 'Error obtencion de datos del perfil.', appear: true,
                          });
                          setshowProgress(false);
                    });
                })
                .catch(error => {
                    console.log(error.message);
                    setsnack({
                      motive: 'error', text: 'Error al cargar la imagen.', appear: true,
                    });
                    setshowProgress(false);
                });
              }
              else{
                firebase.database().ref(`products/${product.id}`).update({ 
                  name: product.name,
                  price: product.price,
                  category: product.category,
                  description: product.description,
                  stock: product.stock,
                })
                .catch(error => {
                  console.log(error.message);
                  setsnack({
                    motive: 'error', text: 'Se ha producido un error al editar el producto.', appear: true,
                  });
                  setshowProgress(false);
                });
                
                setsnack({
                  motive: 'success', text: 'Producto Editado con Exito.', appear: true,
                });
                props.history.push("/"); 
              }
          })
          .catch(error => {
              console.log(error.message);
              setsnack({
                motive: 'success', text: 'Se ha producido un error de edicion del producto.', appear: true,
              });
              setshowProgress(false);
          });
} 

return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {userin?
      <div>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
            <EditIcon/>
        </Avatar>
        <Typography align="center" component="h1" variant="h5"> Editar producto </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="name"
                variant="outlined"
                required
                fullWidth
                label="Nombre del Producto"
                autoFocus
                value={product.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                    Categoria
                </InputLabel>
                <Select
                     labelId="demo-simple-select-outlined-label"
                     id="demo-simple-select-outlined"
                     required
                     value={product.category}
                     onChange={handleModified}
                     labelWidth={labelWidth}
                >
                <MenuItem value={category}>
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
                <FormLabel>Selecciona una imagen del producto.</FormLabel>
            </Grid>
            <Grid container justify="center" alignItems="center">
            <AvatarEdit
              width={250}
              height={130}
              onClose={onClose}
              onBeforeFileLoad={onBeforeFileLoad}
              src={product.image}
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
                label="Descripcion"
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
          <Grid container justify="center" alignItems="center">
            {showProgress?
            <div className={classes.root}>
                <CircularProgress disableShrink color="secondary" />
            </div>
            :
            <div>
                <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
                >
                  Editar Producto
              </Button>
            </div>
            }
          </Grid>
          <Grid container justify="center" alignItems="center">
          <Link to="/" component={React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />)} variant="body2">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Atras
          </Button>
          </Link>
          </Grid>
          <Grid container justify="flex-end">
            <Grid item>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}><Copyright /></Box>
      {snack.appear?
        <div> <Snackbar motive={snack.motive} text={snack.text}/> </div>
        : <div/>
      }
      </div>
        : <div/>
        }
    </Container>
  );
}

// Funcion de CopyRight para el footer de la pagina.
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © Tienda Medina y Gonzalez ' + new Date().getFullYear()}
    </Typography>
  );
}

export default withRouter(Editproduct);