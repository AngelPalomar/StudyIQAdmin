import React, { useState, useEffect } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputLabel,
    FormControlLabel, FormControl, TextField, Switch, Select, MenuItem,
    Typography, Button, CircularProgress, Input
} from '@material-ui/core'
import useStyles from './useStyles'
import firebase from '../../../database/firebase'

/**Componeneste */
import Snackbar from '../../../components/CustomSnackbar'

/**Helpers */
import { minLengthValidation } from '../../../helpers/validations'
import { get_error } from '../../../helpers/errors_es_mx'

function CreatePost(props) {
    const classes = useStyles()
    const { open, closeHandler } = props
    const [inputs, setInputs] = useState({
        texto: '',
        autor: window.localStorage.getItem('email'),
        imagenUrl: null
    })

    const [openSnack, setOpenSnack] = useState(false)
    const [severity, setSeverity] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    //Función para guardar datos en el estado
    const changeValues = (e) => {
        if (e.target.type === 'checkbox') {
            setInputs({
                ...inputs,
                activo: e.target.checked
            })
        } else if (e.target.type === 'file') {
            //Valida el tipo de archivo
            if (e.target.files[0].type === "image/jpeg" ||
                e.target.files[0].type === "image/png") {
                setInputs({
                    ...inputs,
                    imagenUrl: e.target.files[0]
                })
            } else {
                setOpenSnack(true)
                setSeverity('error')
                setMessage('Archivo inválido, solo extensiones .jpeg/.png')

                //Borra el archivo subido
                document.getElementById('input-imagenurl').value = ''

                return
            }
        } else {
            setInputs({
                ...inputs,
                [e.target.name]: e.target.value
            })
        }
    }

    //Función para reiniciar los campos
    const resetInputs = () => {
        setInputs({
            ...inputs,
            texto: '',
            autor: window.localStorage.getItem('email'),
            imagenUrl: null,
            fecha: ''
        })
    }

    //Función para subir usuario
    const createPost = async () => {
        //Validaciones
        if (!minLengthValidation(3, inputs.texto)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("El texto debe tener al menos 3 caracteres.")
            return
        }

        //Inicia carga
        setIsLoading(true)

        //Sube al servidor el usuario
        try {
            //Obtiene la fecha
            let today = new Date()

            //Verificamos si subió archvo
            if (inputs.imagenUrl) {
                //Referencia de storage
                const storageRef = firebase.storage.ref()

                //Folder
                const fileRef = await storageRef
                    .child('images')
                    .child('posts')
                    .child(inputs.imagenUrl.name)
                    .put(inputs.imagenUrl)

                //Obtiene la url
                const urlImage = await fileRef.ref.getDownloadURL();

                //Creamos un nuevo objeto con los datos
                let postObj = {
                    texto: inputs.texto,
                    autor: inputs.autor,
                    imagenUrl: urlImage,
                    fecha: {
                        dia: String(today.getDate()).padStart(2, '0'),
                        mes: String(today.getMonth() + 1).padStart(2, '0'),
                        anio: today.getFullYear().toString(),
                        hora: today.getHours().toString(),
                        minuto: today.getMinutes().toString(),
                        segundo: today.getSeconds().toString()
                    }
                }
                //Creamos publicacion con imagen
                const docPost = await firebase.db
                    .collection('publicaciones')
                    .add(postObj)

            } else {
                //Creamos publicacion sin imagen
                const docPost = await firebase.db
                    .collection('publicaciones')
                    .add({
                        ...inputs,
                        fecha: {
                            dia: String(today.getDate()).padStart(2, '0'),
                            mes: String(today.getMonth() + 1).padStart(2, '0'),
                            anio: today.getFullYear().toString(),
                            hora: today.getHours().toString(),
                            minuto: today.getMinutes().toString(),
                            segundo: today.getSeconds().toString()
                        }
                    })
            }

            //Muestra mensaje de completado
            setOpenSnack(true)
            setSeverity('success')
            setMessage("Publicado correctamente")

            //Cerramos el panel y limpiamos el formulario, paramos carga
            closeHandler()
            resetInputs()
            setIsLoading(false)

        } catch (error) {
            //Paramos carga
            setIsLoading(false)

            //Mostramos error
            setOpenSnack(true)
            setSeverity('error')
            setMessage(get_error(error.code()))
        }
    }

    return (
        <>
            <Snackbar open={openSnack} onClose={() => setOpenSnack(false)} severity={severity}>
                {message}
            </Snackbar>
            <Dialog
                open={open}
                onExit={resetInputs}
                onClose={closeHandler}>
                <DialogTitle>Crear Publicación</DialogTitle>
                <DialogContent>
                    <Typography>* Todos los campos son requeridos</Typography>
                    <form id="form-post" onChange={changeValues} className={classes.formContainer}>
                        <Grid container spacing={2}>
                            <Grid item lg={12}>
                                <TextField
                                    name="texto"
                                    multiline
                                    label="Comparte un anuncio"
                                    color="secondary"
                                    variant="filled"
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <div>
                                    <Input
                                        id="input-imagenurl"
                                        type="file"
                                        name="imagenUrl"
                                        disabled={isLoading}
                                        className={classes.inputs} />
                                </div>
                            </Grid>
                            <Grid item lg={6}>
                                <div style={{
                                    textAlign: 'end'
                                }}>
                                    <Typography style={{ fontWeight: 'bold' }}>Autor</Typography>
                                    <Typography>{inputs.autor}</Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    {
                        !isLoading ?
                            <>
                                <Button color="secondary" variant="contained" onClick={closeHandler}>
                                    Cancelar
                                </Button>
                                <Button color="primary" variant="contained" onClick={createPost}>
                                    Guardar
                                </Button>
                            </> :
                            <CircularProgress color="inherit" />
                    }

                </DialogActions>
            </Dialog>
        </>
    )
}

export default CreatePost
