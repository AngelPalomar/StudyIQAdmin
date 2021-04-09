import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Paper, Typography, TextField, Button, CircularProgress } from '@material-ui/core'
import { useStyles } from './useStyles'
import firebase from '../../database/firebase'

/**Componenet */
import PublicHeader from '../../components/PublicHeader'
import Snackbar from '../../components/CustomSnackbar'

/**Helpers */
import { emailValidation } from '../../helpers/validations'
import { get_error } from '../../helpers/errors_es_mx'

/**APIs */
import { login, getUserUniqueId } from '../../api/user'

function Login() {
    const classes = useStyles()

    //Inicia sesión
    let usuario = null
    let usuarioDoc = null

    //Estado para el loading
    const [isLoading, setIsLoading] = useState(false)

    //Estados que redirigen
    const [wasLogged, setWasLogged] = useState(false)

    //Estado para las credenciales
    const [inputs, setInputs] = useState({
        email: '',
        pin: ''
    })

    //Estado para las alertas
    const [openSnack, setOpenSnack] = useState(false)
    const [message, setMessage] = useState("")

    //Función qur guarda los datos en el estado
    const changeValues = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    //Función para uniciar sesión
    const loginUser = async (e) => {
        e.preventDefault()

        //Validaciones
        if (inputs.email === '' || inputs.pin === '') {
            setOpenSnack(true)
            setMessage('Todos los campos son requeridos')
            return
        }

        //Valida email
        if (!emailValidation(inputs.email)) {
            setOpenSnack(true)
            setMessage('Ingrese un correo válido')
            return
        }

        //Inicia carga
        setIsLoading(true)

        try {
            //Inicia sesión con credenciales
            usuario = await firebase.auth.signInWithEmailAndPassword(
                inputs.email,
                inputs.pin
            )

            //Busca su usuario en firebase
            usuarioDoc = await firebase.db.collection('usuarios')
                .where('authId', '==', `${usuario.user.uid}`)

            usuarioDoc.get().then(query => {
                query.forEach((doc => {
                    if (doc.exists) {
                        //Verifica que el usuario sea administrador y que esté activo
                        if (doc.data().tipoUsuario !== "Administrador") {
                            //Muestra mensaje de error
                            setIsLoading(false)
                            setOpenSnack(true)
                            setMessage("Usuario no disponible")
                        } else {
                            //Si no está activo
                            if (!doc.data().activo) {
                                //Muestra mensaje de error
                                setIsLoading(false)
                                setOpenSnack(true)
                                setMessage("Usuario no disponible")
                            } else {
                                //Guarda el auth id en el local storage
                                login(usuario.user.uid, usuario.user.email)

                                //Redirige al panel
                                setWasLogged(true)
                            }
                        }
                    } else {
                        //Muestra mensaje de error
                        setOpenSnack(true)
                        setMessage("Ocurrió un error.")
                    }
                }))
            })

        } catch (error) {
            //Para carga
            setIsLoading(false)

            //Muestra mensaje de error
            setOpenSnack(true)
            setMessage(get_error(error.code))
        }
    }

    if (getUserUniqueId()) {
        return <Redirect to="/admin" />
    }

    //Si se inició sesión, se envía al panel
    if (wasLogged) {
        return <Redirect to="/admin" />
    }

    return (
        <>
            <PublicHeader />
            <Snackbar open={openSnack} onClose={() => setOpenSnack(false)} severity="error">
                {message}
            </Snackbar>
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Typography className={classes.title}>Iniciar sesión</Typography>
                    <Typography>* Todos los campos son requeridos</Typography>
                    <form onSubmit={loginUser} onChange={changeValues} className={classes.formContainer}>
                        <TextField
                            name="email"
                            label="Correo electrónico"
                            variant="filled"
                            color="secondary"
                            className={classes.input} />
                        <TextField
                            name="pin"
                            type="password"
                            label="Contraseña"
                            variant="filled"
                            color="secondary"
                            className={classes.input} />
                        <div className={classes.buttonContainer}>
                            {
                                !isLoading ?
                                    <Button type="submit" variant="contained" color="primary">
                                        Ingresar
                                    </Button> :
                                    <CircularProgress color="secondary" />
                            }
                        </div>
                    </form>
                </Paper>
            </div>
        </>
    )
}

export default Login
