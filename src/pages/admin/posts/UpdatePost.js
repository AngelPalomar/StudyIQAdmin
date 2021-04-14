import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import GoogleMap from 'google-map-react'
import {
    Grid, InputLabel, FormControlLabel, FormControl, TextField, Switch, Select, MenuItem,
    Typography, Button, CircularProgress, Input
} from '@material-ui/core'
import useStyles from './useStyles'
import firebase from '../../../database/firebase'

/**Componeneste */
import Snackbar from '../../../components/CustomSnackbar'
import Notification from '../../../components/CustomNotification'

/**Helpers */
import { minLengthValidation, emailValidation } from '../../../helpers/validations'
import { get_error } from '../../../helpers/errors_es_mx'

/**Icons */
import CloseIcon from '@material-ui/icons/Close'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import Marker from '../../../components/Marker'

function UpdatePost(props) {
    //Traigo el id de la URL
    const { match: { params: { id } } } = props
    //Obtengo el documento
    let postDoc = firebase.db.collection('publicaciones').doc(`${id}`)

    //estilos
    const classes = useStyles()

    const [inputs, setInputs] = useState([])
    const [openSnack, setOpenSnack] = useState(false)
    const [severity, setSeverity] = useState('')
    const [message, setMessage] = useState('')
    const [openNotification, setOpenNotification] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [uploadedImage, setUploadedImage] = useState(false)
    const [wasUpdated, setWasUpdated] = useState(false)
    const [notFound, setNotFound] = useState(false)

    //trae lista de paises y la info del usuario
    useEffect(() => {
        //Usuario
        postDoc.get().then((doc) => {
            if (doc.exists) {
                setInputs(doc.data())
            } else {
                //Redirige al principio si no encuentra
                setNotFound(true)
            }
        })
    }, [])

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

                //Inidca que se subió una nueva imagen
                setUploadedImage(true)
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

    //Función para subir usuario
    const updatePost = async () => {
        //Validaciones
        if (!minLengthValidation(3, inputs.texto)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("El texto debe tener al menos 3 caracteres.")
            return
        }

        //Inicia carga
        setIsLoading(true)

        try {
            /**
             * Si subió una nueva imagen, la sube al servidor, si no,
             * solo sube los inputs como estaban
             */
            if (uploadedImage) {
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
                    imagenUrl: urlImage,
                    editado: true
                }

                //Actualizamos el documento
                postDoc.update(postObj)
            } else {
                //Actualiza todos los datos cambiados
                //Solo cambia el texto, lo demás sigue igual
                postDoc.update({
                    ...inputs,
                    editado: true
                })
            }

            //Muestra mensaje de exito
            setOpenSnack(true)
            setSeverity('success')
            setMessage("Publicación editada correctamente")
            setTimeout(() => {
                //Redirige al menú
                setWasUpdated(true)
            }, 500);

        } catch (error) {
            //Para carga
            setIsLoading(false)

            setOpenSnack(true)
            setSeverity('error')
            setMessage(get_error(error.code()))
        }
    }

    //Función para eliminar el documento
    const deletePost = async () => {

        //Cierra noti
        setOpenNotification(false)

        //Inicia carga
        setIsLoading(true)

        try {
            //Elimina el documento
            postDoc.delete(id)

            //Muestra mensaje
            setOpenSnack(true)
            setSeverity('success')
            setMessage("Publicación eliminada correctamente")
            setTimeout(() => {
                setWasUpdated(true)
            }, 500);

        } catch (error) {
            setIsLoading(false)
            setOpenSnack(true)
            setSeverity('error')
            setMessage(get_error(error.code))
        }
    }

    //Si no encuentra doc
    if (notFound) {
        return <Redirect to="/admin/posts" />
    }

    //Si no se ha seleccionado ningun id
    if (inputs.length === 0) {
        return <CircularProgress color="secondary" />
    }

    //si ya fue actualizado
    if (wasUpdated) {
        return <Redirect to="/admin/posts" />
    }

    return (
        <>
            <Snackbar open={openSnack} onClose={() => setOpenSnack(false)} severity={severity}>
                {message}
            </Snackbar>
            <Notification
                open={openNotification}
                title="Eliminar publicación"
                onClose={() => setOpenNotification(false)}
                onAccept={deletePost}>
                <Typography>
                    ¿Estás seguro de querer eliminar este post?
                </Typography>
                <Typography>
                    Esta acción no se puede deshacer.
                </Typography>
            </Notification>
            <div className={classes.root}>
                <Typography style={{
                    fontSize: '26px',
                    textAlign: 'center',
                    marginBottom: 20
                }}>Modificar Publicación</Typography>
                <div>
                    <Typography
                        style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        AuthID: {inputs.authId}
                    </Typography>
                    <form id="form-post" onChange={changeValues} className={classes.formContainer}>
                        <Grid container spacing={2}>
                            <Grid item lg={12}>
                                <TextField
                                    name="texto"
                                    multiline
                                    label="Comparte un anuncio"
                                    color="secondary"
                                    variant="filled"
                                    defaultValue={inputs.texto}
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
                            <Grid item lg={3}>
                                <Button
                                    style={{ width: '100%' }}
                                    variant="contained"
                                    startIcon={<DeleteIcon />}
                                    disabled={isLoading}
                                    onClick={() => setOpenNotification(true)}>
                                    Eliminar publicación
                                </Button>
                            </Grid>
                            <Grid item lg={4}>
                                <img style={{ width: 100 }} src={inputs.imagenUrl} alt="imagen.jpg" />
                                <Typography>Sube una imagen para reemplazar la actual</Typography>
                            </Grid>
                            <Grid item lg={5}>
                                <Typography style={{ fontWeight: 'bold' }}>
                                    Fecha de publicación:
                                </Typography>
                                <Typography>
                                    {
                                        new Date(
                                            inputs.fecha.anio,
                                            inputs.fecha.mes,
                                            inputs.fecha.dia,
                                            inputs.fecha.hora,
                                            inputs.fecha.minuto,
                                        ).toString()
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <div>
                    {
                        !isLoading ?
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBlock: 20
                            }}>
                                <Link to={"/admin/posts"} className={classes.link}>
                                    <Button
                                        style={{ marginInline: 10 }}
                                        color="secondary"
                                        variant="contained"
                                        size="large"
                                        startIcon={<CloseIcon />}>
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button
                                    style={{ marginInline: 10 }}
                                    color="primary"
                                    variant="contained"
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    onClick={updatePost}>
                                    Guardar
                                </Button>
                            </div> :
                            <CircularProgress color="inherit" />
                    }

                </div>
            </div>
        </>
    )
}

export default UpdatePost
