import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import GoogleMap from 'google-map-react'
import {
    Grid, InputLabel, FormControlLabel, FormControl, TextField, Switch, Select, MenuItem,
    Typography, Button, CircularProgress
} from '@material-ui/core'
import useStyles from './useStyles'
import firebase from '../../../database/firebase'

/**Componeneste */
import Snackbar from '../../../components/CustomSnackbar'
import Notification from '../../../components/CustomNotification'

/**Helpers */
import { minLengthValidation, emailValidation } from '../../../helpers/validations'
import { get_error } from '../../../helpers/errors_es_mx'

/**APIs */
import { getPaises, getPaisByNombre } from '../../../api/paises'

/**Icons */
import CloseIcon from '@material-ui/icons/Close'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import Marker from '../../../components/Marker'

function UpdateUser(props) {
    //Traigo el id de la URL
    const { match: { params: { id } } } = props
    //Obtengo el documento
    let userDoc = firebase.db.collection('usuarios').doc(`${id}`)

    //estilos
    const classes = useStyles()

    const [paises, setPaises] = useState([])
    const [inputs, setInputs] = useState([])
    const [openSnack, setOpenSnack] = useState(false)
    const [severity, setSeverity] = useState('')
    const [message, setMessage] = useState('')
    const [openNotification, setOpenNotification] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [wasUpdated, setWasUpdated] = useState(false)
    const [notFound, setNotFound] = useState(false)

    //Estados para el mapa
    const [center, setCenter] = useState({
        lat: 0,
        lng: 0
    })

    //trae lista de paises y la info del usuario
    useEffect(() => {
        //Usuario
        userDoc.get().then((doc) => {
            if (doc.exists) {
                setInputs({
                    ...doc.data(),
                    oldEmail: doc.data().email,
                    oldPin: doc.data().pin,
                    pin: '',
                    pin2: ''
                })
            } else {
                //Redirige al principio si no encuentra
                setNotFound(true)
            }
        })

        //Paisis
        getPaises().then(response => {
            setPaises(response)
        })
    }, [])

    //Efecto que reacciona al pais seleccionado
    useEffect(() => {
        if (typeof inputs.pais !== "undefined") {
            getPaisByNombre(inputs.pais).then(response => {
                const { latlng } = response[0]
                setCenter({ ...center, lat: latlng[0], lng: latlng[1] })
            }).catch(() => {
                setOpenSnack(true)
                setSeverity('info')
                setMessage("País no encontrado")
                setCenter({ ...center, lat: 0, lng: 0 })
            })
        }
    }, [inputs.pais])

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

        //Si se ingresó un pin, valida la longitud
        if (inputs.pin.length > 0 || inputs.pin2.length > 0) {
            if (!minLengthValidation(8, inputs.pin)) {
                setOpenSnack(true)
                setSeverity('error')
                setMessage("El nuevo PIN debe contener al menos 8 caracteres")
                return
            }

            if (inputs.pin !== inputs.pin2) {
                setOpenSnack(true)
                setSeverity('error')
                setMessage("Los PIN deben coincidir")
                return
            }
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

        //Inicia carga
        setIsLoading(true)

        //Variable que guarda el nuevo objeto
        let newUserData = {
            nombres: inputs.nombres,
            apellidos: inputs.apellidos,
            email: inputs.email,
            tipoUsuario: inputs.tipoUsuario,
            gradoEscolar: inputs.gradoEscolar,
            //Si el pin está vacío, pone el viejo pin, de lo contrario, pone el nuevo
            pin: inputs.pin === "" ? inputs.oldPin : inputs.pin,
            pais: inputs.pais,
            activo: inputs.activo,
            lastModified: new Date()
        }

        //Actualiza los datos en Firestore
        try {
            //Inicia sesión con el usuario
            let usuarioAuth = await firebase.auth.signInWithEmailAndPassword(
                inputs.oldEmail,
                inputs.oldPin
            )

            //Actualiza el email, pin
            usuarioAuth.user.updateEmail(inputs.email)
            usuarioAuth.user.updatePassword(inputs.pin)

            //Actualiza documento
            userDoc.update(newUserData)

            //Muestra mensaje
            setOpenSnack(true)
            setSeverity('success')
            setMessage('Usuario modificado correctamente')
            setTimeout(() => {
                setWasUpdated(true)
            }, 1000);

        } catch (error) {
            setIsLoading(false)
            setOpenSnack(true)
            setSeverity('error')
            setMessage(get_error(error.code))
        }
    }

    //Función para eliminar el documento
    const deleteUser = async () => {

        //Cierra noti
        setOpenNotification(false)

        //Inicia carga
        setIsLoading(true)

        try {
            //Inicia sesión con el usuario
            let usuarioAuth = await firebase.auth.signInWithEmailAndPassword(
                inputs.oldEmail,
                inputs.oldPin
            )

            //Elimina el usuario
            usuarioAuth.user.delete()

            //Elimina el documento
            userDoc.delete(id)

            //Muestra mensaje
            setOpenSnack(true)
            setSeverity('success')
            setMessage("Usuario eliminado correctamente")
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
        return <Redirect to="/admin/usuarios" />
    }

    //Si no se ha seleccionado ningun id
    if (inputs.length === 0) {
        return <CircularProgress color="secondary" />
    }

    //si ya fue actualizado
    if (wasUpdated) {
        return <Redirect to="/admin/usuarios" />
    }

    return (
        <>
            <Snackbar open={openSnack} onClose={() => setOpenSnack(false)} severity={severity}>
                {message}
            </Snackbar>
            <Notification
                open={openNotification}
                title="Eliminar usuario"
                onClose={() => setOpenNotification(false)}
                onAccept={deleteUser}>
                <Typography>
                    ¿Estás seguro de querer eliminar a <span style={{ fontWeight: 'bold' }}>{inputs.email}</span>?
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
                }}>Modificar Usuario</Typography>
                <div>
                    <Typography
                        style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                        AuthID: {inputs.authId}
                    </Typography>
                    <form id="form-user" onChange={changeValues} className={classes.formContainer}>
                        <Grid container spacing={2}>
                            <Grid item lg={6}>
                                <TextField
                                    name="nombres"
                                    label="Nombres"
                                    color="secondary"
                                    variant="filled"
                                    defaultValue={inputs.nombres}
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <TextField
                                    name="apellidos"
                                    label="Apellidos"
                                    color="secondary"
                                    variant="filled"
                                    defaultValue={inputs.apellidos}
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={12}>
                                <TextField
                                    name="email"
                                    label="Correo electrónico"
                                    color="secondary"
                                    variant="filled"
                                    defaultValue={inputs.email}
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
                                    defaultValue={inputs.pin}
                                    disabled={isLoading}
                                    className={classes.inputs} />
                            </Grid>
                            <Grid item lg={6}>
                                <TextField
                                    name="pin2"
                                    type="password"
                                    label="Confirmar PIN"
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
                                        defaultValue={inputs.tipoUsuario}
                                        disabled={isLoading}
                                        onChange={changeValues}>
                                        <MenuItem value="Administrador">Administrador</MenuItem>
                                        <MenuItem value="Maestro">Maestro</MenuItem>
                                        <MenuItem value="Estudiante">Estudiante</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item lg={6}>
                                <FormControl className={classes.inputs} color="secondary" variant="filled">
                                    <InputLabel id="lblGrado">Grado Escolar</InputLabel>
                                    <Select
                                        name="gradoEscolar"
                                        labelId="lblGrado"
                                        defaultValue={inputs.gradoEscolar}
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
                                                defaultValue={inputs.pais}
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
                            <Grid item lg={3}>
                                <FormControlLabel
                                    label="Estado (Activo / Inactivo)"
                                    control={
                                        <Switch
                                            checked={inputs.activo}
                                            disabled={isLoading}
                                            onChange={changeValues} />
                                    } />
                            </Grid>
                            <Grid item lg={3}>
                                <Button
                                    style={{ width: '100%' }}
                                    variant="contained"
                                    startIcon={<DeleteIcon />}
                                    disabled={isLoading}
                                    onClick={() => setOpenNotification(true)}>
                                    Eliminar usuario
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
                                <Link to={"/admin/usuarios"} className={classes.link}>
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
                                    onClick={createUser}>
                                    Guardar
                                </Button>
                            </div> :
                            <CircularProgress color="inherit" />
                    }

                </div>
            </div>
            <div style={{
                height: '400px',
                width: '100%',
                marginBlock: 20
            }}>
                <GoogleMap
                    bootstrapURLKeys={{
                        key: 'AIzaSyDu9upVa3rGN8yO2jBaoj8ZvPIXXxqqMR0',
                        language: 'es',
                        region: 'mx',
                        libraries: ['places']
                    }}
                    draggable={true}
                    center={center}
                    defaultZoom={5}>
                    <Marker
                        lat={center.lat}
                        lng={center.lng} />
                </GoogleMap>
            </div>
        </>
    )
}

export default UpdateUser
