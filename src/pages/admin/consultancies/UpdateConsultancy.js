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

function UpdateConsultancy(props) {
    //Traigo el id de la URL
    const { match: { params: { id } } } = props
    //Obtengo el documento
    let consultDoc = firebase.db.collection('asesorias').doc(`${id}`)

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
    const [changedDate, setChangedDate] = useState(false)

    //trae lista de paises y la info del usuario
    useEffect(() => {
        //Usuario
        consultDoc.get().then((doc) => {
            if (doc.exists) {
                setInputs({
                    ...doc.data(),
                    fechaString: `${doc.data().inicia.anio}-${doc.data().inicia.mes}-${doc.data().inicia.dia}`
                })
            } else {
                //Redirige al principio si no encuentra
                setNotFound(true)
            }
        })
    }, [])

    //Función para guardar datos en el estado
    const changeValues = (e) => {
        if (e.target.type === 'date') {
            setInputs({
                ...inputs,
                fecha: new Date(e.target.value)
            })

            //Indica quie mobió la fecha
            setChangedDate(true)
        } else {
            setInputs({
                ...inputs,
                [e.target.name]: e.target.value
            })
        }
    }

    //Función para subir usuario
    const updateConsult = async () => {
        //Validaciones
        if (!minLengthValidation(3, inputs.titulo)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("El título debe tener al menos 3 caracteres.")
            return
        }

        if (!minLengthValidation(3, inputs.descripcion)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("La descripción debe tener al menos 3 caracteres.")
            return
        }

        if (!inputs.fecha) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("Seleccione una fecha")
            return
        }

        if (inputs.hora < 0 || inputs.hora > 23) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("Ingrese una hora válida (0 a 23 horas)")
            return
        }

        if (inputs.minuto < 0 || inputs.minuto > 59) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("Ingrese un minuto válido (0 a 59 minutos)")
            return
        }

        if (!emailValidation(inputs.alumno)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("Ingrese un correo válido para el alumno")
            return
        }

        if (!emailValidation(inputs.maestro)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("Ingrese un correo válido para el maestro")
            return
        }

        if (inputs.duracion < 0) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("Ingrese una duración en horas (mayor a cero)")
            return
        }

        //Inicia carga
        setIsLoading(true)

        try {
            //Si movió la fecha, se crea una nueva, de lo contrario se queda igual
            if (changedDate) {
                //crea un objeto con los nuevos datos con fecha
                let objConsul = {
                    titulo: inputs.titulo,
                    descripcion: inputs.descripcion,
                    fecha: inputs.fecha,
                    duracion: inputs.duracion,
                    maestro: inputs.maestro,
                    alumno: inputs.alumno,
                    estado: inputs.estado,
                    inicia: {
                        dia: String(inputs.fecha.getDate() + 1).padStart(2, '0'),
                        mes: String(inputs.fecha.getMonth() + 1).padStart(2, '0'),
                        anio: inputs.fecha.getFullYear().toString(),
                        hora: inputs.inicia.hora,
                        minuto: inputs.inicia.minuto
                    }
                }

                //Actualiza el documento
                consultDoc.update(objConsul)
            } else {
                //Crea nueva fecha desde el estring anterior
                let oldDate = new Date(inputs.fechaString)

                //crea un objeto con los nuevos datos Sin fecha
                let objConsul = {
                    titulo: inputs.titulo,
                    descripcion: inputs.descripcion,
                    fecha: oldDate,
                    duracion: inputs.duracion,
                    maestro: inputs.maestro,
                    alumno: inputs.alumno,
                    estado: inputs.estado,
                    inicia: {
                        dia: String(oldDate.getDate() + 1).padStart(2, '0'),
                        mes: String(oldDate.getMonth() + 1).padStart(2, '0'),
                        anio: oldDate.getFullYear().toString(),
                        hora: inputs.inicia.hora,
                        minuto: inputs.inicia.minuto
                    }
                }

                //Actualiza el documento
                consultDoc.update(objConsul)
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
            //setMessage(get_error(error.code()))
            setMessage(error.toString())
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
            consultDoc.delete(id)

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
        return <Redirect to="/admin/asesorias" />
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
                                    name="titulo"
                                    label="Título"
                                    color="secondary"
                                    variant="filled"
                                    defaultValue={inputs.titulo}
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={12}>
                                <TextField
                                    name="descripcion"
                                    label="Descripción"
                                    multiline
                                    color="secondary"
                                    variant="filled"
                                    defaultValue={inputs.descripcion}
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <Typography>Fecha del evento</Typography>
                                <Input
                                    name="fecha"
                                    type="date"
                                    defaultValue={inputs.fechaString}
                                    color="secondary"
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <Typography>Hora del evento</Typography>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <TextField
                                        name="hora"
                                        label="Hora"
                                        type="number"
                                        variant="filled"
                                        color="secondary"
                                        defaultValue={inputs.inicia.hora}
                                        disabled={isLoading} />
                                    <Typography style={{ marginInline: 10 }}>:</Typography>
                                    <TextField
                                        name="minuto"
                                        label="Minuto"
                                        type="number"
                                        variant="filled"
                                        color="secondary"
                                        defaultValue={inputs.inicia.minuto}
                                        disabled={isLoading} />
                                </div>
                            </Grid>
                            <Grid item lg={6}>
                                <TextField
                                    name="alumno"
                                    label="Alumno solicitante"
                                    color="secondary"
                                    variant="filled"
                                    defaultValue={inputs.alumno}
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <TextField
                                    name="maestro"
                                    label="Maestro solicitado"
                                    color="secondary"
                                    variant="filled"
                                    defaultValue={inputs.maestro}
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <TextField
                                    name="duracion"
                                    type="number"
                                    label="Duración (horas)"
                                    color="secondary"
                                    variant="filled"
                                    defaultValue={inputs.duracion}
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <FormControl className={classes.inputs} color="secondary" variant="filled">
                                    <InputLabel id="lblEstado">Estado</InputLabel>
                                    <Select
                                        name="estado"
                                        labelId="lblEstado"
                                        defaultValue={inputs.estado}
                                        disabled={isLoading}
                                        onChange={changeValues}>
                                        <MenuItem value="solicitada">Solicitada</MenuItem>
                                        <MenuItem value="aceptada">Aceptada</MenuItem>
                                        <MenuItem value="rechazada">Rechazada</MenuItem>
                                        <MenuItem value="cancelada">Cancelada</MenuItem>
                                        <MenuItem value="terminada">Terminada</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={3}>
                                <Button
                                    style={{ width: '100%' }}
                                    variant="contained"
                                    startIcon={<DeleteIcon />}
                                    disabled={isLoading}
                                    onClick={() => setOpenNotification(true)}>
                                    Eliminar asesoría
                                </Button>
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
                                <Link to={"/admin/asesorias"} className={classes.link}>
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
                                    onClick={updateConsult}>
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

export default UpdateConsultancy
