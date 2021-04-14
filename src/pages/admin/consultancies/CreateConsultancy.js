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
import { emailValidation, minLengthValidation } from '../../../helpers/validations'
import { get_error } from '../../../helpers/errors_es_mx'

function CreateConsultancy(props) {
    const classes = useStyles()
    const { open, closeHandler } = props
    const [inputs, setInputs] = useState({
        titulo: '',
        descripcion: '',
        fecha: null,
        duracion: -1,
        hora: -1,
        minuto: -1,
        maestro: '',
        alumno: '',
        estado: 'solicitada'
    })

    const [openSnack, setOpenSnack] = useState(false)
    const [severity, setSeverity] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    //Función para guardar datos en el estado
    const changeValues = (e) => {
        if (e.target.type === 'date') {
            setInputs({
                ...inputs,
                fecha: new Date(e.target.value)
            })
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
            titulo: '',
            descripcion: '',
            fecha: '',
            duracion: -1,
            hora: -1,
            minuto: -1,
            maestro: '',
            alumno: '',
            estado: 'solicitada'
        })
    }

    //Función para subir usuario
    const createConsult = async () => {
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

        //Sube al servidor la aseosria
        try {
            const docConsult = await firebase.db
                .collection('asesorias')
                .add({
                    ...inputs,
                    inicia: {
                        dia: String(inputs.fecha.getDate() + 1).padStart(2, '0'),
                        mes: String(inputs.fecha.getMonth() + 1).padStart(2, '0'),
                        anio: inputs.fecha.getFullYear().toString(),
                        hora: inputs.fecha.getHours().toString(),
                        minuto: inputs.fecha.getMinutes().toString()
                    }
                })

            //Muestra mensaje de completado
            setOpenSnack(true)
            setSeverity('success')
            setMessage("Solicitud de asesoría creada correctamente")

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
                <DialogTitle>Crear Asesoría</DialogTitle>
                <DialogContent>
                    <Typography>* Todos los campos son requeridos</Typography>
                    <form id="form-post" onChange={changeValues} className={classes.formContainer}>
                        <Grid container spacing={2}>
                            <Grid item lg={12}>
                                <TextField
                                    name="titulo"
                                    label="Título"
                                    color="secondary"
                                    variant="filled"
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
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <Typography>Fecha del evento</Typography>
                                <Input
                                    name="fecha"
                                    type="date"
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
                                        disabled={isLoading} />
                                    <Typography style={{ marginInline: 10 }}>:</Typography>
                                    <TextField
                                        name="minuto"
                                        label="Minuto"
                                        type="number"
                                        variant="filled"
                                        color="secondary"
                                        disabled={isLoading} />
                                </div>
                            </Grid>
                            <Grid item lg={6}>
                                <TextField
                                    name="alumno"
                                    label="Alumno solicitante"
                                    color="secondary"
                                    variant="filled"
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <TextField
                                    name="maestro"
                                    label="Maestro solicitado"
                                    color="secondary"
                                    variant="filled"
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
                                    disabled={isLoading}
                                    className={classes.inputs} />
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
                                <Button color="primary" variant="contained" onClick={createConsult}>
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

export default CreateConsultancy
