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

function Login() {
    const classes = useStyles()

    //Inicia sesión
    let usuario = null

    //Estado para el loading
    const [isLoading, setIsLoading] = useState(false)

    //Estados que redirigen
    const [wasLogged, setWasLogged] = useState(false)
    const [isLogin, setIsLogin] = useState(false)

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
    const login = async () => {

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

            //Redirige al panel
            setWasLogged(true)

        } catch (error) {
            //Para carga
            setIsLoading(false)

            //Muestra mensaje de error
            setOpenSnack(true)
            setMessage(get_error(error.code))
        }
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
                    <form onChange={changeValues} className={classes.formContainer}>
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
                                    <Button onClick={login} variant="contained" color="primary">
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
