import React, { useState, useEffect } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputLabel,
    FormControlLabel, FormControl, TextField, Switch, Select, MenuItem,
    Typography, Button, CircularProgress
} from '@material-ui/core'
import useStyles from './useStyles'
import firebase from '../../../database/firebase'

/**Componeneste */
import Snackbar from '../../../components/CustomSnackbar'

/**Helpers */
import { minLengthValidation, emailValidation } from '../../../helpers/validations'
import { get_error } from '../../../helpers/errors_es_mx'

/**APIs */
import { getPaises } from '../../../api/paises'

function CreateUser(props) {
    const classes = useStyles()
    const { open, closeHandler } = props
    const [paises, setPaises] = useState([])
    const [inputs, setInputs] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        pin: '',
        tipoUsuario: '',
        gradoEscolar: '',
        pais: '',
        activo: false
    })
    const [openSnack, setOpenSnack] = useState(false)
    const [severity, setSeverity] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    //trae lista de paises
    useEffect(() => {
        getPaises().then(response => {
            setPaises(response)
        })
    }, [])

    //Función para guardar datos en el estado
    const changeValues = (e) => {
        if (e.target.type === 'checkbox') {
            setInputs({
                ...inputs,
                activo: e.target.checked
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
            nombres: '',
            apellidos: '',
            email: '',
            pin: '',
            tipoUsuario: '',
            gradoEscolar: '',
            pais: '',
            activo: false
        })
    }

    //Función para subir usuario
    const createUser = async () => {
        //Validaciones
        if (!minLengthValidation(3, inputs.nombres)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("El nombre debe tener al menos 3 caracteres.")
            return
        }

        if (!minLengthValidation(3, inputs.apellidos)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("El apellido debe tener al menos 3 caracteres.")
            return
        }

        if (!emailValidation(inputs.email)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("Ingrese un correo electrónico válido")
            return
        }

        if (!minLengthValidation(8, inputs.pin)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("El PIN debe tener al menos 8 caracteres")
            return
        }

        if (!minLengthValidation(1, inputs.tipoUsuario)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("Seleccione un tipo de usuario")
            return
        }

        if (!minLengthValidation(1, inputs.gradoEscolar)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("Seleccione un grado escolar")
            return
        }

        if (!minLengthValidation(1, inputs.pais)) {
            setOpenSnack(true)
            setSeverity('error')
            setMessage("Seleccione un pais")
            return
        }

        //Sube al servidor el usuario
        try {
            let usuarioAuth = null
            let docUsuario = null

            //Inicia carga
            setIsLoading(true)

            //Autenticación del usuario
            usuarioAuth = await firebase.auth.createUserWithEmailAndPassword(
                inputs.email,
                inputs.pin
            )

            //Enviamos correo
            await usuarioAuth.user
                .sendEmailVerification()
                .then(() => {
                    setOpenSnack(true)
                    setSeverity('success')
                    setMessage('Usuario creado. Correo de verificación enviado.')
                })

            //Creamos usaurio
            docUsuario = await firebase.db
                .collection('usuarios')
                .add({
                    ...inputs,
                    authId: usuarioAuth.user.uid
                })

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
            setMessage(get_error(error.code))
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
                <DialogTitle>Crear Usuario</DialogTitle>
                <DialogContent>
                    <Typography>* Todos los campos son requeridos</Typography>
                    <form id="form-user" onChange={changeValues} className={classes.formContainer}>
                        <Grid container spacing={2}>
                            <Grid item lg={6}>
                                <TextField
                                    name="nombres"
                                    label="Nombres"
                                    color="secondary"
                                    variant="filled"
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <TextField
                                    name="apellidos"
                                    label="Apellidos"
                                    color="secondary"
                                    variant="filled"
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <TextField
                                    name="email"
                                    label="Correo electrónico"
                                    color="secondary"
                                    variant="filled"
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <TextField
                                    name="pin"
                                    type="password"
                                    label="PIN"
                                    color="secondary"
                                    variant="filled"
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <FormControl className={classes.inputs} color="secondary" variant="filled">
                                    <InputLabel id="lblTipoUsr">Tipo de usuario</InputLabel>
                                    <Select
                                        name="tipoUsuario"
                                        labelId="lblTipoUsr"
                                        disabled={isLoading}
                                        onChange={changeValues}>
                                        <MenuItem value="Administrador">Administrador</MenuItem>
                                        <MenuItem value="Maestro">Maestro</MenuItem>
                                        <MenuItem value="Alumno">Alumno</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={6}>
                                <FormControl className={classes.inputs} color="secondary" variant="filled">
                                    <InputLabel id="lblGrado">Grado Escolar</InputLabel>
                                    <Select
                                        name="gradoEscolar"
                                        labelId="lblGrado"
                                        disabled={isLoading}
                                        onChange={changeValues}>
                                        <MenuItem value="Primaria">Primaria</MenuItem>
                                        <MenuItem value="Secundaria">Secundaria</MenuItem>
                                        <MenuItem value="Preparatoria">Preparatoria</MenuItem>
                                        <MenuItem value="Universidad">Universidad</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={6}>
                                {
                                    paises.length > 0 ?
                                        <FormControl className={classes.inputs} color="secondary" variant="filled">
                                            <InputLabel id="lblPais">País</InputLabel>
                                            <Select
                                                name="pais"
                                                labelId="lblPais"
                                                disabled={isLoading}
                                                onChange={changeValues}>
                                                {
                                                    paises.map((value, index) => (
                                                        <MenuItem value={value.name} key={index}>{value.name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl> :
                                        <CircularProgress />
                                }
                            </Grid>
                            <Grid item lg={6}>
                                <FormControlLabel
                                    label="Estado (Activo / Inactivo)"
                                    control={
                                        <Switch
                                            checked={inputs.activo}
                                            disabled={isLoading}
                                            onChange={changeValues} />
                                    } />
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
                                <Button color="primary" variant="contained" onClick={createUser}>
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

export default CreateUser
